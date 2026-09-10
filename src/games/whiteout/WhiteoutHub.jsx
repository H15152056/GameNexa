import { useState } from 'react'

// ============================================================
// WHITEOUT SURVIVAL — hub widget (maps, facilities, fortresses,
// strongholds, resources, alliance territory, events, buildings,
// research, troops, calculators, alliance planner)
// ============================================================
// Game-specific UI for Whiteout Survival lives in this
// src/games/whiteout/ folder. To remove this game from the
// site: delete this folder, its import in GamePage.jsx, and the
// `isWhiteout && <WhiteoutHub />` line. To add another game,
// copy this folder's pattern into src/games/<newGame>/.

const WHITEOUT_MAPS = [
  {
    id: 'foundry',
    title: 'Foundry Battle Map',
    subtitle: 'Imperial Foundry • Boiler Room • Central Transit • Mercenary Camp • Munitions Warehouse',
    image: '/maps/foundry-battle-4k.jpg',
    icon: '⚔️',
  },
  {
    id: 'canyon',
    title: 'Canyon Clash Battle Map',
    subtitle: 'Alliance battlefield • lanes • objectives • combat planning',
    image: '/maps/canyon-clash-4k.jpg',
    icon: '🏔️',
  },
]

const WHITEOUT_MODULES = [
  ['facilities', '🏭', 'Facilities', 'Important event and state facilities, their purpose and battle value.'],
  ['fortresses', '🏰', 'Fortresses', 'Fortress planning, objectives, territory control and alliance strategy.'],
  ['strongholds', '🛡️', 'Strongholds', 'Stronghold information, control priorities and event preparation.'],
  ['resources', '🌲', 'Resources', 'Wood, Coal, Iron and Meat planning with efficient gathering guidance.'],
  ['territory', '👥', 'Alliance Territory', 'HQ, banners, connected territory and alliance expansion planning.'],
  ['events', '⚔️', 'Events', 'Bear Trap, Crazy Joe, Foundry, Canyon Clash and other major events.'],
  ['buildings', '🏗️', 'Buildings', 'Furnace, Embassy, Command Center, Infirmary and progression priorities.'],
  ['research', '🔬', 'Research', 'Economy, Battle and March research priorities and progression notes.'],
  ['troops', '🪖', 'Troops', 'Infantry, Lancer and Marksman roles, formations and training priorities.'],
  ['calculators', '🧮', 'Calculators', 'Resource totals, speedup conversion and basic troop power planning.'],
  ['planner', '🧭', 'Alliance Planner', 'Plan objectives, rally points, territory moves and event assignments.'],
]

// "Battle Maps" is pinned first so it's the natural next stop
// after Overview — the Whiteout Survival Heroes database section
// now renders above this whole hub, so heroes already come before it.
const WHITEOUT_SECTIONS = [
  ['maps', '🗺️', 'Battle Maps', 'Foundry Battle and Canyon Clash map viewer for alliance planning.'],
  ...WHITEOUT_MODULES,
]

