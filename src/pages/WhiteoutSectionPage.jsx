import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SEO } from '../SEO'
import { whiteoutHeroes } from '../data/whiteoutHeroes'
import './WhiteoutSectionPage.css'

const BASE = '/game/whiteout-survival'

const SECTIONS = {
  facilities: {
    icon: '🏭',
    title: 'Whiteout Survival Facilities',
    shortTitle: 'Facilities',
    description: 'Explore Whiteout Survival facilities, their purposes, locations, strategic value and event uses.',
    intro: 'Whiteout Survival facilities are important objectives that can influence state events, alliance strategy and battlefield control.',
    keywords: 'Whiteout Survival facilities, Whiteout Survival facility guide, facilities locations, state facilities, event facilities',
    headings: [
      ['Facility Types', 'Learn about important event and state facilities and what each facility is used for.'],
      ['Facility Locations', 'Understand how facility locations affect rallies, movement, control and alliance planning.'],
      ['Facility Strategy', 'Use facility information to prepare your alliance for events and important state objectives.'],
    ],
  },

  fortresses: {
    icon: '🏰',
    title: 'Whiteout Survival Fortresses',
    shortTitle: 'Fortresses',
    description: 'Learn about Whiteout Survival fortresses, objectives, control, territory and alliance strategy.',
    intro: 'Fortresses are important alliance objectives that require preparation, coordination and strategic control.',
    keywords: 'Whiteout Survival fortresses, fortress guide, fortress locations, fortress strategy',
    headings: [
      ['Fortress Objectives', 'Understand fortress objectives and why alliances compete for strategic control.'],
      ['Fortress Preparation', 'Prepare rallies, troops, assignments and alliance coordination before fortress events.'],
      ['Fortress Strategy', 'Use timing, territory and coordinated attacks to improve fortress control.'],
    ],
  },

  strongholds: {
    icon: '🛡️',
    title: 'Whiteout Survival Strongholds',
    shortTitle: 'Strongholds',
    description: 'Whiteout Survival stronghold guide covering objectives, control priorities and alliance preparation.',
    intro: 'Strongholds are valuable strategic objectives where alliance coordination and timing can make a major difference.',
    keywords: 'Whiteout Survival strongholds, stronghold guide, stronghold strategy',
    headings: [
      ['Stronghold Objectives', 'Learn how strongholds fit into alliance progression and state events.'],
      ['Stronghold Preparation', 'Organize troops, rallies and assignments before stronghold battles.'],
      ['Stronghold Strategy', 'Prioritize objectives and coordinate your alliance for efficient control.'],
    ],
  },

  resources: {
    icon: '🌲',
    title: 'Whiteout Survival Resources',
    shortTitle: 'Resources',
    description: 'Whiteout Survival resources guide covering Wood, Coal, Iron, Meat and resource planning.',
    intro: 'Resources are essential for construction, research, troop training and overall settlement progression.',
    keywords: 'Whiteout Survival resources, wood, coal, iron, meat, resource guide',
    headings: [
      ['Resource Types', 'Learn how Wood, Coal, Iron and Meat support settlement progression.'],
      ['Resource Gathering', 'Improve gathering efficiency by choosing appropriate troops, locations and timing.'],
      ['Resource Planning', 'Plan resource requirements before major upgrades, research and troop training.'],
    ],
  },

  'alliance-territory': {
    icon: '👥',
    title: 'Whiteout Survival Alliance Territory',
    shortTitle: 'Alliance Territory',
    description: 'Whiteout Survival alliance territory guide covering HQ, banners, connections and expansion.',
    intro: 'Alliance territory connects your alliance to important facilities, objectives and strategic locations.',
    keywords: 'Whiteout Survival alliance territory, alliance HQ, alliance banners, territory guide',
    headings: [
      ['Alliance HQ', 'Understand the role of the alliance HQ and how it supports territorial expansion.'],
      ['Alliance Banners', 'Use banners to connect territory and establish useful strategic routes.'],
      ['Territory Expansion', 'Plan connected territory carefully around important objectives and facilities.'],
    ],
  },

  events: {
    icon: '⚔️',
    title: 'Whiteout Survival Events',
    shortTitle: 'Events',
    description: 'Whiteout Survival events guide covering Bear Trap, Crazy Joe, Foundry Battle, Canyon Clash and more.',
    intro: 'Events are a major part of Whiteout Survival progression, rewards and alliance activity.',
    keywords: 'Whiteout Survival events, Bear Trap, Crazy Joe, Foundry Battle, Canyon Clash',
    headings: [
      ['Major Events', 'Explore major alliance and state events including Bear Trap, Crazy Joe, Foundry Battle and Canyon Clash.'],
      ['Event Preparation', 'Prepare heroes, troops, formations, speedups and resources before important events.'],
      ['Event Strategy', 'Use event-specific strategies to improve participation and alliance rewards.'],
    ],
  },

  buildings: {
    icon: '🏗️',
    title: 'Whiteout Survival Buildings',
    shortTitle: 'Buildings',
    description: 'Whiteout Survival buildings guide covering Furnace, Embassy, Command Center, Infirmary and progression.',
    intro: 'Buildings determine settlement progression and unlock important features, troop capacity and research opportunities.',
    keywords: 'Whiteout Survival buildings, Furnace guide, Embassy, Command Center, Infirmary',
    headings: [
      ['Core Buildings', 'Learn about the Furnace and other important buildings that drive settlement progression.'],
      ['Building Priorities', 'Prioritize upgrades according to progression requirements and resource availability.'],
      ['Building Strategy', 'Plan construction queues and resources before starting major upgrades.'],
    ],
  },

  research: {
    icon: '🔬',
    title: 'Whiteout Survival Research',
    shortTitle: 'Research',
    description: 'Whiteout Survival research guide covering Economy, Battle and research progression.',
    intro: 'Research improves your settlement, economy, troops and combat capabilities.',
    keywords: 'Whiteout Survival research, research guide, economy research, battle research',
    headings: [
      ['Economy Research', 'Improve resource production, gathering and settlement development through economy research.'],
      ['Battle Research', 'Increase combat effectiveness through battle-focused research upgrades.'],
      ['Research Priorities', 'Choose research priorities according to your current progression and gameplay goals.'],
    ],
  },

  troops: {
    icon: '🪖',
    title: 'Whiteout Survival Troops',
    shortTitle: 'Troops',
    description: 'Whiteout Survival troops guide covering Infantry, Lancer and Marksman roles, formations and training.',
    intro: 'Troops are the foundation of combat, rallies, defense and alliance events in Whiteout Survival.',
    keywords: 'Whiteout Survival troops, Infantry, Lancer, Marksman, troop guide',
    headings: [
      ['Infantry', 'Infantry troops provide frontline durability and are important for many formations.'],
      ['Lancer', 'Lancers provide damage and mobility-focused combat capabilities.'],
      ['Marksman', 'Marksmen provide ranged damage and should be used according to formation and event requirements.'],
    ],
  },

  'alliance-planner': {
    icon: '🧭',
    title: 'Whiteout Survival Alliance Planner',
    shortTitle: 'Alliance Planner',
    description: 'Whiteout Survival alliance planner for objectives, rallies, territory movement and event assignments.',
    intro: 'Use alliance planning tools to organize objectives, assignments, rallies and event preparation.',
    keywords: 'Whiteout Survival alliance planner, alliance strategy, rally planner, event planner',
    headings: [
      ['Objective Planning', 'Organize important alliance objectives and assign priorities before events.'],
      ['Rally Planning', 'Coordinate rally leads, reinforcements and timing for important battles.'],
      ['Alliance Assignments', 'Keep event roles and strategic assignments organized for better coordination.'],
    ],
  },
}

