import CMSLiveContent from '../components/CMSLiveContent'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { gamesData } from '../data/gamesData'
import { useCMSGamesData } from '../cms/cmsContent'
import { whiteoutHeroMeta, whiteoutHeroes } from '../data/whiteoutHeroes'
import { genshinCharacters } from '../data/genshinCharacters'
import { gameCharacters } from '../data/gameCharacters'
import { getGenshinBuildProfile } from '../games/genshin/genshinBuild'
import { getWhiteoutBuildProfile } from '../games/whiteout/whiteoutBuild'
import WhiteoutHub from '../games/whiteout/WhiteoutHub'
import './GamePage.css'
import { SEO } from '../SEO'

const DOT = String.fromCodePoint(0x00b7)

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeCharacterCollection(value) {
  let current = value

  if (
    current &&
    typeof current === 'object' &&
    current.default &&
    !Array.isArray(current)
  ) {
    current = current.default
  }

  if (Array.isArray(current)) {
    return current
  }

  if (!current || typeof current !== 'object') {
    return []
  }

  const candidates = [
    current.characters,
    current.genshinCharacters,
    current.heroes,
    current.data,
    current.items,
    current.list,
    current.roster,
    current.results,
    current.entries,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
    }
  }

  const objectValues = Object.values(current)

  const objectEntries = objectValues.filter(
    (item) =>
      item &&
      typeof item === 'object' &&
      !Array.isArray(item)
  )

  if (objectEntries.length > 0) {
    return objectEntries
  }

  return []
}

function getCharacterName(character) {
  return (
    character?.name ||
    character?.title ||
    character?.heroName ||
    character?.characterName ||
    character?.displayName ||
    'Unknown Character'
  )
}

function getCharacterImage(character) {
  return (
    character?.image ||
    character?.characterImage ||
    character?.cardImage ||
    character?.splash ||
    character?.icon ||
    character?.portrait ||
    character?.img ||
    character?.avatar ||
    character?.src ||
    character?.url ||
    ''
  )
}

function getCharacterRarity(character) {
  return (
    character?.rarity ??
    character?.quality ??
    character?.tier ??
    character?.rank ??
    ''
  )
}

function getCharacterType(character) {
  return (
    character?.type ||
    character?.class ||
    character?.troopType ||
    character?.role ||
    character?.element ||
    ''
  )
}

function getCharacterElement(character) {
  return (
    character?.element ||
    character?.elements ||
    ''
  )
}

function getCharacterWeapon(character) {
  const weapon = character?.weapon || character?.weaponType || ''

  if (typeof weapon === 'object') {
    return weapon?.name || ''
  }

  return weapon
}

function getCharacterGeneration(character) {
  return (
    character?.generation ??
    character?.gen ??
    character?.generationNumber ??
    ''
  )
}

function getCharacterId(character, index = 0) {
  return (
    character?.id ||
    character?.slug ||
    character?.characterSlug ||
    character?.heroSlug ||
    `${slugify(getCharacterName(character))}-${index}`
  )
}

