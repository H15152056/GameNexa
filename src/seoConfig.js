// ============================================================
// CENTRAL SEO CONFIG
// ============================================================

export const SITE_URL = 'https://gamenexa.gamenexa.workers.dev'
export const SITE_NAME = 'GameNexa'
export const SITE_TWITTER = '@gamenexa'

export const DEFAULT_TITLE =
  'GameNexa — Genshin Impact & Whiteout Survival Guides'

export const DEFAULT_DESCRIPTION =
  'GameNexa is a focused database for Genshin Impact and Whiteout Survival, with characters, heroes and practical guides.'

export const DEFAULT_IMAGE = '/og-default.png'

export function absoluteUrl(path = '/') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${cleanPath}`
}

export function absoluteImage(image) {
  if (!image) return absoluteUrl(DEFAULT_IMAGE)
  return image.startsWith('http') ? image : absoluteUrl(image)
}
