import { Link } from 'react-router-dom'

/*
 * ============================================================
 * GAMENEXA — WHITEOUT SURVIVAL HUB
 * ============================================================
 * Main hub component for:
 * Facilities
 * Fortresses
 * Strongholds
 * Resources
 * Alliance Territory
 * Events
 * Buildings
 * Research
 * Troops
 * Calculators
 * Alliance Planner
 * Heroes
 * Battle Maps
 *
 * This component is intentionally self-contained.
 * No external packages required.
 * ============================================================
 */

const ICONS = {
  facilities: String.fromCodePoint(0x1f3ed),
  fortresses: String.fromCodePoint(0x1f3f0),
  strongholds: String.fromCodePoint(0x1f6e1, 0xfe0f),
  resources: String.fromCodePoint(0x1f332),
  territory: String.fromCodePoint(0x1f465),
  events: String.fromCodePoint(0x2694, 0xfe0f),
  buildings: String.fromCodePoint(0x1f3d7, 0xfe0f),
  research: String.fromCodePoint(0x1f52c),
  troops: String.fromCodePoint(0x1f396, 0xfe0f),
  calculators: String.fromCodePoint(0x1f9ee),
  planner: String.fromCodePoint(0x1f9ed),
  heroes: String.fromCodePoint(0x1f9b8),
  maps: String.fromCodePoint(0x1f5fa, 0xfe0f),
  guides: String.fromCodePoint(0x1f4da),
  arrow: String.fromCodePoint(0x2192),
  snow: String.fromCodePoint(0x2744, 0xfe0f),
  search: String.fromCodePoint(0x2315),
  target: String.fromCodePoint(0x1f3af),
  fire: String.fromCodePoint(0x1f525),
  shield: String.fromCodePoint(0x1f6e1, 0xfe0f),
  clock: String.fromCodePoint(0x23f1, 0xfe0f),
  chart: String.fromCodePoint(0x1f4ca),
  pin: String.fromCodePoint(0x1f4cd),
  check: String.fromCodePoint(0x2705),
}

const HUB_SECTIONS = [
  {
    id: 'facilities',
    icon: ICONS.facilities,
    title: 'Facilities',
    label: 'STATE & EVENT',
    description:
      'Facility locations, objectives, effects and practical alliance strategy.',
    items: [
      'Imperial Foundry',
      'Boiler Room',
      'Central Transit',
      'Munitions Warehouse',
      'Mercenary Camp',
      'Event facilities',
    ],
    color: 'cyan',
  },
  {
    id: 'fortresses',
    icon: ICONS.fortresses,
    title: 'Fortresses',
    label: 'TERRITORY CONTROL',
    description:
      'Track fortress objectives, ownership, rallies and defensive priorities.',
    items: [
      'Fortress objectives',
      'Rally planning',
      'Garrison planning',
      'Alliance control',
      'Rewards',
      'Defensive priorities',
    ],
    color: 'blue',
  },
  {
    id: 'strongholds',
    icon: ICONS.strongholds,
    title: 'Strongholds',
    label: 'CONTROL POINTS',
    description:
      'Organize stronghold priorities, control strategy and alliance assignments.',
    items: [
      'Stronghold status',
      'Control priorities',
      'Rally points',
      'Defense assignments',
      'Attack planning',
      'Reward notes',
    ],
    color: 'purple',
  },
  {
    id: 'resources',
    icon: ICONS.resources,
    title: 'Resources',
    label: 'ECONOMY',
    description:
      'Plan Wood, Coal, Iron and Meat production, gathering and protection.',
    items: [
      'Wood',
      'Coal',
      'Iron',
      'Meat',
      'Gathering',
      'Resource protection',
    ],
    color: 'green',
  },
  {
    id: 'territory',
    icon: ICONS.territory,
    title: 'Alliance Territory',
    label: 'ALLIANCE',
    description:
      'Plan HQ placement, banners, connected territory and alliance expansion.',
    items: [
      'Alliance HQ',
      'Banners',
      'Connected territory',
      'Expansion',
      'Strategic positions',
      'Territory planning',
    ],
    color: 'orange',
  },
  {
    id: 'events',
    icon: ICONS.events,
    title: 'Events',
    label: 'EVENTS',
    description:
      'Keep major alliance and state events organized in one place.',
    items: [
      'Bear Trap',
      'Crazy Joe',
      'Foundry Battle',
      'Canyon Clash',
      'Sunfire',
      'State Transfer',
    ],
    color: 'red',
  },
  {
    id: 'buildings',
    icon: ICONS.buildings,
    title: 'Buildings',
    label: 'PROGRESSION',
    description:
      'Settlement buildings, upgrade priorities and progression requirements.',
    items: [
      'Furnace',
      'Embassy',
      'Command Center',
      'Infirmary',
      'War Academy',
      'Other buildings',
    ],
    color: 'yellow',
  },
  {
    id: 'research',
    icon: ICONS.research,
    title: 'Research',
    label: 'TECHNOLOGY',
    description:
      'Economy, Battle and March research priorities for stronger progression.',
    items: [
      'Construction',
      'Gathering',
      'Troop Attack',
      'Troop Defense',
      'March Speed',
      'Research Speed',
    ],
    color: 'violet',
  },
  {
    id: 'troops',
    icon: ICONS.troops,
    title: 'Troops',
    label: 'MILITARY',
    description:
      'Infantry, Lancer and Marksman roles, formations and training priorities.',
    items: [
      'Infantry',
      'Lancer',
      'Marksman',
      'Formation',
      'Training',
      'March composition',
    ],
    color: 'steel',
  },
]

