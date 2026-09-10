import { Link } from 'react-router-dom'
import { useState } from 'react'

const WHITEOUT_MAPS = [
  {
    id: 'foundry',
    title: 'Foundry Battle Map',
    subtitle:
      'Imperial Foundry, Boiler Room, Central Transit, Mercenary Camp and Munitions Warehouse',
    image: '/maps/foundry-battle-4k.jpg',
    icon: '&#x2694;&#xFE0F;',
  },
  {
    id: 'canyon',
    title: 'Canyon Clash Battle Map',
    subtitle:
      'Alliance battlefield, objectives, lanes and strategic positions',
    image: '/maps/canyon-clash-4k.jpg',
    icon: '&#x1F3D4;&#xFE0F;',
  },
]

const MODULES = {
  facilities: {
    icon: '&#x1F3ED;',
    title: 'Facilities',
    intro:
      'Important event and state facilities with their purpose, locations and strategic value.',
    sections: [
      ['Imperial Foundry', 'Major event facility used for alliance competition and objective control.'],
      ['Prototype Sites', 'Strategic locations that may become important during event progression.'],
      ['Repair Facility', 'Reference point for facility-related objectives and control planning.'],
      ['Munitions Warehouse', 'Important battlefield objective for alliance coordination.'],
      ['Mercenary Camp', 'Combat-related location requiring preparation and coordinated attacks.'],
      ['Central Transit Station', 'Central movement and objective reference point.'],
      ['Boiler Room', 'Facility objective used as part of battlefield planning.'],
    ],
  },

  fortresses: {
    icon: '&#x1F3F0;',
    title: 'Fortresses',
    intro:
      'Organize fortress ownership, rallies, garrisons, rewards and alliance priorities.',
    sections: [
      ['Fortress Ownership', 'Track which alliance controls each fortress.'],
      ['Rally Planning', 'Assign rally leads and joining heroes before the battle starts.'],
      ['Garrison Planning', 'Prepare defensive troops and reinforcement assignments.'],
      ['Alliance Coordination', 'Coordinate attack timing, targets and backup rallies.'],
      ['Reward Tracking', 'Record fortress rewards and participation requirements.'],
    ],
  },

  strongholds: {
    icon: '&#x1F6E1;&#xFE0F;',
    title: 'Strongholds',
    intro:
      'Keep stronghold priorities, control status and defensive assignments organized.',
    sections: [
      ['Stronghold Status', 'Track controlled, neutral and contested strongholds.'],
      ['Priority Targets', 'Identify which strongholds should be captured first.'],
      ['Rally Points', 'Prepare rally positions before attacking.'],
      ['Defense Assignments', 'Assign members to defend important objectives.'],
      ['Reward Notes', 'Keep event reward and participation notes together.'],
    ],
  },

  resources: {
    icon: '&#x1F332;',
    title: 'Resources',
    intro:
      'Whiteout Survival resource reference for gathering, protection and progression.',
    sections: [
      ['Wood', 'Used for construction, upgrades and various progression requirements.'],
      ['Coal', 'Core settlement resource used throughout progression.'],
      ['Iron', 'Higher-value resource required for advanced upgrades.'],
      ['Meat', 'Important resource for troop-related progression and development.'],
      ['Gathering', 'Prioritize gathering according to current upgrade requirements.'],
      ['Resource Protection', 'Avoid unnecessary resource exposure before major events.'],
    ],
  },

  territory: {
    icon: '&#x1F465;',
    title: 'Alliance Territory',
    intro:
      'Plan HQ placement, banners, connected territory and alliance expansion.',
    sections: [
      ['Alliance HQ', 'Central point for alliance territory and expansion planning.'],
      ['Banners', 'Use banners to connect and expand alliance territory.'],
      ['Connected Territory', 'Maintain efficient connections between important objectives.'],
      ['Expansion', 'Plan territory growth around strategic facilities and resources.'],
      ['Strategic Positions', 'Prioritize locations that improve access and event control.'],
    ],
  },

  events: {
    icon: '&#x2694;&#xFE0F;',
    title: 'Events',
    intro:
      'Central Whiteout Survival event reference and preparation hub.',
    sections: [
      ['Bear Trap', 'Coordinate rally leads, joiners, timing and damage optimization.'],
      ['Crazy Joe', 'Prepare defense formations, troop distribution and reinforcement plans.'],
      ['Foundry Battle', 'Plan objectives, movement, rallies and facility control.'],
      ['Canyon Clash', 'Coordinate lanes, objectives and alliance battlefield assignments.'],
      ['Sunfire Castle', 'Track preparation, battlefield roles and major objectives.'],
      ['State Transfer', 'Keep state-transfer preparation and requirements organized.'],
    ],
  },

  buildings: {
    icon: '&#x1F3D7;&#xFE0F;',
    title: 'Buildings',
    intro:
      'Core settlement buildings and practical upgrade priorities.',
    sections: [
      ['Furnace', 'The main progression building and primary upgrade priority.'],
      ['Embassy', 'Important for alliance assistance and reinforcement capacity.'],
      ['Command Center', 'Supports troop and march-related progression.'],
      ['Infirmary', 'Controls wounded troop capacity and recovery planning.'],
      ['War Academy', 'Supports combat-related development and progression.'],
      ['Resource Buildings', 'Maintain production buildings according to current needs.'],
    ],
  },

  research: {
    icon: '&#x1F52C;',
    title: 'Research',
    intro:
      'Research priorities organized around economy, battle and march development.',
    sections: [
      ['Construction Speed', 'Useful for reducing long-term building upgrade time.'],
      ['Gathering Speed', 'Improves resource collection efficiency.'],
      ['Troop Attack', 'Important combat stat for offensive progression.'],
      ['Troop Defense', 'Improves survivability during combat.'],
      ['Troop March Speed', 'Useful for rallies, reinforcement and battlefield movement.'],
      ['Economy Research', 'Prioritize economic research when developing your account.'],
      ['Battle Research', 'Increase combat research before major PvP events.'],
    ],
  },

  troops: {
    icon: '&#x1F3D6;&#xFE0F;',
    title: 'Troops',
    intro:
      'Understand Infantry, Lancer and Marksman roles and formation basics.',
    sections: [
      ['Infantry', 'Frontline troops designed to absorb damage and protect the formation.'],
      ['Lancer', 'Mobile damage-oriented troop class used in offensive formations.'],
      ['Marksman', 'Ranged damage class that provides strong backline damage.'],
      ['Formation', 'Balance troop classes according to the objective and available heroes.'],
      ['Training Priority', 'Keep troop production running and prioritize the highest available tier.'],
    ],
  },

  planner: {
    icon: '&#x1F9ED;',
    title: 'Alliance Planner',
    intro:
      'A simple planning workspace for alliance officers and event coordination.',
    sections: [
      ['Objective Assignments', 'Assign members to specific facilities, fortresses and strongholds.'],
      ['Rally Assignments', 'Record rally leads and important joining heroes.'],
      ['Defense Assignments', 'Assign members to defend important objectives.'],
      ['Territory Moves', 'Plan banner and territory movement before major operations.'],
      ['Event Roles', 'Assign rally, joiner, defense and support responsibilities.'],
    ],
  },
}

