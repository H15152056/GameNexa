import React, { useMemo, useState } from "react";

/*
  WHITEOUTHQ — SINGLE FILE EDITION
  --------------------------------
  Everything is intentionally kept in this one App.jsx:
  - Navigation
  - Generic map + State maps
  - Facilities / Fortresses / Strongholds / Sunfire Castle
  - Resources / Beasts / Events
  - Alliance planner + routes
  - Coordinate picker
  - Filters
  - State selector
  - Heroes / Buildings / Research / Troops / Guides
  - Calculators
  - Admin-style editor
  - All CSS
*/

const TYPES = {
  construction: { label: "Construction Facility", color: "#1687d9" },
  gathering: { label: "Gathering Facility", color: "#c43ee8" },
  production: { label: "Production Facility", color: "#2fd12f" },
  tech: { label: "Tech Facility", color: "#f28a18" },
  weapons: { label: "Weapons Facility", color: "#e52b20" },
  training: { label: "Training Facility", color: "#f0d600" },
  defense: { label: "Defense Facility", color: "#16b99d" },
  expedition: { label: "Expedition Facility", color: "#ec2da7" },
};

const initialFacilities = [
  { id: 1, type: "construction", level: 1, x: 310, y: 230 },
  { id: 2, type: "gathering", level: 1, x: 470, y: 175 },
  { id: 3, type: "production", level: 2, x: 260, y: 390 },
  { id: 4, type: "tech", level: 2, x: 515, y: 280 },
  { id: 5, type: "weapons", level: 3, x: 685, y: 420 },
  { id: 6, type: "training", level: 2, x: 790, y: 330 },
  { id: 7, type: "defense", level: 1, x: 875, y: 515 },
  { id: 8, type: "expedition", level: 3, x: 400, y: 590 },
  { id: 9, type: "gathering", level: 4, x: 940, y: 220 },
  { id: 10, type: "production", level: 2, x: 180, y: 545 },
];

const initialFortresses = [
  { id: 1, x: 365, y: 330, owner: "Unoccupied" },
  { id: 2, x: 610, y: 315, owner: "TRK" },
  { id: 3, x: 760, y: 540, owner: "Unoccupied" },
  { id: 4, x: 535, y: 470, owner: "NAP" },
  { id: 5, x: 885, y: 430, owner: "Unoccupied" },
  { id: 6, x: 1020, y: 340, owner: "Unoccupied" },
  { id: 7, x: 210, y: 305, owner: "Unoccupied" },
  { id: 8, x: 430, y: 410, owner: "Unoccupied" },
  { id: 9, x: 700, y: 235, owner: "Unoccupied" },
  { id: 10, x: 570, y: 155, owner: "Unoccupied" },
  { id: 11, x: 300, y: 205, owner: "Unoccupied" },
  { id: 12, x: 145, y: 410, owner: "Unoccupied" },
];

const initialStrongholds = [
  { id: 1, x: 455, y: 430, owner: "Unoccupied" },
  { id: 2, x: 595, y: 560, owner: "TRK" },
  { id: 3, x: 760, y: 630, owner: "Unoccupied" },
  { id: 4, x: 850, y: 580, owner: "Unoccupied" },
];

const initialResources = [
  { id: 1, type: "Meat", level: 3, x: 110, y: 160 },
  { id: 2, type: "Wood", level: 4, x: 240, y: 650 },
  { id: 3, type: "Coal", level: 5, x: 940, y: 670 },
  { id: 4, type: "Iron", level: 6, x: 1080, y: 500 },
  { id: 5, type: "Meat", level: 7, x: 1020, y: 130 },
  { id: 6, type: "Wood", level: 5, x: 120, y: 520 },
];

const initialEvents = [
  { id: 1, name: "Bear Trap", x: 330, y: 520, color: "#ef4444" },
  { id: 2, name: "Crazy Joe", x: 810, y: 185, color: "#a855f7" },
  { id: 3, name: "Foundry Battle", x: 705, y: 610, color: "#f59e0b" },
];

const initialHeroes = [
  ["Natalia", "Infantry", "Tank / Defense"],
  ["Molly", "Infantry", "Gathering / Expedition"],
  ["Jeronimo", "Infantry", "Rally / Attack"],
  ["Logan", "Infantry", "Defense"],
  ["Alonso", "Marksman", "Rally / Attack"],
  ["Bahiti", "Marksman", "Free-to-play DPS"],
  ["Gina", "Marksman", "March Speed"],
  ["Jessie", "Lancer", "Rally Support"],
];

const initialBuildings = [
  ["Furnace", "Main progression building", "1–30"],
  ["Embassy", "Alliance reinforcement capacity", "1–30"],
  ["Command Center", "Troop capacity / march systems", "1–30"],
  ["Infirmary", "Wounded troop capacity", "1–30"],
  ["War Academy", "Advanced research", "1–30"],
];