function GamePage() {
  const params = useParams()

  const gameSlug =
    params.gameSlug ||
    params.slug ||
    params.game ||
    ''

  const cmsGamesData = useCMSGamesData(gamesData)

  const [search, setSearch] = useState('')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [generationFilter, setGenerationFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('default')
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  const game = useMemo(() => {
    if (!cmsGamesData || !gameSlug) return null

    const rawSlug = String(gameSlug)

    let decodedSlug = rawSlug

    try {
      decodedSlug = decodeURIComponent(rawSlug)
    } catch {
      decodedSlug = rawSlug
    }

    const requestedSlug = slugify(decodedSlug)
    const compactRequestedSlug =
      requestedSlug.replace(/-/g, '')

    const matches = (key, item) => {
      if (key && slugify(key) === requestedSlug) {
        return true
      }

      if (
        key &&
        slugify(key).replace(/-/g, '') ===
          compactRequestedSlug
      ) {
        return true
      }

      if (!item || typeof item !== 'object') {
        return false
      }

      const itemSlug = slugify(item.slug || '')
      const itemName = slugify(item.name || '')

      if (itemSlug === requestedSlug) {
        return true
      }

      if (
        itemSlug.replace(/-/g, '') ===
        compactRequestedSlug
      ) {
        return true
      }

      if (itemName === requestedSlug) {
        return true
      }

      if (
        itemName.replace(/-/g, '') ===
        compactRequestedSlug
      ) {
        return true
      }

      return false
    }

    if (Array.isArray(cmsGamesData)) {
      return (
        cmsGamesData.find((item) => matches('', item)) ||
        null
      )
    }

    const match = Object.entries(cmsGamesData).find(
      ([key, item]) => matches(key, item)
    )

    return match ? match[1] : null
  }, [gameSlug, cmsGamesData])

  const normalizedGameSlug = slugify(gameSlug)

  const isGenshin =
    normalizedGameSlug === 'genshin-impact' ||
    slugify(game?.slug) === 'genshin-impact' ||
    slugify(game?.name) === 'genshin-impact'

  const isWhiteout =
    normalizedGameSlug === 'whiteout-survival' ||
    slugify(game?.slug) === 'whiteout-survival' ||
    slugify(game?.name) === 'whiteout-survival'

  const databaseCharacters = useMemo(() => {
    if (isGenshin) {
      return normalizeCharacterCollection(
        genshinCharacters
      )
    }

    if (isWhiteout) {
      return normalizeCharacterCollection(
        whiteoutHeroes
      )
    }

    if (game?.slug) {
      return normalizeCharacterCollection(
        gameCharacters?.[game.slug]
      )
    }

    return []
  }, [isGenshin, isWhiteout, game])

  const [cmsCharacterItems, setCmsCharacterItems] =
    useState([])

  useEffect(() => {
    let active = true

    async function loadCMSCharacters() {
      try {
        const response = await fetch('/api/content', {
          cache: 'no-store',
        })

        if (!response.ok) {
          if (active) setCmsCharacterItems([])
          return
        }

        const data = await response.json()

        const contentMap = Object.fromEntries(
          (Array.isArray(data) ? data : []).map(
            (item) => [
              item.content_key,
              item.content_value,
            ]
          )
        )

        const collectionKey = isGenshin
          ? 'cms.collection.genshin.characters'
          : isWhiteout
            ? 'cms.collection.whiteout-survival.heroes'
            : ''

        if (!collectionKey) {
          if (active) setCmsCharacterItems([])
          return
        }

        let items = []

        try {
          const parsed = JSON.parse(
            contentMap[collectionKey] || '[]'
          )

          if (Array.isArray(parsed)) {
            items = parsed.filter(
              (item) =>
                item &&
                item.status !== 'draft'
            )
          }
        } catch {
          items = []
        }

        if (active) {
          setCmsCharacterItems(items)
        }
      } catch {
        if (active) {
          setCmsCharacterItems([])
        }
      }
    }

    loadCMSCharacters()

    return () => {
      active = false
    }
  }, [isGenshin, isWhiteout])

  const allCharacters = useMemo(() => {
    const staticItems =
      normalizeCharacterCollection(
        databaseCharacters
      ).filter(Boolean)

    const cmsItems = Array.isArray(cmsCharacterItems)
      ? cmsCharacterItems.filter(Boolean)
      : []

    if (cmsItems.length === 0) {
      return staticItems
    }

    const getIdentity = (item) => {
      const slug =
        item?.slug ||
        item?.id ||
        item?.characterSlug ||
        item?.heroSlug ||
        ''

      const name =
        item?.name ||
        item?.title ||
        item?.characterName ||
        item?.heroName ||
        ''

      return {
        slug: String(slug)
          .trim()
          .toLowerCase(),
        name: String(name)
          .trim()
          .toLowerCase(),
      }
    }

    const findExistingIndex = (
      items,
      cmsItem
    ) => {
      const cmsIdentity =
        getIdentity(cmsItem)

      if (
        !cmsIdentity.slug &&
        !cmsIdentity.name
      ) {
        return -1
      }

      return items.findIndex((existing) => {
        const identity =
          getIdentity(existing)

        return (
          (
            cmsIdentity.slug &&
            identity.slug &&
            cmsIdentity.slug ===
              identity.slug
          ) ||
          (
            cmsIdentity.name &&
            identity.name &&
            cmsIdentity.name ===
              identity.name
          )
        )
      })
    }

    const merged = [...staticItems]

    cmsItems.forEach((cmsItem, index) => {
      const existingIndex =
        findExistingIndex(
          merged,
          cmsItem
        )

      const cmsName =
        cmsItem?.name ||
        cmsItem?.title ||
        cmsItem?.characterName ||
        cmsItem?.heroName ||
        `CMS Entry ${index + 1}`

      const normalizedCMSItem = {
        ...cmsItem,

        id:
          cmsItem?.id ||
          cmsItem?.slug ||
          `cms-${slugify(cmsName)}`,

        slug:
          cmsItem?.slug ||
          cmsItem?.id ||
          slugify(cmsName),

        name: cmsName,

        title:
          cmsItem?.title ||
          cmsName,

        characterName:
          cmsItem?.characterName ||
          (isGenshin
            ? cmsName
            : undefined),

        heroName:
          cmsItem?.heroName ||
          (isWhiteout
            ? cmsName
            : undefined),

        image:
          cmsItem?.image ||
          cmsItem?.characterImage ||
          cmsItem?.cardImage ||
          cmsItem?.icon ||
          cmsItem?.portrait ||
          '',

        rarity:
          cmsItem?.rarity ??
          cmsItem?.quality ??
          cmsItem?.tier ??
          cmsItem?.rank ??
          '',

        element:
          cmsItem?.element ||
          cmsItem?.type ||
          '',

        weapon:
          cmsItem?.weapon ||
          cmsItem?.weaponType ||
          '',

        role:
          cmsItem?.role ||
          cmsItem?.class ||
          '',

        generation:
          cmsItem?.generation ??
          cmsItem?.gen ??
          cmsItem?.generationNumber ??
          '',

        description:
          cmsItem?.description ||
          cmsItem?.desc ||
          cmsItem?.content ||
          '',
      }

      if (existingIndex >= 0) {
        merged[existingIndex] = {
          ...merged[existingIndex],
          ...normalizedCMSItem,
        }
      } else {
        merged.push(normalizedCMSItem)
      }
    })

    return merged.filter(Boolean)
  }, [
    databaseCharacters,
    cmsCharacterItems,
    isGenshin,
    isWhiteout,
  ])

  const generations = useMemo(() => {
    if (!isWhiteout) return []

    const values = allCharacters
      .map((character) =>
        Number(
          getCharacterGeneration(character)
        )
      )
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value >= 0 &&
          value <= 17
      )

    return [...new Set(values)].sort(
      (a, b) => b - a
    )
  }, [allCharacters, isWhiteout])

  const rarities = useMemo(() => {
    const values = allCharacters
      .map((character) =>
        getCharacterRarity(character)
      )
      .filter(
        (value) =>
          value !== '' &&
          value !== null &&
          value !== undefined
      )

    return [...new Set(values)]
  }, [allCharacters])

  const types = useMemo(() => {
    const values = allCharacters
      .map((character) =>
        isGenshin
          ? getCharacterElement(character) ||
            getCharacterType(character)
          : getCharacterType(character)
      )
      .filter(Boolean)

    return [...new Set(values)]
  }, [allCharacters, isGenshin])

  const filteredCharacters = useMemo(() => {
    const query =
      search.trim().toLowerCase()

    let result = allCharacters.filter(
      (character) => {
        const name =
          getCharacterName(character)
            .toLowerCase()

        const rarity = String(
          getCharacterRarity(character)
        ).toLowerCase()

        const type = String(
          getCharacterType(character)
        ).toLowerCase()

        const element = String(
          getCharacterElement(character)
        ).toLowerCase()

        const weapon = String(
          getCharacterWeapon(character)
        ).toLowerCase()

        const role = String(
          character?.role ||
          character?.class ||
          ''
        ).toLowerCase()

        const generation = String(
          getCharacterGeneration(character)
        )

        const matchesSearch =
          !query ||
          name.includes(query) ||
          rarity.includes(query) ||
          type.includes(query) ||
          element.includes(query) ||
          weapon.includes(query) ||
          role.includes(query) ||
          generation.includes(query)

        const filterType =
          isGenshin
            ? getCharacterElement(
                character
              ) ||
              getCharacterType(character)
            : getCharacterType(character)

        const matchesRarity =
          rarityFilter === 'all' ||
          String(
            getCharacterRarity(character)
          ) === rarityFilter

        const matchesType =
          typeFilter === 'all' ||
          String(filterType) ===
            typeFilter

        const matchesGeneration =
          generationFilter === 'all' ||
          String(
            getCharacterGeneration(
              character
            )
          ) === generationFilter

        return (
          matchesSearch &&
          matchesRarity &&
          matchesType &&
          matchesGeneration
        )
      }
    )

    if (sortOrder === 'az') {
      result = [...result].sort(
        (a, b) =>
          getCharacterName(a).localeCompare(
            getCharacterName(b)
          )
      )
    }

    if (sortOrder === 'za') {
      result = [...result].sort(
        (a, b) =>
          getCharacterName(b).localeCompare(
            getCharacterName(a)
          )
      )
    }

    if (sortOrder === 'generation') {
      result = [...result].sort(
        (a, b) => {
          const genA = Number(
            getCharacterGeneration(a)
          )

          const genB = Number(
            getCharacterGeneration(b)
          )

          return (
            (Number.isFinite(genB)
              ? genB
              : -1) -
            (Number.isFinite(genA)
              ? genA
              : -1)
          )
        }
      )
    }

    return result
  }, [
    allCharacters,
    search,
    rarityFilter,
    typeFilter,
    generationFilter,
    sortOrder,
    isGenshin,
  ])

  const resetFilters = () => {
    setSearch('')
    setRarityFilter('all')
    setTypeFilter('all')
    setGenerationFilter('all')
    setSortOrder('default')
  }

  useEffect(() => {
    if (!selectedCharacter) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedCharacter(null)
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [selectedCharacter])

  useEffect(() => {
    document.body.style.overflow =
      selectedCharacter
        ? 'hidden'
        : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedCharacter])

  const selectedBuildProfile =
    selectedCharacter
      ? isGenshin
        ? getGenshinBuildProfile(
            selectedCharacter
          )
        : isWhiteout
          ? getWhiteoutBuildProfile(
              selectedCharacter
            )
          : null
      : null

  if (!game) {
    return (
      <main className="game-page">
        <div className="game-page-container">
          <section className="game-not-found">
            <span className="not-found-icon">
              &#x1F3AE;
            </span>

            <h1>Game Not Found</h1>

            <p>
              We could not find the game you are
              looking for.
            </p>

            <Link
              to="/"
              className="back-home-btn"
            >
              Back to Home
            </Link>
          </section>
        </div>
      </main>
    )
  }

  const gameName =
    game.name || 'Game'

  const seoTitle = isWhiteout
    ? 'Whiteout Survival Heroes, Tier List, Battle Maps & Hub | GameNexa'
    : isGenshin
      ? 'Genshin Impact Characters, Builds & Guides | GameNexa'
      : `${gameName} Database & Guides | GameNexa`

  const gameDescription =
    isWhiteout
      ? 'Full Whiteout Survival hero database with roles and generations, plus a complete hub: battle maps, facilities, fortresses, strongholds, resources, alliance territory, events, buildings, research, troops and calculators.'
      : isGenshin
        ? 'Browse every Genshin Impact character with elements, weapons, roles and build direction - artifacts, main stats, talent priority and weapon advice.'
        : game.description ||
          `Explore the latest ${gameName} characters, guides, builds, and database information on GameNexa.`

  const heroImage =
    game.heroImage ||
    game.banner ||
    game.image ||
    ''

  const featured = Array.isArray(
    game.featured
  )
    ? game.featured
    : []

  const guides = Array.isArray(
    game.guides
  )
    ? game.guides
    : []

  const strategy = Array.isArray(
    game.strategy
  )
    ? game.strategy
    : []

  const gameClass = [
    'game-page',
    isGenshin
      ? 'game-theme-genshin'
      : '',
    isWhiteout
      ? 'game-theme-whiteout'
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <main className={gameClass}>
      <SEO
        title={seoTitle}
        description={gameDescription}
      />

      <div className="game-page-container">
        <Link
          to="/"
          className="back-link"
        >
          <span>&#x2190;</span>
          Back to Games
        </Link>

        <section
          className="game-hero"
          style={
            heroImage
              ? {
                  '--hero-image': `url("${heroImage}")`,
                }
              : undefined
          }
        >
          <div className="game-hero-overlay" />

          <div className="game-hero-content">
            <div className="game-eyebrow">
              <span className="eyebrow-dot" />
              GAMENEXA DATABASE
            </div>

            <h1>{gameName}</h1>

            <p className="game-hero-description">
              {gameDescription}
            </p>

            <div className="game-stats">
              <div className="game-stat">
                <strong>
                  {allCharacters.length}
                </strong>

                <span>
                  {isWhiteout
                    ? 'Heroes'
                    : 'Characters'}
                </span>
              </div>

              <div className="game-stat">
                <strong>
                  {guides.length}
                </strong>

                <span>Guides</span>
              </div>
            </div>
          </div>
        </section>

        {isWhiteout && (
          <section className="whiteout-intel">
            <div className="whiteout-intel-heading">
              <span className="section-kicker">
                QUICK INTEL
              </span>

              <h2>
                Know your hero before you build.
              </h2>

              <p>
                Healers, rally joiners, classes and
                current-generation tiers at a glance.
              </p>
            </div>

            <div className="whiteout-intel-grid">
              <div className="intel-card">
                <span>HEALERS</span>

                <strong>
                  {Array.isArray(
                    whiteoutHeroMeta?.healerNames
                  )
                    ? whiteoutHeroMeta.healerNames.join(
                        ` ${DOT} `
                      )
                    : 'Philly · Xura · Bertha'}
                </strong>

                <small>
                  Team sustain / defensive support
                </small>
              </div>

              <div className="intel-card">
                <span>CORE JOINERS</span>

                <strong>
                  Jessie {DOT} Jasser {DOT} Jeronimo
                </strong>

                <small>
                  First expedition skill is the
                  important joiner slot.
                </small>
              </div>

              <div className="intel-card">
                <span>CLASSES</span>

                <strong>
                  Infantry {DOT} Lancer {DOT} Marksman
                </strong>

                <small>
                  Use the class and mode together
                  when building a team.
                </small>
              </div>

              <div className="intel-card">
                <span>ROSTER</span>

                <strong>
                  {whiteoutHeroMeta?.rosterCount ||
                    allCharacters.length}{' '}
                  heroes {DOT} Gen 1-17
                </strong>

                <small>
                  Search by name, class, rarity or
                  generation below.
                </small>
              </div>
            </div>
          </section>
        )}

        {isWhiteout && <WhiteoutHub />}

        <CMSLiveContent
          gameSlug={game.slug}
        />

        {isGenshin && (
          <section className="gnx-character-database">
            <div className="gnx-character-heading">
              <div>
                <span className="section-kicker">
                  {isWhiteout
                    ? 'WHITEOUT SURVIVAL'
                    : 'GENSHIN IMPACT'}
                </span>

                <h2>
                  {isWhiteout
                    ? 'Hero Database'
                    : 'Character Database'}
                </h2>

                <p>
                  {isWhiteout
                    ? `Browse ${allCharacters.length} heroes by name, class, rarity and generation.`
                    : `Browse ${allCharacters.length} Genshin Impact characters by name, element, rarity and weapon.`}
                </p>
              </div>

              <div className="gnx-character-count">
                <strong>
                  {filteredCharacters.length}
                </strong>

                <span>
                  {isWhiteout
                    ? 'heroes shown'
                    : 'characters shown'}
                </span>
              </div>
            </div>

            <div className="gnx-character-filters">
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={
                  isWhiteout
                    ? 'Search heroes...'
                    : 'Search characters, elements, weapons...'
                }
                aria-label={
                  isWhiteout
                    ? 'Search heroes'
                    : 'Search Genshin characters'
                }
              />

              <select
                value={rarityFilter}
                onChange={(event) =>
                  setRarityFilter(
                    event.target.value
                  )
                }
                aria-label="Filter by rarity"
              >
                <option value="all">
                  All Rarities
                </option>

                {rarities.map((rarity) => (
                  <option
                    key={String(rarity)}
                    value={String(rarity)}
                  >
                    {String(rarity)}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value
                  )
                }
                aria-label={
                  isWhiteout
                    ? 'Filter by class'
                    : 'Filter by element'
                }
              >
                <option value="all">
                  {isWhiteout
                    ? 'All Classes'
                    : 'All Elements'}
                </option>

                {types.map((type) => (
                  <option
                    key={String(type)}
                    value={String(type)}
                  >
                    {String(type)}
                  </option>
                ))}
              </select>

              {isWhiteout &&
                generations.length > 0 && (
                  <select
                    value={
                      generationFilter
                    }
                    onChange={(event) =>
                      setGenerationFilter(
                        event.target.value
                      )
                    }
                    aria-label="Filter by generation"
                  >
                    <option value="all">
                      All Generations
                    </option>

                    {generations.map(
                      (generation) => (
                        <option
                          key={generation}
                          value={String(
                            generation
                          )}
                        >
                          Generation {generation}
                        </option>
                      )
                    )}
                  </select>
                )}

              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value
                  )
                }
                aria-label="Sort characters"
              >
                <option value="default">
                  Default Order
                </option>

                <option value="az">
                  Name A-Z
                </option>

                <option value="za">
                  Name Z-A
                </option>

                {isWhiteout && (
                  <option value="generation">
                    Generation
                  </option>
                )}
              </select>

              <button
                type="button"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>

            {filteredCharacters.length > 0 ? (
              <div className="gnx-character-grid">
                {filteredCharacters.map(
                  (character, index) => {
                    const name =
                      getCharacterName(
                        character
                      )

                    const image =
                      getCharacterImage(
                        character
                      )

                    const rarity =
                      getCharacterRarity(
                        character
                      )

                    const element =
                      getCharacterElement(
                        character
                      )

                    const type =
                      getCharacterType(
                        character
                      )

                    const weapon =
                      getCharacterWeapon(
                        character
                      )

                    const generation =
                      getCharacterGeneration(
                        character
                      )

                    const role =
                      character?.role ||
                      character?.class ||
                      ''

                    return (
                      <button
                        type="button"
                        className="gnx-character-card"
                        key={getCharacterId(
                          character,
                          index
                        )}
                        onClick={() =>
                          setSelectedCharacter(
                            character
                          )
                        }
                      >
                        <div className="gnx-character-image">
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  'none'

                                const fallback =
                                  event.currentTarget
                                    .parentElement
                                    ?.querySelector(
                                      '.gnx-character-image-fallback'
                                    )

                                if (
                                  fallback
                                ) {
                                  fallback.style.display =
                                    'flex'
                                }
                              }}
                            />
                          ) : null}

                          <div
                            className="gnx-character-image-fallback"
                            style={{
                              display: image
                                ? 'none'
                                : 'flex',
                            }}
                          >
                            <span>
                              {isWhiteout
                                ? '&#x1F9B8;'
                                : '&#x2726;'}
                            </span>
                          </div>

                          {rarity && (
                            <span className="gnx-character-rarity">
                              {String(rarity)}
                            </span>
                          )}
                        </div>

                        <div className="gnx-character-content">
                          <h3>{name}</h3>

                          <div className="gnx-character-meta">
                            {isGenshin &&
                              element && (
                                <span>
                                  {String(
                                    element
                                  )}
                                </span>
                              )}

                            {isGenshin &&
                              weapon && (
                                <span>
                                  {String(
                                    weapon
                                  )}
                                </span>
                              )}

                            {isWhiteout &&
                              type && (
                                <span>
                                  {String(
                                    type
                                  )}
                                </span>
                              )}

                            {role && (
                              <span>
                                {String(
                                  role
                                )}
                              </span>
                            )}

                            {isWhiteout &&
                              generation !==
                                '' && (
                                <span>
                                  Gen{' '}
                                  {String(
                                    generation
                                  )}
                                </span>
                              )}
                          </div>
                        </div>
                      </button>
                    )
                  }
                )}
              </div>
            ) : (
              <div className="gnx-character-empty">
                <span>
                  &#x1F50E;
                </span>

                <h3>
                  {allCharacters.length > 0
                    ? 'No characters match your filters'
                    : isGenshin
                      ? 'Genshin character data was not found'
                      : 'Hero data was not found'}
                </h3>

                <p>
                  {allCharacters.length > 0
                    ? 'Try changing your search or filters.'
                    : 'Check the local character database and CMS collection.'}
                </p>

                {allCharacters.length > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {featured.length > 0 && (
          <section className="content-section">
            <div className="section-title-row">
              <div>
                <span className="section-kicker">
                  FEATURED
                </span>

                <h2>Featured Content</h2>
              </div>
            </div>

            <div className="featured-grid">
              {featured.map(
                (item, index) => (
                  <article
                    className="featured-card"
                    key={
                      item.id ||
                      item.title ||
                      index
                    }
                  >
                    {item.image && (
                      <div className="featured-image">
                        <img
                          src={item.image}
                          alt={
                            item.title ||
                            'Featured content'
                          }
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="featured-content">
                      {item.category && (
                        <span>
                          {item.category}
                        </span>
                      )}

                      <h3>{item.title}</h3>

                      {item.description && (
                        <p>
                          {item.description}
                        </p>
                      )}

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Explore &#x2192;
                        </a>
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          </section>
        )}

        {isWhiteout && (
          <section className="content-section strategy-hub">
            <div className="section-title-row">
              <div>
                <span className="section-kicker">
                  WHITEOUT SURVIVAL
                </span>

                <h2>Strategy Hub</h2>

                <p>
                  Build smarter teams and dominate
                  every stage of the game.
                </p>
              </div>
            </div>

            <div className="strategy-grid">
              {(
                strategy.length > 0
                  ? strategy
                  : [
                      {
                        title:
                          'Hero Generations',
                        description:
                          'Understand hero generations and build your lineup around the strongest available heroes.',
                        icon: '&#x2694;&#xFE0F;',
                      },
                      {
                        title:
                          'Bear Trap',
                        description:
                          'Choose the right rally heroes and maximize your damage during Bear Trap.',
                        icon: '&#x1F43B;',
                      },
                      {
                        title: 'Arena',
                        description:
                          'Learn which heroes perform best in PvP and how to build an effective Arena lineup.',
                        icon: '&#x1F3C6;',
                      },
                    ]
              ).map(
                (item, index) => (
                  <article
                    className="strategy-card"
                    key={
                      item.id ||
                      item.title ||
                      index
                    }
                  >
                    <div
                      className="strategy-icon"
                      dangerouslySetInnerHTML={{
                        __html:
                          item.icon ||
                          '&#x2726;',
                      }}
                    />

                    <h3>{item.title}</h3>

                    <p>
                      {item.description ||
                        item.text ||
                        'Useful Whiteout Survival strategy information.'}
                    </p>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Learn More &#x2192;
                      </a>
                    )}
                  </article>
                )
              )}
            </div>
          </section>
        )}

        {guides.length > 0 && (
          <section className="content-section">
            <div className="section-title-row">
              <div>
                <span className="section-kicker">
                  GUIDES
                </span>

                <h2>Game Guides</h2>
              </div>
            </div>

            <div className="guides-grid">
              {guides.map(
                (guide, index) => (
                  <Link
                    key={`${game.slug}-guide-${index}`}
                    to={`/game/${game.slug}/guides/${index}`}
                    className="guide-card"
                  >
                    {guide.image && (
                      <div className="guide-image">
                        <img
                          src={guide.image}
                          alt={
                            guide.title ||
                            'Game guide'
                          }
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="guide-content">
                      {guide.category && (
                        <span className="guide-category">
                          {guide.category}
                        </span>
                      )}

                      <h3>
                        {guide.title}
                      </h3>

                      <p>
                        {guide.desc ||
                          guide.description ||
                          'Complete guide and useful information.'}
                      </p>

                      <span className="guide-read-link">
                        Read Guide &#x2192;
                      </span>
                    </div>
                  </Link>
                )
              )}
            </div>
          </section>
        )}

        {isWhiteout && (
          <p className="asset-credit-note">
            Whiteout Survival character artwork is
            shown for fan-database reference. GameNexa
            does not claim ownership of the game
            artwork.
          </p>
        )}
      </div>

      {selectedCharacter && (
        <div
          className="character-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedCharacter(null)
            }
          }}
        >
          <div
            className="character-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${getCharacterName(
              selectedCharacter
            )} details`}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setSelectedCharacter(null)
              }
              aria-label="Close"
            >
              &#x00D7;
            </button>

            <div className="modal-header">
              <div className="modal-character-image">
                {getCharacterImage(
                  selectedCharacter
                ) ? (
                  <img
                    src={getCharacterImage(
                      selectedCharacter
                    )}
                    alt={getCharacterName(
                      selectedCharacter
                    )}
                  />
                ) : (
                  <span>&#x2726;</span>
                )}
              </div>

              <div className="modal-title-area">
                <div className="modal-badges">
                  {getCharacterGeneration(
                    selectedCharacter
                  ) !== '' && (
                    <span className="modal-generation">
                      Generation{' '}
                      {getCharacterGeneration(
                        selectedCharacter
                      )}
                    </span>
                  )}

                  {getCharacterRarity(
                    selectedCharacter
                  ) && (
                    <span className="modal-rarity">
                      {getCharacterRarity(
                        selectedCharacter
                      )}
                    </span>
                  )}
                </div>

                <h2>
                  {getCharacterName(
                    selectedCharacter
                  )}
                </h2>

                {getCharacterType(
                  selectedCharacter
                ) && (
                  <p className="modal-type">
                    {getCharacterType(
                      selectedCharacter
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="modal-body">
              <section className="modal-section">
                <h3>Overview</h3>

                <p>
                  {selectedCharacter.description ||
                    selectedCharacter.notes ||
                    (isGenshin
                      ? `${getCharacterName(
                          selectedCharacter
                        )} is a ${
                          selectedCharacter.role ||
                          'playable'
                        } ${
                          selectedCharacter.element ||
                          ''
                        } character using a ${
                          getCharacterWeapon(
                            selectedCharacter
                          ) ||
                          'weapon'
                        }. Use the build snapshot below as a practical starting point, then tune it to your team and rotation.`
                      : `${getCharacterName(
                          selectedCharacter
                        )} is a Generation ${
                          selectedCharacter.generation ||
                          '-'
                        } ${
                          selectedCharacter.troopType ||
                          ''
                        } hero. Review the role, tier, best-use mode and upgrade guidance below before investing resources.`)}
                </p>
              </section>

              <div className="modal-detail-grid">
                {selectedCharacter.role && (
                  <div className="detail-box">
                    <span>Role</span>

                    <strong>
                      {selectedCharacter.role}
                    </strong>
                  </div>
                )}

                {selectedCharacter.tier && (
                  <div className="detail-box detail-tier-box">
                    <span>Tier</span>

                    <strong>
                      {selectedCharacter.tier}
                    </strong>
                  </div>
                )}

                {selectedCharacter.bestFor && (
                  <div className="detail-box">
                    <span>Best For</span>

                    <strong>
                      {selectedCharacter.bestFor}
                    </strong>
                  </div>
                )}

                {selectedCharacter.healer !==
                  undefined && (
                  <div className="detail-box">
                    <span>Healer</span>

                    <strong>
                      {selectedCharacter.healer
                        ? 'Yes'
                        : 'No'}
                    </strong>
                  </div>
                )}

                {selectedCharacter.rallyJoiner !==
                  undefined && (
                  <div className="detail-box">
                    <span>
                      Rally Joiner
                    </span>

                    <strong>
                      {selectedCharacter.rallyJoiner
                        ? 'Yes'
                        : 'Situational'}
                    </strong>
                  </div>
                )}

                {selectedCharacter.type && (
                  <div className="detail-box">
                    <span>Type</span>

                    <strong>
                      {selectedCharacter.type}
                    </strong>
                  </div>
                )}

                {selectedCharacter.rarity && (
                  <div className="detail-box">
                    <span>Rarity</span>

                    <strong>
                      {selectedCharacter.rarity}
                    </strong>
                  </div>
                )}

                {selectedCharacter.generation !==
                  undefined &&
                  selectedCharacter.generation !==
                    null && (
                    <div className="detail-box">
                      <span>
                        Generation
                      </span>

                      <strong>
                        {
                          selectedCharacter.generation
                        }
                      </strong>
                    </div>
                  )}

                {selectedCharacter.element && (
                  <div className="detail-box">
                    <span>Element</span>

                    <strong>
                      {
                        selectedCharacter.element
                      }
                    </strong>
                  </div>
                )}

                {selectedCharacter.weapon && (
                  <div className="detail-box">
                    <span>Weapon</span>

                    <strong>
                      {typeof selectedCharacter.weapon ===
                      'object'
                        ? selectedCharacter
                            .weapon?.name
                        : selectedCharacter.weapon}
                    </strong>
                  </div>
                )}

                {selectedCharacter.region && (
                  <div className="detail-box">
                    <span>Region</span>

                    <strong>
                      {selectedCharacter.region}
                    </strong>
                  </div>
                )}

                {selectedCharacter.version && (
                  <div className="detail-box">
                    <span>Version</span>

                    <strong>
                      {selectedCharacter.version}
                    </strong>
                  </div>
                )}

                {selectedCharacter.releaseDate && (
                  <div className="detail-box">
                    <span>Release</span>

                    <strong>
                      {
                        selectedCharacter.releaseDate
                      }
                    </strong>
                  </div>
                )}

                {selectedCharacter.modelType && (
                  <div className="detail-box">
                    <span>Model</span>

                    <strong>
                      {
                        selectedCharacter.modelType
                      }
                    </strong>
                  </div>
                )}

                {selectedCharacter.bearTrap && (
                  <div className="detail-box">
                    <span>Bear Trap</span>

                    <strong>
                      {
                        selectedCharacter.bearTrap
                      }
                    </strong>
                  </div>
                )}

                {selectedCharacter.arena && (
                  <div className="detail-box">
                    <span>Arena</span>

                    <strong>
                      {selectedCharacter.arena}
                    </strong>
                  </div>
                )}
              </div>

              {selectedBuildProfile && (
                <section className="modal-section hero-build-section">
                  <div className="hero-build-heading">
                    <div>
                      <span className="modal-eyebrow">
                        {isGenshin
                          ? 'BUILD SNAPSHOT'
                          : 'HERO INTEL'}
                      </span>

                      <h3>
                        {isGenshin
                          ? 'Recommended Build Direction'
                          : 'Recommended Hero Setup'}
                      </h3>
                    </div>

                    <span className="build-source-badge">
                      {isGenshin
                        ? 'Build guidance'
                        : 'Current roster data'}
                    </span>
                  </div>

                  {isGenshin ? (
                    <>
                      <div className="hero-build-grid">
                        <div className="build-box">
                          <span>
                            Artifacts
                          </span>

                          <strong>
                            {
                              selectedBuildProfile.artifacts
                            }
                          </strong>
                        </div>

                        <div className="build-box">
                          <span>
                            Main Stats
                          </span>

                          <strong>
                            {
                              selectedBuildProfile.mainStats
                            }
                          </strong>
                        </div>

                        <div className="build-box">
                          <span>
                            Substats
                          </span>

                          <strong>
                            {
                              selectedBuildProfile.substats
                            }
                          </strong>
                        </div>

                        <div className="build-box">
                          <span>
                            Talent Priority
                          </span>

                          <strong>
                            {
                              selectedBuildProfile.talentPriority
                            }
                          </strong>
                        </div>
                      </div>

                      <div className="build-callout">
                        <b>Weapon</b>

                        <span>
                          {
                            selectedBuildProfile.weaponAdvice
                          }
                        </span>
                      </div>

                      <div className="build-callout">
                        <b>Ascension</b>

                        <span>
                          {
                            selectedBuildProfile.ascensionGem
                          }{' '}
                          + character-specific local,
                          boss and enemy materials.
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="hero-build-grid">
                        <div className="build-box">
                          <span>
                            Formation
                          </span>

                          <strong>
                            {
                              selectedBuildProfile.formation
                            }
                          </strong>
                        </div>

                        <div className="build-box">
                          <span>
                            Exclusive Gear
                          </span>

                          <strong>
                            {
                              selectedBuildProfile.exclusiveGear
                            }
                          </strong>
                        </div>

                        <div className="build-box">
                          <span>Class</span>

                          <strong>
                            {selectedCharacter.troopType ||
                              'Infantry / Lancer / Marksman'}
                          </strong>
                        </div>

                        <div className="build-box">
                          <span>
                            Best For
                          </span>

                          <strong>
                            {selectedCharacter.bestFor ||
                              'General combat'}
                          </strong>
                        </div>
                      </div>

                      <div className="build-callout">
                        <b>
                          Skill Priority
                        </b>

                        <span>
                          {
                            selectedBuildProfile.skillPriority
                          }
                        </span>
                      </div>
                    </>
                  )}
                </section>
              )}

              {selectedCharacter.synergy && (
                <section className="modal-section modal-advice-section">
                  <h3>
                    Team Synergy
                  </h3>

                  <p>
                    {selectedCharacter.synergy}
                  </p>
                </section>
              )}

              {selectedCharacter.notes && (
                <section className="modal-section modal-advice-section">
                  <h3>
                    GameNexa Notes
                  </h3>

                  <p>
                    {selectedCharacter.notes}
                  </p>
                </section>
              )}

              {selectedCharacter.skills &&
                Array.isArray(
                  selectedCharacter.skills
                ) &&
                selectedCharacter.skills
                  .length > 0 && (
                  <section className="modal-section">
                    <h3>Skills</h3>

                    <div className="skills-list">
                      {selectedCharacter.skills.map(
                        (
                          skill,
                          index
                        ) => (
                          <article
                            className="skill-card"
                            key={
                              skill.id ||
                              skill.name ||
                              index
                            }
                          >
                            {skill.image && (
                              <img
                                src={
                                  skill.image
                                }
                                alt={
                                  skill.name ||
                                  'Skill'
                                }
                                loading="lazy"
                              />
                            )}

                            <div>
                              <h4>
                                {skill.name ||
                                  `Skill ${
                                    index + 1
                                  }`}
                              </h4>

                              {skill.description && (
                                <p>
                                  {
                                    skill.description
                                  }
                                </p>
                              )}

                              {skill.values && (
                                <div className="skill-values">
                                  {Array.isArray(
                                    skill.values
                                  )
                                    ? skill.values.join(
                                        ' / '
                                      )
                                    : String(
                                        skill.values
                                      )}
                                </div>
                              )}
                            </div>
                          </article>
                        )
                      )}
                    </div>
                  </section>
                )}

              {isGenshin && (
                <p className="hero-data-source">
                  Build guidance is a practical
                  starting point compiled from
                  current Genshin build conventions.
                  Character identity data follows the
                  local database; verify patch-specific
                  changes before spending premium
                  resources.
                </p>
              )}

              {isWhiteout && (
                <p className="hero-data-source">
                  Whiteout Survival hero generation,
                  class and role data is maintained
                  against the current roster research.
                  Exclusive Gear is specific to
                  gold-quality heroes and adds extra
                  hero/command bonuses.
                </p>
              )}

              {selectedCharacter.expedition &&
                Array.isArray(
                  selectedCharacter.expedition
                ) && (
                  <section className="modal-section">
                    <h3>
                      Expedition
                    </h3>

                    <div className="skills-list">
                      {selectedCharacter.expedition.map(
                        (
                          skill,
                          index
                        ) => (
                          <article
                            className="skill-card"
                            key={
                              skill.id ||
                              skill.name ||
                              index
                            }
                          >
                            {skill.image && (
                              <img
                                src={
                                  skill.image
                                }
                                alt={
                                  skill.name ||
                                  'Skill'
                                }
                                loading="lazy"
                              />
                            )}

                            <div>
                              <h4>
                                {skill.name}
                              </h4>

                              {skill.description && (
                                <p>
                                  {
                                    skill.description
                                  }
                                </p>
                              )}

                              {skill.values && (
                                <div className="skill-values">
                                  {Array.isArray(
                                    skill.values
                                  )
                                    ? skill.values.join(
                                        ' / '
                                      )
                                    : String(
                                        skill.values
                                      )}
                                </div>
                              )}
                            </div>
                          </article>
                        )
                      )}
                    </div>
                  </section>
                )}

              {selectedCharacter.weapon &&
                typeof selectedCharacter.weapon ===
                  'object' &&
                Array.isArray(
                  selectedCharacter.weapon
                    .skills
                ) && (
                  <section className="modal-section">
                    <h3>
                      {selectedCharacter
                          .weapon?.name ||
                        'Weapon'}
                    </h3>

                    <div className="skills-list">
                      {selectedCharacter.weapon.skills.map(
                        (
                          skill,
                          index
                        ) => (
                          <article
                            className="skill-card"
                            key={
                              skill.id ||
                              skill.name ||
                              index
                            }
                          >
                            {skill.image && (
                              <img
                                src={
                                  skill.image
                                }
                                alt={
                                  skill.name ||
                                  'Weapon skill'
                                }
                                loading="lazy"
                              />
                            )}

                            <div>
                              <h4>
                                {skill.name}
                              </h4>

                              {skill.description && (
                                <p>
                                  {
                                    skill.description
                                  }
                                </p>
                              )}

                              {skill.values && (
                                <div className="skill-values">
                                  {Array.isArray(
                                    skill.values
                                  )
                                    ? skill.values.join(
                                        ' / '
                                      )
                                    : String(
                                        skill.values
                                      )}
                                </div>
                              )}
                            </div>
                          </article>
                        )
                      )}
                    </div>
                  </section>
                )}

              {selectedCharacter.howToGet && (
                <section className="modal-section">
                  <h3>
                    How to Get
                  </h3>

                  <p>
                    {
                      selectedCharacter.howToGet
                    }
                  </p>
                </section>
              )}

              {selectedCharacter.notes && (
                <section className="modal-section">
                  <h3>Notes</h3>

                  <p>
                    {selectedCharacter.notes}
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gnx-character-database {
          margin: 32px 0;
          padding: 28px;
          border-radius: 22px;
          background: var(--card-bg, rgba(255,255,255,.04));
          border: 1px solid var(--border-color, rgba(255,255,255,.10));
        }

        .gnx-character-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .gnx-character-heading h2 {
          margin: 5px 0 8px;
        }

        .gnx-character-heading p {
          margin: 0;
          opacity: .72;
        }

        .gnx-character-count {
          min-width: 110px;
          padding: 12px 16px;
          border-radius: 14px;
          text-align: center;
          background: rgba(255,255,255,.06);
        }

        .gnx-character-count strong {
          display: block;
          font-size: 24px;
        }

        .gnx-character-count span {
          display: block;
          margin-top: 2px;
          font-size: 12px;
          opacity: .65;
        }

        .gnx-character-filters {
          display: grid;
          grid-template-columns: minmax(220px, 1.6fr) repeat(4, minmax(130px, 1fr));
          gap: 10px;
          margin-bottom: 22px;
        }

        .gnx-character-filters input,
        .gnx-character-filters select,
        .gnx-character-filters button {
          width: 100%;
          min-height: 44px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(0,0,0,.16);
          color: inherit;
          font: inherit;
        }

        .gnx-character-filters button {
          cursor: pointer;
          font-weight: 700;
        }

        .gnx-character-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));
          gap: 16px;
        }

        .gnx-character-card {
          display: block;
          width: 100%;
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 16px;
          background: rgba(255,255,255,.035);
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
        }

        .gnx-character-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,.24);
          box-shadow: 0 12px 28px rgba(0,0,0,.20);
        }

        .gnx-character-image {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: rgba(0,0,0,.16);
        }

        .gnx-character-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gnx-character-image-fallback {
          position: absolute;
          inset: 0;
          align-items: center;
          justify-content: center;
          font-size: 42px;
          opacity: .45;
        }

        .gnx-character-rarity {
          position: absolute;
          left: 9px;
          bottom: 9px;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(0,0,0,.68);
          font-size: 11px;
          font-weight: 800;
        }

        .gnx-character-content {
          padding: 13px;
        }

        .gnx-character-content h3 {
          margin: 0 0 9px;
          font-size: 16px;
          line-height: 1.25;
        }

        .gnx-character-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .gnx-character-meta span {
          padding: 4px 7px;
          border-radius: 7px;
          background: rgba(255,255,255,.07);
          font-size: 10px;
          line-height: 1.2;
          opacity: .78;
        }

        .gnx-character-empty {
          padding: 50px 20px;
          text-align: center;
          border-radius: 16px;
          background: rgba(255,255,255,.025);
        }

        .gnx-character-empty > span {
          display: block;
          margin-bottom: 10px;
          font-size: 36px;
        }

        .gnx-character-empty h3 {
          margin: 0 0 8px;
        }

        .gnx-character-empty p {
          margin: 0 0 18px;
          opacity: .65;
        }

        .gnx-character-empty button {
          min-height: 42px;
          padding: 0 18px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 9px;
          background: rgba(255,255,255,.07);
          color: inherit;
          cursor: pointer;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .gnx-character-filters {
            grid-template-columns: repeat(2, 1fr);
          }

          .gnx-character-filters input {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .gnx-character-database {
            padding: 18px;
            border-radius: 16px;
          }

          .gnx-character-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .gnx-character-count {
            width: 100%;
          }

          .gnx-character-filters {
            grid-template-columns: 1fr;
          }

          .gnx-character-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .gnx-character-content {
            padding: 10px;
          }

          .gnx-character-content h3 {
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  )
}

export default GamePage
