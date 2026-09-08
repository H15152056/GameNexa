import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
} from '../src/seoConfig.js'

/*
 * NOTE: SITE_URL / SITE_NAME / DEFAULT_TITLE / DEFAULT_DESCRIPTION are
 * imported from src/seoConfig.js so the build-time pre-rendered SEO
 * and runtime SEO stay synchronized.
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT, 'dist')
const SOURCE_FILE = path.join(ROOT, 'src', 'data', 'gamesData.js')

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function cleanText(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(value = '') {
  return cleanText(value)
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function absoluteUrl(route = '/') {
  if (!route || route === '/') {
    return SITE_URL
  }

  return `${SITE_URL}${route.startsWith('/') ? route : `/${route}`}`
}

/*
 * ------------------------------------------------------------
 * STRING PARSER
 * ------------------------------------------------------------
 */

function extractString(source, key) {
  const patterns = [
    new RegExp(
      `\\b${key}\\s*:\\s*(['"])([\\s\\S]*?)\\1`,
    ),
    new RegExp(
      `\\b${key}\\s*:\\s*\`([\\s\\S]*?)\``,
    ),
  ]

  for (const regex of patterns) {
    const match = source.match(regex)

    if (match) {
      return cleanText(match[match.length - 1])
    }
  }

  return ''
}

/*
 * ------------------------------------------------------------
 * BALANCED BLOCK FINDER
 * ------------------------------------------------------------
 */

function findBlock(source, key, openChar, closeChar) {
  const keyRegex = new RegExp(
    `\\b${key}\\s*:\\s*\\${openChar}`,
  )

  const match = source.match(keyRegex)

  if (!match || match.index === undefined) {
    return ''
  }

  const start = source.indexOf(
    openChar,
    match.index,
  )

  if (start === -1) {
    return ''
  }

  let depth = 0
  let inString = false
  let stringChar = ''
  let escaped = false

  for (let i = start; i < source.length; i++) {
    const char = source[i]

    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === stringChar) {
        inString = false
      }

      continue
    }

    if (
      char === "'" ||
      char === '"' ||
      char === '`'
    ) {
      inString = true
      stringChar = char
      continue
    }

    if (char === openChar) {
      depth++
      continue
    }

    if (char === closeChar) {
      depth--

      if (depth === 0) {
        return source.slice(start, i + 1)
      }
    }
  }

  return ''
}

/*
 * ------------------------------------------------------------
 * TOP-LEVEL GAME OBJECTS
 * ------------------------------------------------------------
 */

function extractGameEntries(source) {
  const results = []

  const gamesStart =
    source.indexOf('export const gamesData')

  if (gamesStart === -1) {
    return results
  }

  const objectStart =
    source.indexOf('{', gamesStart)

  if (objectStart === -1) {
    return results
  }

  let depth = 0
  let inString = false
  let stringChar = ''
  let escaped = false
  let keyStart = -1

  for (
    let i = objectStart + 1;
    i < source.length;
    i++
  ) {
    const char = source[i]

    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === stringChar) {
        inString = false
      }

      continue
    }

    if (
      char === "'" ||
      char === '"' ||
      char === '`'
    ) {
      inString = true
      stringChar = char
      continue
    }

    if (depth === 0) {
      if (/[A-Za-z0-9_$]/.test(char)) {
        if (keyStart === -1) {
          keyStart = i
        }
      }

      if (keyStart !== -1 && char === ':') {
        const key = source
          .slice(keyStart, i)
          .trim()

        let valueStart = i + 1

        while (
          valueStart < source.length &&
          /\s/.test(source[valueStart])
        ) {
          valueStart++
        }

        if (source[valueStart] === '{') {
          let objectDepth = 0
          let objectString = false
          let objectStringChar = ''
          let objectEscaped = false

          for (
            let j = valueStart;
            j < source.length;
            j++
          ) {
            const c = source[j]

            if (objectString) {
              if (objectEscaped) {
                objectEscaped = false
                continue
              }

              if (c === '\\') {
                objectEscaped = true
                continue
              }

              if (c === objectStringChar) {
                objectString = false
              }

              continue
            }

            if (
              c === "'" ||
              c === '"' ||
              c === '`'
            ) {
              objectString = true
              objectStringChar = c
              continue
            }

            if (c === '{') {
              objectDepth++
            }

            if (c === '}') {
              objectDepth--

              if (objectDepth === 0) {
                results.push({
                  key,
                  source: source.slice(
                    valueStart,
                    j + 1,
                  ),
                })

                i = j
                keyStart = -1
                break
              }
            }
          }
        }

        keyStart = -1
      }
    }

    if (char === '{') {
      depth++
    } else if (char === '}') {
      depth--

      if (depth < 0) {
        break
      }
    }
  }

  return results
}

