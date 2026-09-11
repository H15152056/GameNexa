/*
 * Guides store their content as an array of sections, each with a
 * `paragraphs` array of plain strings (see src/cms/cmsContent.js and
 * src/pages/GuidePage.jsx). To keep that simple, backward-compatible
 * data shape working, a "video paragraph" is just a normal string that
 * starts with the VIDEO_PREFIX below, followed by a YouTube or Vimeo
 * URL. Everything else about paragraphs (add/edit/delete/reorder in
 * the CMS, storage in D1) is completely unchanged.
 *
 * Example paragraph value: "[video]https://www.youtube.com/watch?v=abc123"
 */

export const VIDEO_PREFIX = '[video]'

export function isVideoParagraph(paragraph) {
  return (
    typeof paragraph === 'string' &&
    paragraph.trim().startsWith(VIDEO_PREFIX)
  )
}

export function getVideoUrlFromParagraph(paragraph) {
  if (!isVideoParagraph(paragraph)) {
    return ''
  }

  return paragraph
    .trim()
    .slice(VIDEO_PREFIX.length)
    .trim()
}

/*
 * Converts a YouTube or Vimeo URL (in any common format a user might
 * paste) into an embeddable iframe URL. Returns '' if the URL isn't a
 * recognized YouTube/Vimeo link, so callers can fall back to a plain
 * link instead of rendering a broken iframe.
 */
export function toEmbedUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return ''
  }

  let url

  try {
    url = new URL(rawUrl.trim())
  } catch {
    return ''
  }

  const host = url.hostname.replace(/^www\./, '')

  // YouTube: watch?v=ID, youtu.be/ID, shorts/ID, already-embed URLs
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      const id = url.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : ''
    }

    if (url.pathname.startsWith('/embed/')) {
      return `https://www.youtube.com${url.pathname}`
    }

    if (url.pathname.startsWith('/shorts/')) {
      const id = url.pathname.split('/')[2]
      return id ? `https://www.youtube.com/embed/${id}` : ''
    }

    return ''
  }

  if (host === 'youtu.be') {
    const id = url.pathname.split('/')[1]
    return id ? `https://www.youtube.com/embed/${id}` : ''
  }

  // Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
  if (host === 'vimeo.com') {
    const id = url.pathname.split('/').filter(Boolean)[0]
    return id ? `https://player.vimeo.com/video/${id}` : ''
  }

  if (host === 'player.vimeo.com') {
    return url.pathname.startsWith('/video/')
      ? `https://player.vimeo.com${url.pathname}`
      : ''
  }

  return ''
}
