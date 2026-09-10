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

export function cmsKey(
  slug,
  guideIndex,
  sectionIndex,
  paragraphIndex
) {
  return `guide.${slug}.${guideIndex}.content.${sectionIndex}.paragraph.${paragraphIndex}`
}

export function cmsHeadingKey(
  slug,
  guideIndex,
  sectionIndex
) {
  return `guide.${slug}.${guideIndex}.content.${sectionIndex}.heading`
}

export function cmsTitleKey(
  slug,
  guideIndex
) {
  return `guide.${slug}.${guideIndex}.title`
}

export function cmsDescKey(
  slug,
  guideIndex
) {
  return `guide.${slug}.${guideIndex}.desc`
}

export function cmsStructureKey(
  slug,
  guideIndex
) {
  return `guide.${slug}.${guideIndex}.structure`
}

/*
 * ============================================================
 * DELETED BUILT-IN GUIDES
 * ============================================================
 *
 * Original/static guides can now be permanently hidden through
 * the CMS without changing gamesData.js.
 *
 * Example:
 *
 * game.genshin.deletedGuides
 *
 * Value:
 * ["0", "2"]
 *
 * The numbers are the ORIGINAL guide indexes from gamesData.
 */

export function cmsDeletedGuidesKey(slug) {
  return `game.${slug}.deletedGuides`
}

/*
 * ============================================================
 * NEW GUIDE SYSTEM
 * ============================================================
 *
 * Each game can have CMS-created guides stored as:
 *
 * game.genshin.cmsGuides
 * game.whiteout-survival.cmsGuides
 */

export function cmsGuidesKey(slug) {
  return `game.${slug}.cmsGuides`
}

function normalizeStructure(structure) {
  if (!Array.isArray(structure)) {
    return []
  }

  return structure.map((section) => ({
    heading:
      typeof section?.heading === 'string'
        ? section.heading
        : '',
    paragraphs:
      Array.isArray(section?.paragraphs)
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
  const key = cmsStructureKey(
    slug,
    guideIndex
  )

  const value = contentMap[key]

  if (!value) {
    return null
  }

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

/*
 * ============================================================
 * GET DELETED BUILT-IN GUIDE INDEXES
 * ============================================================
 */

function getDeletedBuiltInGuideIndexes(
  contentMap,
  slug
) {
  const key = cmsDeletedGuidesKey(slug)
  const value = contentMap[key]

  if (!value) {
    return []
  }

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

/*
 * ============================================================
 * GET CMS-CREATED GUIDES
 * ============================================================
 */

function getCMSGuides(
  contentMap,
  slug
) {
  const key = cmsGuidesKey(slug)
  const value = contentMap[key]

  if (!value) {
    return []
  }

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

        content:
          normalizeStructure(
            guide.content
          ),

        cmsGuideId:
          typeof guide.cmsGuideId === 'string'
            ? guide.cmsGuideId
            : undefined,
      }))
  } catch {
    return []
  }
}

export function applyCMSOverrides(
  gamesData,
  contentMap
) {
  const cloned = structuredClone(gamesData)

  Object.values(cloned).forEach((game) => {
    /*
     * ----------------------------------------------------------
     * EXISTING / BUILT-IN GUIDES
     * ----------------------------------------------------------
     */

    const deletedGuideIndexes =
      getDeletedBuiltInGuideIndexes(
        contentMap,
        game.slug
      )

    ;(game.guides || []).forEach(
      (guide, guideIndex) => {
        /*
         * Keep the ORIGINAL index attached to the guide.
         *
         * This is important because after deleting a guide,
         * the visible array indexes change.
         *
         * CMS data must continue using the original index.
         */
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
          contentMap[titleKey] !== undefined
        ) {
          guide.title =
            contentMap[titleKey]
        }

        if (
          contentMap[descKey] !== undefined
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

        if (structureOverride !== null) {
          guide.content =
            structureOverride

          return
        }

        /*
         * Individual CMS overrides.
         */

        ;(guide.content || []).forEach(
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
              contentMap[headingKey] !== undefined
            ) {
              section.heading =
                contentMap[headingKey]
            }

            ;(
              section.paragraphs || []
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
                  contentMap[key] !== undefined
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

    /*
     * Remove deleted built-in guides AFTER all CMS
     * overrides have been applied.
     *
     * This means old saved title/description/content
     * data remains safe and can be restored later if
     * we ever add an "Restore Guide" feature.
     */

    if (
      deletedGuideIndexes.length > 0 &&
      Array.isArray(game.guides)
    ) {
      game.guides =
        game.guides.filter(
          (guide) =>
            !deletedGuideIndexes.includes(
              guide.cmsBuiltInGuideIndex
            )
        )
    }

    /*
     * ----------------------------------------------------------
     * CMS CREATED GUIDES
     * ----------------------------------------------------------
     *
     * These are appended after the original guides.
     */

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

export function useCMSGamesData(
  gamesData
) {
  const [contentMap, setContentMap] =
    useState({})

  useEffect(() => {
    let active = true

    fetchCMSContent().then((data) => {
      if (active) {
        setContentMap(data)
      }
    })

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