/*
 * ------------------------------------------------------------
 * ARRAY OBJECT EXTRACTION
 * ------------------------------------------------------------
 */

function extractObjectsFromArray(arraySource) {
  const objects = []

  if (!arraySource) {
    return objects
  }

  let depth = 0
  let objectStart = -1
  let inString = false
  let stringChar = ''
  let escaped = false

  for (
    let i = 0;
    i < arraySource.length;
    i++
  ) {
    const char = arraySource[i]

    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === stringChar) {
        inString = false
      }

      continue
    }

    if (
      char === "'" ||
      char === '"' ||
      char === '`'
    ) {
      inString = true
      stringChar = char
      continue
    }

    if (char === '{') {
      if (depth === 0) {
        objectStart = i
      }

      depth++
      continue
    }

    if (char === '}') {
      depth--

      if (
        depth === 0 &&
        objectStart !== -1
      ) {
        objects.push(
          arraySource.slice(
            objectStart,
            i + 1,
          ),
        )

        objectStart = -1
      }
    }
  }

  return objects
}

/*
 * ------------------------------------------------------------
 * ARTICLE PARSER
 * ------------------------------------------------------------
 */

function parseArticles(
  gameSource,
  arrayName,
  gameName,
  fallbackImage,
) {
  const results = []

  const arraySource =
    findBlock(
      gameSource,
      arrayName,
      '[',
      ']',
    )

  if (!arraySource) {
    return results
  }

  const objects =
    extractObjectsFromArray(
      arraySource,
    )

  for (const objectSource of objects) {
    const title =
      extractString(
        objectSource,
        'title',
      )

    const explicitSlug =
      extractString(
        objectSource,
        'slug',
      )

    const id =
      extractString(
        objectSource,
        'id',
      )

    const slug =
      explicitSlug ||
      id ||
      slugify(title)

    if (!title || !slug) {
      continue
    }

    const description =
      extractString(
        objectSource,
        'description',
      ) ||
      extractString(
        objectSource,
        'excerpt',
      ) ||
      `Latest ${gameName} ${arrayName} on GameNexa.`

    const image =
      extractString(
        objectSource,
        'image',
      ) ||
      fallbackImage

    results.push({
      slug,
      title,
      description,
      image,
    })
  }

  return results
}

/*
 * ------------------------------------------------------------
 * GAME PARSER
 * ------------------------------------------------------------
 */

function parseGame(source, key) {
  const slug =
    extractString(
      source,
      'slug',
    ) ||
    slugify(key)

  const name =
    extractString(
      source,
      'name',
    ) ||
    key

  const category =
    extractString(
      source,
      'category',
    )

  const description =
    extractString(
      source,
      'description',
    ) ||
    `Latest ${name} news, characters, events and guides.`

  const image =
    extractString(
      source,
      'image',
    )

  const news =
    parseArticles(
      source,
      'news',
      name,
      image,
    )

  const guides =
    parseArticles(
      source,
      'guides',
      name,
      image,
    )

  return {
    slug,
    name,
    category,
    description,
    image,
    news,
    guides,
  }
}

/*
 * ------------------------------------------------------------
 * LOAD GAMES
 * ------------------------------------------------------------
 */

