import { Link, useParams } from 'react-router-dom'
import { SEO } from '../SEO'
import './WhiteoutSectionPage.css'

const BASE = '/game/whiteout-survival'

const SECTIONS = {
  facilities: {
    icon: '🏭',
    title: 'Whiteout Survival Facilities',
    shortTitle: 'Facilities',
    description:
      'Explore Whiteout Survival facilities, their purposes, locations, strategic value and event uses.',
    intro:
      'Whiteout Survival facilities are important objectives that can influence state events, alliance strategy and battlefield control.',
    keywords:
      'Whiteout Survival facilities, Whiteout Survival facility guide, facilities locations, state facilities, event facilities',
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
    description:
      'Complete Whiteout Survival fortress guide covering ownership, rallies, garrisons, rewards and alliance priorities.',
    intro:
      'Fortresses are major alliance objectives in Whiteout Survival. Planning ownership, rallies and defense can make a major difference during state activities.',
    keywords:
      'Whiteout Survival fortresses, fortress guide, fortress ownership, fortress rally, fortress garrison, fortress rewards',
    headings: [
      ['Fortress Ownership', 'Organize fortress ownership and keep alliance priorities clear before important events.'],
      ['Rallies and Garrisons', 'Plan rally participation, garrison assignments and defensive coverage around fortress objectives.'],
      ['Fortress Rewards', 'Keep reward information organized so alliance members understand the value of fortress control.'],
    ],
  },

  strongholds: {
    icon: '🛡️',
    title: 'Whiteout Survival Strongholds',
    shortTitle: 'Strongholds',
    description:
      'Whiteout Survival strongholds guide covering control priorities, defensive assignments, rallies and rewards.',
    intro:
      'Strongholds are important control objectives for alliances. Use this page to organize priorities and prepare for stronghold activities.',
    keywords:
      'Whiteout Survival strongholds, stronghold guide, stronghold control, stronghold rally, stronghold rewards',
    headings: [
      ['Stronghold Control', 'Track which strongholds matter most to your alliance and organize control priorities.'],
      ['Defense Assignments', 'Prepare defensive assignments and rally points before stronghold activities begin.'],
      ['Stronghold Strategy', 'Use stronghold information to coordinate alliance members and improve event preparation.'],
    ],
  },

  resources: {
    icon: '🌲',
    title: 'Whiteout Survival Resources',
    shortTitle: 'Resources',
    description:
      'Whiteout Survival resource guide covering Wood, Coal, Iron, Meat, gathering and resource protection.',
    intro:
      'Resources are the foundation of settlement progression in Whiteout Survival. Efficient gathering and protection help maintain steady growth.',
    keywords:
      'Whiteout Survival resources, Wood, Coal, Iron, Meat, resource guide, gathering guide, resource protection',
    headings: [
      ['Wood, Coal, Iron and Meat', 'Understand the four core resources and how they contribute to settlement progression.'],
      ['Resource Gathering', 'Plan gathering marches and prioritize efficient resource collection.'],
      ['Resource Protection', 'Reduce unnecessary resource exposure and prepare resources for major upgrades.'],
    ],
  },

  'alliance-territory': {
    icon: '👥',
    title: 'Whiteout Survival Alliance Territory',
    shortTitle: 'Alliance Territory',
    description:
      'Whiteout Survival alliance territory guide covering HQ placement, banners, connected territory and expansion.',
    intro:
      'Alliance territory planning is important for expansion, access to objectives and coordinated movement across the state.',
    keywords:
      'Whiteout Survival alliance territory, alliance HQ, alliance banners, territory expansion, alliance territory guide',
    headings: [
      ['Alliance HQ Placement', 'Plan your HQ position around alliance objectives, access and future expansion.'],
      ['Alliance Banners', 'Understand banner placement and connected territory when expanding alliance control.'],
      ['Territory Expansion', 'Organize expansion priorities so your alliance can secure useful positions efficiently.'],
    ],
  },

  events: {
    icon: '⚔️',
    title: 'Whiteout Survival Events',
    shortTitle: 'Events',
    description:
      'Whiteout Survival events hub covering Bear Trap, Crazy Joe, Foundry, Canyon Clash and alliance event preparation.',
    intro:
      'Whiteout Survival has many recurring events that require preparation, coordination and efficient use of heroes, troops and resources.',
    keywords:
      'Whiteout Survival events, Bear Trap, Crazy Joe, Foundry Battle, Canyon Clash, event guide, event preparation',
    headings: [
      ['Bear Trap', 'Prepare rallies, heroes and troops for Bear Trap and coordinate participation with your alliance.'],
      ['Crazy Joe', 'Understand the basic preparation and defensive approach for Crazy Joe activities.'],
      ['Foundry and Canyon Clash', 'Use battle planning, troop coordination and map awareness during major alliance events.'],
    ],
  },

  buildings: {
    icon: '🏗️',
    title: 'Whiteout Survival Buildings',
    shortTitle: 'Buildings',
    description:
      'Whiteout Survival buildings guide covering Furnace, Embassy, Command Center, Infirmary and upgrade priorities.',
    intro:
      'Settlement buildings determine progression, troop capacity, research access and many other parts of Whiteout Survival.',
    keywords:
      'Whiteout Survival buildings, Furnace guide, Embassy, Command Center, Infirmary, building upgrade guide',
    headings: [
      ['Furnace', 'Understand the importance of Furnace progression and how it affects settlement development.'],
      ['Core Buildings', 'Review important buildings such as the Embassy, Command Center and Infirmary.'],
      ['Upgrade Priorities', 'Organize upgrade priorities around progression requirements and available resources.'],
    ],
  },

  research: {
    icon: '🔬',
    title: 'Whiteout Survival Research',
    shortTitle: 'Research',
    description:
      'Whiteout Survival research guide covering Economy, Battle and March research priorities and progression.',
    intro:
      'Research provides permanent improvements that strengthen economy, troops and march capabilities.',
    keywords:
      'Whiteout Survival research, research guide, Economy research, Battle research, March research, research priorities',
    headings: [
      ['Economy Research', 'Prioritize research that improves resource production, gathering and economic progression.'],
      ['Battle Research', 'Improve combat-related research to strengthen your army and battle performance.'],
      ['March Research', 'Focus on research that improves march capacity, speed and practical field performance.'],
    ],
  },

  troops: {
    icon: '🎖️',
    title: 'Whiteout Survival Troops',
    shortTitle: 'Troops',
    description:
      'Whiteout Survival troops guide covering Infantry, Lancer and Marksman roles, formations and training priorities.',
    intro:
      'Whiteout Survival armies use Infantry, Lancer and Marksman troops. Understanding their roles helps create effective formations.',
    keywords:
      'Whiteout Survival troops, Infantry, Lancer, Marksman, troop guide, troop formation, troop training',
    headings: [
      ['Infantry', 'Learn the role of Infantry troops and when they are useful in different formations.'],
      ['Lancer', 'Understand Lancer strengths and how they fit into balanced Whiteout Survival formations.'],
      ['Marksman', 'Learn how Marksmen contribute damage and how to combine them with other troop types.'],
      ['Troop Training', 'Plan troop training and progression while maintaining a useful balance across troop types.'],
    ],
  },

  calculators: {
    icon: '🧮',
    title: 'Whiteout Survival Calculators',
    shortTitle: 'Calculators',
    description:
      'Whiteout Survival calculators and planning tools for resources, speedups, troops and progression.',
    intro:
      'Use GameNexa calculators to make Whiteout Survival progression and alliance planning easier.',
    keywords:
      'Whiteout Survival calculator, resource calculator, speedup calculator, troop calculator, progression calculator',
    headings: [
      ['Resource Calculator', 'Estimate resource requirements and organize upcoming settlement upgrades.'],
      ['Speedup Calculator', 'Convert and compare speedup time when planning important upgrades and research.'],
      ['Troop Planning', 'Use troop planning information to estimate army requirements and progression goals.'],
    ],
  },

  'alliance-planner': {
    icon: '🧭',
    title: 'Whiteout Survival Alliance Planner',
    shortTitle: 'Alliance Planner',
    description:
      'Whiteout Survival alliance planner for objectives, rally points, territory moves, assignments and event coordination.',
    intro:
      'GameNexa Alliance Planner helps officers organize objectives, assignments and event coordination in one workspace.',
    keywords:
      'Whiteout Survival alliance planner, alliance planning, rally planning, territory planning, event assignments',
    headings: [
      ['Alliance Objectives', 'Create clear priorities for fortresses, strongholds, facilities and major events.'],
      ['Rally Coordination', 'Organize rally points, participation and assignments before major activities.'],
      ['Event Assignments', 'Keep alliance responsibilities organized so members know where and when they are needed.'],
    ],
  },

  'battle-maps': {
    icon: '🗺️',
    title: 'Whiteout Survival Battle Maps',
    shortTitle: 'Battle Maps',
    description:
      'Whiteout Survival battle maps for Foundry Battle, Canyon Clash and alliance planning.',
    intro:
      'Use Whiteout Survival battle maps to study objectives, movement, defensive positions and alliance coordination.',
    keywords:
      'Whiteout Survival map, Whiteout Survival battle map, Foundry map, Canyon Clash map, alliance map',
    headings: [
      ['Foundry Battle Map', 'Use the Foundry Battle map for objective planning, movement and alliance coordination.'],
      ['Canyon Clash Map', 'Review Canyon Clash map information when preparing attacks, defense and movement.'],
      ['Map Planning', 'Use map references to coordinate objectives, rally positions and defensive assignments.'],
    ],
  },

  heroes: {
    icon: '🦸',
    title: 'Whiteout Survival Heroes',
    shortTitle: 'Heroes',
    description:
      'Browse the Whiteout Survival hero database on GameNexa with searchable heroes, roles, generations and practical information.',
    intro:
      'Explore the Whiteout Survival hero database and find hero information for progression, team building and event preparation.',
    keywords:
      'Whiteout Survival heroes, Whiteout Survival hero database, hero guide, hero roles, hero generations',
    headings: [
      ['Hero Database', 'Browse and search the GameNexa Whiteout Survival hero database.'],
      ['Hero Generations', 'Understand hero generations and organize your roster around progression and availability.'],
      ['Hero Roles', 'Compare hero roles and use appropriate heroes for rallies, combat and other activities.'],
    ],
  },
}