const HEROES_COLLECTION_KEY = 'cms.collection.whiteout-survival.heroes'

function normalizeHero(hero, index = 0) {
  return {
    id: hero?.id || hero?.heroId || hero?.heroSlug || `hero-${index}`,
    slug: hero?.slug || hero?.heroSlug || hero?.id || `hero-${index}`,
    name: hero?.name || hero?.heroName || hero?.title || 'Unknown Hero',
    image: hero?.image || hero?.imageUrl || hero?.avatar || '',
    rarity: hero?.rarity || hero?.stars || '',
    generation: hero?.generation || hero?.gen || '',
    role: hero?.role || hero?.type || '',
    description: hero?.description || hero?.desc || '',
  }
}

function getStaticHeroes() {
  return Array.isArray(whiteoutHeroes)
    ? whiteoutHeroes.map((hero, index) => normalizeHero(hero, index))
    : Object.values(whiteoutHeroes || {}).map((hero, index) =>
        normalizeHero(hero, index)
      )
}

function mergeHeroes(staticHeroes, cmsHeroes) {
  const result = [...staticHeroes]

  cmsHeroes.forEach((cms, index) => {
    const normalized = normalizeHero(cms, index)

    const existingIndex = result.findIndex(
      hero =>
        hero.slug === normalized.slug ||
        hero.id === normalized.id ||
        hero.name.toLowerCase() === normalized.name.toLowerCase()
    )

    if (existingIndex >= 0) {
      result[existingIndex] = {
        ...result[existingIndex],
        ...normalized,
      }
    } else {
      result.push(normalized)
    }
  })

  return result
}