const QUICK_LINKS = [
  {
    title: 'Heroes',
    description: 'Browse the Whiteout Survival hero database.',
    icon: ICONS.heroes,
    path: '/game/whiteout-survival/heroes',
    tag: 'DATABASE',
  },
  {
    title: 'Battle Maps',
    description: 'Explore battle maps and objective locations.',
    icon: ICONS.maps,
    path: '/game/whiteout-survival/battle-maps',
    tag: 'MAPS',
  },
  {
    title: 'Calculators',
    description: 'Resource, speedup and progression calculations.',
    icon: ICONS.calculators,
    path: '/game/whiteout-survival/calculators',
    tag: 'TOOLS',
  },
  {
    title: 'Alliance Planner',
    description: 'Plan rallies, objectives and alliance movements.',
    icon: ICONS.planner,
    path: '/game/whiteout-survival/planner',
    tag: 'PLANNING',
  },
]

const STATS = [
  {
    value: '4',
    label: 'Core Resources',
    icon: ICONS.resources,
  },
  {
    value: '3',
    label: 'Troop Classes',
    icon: ICONS.troops,
  },
  {
    value: '24/7',
    label: 'Strategy Hub',
    icon: ICONS.clock,
  },
  {
    value: '1',
    label: 'Alliance Planner',
    icon: ICONS.planner,
  },
]

function SectionCard({ section }) {
  return (
    <article className={`wsh-section-card wsh-${section.color}`}>
      <div className="wsh-card-top">
        <div className="wsh-card-icon">{section.icon}</div>

        <span className="wsh-card-label">
          {section.label}
        </span>
      </div>

      <h3>{section.title}</h3>

      <p>{section.description}</p>

      <div className="wsh-card-items">
        {section.items.map((item) => (
          <span key={item}>
            {item}
          </span>
        ))}
      </div>

      <div className="wsh-card-footer">
        <span>Explore section</span>
        <span className="wsh-arrow">
          {ICONS.arrow}
        </span>
      </div>
    </article>
  )
}

function QuickLink({ item }) {
  return (
    <Link
      to={item.path}
      className="wsh-quick-link"
    >
      <div className="wsh-quick-icon">
        {item.icon}
      </div>

      <div className="wsh-quick-content">
        <span className="wsh-quick-tag">
          {item.tag}
        </span>

        <h3>{item.title}</h3>

        <p>{item.description}</p>
      </div>

      <span className="wsh-quick-arrow">
        {ICONS.arrow}
      </span>
    </Link>
  )
}