const initialResearch = [
  ["Economy", "Construction Speed", "+5% / level"],
  ["Economy", "Gathering Speed", "+5% / level"],
  ["Battle", "Troop Attack", "+5% / level"],
  ["Battle", "Troop Defense", "+5% / level"],
  ["March", "Troop March Speed", "+5% / level"],
];

const initialTroops = [
  ["Infantry", "Shield / frontline", "Tank"],
  ["Lancer", "Fast melee", "Balanced"],
  ["Marksman", "Ranged damage", "DPS"],
];

const initialGuides = [
  ["Furnace Upgrade Guide", "How to plan resources and speedups efficiently."],
  ["Bear Trap Guide", "Alliance setup, rally timing and participation basics."],
  ["Alliance Territory Guide", "Plan HQ, banners and connected territory."],
  ["State Map Guide", "How to use coordinates, layers and planner tools."],
];

const buffTable = {
  construction: ["Construction Speed", "Gathering Speed", "RSS Production Speed", "Research Speed"],
  gathering: ["Gathering Speed"],
  production: ["RSS Production Speed"],
  tech: ["Research Speed"],
  weapons: ["Troop Attack"],
  training: ["Training Speed"],
  defense: ["Troop Defense"],
  expedition: ["Troop March Speed"],
};

function seedForState(state) {
  const n = Number(state) || 4496;
  const shift = (n % 9) * 12;
  return {
    facilities: initialFacilities.map((f, i) => ({ ...f, x: ((f.x + shift + i * 7) % 1120) + 40 })),
    fortresses: initialFortresses.map((f, i) => ({ ...f, x: ((f.x + shift + i * 5) % 1120) + 40 })),
    strongholds: initialStrongholds.map((f, i) => ({ ...f, x: ((f.x + shift + i * 4) % 1120) + 40 })),
    resources: initialResources.map((f, i) => ({ ...f, x: ((f.x + shift + i * 3) % 1120) + 40 })),
    events: initialEvents.map((f, i) => ({ ...f, x: ((f.x + shift + i * 6) % 1120) + 40 })),
  };
}

function Icon({ children }) {
  return <span className="icon">{children}</span>;
}