function HeroDatabase() {
  const [heroes, setHeroes] = useState(getStaticHeroes)
  const [search, setSearch] = useState('')
  const [rarity, setRarity] = useState('all')
  const [role, setRole] = useState('all')
  const [generation, setGeneration] = useState('all')

  useEffect(() => {
    let cancelled = false

    async function loadCMSHeroes() {
      try {
        const response = await fetch('/api/content')
        if (!response.ok) return

        const content = await response.json()
        const raw = content?.[HEROES_COLLECTION_KEY]

        if (!raw) return

        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
        const cmsHeroes = Array.isArray(parsed)
          ? parsed.filter(item => item?.status !== 'draft')
          : []

        if (!cancelled) {
          setHeroes(mergeHeroes(getStaticHeroes(), cmsHeroes))
        }
      } catch {
        // Static database remains available if CMS is unavailable.
      }
    }

    loadCMSHeroes()

    return () => {
      cancelled = true
    }
  }, [])

  const rarities = useMemo(
    () => [...new Set(heroes.map(hero => hero.rarity).filter(Boolean))],
    [heroes]
  )

  const roles = useMemo(
    () => [...new Set(heroes.map(hero => hero.role).filter(Boolean))],
    [heroes]
  )

  const generations = useMemo(
    () => [...new Set(heroes.map(hero => hero.generation).filter(Boolean))],
    [heroes]
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return heroes.filter(hero => {
      const matchesSearch =
        !query ||
        hero.name.toLowerCase().includes(query) ||
        hero.role.toLowerCase().includes(query) ||
        String(hero.generation).toLowerCase().includes(query)

      const matchesRarity =
        rarity === 'all' || String(hero.rarity) === String(rarity)

      const matchesRole = role === 'all' || hero.role === role

      const matchesGeneration =
        generation === 'all' ||
        String(hero.generation) === String(generation)

      return (
        matchesSearch &&
        matchesRarity &&
        matchesRole &&
        matchesGeneration
      )
    })
  }, [heroes, search, rarity, role, generation])

  return (
    <section className="whiteout-database">
      <div className="whiteout-database-head">
        <div>
          <span className="whiteout-section-kicker">WHITEOUT SURVIVAL DATABASE</span>
          <h2>Heroes</h2>
          <p>
            Search and filter the complete GameNexa Whiteout Survival hero database.
          </p>
        </div>

        <strong>{filtered.length} Heroes Found</strong>
      </div>

      <div className="whiteout-database-controls">
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search heroes..."
        />

        <select value={rarity} onChange={event => setRarity(event.target.value)}>
          <option value="all">All Rarities</option>
          {rarities.map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <select value={role} onChange={event => setRole(event.target.value)}>
          <option value="all">All Roles</option>
          {roles.map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <select
          value={generation}
          onChange={event => setGeneration(event.target.value)}
        >
          <option value="all">All Generations</option>
          {generations.map(value => (
            <option key={value} value={value}>
              Generation {value}
            </option>
          ))}
        </select>
      </div>

      <div className="whiteout-hero-grid">
        {filtered.map(hero => (
          <article className="whiteout-hero-card" key={hero.id || hero.slug}>
            <div className="whiteout-hero-image">
              {hero.image ? (
                <img src={hero.image} alt={hero.name} loading="lazy" />
              ) : (
                <div className="whiteout-hero-placeholder">🦸</div>
              )}
            </div>

            <div className="whiteout-hero-card-body">
              <h3>{hero.name}</h3>

              <div className="whiteout-hero-meta">
                {hero.rarity && <span>{hero.rarity}</span>}
                {hero.role && <span>{hero.role}</span>}
                {hero.generation && <span>Gen {hero.generation}</span>}
              </div>

              {hero.description && (
                <p>{hero.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <div className="whiteout-empty">
          No heroes found for the selected filters.
        </div>
      )}
    </section>
  )
}

function SpeedupCalculator() {
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')

  const totalMinutes =
    (Number(days) || 0) * 1440 +
    (Number(hours) || 0) * 60 +
    (Number(minutes) || 0)

  const resultDays = Math.floor(totalMinutes / 1440)
  const resultHours = Math.floor((totalMinutes % 1440) / 60)
  const resultMinutes = totalMinutes % 60

  return (
    <div className="whiteout-calculator-card">
      <h3>Speedup Calculator</h3>
      <p>Convert days, hours and minutes into a total speedup duration.</p>

      <div className="whiteout-calc-inputs">
        <input type="number" min="0" value={days} onChange={e => setDays(e.target.value)} placeholder="Days" />
        <input type="number" min="0" value={hours} onChange={e => setHours(e.target.value)} placeholder="Hours" />
        <input type="number" min="0" value={minutes} onChange={e => setMinutes(e.target.value)} placeholder="Minutes" />
      </div>

      <div className="whiteout-calc-result">
        {resultDays}d {resultHours}h {resultMinutes}m
      </div>

      <small>{totalMinutes.toLocaleString()} total minutes</small>
    </div>
  )
}

function ResourceCalculator() {
  const [wood, setWood] = useState('')
  const [coal, setCoal] = useState('')
  const [iron, setIron] = useState('')
  const [meat, setMeat] = useState('')

  const total =
    (Number(wood) || 0) +
    (Number(coal) || 0) +
    (Number(iron) || 0) +
    (Number(meat) || 0)

  return (
    <div className="whiteout-calculator-card">
      <h3>Resource Calculator</h3>
      <p>Enter resource amounts to calculate your combined resource total.</p>

      <div className="whiteout-calc-inputs whiteout-calc-four">
        <input type="number" min="0" value={wood} onChange={e => setWood(e.target.value)} placeholder="Wood" />
        <input type="number" min="0" value={coal} onChange={e => setCoal(e.target.value)} placeholder="Coal" />
        <input type="number" min="0" value={iron} onChange={e => setIron(e.target.value)} placeholder="Iron" />
        <input type="number" min="0" value={meat} onChange={e => setMeat(e.target.value)} placeholder="Meat" />
      </div>

      <div className="whiteout-calc-result">
        {total.toLocaleString()} total resources
      </div>
    </div>
  )
}

function TroopPlanner() {
  const [infantry, setInfantry] = useState('')
  const [lancer, setLancer] = useState('')
  const [marksman, setMarksman] = useState('')

  const total =
    (Number(infantry) || 0) +
    (Number(lancer) || 0) +
    (Number(marksman) || 0)

  return (
    <div className="whiteout-calculator-card">
      <h3>Troop Planner</h3>
      <p>Plan your Infantry, Lancer and Marksman troop counts.</p>

      <div className="whiteout-calc-inputs">
        <input type="number" min="0" value={infantry} onChange={e => setInfantry(e.target.value)} placeholder="Infantry" />
        <input type="number" min="0" value={lancer} onChange={e => setLancer(e.target.value)} placeholder="Lancer" />
        <input type="number" min="0" value={marksman} onChange={e => setMarksman(e.target.value)} placeholder="Marksman" />
      </div>

      <div className="whiteout-calc-result">
        {total.toLocaleString()} total troops
      </div>
    </div>
  )
}

function CalculatorsPage() {
  return (
    <section className="whiteout-calculators">
      <div className="whiteout-tool-intro">
        <span className="whiteout-section-kicker">WHITEOUT SURVIVAL TOOLS</span>
        <h2>Whiteout Survival Calculators</h2>
        <p>
          Use these GameNexa tools to calculate speedups, resources and troop planning.
        </p>
      </div>

      <div className="whiteout-calculator-grid">
        <ResourceCalculator />
        <SpeedupCalculator />
        <TroopPlanner />
      </div>
    </section>
  )
}

function BattleMapsPage() {
  const [map, setMap] = useState('foundry')
  const [fullscreen, setFullscreen] = useState(false)

  const maps = {
    foundry: {
      title: 'Foundry Battle Map',
      image: '/maps/foundry-battle-4k.jpg',
      description: 'Foundry Battle map for alliance objective and movement planning.',
    },
    canyon: {
      title: 'Canyon Clash Map',
      image: '/maps/canyon-clash-4k.jpg',
      description: 'Canyon Clash map for attack, defense and alliance coordination.',
    },
  }

  const current = maps[map]

  return (
    <section className="whiteout-maps">
      <div className="whiteout-tool-intro">
        <span className="whiteout-section-kicker">WHITEOUT SURVIVAL MAPS</span>
        <h2>Battle Maps</h2>
        <p>
          Use the available battle maps for Foundry Battle and Canyon Clash planning.
        </p>
      </div>

      <div className="whiteout-map-tabs">
        {Object.entries(maps).map(([id, item]) => (
          <button
            key={id}
            className={map === id ? 'active' : ''}
            onClick={() => setMap(id)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="whiteout-map-card">
        <div className="whiteout-map-card-head">
          <div>
            <h3>{current.title}</h3>
            <p>{current.description}</p>
          </div>

          <button
            className="whiteout-map-fullscreen"
            onClick={() => setFullscreen(true)}
          >
            ⛶ Fullscreen
          </button>
        </div>

        <div className="whiteout-map-image-wrap">
          <img src={current.image} alt={current.title} />
        </div>
      </div>

      {fullscreen && (
        <div
          className="whiteout-map-modal"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="whiteout-map-close"
            onClick={() => setFullscreen(false)}
          >
            ✕
          </button>

          <img
            src={current.image}
            alt={current.title}
            onClick={event => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}

function GenericSection({ data, section }) {
  return (
    <>
      {data.headings.map(([heading, text]) => (
        <article className="whiteout-seo-section" key={heading}>
          <h2>{heading}</h2>
          <p>{text}</p>
        </article>
      ))}

      <section className="whiteout-seo-section">
        <h2>Whiteout Survival {data.shortTitle} Guide</h2>
        <p>
          GameNexa organizes Whiteout Survival information into dedicated,
          searchable resources designed for players and alliance leaders.
        </p>
        <p>
          This page is part of the GameNexa Whiteout Survival knowledge base.
        </p>
      </section>
    </>
  )
}

function WhiteoutSectionPage() {
  const { section } = useParams()

  if (section === 'heroes') {
    return (
      <>
        <SEO
          title="Whiteout Survival Heroes | Hero Database"
          description="Browse the Whiteout Survival hero database on GameNexa with searchable heroes, roles, generations and practical information."
          keywords="Whiteout Survival heroes, Whiteout Survival hero database, hero guide, hero roles, hero generations"
          canonical={`${BASE}/heroes`}
        />

        <main className="whiteout-section-page">
          <div className="whiteout-section-inner">
            <div className="whiteout-breadcrumb">
              <Link to="/">GameNexa</Link>
              <span>›</span>
              <Link to={BASE}>Whiteout Survival</Link>
              <span>›</span>
              <span>Heroes</span>
            </div>

            <HeroDatabase />
          </div>
        </main>
      </>
    )
  }

  if (section === 'calculators') {
    return (
      <>
        <SEO
          title="Whiteout Survival Calculators | GameNexa"
          description="Use Whiteout Survival calculators for resources, speedups and troop planning on GameNexa."
          keywords="Whiteout Survival calculator, resource calculator, speedup calculator, troop calculator, progression calculator"
          canonical={`${BASE}/calculators`}
        />

        <main className="whiteout-section-page">
          <div className="whiteout-section-inner">
            <div className="whiteout-breadcrumb">
              <Link to="/">GameNexa</Link>
              <span>›</span>
              <Link to={BASE}>Whiteout Survival</Link>
              <span>›</span>
              <span>Calculators</span>
            </div>

            <CalculatorsPage />
          </div>
        </main>
      </>
    )
  }

  if (section === 'battle-maps') {
    return (
      <>
        <SEO
          title="Whiteout Survival Battle Maps | Foundry & Canyon Clash"
          description="View Whiteout Survival Foundry Battle and Canyon Clash maps for alliance planning and event preparation."
          keywords="Whiteout Survival map, Whiteout Survival battle map, Foundry map, Canyon Clash map, alliance map"
          canonical={`${BASE}/battle-maps`}
        />

        <main className="whiteout-section-page">
          <div className="whiteout-section-inner">
            <div className="whiteout-breadcrumb">
              <Link to="/">GameNexa</Link>
              <span>›</span>
              <Link to={BASE}>Whiteout Survival</Link>
              <span>›</span>
              <span>Battle Maps</span>
            </div>

            <BattleMapsPage />
          </div>
        </main>
      </>
    )
  }

  const data = SECTIONS[section]

  if (!data) {
    return (
      <main className="whiteout-section-page">
        <div className="whiteout-section-inner">
          <h1>Whiteout Survival Page Not Found</h1>
          <Link to={BASE}>Open Whiteout Survival</Link>
        </div>
      </main>
    )
  }

  const path = `${BASE}/${section}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    keywords: data.keywords,
    url: `https://gamenexa.gamenexa.workers.dev${path}`,
    publisher: {
      '@type': 'Organization',
      name: 'GameNexa',
    },
  }

  return (
    <>
      <SEO
        title={`${data.title} | GameNexa`}
        description={data.description}
        keywords={data.keywords}
        canonical={`https://gamenexa.gamenexa.workers.dev${path}`}
        jsonLd={jsonLd}
      />

      <main className="whiteout-section-page">
        <div className="whiteout-section-inner">

          <div className="whiteout-breadcrumb">
            <Link to="/">GameNexa</Link>
            <span>›</span>
            <Link to={BASE}>Whiteout Survival</Link>
            <span>›</span>
            <span>{data.shortTitle}</span>
          </div>

          <header className="whiteout-section-hero">
            <div className="whiteout-section-icon">
              {data.icon}
            </div>

            <div>
              <span className="whiteout-section-kicker">
                WHITEOUT SURVIVAL
              </span>

              <h1>{data.title}</h1>

              <p>{data.intro}</p>
            </div>
          </header>

          <div className="whiteout-section-content">
            <div className="whiteout-main-column">
              <GenericSection data={data} section={section} />
            </div>

            <aside className="whiteout-section-sidebar">
              <div className="whiteout-sidebar-card">
                <span className="whiteout-section-kicker">
                  WHITEOUT SURVIVAL HUB
                </span>

                <h2>Explore Whiteout Survival</h2>

                <div className="whiteout-related-links">
                  {Object.entries(SECTIONS).map(([slug, item]) => (
                    <Link
                      key={slug}
                      to={`${BASE}/${slug}`}
                      className={slug === section ? 'active' : ''}
                    >
                      <span>{item.icon}</span>
                      {item.shortTitle}
                    </Link>
                  ))}

                  <Link
                    to={`${BASE}/heroes`}
                    className={section === 'heroes' ? 'active' : ''}
                  >
                    <span>🦸</span>
                    Heroes
                  </Link>

                  <Link
                    to={`${BASE}/battle-maps`}
                    className={section === 'battle-maps' ? 'active' : ''}
                  >
                    <span>🗺️</span>
                    Battle Maps
                  </Link>
                </div>

                <Link
                  className="whiteout-section-button"
                  to={BASE}
                >
                  Open Whiteout Hub
                </Link>
              </div>
            </aside>
          </div>

        </div>
      </main>
    </>
  )
}

export { SECTIONS }
export default WhiteoutSectionPage