const related = Object.entries(SECTIONS)

function WhiteoutSectionPage() {
  const { section } = useParams()
  const data = SECTIONS[section]

  if (!data) {
    return (
      <>
        <SEO
          title="Whiteout Survival Page Not Found | GameNexa"
          description="The requested Whiteout Survival page could not be found on GameNexa."
          path={`${BASE}/${section || ''}`}
          noindex
        />

        <main className="whiteout-section-page">
          <div className="whiteout-section-inner">
            <span className="whiteout-section-kicker">WHITEOUT SURVIVAL</span>
            <h1>Page Not Found</h1>
            <p>The requested Whiteout Survival section does not exist.</p>
            <Link to={BASE} className="whiteout-section-button">
              ← Back to Whiteout Survival
            </Link>
          </div>
        </main>
      </>
    )
  }

  const path = `${BASE}/${section}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.title,
    description: data.description,
    url: `https://gamenexa.gamenexa.workers.dev${path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'GameNexa',
      url: 'https://gamenexa.gamenexa.workers.dev/',
    },
  }

  return (
    <>
      <SEO
        title={`${data.title} | GameNexa`}
        description={data.description}
        path={path}
        type="website"
        jsonLd={jsonLd}
      />

      <main className="whiteout-section-page">
        <div className="whiteout-section-inner">

          <div className="whiteout-breadcrumb">
            <Link to="/">GameNexa</Link>
            <span>›</span>
            <Link to={BASE}>Whiteout Survival</Link>
            <span>›</span>
            <strong>{data.shortTitle}</strong>
          </div>

          <header className="whiteout-section-hero">
            <div className="whiteout-section-icon">{data.icon}</div>

            <div>
              <span className="whiteout-section-kicker">
                WHITEOUT SURVIVAL
              </span>

              <h1>{data.title}</h1>

              <p>{data.intro}</p>
            </div>
          </header>

          <section className="whiteout-section-content">

            <div className="whiteout-main-column">
              {data.headings.map(([heading, text]) => (
                <article
                  className="whiteout-seo-section"
                  key={heading}
                >
                  <h2>{heading}</h2>
                  <p>{text}</p>
                </article>
              ))}

              <section className="whiteout-seo-section">
                <h2>Whiteout Survival {data.shortTitle} Guide</h2>

                <p>
                  GameNexa organizes Whiteout Survival information into
                  practical reference pages designed for players and
                  alliance officers. Use this section together with the
                  Whiteout Survival hero database, guides, maps and
                  planning tools.
                </p>

                <p>
                  This page is part of the GameNexa Whiteout Survival
                  knowledge base and is updated as more game information
                  and database content is added.
                </p>
              </section>
            </div>

            <aside className="whiteout-section-sidebar">
              <div className="whiteout-sidebar-card">
                <span className="whiteout-section-kicker">
                  WHITEOUT SURVIVAL HUB
                </span>

                <h2>Explore Whiteout Survival</h2>

                <div className="whiteout-related-links">
                  {related.map(([slug, item]) => (
                    <Link
                      key={slug}
                      to={`${BASE}/${slug}`}
                      className={slug === section ? 'active' : ''}
                    >
                      <span>{item.icon}</span>
                      {item.shortTitle}
                    </Link>
                  ))}
                </div>

                <Link
                  to={BASE}
                  className="whiteout-section-button"
                >
                  Open Whiteout Hub →
                </Link>
              </div>
            </aside>

          </section>
        </div>
      </main>
    </>
  )
}

export { SECTIONS }
export default WhiteoutSectionPage