function App() {
  const [page, setPage] = useState("map");
  const [mapMode, setMapMode] = useState("explore");
  const [selectedState, setSelectedState] = useState("4496");
  const [mapType, setMapType] = useState("state");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState({ kind: "sunfire", x: 600, y: 360 });
  const [search, setSearch] = useState("");
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [territory, setTerritory] = useState(true);
  const [adminSection, setAdminSection] = useState("states");
  const [message, setMessage] = useState("");
  const [heroSearch, setHeroSearch] = useState("");
  const [guideSearch, setGuideSearch] = useState("");

  const stateData = useMemo(() => seedForState(selectedState), [selectedState]);
  const facilities = stateData.facilities;
  const fortresses = stateData.fortresses;
  const strongholds = stateData.strongholds;
  const resources = stateData.resources;
  const events = stateData.events;

  const nav = [
    ["map", "🗺️", "Map"],
    ["heroes", "🦸", "Heroes"],
    ["buildings", "🏗️", "Buildings"],
    ["research", "🔬", "Research"],
    ["troops", "🪖", "Troops"],
    ["events", "⚔️", "Events"],
    ["guides", "📚", "Guides"],
    ["calculators", "🧮", "Calculators"],
    ["admin", "⚙️", "Admin"],
  ];

  const allObjects = [
    ...facilities.map(x => ({ ...x, kind: "facility" })),
    ...fortresses.map(x => ({ ...x, kind: "fortress" })),
    ...strongholds.map(x => ({ ...x, kind: "stronghold" })),
    ...resources.map(x => ({ ...x, kind: "resource" })),
    ...events.map(x => ({ ...x, kind: "event" })),
    { kind: "sunfire", x: 600, y: 360, id: 0 },
  ];

  const filteredObjects = allObjects.filter(o => {
    if (filter === "all") return true;
    if (filter === "facilities") return o.kind === "facility";
    if (filter === "fortresses") return o.kind === "fortress";
    if (filter === "strongholds") return o.kind === "stronghold";
    if (filter === "resources") return o.kind === "resource";
    if (filter === "events") return o.kind === "event";
    if (filter === "sunfire") return o.kind === "sunfire";
    if (filter === "alliance") return false;
    return true;
  });

  const pickMapPoint = (e) => {
    if (mapMode !== "planner") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1199, Math.round(((e.clientX - rect.left) / rect.width) * 1199)));
    const y = Math.max(0, Math.min(1199, Math.round(((e.clientY - rect.top) / rect.height) * 1199)));
    const newMarker = { id: Date.now(), x, y, label: "Custom Marker" };
    setMarkers(prev => [...prev, newMarker]);
    setSelected({ kind: "custom", ...newMarker });
  };

  const addRoutePoint = () => {
    if (!selected?.x && selected?.x !== 0) return;
    const p = { id: Date.now(), x: selected.x, y: selected.y };
    setRoutes(prev => [...prev, p]);
    setMessage("Planner point added.");
    setTimeout(() => setMessage(""), 1800);
  };

  const addMarkerAtCenter = () => {
    const m = { id: Date.now(), x: 600, y: 600, label: "Alliance Marker" };
    setMarkers(prev => [...prev, m]);
    setSelected({ kind: "custom", ...m });
  };

  return (
    <div className="app">
      <style>{CSS}</style>

      <header className="topbar">
        <div className="brand" onClick={() => setPage("map")}>
          <div className="logo">❄</div>
          <div>
            <div className="brandName">WhiteoutHQ</div>
            <div className="brandSub">Whiteout Survival Strategy Hub</div>
          </div>
        </div>

        <nav className="nav">
          {nav.map(([id, icon, label]) => (
            <button key={id} className={page === id ? "navBtn active" : "navBtn"} onClick={() => setPage(id)}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
      </header>

      {message && <div className="toast">{message}</div>}

      {page === "map" && (
        <div className="mapLayout">
          <aside className="sidebar">
            <div className="sideCard">
              <label>MAP</label>
              <div className="segmented">
                <button className={mapType === "generic" ? "selected" : ""} onClick={() => setMapType("generic")}>Generic</button>
                <button className={mapType === "state" ? "selected" : ""} onClick={() => setMapType("state")}>State</button>
              </div>

              {mapType === "state" && (
                <select value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                  <option value="4496">State 4496</option>
                  <option value="4142">State 4142</option>
                  <option value="5000">State 5000</option>
                  <option value="5001">State 5001</option>
                  <option value="custom">Custom State</option>
                </select>
              )}

              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔎 Search map..." />
            </div>

            <div className="sideCard">
              <label>MODE</label>
              <div className="modeButtons">
                <button className={mapMode === "explore" ? "mode active" : "mode"} onClick={() => setMapMode("explore")}>🌍 Explore</button>
                <button className={mapMode === "planner" ? "mode active" : "mode"} onClick={() => setMapMode("planner")}>🛠️ Alliance Planner</button>
              </div>
            </div>

            <div className="sideCard">
              <label>LAYERS</label>
              {[
                ["all", "🌐", "All"],
                ["facilities", "🏛️", "Facilities"],
                ["fortresses", "🏯", "Fortresses"],
                ["strongholds", "🏰", "Strongholds"],
                ["resources", "🌲", "Resources"],
                ["events", "⚔️", "Events"],
                ["sunfire", "🔥", "Sunfire Castle"],
              ].map(([id, icon, text]) => (
                <button key={id} className={filter === id ? "filter active" : "filter"} onClick={() => setFilter(id)}>
                  <span>{icon}</span>{text}
                </button>
              ))}
              <label className="checkRow">
                <input type="checkbox" checked={territory} onChange={e => setTerritory(e.target.checked)} />
                Show alliance territory
              </label>
            </div>

            <div className="sideCard">
              <label>PLANNER</label>
              <button className="primary" onClick={addMarkerAtCenter}>+ Add Marker</button>
              <button className="secondary" onClick={addRoutePoint}>↗ Add Route Point</button>
              <button className="secondary" onClick={() => { setMarkers([]); setRoutes([]); }}>Clear Planner</button>
            </div>

            <div className="legend">
              <b>FACILITY KEY</b>
              {Object.entries(TYPES).map(([key, v]) => (
                <div className="legendRow" key={key}><span className="dot" style={{background:v.color}} />{v.label}</div>
              ))}
            </div>
          </aside>

          <main className="mapMain">
            <div className="mapToolbar">
              <div>
                <b>{mapType === "generic" ? "Generic Whiteout Survival Map" : `State ${selectedState} Map`}</b>
                <span className="muted"> • Coordinates 0–1199 × 0–1199</span>
              </div>
              <div className="toolbarActions">
                <button onClick={() => setMapMode("explore")}>🌍 Explore</button>
                <button onClick={() => setMapMode("planner")}>🛠️ Planner</button>
              </div>
            </div>

            <div className={"world " + (mapMode === "planner" ? "plannerMode" : "")} onClick={pickMapPoint}>
              <div className="mapTerrain">
                <div className="mountain m1" />
                <div className="mountain m2" />
                <div className="mountain m3" />
                <div className="lake l1" />
                <div className="lake l2" />
                <div className="snowPath p1" />
                <div className="snowPath p2" />
                {territory && (
                  <>
                    <div className="territory t1" />
                    <div className="territory t2" />
                    <div className="territory t3" />
                    <div className="territory t4" />
                  </>
                )}
                <div className="grid" />
              </div>

              <div className="coordinateTop">Y:1199 <span>•</span> X:1199</div>
              <div className="coordinateLeft">Y:1199<br/><span>X:0</span></div>
              <div className="coordinateRight">X:1199<br/><span>Y:0</span></div>
              <div className="coordinateBottom">X:0 • Y:0</div>

              <div className="sunfire" onClick={e => { e.stopPropagation(); setSelected({kind:"sunfire",x:600,y:360}); }}>
                <div className="sunIcon">🔥</div>
                <b>Sunfire</b>
                <span>Castle</span>
              </div>

              {filteredObjects.filter(o => {
                if (!search.trim()) return true;
                const q = search.toLowerCase();
                return `${o.kind} ${o.id || ""} ${o.owner || ""} ${o.type || ""}`.toLowerCase().includes(q);
              }).map(o => {
                const left = `${(o.x / 1199) * 100}%`;
                const top = `${(o.y / 1199) * 100}%`;
                if (o.kind === "facility") {
                  const type = TYPES[o.type];
                  return (
                    <button key={`f${o.id}`} className="mapMarker facility" style={{left,top,borderColor:type.color,background:type.color}} onClick={e => {e.stopPropagation();setSelected(o)}}>
                      {o.level}
                    </button>
                  );
                }
                if (o.kind === "fortress") return <button key={`fo${o.id}`} className="mapMarker fortress" style={{left,top}} onClick={e=>{e.stopPropagation();setSelected(o)}}>🏯<small>{o.id}</small></button>;
                if (o.kind === "stronghold") return <button key={`s${o.id}`} className="mapMarker stronghold" style={{left,top}} onClick={e=>{e.stopPropagation();setSelected(o)}}>🏰<small>{o.id}</small></button>;
                if (o.kind === "resource") return <button key={`r${o.id}`} className="mapMarker resource" style={{left,top}} onClick={e=>{e.stopPropagation();setSelected(o)}}>🌲<small>{o.level}</small></button>;
                if (o.kind === "event") return <button key={`e${o.id}`} className="mapMarker event" style={{left,top}} onClick={e=>{e.stopPropagation();setSelected(o)}}>⚔️</button>;
                return null;
              })}

              {markers.map(m => (
                <button key={m.id} className="mapMarker custom" style={{left:`${(m.x/1199)*100}%`,top:`${(m.y/1199)*100}%`}} onClick={e=>{e.stopPropagation();setSelected({kind:"custom",...m})}}>📍</button>
              ))}

              {routes.length > 0 && routes.map((r, i) => i > 0 && (
                <div key={r.id} className="routeSegment" style={{
                  left:`${(routes[i-1].x/1199)*100}%`,
                  top:`${(routes[i-1].y/1199)*100}%`,
                  width:`${Math.hypot(routes[i].x-routes[i-1].x,routes[i].y-routes[i-1].y)/1199*100}%`,
                  transform:`rotate(${Math.atan2(routes[i].y-routes[i-1].y,routes[i].x-routes[i-1].x)*180/Math.PI}deg)`
                }} />
              ))}

              <div className="hq">🏠<span>TRK HQ</span></div>
              <div className="banner b1">🚩</div><div className="banner b2">🚩</div><div className="banner b3">🚩</div>
            </div>

            <div className="zoom">
              <button>+</button><button>−</button>
            </div>
          </main>

          <aside className="details">
            <div className="detailsHeader">
              <span>SELECTED LOCATION</span>
              <button onClick={() => setSelected(null)}>×</button>
            </div>
            {!selected ? (
              <div className="empty">Click any object on the map.</div>
            ) : (
              <SelectedDetails selected={selected} addRoutePoint={addRoutePoint} />
            )}
          </aside>
        </div>
      )}

      {page !== "map" && <ContentPage page={page} heroSearch={heroSearch} setHeroSearch={setHeroSearch} guideSearch={guideSearch} setGuideSearch={setGuideSearch} adminSection={adminSection} setAdminSection={setAdminSection} selectedState={selectedState} setSelectedState={setSelectedState} />}
    </div>
  );
}

function SelectedDetails({ selected, addRoutePoint }) {
  const copy = async () => {
    await navigator.clipboard?.writeText(`X ${selected.x} Y ${selected.y}`);
    alert("Coordinates copied: X " + selected.x + " Y " + selected.y);
  };

  let title = "Custom Marker";
  let icon = "📍";
  let extra = "Planner marker";
  if (selected.kind === "sunfire") { title = "Sunfire Castle"; icon = "🔥"; extra = "Central State objective"; }
  if (selected.kind === "facility") { title = `${TYPES[selected.type].label} #${selected.id}`; icon = "🏛️"; extra = `Level ${selected.level}`; }
  if (selected.kind === "fortress") { title = `Fortress #${selected.id}`; icon = "🏯"; extra = `Owner: ${selected.owner}`; }
  if (selected.kind === "stronghold") { title = `Stronghold #${selected.id}`; icon = "🏰"; extra = `Owner: ${selected.owner}`; }
  if (selected.kind === "resource") { title = `${selected.type} Resource`; icon = "🌲"; extra = `Level ${selected.level}`; }
  if (selected.kind === "event") { title = selected.name; icon = "⚔️"; extra = "Event location"; }

  const buffs = selected.kind === "facility" ? buffTable[selected.type] : [];

  return (
    <div>
      <div className="selectedIcon">{icon}</div>
      <h2>{title}</h2>
      <p className="muted">{extra}</p>

      <div className="coordBox">
        <span>X</span><b>{selected.x}</b>
        <span>Y</span><b>{selected.y}</b>
      </div>

      {buffs.length > 0 && (
        <div className="buffBox">
          <h3>BUFFS — LV.{selected.level}</h3>
          {buffs.map((b, i) => <div key={b} className="buffRow"><span>{b}</span><b>+{5 + Math.max(0, selected.level - 1) * 3}%</b></div>)}
        </div>
      )}

      <div className="detailButtons">
        <button onClick={copy}>Copy Coordinates</button>
        <button onClick={() => navigator.share ? navigator.share({title:title,text:`${title} — X ${selected.x} Y ${selected.y}`}) : alert("Share link: /map?x="+selected.x+"&y="+selected.y)}>Share Location</button>
        <button onClick={addRoutePoint}>Add Route Point</button>
      </div>
    </div>
  );
}

function ContentPage({ page, heroSearch, setHeroSearch, guideSearch, setGuideSearch, adminSection, setAdminSection, selectedState, setSelectedState }) {
  if (page === "heroes") return <DataPage title="Heroes" subtitle="Whiteout Survival hero database" search={heroSearch} setSearch={setHeroSearch} headers={["Hero","Class","Role"]} rows={initialHeroes} />;
  if (page === "buildings") return <DataPage title="Buildings" subtitle="Building progression and requirements" headers={["Building","Purpose","Levels"]} rows={initialBuildings} />;
  if (page === "research") return <DataPage title="Research" subtitle="Research categories and effects" headers={["Category","Research","Effect"]} rows={initialResearch} />;
  if (page === "troops") return <DataPage title="Troops" subtitle="Troop types and roles" headers={["Type","Description","Role"]} rows={initialTroops} />;
  if (page === "events") return <EventsPage />;
  if (page === "guides") {
    const rows = initialGuides.filter(g => !guideSearch || g[0].toLowerCase().includes(guideSearch.toLowerCase()));
    return <DataPage title="Guides" subtitle="Whiteout Survival strategy guides" search={guideSearch} setSearch={setGuideSearch} headers={["Guide","Description"]} rows={rows} />;
  }
  if (page === "calculators") return <Calculators />;
  if (page === "admin") return <AdminPage adminSection={adminSection} setAdminSection={setAdminSection} selectedState={selectedState} setSelectedState={setSelectedState} />;
  return null;
}

function DataPage({ title, subtitle, search, setSearch, headers, rows }) {
  return (
    <section className="content">
      <div className="pageHero">
        <div><div className="eyebrow">WHITEOUTHQ DATABASE</div><h1>{title}</h1><p>{subtitle}</p></div>
        {setSearch && <input className="heroSearch" value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`} />}
      </div>
      <div className="tableCard">
        <table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{j===0 ? <b>{c}</b> : c}</td>)}</tr>)}</tbody></table>
      </div>
    </section>
  );
}

function EventsPage() {
  return <section className="content"><div className="pageHero"><div><div className="eyebrow">EVENT CENTER</div><h1>Events</h1><p>Track important alliance and state events.</p></div></div><div className="cards">
    {["Bear Trap","Crazy Joe","Foundry Battle","Sunfire Battle","State Transfer"].map((x,i)=><div className="infoCard" key={x}><div className="bigEmoji">{["🐻","👹","⚔️","🔥","🌍"][i]}</div><h2>{x}</h2><p>Event planning page with schedules, requirements, rewards and alliance notes.</p><button className="primary">Open Event</button></div>)}
  </div></section>;
}

function Calculators() {
  const [wood,setWood]=useState(100000), [coal,setCoal]=useState(100000), [iron,setIron]=useState(50000), [meat,setMeat]=useState(100000);
  const [hours,setHours]=useState(24), [troops,setTroops]=useState(10000);
  return <section className="content"><div className="pageHero"><div><div className="eyebrow">TOOLS</div><h1>Calculators</h1><p>Simple planning tools for resources, troops and speedups.</p></div></div>
    <div className="calcGrid">
      <div className="calcCard"><h2>📦 Resource Total</h2><Field label="Wood" value={wood} set={setWood}/><Field label="Coal" value={coal} set={setCoal}/><Field label="Iron" value={iron} set={setIron}/><Field label="Meat" value={meat} set={setMeat}/><div className="result">{(Number(wood)+Number(coal)+Number(iron)+Number(meat)).toLocaleString()} total RSS</div></div>
      <div className="calcCard"><h2>⏱️ Speedup</h2><Field label="Hours" value={hours} set={setHours}/><div className="result">{Math.floor(hours/24)}d {hours%24}h</div><p className="muted">Convert total hours into days and hours.</p></div>
      <div className="calcCard"><h2>🪖 Troop Power</h2><Field label="Troops" value={troops} set={setTroops}/><div className="result">{(Number(troops)*10).toLocaleString()} estimated power</div><p className="muted">Basic planning estimate; verify actual in-game values.</p></div>
    </div>
  </section>;
}

function Field({label,value,set}) {
  return <label className="field"><span>{label}</span><input type="number" value={value} onChange={e=>set(e.target.value)} /></label>;
}

function AdminPage({ adminSection, setAdminSection, selectedState, setSelectedState }) {
  const [name,setName]=useState("");
  const sections = ["states","facilities","fortresses","strongholds","resources","alliances","events","guides"];
  return <section className="content"><div className="pageHero"><div><div className="eyebrow">PRIVATE CMS</div><h1>Admin</h1><p>Single-file local editor foundation. Connect these records to D1 later.</p></div></div>
    <div className="adminGrid">
      <div className="adminNav">{sections.map(s=><button key={s} className={adminSection===s?"adminTab active":"adminTab"} onClick={()=>setAdminSection(s)}>{s}</button>)}</div>
      <div className="editor">
        <h2>{adminSection[0].toUpperCase()+adminSection.slice(1)} Editor</h2>
        <p className="muted">Current state: {selectedState}</p>
        {adminSection==="states" && <><label>State Number</label><input value={selectedState} onChange={e=>setSelectedState(e.target.value)} /><button className="primary" onClick={()=>alert("State saved locally.")}>Save State</button></>}
        {adminSection!=="states" && <><label>Name / Title</label><input value={name} onChange={e=>setName(e.target.value)} placeholder={`New ${adminSection.slice(0,-1)}...`} /><label>Notes</label><textarea placeholder="Details, coordinates, buffs, status..."/><button className="primary" onClick={()=>alert(`${name || "Item"} saved locally.`)}>Save Item</button></>}
      </div>
    </div>
  </section>;
}

const CSS = `
*{box-sizing:border-box}body{margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;background:#06151d;color:#eaf7fb}button,input,select,textarea{font:inherit}button{cursor:pointer}.app{min-height:100vh;background:#06151d}.topbar{height:82px;background:#0c2631;border-bottom:1px solid #21404c;display:flex;align-items:center;padding:0 24px;gap:28px;position:sticky;top:0;z-index:30}.brand{display:flex;align-items:center;gap:13px;min-width:290px;cursor:pointer}.logo{width:43px;height:43px;border-radius:50%;display:grid;place-items:center;background:#071923;color:#12c8e9;font-size:29px;border:1px solid #0e5365}.brandName{font-weight:800;font-size:21px}.brandSub{font-size:12px;color:#7fa6b5;margin-top:3px}.nav{display:flex;gap:5px;flex:1;justify-content:flex-end;overflow:auto}.navBtn{border:0;background:transparent;color:#8eabb6;padding:13px 12px;border-radius:10px;white-space:nowrap}.navBtn:hover,.navBtn.active{background:#103747;color:#e9fbff}.navBtn span{margin-right:6px}.mapLayout{height:calc(100vh - 82px);display:grid;grid-template-columns:300px minmax(500px,1fr) 330px}.sidebar,.details{background:#061c26;border-right:1px solid #1d3a45;overflow:auto}.details{border-right:0;border-left:1px solid #1d3a45;padding:20px}.sideCard{padding:16px;border-bottom:1px solid #16323e}.sideCard label,.eyebrow{display:block;color:#65b7cd;font-size:11px;font-weight:800;letter-spacing:1.2px;margin-bottom:10px}.sideCard input,.sideCard select,.editor input,.editor textarea,.heroSearch,.field input{width:100%;background:#092630;color:#e8f8fc;border:1px solid #25505e;border-radius:9px;padding:11px 12px;margin-bottom:9px;outline:none}.segmented{display:flex;background:#071821;border:1px solid #234653;border-radius:9px;padding:3px;margin-bottom:10px}.segmented button{flex:1;background:transparent;color:#91acb5;border:0;padding:8px;border-radius:7px}.segmented .selected{background:#0f5367;color:#fff}.modeButtons{display:grid;gap:7px}.mode,.filter,.secondary{width:100%;background:#082833;border:1px solid transparent;color:#8fb4c0;border-radius:9px;padding:11px;text-align:left}.mode.active,.filter.active{background:#a8eafa;color:#09212a}.filter{margin-bottom:6px;font-size:14px}.filter span{display:inline-block;width:28px}.primary{width:100%;background:#23a6c8;border:0;color:#04161d;border-radius:9px;padding:11px;font-weight:800;margin:4px 0}.secondary{margin:4px 0;text-align:center}.checkRow{display:flex!important;align-items:center;gap:8px;margin-top:12px!important;color:#91acb5!important;letter-spacing:0!important;font-weight:500!important}.checkRow input{width:auto!important;margin:0!important}.legend{padding:16px}.legend b{font-size:12px}.legendRow{font-size:11px;color:#9bb5bd;padding:5px 0}.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:7px}.mapMain{position:relative;background:#cbd9df;overflow:hidden}.mapToolbar{height:52px;background:#0a2029;color:#dff7fc;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid #1f414c;position:relative;z-index:10}.muted{color:#7796a1}.toolbarActions{display:flex;gap:6px}.toolbarActions button{background:#103847;color:#b8e4ed;border:0;border-radius:7px;padding:8px 10px}.world{position:absolute;inset:52px 0 0;overflow:hidden;background:#dbe8ec;user-select:none}.mapTerrain{position:absolute;inset:0;background:linear-gradient(135deg,#e5eef1,#c5d6db 48%,#e9f1f3);overflow:hidden}.grid{position:absolute;inset:0;opacity:.18;background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:60px 60px;transform:rotate(2deg) scale(1.08)}.mountain{position:absolute;width:280px;height:150px;background:#b5c6cd;opacity:.45;border-radius:55% 45% 60% 40%;transform:rotate(-18deg)}.m1{left:5%;top:12%}.m2{right:2%;top:35%;transform:rotate(21deg)}.m3{left:32%;bottom:4%;transform:rotate(8deg)}.lake{position:absolute;background:#94c6d0;opacity:.35;border-radius:50%}.l1{width:420px;height:140px;left:20%;top:40%;transform:rotate(-22deg)}.l2{width:300px;height:100px;right:7%;bottom:15%;transform:rotate(13deg)}.snowPath{position:absolute;border:24px solid rgba(255,255,255,.45);border-radius:50%;width:700px;height:280px}.p1{left:-12%;top:17%;transform:rotate(-15deg)}.p2{right:-16%;bottom:12%;transform:rotate(22deg)}.territory{position:absolute;border:2px dashed rgba(24,115,170,.6);background:rgba(22,135,217,.08);border-radius:30px}.t1{left:3%;top:25%;width:34%;height:34%}.t2{left:27%;top:18%;width:31%;height:31%}.t3{right:3%;top:26%;width:34%;height:30%}.t4{left:34%;bottom:2%;width:38%;height:30%}.coordinateTop,.coordinateBottom,.coordinateLeft,.coordinateRight{position:absolute;color:#314c56;font-size:11px;font-weight:700;z-index:3}.coordinateTop{top:5px;left:45%}.coordinateBottom{bottom:5px;left:45%}.coordinateLeft{left:6px;top:45%}.coordinateRight{right:6px;top:45%;text-align:right}.sunfire{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5;text-align:center;color:#172d35;text-shadow:0 1px 0 #fff;cursor:pointer}.sunIcon{font-size:42px;filter:drop-shadow(0 2px 2px #777)}.sunfire b,.sunfire span{display:block;font-size:13px}.mapMarker{position:absolute;transform:translate(-50%,-50%);z-index:8;border-radius:50%;width:31px;height:31px;color:#fff;font-weight:900;border:3px solid #fff;box-shadow:0 2px 6px #3338}.facility{font-size:12px}.fortress,.stronghold{background:#b7901b;border-color:#59450a;font-size:18px}.fortress small,.stronghold small,.resource small{font-size:9px;margin-left:-2px}.resource{background:#fff;border-color:#2d7535;font-size:17px}.event{background:#ef7b16}.custom{background:#e21c3b;border-color:#fff;font-size:18px}.hq{position:absolute;left:47%;top:62%;z-index:7;font-size:30px;text-align:center}.hq span{display:block;font-size:11px;color:#152f38;font-weight:800}.banner{position:absolute;z-index:7;font-size:25px}.b1{left:39%;top:61%}.b2{left:55%;top:59%}.b3{left:62%;top:66%}.routeSegment{height:4px;background:#ec2c2c;position:absolute;transform-origin:left center;z-index:6;border-radius:4px;pointer-events:none}.plannerMode{outline:3px solid #24a8c6;outline-offset:-3px}.zoom{position:absolute;left:12px;top:65px;z-index:15;display:grid}.zoom button{width:36px;height:36px;background:#fff;border:1px solid #bbb;font-size:20px}.detailsHeader{display:flex;justify-content:space-between;color:#70bfd2;font-size:11px;font-weight:800;letter-spacing:1px}.detailsHeader button{background:transparent;color:#9bb5bd;border:0;font-size:22px}.empty{color:#718e98;padding-top:60px;text-align:center}.selectedIcon{font-size:42px;margin-top:22px}.details h2{font-size:21px;margin:5px 0}.coordBox{display:grid;grid-template-columns:30px 1fr 30px 1fr;gap:8px;align-items:center;background:#092630;border:1px solid #214955;border-radius:10px;padding:12px;margin:16px 0}.coordBox span{color:#6faaba;font-size:11px;font-weight:800}.buffBox{border-top:1px solid #234650;padding-top:12px}.buffBox h3{font-size:11px;color:#78bfd0}.buffRow{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #14333d;font-size:12px}.buffRow b{color:#a6ebf8}.detailButtons{display:grid;gap:7px;margin-top:18px}.detailButtons button{background:#103847;border:1px solid #285565;color:#c8eef5;border-radius:8px;padding:10px}.toast{position:fixed;right:22px;bottom:22px;z-index:100;background:#0e4f60;padding:12px 16px;border-radius:9px;box-shadow:0 10px 30px #0006}.content{padding:38px;max-width:1300px;margin:auto}.pageHero{background:linear-gradient(135deg,#0d2d39,#0a2029);border:1px solid #214957;border-radius:18px;padding:28px;display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:22px}.pageHero h1{font-size:38px;margin:0 0 7px}.pageHero p{margin:0;color:#89aab4}.heroSearch{width:280px;margin:0}.tableCard{background:#09232d;border:1px solid #214651;border-radius:15px;overflow:auto}.tableCard table{width:100%;border-collapse:collapse}.tableCard th,.tableCard td{text-align:left;padding:15px;border-bottom:1px solid #173943}.tableCard th{color:#69b7c9;font-size:12px;text-transform:uppercase}.tableCard td{color:#a9c1c9}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}.infoCard,.calcCard,.editor,.adminNav{background:#09232d;border:1px solid #214651;border-radius:15px;padding:20px}.bigEmoji{font-size:40px}.infoCard h2{margin:10px 0}.infoCard p{color:#8caab3;line-height:1.6}.calcGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px}.calcCard h2{margin-top:0}.field{display:block;margin:12px 0}.field span{display:block;font-size:12px;color:#7da5b0;margin-bottom:5px}.result{background:#0d3a46;border:1px solid #286070;border-radius:9px;padding:13px;font-size:20px;font-weight:800;margin-top:12px}.adminGrid{display:grid;grid-template-columns:220px 1fr;gap:16px}.adminNav{display:grid;align-content:start;gap:5px}.adminTab{background:transparent;color:#8baab3;border:0;text-align:left;padding:11px;border-radius:8px}.adminTab.active{background:#123d4a;color:#b8eff8}.editor label{display:block;color:#75afbc;font-size:12px;margin:12px 0 6px}.editor textarea{min-height:150px;resize:vertical}@media(max-width:1100px){.topbar{height:auto;min-height:82px;flex-wrap:wrap;padding:12px}.brand{min-width:auto}.nav{justify-content:flex-start}.mapLayout{grid-template-columns:240px 1fr}.details{position:absolute;right:0;top:82px;bottom:0;width:300px;z-index:20;box-shadow:-10px 0 30px #0004}.content{padding:20px}}@media(max-width:760px){.mapLayout{display:block;height:calc(100vh - 100px)}.sidebar{display:none}.details{width:90%;top:auto;bottom:0;height:310px}.mapToolbar{font-size:12px}.pageHero{display:block}.heroSearch{width:100%;margin-top:18px}.adminGrid{grid-template-columns:1fr}.content{padding:12px}.navBtn{padding:9px 7px;font-size:12px}}
`;

export default App;