function WhiteoutHub() {
  const [active, setActive] = useState('overview')
  const [activeMap, setActiveMap] = useState('foundry')
  const [fullscreen, setFullscreen] = useState(false)
  const [calc, setCalc] = useState({ wood: 0, coal: 0, iron: 0, meat: 0, hours: 24, troops: 10000 })

  const map = WHITEOUT_MAPS.find((item) => item.id === activeMap) || WHITEOUT_MAPS[0]

  const modules = {
    facilities: {
      title: 'Facilities',
      text: 'Use this section for facility locations, requirements, ownership, status and event strategy.',
      items: ['Imperial Foundry', 'Prototype Sites', 'Repair Facility', 'Munitions Warehouse', 'Mercenary Camp', 'Central Transit Station', 'Boiler Room'],
    },
    fortresses: {
      title: 'Fortresses',
      text: 'Track fortress objectives, alliance control, rally requirements and defensive priorities.',
      items: ['Fortress ownership', 'Rally planning', 'Garrison planning', 'Alliance coordination', 'Reward tracking'],
    },
    strongholds: {
      title: 'Strongholds',
      text: 'Organize stronghold priorities and alliance control information in one place.',
      items: ['Stronghold status', 'Control planning', 'Rally points', 'Defense assignments', 'Reward notes'],
    },
    resources: {
      title: 'Resources',
      text: 'Plan the four core resources and keep gathering priorities clear.',
      items: ['🌲 Wood', '🪨 Coal', '⛓️ Iron', '🍖 Meat', 'Gathering speed', 'Resource protection'],
    },
    territory: {
      title: 'Alliance Territory',
      text: 'Keep alliance expansion organized around HQ placement, banners and connected territory.',
      items: ['Alliance HQ', 'Banners', 'Connected territory', 'Territory expansion', 'Strategic positions'],
    },
    events: {
      title: 'Events',
      text: 'Central event hub for recurring alliance and state activities.',
      items: ['🐻 Bear Trap', '👹 Crazy Joe', '⚔️ Foundry Battle', '🏔️ Canyon Clash', '🔥 Sunfire information', '🌍 State Transfer'],
    },
    buildings: {
      title: 'Buildings',
      text: 'Core settlement progression reference.',
      items: ['Furnace', 'Embassy', 'Command Center', 'Infirmary', 'War Academy'],
    },
    research: {
      title: 'Research',
      text: 'Research planning by economy, battle and march priorities.',
      items: ['Construction Speed', 'Gathering Speed', 'Troop Attack', 'Troop Defense', 'Troop March Speed'],
    },
    troops: {
      title: 'Troops',
      text: 'Understand the three troop classes and how they fit into formations.',
      items: ['Infantry — frontline / tank', 'Lancer — mobile damage', 'Marksman — ranged DPS'],
    },
    planner: {
      title: 'Alliance Planner',
      text: 'Planning workspace for alliance officers and event coordination.',
      items: ['Objective assignments', 'Rally assignments', 'Defense assignments', 'Territory moves', 'Event roles'],
    },
  }

  const resourceTotal = Object.values(calc).slice(0, 4).reduce((sum, value) => sum + Number(value || 0), 0)
  const hours = Number(calc.hours || 0)
  const activeSection = WHITEOUT_SECTIONS.find(([id]) => id === active)

  return (
    <section className="wnx-tools">
      <style>{`
        .wnx-tools{margin:28px 0 0;border:1px solid rgba(93,180,202,.2);border-radius:22px;background:linear-gradient(145deg,rgba(8,31,40,.98),rgba(4,20,27,.98));overflow:hidden}
        .wnx-head{padding:26px 28px 20px;border-bottom:1px solid rgba(93,180,202,.14)}
        .wnx-kicker{font-size:11px;letter-spacing:1.4px;font-weight:800;color:#67bfd4;text-transform:uppercase}
        .wnx-head h2{margin:7px 0 6px;font-size:30px;color:#effcff}
        .wnx-head p{margin:0;color:#8eacb5;max-width:800px;line-height:1.6}
        .wnx-crumb{padding:14px 22px 0}
        .wnx-back{border:1px solid rgba(93,180,202,.22);background:#09232d;color:#a8d3dd;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700}
        .wnx-back:hover{background:#103e4c;color:#effcff;border-color:#29afd0}
        .wnx-body{padding:22px}
        .wnx-map-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:18px}
        .wnx-map-card{border:1px solid rgba(93,180,202,.2);background:#061820;border-radius:16px;overflow:hidden}
        .wnx-map-buttons{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px}
        .wnx-map-button{border:1px solid #244955;background:#092630;color:#a8c4cc;border-radius:11px;padding:13px;text-align:left}
        .wnx-map-button.active{border-color:#29afd0;background:#103d4a;color:#effcff}
        .wnx-map-button strong,.wnx-map-button span{display:block}
        .wnx-map-button span{font-size:11px;color:#789aa5;margin-top:4px;line-height:1.4}
        .wnx-map-view{position:relative;background:#02080c;min-height:420px;display:flex;align-items:center;justify-content:center}
        .wnx-map-view img{width:100%;height:100%;min-height:420px;object-fit:contain;display:block}
        .wnx-map-fs{position:absolute;right:12px;top:12px;border:1px solid #38616d;background:#0a2b35;color:#d8f8fd;border-radius:9px;padding:8px 11px;font-size:11px;font-weight:700}
        .wnx-map-fullscreen{position:fixed;inset:0;z-index:99999;background:#02080c;display:flex;align-items:center;justify-content:center}
        .wnx-map-fullscreen img{max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain}
        .wnx-map-fullscreen button{position:fixed;right:18px;top:18px;z-index:2}
        .wnx-map-info{padding:18px}
        .wnx-map-info h3{margin:0 0 6px;color:#effcff}
        .wnx-map-info p{margin:0;color:#7f9da7;font-size:12px;line-height:1.6}
        .wnx-module-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        .wnx-module{border:1px solid rgba(93,180,202,.16);background:#08232d;border-radius:14px;padding:17px;text-align:left;color:#b9d2d9}
        .wnx-module:hover{border-color:#2c8296;transform:translateY(-1px)}
        .wnx-module-icon{font-size:26px;margin-bottom:9px}.wnx-module h3{margin:0 0 6px;color:#effcff;font-size:15px}.wnx-module p{margin:0;color:#7899a4;font-size:11px;line-height:1.5}
        .wnx-detail{border:1px solid rgba(93,180,202,.17);background:#08232d;border-radius:16px;padding:20px}
        .wnx-detail h3{margin:0 0 6px;font-size:22px;color:#effcff}.wnx-detail>p{color:#87a6b0;line-height:1.6;font-size:13px}
        .wnx-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:16px}.wnx-list div{padding:11px 12px;background:#061a22;border:1px solid #183b45;border-radius:9px;color:#a9c5cc;font-size:12px}
        .wnx-calc{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.wnx-calc-card{border:1px solid rgba(93,180,202,.17);background:#08232d;border-radius:14px;padding:18px}.wnx-calc-card h3{margin:0 0 12px;color:#effcff}.wnx-field{display:block;margin:9px 0}.wnx-field span{display:block;color:#7899a4;font-size:11px;margin-bottom:5px}.wnx-field input{width:100%;border:1px solid #244955;background:#061a22;color:#eafaff;border-radius:8px;padding:9px}.wnx-result{margin-top:12px;padding:12px;border-radius:9px;background:#0d3a46;color:#dffaff;font-weight:800}
        @media(max-width:900px){.wnx-map-grid,.wnx-calc{grid-template-columns:1fr}.wnx-module-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:600px){.wnx-head{padding:20px}.wnx-head h2{font-size:24px}.wnx-body{padding:12px}.wnx-map-buttons,.wnx-module-grid,.wnx-list{grid-template-columns:1fr}.wnx-map-view,.wnx-map-view img{min-height:280px}}
      `}</style>

      <div className="wnx-head">
        <div className="wnx-kicker">WHITEOUT SURVIVAL HUB</div>
        <h2>Whiteout Survival Hub</h2>
        <p>Battle maps, facilities, fortresses, strongholds, resources, alliance territory, events, buildings, research, troops, calculators and alliance planning — all in one place.</p>
      </div>

      {active !== 'overview' && (
        <div className="wnx-crumb">
          <button className="wnx-back" onClick={() => setActive('overview')}>
            ← Back to Overview{activeSection ? ` · ${activeSection[1]} ${activeSection[2]}` : ''}
          </button>
        </div>
      )}

      <div className="wnx-body">
        {active === 'overview' && (
          <div className="wnx-module-grid">
            {WHITEOUT_SECTIONS.map(([id, icon, title, description]) => (
              <button className="wnx-module" key={id} onClick={() => setActive(id)}>
                <div className="wnx-module-icon">{icon}</div><h3>{title}</h3><p>{description}</p>
              </button>
            ))}
          </div>
        )}

        {active === 'maps' && (
          <div className="wnx-map-grid">
            <div className="wnx-map-card">
              <div className="wnx-map-buttons">
                {WHITEOUT_MAPS.map((item) => (
                  <button key={item.id} className={`wnx-map-button ${activeMap === item.id ? 'active' : ''}`} onClick={() => setActiveMap(item.id)}>
                    <strong>{item.icon} {item.title}</strong><span>{item.subtitle}</span>
                  </button>
                ))}
              </div>
              <div className="wnx-map-view">
                <img src={map.image} alt={map.title} />
                <button className="wnx-map-fs" onClick={() => setFullscreen(true)}>⛶ Fullscreen</button>
              </div>
              <div className="wnx-map-info"><h3>{map.title}</h3><p>{map.subtitle}</p></div>
            </div>
            <div className="wnx-detail">
              <div className="wnx-kicker">BATTLE MAPS</div>
              <h3>{map.title}</h3>
              <p>Full map image viewer for Whiteout Survival battle planning. GameNexa currently provides only the Foundry Battle Map and Canyon Clash Battle Map here.</p>
              <div className="wnx-list">
                <div>⚔️ Alliance planning</div><div>📍 Objective reference</div><div>🛡️ Defense planning</div><div>🚩 Rally coordination</div>
              </div>
            </div>
          </div>
        )}

        {active !== 'overview' && active !== 'maps' && active !== 'calculators' && modules[active] && (
          <div className="wnx-detail">
            <div className="wnx-kicker">WHITEOUT SURVIVAL</div>
            <h3>{modules[active].title}</h3>
            <p>{modules[active].text}</p>
            <div className="wnx-list">{modules[active].items.map((item) => <div key={item}>{item}</div>)}</div>
          </div>
        )}

        {active === 'calculators' && (
          <div className="wnx-calc">
            <div className="wnx-calc-card">
              <h3>📦 Resource Total</h3>
              {['wood','coal','iron','meat'].map((key) => <label className="wnx-field" key={key}><span>{key[0].toUpperCase()+key.slice(1)}</span><input type="number" value={calc[key]} onChange={(e) => setCalc({...calc,[key]:e.target.value})}/></label>)}
              <div className="wnx-result">{Number(resourceTotal).toLocaleString()} total RSS</div>
            </div>
            <div className="wnx-calc-card">
              <h3>⏱️ Speedup</h3>
              <label className="wnx-field"><span>Total Hours</span><input type="number" value={calc.hours} onChange={(e) => setCalc({...calc,hours:e.target.value})}/></label>
              <div className="wnx-result">{Math.floor(hours/24)}d {hours%24}h</div>
              <h3 style={{marginTop:20}}>🪖 Troop Power</h3>
              <label className="wnx-field"><span>Troops</span><input type="number" value={calc.troops} onChange={(e) => setCalc({...calc,troops:e.target.value})}/></label>
              <div className="wnx-result">{(Number(calc.troops||0)*10).toLocaleString()} estimated power</div>
            </div>
          </div>
        )}
      </div>

      {fullscreen && (
        <div className="wnx-map-fullscreen">
          <img src={map.image} alt={map.title} />
          <button className="wnx-map-fs" onClick={() => setFullscreen(false)}>✕ Exit Fullscreen</button>
        </div>
      )}
    </section>
  )
}

export default WhiteoutHub
