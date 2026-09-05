import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { gamesData } from '../data/gamesData'
import { whiteoutHeroMeta, whiteoutHeroes } from '../data/whiteoutHeroes'
import { genshinCharacters } from '../data/genshinCharacters'
import { gameCharacters } from '../data/gameCharacters'
import './GamePage.css'
import { SEO } from '../SEO'

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getCharacterName(character) {
  return (
    character?.name ||
    character?.title ||
    character?.heroName ||
    character?.characterName ||
    'Unknown Hero'
  )
}

function getCharacterImage(character) {
  return (
    character?.image ||
    character?.icon ||
    character?.portrait ||
    character?.img ||
    character?.avatar ||
    ''
  )
}

function getCharacterRarity(character) {
  return (
    character?.rarity ||
    character?.quality ||
    character?.tier ||
    character?.rank ||
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

function getCharacterGeneration(character) {
  return (
    character?.generation ??
    character?.gen ??
    character?.generationNumber ??
    ''
  )
}

const genshinBuildByRole = {
  'Main DPS': {
    artifacts: '4pc role / reaction set',
    mainStats: 'ATK% / Elemental DMG / CRIT',
    substats: 'CRIT Rate / CRIT DMG > ATK% > ER',
    talentPriority: 'Normal Attack / Skill / Burst — follow the character kit',
    weaponAdvice: 'Signature weapon first; otherwise CRIT, ATK or Elemental Mastery options that match the kit.',
  },
  'Sub DPS': {
    artifacts: '4pc Golden Troupe / Emblem of Severed Fate / reaction set',
    mainStats: 'ATK% / Elemental DMG / CRIT',
    substats: 'CRIT Rate / CRIT DMG > ER > ATK%',
    talentPriority: 'Elemental Skill / Burst > Normal Attack when off-field',
    weaponAdvice: 'Signature or strong CRIT/ER/EM weapon depending on the character’s rotation.',
  },
  'Support': {
    artifacts: '4pc Noblesse Oblige / Scroll of the Hero of Cinder City / kit-specific set',
    mainStats: 'ER or HP/DEF/EM as required / Elemental DMG or Healing / CRIT or Healing Bonus',
    substats: 'Energy Recharge > required scaling stat > CRIT/EM',
    talentPriority: 'Skill / Burst > Normal Attack',
    weaponAdvice: 'Energy Recharge or team-buffing option; use the signature when its passive is relevant.',
  },
  'DPS': {
    artifacts: '4pc character/reaction set or Golden Troupe when off-field',
    mainStats: 'ATK% / Elemental DMG / CRIT',
    substats: 'CRIT Rate / CRIT DMG > ATK% > ER/EM',
    talentPriority: 'Skill / Burst > Normal Attack unless the kit says otherwise',
    weaponAdvice: 'Signature or a high-value CRIT/ATK/EM option suited to the character.',
  },
}

const genshinElementGem = {
  Pyro: 'Agnidus Agate',
  Hydro: 'Varunada Lazurite',
  Anemo: 'Vayuda Turquoise',
  Electro: 'Vajrada Amethyst',
  Cryo: 'Shivada Jade',
  Geo: 'Prithiva Topaz',
  Dendro: 'Nagadus Emerald',
}

function getGenshinBuildProfile(character) {
  const role = character?.role || 'Support'
  const profile = genshinBuildByRole[role] || genshinBuildByRole.Support
  return {
    ...profile,
    ascensionGem: genshinElementGem[character?.element] || 'Elemental Ascension Gem',
    identity: `${character?.element || 'Elemental'} ${character?.weapon || 'Weapon'} · ${role}`,
  }
}

function getWhiteoutBuildProfile(character) {
  const role = character?.role || 'Combat'
  const isRally = Boolean(character?.rallyJoiner || /Rally/i.test(role))
  const isHealer = Boolean(character?.healer || /Healer/i.test(role))
  const isTank = /Tank|Defense|Garrison/i.test(role)
  return {
    skillPriority: isHealer
      ? 'Prioritize healing/support skills, then survivability or team buffs.'
      : isRally
        ? 'Prioritize the key expedition/rally skill first, then combat damage and survivability.'
        : isTank
          ? 'Prioritize frontline defense/health and the skills that improve your formation’s durability.'
          : 'Prioritize the main damage skill first, followed by team utility and survivability.',
    formation: isHealer
      ? 'Support / Joiner'
      : isTank
        ? 'Frontline / Garrison'
        : isRally
          ? 'Rally / Joiner'
          : 'Damage / Arena',
    exclusiveGear: character?.rarity === 'Mythic' || character?.quality === 'SSR'
      ? 'Exclusive Gear recommended'
      : 'Standard hero progression',
  }
}

function GamePage() {
  const params = useParams()

  const gameSlug =
    params.gameSlug ||
    params.slug ||
    params.game ||
    ''

  const [search, setSearch] = useState('')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [generationFilter, setGenerationFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('default')
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  const game = useMemo(() => {
    if (!gamesData || !gameSlug) return null

    const rawSlug = String(gameSlug)

    let decodedSlug = rawSlug

    try {
      decodedSlug = decodeURIComponent(rawSlug)
    } catch {
      decodedSlug = rawSlug
    }

    const requestedSlug = slugify(decodedSlug)
    const compactRequestedSlug = requestedSlug.replace(/-/g, '')

    const matches = (key, item) => {
      if (key && slugify(key) === requestedSlug) return true

      if (
        key &&
        slugify(key).replace(/-/g, '') === compactRequestedSlug
      ) {
        return true
      }

      if (!item || typeof item !== 'object') return false

      const itemSlug = slugify(item.slug || '')
      const itemName = slugify(item.name || '')

      if (itemSlug === requestedSlug) return true

      if (
        itemSlug.replace(/-/g, '') === compactRequestedSlug
      ) {
        return true
      }

      if (itemName === requestedSlug) return true

      if (
        itemName.replace(/-/g, '') === compactRequestedSlug
      ) {
        return true
      }

      return false
    }

    if (Array.isArray(gamesData)) {
      return gamesData.find((item) => matches('', item)) || null
    }

    const match = Object.entries(gamesData).find(([key, item]) =>
      matches(key, item)
    )

    return match ? match[1] : null
  }, [gameSlug])

  const isGenshin =
    gameSlug === 'genshin-impact' ||
    game?.slug === 'genshin-impact' ||
    slugify(game?.name) === 'genshin-impact'

  const isWhiteout =
    gameSlug === 'whiteout-survival' ||
    game?.slug === 'whiteout-survival' ||
    slugify(game?.name) === 'whiteout-survival'

  const databaseCharacters = useMemo(() => {
    if (isGenshin) {
      return Array.isArray(genshinCharacters)
        ? genshinCharacters
        : []
    }

    /*
     * IMPORTANT:
     * Whiteout heroes MUST come from gamesData.js.
     * gameCharacters.js is intentionally NOT used for Whiteout.
     */
    if (isWhiteout) {
      return Array.isArray(whiteoutHeroes) ? whiteoutHeroes : []
    }

    if (game?.slug) {
      return gameCharacters?.[game.slug] || []
    }

    return []
  }, [isGenshin, isWhiteout, game])

  const allCharacters = useMemo(() => {
    if (!Array.isArray(databaseCharacters)) return []

    return databaseCharacters.filter(Boolean)
  }, [databaseCharacters])

  const generations = useMemo(() => {
    if (!isWhiteout) return []

    const values = allCharacters
      .map((character) => Number(getCharacterGeneration(character)))
      .filter((value) => Number.isFinite(value) && value >= 0 && value <= 17)

    return [...new Set(values)].sort((a, b) => b - a)
  }, [allCharacters, isWhiteout])

  const rarities = useMemo(() => {
    const values = allCharacters
      .map((character) => getCharacterRarity(character))
      .filter(Boolean)

    return [...new Set(values)]
  }, [allCharacters])

  const types = useMemo(() => {
    const values = allCharacters
      .map((character) => getCharacterType(character))
      .filter(Boolean)

    return [...new Set(values)]
  }, [allCharacters])

  const filteredCharacters = useMemo(() => {
    const query = search.trim().toLowerCase()

    let result = allCharacters.filter((character) => {
      const name = getCharacterName(character).toLowerCase()
      const rarity = String(getCharacterRarity(character)).toLowerCase()
      const type = String(getCharacterType(character)).toLowerCase()
      const generation = String(
        getCharacterGeneration(character)
      )

      const matchesSearch =
        !query ||
        name.includes(query) ||
        rarity.includes(query) ||
        type.includes(query) ||
        generation.includes(query)

      const matchesRarity =
        rarityFilter === 'all' ||
        String(getCharacterRarity(character)) === rarityFilter

      const matchesType =
        typeFilter === 'all' ||
        String(getCharacterType(character)) === typeFilter

      const matchesGeneration =
        generationFilter === 'all' ||
        String(getCharacterGeneration(character)) ===
          generationFilter

      return (
        matchesSearch &&
        matchesRarity &&
        matchesType &&
        matchesGeneration
      )
    })

    if (sortOrder === 'az') {
      result = [...result].sort((a, b) =>
        getCharacterName(a).localeCompare(getCharacterName(b))
      )
    }

    if (sortOrder === 'za') {
      result = [...result].sort((a, b) =>
        getCharacterName(b).localeCompare(getCharacterName(a))
      )
    }

    if (sortOrder === 'generation') {
      result = [...result].sort((a, b) => {
        const genA = Number(getCharacterGeneration(a))
        const genB = Number(getCharacterGeneration(b))

        return (
          (Number.isFinite(genB) ? genB : -1) -
          (Number.isFinite(genA) ? genA : -1)
        )
      })
    }

    return result
  }, [
    allCharacters,
    search,
    rarityFilter,
    typeFilter,
    generationFilter,
    sortOrder,
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

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedCharacter])

  useEffect(() => {
    document.body.style.overflow = selectedCharacter
      ? 'hidden'
      : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedCharacter])

  const selectedBuildProfile = selectedCharacter
    ? isGenshin
      ? getGenshinBuildProfile(selectedCharacter)
      : isWhiteout
        ? getWhiteoutBuildProfile(selectedCharacter)
        : null
    : null

  if (!game) {
    return (
      <main className="game-page">
        <div className="game-page-container">
          <section className="game-not-found">
            <span className="not-found-icon">🎮</span>
            <h1>Game Not Found</h1>
            <p>
              We could not find the game you are looking for.
            </p>
            <Link to="/" className="back-home-btn">
              Back to Home
            </Link>
          </section>
        </div>
      </main>
    )
  }

  const gameName = game.name || 'Game'
  const gameDescription =
    game.description ||
    `Explore the latest ${gameName} characters, guides, builds, and database information on GameNexa.`

  const heroImage =
    game.heroImage ||
    game.banner ||
    game.image ||
    ''

  const featured = Array.isArray(game.featured)
    ? game.featured
    : []

  const guides = Array.isArray(game.guides)
    ? game.guides
    : []

  const strategy = Array.isArray(game.strategy)
    ? game.strategy
    : []

  const gameClass = [
    'game-page',
    isGenshin ? 'game-theme-genshin' : '',
    isWhiteout ? 'game-theme-whiteout' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <main className={gameClass}>
      <SEO
        title={`${gameName} Database & Guides | GameNexa`}
        description={gameDescription}
      />

      <div className="game-page-container">
        <Link to="/" className="back-link">
          <span>←</span>
          Back to Games
        </Link>

        {/* HERO */}
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
                <strong>{allCharacters.length}</strong>
                <span>Characters</span>
              </div>

              <div className="game-stat">
                <strong>{guides.length}</strong>
                <span>Guides</span>
              </div>
            </div>
          </div>
        </section>

        {/* WHITEOUT QUICK INTELLIGENCE */}
        {isWhiteout && (
          <section className="whiteout-intel">
            <div className="whiteout-intel-heading">
              <span className="section-kicker">QUICK INTEL</span>
              <h2>Know your hero before you build.</h2>
              <p>Healers, rally joiners, classes and current-generation tiers at a glance.</p>
            </div>
            <div className="whiteout-intel-grid">
              <div className="intel-card"><span>HEALERS</span><strong>{whiteoutHeroMeta.healerNames.join(' · ')}</strong><small>Team sustain / defensive support</small></div>
              <div className="intel-card"><span>CORE JOINERS</span><strong>Jessie · Jasser · Jeronimo</strong><small>First expedition skill is the important joiner slot.</small></div>
              <div className="intel-card"><span>CLASSES</span><strong>Infantry · Lancer · Marksman</strong><small>Use the class and mode together when building a team.</small></div>
              <div className="intel-card"><span>ROSTER</span><strong>{whiteoutHeroMeta.rosterCount} heroes · Gen 1–17</strong><small>Search by name, class, rarity or generation below.</small></div>
            </div>
          </section>
        )}

        {/* DATABASE */}
        <section className="database-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">DATABASE</span>
              <h2>
                {isWhiteout
                  ? 'Whiteout Survival Heroes'
                  : isGenshin
                    ? 'Genshin Impact Characters'
                    : `${gameName} Characters`}
              </h2>

              <p>
                Browse, search and explore the complete character
                database.
              </p>
            </div>

            <div className="database-total">
              <strong>{filteredCharacters.length}</strong>
              <span>
                {filteredCharacters.length === 1
                  ? 'Hero Found'
                  : 'Heroes Found'}
              </span>
            </div>
          </div>

          {/* FILTERS */}
          <div className="character-filters">
            <label className="filter-search">
              <span>⌕</span>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search heroes..."
                aria-label="Search heroes"
              />
            </label>

            <label className="filter-control">
              <span>Rarity</span>
              <select
                value={rarityFilter}
                onChange={(event) =>
                  setRarityFilter(event.target.value)
                }
              >
                <option value="all">All Rarities</option>

                {rarities.map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarity}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-control">
              <span>Type</span>
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
              >
                <option value="all">All Types</option>

                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            {isWhiteout && (
              <label className="filter-control">
                <span>Generation</span>
                <select
                  value={generationFilter}
                  onChange={(event) =>
                    setGenerationFilter(event.target.value)
                  }
                >
                  <option value="all">All Generations</option>

                  {generations.map((generation) => (
                    <option
                      key={generation}
                      value={String(generation)}
                    >
                      Generation {generation}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="filter-control">
              <span>Sort</span>
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value)
                }
              >
                <option value="default">Default</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>

                {isWhiteout && (
                  <option value="generation">
                    Generation
                  </option>
                )}
              </select>
            </label>

            <button
              type="button"
              className="reset-filters"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>

          {/* CHARACTER GRID */}
          {filteredCharacters.length > 0 ? (
            <div
              className={`character-grid ${
                isWhiteout ? 'whiteout-character-grid' : ''
              }`}
            >
              {filteredCharacters.map((character, index) => {
                const name = getCharacterName(character)
                const image = getCharacterImage(character)
                const rarity = getCharacterRarity(character)
                const type = getCharacterType(character)
                const generation =
                  getCharacterGeneration(character)

                return (
                  <article
                    className="character-card"
                    key={
                      character.id ||
                      character.slug ||
                      `${name}-${generation}-${index}`
                    }
                    onClick={() =>
                      setSelectedCharacter(character)
                    }
                  >
                    <div className="character-card-image">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              'none'

                            const fallback =
                              event.currentTarget.parentElement?.querySelector(
                                '.character-image-fallback'
                              )

                            if (fallback) {
                              fallback.style.display = 'flex'
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className="character-image-fallback"
                        style={{
                          display: image ? 'none' : 'flex',
                        }}
                      >
                        <span>✦</span>
                      </div>

                      <div className="character-image-gradient" />

                      {generation !== '' &&
                        generation !== null &&
                        generation !== undefined && (
                          <span className="generation-badge">
                            GEN {generation}
                          </span>
                        )}
                    </div>

                    <div className="character-card-content">
                      <div className="character-card-topline">
                        <span className="character-type">
                          {type || 'Character'}
                        </span>

                        {rarity && (
                          <span className="character-rarity">
                            {rarity}
                          </span>
                        )}
                      </div>

                      <h3>{name}</h3>

                      {character.subtitle && (
                        <p className="character-subtitle">
                          {character.subtitle}
                        </p>
                      )}

                      {character.role && (
                        <div className="character-role">
                          <span>Role</span>
                          <strong>{character.role}</strong>
                        </div>
                      )}

                      <div className="character-card-meta">
                        {isGenshin ? (
                          <>
                            <span><b>Element</b>{character.element || '—'}</span>
                            <span><b>Weapon</b>{character.weapon || '—'}</span>
                            <span><b>Region</b>{character.region || '—'}</span>
                            <span><b>Version</b>{character.version || '—'}</span>
                          </>
                        ) : isWhiteout ? (
                          <>
                            <span><b>Class</b>{character.troopType || '—'}</span>
                            <span><b>Gen</b>{character.generation || '—'}</span>
                            <span><b>Tier</b>{character.tier || '—'}</span>
                            <span><b>Best for</b>{character.bestFor || 'General'}</span>
                          </>
                        ) : null}
                      </div>

                      <p className="character-description">
                        {character.description ||
                          character.notes ||
                          (isGenshin
                            ? `${character.name} is a ${character.role?.toLowerCase() || 'combat'} character. Open the profile for build direction, stats and progression notes.`
                            : `${character.name} is a ${character.role?.toLowerCase() || 'combat'} hero. Open the profile for role, tier, formation and upgrade guidance.`)}
                      </p>

                      <button
                        type="button"
                        className="view-details-btn"
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedCharacter(character)
                        }}
                      >
                        View Details
                        <span>→</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span>⌕</span>
              <h3>No heroes found</h3>
              <p>
                Try changing your search or filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* FEATURED */}
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
              {featured.map((item, index) => (
                <article
                  className="featured-card"
                  key={item.id || item.title || index}
                >
                  {item.image && (
                    <div className="featured-image">
                      <img
                        src={item.image}
                        alt={item.title || 'Featured content'}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="featured-content">
                    {item.category && (
                      <span>{item.category}</span>
                    )}

                    <h3>{item.title}</h3>

                    {item.description && (
                      <p>{item.description}</p>
                    )}

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Explore →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* WHITEOUT STRATEGY */}
        {isWhiteout && (
          <section className="content-section strategy-hub">
            <div className="section-title-row">
              <div>
                <span className="section-kicker">
                  WHITEOUT SURVIVAL
                </span>
                <h2>Strategy Hub</h2>
                <p>
                  Build smarter teams and dominate every
                  stage of the game.
                </p>
              </div>
            </div>

            <div className="strategy-grid">
              {(
                strategy.length > 0
                  ? strategy
                  : [
                      {
                        title: 'Hero Generations',
                        description:
                          'Understand hero generations and build your lineup around the strongest available heroes.',
                        icon: '⚔',
                      },
                      {
                        title: 'Bear Trap',
                        description:
                          'Choose the right rally heroes and maximize your damage during Bear Trap.',
                        icon: '🐻',
                      },
                      {
                        title: 'Arena',
                        description:
                          'Learn which heroes perform best in PvP and how to build an effective Arena lineup.',
                        icon: '🏆',
                      },
                    ]
              ).map((item, index) => (
                <article
                  className="strategy-card"
                  key={item.id || item.title || index}
                >
                  <div className="strategy-icon">
                    {item.icon || '✦'}
                  </div>

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
                      Learn More →
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* GUIDES */}
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
              {guides.map((guide, index) => (
                <article
                  className="guide-card"
                  key={guide.id || guide.title || index}
                >
                  {guide.image && (
                    <div className="guide-image">
                      <img
                        src={guide.image}
                        alt={guide.title || 'Game guide'}
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

                    <h3>{guide.title}</h3>

                    {guide.description && (
                      <p>{guide.description}</p>
                    )}

                    {guide.link && (
                      <a
                        href={guide.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Read Guide →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {isWhiteout && (
          <p className="asset-credit-note">Whiteout Survival character artwork is shown for fan-database reference. GameNexa does not claim ownership of the game artwork.</p>
        )}
      </div>

      {/* CHARACTER MODAL */}
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
              ×
            </button>

            <div className="modal-header">
              <div className="modal-character-image">
                {getCharacterImage(selectedCharacter) ? (
                  <img
                    src={getCharacterImage(selectedCharacter)}
                    alt={getCharacterName(selectedCharacter)}
                  />
                ) : (
                  <span>✦</span>
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
                  {getCharacterName(selectedCharacter)}
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
                      ? `${getCharacterName(selectedCharacter)} is a ${selectedCharacter.role || 'playable'} ${selectedCharacter.element || ''} character using a ${selectedCharacter.weapon || 'weapon'}. Use the build snapshot below as a practical starting point, then tune it to your team and rotation.`
                      : `${getCharacterName(selectedCharacter)} is a Generation ${selectedCharacter.generation || '—'} ${selectedCharacter.troopType || ''} hero. Review the role, tier, best-use mode and upgrade guidance below before investing resources.`)}
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
                    <strong>{selectedCharacter.tier}</strong>
                  </div>
                )}

                {selectedCharacter.bestFor && (
                  <div className="detail-box">
                    <span>Best For</span>
                    <strong>{selectedCharacter.bestFor}</strong>
                  </div>
                )}

                {selectedCharacter.healer !== undefined && (
                  <div className="detail-box">
                    <span>Healer</span>
                    <strong>{selectedCharacter.healer ? 'Yes' : 'No'}</strong>
                  </div>
                )}

                {selectedCharacter.rallyJoiner !== undefined && (
                  <div className="detail-box">
                    <span>Rally Joiner</span>
                    <strong>{selectedCharacter.rallyJoiner ? 'Yes' : 'Situational'}</strong>
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
                      <span>Generation</span>
                      <strong>
                        {selectedCharacter.generation}
                      </strong>
                    </div>
                  )}

                {selectedCharacter.element && (
                  <div className="detail-box">
                    <span>Element</span>
                    <strong>
                      {selectedCharacter.element}
                    </strong>
                  </div>
                )}

                {selectedCharacter.weapon && (
                  <div className="detail-box">
                    <span>Weapon</span>
                    <strong>
                      {typeof selectedCharacter.weapon ===
                      'object'
                        ? selectedCharacter.weapon.name
                        : selectedCharacter.weapon}
                    </strong>
                  </div>
                )}

                {selectedCharacter.region && (
                  <div className="detail-box">
                    <span>Region</span>
                    <strong>{selectedCharacter.region}</strong>
                  </div>
                )}

                {selectedCharacter.version && (
                  <div className="detail-box">
                    <span>Version</span>
                    <strong>{selectedCharacter.version}</strong>
                  </div>
                )}

                {selectedCharacter.releaseDate && (
                  <div className="detail-box">
                    <span>Release</span>
                    <strong>{selectedCharacter.releaseDate}</strong>
                  </div>
                )}

                {selectedCharacter.modelType && (
                  <div className="detail-box">
                    <span>Model</span>
                    <strong>{selectedCharacter.modelType}</strong>
                  </div>
                )}

                {selectedCharacter.bearTrap && (
                  <div className="detail-box">
                    <span>Bear Trap</span>
                    <strong>
                      {selectedCharacter.bearTrap}
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
                        {isGenshin ? 'BUILD SNAPSHOT' : 'HERO INTEL'}
                      </span>
                      <h3>{isGenshin ? 'Recommended Build Direction' : 'Recommended Hero Setup'}</h3>
                    </div>
                    <span className="build-source-badge">
                      {isGenshin ? 'Build guidance' : 'Current roster data'}
                    </span>
                  </div>

                  {isGenshin ? (
                    <>
                      <div className="hero-build-grid">
                        <div className="build-box">
                          <span>Artifacts</span>
                          <strong>{selectedBuildProfile.artifacts}</strong>
                        </div>
                        <div className="build-box">
                          <span>Main Stats</span>
                          <strong>{selectedBuildProfile.mainStats}</strong>
                        </div>
                        <div className="build-box">
                          <span>Substats</span>
                          <strong>{selectedBuildProfile.substats}</strong>
                        </div>
                        <div className="build-box">
                          <span>Talent Priority</span>
                          <strong>{selectedBuildProfile.talentPriority}</strong>
                        </div>
                      </div>
                      <div className="build-callout">
                        <b>Weapon</b>
                        <span>{selectedBuildProfile.weaponAdvice}</span>
                      </div>
                      <div className="build-callout">
                        <b>Ascension</b>
                        <span>{selectedBuildProfile.ascensionGem} + character-specific local, boss and enemy materials.</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="hero-build-grid">
                        <div className="build-box">
                          <span>Formation</span>
                          <strong>{selectedBuildProfile.formation}</strong>
                        </div>
                        <div className="build-box">
                          <span>Exclusive Gear</span>
                          <strong>{selectedBuildProfile.exclusiveGear}</strong>
                        </div>
                        <div className="build-box">
                          <span>Class</span>
                          <strong>{selectedCharacter.troopType || 'Infantry / Lancer / Marksman'}</strong>
                        </div>
                        <div className="build-box">
                          <span>Best For</span>
                          <strong>{selectedCharacter.bestFor || 'General combat'}</strong>
                        </div>
                      </div>
                      <div className="build-callout">
                        <b>Skill Priority</b>
                        <span>{selectedBuildProfile.skillPriority}</span>
                      </div>
                    </>
                  )}
                </section>
              )}

              {selectedCharacter.synergy && (
                <section className="modal-section modal-advice-section">
                  <h3>Team Synergy</h3>
                  <p>{selectedCharacter.synergy}</p>
                </section>
              )}

              {selectedCharacter.notes && (
                <section className="modal-section modal-advice-section">
                  <h3>GameNexa Notes</h3>
                  <p>{selectedCharacter.notes}</p>
                </section>
              )}

              {selectedCharacter.skills &&
                Array.isArray(
                  selectedCharacter.skills
                ) &&
                selectedCharacter.skills.length > 0 && (
                  <section className="modal-section">
                    <h3>Skills</h3>

                    <div className="skills-list">
                      {selectedCharacter.skills.map(
                        (skill, index) => (
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
                                src={skill.image}
                                alt={skill.name || 'Skill'}
                              />
                            )}

                            <div>
                              <h4>
                                {skill.name ||
                                  `Skill ${index + 1}`}
                              </h4>

                              {skill.description && (
                                <p>
                                  {skill.description}
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
                  Build guidance is a practical starting point compiled from current Genshin build conventions. Character identity data follows the local database; verify patch-specific changes before spending premium resources.
                </p>
              )}

              {isWhiteout && (
                <p className="hero-data-source">
                  Whiteout Survival hero generation, class and role data is maintained against the current roster research. Exclusive Gear is specific to gold-quality heroes and adds extra hero/command bonuses.
                </p>
              )}

              {selectedCharacter.expedition &&
                Array.isArray(
                  selectedCharacter.expedition
                ) && (
                  <section className="modal-section">
                    <h3>Expedition</h3>

                    <div className="skills-list">
                      {selectedCharacter.expedition.map(
                        (skill, index) => (
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
                                src={skill.image}
                                alt={skill.name || 'Skill'}
                              />
                            )}

                            <div>
                              <h4>{skill.name}</h4>

                              {skill.description && (
                                <p>
                                  {skill.description}
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
                  selectedCharacter.weapon.skills
                ) && (
                  <section className="modal-section">
                    <h3>
                      {selectedCharacter.weapon.name ||
                        'Weapon'}
                    </h3>

                    <div className="skills-list">
                      {selectedCharacter.weapon.skills.map(
                        (skill, index) => (
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
                                src={skill.image}
                                alt={skill.name || 'Weapon skill'}
                              />
                            )}

                            <div>
                              <h4>{skill.name}</h4>

                              {skill.description && (
                                <p>
                                  {skill.description}
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
                  <h3>How to Get</h3>
                  <p>
                    {selectedCharacter.howToGet}
                  </p>
                </section>
              )}

              {selectedCharacter.notes && (
                <section className="modal-section">
                  <h3>Notes</h3>
                  <p>{selectedCharacter.notes}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default GamePage