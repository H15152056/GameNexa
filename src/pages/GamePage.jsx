import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { gamesData } from '../data/gamesData'
import { useCMSGamesData } from '../cms/cmsContent'
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
  return character?.name || character?.title || character?.heroName || character?.characterName || 'Unknown Hero'
}

function getCharacterImage(character) {
  return character?.image || character?.icon || character?.portrait || character?.img || character?.avatar || ''
}

function getCharacterRarity(character) {
  const raw = character?.rarity ?? character?.quality ?? character?.tier ?? character?.rank ?? ''
  if (raw === '' || raw === null || raw === undefined) return ''

  const value = String(raw).trim()
    .replace(/â˜…/g, '★')
    .replace(/âœ…/g, '★')
    .replace(/\u2605/g, '★')

  if (/^5\s*★?$/i.test(value) || /^5\s*star$/i.test(value)) return '5★'
  if (/^4\s*★?$/i.test(value) || /^4\s*star$/i.test(value)) return '4★'

  return value
}

function getCharacterType(character) {
  return character?.type || character?.class || character?.troopType || character?.role || character?.element || ''
}

function getCharacterGeneration(character) {
  return character?.generation ?? character?.gen ?? character?.generationNumber ?? ''
}

function mergeGenshinCharacters(staticCharacters, cmsCharacters) {
  const staticList = Array.isArray(staticCharacters) ? staticCharacters.filter(Boolean) : []
  const cmsList = Array.isArray(cmsCharacters) ? cmsCharacters.filter(Boolean) : []

  if (!cmsList.length) return staticList

  const usedStaticIndexes = new Set()
  const merged = []

  const findStaticCharacter = (cmsCharacter) => {
    const cmsId = cmsCharacter?.id
    const cmsSlug = slugify(cmsCharacter?.slug || '')
    const cmsName = slugify(getCharacterName(cmsCharacter))

    return staticList.findIndex((staticCharacter, index) => {
      if (usedStaticIndexes.has(index)) return false

      const staticId = staticCharacter?.id
      const staticSlug = slugify(staticCharacter?.slug || '')
      const staticName = slugify(getCharacterName(staticCharacter))

      if (
        cmsId !== undefined &&
        cmsId !== null &&
        staticId !== undefined &&
        staticId !== null &&
        String(cmsId) === String(staticId)
      ) return true

      if (cmsSlug && staticSlug && cmsSlug === staticSlug) return true
      if (cmsName && staticName && cmsName === staticName) return true

      return false
    })
  }

  cmsList.forEach((cmsCharacter) => {
    const staticIndex = findStaticCharacter(cmsCharacter)

    if (staticIndex >= 0) {
      const staticCharacter = staticList[staticIndex]
      usedStaticIndexes.add(staticIndex)

      const cmsImage =
        cmsCharacter?.image ||
        cmsCharacter?.icon ||
        cmsCharacter?.portrait ||
        cmsCharacter?.img ||
        cmsCharacter?.avatar ||
        ''

      const staticImage =
        staticCharacter?.image ||
        staticCharacter?.icon ||
        staticCharacter?.portrait ||
        staticCharacter?.img ||
        staticCharacter?.avatar ||
        ''

      const mergedCharacter = {
        ...staticCharacter,
        ...cmsCharacter,
      }

      if (!cmsImage && staticImage) {
        if (staticCharacter?.image) mergedCharacter.image = staticCharacter.image
        if (staticCharacter?.icon && !mergedCharacter.icon) mergedCharacter.icon = staticCharacter.icon
        if (staticCharacter?.portrait && !mergedCharacter.portrait) mergedCharacter.portrait = staticCharacter.portrait
        if (staticCharacter?.img && !mergedCharacter.img) mergedCharacter.img = staticCharacter.img
        if (staticCharacter?.avatar && !mergedCharacter.avatar) mergedCharacter.avatar = staticCharacter.avatar
      }

      mergedCharacter.__originalImage = staticImage
      merged.push(mergedCharacter)
    } else {
      merged.push(cmsCharacter)
    }
  })

  staticList.forEach((staticCharacter, index) => {
    if (!usedStaticIndexes.has(index)) {
      merged.push({
        ...staticCharacter,
        __originalImage: getCharacterImage(staticCharacter),
      })
    }
  })

  return merged
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
  Support: {
    artifacts: '4pc Noblesse Oblige / Scroll of the Hero of Cinder City / kit-specific set',
    mainStats: 'ER or HP/DEF/EM as required / Elemental DMG or Healing / CRIT or Healing Bonus',
    substats: 'Energy Recharge > required scaling stat > CRIT/EM',
    talentPriority: 'Skill / Burst > Normal Attack',
    weaponAdvice: 'Energy Recharge or team-buffing option; use the signature when its passive is relevant.',
  },
  DPS: {
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

    exclusiveGear:
      character?.rarity === 'Mythic' || character?.quality === 'SSR'
        ? 'Exclusive Gear recommended'
        : 'Standard hero progression',
  }
}

/*
 * Whiteout page navigation
 */
const WHITEOUT_NAV = [
  {
    title: 'Overview',
    path: '/game/whiteout-survival/',
    icon: '⌂',
  },
  {
    title: 'Heroes',
    path: '/game/whiteout-survival/heroes',
    icon: '♜',
  },
  {
    title: 'Maps',
    path: '/game/whiteout-survival/maps',
    icon: '⌖',
  },
  {
    title: 'Calculator',
    path: '/game/whiteout-survival/calculator',
    icon: '▣',
  },
  {
    title: 'Bear Trap Events',
    path: '/game/whiteout-survival/events/bear-trap',
    icon: '🐻',
  },
  {
    title: 'Crazy Joe Events',
    path: '/game/whiteout-survival/events/crazy-joe',
    icon: '⚔',
  },
  {
    title: 'Foundry Battle',
    path: '/game/whiteout-survival/events/foundry-battle',
    icon: '🏭',
  },
  {
    title: 'Canyon Clash Battle',
    path: '/game/whiteout-survival/events/canyon-clash',
    icon: '🏔',
  },
  {
    title: 'Guides',
    path: '/game/whiteout-survival/guides',
    icon: '📚',
  },
  {
    title: 'Buildings',
    path: '/game/whiteout-survival/buildings',
    icon: '🏰',
  },
  {
    title: 'Research',
    path: '/game/whiteout-survival/research',
    icon: '🔬',
  },
  {
    title: 'Troops',
    path: '/game/whiteout-survival/troops',
    icon: '⚔',
  },
]