function loadGamesData() {
  console.log(
    '[generate-seo] Loading GameNexa data...',
  )

  if (!fs.existsSync(SOURCE_FILE)) {
    throw new Error(
      `Could not find gamesData.js at: ${SOURCE_FILE}`,
    )
  }

  const source =
    fs.readFileSync(
      SOURCE_FILE,
      'utf8',
    )

  const entries =
    extractGameEntries(source)

  if (!entries.length) {
    throw new Error(
      'Could not find any game entries inside gamesData.js.',
    )
  }

  const games = {}

  for (const entry of entries) {
    games[entry.key] =
      parseGame(
        entry.source,
        entry.key,
      )
  }

  for (const game of Object.values(games)) {
    console.log(
      `[generate-seo] ${game.name}: ${game.news.length} news, ${game.guides.length} guides`,
    )
  }

  console.log(
    `[generate-seo] Found ${Object.keys(games).length} games.`,
  )

  return games
}

/*
 * ------------------------------------------------------------
 * ROUTES
 * ------------------------------------------------------------
 */

function createRoutes(games) {
  const routes = [
    {
      path: '/',
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      image: '/og-default.png',
    },
  ]

  for (const game of Object.values(games)) {
    if (!game?.slug) {
      continue
    }

    routes.push({
      path: `/game/${game.slug}`,
      title: `${game.name} - GameNexa`,
      description: game.description,
      image: game.image,
    })

    for (const article of game.news || []) {
      routes.push({
        path:
          `/game/${game.slug}/news/${article.slug}`,
        title:
          `${article.title} - ${game.name} - GameNexa`,
        description: article.description,
        image:
          article.image ||
          game.image,
      })
    }

    for (const guide of game.guides || []) {
      routes.push({
        path:
          `/game/${game.slug}/guides/${guide.slug}`,
        title:
          `${guide.title} - ${game.name} - GameNexa`,
        description: guide.description,
        image:
          guide.image ||
          game.image,
      })
    }
  }

  return routes
}

/*
 * ------------------------------------------------------------
 * VITE ASSET RESOLUTION
 * ------------------------------------------------------------
 */

function findBuiltAsset(image) {
  if (!image) {
    return ''
  }

  if (
    /^https?:\/\//i.test(image)
  ) {
    return image
  }

  const assetsDir =
    path.join(
      DIST_DIR,
      'assets',
    )

  if (
    !fs.existsSync(
      assetsDir,
    )
  ) {
    return absoluteUrl(image)
  }

  const filename =
    path.basename(image)

  const exactPath =
    path.join(
      assetsDir,
      filename,
    )

  if (
    fs.existsSync(
      exactPath,
    )
  ) {
    return absoluteUrl(
      `/assets/${filename}`,
    )
  }

  const extension =
    path.extname(filename)

  const base =
    path.basename(
      filename,
      extension,
    )

  const files =
    fs.readdirSync(
      assetsDir,
    )

  const match =
    files.find(
      (file) =>
        file.startsWith(
          `${base}-`,
        ) &&
        file.endsWith(
          extension,
        ),
    )

  if (match) {
    return absoluteUrl(
      `/assets/${match}`,
    )
  }

  return absoluteUrl(image)
}

/*
 * ------------------------------------------------------------
 * HTML SEO
 *
 * IMPORTANT:
 * The source index.html contains fallback SEO tags.
 * We remove all route-specific OG/Twitter/canonical tags first,
 * then insert exactly one clean set for the current route.
 * ------------------------------------------------------------
 */