export default function WhiteoutHub() {
  return (
    <section className="whiteout-survival-hub">
      <style>{`
        .whiteout-survival-hub {
          --wsh-bg: #06131a;
          --wsh-bg-2: #081d26;
          --wsh-bg-3: #0b2732;
          --wsh-border: rgba(103, 191, 212, .16);
          --wsh-border-strong: rgba(103, 191, 212, .28);
          --wsh-text: #edfaff;
          --wsh-muted: #89a7b1;
          --wsh-soft: #63828d;
          --wsh-accent: #5fc4dc;

          margin: 30px 0;
          border: 1px solid var(--wsh-border);
          border-radius: 24px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 85% 0%,
              rgba(40, 143, 171, .11),
              transparent 34%
            ),
            radial-gradient(
              circle at 10% 30%,
              rgba(55, 116, 137, .07),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #071a22 0%,
              #041117 100%
            );
          box-shadow:
            0 20px 55px rgba(0, 0, 0, .22);
        }

        .wsh-hero {
          position: relative;
          padding: 34px 32px 30px;
          border-bottom: 1px solid var(--wsh-border);
          overflow: hidden;
        }

        .wsh-hero::before {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          right: -100px;
          top: -130px;
          border-radius: 50%;
          background: rgba(76, 187, 211, .08);
          pointer-events: none;
        }

        .wsh-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #65c6de;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.7px;
          text-transform: uppercase;
        }

        .wsh-kicker-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #65c6de;
          box-shadow: 0 0 12px rgba(101, 198, 222, .6);
        }

        .wsh-hero h2 {
          position: relative;
          margin: 9px 0 8px;
          color: var(--wsh-text);
          font-size: clamp(25px, 4vw, 36px);
          line-height: 1.1;
          letter-spacing: -.7px;
        }

        .wsh-hero-description {
          position: relative;
          max-width: 850px;
          margin: 0;
          color: var(--wsh-muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .wsh-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 24px;
        }

        .wsh-stat {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px 13px;
          border: 1px solid rgba(103, 191, 212, .12);
          border-radius: 12px;
          background: rgba(5, 25, 32, .7);
        }

        .wsh-stat-icon {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          border-radius: 9px;
          background: rgba(75, 169, 193, .10);
          font-size: 18px;
        }

        .wsh-stat strong {
          display: block;
          color: var(--wsh-text);
          font-size: 16px;
          line-height: 1;
        }

        .wsh-stat span {
          display: block;
          margin-top: 4px;
          color: var(--wsh-soft);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .5px;
          text-transform: uppercase;
        }

        .wsh-body {
          padding: 22px;
        }

        .wsh-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 14px;
        }

        .wsh-section-heading h3 {
          margin: 4px 0 0;
          color: var(--wsh-text);
          font-size: 20px;
        }

        .wsh-section-heading p {
          max-width: 600px;
          margin: 5px 0 0;
          color: var(--wsh-soft);
          font-size: 11px;
          line-height: 1.5;
        }

        .wsh-section-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .wsh-section-card {
          position: relative;
          min-width: 0;
          padding: 18px;
          border: 1px solid var(--wsh-border);
          border-radius: 16px;
          background:
            linear-gradient(
              145deg,
              rgba(10, 38, 48, .94),
              rgba(5, 24, 31, .96)
            );
          transition:
            transform .18s ease,
            border-color .18s ease,
            box-shadow .18s ease;
        }

        .wsh-section-card:hover {
          transform: translateY(-2px);
          border-color: var(--wsh-border-strong);
          box-shadow: 0 12px 30px rgba(0, 0, 0, .18);
        }

        .wsh-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .wsh-card-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border-radius: 12px;
          background: rgba(89, 190, 211, .09);
          border: 1px solid rgba(89, 190, 211, .12);
          font-size: 23px;
        }

        .wsh-card-label {
          padding: 5px 7px;
          border-radius: 6px;
          color: #69909a;
          background: rgba(91, 169, 188, .06);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .8px;
        }

        .wsh-section-card h3 {
          margin: 14px 0 6px;
          color: var(--wsh-text);
          font-size: 16px;
        }

        .wsh-section-card > p {
          min-height: 51px;
          margin: 0;
          color: var(--wsh-muted);
          font-size: 11px;
          line-height: 1.55;
        }

        .wsh-card-items {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 14px;
        }

        .wsh-card-items span {
          padding: 5px 7px;
          border: 1px solid rgba(103, 191, 212, .09);
          border-radius: 6px;
          color: #76959e;
          background: rgba(2, 15, 20, .45);
          font-size: 9px;
        }

        .wsh-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding-top: 11px;
          border-top: 1px solid rgba(103, 191, 212, .08);
          color: #60909b;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .5px;
        }

        .wsh-arrow {
          color: #65c6de;
          font-size: 15px;
        }

        .wsh-cyan .wsh-card-icon {
          background: rgba(50, 184, 211, .11);
        }

        .wsh-blue .wsh-card-icon {
          background: rgba(66, 119, 221, .11);
        }

        .wsh-purple .wsh-card-icon {
          background: rgba(141, 91, 220, .11);
        }

        .wsh-green .wsh-card-icon {
          background: rgba(73, 176, 113, .11);
        }

        .wsh-orange .wsh-card-icon {
          background: rgba(220, 137, 56, .11);
        }

        .wsh-red .wsh-card-icon {
          background: rgba(211, 74, 74, .11);
        }

        .wsh-yellow .wsh-card-icon {
          background: rgba(205, 177, 60, .11);
        }

        .wsh-violet .wsh-card-icon {
          background: rgba(133, 85, 205, .11);
        }

        .wsh-steel .wsh-card-icon {
          background: rgba(97, 133, 153, .13);
        }

        .wsh-quick-area {
          margin-top: 28px;
        }

        .wsh-quick-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .wsh-quick-link {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
          padding: 13px;
          color: inherit;
          text-decoration: none;
          border: 1px solid rgba(103, 191, 212, .15);
          border-radius: 14px;
          background: #071e27;
          transition:
            transform .18s ease,
            border-color .18s ease,
            background .18s ease;
        }

        .wsh-quick-link:hover {
          transform: translateY(-2px);
          border-color: rgba(103, 191, 212, .34);
          background: #092832;
        }

        .wsh-quick-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          border-radius: 11px;
          background: rgba(91, 190, 211, .09);
          font-size: 21px;
        }

        .wsh-quick-content {
          min-width: 0;
          flex: 1;
        }

        .wsh-quick-tag {
          color: #5c8994;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .8px;
        }

        .wsh-quick-content h3 {
          margin: 3px 0 3px;
          color: var(--wsh-text);
          font-size: 13px;
        }

        .wsh-quick-content p {
          overflow: hidden;
          margin: 0;
          color: var(--wsh-soft);
          font-size: 9px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .wsh-quick-arrow {
          color: #5dbbd1;
          font-size: 16px;
        }

        .wsh-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .wsh-info-card {
          padding: 17px;
          border: 1px solid rgba(103, 191, 212, .12);
          border-radius: 14px;
          background: rgba(6, 25, 32, .7);
        }

        .wsh-info-card-head {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 8px;
        }

        .wsh-info-card-head-icon {
          font-size: 18px;
        }

        .wsh-info-card h3 {
          margin: 0;
          color: var(--wsh-text);
          font-size: 14px;
        }

        .wsh-info-card p {
          margin: 0;
          color: var(--wsh-muted);
          font-size: 10px;
          line-height: 1.6;
        }

        .wsh-info-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 11px;
        }

        .wsh-info-pills span {
          padding: 5px 7px;
          border-radius: 6px;
          background: #071a22;
          border: 1px solid rgba(103, 191, 212, .09);
          color: #7899a3;
          font-size: 9px;
        }

        .wsh-credit {
          padding: 15px 22px;
          border-top: 1px solid rgba(103, 191, 212, .10);
          color: #4f6e77;
          text-align: center;
          font-size: 9px;
          line-height: 1.5;
        }

        @media (max-width: 1000px) {
          .wsh-section-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .wsh-quick-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .wsh-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .whiteout-survival-hub {
            margin: 20px 0;
            border-radius: 17px;
          }

          .wsh-hero {
            padding: 23px 17px 20px;
          }

          .wsh-hero h2 {
            font-size: 25px;
          }

          .wsh-body {
            padding: 13px;
          }

          .wsh-section-grid,
          .wsh-quick-grid,
          .wsh-bottom {
            grid-template-columns: 1fr;
          }

          .wsh-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
          }

          .wsh-stat {
            padding: 10px;
          }

          .wsh-stat-icon {
            width: 30px;
            height: 30px;
            flex-basis: 30px;
            font-size: 15px;
          }

          .wsh-stat strong {
            font-size: 14px;
          }

          .wsh-stat span {
            font-size: 8px;
          }

          .wsh-section-card {
            padding: 15px;
          }

          .wsh-section-card > p {
            min-height: auto;
          }

          .wsh-section-heading {
            display: block;
          }

          .wsh-quick-link {
            padding: 12px;
          }
        }
      `}</style>

      {/* ======================================================
          HERO
      ====================================================== */}
      <header className="wsh-hero">
        <div className="wsh-kicker">
          <span className="wsh-kicker-dot" />
          WHITEOUT SURVIVAL STRATEGY HUB
        </div>

        <h2>
          Whiteout Survival Hub
        </h2>

        <p className="wsh-hero-description">
          Your central GameNexa reference for Whiteout Survival.
          Explore heroes, battle maps, facilities, fortresses,
          strongholds, resources, alliance territory, events,
          buildings, research, troops and planning tools.
        </p>

        <div className="wsh-stats">
          {STATS.map((stat) => (
            <div
              className="wsh-stat"
              key={stat.label}
            >
              <div className="wsh-stat-icon">
                {stat.icon}
              </div>

              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="wsh-body">

        {/* ====================================================
            QUICK ACCESS
        ==================================================== */}
        <section className="wsh-quick-area">
          <div className="wsh-section-heading">
            <div>
              <span className="wsh-kicker">
                <span className="wsh-kicker-dot" />
                QUICK ACCESS
              </span>

              <h3>
                Most important tools
              </h3>

              <p>
                Jump directly into the sections players use most.
              </p>
            </div>
          </div>

          <div className="wsh-quick-grid">
            {QUICK_LINKS.map((item) => (
              <QuickLink
                item={item}
                key={item.title}
              />
            ))}
          </div>
        </section>

        {/* ====================================================
            STRATEGY DATABASE
        ==================================================== */}
        <section style={{ marginTop: 30 }}>
          <div className="wsh-section-heading">
            <div>
              <span className="wsh-kicker">
                <span className="wsh-kicker-dot" />
                STRATEGY DATABASE
              </span>

              <h3>
                Explore Whiteout Survival
              </h3>

              <p>
                Everything is organized by the part of the game
                you are trying to improve.
              </p>
            </div>
          </div>

          <div className="wsh-section-grid">
            {HUB_SECTIONS.map((section) => (
              <SectionCard
                section={section}
                key={section.id}
              />
            ))}
          </div>
        </section>

        {/* ====================================================
            STRATEGY INFORMATION
        ==================================================== */}
        <section className="wsh-bottom">

          <div className="wsh-info-card">
            <div className="wsh-info-card-head">
              <span className="wsh-info-card-head-icon">
                {ICONS.target}
              </span>

              <h3>
                Alliance priorities
              </h3>
            </div>

            <p>
              Use the hub to coordinate objectives, territory,
              rallies and event assignments before committing
              troops or resources.
            </p>

            <div className="wsh-info-pills">
              <span>{ICONS.check} Objectives</span>
              <span>{ICONS.check} Rallies</span>
              <span>{ICONS.check} Territory</span>
              <span>{ICONS.check} Defense</span>
            </div>
          </div>

          <div className="wsh-info-card">
            <div className="wsh-info-card-head">
              <span className="wsh-info-card-head-icon">
                {ICONS.chart}
              </span>

              <h3>
                Progression focus
              </h3>
            </div>

            <p>
              Build stronger accounts by balancing Furnace
              progression, research, troop development,
              resources and hero investment.
            </p>

            <div className="wsh-info-pills">
              <span>{ICONS.check} Furnace</span>
              <span>{ICONS.check} Research</span>
              <span>{ICONS.check} Troops</span>
              <span>{ICONS.check} Heroes</span>
            </div>
          </div>

        </section>

        {/* ====================================================
            FOOTER GUIDE NOTE
        ==================================================== */}
        <div className="wsh-credit">
          {ICONS.snow} GameNexa Whiteout Survival Hub —
          built as a practical strategy reference for players
          and alliance officers.
        </div>

      </div>
    </section>
  )
}