import { useEffect, useMemo, useState } from 'react'

const COLLECTION_LABELS = {
  genshin: {
    characters: 'Characters',
    builds: 'Builds',
    weapons: 'Weapons',
    artifacts: 'Artifacts',
    maps: 'Maps',
    videos: 'Videos',
  },
  'whiteout-survival': {
    heroes: 'Heroes',
    builds: 'Builds',
    maps: 'Maps',
    facilities: 'Facilities',
    resources: 'Resources',
    beartrap: 'Bear Trap',
    videos: 'Videos',
  },
}

function collectionKey(gameSlug, collection) {
  return `cms.collection.${gameSlug}.${collection}`
}

function getItemTitle(item) {
  return (
    item?.title ||
    item?.name ||
    item?.heroName ||
    item?.characterName ||
    'Untitled'
  )
}

function getItemDescription(item) {
  return (
    item?.description ||
    item?.desc ||
    item?.content ||
    ''
  )
}

export default function CMSLiveContent({
  gameSlug,
  className = '',
}) {
  const [content, setContent] = useState({})

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const response = await fetch('/api/content', {
          cache: 'no-store',
        })

        if (!response.ok) return

        const data = await response.json()

        if (!active) return

        const map = Object.fromEntries(
          (Array.isArray(data) ? data : []).map((item) => [
            item.content_key,
            item.content_value,
          ])
        )

        setContent(map)
      } catch {
        if (active) {
          setContent({})
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [gameSlug])

  const collections = useMemo(() => {
    const labels =
      COLLECTION_LABELS[gameSlug] || {}

    return Object.entries(labels)
      .map(([collection, label]) => {
        const key = collectionKey(
          gameSlug,
          collection
        )

        let items = []

        try {
          const parsed = JSON.parse(
            content[key] || '[]'
          )

          if (Array.isArray(parsed)) {
            items = parsed.filter(
              (item) =>
                item &&
                item.status !== 'draft'
            )
          }
        } catch {}

        return {
          collection,
          label,
          items,
        }
      })
      .filter(
        (section) =>
          section.items.length > 0
      )
  }, [content, gameSlug])

  if (collections.length === 0) {
    return null
  }

  return (
    <section
      className={`cms-live-content ${className}`}
    >
      <div className="cms-live-heading">
        <span>GAMENEXA CMS</span>

        <h2>
          Latest Database Content
        </h2>

        <p>
          Content published from the GameNexa
          admin panel.
        </p>
      </div>

      {collections.map(
        ({
          collection,
          label,
          items,
        }) => (
          <section
            className="cms-live-section"
            key={collection}
          >
            <div className="cms-live-section-title">
              <h3>{label}</h3>

              <span>
                {items.length}{' '}
                {items.length === 1
                  ? 'item'
                  : 'items'}
              </span>
            </div>

            <div className="cms-live-grid">
              {items.map(
                (item, index) => {
                  const title =
                    getItemTitle(item)

                  const description =
                    getItemDescription(
                      item
                    )

                  const image =
                    item?.image ||
                    item?.icon ||
                    item?.portrait ||
                    ''

                  return (
                    <article
                      className="cms-live-card"
                      key={
                        item?.id ||
                        item?.slug ||
                        `${collection}-${index}`
                      }
                    >
                      {image && (
                        <div className="cms-live-image">
                          <img
                            src={image}
                            alt={title}
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="cms-live-card-body">
                        <span className="cms-live-category">
                          {label}
                        </span>

                        <h4>
                          {title}
                        </h4>

                        {description && (
                          <p>
                            {description}
                          </p>
                        )}

                        {item?.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open →
                          </a>
                        )}
                      </div>
                    </article>
                  )
                }
              )}
            </div>
          </section>
        )
      )}
    </section>
  )
}