function WhiteoutSidebar({ currentPath }) {
  return (
    <aside className="whiteout-sidebar">
      <div className="whiteout-sidebar-header">
        <span className="whiteout-sidebar-kicker">WHITEOUT SURVIVAL</span>
        <strong>GameNexa Hub</strong>
      </div>

      <nav className="whiteout-sidebar-nav">
        {WHITEOUT_NAV.map((item) => {
          const active =
            item.path === '/game/whiteout-survival/'
              ? currentPath === '/game/whiteout-survival' ||
                currentPath === '/game/whiteout-survival/'
              : currentPath === item.path ||
                currentPath.startsWith(`${item.path}/`)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`whiteout-sidebar-link ${active ? 'active' : ''}`}
            >
              <span className="whiteout-sidebar-icon">{item.icon}</span>
              <span>{item.title}</span>
              {active && <b>›</b>}
            </Link>
          )
        })}
      </nav>

      <Link to="/" className="whiteout-sidebar-home">
        ← All Games
      </Link>
    </aside>
  )
}

function SectionPage({ title, eyebrow, description, children }) {
  return (
    <section className="whiteout-page-panel">
      <div className="whiteout-page-heading">
        <span className="section-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </section>
  )
}

function WhiteoutOverview({ game, guides }) {
  const cards = [
    {
      title: 'Heroes',
      description: 'Browse generations, classes, tiers, roles and hero build information.',
      path: '/game/whiteout-survival/heroes',
      icon: '♜',
      count: `${whiteoutHeroes.length} heroes`,
    },
    {
      title: 'Battle Maps',
      description: 'Explore State maps, facilities, fortresses, strongholds and alliance territory.',
      path: '/game/whiteout-survival/maps',
      icon: '⌖',
      count: 'Maps & territory',
    },
    {
      title: 'Calculator',
      description: 'Use practical planning and progression calculations for your account.',
      path: '/game/whiteout-survival/calculator',
      icon: '▣',
      count: 'Planning tools',
    },
    {
      title: 'Bear Trap',
      description: 'Rally heroes, joiner strategy and damage planning for Bear Trap.',
      path: '/game/whiteout-survival/events/bear-trap',
      icon: '🐻',
      count: 'Event guide',
    },
    {
      title: 'Crazy Joe',
      description: 'Prepare your alliance, formations and defensive setup.',
      path: '/game/whiteout-survival/events/crazy-joe',
      icon: '⚔',
      count: 'Event guide',
    },
    {
      title: 'Foundry Battle',
      description: 'Battlefield overview, objectives, buildings and practical strategy.',
      path: '/game/whiteout-survival/events/foundry-battle',
      icon: '🏭',
      count: 'Battle guide',
      image: '/maps/foundry-battle-4k.jpg',
    },
    {
      title: 'Canyon Clash',
      description: 'Learn the battlefield, objectives and team coordination basics.',
      path: '/game/whiteout-survival/events/canyon-clash',
      icon: '🏔',
      count: 'Battle guide',
      image: '/maps/canyon-clash-4k.jpg',
    },
    {
      title: 'Guides',
      description: 'Progression, troops, alliance, resources and practical strategy guides.',
      path: '/game/whiteout-survival/guides',
      icon: '📚',
      count: `${guides.length} guides`,
    },
  ]

  return (
    <>
      <section className="whiteout-overview-hero">
        <div className="whiteout-overview-copy">
          <span className="section-kicker">WHITEOUT SURVIVAL DATABASE</span>
          <h1>Everything you need to survive the frost.</h1>
          <p>
            Explore heroes, battle maps, events, calculators, progression,
            troops and practical Whiteout Survival strategy — all organized
            into dedicated GameNexa pages.
          </p>

          <div className="whiteout-overview-actions">
            <Link to="/game/whiteout-survival/heroes" className="whiteout-primary-button">
              Explore Heroes →
            </Link>
            <Link to="/game/whiteout-survival/maps" className="whiteout-secondary-button">
              Open Maps
            </Link>
          </div>
        </div>

        <div className="whiteout-overview-stats">
          <div>
            <strong>{whiteoutHeroMeta.rosterCount}</strong>
            <span>Heroes</span>
          </div>
          <div>
            <strong>17</strong>
            <span>Generations</span>
          </div>
          <div>
            <strong>3</strong>
            <span>Classes</span>
          </div>
        </div>
      </section>

      <section className="whiteout-intel">
        <div className="whiteout-intel-heading">
          <span className="section-kicker">QUICK INTEL</span>
          <h2>Build smarter before you spend.</h2>
          <p>
            Key Whiteout Survival information at a glance.
          </p>
        </div>

        <div className="whiteout-intel-grid">
          <div className="intel-card">
            <span>HEALERS</span>
            <strong>{whiteoutHeroMeta.healerNames.join(' · ')}</strong>
            <small>Team sustain and defensive support.</small>
          </div>

          <div className="intel-card">
            <span>CORE JOINERS</span>
            <strong>Jessie · Jasser · Jeronimo</strong>
            <small>Important rally joiner choices.</small>
          </div>

          <div className="intel-card">
            <span>CLASSES</span>
            <strong>Infantry · Lancer · Marksman</strong>
            <small>Use troop class together with game mode.</small>
          </div>

          <div className="intel-card">
            <span>ROSTER</span>
            <strong>{whiteoutHeroMeta.rosterCount} heroes · Gen 1–17</strong>
            <small>Full roster available on the Heroes page.</small>
          </div>
        </div>
      </section>

      <section className="whiteout-hub-section">
        <div className="section-title-row">
          <div>
            <span className="section-kicker">WHITEOUT DATABASE</span>
            <h2>Explore the Hub</h2>
          </div>
        </div>

        <div className="whiteout-hub-grid">
          {cards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className={`whiteout-hub-card ${card.image ? 'has-image' : ''}`}
            >
              {card.image && (
                <div
                  className="whiteout-hub-card-image"
                  style={{ backgroundImage: `url("${card.image}")` }}
                />
              )}

              <div className="whiteout-hub-card-overlay" />

              <div className="whiteout-hub-card-body">
                <span className="whiteout-hub-icon">{card.icon}</span>
                <span className="whiteout-hub-count">{card.count}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <span className="whiteout-hub-arrow">Open page →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="whiteout-overview-lower">
        <div>
          <span className="section-kicker">GAME NEXA</span>
          <h2>One Whiteout hub. Separate useful pages.</h2>
          <p>
            The overview stays clean while the detailed databases live on
            their own pages. Use the navigation on the left to move between
            each part of Whiteout Survival.
          </p>
        </div>

        <Link to="/game/whiteout-survival/guides" className="whiteout-primary-button">
          Browse Guides →
        </Link>
      </section>
    </>
  )
}

function WhiteoutMapsPage({ game }) {
  const maps = Array.isArray(game?.maps) ? game.maps : []
  const facilities = Array.isArray(game?.facilities) ? game.facilities : []
  const fortresses = Array.isArray(game?.fortresses) ? game.fortresses : []
  const strongholds = Array.isArray(game?.strongholds) ? game.strongholds : []
  const resources = Array.isArray(game?.resources) ? game.resources : []

  return (
    <SectionPage
      eyebrow="WHITEOUT SURVIVAL · MAP DATABASE"
      title="Battle Maps & Territory"
      description="Explore State maps, facilities, fortresses, strongholds, resources and alliance territory."
    >
      <div className="map-feature-grid">
        <div className="map-feature-card">
          <div className="map-feature-icon">⌖</div>
          <h3>State Maps</h3>
          <p>Use the map database to plan territory, objectives and alliance movement.</p>
          <strong>{maps.length || 'Generic'} map entries</strong>
        </div>

        <div className="map-feature-card">
          <div className="map-feature-icon">🏰</div>
          <h3>Facilities</h3>
          <p>Review important facilities and their strategic value.</p>
          <strong>{facilities.length} facilities</strong>
        </div>

        <div className="map-feature-card">
          <div className="map-feature-icon">🛡️</div>
          <h3>Fortresses</h3>
          <p>Track fortress objectives and alliance battle planning.</p>
          <strong>{fortresses.length} fortresses</strong>
        </div>

        <div className="map-feature-card">
          <div className="map-feature-icon">⚔</div>
          <h3>Strongholds</h3>
          <p>Plan stronghold captures and alliance territory expansion.</p>
          <strong>{strongholds.length} strongholds</strong>
        </div>

        <div className="map-feature-card">
          <div className="map-feature-icon">⛏️</div>
          <h3>Resources</h3>
          <p>Useful resource locations and gathering information.</p>
          <strong>{resources.length} resource entries</strong>
        </div>

        <div className="map-feature-card map-feature-card-wide">
          <div className="map-feature-icon">🗺️</div>
          <h3>State Map Planner</h3>
          <p>
            Generic and State-specific map planning can be expanded here as
            the map database grows.
          </p>
          <span>Map system ready for expansion →</span>
        </div>
      </div>

      <div className="whiteout-info-box">
        <strong>Battle map database</strong>
        <p>
          This page is intentionally separate from Heroes. The Whiteout
          overview remains a clean hub while maps have their own dedicated
          space for facilities, fortresses, strongholds, resources and
          alliance territory.
        </p>
      </div>
    </SectionPage>
  )
}

function WhiteoutCalculatorPage() {
  return (
    <SectionPage
      eyebrow="WHITEOUT SURVIVAL · TOOLS"
      title="Whiteout Survival Calculator"
      description="A dedicated home for progression and planning calculators."
    >
      <div className="calculator-grid">
        <div className="calculator-card">
          <span>01</span>
          <h3>Furnace Progression</h3>
          <p>Plan the resources and progression needed for your next Furnace milestones.</p>
          <button type="button" disabled>Coming Soon</button>
        </div>

        <div className="calculator-card">
          <span>02</span>
          <h3>Troop Training</h3>
          <p>Plan training resources, time and troop progression.</p>
          <button type="button" disabled>Coming Soon</button>
        </div>

        <div className="calculator-card">
          <span>03</span>
          <h3>Research Planning</h3>
          <p>Organize research priorities and resource requirements.</p>
          <button type="button" disabled>Coming Soon</button>
        </div>

        <div className="calculator-card">
          <span>04</span>
          <h3>Alliance Planning</h3>
          <p>Future planning tools for alliance events and territory.</p>
          <button type="button" disabled>Coming Soon</button>
        </div>
      </div>
    </SectionPage>
  )
}

function WhiteoutEventPage({ type }) {
  const eventData = {
    'bear-trap': {
      title: 'Bear Trap Events',
      eyebrow: 'WHITEOUT SURVIVAL · EVENT',
      description: 'Rally planning, hero selection and damage optimization for Bear Trap.',
      icon: '🐻',
      points: [
        ['Rally Lead', 'Use your strongest damage-oriented rally setup and follow the event rules of your alliance.'],
        ['Joiners', 'Jessie, Jasser and Jeronimo are important joiner options when their rally-related skills apply.'],
        ['Timing', 'Coordinate rally timing with your alliance so your strongest bonuses and buffs are active.'],
        ['Damage', 'Prioritize correct hero skills, troop composition and march optimization instead of simply sending every hero.'],
      ],
    },
    'crazy-joe': {
      title: 'Crazy Joe Events',
      eyebrow: 'WHITEOUT SURVIVAL · EVENT',
      description: 'Prepare your city and alliance for Crazy Joe waves.',
      icon: '⚔',
      points: [
        ['Defense', 'Keep your strongest defensive heroes and troops ready before the event starts.'],
        ['Alliance', 'Coordinate reinforcements, rallies and defensive assignments with your alliance.'],
        ['Waves', 'Monitor the event waves and adapt your defensive setup when stronger attacks arrive.'],
        ['Rewards', 'Complete participation requirements and maximize your event rewards efficiently.'],
      ],
    },
  }

  const data = eventData[type] || eventData['bear-trap']

  return (
    <SectionPage
      eyebrow={data.eyebrow}
      title={data.title}
      description={data.description}
    >
      <div className="event-hero-card">
        <div className="event-hero-icon">{data.icon}</div>
        <div>
          <span className="section-kicker">EVENT STRATEGY</span>
          <h2>Practical event preparation</h2>
          <p>
            Use this page as a quick reference before your alliance event.
            Detailed event-specific data can be expanded through the CMS.
          </p>
        </div>
      </div>

      <div className="event-guide-grid">
        {data.points.map(([title, text], index) => (
          <article className="event-guide-card" key={title}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </SectionPage>
  )
}

function findBattleImage(kind) {
  const candidates =
    kind === 'foundry'
      ? [
          '/maps/foundry-battle-4k.jpg',
          '/maps/foundry-battle.jpg',
          '/assets/maps/foundry-battle-4k.jpg',
          '/assets/foundry-battle-4k.jpg',
        ]
      : [
          '/maps/canyon-clash-4k.jpg',
          '/maps/canyon-clash.jpg',
          '/assets/maps/canyon-clash-4k.jpg',
          '/assets/canyon-clash-4k.jpg',
        ]

  return candidates[0]
}

function WhiteoutBattlePage({ type }) {
  const foundry = type === 'foundry'
  const title = foundry ? 'Foundry Battle' : 'Canyon Clash Battle'
  const image = findBattleImage(foundry ? 'foundry' : 'canyon')

  const sections = foundry
    ? [
        ['Objectives', 'Understand the battlefield objectives and coordinate your alliance around the most valuable structures.'],
        ['Team Roles', 'Assign players to clear roles so rallies, captures, defense and reinforcement are coordinated.'],
        ['Movement', 'Avoid unnecessary marches. Move with a purpose and keep your strongest formations available for important fights.'],
        ['Coordination', 'Communication and timing are often more important than individual power.'],
      ]
    : [
        ['Battlefield', 'Learn the battlefield layout before the battle and understand where your alliance needs to control movement.'],
        ['Objectives', 'Prioritize important objectives instead of spreading the alliance too thin across the map.'],
        ['Formation', 'Use suitable troop classes and hero combinations for the role your march is performing.'],
        ['Coordination', 'Keep attack and defense assignments clear so reinforcements arrive where they matter.'],
      ]

  return (
    <SectionPage
      eyebrow={`WHITEOUT SURVIVAL · ${foundry ? 'FOUNDRY' : 'CANYON CLASH'}`}
      title={title}
      description={foundry ? 'Foundry battlefield strategy and objectives.' : 'Canyon Clash battlefield strategy and objectives.'}
    >
      <div className="battle-page-hero">
        <img
          src={image}
          alt={title}
          onError={(event) => {
            event.currentTarget.parentElement.classList.add('image-missing')
            event.currentTarget.style.display = 'none'
          }}
        />
        <div className="battle-page-hero-overlay" />
        <div className="battle-page-hero-content">
          <span>{foundry ? '🏭' : '🏔'}</span>
          <h2>{title}</h2>
          <p>GameNexa Whiteout Survival battle reference.</p>
        </div>
      </div>

      <div className="event-guide-grid battle-guide-grid">
        {sections.map(([heading, text], index) => (
          <article className="event-guide-card" key={heading}>
            <span>0{index + 1}</span>
            <h3>{heading}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </SectionPage>
  )
}

function WhiteoutCollectionPage({ title, eyebrow, description, items, icon }) {
  const list = Array.isArray(items) ? items : []

  return (
    <SectionPage eyebrow={eyebrow} title={title} description={description}>
      {list.length ? (
        <div className="collection-grid">
          {list.map((item, index) => {
            const itemTitle = item?.title || item?.name || item?.label || `${title} ${index + 1}`
            const itemDescription =
              item?.description ||
              item?.desc ||
              item?.notes ||
              item?.text ||
              'Whiteout Survival database information.'

            return (
              <article className="collection-card" key={item?.id || itemTitle || index}>
                <div className="collection-icon">{item?.icon || icon}</div>
                <div>
                  <span>DATABASE ENTRY</span>
                  <h3>{itemTitle}</h3>
                  <p>{itemDescription}</p>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="empty-state collection-empty">
          <span>{icon}</span>
          <h3>No entries available yet</h3>
          <p>This section is ready for database content and CMS expansion.</p>
        </div>
      )}
    </SectionPage>
  )
}

function GamePage() {
  const params = useParams()
  const location = useLocation()

  const gameSlug = params.gameSlug || params.slug || params.game || ''

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
    const compactRequestedSlug = requestedSlug.replace(/-/g, '')

    const matches = (key, item) => {
      if (key && slugify(key) === requestedSlug) return true

      if (
        key &&
        slugify(key).replace(/-/g, '') === compactRequestedSlug
      ) return true

      if (!item || typeof item !== 'object') return false

      const itemSlug = slugify(item.slug || '')
      const itemName = slugify(item.name || '')

      if (itemSlug === requestedSlug) return true

      if (
        itemSlug.replace(/-/g, '') === compactRequestedSlug
      ) return true

      if (itemName === requestedSlug) return true

      if (
        itemName.replace(/-/g, '') === compactRequestedSlug
      ) return true

      return false
    }

    if (Array.isArray(cmsGamesData)) {
      return cmsGamesData.find((item) => matches('', item)) || null
    }

    const match = Object.entries(cmsGamesData).find(([key, item]) =>
      matches(key, item)
    )

    return match ? match[1] : null
  }, [gameSlug, cmsGamesData])

  const isGenshin =
    gameSlug === 'genshin-impact' ||
    game?.slug === 'genshin-impact' ||
    slugify(game?.name) === 'genshin-impact'

  const isWhiteout =
    gameSlug === 'whiteout-survival' ||
    game?.slug === 'whiteout-survival' ||
    slugify(game?.name) === 'whiteout-survival'

  const currentPath = location.pathname.replace(/\/+$/, '') || '/'

  const whiteoutSubPage =
    isWhiteout
      ? currentPath === '/game/whiteout-survival'
        ? 'overview'
        : currentPath.endsWith('/heroes')
          ? 'heroes'
          : currentPath.endsWith('/maps')
            ? 'maps'
            : currentPath.endsWith('/calculator')
              ? 'calculator'
              : currentPath.endsWith('/events/bear-trap')
                ? 'bear-trap'
                : currentPath.endsWith('/events/crazy-joe')
                  ? 'crazy-joe'
                  : currentPath.endsWith('/events/foundry-battle')
                    ? 'foundry'
                    : currentPath.endsWith('/events/canyon-clash')
                      ? 'canyon'
                      : currentPath.endsWith('/guides')
                        ? 'guides'
                        : currentPath.endsWith('/buildings')
                          ? 'buildings'
                          : currentPath.endsWith('/research')
                            ? 'research'
                            : currentPath.endsWith('/troops')
                              ? 'troops'
                              : 'overview'
      : null

  const databaseCharacters = useMemo(() => {
    if (isWhiteout) {
      if (Array.isArray(game?.heroes)) return game.heroes
      if (Array.isArray(game?.characters)) return game.characters
      return Array.isArray(whiteoutHeroes) ? whiteoutHeroes : []
    }

    if (isGenshin) {
      return mergeGenshinCharacters(genshinCharacters, game?.characters)
    }

    if (game?.slug) {
      if (Array.isArray(game?.characters)) return game.characters
      return gameCharacters?.[game.slug] || []
    }

    return []
  }, [isGenshin, isWhiteout, game])

  const allCharacters = useMemo(
    () => (Array.isArray(databaseCharacters) ? databaseCharacters.filter(Boolean) : []),
    [databaseCharacters]
  )

  const generations = useMemo(() => {
    if (!isWhiteout) return []

    const values = allCharacters
      .map((character) => Number(getCharacterGeneration(character)))
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value >= 0 &&
          value <= 17
      )

    return [...new Set(values)].sort((a, b) => b - a)
  }, [allCharacters, isWhiteout])

  const rarities = useMemo(
    () =>
      [...new Set(
        allCharacters
          .map((character) => getCharacterRarity(character))
          .filter(Boolean)
      )],
    [allCharacters]
  )

  const types = useMemo(
    () =>
      [...new Set(
        allCharacters
          .map((character) => getCharacterType(character))
          .filter(Boolean)
      )],
    [allCharacters]
  )

  const filteredCharacters = useMemo(() => {
    const query = search.trim().toLowerCase()

    let result = allCharacters.filter((character) => {
      const name = getCharacterName(character).toLowerCase()
      const rarity = String(getCharacterRarity(character)).toLowerCase()
      const type = String(getCharacterType(character)).toLowerCase()
      const generation = String(getCharacterGeneration(character))

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
        String(getCharacterGeneration(character)) === generationFilter

      return matchesSearch && matchesRarity && matchesType && matchesGeneration
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
      if (event.key === 'Escape') setSelectedCharacter(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedCharacter])

  useEffect(() => {
    document.body.style.overflow = selectedCharacter ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedCharacter])

  if (!game) {
    return (
      <main className="game-page">
        <div className="game-page-container">
          <section className="game-not-found">
            <span className="not-found-icon">🎮</span>
            <h1>Game Not Found</h1>
            <p>We could not find the game you are looking for.</p>
            <Link to="/" className="back-home-btn">Back to Home</Link>
          </section>
        </div>
      </main>
    )
  }

  const gameName = game.name || 'Game'
  const gameDescription =
    game.description ||
    `Explore the latest ${gameName} characters, guides, builds, and database information on GameNexa.`

  const heroImage = game.heroImage || game.banner || game.image || ''

  const featured = Array.isArray(game.featured) ? game.featured : []
  const guides = Array.isArray(game.guides) ? game.guides : []

  const gameClass = [
    'game-page',
    isGenshin ? 'game-theme-genshin' : '',
    isWhiteout ? 'game-theme-whiteout' : '',
  ].filter(Boolean).join(' ')

  /*
   * ============================================================
   * WHITEOUT SEPARATE PAGES
   * ============================================================
   */
  if (isWhiteout) {
    return (
      <main className={`${gameClass} whiteout-hub-page`}>
        <SEO
          title={
            whiteoutSubPage === 'overview'
              ? 'Whiteout Survival Database & Guides | GameNexa'
              : `${WHITEOUT_NAV.find((item) => item.path.endsWith(`/${whiteoutSubPage}`))?.title || 'Whiteout Survival'} | GameNexa`
          }
          description={gameDescription}
        />

        <div className="whiteout-layout">
          <WhiteoutSidebar currentPath={currentPath} />

          <div className="whiteout-main-content">
            <div className="whiteout-mobile-topbar">
              <Link to="/game/whiteout-survival/" className="whiteout-mobile-brand">
                ❄️ Whiteout Survival
              </Link>
              <Link to="/" className="whiteout-mobile-home">Games</Link>
            </div>

            <div className="whiteout-breadcrumb">
              <Link to="/game/whiteout-survival/">Whiteout Survival</Link>
              {whiteoutSubPage !== 'overview' && (
                <>
                  <span>›</span>
                  <strong>
                    {WHITEOUT_NAV.find((item) => item.path === location.pathname)?.title ||
                      whiteoutSubPage.replace(/-/g, ' ')}
                  </strong>
                </>
              )}
            </div>

            {whiteoutSubPage === 'overview' && (
              <WhiteoutOverview game={game} guides={guides} />
            )}

            {whiteoutSubPage === 'heroes' && (
              <section className="database-section whiteout-heroes-page">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">WHITEOUT SURVIVAL · DATABASE</span>
                    <h1>Heroes</h1>
                    <p>
                      Browse all Whiteout Survival heroes by generation,
                      class, rarity and role.
                    </p>
                  </div>

                  <div className="database-total">
                    <strong>{filteredCharacters.length}</strong>
                    <span>
                      {filteredCharacters.length === 1 ? 'Hero Found' : 'Heroes Found'}
                    </span>
                  </div>
                </div>

                <div className="character-filters">
                  <label className="filter-search">
                    <span>⌕</span>
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search heroes..."
                    />
                  </label>

                  <label className="filter-control">
                    <span>Rarity</span>
                    <select
                      value={rarityFilter}
                      onChange={(event) => setRarityFilter(event.target.value)}
                    >
                      <option value="all">All Rarities</option>
                      {rarities.map((rarity) => (
                        <option key={rarity} value={rarity}>{rarity}</option>
                      ))}
                    </select>
                  </label>

                  <label className="filter-control">
                    <span>Class</span>
                    <select
                      value={typeFilter}
                      onChange={(event) => setTypeFilter(event.target.value)}
                    >
                      <option value="all">All Classes</option>
                      {types.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </label>

                  <label className="filter-control">
                    <span>Generation</span>
                    <select
                      value={generationFilter}
                      onChange={(event) => setGenerationFilter(event.target.value)}
                    >
                      <option value="all">All Generations</option>
                      {generations.map((generation) => (
                        <option key={generation} value={String(generation)}>
                          Generation {generation}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="filter-control">
                    <span>Sort</span>
                    <select
                      value={sortOrder}
                      onChange={(event) => setSortOrder(event.target.value)}
                    >
                      <option value="default">Default</option>
                      <option value="az">A → Z</option>
                      <option value="za">Z → A</option>
                      <option value="generation">Generation</option>
                    </select>
                  </label>

                  <button type="button" className="reset-filters" onClick={resetFilters}>
                    Reset
                  </button>
                </div>

                {filteredCharacters.length ? (
                  <div className="character-grid whiteout-character-grid">
                    {filteredCharacters.map((character, index) => {
                      const name = getCharacterName(character)
                      const image = getCharacterImage(character)
                      const rarity = getCharacterRarity(character)
                      const type = getCharacterType(character)
                      const generation = getCharacterGeneration(character)

                      return (
                        <article
                          className="character-card"
                          key={character.id || character.slug || `${name}-${generation}-${index}`}
                          onClick={() => setSelectedCharacter(character)}
                        >
                          <div className="character-card-image">
                            {image ? (
                              <img
                                src={image}
                                alt={name}
                                loading="lazy"
                                onError={(event) => {
                                  const originalImage = character.__originalImage

                                  if (
                                    originalImage &&
                                    originalImage !== image &&
                                    event.currentTarget.src !== originalImage
                                  ) {
                                    event.currentTarget.src = originalImage
                                    return
                                  }

                                  event.currentTarget.style.display = 'none'

                                  const fallback =
                                    event.currentTarget.parentElement?.querySelector(
                                      '.character-image-fallback'
                                    )

                                  if (fallback) fallback.style.display = 'flex'
                                }}
                              />
                            ) : null}

                            <div
                              className="character-image-fallback"
                              style={{ display: image ? 'none' : 'flex' }}
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
                              <span className="character-type">{type || 'Hero'}</span>
                              {rarity && (
                                <span className="character-rarity">{rarity}</span>
                              )}
                            </div>

                            <h3>{name}</h3>

                            {character.subtitle && (
                              <p className="character-subtitle">{character.subtitle}</p>
                            )}

                            {character.role && (
                              <div className="character-role">
                                <span>Role</span>
                                <strong>{character.role}</strong>
                              </div>
                            )}

                            <div className="character-card-meta">
                              <span>
                                <b>Class</b>
                                {character.troopType || '—'}
                              </span>
                              <span>
                                <b>Gen</b>
                                {character.generation || '—'}
                              </span>
                              <span>
                                <b>Tier</b>
                                {character.tier || '—'}
                              </span>
                              <span>
                                <b>Best for</b>
                                {character.bestFor || 'General'}
                              </span>
                            </div>

                            <p className="character-description">
                              {character.description ||
                                character.notes ||
                                `${name} is a ${
                                  character.role?.toLowerCase() || 'combat'
                                } hero. Open the profile for role, tier, formation and upgrade guidance.`}
                            </p>

                            <button
                              type="button"
                              className="view-details-btn"
                              onClick={(event) => {
                                event.stopPropagation()
                                setSelectedCharacter(character)
                              }}
                            >
                              View Details <span>→</span>
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
                    <p>Try changing your search or filters.</p>
                    <button type="button" onClick={resetFilters}>Clear Filters</button>
                  </div>
                )}
              </section>
            )}

            {whiteoutSubPage === 'maps' && <WhiteoutMapsPage game={game} />}

            {whiteoutSubPage === 'calculator' && <WhiteoutCalculatorPage />}

            {whiteoutSubPage === 'bear-trap' && (
              <WhiteoutEventPage type="bear-trap" />
            )}

            {whiteoutSubPage === 'crazy-joe' && (
              <WhiteoutEventPage type="crazy-joe" />
            )}

            {whiteoutSubPage === 'foundry' && (
              <WhiteoutBattlePage type="foundry" />
            )}

            {whiteoutSubPage === 'canyon' && (
              <WhiteoutBattlePage type="canyon" />
            )}

            {whiteoutSubPage === 'guides' && (
              <SectionPage
                eyebrow="WHITEOUT SURVIVAL · KNOWLEDGE BASE"
                title="Guides"
                description="Practical Whiteout Survival guides for progression, combat, alliances and resources."
              >
                <div className="guides-grid">
                  {guides.map((guide, index) => (
                    <Link
                      key={`${game.slug}-guide-${index}`}
                      to={`/game/${game.slug}/guides/${index}`}
                      className="guide-card"
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
                          <span className="guide-category">{guide.category}</span>
                        )}
                        <h3>{guide.title}</h3>
                        <p>
                          {guide.desc ||
                            guide.description ||
                            'Complete guide and useful information.'}
                        </p>
                        <span className="guide-read-link">Read Guide →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </SectionPage>
            )}

            {whiteoutSubPage === 'buildings' && (
              <WhiteoutCollectionPage
                title="Buildings"
                eyebrow="WHITEOUT SURVIVAL · DATABASE"
                description="Buildings and progression information."
                items={game.buildings}
                icon="🏰"
              />
            )}

            {whiteoutSubPage === 'research' && (
              <WhiteoutCollectionPage
                title="Research"
                eyebrow="WHITEOUT SURVIVAL · DATABASE"
                description="Research trees and progression information."
                items={game.research}
                icon="🔬"
              />
            )}

            {whiteoutSubPage === 'troops' && (
              <WhiteoutCollectionPage
                title="Troops"
                eyebrow="WHITEOUT SURVIVAL · DATABASE"
                description="Troop classes, progression and combat information."
                items={game.troops}
                icon="⚔"
              />
            )}

            <p className="asset-credit-note">
              Whiteout Survival character and game artwork is shown for
              fan-database reference. GameNexa does not claim ownership of
              the respective game artwork.
            </p>
          </div>
        </div>

        {selectedCharacter && (
          <WhiteoutCharacterModal
            character={selectedCharacter}
            onClose={() => setSelectedCharacter(null)}
          />
        )}
      </main>
    )
  }

  /*
   * ============================================================
   * GENSHIN / OTHER GAME PAGE
   * ============================================================
   */

  const selectedBuildProfile = selectedCharacter
    ? isGenshin
      ? getGenshinBuildProfile(selectedCharacter)
      : null
    : null

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

        <section
          className="game-hero"
          style={
            heroImage
              ? { '--hero-image': `url("${heroImage}")` }
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
            <p className="game-hero-description">{gameDescription}</p>

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

        <section className="database-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">DATABASE</span>
              <h2>Genshin Impact Characters</h2>
              <p>Browse, search and explore the character database.</p>
            </div>

            <div className="database-total">
              <strong>{filteredCharacters.length}</strong>
              <span>
                {filteredCharacters.length === 1 ? 'Character Found' : 'Characters Found'}
              </span>
            </div>
          </div>

          <div className="character-filters">
            <label className="filter-search">
              <span>⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search characters..."
              />
            </label>

            <label className="filter-control">
              <span>Rarity</span>
              <select
                value={rarityFilter}
                onChange={(event) => setRarityFilter(event.target.value)}
              >
                <option value="all">All Rarities</option>
                {rarities.map((rarity) => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </label>

            <label className="filter-control">
              <span>Type</span>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
              >
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="filter-control">
              <span>Sort</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value="default">Default</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
              </select>
            </label>

            <button type="button" className="reset-filters" onClick={resetFilters}>
              Reset
            </button>
          </div>

          {filteredCharacters.length ? (
            <div className="character-grid">
              {filteredCharacters.map((character, index) => {
                const name = getCharacterName(character)
                const image = getCharacterImage(character)
                const rarity = getCharacterRarity(character)
                const type = getCharacterType(character)

                return (
                  <article
                    className="character-card"
                    key={character.id || character.slug || `${name}-${index}`}
                    onClick={() => setSelectedCharacter(character)}
                  >
                    <div className="character-card-image">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          loading="lazy"
                          onError={(event) => {
                            const originalImage = character.__originalImage

                            if (
                              originalImage &&
                              originalImage !== image &&
                              event.currentTarget.src !== originalImage
                            ) {
                              event.currentTarget.src = originalImage
                              return
                            }

                            event.currentTarget.style.display = 'none'

                            const fallback =
                              event.currentTarget.parentElement?.querySelector(
                                '.character-image-fallback'
                              )

                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}

                      <div
                        className="character-image-fallback"
                        style={{ display: image ? 'none' : 'flex' }}
                      >
                        <span>✦</span>
                      </div>

                      <div className="character-image-gradient" />
                    </div>

                    <div className="character-card-content">
                      <div className="character-card-topline">
                        <span className="character-type">{type || 'Character'}</span>
                        {rarity && (
                          <span className="character-rarity">{rarity}</span>
                        )}
                      </div>

                      <h3>{name}</h3>

                      {character.role && (
                        <div className="character-role">
                          <span>Role</span>
                          <strong>{character.role}</strong>
                        </div>
                      )}

                      <div className="character-card-meta">
                        <span>
                          <b>Element</b>
                          {character.element || '—'}
                        </span>
                        <span>
                          <b>Weapon</b>
                          {typeof character.weapon === 'object'
                            ? character.weapon?.name || '—'
                            : character.weapon || '—'}
                        </span>
                        <span>
                          <b>Region</b>
                          {character.region || '—'}
                        </span>
                        <span>
                          <b>Version</b>
                          {character.version || '—'}
                        </span>
                      </div>

                      <p className="character-description">
                        {character.description ||
                          `${name} is a ${
                            character.role?.toLowerCase() || 'combat'
                          } character. Open the profile for build direction and progression notes.`}
                      </p>

                      <button
                        type="button"
                        className="view-details-btn"
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedCharacter(character)
                        }}
                      >
                        View Details <span>→</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span>⌕</span>
              <h3>No characters found</h3>
              <p>Try changing your search or filters.</p>
              <button type="button" onClick={resetFilters}>Clear Filters</button>
            </div>
          )}
        </section>

        {featured.length > 0 && (
          <section className="content-section">
            <div className="section-title-row">
              <div>
                <span className="section-kicker">FEATURED</span>
                <h2>Featured Content</h2>
              </div>
            </div>

            <div className="featured-grid">
              {featured.map((item, index) => (
                <article className="featured-card" key={item.id || item.title || index}>
                  {item.image && (
                    <div className="featured-image">
                      <img src={item.image} alt={item.title || 'Featured content'} />
                    </div>
                  )}
                  <div className="featured-content">
                    {item.category && <span>{item.category}</span>}
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer">
                        Explore →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {guides.length > 0 && (
          <section className="content-section">
            <div className="section-title-row">
              <div>
                <span className="section-kicker">GUIDES</span>
                <h2>Game Guides</h2>
              </div>
            </div>

            <div className="guides-grid">
              {guides.map((guide, index) => (
                <Link
                  key={`${game.slug}-guide-${index}`}
                  to={`/game/${game.slug}/guides/${index}`}
                  className="guide-card"
                >
                  {guide.image && (
                    <div className="guide-image">
                      <img src={guide.image} alt={guide.title || 'Game guide'} />
                    </div>
                  )}

                  <div className="guide-content">
                    {guide.category && (
                      <span className="guide-category">{guide.category}</span>
                    )}
                    <h3>{guide.title}</h3>
                    <p>
                      {guide.desc ||
                        guide.description ||
                        'Complete guide and useful information.'}
                    </p>
                    <span className="guide-read-link">Read Guide →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {selectedCharacter && (
        <GenshinCharacterModal
          character={selectedCharacter}
          buildProfile={selectedBuildProfile}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </main>
  )
}

function WhiteoutCharacterModal({ character, onClose }) {
  const profile = getWhiteoutBuildProfile(character)
  const image = getCharacterImage(character)

  return (
    <div
      className="character-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="character-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${getCharacterName(character)} details`}
      >
        <button type="button" className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <div className="modal-character-image">
            {image ? (
              <img src={image} alt={getCharacterName(character)} />
            ) : (
              <span>✦</span>
            )}
          </div>

          <div className="modal-title-area">
            <div className="modal-badges">
              {getCharacterGeneration(character) !== '' && (
                <span className="modal-generation">
                  Generation {getCharacterGeneration(character)}
                </span>
              )}

              {getCharacterRarity(character) && (
                <span className="modal-rarity">
                  {getCharacterRarity(character)}
                </span>
              )}
            </div>

            <h2>{getCharacterName(character)}</h2>

            {getCharacterType(character) && (
              <p className="modal-type">{getCharacterType(character)}</p>
            )}
          </div>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3>Overview</h3>
            <p>
              {character.description ||
                character.notes ||
                `${getCharacterName(character)} is a Generation ${
                  character.generation || '—'
                } ${character.troopType || ''} hero. Review the role, tier,
                best-use mode and upgrade guidance before investing resources.`}
            </p>
          </section>

          <div className="modal-detail-grid">
            {character.role && (
              <div className="detail-box">
                <span>Role</span>
                <strong>{character.role}</strong>
              </div>
            )}

            {character.tier && (
              <div className="detail-box">
                <span>Tier</span>
                <strong>{character.tier}</strong>
              </div>
            )}

            {character.bestFor && (
              <div className="detail-box">
                <span>Best For</span>
                <strong>{character.bestFor}</strong>
              </div>
            )}

            {character.troopType && (
              <div className="detail-box">
                <span>Class</span>
                <strong>{character.troopType}</strong>
              </div>
            )}

            {character.generation !== undefined && (
              <div className="detail-box">
                <span>Generation</span>
                <strong>{character.generation}</strong>
              </div>
            )}

            {character.healer !== undefined && (
              <div className="detail-box">
                <span>Healer</span>
                <strong>{character.healer ? 'Yes' : 'No'}</strong>
              </div>
            )}

            {character.rallyJoiner !== undefined && (
              <div className="detail-box">
                <span>Rally Joiner</span>
                <strong>{character.rallyJoiner ? 'Yes' : 'Situational'}</strong>
              </div>
            )}
          </div>

          <section className="modal-section hero-build-section">
            <div className="hero-build-heading">
              <div>
                <span className="modal-eyebrow">HERO INTEL</span>
                <h3>Recommended Hero Setup</h3>
              </div>
              <span className="build-source-badge">Current roster data</span>
            </div>

            <div className="hero-build-grid">
              <div className="build-box">
                <span>Formation</span>
                <strong>{profile.formation}</strong>
              </div>

              <div className="build-box">
                <span>Exclusive Gear</span>
                <strong>{profile.exclusiveGear}</strong>
              </div>

              <div className="build-box">
                <span>Class</span>
                <strong>{character.troopType || 'Infantry / Lancer / Marksman'}</strong>
              </div>

              <div className="build-box">
                <span>Best For</span>
                <strong>{character.bestFor || 'General combat'}</strong>
              </div>
            </div>

            <div className="build-callout">
              <b>Skill Priority</b>
              <span>{profile.skillPriority}</span>
            </div>
          </section>

          {character.synergy && (
            <section className="modal-section">
              <h3>Team Synergy</h3>
              <p>{character.synergy}</p>
            </section>
          )}

          {character.notes && (
            <section className="modal-section">
              <h3>GameNexa Notes</h3>
              <p>{character.notes}</p>
            </section>
          )}

          {Array.isArray(character.skills) && character.skills.length > 0 && (
            <section className="modal-section">
              <h3>Skills</h3>
              <div className="skills-list">
                {character.skills.map((skill, index) => (
                  <article className="skill-card" key={skill.id || skill.name || index}>
                    {skill.image && (
                      <img src={skill.image} alt={skill.name || 'Skill'} />
                    )}
                    <div>
                      <h4>{skill.name || `Skill ${index + 1}`}</h4>
                      {skill.description && <p>{skill.description}</p>}
                      {skill.values && (
                        <div className="skill-values">
                          {Array.isArray(skill.values)
                            ? skill.values.join(' / ')
                            : String(skill.values)}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {Array.isArray(character.expedition) && character.expedition.length > 0 && (
            <section className="modal-section">
              <h3>Expedition</h3>
              <div className="skills-list">
                {character.expedition.map((skill, index) => (
                  <article className="skill-card" key={skill.id || skill.name || index}>
                    {skill.image && (
                      <img src={skill.image} alt={skill.name || 'Skill'} />
                    )}
                    <div>
                      <h4>{skill.name}</h4>
                      {skill.description && <p>{skill.description}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {character.howToGet && (
            <section className="modal-section">
              <h3>How to Get</h3>
              <p>{character.howToGet}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function GenshinCharacterModal({ character, buildProfile, onClose }) {
  const image = getCharacterImage(character)

  return (
    <div
      className="character-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="character-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${getCharacterName(character)} details`}
      >
        <button type="button" className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <div className="modal-character-image">
            {image ? (
              <img
                src={image}
                alt={getCharacterName(character)}
                onError={(event) => {
                  if (
                    character.__originalImage &&
                    event.currentTarget.src !== character.__originalImage
                  ) {
                    event.currentTarget.src = character.__originalImage
                    return
                  }

                  event.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <span>✦</span>
            )}
          </div>

          <div className="modal-title-area">
            <div className="modal-badges">
              {getCharacterRarity(character) && (
                <span className="modal-rarity">{getCharacterRarity(character)}</span>
              )}
            </div>

            <h2>{getCharacterName(character)}</h2>

            {getCharacterType(character) && (
              <p className="modal-type">{getCharacterType(character)}</p>
            )}
          </div>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3>Overview</h3>
            <p>
              {character.description ||
                `${getCharacterName(character)} is a ${
                  character.role || 'playable'
                } ${character.element || ''} character using a ${
                  character.weapon || 'weapon'
                }.`}
            </p>
          </section>

          <div className="modal-detail-grid">
            {character.role && (
              <div className="detail-box">
                <span>Role</span>
                <strong>{character.role}</strong>
              </div>
            )}

            {character.element && (
              <div className="detail-box">
                <span>Element</span>
                <strong>{character.element}</strong>
              </div>
            )}

            {character.weapon && (
              <div className="detail-box">
                <span>Weapon</span>
                <strong>
                  {typeof character.weapon === 'object'
                    ? character.weapon?.name
                    : character.weapon}
                </strong>
              </div>
            )}

            {character.region && (
              <div className="detail-box">
                <span>Region</span>
                <strong>{character.region}</strong>
              </div>
            )}

            {character.version && (
              <div className="detail-box">
                <span>Version</span>
                <strong>{character.version}</strong>
              </div>
            )}
          </div>

          {buildProfile && (
            <section className="modal-section hero-build-section">
              <div className="hero-build-heading">
                <div>
                  <span className="modal-eyebrow">BUILD SNAPSHOT</span>
                  <h3>Recommended Build Direction</h3>
                </div>
                <span className="build-source-badge">Build guidance</span>
              </div>

              <div className="hero-build-grid">
                <div className="build-box">
                  <span>Artifacts</span>
                  <strong>{buildProfile.artifacts}</strong>
                </div>

                <div className="build-box">
                  <span>Main Stats</span>
                  <strong>{buildProfile.mainStats}</strong>
                </div>

                <div className="build-box">
                  <span>Substats</span>
                  <strong>{buildProfile.substats}</strong>
                </div>

                <div className="build-box">
                  <span>Talent Priority</span>
                  <strong>{buildProfile.talentPriority}</strong>
                </div>
              </div>

              <div className="build-callout">
                <b>Weapon</b>
                <span>{buildProfile.weaponAdvice}</span>
              </div>

              <div className="build-callout">
                <b>Ascension</b>
                <span>
                  {buildProfile.ascensionGem} + character-specific local,
                  boss and enemy materials.
                </span>
              </div>
            </section>
          )}

          {character.synergy && (
            <section className="modal-section">
              <h3>Team Synergy</h3>
              <p>{character.synergy}</p>
            </section>
          )}

          {character.notes && (
            <section className="modal-section">
              <h3>Notes</h3>
              <p>{character.notes}</p>
            </section>
          )}

          {Array.isArray(character.skills) && character.skills.length > 0 && (
            <section className="modal-section">
              <h3>Skills</h3>
              <div className="skills-list">
                {character.skills.map((skill, index) => (
                  <article className="skill-card" key={skill.id || skill.name || index}>
                    {skill.image && (
                      <img src={skill.image} alt={skill.name || 'Skill'} />
                    )}
                    <div>
                      <h4>{skill.name || `Skill ${index + 1}`}</h4>
                      {skill.description && <p>{skill.description}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {character.howToGet && (
            <section className="modal-section">
              <h3>How to Get</h3>
              <p>{character.howToGet}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default GamePage