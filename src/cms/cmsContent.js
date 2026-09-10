import { useEffect, useMemo, useState } from 'react'

export async function fetchCMSContent() {
  try {
    const response = await fetch('/api/content', {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to load CMS content')
    }

    const data = await response.json()

    return Object.fromEntries(
      (Array.isArray(data) ? data : []).map((item) => [
        item.content_key,
        item.content_value,
      ])
    )
  } catch {
    return {}
  }
}

// ============================================================
// GUIDES
// ============================================================

export function cmsKey(slug, guideIndex, sectionIndex, paragraphIndex) {
  return `guide.${slug}.${guideIndex}.content.${sectionIndex}.paragraph.${paragraphIndex}`
}

export function cmsHeadingKey(slug, guideIndex, sectionIndex) {
  return `guide.${slug}.${guideIndex}.content.${sectionIndex}.heading`
}

export function cmsTitleKey(slug, guideIndex) {
  return `guide.${slug}.${guideIndex}.title`
}

export function cmsDescKey(slug, guideIndex) {
  return `guide.${slug}.${guideIndex}.desc`
}

export function cmsStructureKey(slug, guideIndex) {
  return `guide.${slug}.${guideIndex}.structure`
}

export function cmsDeletedGuidesKey(slug) {
  return `game.${slug}.deletedGuides`
}

export function cmsGuidesKey(slug) {
  return `game.${slug}.cmsGuides`
}

// ============================================================
// UNIVERSAL GAME CMS
// ============================================================

export function cmsGameFieldsKey(gameSlug) {
  return `cms.game.${gameSlug}.fields`
}

export function cmsCollectionKey(gameSlug, collection) {
  return `cms.collection.${gameSlug}.${collection}`
}

export function cmsCollectionOverridesKey(gameSlug, collection) {
  return `cms.collection.${gameSlug}.${collection}.overrides`
}

// ============================================================
// STABLE RECORD IDs
// ============================================================

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getStableRecordId(item, index = 0) {
  if (!item || typeof item !== 'object') {
    return `record-${index}`
  }

  if (item.id !== undefined && item.id !== null && String(item.id).trim()) {
    return String(item.id)
  }

  if (
    item.cmsRecordId !== undefined &&
    item.cmsRecordId !== null &&
    String(item.cmsRecordId).trim()
  ) {
    return String(item.cmsRecordId)
  }

  if (
    item.cmsId !== undefined &&
    item.cmsId !== null &&
    String(item.cmsId).trim()
  ) {
    return String(item.cmsId)
  }

  const source =
    item.slug ||
    item.name ||
    item.title ||
    item.key ||
    item.code

  const slug = slugify(source)

  if (slug) {
    return slug
  }

  return `record-${index}`
}

// ============================================================
// COLLECTION PARSING
// ============================================================

export function parseCMSCollection(contentMap, gameSlug, collection) {
  const key = cmsCollectionKey(gameSlug, collection)
  const value = contentMap?.[key]

  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function parseCMSCollectionOverrides(
  contentMap,
  gameSlug,
  collection
) {
  const key = cmsCollectionOverridesKey(gameSlug, collection)
  const value = contentMap?.[key]

  if (!value) return {}

  try {
    const parsed = JSON.parse(value)

    if (
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed)
    ) {
      return parsed
    }

    return {}
  } catch {
    return {}
  }
}

// ============================================================
// GAME FIELD PARSING
// ============================================================

function parseCMSGameFields(contentMap, gameSlug) {
  const key = cmsGameFieldsKey(gameSlug)
  const value = contentMap?.[key]

  if (!value) return {}

  try {
    const parsed = JSON.parse(value)

    if (
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed)
    ) {
      return parsed
    }

    return {}
  } catch {
    return {}
  }
}

// ============================================================
// GUIDE HELPERS
// ============================================================

function normalizeStructure(structure) {
  if (!Array.isArray(structure)) return []

  return structure.map((section) => ({
    heading:
      typeof section?.heading === 'string'
        ? section.heading
        : '',

    paragraphs: Array.isArray(section?.paragraphs)
      ? section.paragraphs.map((paragraph) =>
          typeof paragraph === 'string'
            ? paragraph
            : ''
        )
      : [],
  }))
}

function getStructureOverride(
  contentMap,
  slug,
  guideIndex
) {
  const value =
    contentMap[cmsStructureKey(slug, guideIndex)]

  if (!value) return null

  try {
    const parsed = JSON.parse(value)

    if (!Array.isArray(parsed)) {
      return null
    }

    return normalizeStructure(parsed)
  } catch {
    return null
  }
}