const NAV_ITEMS = [
  ['facilities', '&#x1F3ED;', 'Facilities'],
  ['fortresses', '&#x1F3F0;', 'Fortresses'],
  ['strongholds', '&#x1F6E1;&#xFE0F;', 'Strongholds'],
  ['resources', '&#x1F332;', 'Resources'],
  ['territory', '&#x1F465;', 'Alliance Territory'],
  ['events', '&#x2694;&#xFE0F;', 'Events'],
  ['buildings', '&#x1F3D7;&#xFE0F;', 'Buildings'],
  ['research', '&#x1F52C;', 'Research'],
  ['troops', '&#x1F3D6;&#xFE0F;', 'Troops'],
  ['calculators', '&#x1F9EE;', 'Calculators'],
  ['planner', '&#x1F9ED;', 'Alliance Planner'],
  ['heroes', '&#x1F9D9;', 'Heroes'],
  ['battle-maps', '&#x1F5FA;&#xFE0F;', 'Battle Maps'],
]

const ROUTES = {
  territory: 'alliance-territory',
  planner: 'alliance-planner',
  heroes: 'heroes',
  'battle-maps': 'battle-maps',
}

function WhiteoutHub() {
  const [active, setActive] = useState('overview')
  const [activeMap, setActiveMap] = useState('foundry')
  const [fullscreen, setFullscreen] = useState(false)

  const [calc, setCalc] = useState({
    wood: 0,
    coal: 0,
    iron: 0,
    meat: 0,
    hours: 24,
    troops: 10000,
  })

  const map =
    WHITEOUT_MAPS.find((item) => item.id === activeMap) ||
    WHITEOUT_MAPS[0]

  const resourceTotal =
    Number(calc.wood || 0) +
    Number(calc.coal || 0) +
    Number(calc.iron || 0) +
    Number(calc.meat || 0)

  const hours = Number(calc.hours || 0)

  const updateCalc = (key, value) => {
    setCalc((current) => ({
      ...current,
      [key]: value,
    }))
  }

  return (
    <section className="wnx-tools">
      <style>{`
        .wnx-tools{margin:28px 0 0;border:1px solid rgba(93,180,202,.2);border-radius:22px;background:linear-gradient(145deg,rgba(8,31,40,.98),rgba(4,20,27,.98));overflow:hidden}
        .wnx-head{padding:28px;border-bottom:1px solid rgba(93,180,202,.14)}
        .wnx-kicker{font-size:11px;letter-spacing:1.5px;font-weight:800;color:#67bfd4;text-transform:uppercase}
        .wnx-head h2{margin:7px 0 6px;font-size:30px;color:#effcff}
        .wnx-head p{margin:0;max-width:850px;color:#8eacb5;line-height:1.65}
        .wnx-body{padding:22px}
        .wnx-overview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
        .wnx-overview-card{border:1px solid rgba(93,180,202,.16);background:#08232d;border-radius:15px;padding:19px;cursor:pointer;color:#b9d2d9;text-align:left;text-decoration:none;display:block;transition:.2s ease}
        .wnx-overview-card:hover{border-color:#2c8296;transform:translateY(-2px)}
        .wnx-overview-card .icon{font-size:28px;margin-bottom:10px}
        .wnx-overview-card h3{margin:0 0 7px;color:#effcff;font-size:16px}
        .wnx-overview-card p{margin:0;color:#7899a4;font-size:11px;line-height:1.55}
        .wnx-detail{border:1px solid rgba(93,180,202,.17);background:#08232d;border-radius:16px;padding:22px}
        .wnx-detail-header{display:flex;align-items:flex-start;gap:14px;margin-bottom:18px}
        .wnx-detail-icon{font-size:34px}
        .wnx-detail h3{margin:0 0 6px;color:#effcff;font-size:23px}
        .wnx-detail-intro{margin:0;color:#87a6b0;line-height:1.6;font-size:13px}
        .wnx-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
        .wnx-list-card{padding:15px;background:#061a22;border:1px solid #183b45;border-radius:11px}
        .wnx-list-card strong{display:block;color:#dffaff;font-size:13px;margin-bottom:5px}
        .wnx-list-card span{display:block;color:#7899a4;font-size:11px;line-height:1.55}
        .wnx-back{border:1px solid rgba(93,180,202,.22);background:#09232d;color:#a8d3dd;border-radius:10px;padding:8px 13px;font-size:12px;font-weight:700;cursor:pointer;margin-bottom:14px}
        .wnx-back:hover{background:#103e4c;color:#effcff}
        .wnx-map-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:18px}
        .wnx-map-card{border:1px solid rgba(93,180,202,.2);background:#061820;border-radius:16px;overflow:hidden}
        .wnx-map-buttons{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px}
        .wnx-map-button{border:1px solid #244955;background:#092630;color:#a8c4cc;border-radius:11px;padding:13px;text-align:left;cursor:pointer}
        .wnx-map-button.active{border-color:#29afd0;background:#103d4a;color:#effcff}
        .wnx-map-button strong,.wnx-map-button span{display:block}
        .wnx-map-button span{font-size:11px;color:#789aa5;margin-top:4px;line-height:1.4}
        .wnx-map-view{position:relative;background:#02080c;min-height:420px;display:flex;align-items:center;justify-content:center}
        .wnx-map-view img{width:100%;height:100%;min-height:420px;object-fit:contain;display:block}
        .wnx-map-fs{position:absolute;right:12px;top:12px;border:1px solid #38616d;background:#0a2b35;color:#d8f8fd;border-radius:9px;padding:8px 11px;font-size:11px;font-weight:700;cursor:pointer}
        .wnx-map-info{padding:18px}
        .wnx-map-info h3{margin:0 0 6px;color:#effcff}
        .wnx-map-info p{margin:0;color:#7f9da7;font-size:12px;line-height:1.6}
        .wnx-calc{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .wnx-calc-card{border:1px solid rgba(93,180,202,.17);background:#08232d;border-radius:14px;padding:18px}
        .wnx-calc-card h3{margin:0 0 14px;color:#effcff}
        .wnx-field{display:block;margin:10px 0}
        .wnx-field span{display:block;color:#7899a4;font-size:11px;margin-bottom:5px}
        .wnx-field input{width:100%;box-sizing:border-box;border:1px solid #244955;background:#061a22;color:#eafaff;border-radius:8px;padding:10px}
        .wnx-result{margin-top:13px;padding:12px;border-radius:9px;background:#0d3a46;color:#dffaff;font-weight:800}
        .wnx-map-fullscreen{position:fixed;inset:0;z-index:99999;background:#02080c;display:flex;align-items:center;justify-content:center}
        .wnx-map-fullscreen img{max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain}
        .wnx-map-fullscreen button{position:fixed;right:18px;top:18px;z-index:2}
        @media(max-width:900px){.wnx-overview{grid-template-columns:repeat(2,minmax(0,1fr))}.wnx-map-grid,.wnx-calc{grid-template-columns:1fr}}
        @media(max-width:600px){.wnx-head{padding:20px}.wnx-head h2{font-size:24px}.wnx-body{padding:12px}.wnx-overview,.wnx-list,.wnx-map-buttons{grid-template-columns:1fr}.wnx-map-view,.wnx-map-view img{min-height:280px}}
      `}</style>

      <div className="wnx-head">
        <div className="wnx-kicker">WHITEOUT SURVIVAL HUB</div>
        <h2>Whiteout Survival Hub</h2>
        <p>
          Explore facilities, fortresses, strongholds, resources, alliance
          territory, events, buildings, research, troops, calculators,
          heroes, battle maps and alliance planning tools.
        </p>
      </div>

      <div className="wnx-body">
        {active !== 'overview' && (
          <button className="wnx-back" onClick={() => setActive('overview')}>
            &#x2190; Back to Hub
          </button>
        )}

        {active === 'overview' && (
          <div className="wnx-overview">
            {NAV_ITEMS.map(([id, icon, title]) => {
              const module = MODULES[id]

              if (id === 'heroes' || id === 'battle-maps') {
                return (
                  <Link
                    className="wnx-overview-card"
                    key={id}
                    to={`/game/whiteout-survival/${ROUTES[id]}`}
                  >
                    <div
                      className="icon"
                      dangerouslySetInnerHTML={{ __html: icon }}
                    />
                    <h3>{title}</h3>
                    <p>
                      {id === 'heroes'
                        ? 'Browse Whiteout Survival heroes, generations, classes, roles and hero information.'
                        : 'Explore Foundry and Canyon Clash battle maps with strategic locations and objectives.'}
                    </p>
                  </Link>
                )
              }

              if (id === 'calculators') {
                return (
                  <button
                    className="wnx-overview-card"
                    key={id}
                    onClick={() => setActive('calculators')}
                  >
                    <div
                      className="icon"
                      dangerouslySetInnerHTML={{ __html: icon }}
                    />
                    <h3>{title}</h3>
                    <p>
                      Resource totals, speedups and troop power estimation
                      tools.
                    </p>
                  </button>
                )
              }

              const route =
                ROUTES[id] ||
                id

              return (
                <Link
                  className="wnx-overview-card"
                  key={id}
                  to={`/game/whiteout-survival/${route}`}
                >
                  <div
                    className="icon"
                    dangerouslySetInnerHTML={{ __html: icon }}
                  />
                  <h3>{title}</h3>
                  <p>
                    {module?.intro ||
                      'Tools and information for Whiteout Survival.'}
                  </p>
                </Link>
              )
            })}
          </div>
        )}

        {active !== 'overview' &&
          active !== 'maps' &&
          active !== 'calculators' &&
          MODULES[active] && (
            <div className="wnx-detail">
              <div className="wnx-detail-header">
                <div
                  className="wnx-detail-icon"
                  dangerouslySetInnerHTML={{
                    __html: MODULES[active].icon,
                  }}
                />

                <div>
                  <div className="wnx-kicker">WHITEOUT SURVIVAL</div>
                  <h3>{MODULES[active].title}</h3>
                  <p className="wnx-detail-intro">
                    {MODULES[active].intro}
                  </p>
                </div>
              </div>

              <div className="wnx-list">
                {MODULES[active].sections.map(
                  ([title, description]) => (
                    <div className="wnx-list-card" key={title}>
                      <strong>{title}</strong>
                      <span>{description}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {active === 'calculators' && (
          <div className="wnx-calc">
            <div className="wnx-calc-card">
              <h3>&#x1F4E6; Resource Calculator</h3>

              {['wood', 'coal', 'iron', 'meat'].map((key) => (
                <label className="wnx-field" key={key}>
                  <span>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={calc[key]}
                    onChange={(event) =>
                      updateCalc(key, event.target.value)
                    }
                  />
                </label>
              ))}

              <div className="wnx-result">
                {resourceTotal.toLocaleString()} total RSS
              </div>
            </div>

            <div className="wnx-calc-card">
              <h3>&#x23F1;&#xFE0F; Speedup Calculator</h3>

              <label className="wnx-field">
                <span>Total Hours</span>

                <input
                  type="number"
                  min="0"
                  value={calc.hours}
                  onChange={(event) =>
                    updateCalc('hours', event.target.value)
                  }
                />
              </label>

              <div className="wnx-result">
                {Math.floor(hours / 24)}d {hours % 24}h
              </div>

              <h3 style={{ marginTop: 22 }}>
                &#x1F3D6;&#xFE0F; Troop Power Estimate
              </h3>

              <label className="wnx-field">
                <span>Troops</span>

                <input
                  type="number"
                  min="0"
                  value={calc.troops}
                  onChange={(event) =>
                    updateCalc('troops', event.target.value)
                  }
                />
              </label>

              <div className="wnx-result">
                {(Number(calc.troops || 0) * 10).toLocaleString()} estimated
                power
              </div>
            </div>
          </div>
        )}
      </div>

      {fullscreen && (
        <div className="wnx-map-fullscreen">
          <img src={map.image} alt={map.title} />

          <button
            className="wnx-map-fs"
            onClick={() => setFullscreen(false)}
          >
            &#x2715; Exit Fullscreen
          </button>
        </div>
      )}
    </section>
  )
}

export default WhiteoutHub