function renderHtml(
  template,
  route,
) {
  const title =
    route.title ||
    DEFAULT_TITLE

  const description =
    route.description ||
    DEFAULT_DESCRIPTION

  const canonical =
    absoluteUrl(
      route.path,
    )

  const image =
    findBuiltAsset(
      route.image,
    )

  let html = template

  /*
   * Remove existing canonical tag.
   */
  html = html.replace(
    /<link\s+rel=["']canonical["'][^>]*>\s*/gi,
    '',
  )

  /*
   * Remove existing Open Graph tags.
   */
  html = html.replace(
    /<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi,
    '',
  )

  /*
   * Remove existing Twitter tags.
   */
  html = html.replace(
    /<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi,
    '',
  )

  /*
   * Remove existing title and replace it.
   */
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`,
  )

  /*
   * Replace description.
   */
  html = html.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(description)}">`,
  )

  /*
   * Canonical.
   */
  const canonicalTag = `
    <link
      rel="canonical"
      href="${escapeHtml(canonical)}"
    />
  `

  /*
   * Open Graph.
   */
  const openGraphTags = `
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta
      property="og:title"
      content="${escapeHtml(title)}"
    />
    <meta
      property="og:description"
      content="${escapeHtml(description)}"
    />
    <meta
      property="og:url"
      content="${escapeHtml(canonical)}"
    />
    ${
      image
        ? `
    <meta
      property="og:image"
      content="${escapeHtml(image)}"
    />
    <meta
      property="og:image:alt"
      content="${escapeHtml(title)}"
    />`
        : ''
    }
  `

  /*
   * Twitter.
   */
  const twitterTags = `
    <!-- Twitter -->
    <meta
      name="twitter:card"
      content="summary_large_image"
    />
    <meta
      name="twitter:site"
      content="@gamenexa"
    />
    <meta
      name="twitter:title"
      content="${escapeHtml(title)}"
    />
    <meta
      name="twitter:description"
      content="${escapeHtml(description)}"
    />
    ${
      image
        ? `
    <meta
      name="twitter:image"
      content="${escapeHtml(image)}"
    />`
        : ''
    }
  `

  /*
   * Insert the clean SEO set exactly once.
   */
  html = html.replace(
    /<\/head>/i,
    `${canonicalTag}
${openGraphTags}
${twitterTags}
</head>`,
  )

  return html
}

/*
 * ------------------------------------------------------------
 * WRITE PRE-RENDERED ROUTE
 * ------------------------------------------------------------
 */

function writeRoute(
  template,
  route,
) {
  const relativePath =
    route.path === '/'
      ? ''
      : route.path.replace(
          /^\/+/,
          '',
        )

  const outputDirectory =
    path.join(
      DIST_DIR,
      relativePath,
    )

  fs.mkdirSync(
    outputDirectory,
    {
      recursive: true,
    },
  )

  const outputFile =
    path.join(
      outputDirectory,
      'index.html',
    )

  fs.writeFileSync(
    outputFile,
    renderHtml(
      template,
      route,
    ),
    'utf8',
  )
}

/*
 * ------------------------------------------------------------
 * SITEMAP
 * ------------------------------------------------------------
 */

function generateSitemap(
  routes,
) {
  const entries =
    routes
      .map(
        (route) => `  <url>
    <loc>${escapeXml(absoluteUrl(route.path))}</loc>
  </url>`,
      )
      .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`
}

/*
 * ------------------------------------------------------------
 * MAIN
 * ------------------------------------------------------------
 */

function main() {
  if (
    !fs.existsSync(
      DIST_DIR,
    )
  ) {
    throw new Error(
      'dist folder does not exist. Vite build must run first.',
    )
  }

  const templateFile =
    path.join(
      DIST_DIR,
      'index.html',
    )

  if (
    !fs.existsSync(
      templateFile,
    )
  ) {
    throw new Error(
      'dist/index.html does not exist.',
    )
  }

  const template =
    fs.readFileSync(
      templateFile,
      'utf8',
    )

  const games =
    loadGamesData()

  const routes =
    createRoutes(
      games,
    )

  /*
   * Remove duplicate URLs.
   */

  const uniqueRoutes = []

  const seen =
    new Set()

  for (const route of routes) {
    if (
      seen.has(
        route.path,
      )
    ) {
      continue
    }

    seen.add(
      route.path,
    )

    uniqueRoutes.push(
      route,
    )
  }

  /*
   * Generate HTML for every route.
   */

  for (const route of uniqueRoutes) {
    writeRoute(
      template,
      route,
    )
  }

  /*
   * Generate sitemap.
   */

  const sitemap =
    generateSitemap(
      uniqueRoutes,
    )

  fs.writeFileSync(
    path.join(
      DIST_DIR,
      'sitemap.xml',
    ),
    sitemap,
    'utf8',
  )

  console.log(
    `[generate-seo] Pre-rendered ${uniqueRoutes.length} routes and generated sitemap.xml`,
  )

  console.log(
    '[generate-seo] SEO generation completed successfully.',
  )
}

try {
  main()
} catch (error) {
  console.error(
    '[generate-seo] SEO generation failed.',
  )

  console.error(error)

  process.exit(1)
}