function getDeletedBuiltInGuideIndexes(
  contentMap,
  slug
) {
  const value = contentMap[cmsDeletedGuidesKey(slug)]

  if (!value) return []

  try {
    const parsed = JSON.parse(value)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((index) => Number(index))
      .filter((index) => Number.isInteger(index))
  } catch {
    return []
  }
}

function getCMSGuides(contentMap, slug) {
  const value = contentMap[cmsGuidesKey(slug)]

  if (!value) return []

  try {
    const parsed = JSON.parse(value)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter(
        (guide) =>
          guide &&
          typeof guide === 'object'
      )
      .map((guide) => ({
        icon:
          typeof guide.icon === 'string'
            ? guide.icon
            : '📖',

        title:
          typeof guide.title === 'string'
            ? guide.title
            : 'New Guide',

        desc:
          typeof guide.desc === 'string'
            ? guide.desc
            : '',

        content: normalizeStructure(
          guide.content
        ),

        cmsGuideId:
          typeof guide.cmsGuideId === 'string'
            ? guide.cmsGuideId
            : undefined,

        _cmsCreated: true,
      }))
  } catch {
    return []
  }
}

// ============================================================
// COLLECTION REGISTRY
// ============================================================

const COLLECTION_REGISTRY = {
  genshin: [
    'characters',
    'builds',
    'weapons',
    'artifacts',
    'maps',
    'videos',
  ],

  'whiteout-survival': [
    'heroes',
    'characters',
    'builds',
    'maps',
    'facilities',
    'resources',
    'beartrap',
    'videos',
  ],
}

// ============================================================
// COLLECTION SOURCE RESOLUTION
// ============================================================

function getBuiltInCollection(
  game,
  collection
) {
  if (!game) return []

  if (
    game.slug === 'whiteout-survival' &&
    collection === 'heroes'
  ) {
    if (Array.isArray(game.heroes)) {
      return game.heroes
    }

    if (Array.isArray(game.characters)) {
      return game.characters
    }

    return []
  }

  if (
    game.slug === 'whiteout-survival' &&
    collection === 'characters'
  ) {
    if (Array.isArray(game.characters)) {
      return game.characters
    }

    if (Array.isArray(game.heroes)) {
      return game.heroes
    }

    return []
  }

  if (Array.isArray(game[collection])) {
    return game[collection]
  }

  return []
}

// ============================================================
// MERGE COLLECTION WITH CMS OVERRIDES
// ============================================================

function mergeCollection(
  game,
  collection,
  contentMap
) {
  const builtInItems =
    getBuiltInCollection(game, collection)

  const cmsItems = parseCMSCollection(
    contentMap,
    game.slug,
    collection
  )

  const overrides =
    parseCMSCollectionOverrides(
      contentMap,
      game.slug,
      collection
    )

  const mergedBuiltIns = builtInItems.map(
    (item, index) => {
      const sourceId =
        getStableRecordId(item, index)

      const override =
        overrides?.[sourceId]

      const merged =
        override &&
        typeof override === 'object'
          ? {
              ...item,
              ...override,
            }
          : {
              ...item,
            }

      return {
        ...merged,

        _cmsSourceId: sourceId,

        _cmsBuiltIn: true,

        _cmsCreated: false,

        _cmsOverridden:
          !!override &&
          typeof override === 'object',
      }
    }
  )

  const mergedCMSItems = cmsItems
    .filter(
      (item) =>
        item &&
        typeof item === 'object'
    )
    .map((item, index) => ({
      ...item,

      _cmsSourceId:
        getStableRecordId(item, index),

      _cmsBuiltIn: false,

      _cmsCreated: true,

      _cmsOverridden: false,
    }))

  return [
    ...mergedBuiltIns,
    ...mergedCMSItems,
  ]
}

// ============================================================
// APPLY ALL CMS OVERRIDES
// ============================================================

