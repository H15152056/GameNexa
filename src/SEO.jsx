import { useEffect } from 'react'
import {
  SITE_NAME,
  SITE_TWITTER,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  absoluteUrl,
  absoluteImage,
} from './seoConfig'

function setMeta(name, content) {
  if (!content) return

  let tag = document.head.querySelector(`meta[name="${name}"]`)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

function setProperty(property, content) {
  if (!content) return

  let tag = document.head.querySelector(`meta[property="${property}"]`)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

function removeProperty(property) {
  const tag = document.head.querySelector(`meta[property="${property}"]`)
  if (tag) tag.remove()
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]')

  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }

  link.setAttribute('href', url)
}

function setJsonLd(id, data) {
  let script = document.head.querySelector(`script[data-seo-jsonld="${id}"]`)

  if (!data) {
    if (script) script.remove()
    return
  }

  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-jsonld', id)
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify(data)
}

/**
 * Drop-in SEO component. Mount once per page/route with the
 * props relevant to that page.
 *
 * title           - page title (falls back to site default)
 * description     - meta description (falls back to site default)
 * path            - route path, e.g. "/game/genshin" (used for canonical + og:url)
 * image           - absolute or root-relative image path for OG/Twitter
 * type            - og:type, e.g. "website", "article", "game"
 * noindex         - true to add noindex,nofollow (404 pages, search/filter states, etc.)
 * publishedTime   - ISO date string, adds article:published_time (article pages only)
 * author          - adds article:author (article pages only)
 * jsonLd          - object or array of objects to render as JSON-LD <script> tag(s)
 */
export function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
  author,
  jsonLd,
}) {
  useEffect(() => {
    const canonicalUrl = absoluteUrl(path)
    const imageUrl = absoluteImage(image)

    document.title = title

    setMeta('description', description)

    const robotsValue = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

    setMeta('robots', robotsValue)
    setMeta('googlebot', robotsValue)
    setMeta('theme-color', '#070b14')

    setProperty('og:type', type)
    setProperty('og:title', title)
    setProperty('og:description', description)
    setProperty('og:url', canonicalUrl)
    setProperty('og:site_name', SITE_NAME)
    setProperty('og:image', imageUrl)
    setProperty('og:image:alt', title)

    if (type === 'article' && publishedTime) {
      setProperty('article:published_time', publishedTime)
    } else {
      removeProperty('article:published_time')
    }

    if (type === 'article' && modifiedTime) {
      setProperty('article:modified_time', modifiedTime)
    } else {
      removeProperty('article:modified_time')
    }

    if (type === 'article' && author) {
      setProperty('article:author', author)
    } else {
      removeProperty('article:author')
    }

    setProperty('twitter:card', 'summary_large_image')
    setProperty('twitter:site', SITE_TWITTER)
    setProperty('twitter:title', title)
    setProperty('twitter:description', description)
    setProperty('twitter:image', imageUrl)

    setCanonical(canonicalUrl)
    setJsonLd('page', jsonLd || null)

    return () => {
      document.title = DEFAULT_TITLE
      setJsonLd('page', null)
    }
  }, [
    title,
    description,
    path,
    image,
    type,
    noindex,
    publishedTime,
    modifiedTime,
    author,
    jsonLd,
  ])

  return null
}
