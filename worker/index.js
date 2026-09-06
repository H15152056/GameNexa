const COOKIE_NAME = 'gamenexa_admin'
const SESSION_TTL = 86400 // 24 hours

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}

function base64Url(bytes) {
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64UrlToBytes(value) {
  const padded = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')

  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

async function createSignature(secret, expires) {
  const encoder = new TextEncoder()

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`gamenexa:${expires}`)
  )

  return base64Url(new Uint8Array(signature))
}

async function isAuthorized(request, env) {
  if (!env.ADMIN_PASSWORD) {
    return false
  }

  const cookieHeader = request.headers.get('Cookie') || ''

  const match = cookieHeader.match(
    new RegExp(`${COOKIE_NAME}=([^;]+)`)
  )

  if (!match) {
    return false
  }

  const session = match[1]
  const parts = session.split('.')

  if (parts.length !== 2) {
    return false
  }

  const expires = Number(parts[0])
  const signature = parts[1]

  if (!Number.isFinite(expires)) {
    return false
  }

  if (Math.floor(Date.now() / 1000) > expires) {
    return false
  }

  const expectedSignature = await createSignature(
    env.ADMIN_PASSWORD,
    expires
  )

  return signature === expectedSignature
}

function adminCookie(value, maxAge = SESSION_TTL) {
  return [
    `${COOKIE_NAME}=${value}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${maxAge}`,
  ].join('; ')
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // ==========================================
    // PUBLIC CONTENT API
    // ==========================================

    if (
      url.pathname === '/api/content' &&
      request.method === 'GET'
    ) {
      try {
        const result = await env.DB
          .prepare(
            'SELECT content_key, content_value FROM site_content ORDER BY content_key'
          )
          .all()

        return json(result.results || [])
      } catch (error) {
        return json(
          { error: error.message || 'Database error' },
          500
        )
      }
    }

    // ==========================================
    // ADMIN LOGIN
    // ==========================================

    if (
      url.pathname === '/api/admin/login' &&
      request.method === 'POST'
    ) {
      try {
        const body = await request.json()

        if (
          !body.password ||
          !env.ADMIN_PASSWORD ||
          body.password !== env.ADMIN_PASSWORD
        ) {
          return json(
            { error: 'Invalid password' },
            401
          )
        }

        const expires =
          Math.floor(Date.now() / 1000) + SESSION_TTL

        const signature = await createSignature(
          env.ADMIN_PASSWORD,
          expires
        )

        const session = `${expires}.${signature}`

        return new Response(
          JSON.stringify({ success: true }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
              'Set-Cookie': adminCookie(session),
            },
          }
        )
      } catch {
        return json(
          { error: 'Invalid request' },
          400
        )
      }
    }

    // ==========================================
    // ADMIN LOGOUT
    // ==========================================

    if (
      url.pathname === '/api/admin/logout' &&
      request.method === 'POST'
    ) {
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Set-Cookie': adminCookie('', 0),
          },
        }
      )
    }

    // ==========================================
    // CHECK ADMIN SESSION
    // ==========================================

    if (
      url.pathname === '/api/admin/check' &&
      request.method === 'GET'
    ) {
      const authorized = await isAuthorized(request, env)

      return json({
        authenticated: authorized,
      })
    }

    // ==========================================
    // SAVE CONTENT
    // ==========================================

    if (
      url.pathname === '/api/admin/content' &&
      request.method === 'POST'
    ) {
      if (!(await isAuthorized(request, env))) {
        return json(
          { error: 'Unauthorized' },
          401
        )
      }

      try {
        const body = await request.json()

        if (
          !body.key ||
          typeof body.value !== 'string'
        ) {
          return json(
            { error: 'Invalid content data' },
            400
          )
        }

        await env.DB
          .prepare(`
            INSERT INTO site_content
              (content_key, content_value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)

            ON CONFLICT(content_key)
            DO UPDATE SET
              content_value = excluded.content_value,
              updated_at = CURRENT_TIMESTAMP
          `)
          .bind(body.key, body.value)
          .run()

        return json({
          success: true,
        })
      } catch (error) {
        return json(
          {
            error:
              error.message ||
              'Failed to save content',
          },
          500
        )
      }
    }

    // ==========================================
    // DELETE CONTENT
    // ==========================================

    if (
      url.pathname === '/api/admin/content' &&
      request.method === 'DELETE'
    ) {
      if (!(await isAuthorized(request, env))) {
        return json(
          { error: 'Unauthorized' },
          401
        )
      }

      const key = url.searchParams.get('key')

      if (!key) {
        return json(
          { error: 'Missing key' },
          400
        )
      }

      try {
        await env.DB
          .prepare(
            'DELETE FROM site_content WHERE content_key = ?'
          )
          .bind(key)
          .run()

        return json({
          success: true,
        })
      } catch (error) {
        return json(
          {
            error:
              error.message ||
              'Failed to delete content',
          },
          500
        )
      }
    }

    // ==========================================
    // SERVE REACT WEBSITE
    // ==========================================

    return env.ASSETS.fetch(request)
  },
}