export function applyCMSOverrides(
  gamesData,
  contentMap
) {
  const cloned = structuredClone(gamesData)

  Object.values(cloned).forEach((game) => {
    if (!game || !game.slug) {
      return
    }

    // --------------------------------------------------------
    // GAME MAIN DATA
    // --------------------------------------------------------

    const gameFields =
      parseCMSGameFields(
        contentMap,
        game.slug
      )

    if (
      gameFields &&
      typeof gameFields === 'object'
    ) {
      Object.entries(gameFields).forEach(
        ([key, value]) => {
          if (
            key === 'slug' ||
            key === 'guides' ||
            key === 'characters' ||
            key === 'heroes'
          ) {
            return
          }

          game[key] = value
        }
      )

      game._cmsGameFieldsOverridden = true
    } else {
      game._cmsGameFieldsOverridden = false
    }

    // --------------------------------------------------------
    // BUILT-IN + CMS COLLECTIONS
    // --------------------------------------------------------

    const collections =
      COLLECTION_REGISTRY[
        game.slug
      ] || []

    collections.forEach(
      (collection) => {
        const builtIn =
          getBuiltInCollection(
            game,
            collection
          )

        const hasBuiltIn =
          Array.isArray(builtIn) &&
          builtIn.length > 0

        const hasCMS =
          parseCMSCollection(
            contentMap,
            game.slug,
            collection
          ).length > 0

        const hasOverrides =
          Object.keys(
            parseCMSCollectionOverrides(
              contentMap,
              game.slug,
              collection
            )
          ).length > 0

        if (
          hasBuiltIn ||
          hasCMS ||
          hasOverrides
        ) {
          const merged =
            mergeCollection(
              game,
              collection,
              contentMap
            )

          if (
            game.slug ===
              'whiteout-survival' &&
            collection === 'heroes'
          ) {
            game.heroes = merged
          } else if (
            game.slug ===
              'whiteout-survival' &&
            collection === 'characters'
          ) {
            // Keep Whiteout's original
            // characters field synchronized
            // when it exists.
            if (
              Array.isArray(
                game.characters
              )
            ) {
              game.characters =
                merged
            }
          } else {
            game[collection] = merged
          }
        }
      }
    )

    // --------------------------------------------------------
    // GUIDES
    // --------------------------------------------------------

    const deletedGuideIndexes =
      getDeletedBuiltInGuideIndexes(
        contentMap,
        game.slug
      )

    ;(game.guides || []).forEach(
      (guide, guideIndex) => {
        guide.cmsBuiltInGuideIndex =
          guideIndex

        const titleKey =
          cmsTitleKey(
            game.slug,
            guideIndex
          )

        const descKey =
          cmsDescKey(
            game.slug,
            guideIndex
          )

        if (
          contentMap[titleKey] !==
          undefined
        ) {
          guide.title =
            contentMap[titleKey]
        }

        if (
          contentMap[descKey] !==
          undefined
        ) {
          guide.desc =
            contentMap[descKey]
        }

        const structureOverride =
          getStructureOverride(
            contentMap,
            game.slug,
            guideIndex
          )

        if (
          structureOverride !==
          null
        ) {
          guide.content =
            structureOverride

          return
        }

        ;(
          guide.content || []
        ).forEach(
          (
            section,
            sectionIndex
          ) => {
            const headingKey =
              cmsHeadingKey(
                game.slug,
                guideIndex,
                sectionIndex
              )

            if (
              contentMap[
                headingKey
              ] !== undefined
            ) {
              section.heading =
                contentMap[
                  headingKey
                ]
            }

            ;(
              section.paragraphs ||
              []
            ).forEach(
              (
                paragraph,
                paragraphIndex
              ) => {
                const key =
                  cmsKey(
                    game.slug,
                    guideIndex,
                    sectionIndex,
                    paragraphIndex
                  )

                if (
                  contentMap[key] !==
                  undefined
                ) {
                  section.paragraphs[
                    paragraphIndex
                  ] =
                    contentMap[key]
                }
              }
            )
          }
        )
      }
    )

    // --------------------------------------------------------
    // DELETE BUILT-IN GUIDES
    // --------------------------------------------------------

    if (
      deletedGuideIndexes.length >
      0
    ) {
      game.guides =
        game.guides.filter(
          (guide) =>
            !deletedGuideIndexes.includes(
              guide.cmsBuiltInGuideIndex
            )
        )
    }

    // --------------------------------------------------------
    // ADD CMS GUIDES
    // --------------------------------------------------------

    const cmsGuides =
      getCMSGuides(
        contentMap,
        game.slug
      )

    if (cmsGuides.length > 0) {
      game.guides = [
        ...(game.guides || []),
        ...cmsGuides,
      ]
    }
  })

  return cloned
}

// ============================================================
// CMS REACT HOOK
// ============================================================

export function useCMSGamesData(
  gamesData
) {
  const [contentMap, setContentMap] =
    useState({})

  useEffect(() => {
    let active = true

    fetchCMSContent().then(
      (data) => {
        if (active) {
          setContentMap(
            data || {}
          )
        }
      }
    )

    return () => {
      active = false
    }
  }, [])

  return useMemo(
    () =>
      applyCMSOverrides(
        gamesData,
        contentMap
      ),
    [contentMap, gamesData]
  )
}