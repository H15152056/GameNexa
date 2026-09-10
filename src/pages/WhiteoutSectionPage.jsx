import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { whiteoutHeroes } from '../data/whiteoutHeroes'
import './GamePage.css'

const ICONS = {
  map: String.fromCodePoint(0x1f5fa, 0xfe0f),
  fortress: String.fromCodePoint(0x1f3f0),
  stronghold: String.fromCodePoint(0x1f6e1, 0xfe0f),
  castle: String.fromCodePoint(0x1f3f0),
  facility: String.fromCodePoint(0x1f3ed),
  resource: String.fromCodePoint(0x1f332),
  territory: String.fromCodePoint(0x1f465),
  event: String.fromCodePoint(0x2694, 0xfe0f),
  search: String.fromCodePoint(0x2315),
  pin: String.fromCodePoint(0x1f4cd),
  snow: String.fromCodePoint(0x2744, 0xfe0f),
  hero: String.fromCodePoint(0x1f9b8),
  calculator: String.fromCodePoint(0x1f9ee),
  planner: String.fromCodePoint(0x1f9ed),
  guide: String.fromCodePoint(0x1f4da),
  arrow: String.fromCodePoint(0x2192),
  close: String.fromCodePoint(0x2715),
  battle: String.fromCodePoint(0x2694, 0xfe0f),
  mountain: String.fromCodePoint(0x26f0, 0xfe0f),
  expand: String.fromCodePoint(0x26f6, 0xfe0f),
}

const STATES = ['Generic', '4496', '4142', '5000', '5001']

const MAP_TYPES = [
  { id: 'all', name: 'All', icon: ICONS.map },
  { id: 'fortress', name: 'Fortresses', icon: ICONS.fortress },
  { id: 'stronghold', name: 'Strongholds', icon: ICONS.stronghold },
  { id: 'facility', name: 'Facilities', icon: ICONS.facility },
  { id: 'castle', name: 'Sunfire Castle', icon: ICONS.castle },
  { id: 'resource', name: 'Resources', icon: ICONS.resource },
  { id: 'territory', name: 'Alliance Territory', icon: ICONS.territory },
  { id: 'event', name: 'Events', icon: ICONS.event },
]

const MAP_LOCATIONS = [
  {
    id: 'sunfire',
    type: 'castle',
    name: 'Sunfire Castle',
    short: 'SF',
    x: 50,
    y: 48,
    description:
      'Central strategic landmark used for major state-wide competition and alliance objectives.',
  },
  {
    id: 'fortress-01',
    type: 'fortress',
    name: 'Fortress 01',
    short: 'F1',
    x: 24,
    y: 25,
    description:
      'Major alliance objective. Control and timing are important during state activities.',
  },
  {
    id: 'fortress-02',
    type: 'fortress',
    name: 'Fortress 02',
    short: 'F2',
    x: 76,
    y: 26,
    description: 'Northern strategic fortress position.',
  },
  {
    id: 'fortress-03',
    type: 'fortress',
    name: 'Fortress 03',
    short: 'F3',
    x: 23,
    y: 72,
    description: 'Southern strategic fortress position.',
  },
  {
    id: 'fortress-04',
    type: 'fortress',
    name: 'Fortress 04',
    short: 'F4',
    x: 77,
    y: 72,
    description: 'Southern strategic fortress position.',
  },
  {
    id: 'stronghold-01',
    type: 'stronghold',
    name: 'Stronghold 01',
    short: 'S1',
    x: 38,
    y: 25,
    description:
      'Stronghold location suitable for alliance planning and coordinated attacks.',
  },
  {
    id: 'stronghold-02',
    type: 'stronghold',
    name: 'Stronghold 02',
    short: 'S2',
    x: 62,
    y: 25,
    description: 'Stronghold location in the northern sector.',
  },
  {
    id: 'stronghold-03',
    type: 'stronghold',
    name: 'Stronghold 03',
    short: 'S3',
    x: 29,
    y: 49,
    description: 'Central-west stronghold position.',
  },
  {
    id: 'stronghold-04',
    type: 'stronghold',
    name: 'Stronghold 04',
    short: 'S4',
    x: 71,
    y: 49,
    description: 'Central-east stronghold position.',
  },
  {
    id: 'stronghold-05',
    type: 'stronghold',
    name: 'Stronghold 05',
    short: 'S5',
    x: 38,
    y: 73,
    description: 'Southern stronghold position.',
  },
  {
    id: 'stronghold-06',
    type: 'stronghold',
    name: 'Stronghold 06',
    short: 'S6',
    x: 62,
    y: 73,
    description: 'Southern stronghold position.',
  },
  {
    id: 'facility-01',
    type: 'facility',
    name: 'Facility Alpha',
    short: 'A',
    x: 17,
    y: 45,
    description:
      'Strategic facility. Use the map to plan routes and alliance positioning.',
  },
  {
    id: 'facility-02',
    type: 'facility',
    name: 'Facility Bravo',
    short: 'B',
    x: 83,
    y: 45,
    description: 'Strategic facility on the eastern side of the map.',
  },
  {
    id: 'facility-03',
    type: 'facility',
    name: 'Facility Charlie',
    short: 'C',
    x: 45,
    y: 17,
    description: 'Northern facility position.',
  },
  {
    id: 'facility-04',
    type: 'facility',
    name: 'Facility Delta',
    short: 'D',
    x: 55,
    y: 83,
    description: 'Southern facility position.',
  },
  {
    id: 'resource-01',
    type: 'resource',
    name: 'Resource Zone North',
    short: 'R',
    x: 50,
    y: 11,
    description:
      'Resource area. Exact resource availability can vary by state and game cycle.',
  },
  {
    id: 'resource-02',
    type: 'resource',
    name: 'Resource Zone West',
    short: 'R',
    x: 10,
    y: 50,
    description: 'Western resource area.',
  },
  {
    id: 'resource-03',
    type: 'resource',
    name: 'Resource Zone East',
    short: 'R',
    x: 90,
    y: 50,
    description: 'Eastern resource area.',
  },
  {
    id: 'resource-04',
    type: 'resource',
    name: 'Resource Zone South',
    short: 'R',
    x: 50,
    y: 89,
    description: 'Southern resource area.',
  },
  {
    id: 'territory-01',
    type: 'territory',
    name: 'Alliance Territory',
    short: 'T',
    x: 34,
    y: 40,
    description:
      'Use this area for alliance territory planning and coordinated expansion.',
  },
  {
    id: 'territory-02',
    type: 'territory',
    name: 'Alliance Territory',
    short: 'T',
    x: 66,
    y: 40,
    description:
      'Eastern alliance territory planning zone.',
  },
  {
    id: 'event-01',
    type: 'event',
    name: 'Battle Event',
    short: 'E',
    x: 42,
    y: 58,
    description:
      'Event location. Check the current event schedule before committing troops.',
  },
  {
    id: 'event-02',
    type: 'event',
    name: 'State Event',
    short: 'E',
    x: 58,
    y: 58,
    description:
      'State event area for coordinated alliance activity.',
  },
]

const TYPE_META = {
  fortress: {
    label: 'Fortress',
    icon: ICONS.fortress,
  },
  stronghold: {
    label: 'Stronghold',
    icon: ICONS.stronghold,
  },
  facility: {
    label: 'Facility',
    icon: ICONS.facility,
  },
  castle: {
    label: 'Sunfire Castle',
    icon: ICONS.castle,
  },
  resource: {
    label: 'Resource',
    icon: ICONS.resource,
  },
  territory: {
    label: 'Alliance Territory',
    icon: ICONS.territory,
  },
  event: {
    label: 'Event',
    icon: ICONS.event,
  },
}

/*
  These are intentionally extension-free definitions.

  The image loader below automatically tries:
  .jpg
  .jpeg
  .png
  .webp

  So your files can be:
  /public/maps/foundry-battle-4k.jpg
  /public/maps/foundry-battle-4k.png
  etc.
*/

const BATTLE_MAPS = [
  {
    id: 'foundry-battle',
    title: 'Foundry Battle',
    subtitle: 'Foundry Battle 4K Map',
    icon: ICONS.battle,
    baseName: 'foundry-battle-4k',
    description:
      'High-resolution Foundry Battle map for studying lanes, positions and planning alliance coordination.',
  },
  {
    id: 'canyon-clash',
    title: 'Canyon Clash',
    subtitle: 'Canyon Clash 4K Map',
    icon: ICONS.mountain,
    baseName: 'canyon-clash-4k',
    description:
      'High-resolution Canyon Clash map for understanding routes, positioning and coordinated attacks.',
  },
]

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

function ImageWithFallback({
  baseName,
  alt,
  className = '',
  onClick,
}) {
  const [extensionIndex, setExtensionIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  const src = `/maps/${baseName}.${IMAGE_EXTENSIONS[extensionIndex]}`

  if (failed) {
    return (
      <div className={`wo-image-missing ${className}`}>
        <div>{ICONS.map}</div>
        <strong>Map image not found</strong>
        <span>
          Expected: <b>{baseName}.jpg / .png / .webp</b>
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onClick={onClick}
      onError={() => {
        if (extensionIndex < IMAGE_EXTENSIONS.length - 1) {
          setExtensionIndex((value) => value + 1)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}

function SectionHero({ title, description, icon }) {
  return (
    <div className="wo-section-hero">
      <div className="wo-section-hero-icon">{icon}</div>

      <div>
        <div className="wo-eyebrow">WHITEOUT SURVIVAL</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  )
}

function QuickCard({ to, icon, title, description }) {
  return (
    <Link to={to} className="wo-quick-card">
      <div className="wo-quick-icon">{icon}</div>

      <div className="wo-quick-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <span className="wo-quick-arrow">{ICONS.arrow}</span>
    </Link>
  )
}

function MapMarker({ item, selected, onClick }) {
  const meta = TYPE_META[item.type]

  return (
    <button
      type="button"
      className={`wo-map-marker wo-marker-${item.type} ${
        selected ? 'is-selected' : ''
      }`}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
      }}
      onClick={() => onClick(item)}
      title={item.name}
    >
      <span className="wo-marker-icon">{meta.icon}</span>
      <span className="wo-marker-label">{item.short}</span>
    </button>
  )
}

function BattleMapPlanner() {
  const [state, setState] = useState('Generic')
  const [mapType, setMapType] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showLegend, setShowLegend] = useState(true)

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase()

    return MAP_LOCATIONS.filter((item) => {
      const matchesType =
        mapType === 'all' || item.type === mapType

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)

      return matchesType && matchesSearch
    })
  }, [mapType, search])

  const counts = useMemo(() => {
    const result = {
      fortress: 0,
      stronghold: 0,
      facility: 0,
      castle: 0,
      resource: 0,
      territory: 0,
      event: 0,
    }

    MAP_LOCATIONS.forEach((item) => {
      result[item.type] += 1
    })

    return result
  }, [])

  return (
    <>
      <div className="wo-map-toolbar">
        <div className="wo-state-selector">
          <span>State Map</span>

          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value)
              setSelected(null)
            }}
          >
            {STATES.map((item) => (
              <option key={item} value={item}>
                {item === 'Generic' ? 'Generic Map' : `State ${item}`}
              </option>
            ))}
          </select>
        </div>

        <label className="wo-map-search">
          <span>{ICONS.search}</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search map locations..."
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              {ICONS.close}
            </button>
          )}
        </label>
      </div>

      <div className="wo-map-filters">
        {MAP_TYPES.map((filter) => (
          <button
            type="button"
            key={filter.id}
            className={mapType === filter.id ? 'active' : ''}
            onClick={() => {
              setMapType(filter.id)
              setSelected(null)
            }}
          >
            <span>{filter.icon}</span>
            {filter.name}

            {filter.id !== 'all' && counts[filter.id] ? (
              <small>{counts[filter.id]}</small>
            ) : null}
          </button>
        ))}
      </div>

      <div className="wo-map-layout">
        <div className="wo-map-card">
          <div className="wo-map-header">
            <div>
              <strong>
                {state === 'Generic'
                  ? 'Generic State Map'
                  : `State ${state} Map`}
              </strong>

              <span>
                {filteredLocations.length} locations shown
              </span>
            </div>

            <button
              type="button"
              className="wo-legend-toggle"
              onClick={() => setShowLegend((value) => !value)}
            >
              {showLegend ? 'Hide Legend' : 'Show Legend'}
            </button>
          </div>

          <div className="wo-map-canvas">
            <div className="wo-map-snow-layer" />

            <div className="wo-map-grid">
              {Array.from({ length: 20 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>

            <div className="wo-map-compass">
              <span>N</span>
              <div>↑</div>
            </div>

            <div className="wo-map-title-badge">
              <span>{ICONS.snow}</span>
              {state === 'Generic' ? 'GENERIC' : `STATE ${state}`}
            </div>

            <div className="wo-map-road road-a" />
            <div className="wo-map-road road-b" />
            <div className="wo-map-road road-c" />
            <div className="wo-map-road road-d" />

            <div className="wo-map-center-zone">
              <span>{ICONS.castle}</span>
              <strong>CAPITAL ZONE</strong>
            </div>

            {filteredLocations.map((item) => (
              <MapMarker
                key={item.id}
                item={item}
                selected={selected?.id === item.id}
                onClick={setSelected}
              />
            ))}

            {filteredLocations.length === 0 && (
              <div className="wo-map-empty">
                <div>{ICONS.search}</div>
                <strong>No locations found</strong>
                <span>Try another search or filter.</span>
              </div>
            )}
          </div>

          <div className="wo-map-footer">
            <span>
              <b>{filteredLocations.length}</b> markers
            </span>

            <span>
              {state === 'Generic'
                ? 'Generic planning map'
                : `Planning map for State ${state}`}
            </span>
          </div>
        </div>

        <aside className={`wo-map-sidebar ${showLegend ? '' : 'hidden'}`}>
          {selected ? (
            <div className="wo-location-detail">
              <button
                type="button"
                className="wo-detail-close"
                onClick={() => setSelected(null)}
              >
                {ICONS.close}
              </button>

              <div className={`wo-detail-icon wo-marker-${selected.type}`}>
                {TYPE_META[selected.type].icon}
              </div>

              <span className="wo-detail-type">
                {TYPE_META[selected.type].label}
              </span>

              <h3>{selected.name}</h3>

              <p>{selected.description}</p>

              <div className="wo-detail-state">
                <span>Map</span>
                <strong>
                  {state === 'Generic' ? 'Generic' : `State ${state}`}
                </strong>
              </div>

              <button
                type="button"
                className="wo-clear-selection"
                onClick={() => setSelected(null)}
              >
                Back to Map
              </button>
            </div>
          ) : (
            <>
              <div className="wo-sidebar-heading">
                <div>
                  <span>{ICONS.pin}</span>
                  <strong>Map Legend</strong>
                </div>

                <small>
                  {state === 'Generic' ? 'Generic' : `State ${state}`}
                </small>
              </div>

              <div className="wo-legend-list">
                {MAP_TYPES.slice(1).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setMapType(item.id)
                      setSelected(null)
                    }}
                  >
                    <span
                      className={`wo-legend-icon wo-marker-${item.id}`}
                    >
                      {item.icon}
                    </span>

                    <span>{item.name}</span>

                    <b>{counts[item.id]}</b>
                  </button>
                ))}
              </div>

              <div className="wo-map-tip">
                <strong>Map Tip</strong>
                <p>
                  Click any marker to inspect its location. Use the filters
                  above to isolate specific strategic objectives.
                </p>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  )
}

function BattleMapImages() {
  const [activeMap, setActiveMap] = useState('foundry-battle')
  const [fullscreen, setFullscreen] = useState(false)

  const selectedMap =
    BATTLE_MAPS.find((item) => item.id === activeMap) ||
    BATTLE_MAPS[0]

  return (
    <section className="wo-real-maps">
      <div className="wo-section-heading">
        <div>
          <span className="wo-eyebrow">BATTLE MAP DATABASE</span>
          <h2>{ICONS.map} Battle Event Maps</h2>
          <p>
            High-resolution battle maps stored directly in the GameNexa
            project.
          </p>
        </div>
      </div>

      <div className="wo-battle-map-tabs">
        {BATTLE_MAPS.map((map) => (
          <button
            type="button"
            key={map.id}
            className={activeMap === map.id ? 'active' : ''}
            onClick={() => {
              setActiveMap(map.id)
              setFullscreen(false)
            }}
          >
            <span>{map.icon}</span>

            <span>
              <strong>{map.title}</strong>
              <small>{map.subtitle}</small>
            </span>

            <b>{ICONS.arrow}</b>
          </button>
        ))}
      </div>

      <div className="wo-real-map-card">
        <div className="wo-real-map-heading">
          <div>
            <span>{selectedMap.icon}</span>

            <div>
              <strong>{selectedMap.title}</strong>
              <small>{selectedMap.description}</small>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFullscreen(true)}
          >
            {ICONS.expand} View Full Map
          </button>
        </div>

        <div className="wo-real-map-image-wrap">
          <ImageWithFallback
            baseName={selectedMap.baseName}
            alt={`${selectedMap.title} 4K map`}
            className="wo-real-map-image"
            onClick={() => setFullscreen(true)}
          />

          <div className="wo-real-map-overlay">
            <span>{selectedMap.subtitle}</span>
          </div>
        </div>
      </div>

      {fullscreen && (
        <div
          className="wo-image-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setFullscreen(false)}
        >
          <button
            type="button"
            className="wo-image-modal-close"
            onClick={() => setFullscreen(false)}
            aria-label="Close full map"
          >
            {ICONS.close}
          </button>

          <div
            className="wo-image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageWithFallback
              baseName={selectedMap.baseName}
              alt={`${selectedMap.title} full map`}
              className="wo-full-map-image"
            />

            <div className="wo-full-map-title">
              <span>{selectedMap.icon}</span>
              <strong>{selectedMap.title}</strong>
              <small>4K Battle Map</small>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function MapStats() {
  return (
    <div className="wo-map-stats">
      <div>
        <strong>4</strong>
        <span>Fortress Zones</span>
      </div>

      <div>
        <strong>6</strong>
        <span>Strongholds</span>
      </div>

      <div>
        <strong>4</strong>
        <span>Facilities</span>
      </div>

      <div>
        <strong>1</strong>
        <span>Sunfire Castle</span>
      </div>

      <div>
        <strong>4</strong>
        <span>Resource Zones</span>
      </div>

      <div>
        <strong>2</strong>
        <span>Battle Events</span>
      </div>
    </div>
  )
}

function HeroesPreview() {
  const heroes = Array.isArray(whiteoutHeroes)
    ? whiteoutHeroes.slice(0, 6)
    : []

  if (!heroes.length) return null

  return (
    <section className="wo-bottom-section">
      <div className="wo-section-heading">
        <div>
          <span className="wo-eyebrow">BUILD YOUR ROSTER</span>
          <h2>{ICONS.hero} Whiteout Survival Heroes</h2>
          <p>
            Open the complete hero database for generations, roles, rarity and
            hero information.
          </p>
        </div>

        <Link
          to="/game/whiteout-survival/heroes"
          className="wo-view-all"
        >
          View Heroes {ICONS.arrow}
        </Link>
      </div>

      <div className="wo-mini-heroes">
        {heroes.map((hero, index) => {
          const name =
            hero?.name ||
            hero?.title ||
            hero?.heroName ||
            `Hero ${index + 1}`

          const image =
            hero?.image ||
            hero?.img ||
            hero?.portrait ||
            hero?.icon ||
            ''

          return (
            <Link
              key={hero?.id || hero?.slug || `${name}-${index}`}
              to="/game/whiteout-survival/heroes"
              className="wo-mini-hero"
            >
              <div className="wo-mini-hero-image">
                {image ? (
                  <img src={image} alt={name} loading="lazy" />
                ) : (
                  <span>{ICONS.hero}</span>
                )}
              </div>

              <strong>{name}</strong>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default function WhiteoutSectionPage() {
  const { section } = useParams()
  const currentSection = String(section || '').toLowerCase()

  const isMaps =
    currentSection === 'battle-maps' ||
    currentSection === 'maps'

  if (!isMaps) {
    return (
      <main className="wo-page-shell">
        <style>{PAGE_STYLES}</style>

        <SectionHero
          icon={
            currentSection === 'heroes'
              ? ICONS.hero
              : currentSection === 'calculators'
                ? ICONS.calculator
                : currentSection === 'planner'
                  ? ICONS.planner
                  : ICONS.map
          }
          title={
            currentSection === 'heroes'
              ? 'Whiteout Survival Heroes'
              : currentSection === 'calculators'
                ? 'Whiteout Survival Calculators'
                : currentSection === 'planner'
                  ? 'Alliance Planner'
                  : 'Whiteout Survival'
          }
          description="Explore GameNexa's Whiteout Survival tools, guides, maps and strategy resources."
        />

        <div className="wo-fallback-grid">
          <QuickCard
            to="/game/whiteout-survival/battle-maps"
            icon={ICONS.map}
            title="Battle Maps"
            description="Generic, State and battle event maps."
          />

          <QuickCard
            to="/game/whiteout-survival/heroes"
            icon={ICONS.hero}
            title="Heroes"
            description="Explore the complete hero database."
          />

          <QuickCard
            to="/game/whiteout-survival/calculators"
            icon={ICONS.calculator}
            title="Calculators"
            description="Upgrade and progression tools."
          />

          <QuickCard
            to="/game/whiteout-survival/planner"
            icon={ICONS.planner}
            title="Alliance Planner"
            description="Plan alliance objectives and activities."
          />
        </div>
      </main>
    )
  }

  return (
    <main className="wo-page-shell">
      <style>{PAGE_STYLES}</style>

      <SectionHero
        icon={ICONS.map}
        title="Whiteout Survival Battle Maps"
        description="Explore Generic and State maps plus high-resolution Foundry Battle and Canyon Clash maps."
      />

      <div className="wo-breadcrumb">
        <Link to="/game/whiteout-survival/">
          Whiteout Survival
        </Link>
        <span>{ICONS.arrow}</span>
        <strong>Battle Maps</strong>
      </div>

      <div className="wo-map-intro">
        <div>
          <span className="wo-eyebrow">STATE WARFARE TOOL</span>
          <h2>Plan Your State Map</h2>

          <p>
            Select a State, filter strategic locations and click markers to
            inspect important map objectives. Below the tactical planner,
            you'll also find the original high-resolution battle maps.
          </p>
        </div>

        <div className="wo-intro-badge">
          <span>{ICONS.snow}</span>
          <strong>TACTICAL MAP</strong>
          <small>Generic + State + Battle Maps</small>
        </div>
      </div>

      <MapStats />

      <BattleMapPlanner />

      <BattleMapImages />

      <section className="wo-tools-section">
        <div className="wo-section-heading">
          <div>
            <span className="wo-eyebrow">MORE TOOLS</span>
            <h2>Whiteout Survival Tools</h2>
            <p>
              Continue from the map into the rest of the GameNexa Whiteout
              Survival hub.
            </p>
          </div>
        </div>

        <div className="wo-tools-grid">
          <QuickCard
            to="/game/whiteout-survival/heroes"
            icon={ICONS.hero}
            title="Heroes"
            description="Hero database, roles, rarity and generations."
          />

          <QuickCard
            to="/game/whiteout-survival/calculators"
            icon={ICONS.calculator}
            title="Calculators"
            description="Useful progression and upgrade calculators."
          />

          <QuickCard
            to="/game/whiteout-survival/planner"
            icon={ICONS.planner}
            title="Alliance Planner"
            description="Organize objectives and alliance activities."
          />

          <QuickCard
            to="/game/whiteout-survival/guides"
            icon={ICONS.guide}
            title="Whiteout Guides"
            description="Guides, strategies and event information."
          />
        </div>
      </section>

      <HeroesPreview />

      <section className="wo-bottom-section wo-map-note">
        <div className="wo-note-icon">{ICONS.map}</div>

        <div>
          <strong>About the Battle Maps</strong>

          <p>
            GameNexa combines strategic planning tools with high-resolution
            battle event maps. Use the generic and State map for planning, and
            the Foundry Battle or Canyon Clash maps when preparing for those
            specific events.
          </p>
        </div>
      </section>
    </main>
  )
}

const PAGE_STYLES = `
.wo-page-shell {
  width: min(1400px, calc(100% - 28px));
  margin: 0 auto;
  padding: 28px 0 70px;
  color: #eaf2f8;
}

.wo-section-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
  border: 1px solid rgba(150, 205, 235, .16);
  border-radius: 22px;
  background:
    radial-gradient(circle at 10% 10%, rgba(89, 179, 226, .14), transparent 32%),
    linear-gradient(135deg, rgba(17, 38, 54, .98), rgba(9, 21, 31, .98));
  box-shadow: 0 18px 50px rgba(0, 0, 0, .18);
}

.wo-section-hero-icon {
  width: 76px;
  height: 76px;
  flex: 0 0 76px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  font-size: 39px;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.1);
}

.wo-eyebrow {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .16em;
  color: #82c8eb;
}

.wo-section-hero h1 {
  margin: 0 0 8px;
  font-size: clamp(28px, 4vw, 46px);
  line-height: 1.05;
}

.wo-section-hero p {
  max-width: 900px;
  margin: 0;
  color: #a9bac6;
  line-height: 1.65;
}

.wo-breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 18px 2px;
  font-size: 13px;
  color: #8296a4;
}

.wo-breadcrumb a {
  color: #8bcdf0;
  text-decoration: none;
}

.wo-map-intro {
  display: flex;
  justify-content: space-between;
  gap: 25px;
  margin: 20px 0 18px;
  padding: 25px;
  border: 1px solid rgba(150,205,235,.12);
  border-radius: 20px;
  background: rgba(11,27,39,.72);
}

.wo-map-intro h2 {
  margin: 0 0 8px;
  font-size: 26px;
}

.wo-map-intro p {
  max-width: 900px;
  margin: 0;
  color: #9fb1bd;
  line-height: 1.65;
}

.wo-intro-badge {
  min-width: 200px;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 17px;
  border-radius: 16px;
  background: rgba(122, 191, 226, .08);
  border: 1px solid rgba(122, 191, 226, .14);
}

.wo-intro-badge span {
  font-size: 28px;
  margin-bottom: 5px;
}

.wo-intro-badge strong {
  font-size: 12px;
  letter-spacing: .12em;
}

.wo-intro-badge small {
  margin-top: 4px;
  color: #8298a7;
}

.wo-map-stats {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin: 15px 0;
}

.wo-map-stats > div {
  padding: 16px 10px;
  text-align: center;
  border: 1px solid rgba(150,205,235,.11);
  border-radius: 15px;
  background: rgba(11,27,39,.7);
}

.wo-map-stats strong {
  display: block;
  font-size: 23px;
}

.wo-map-stats span {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: #8298a7;
}

.wo-map-toolbar {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.wo-state-selector,
.wo-map-search {
  min-height: 50px;
  border: 1px solid rgba(150,205,235,.13);
  border-radius: 14px;
  background: rgba(9,22,32,.94);
}

.wo-state-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px 0 15px;
}

.wo-state-selector span {
  color: #8095a4;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.wo-state-selector select {
  border: 0;
  outline: 0;
  color: #eaf4f9;
  background: transparent;
  font-weight: 800;
  cursor: pointer;
}

.wo-state-selector option {
  background: #10202b;
  color: white;
}

.wo-map-search {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 14px;
}

.wo-map-search > span {
  margin-right: 9px;
  color: #7cbfe1;
  font-size: 18px;
}

.wo-map-search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #e9f2f6;
  font-size: 14px;
}

.wo-map-search input::placeholder {
  color: #617581;
}

.wo-map-search button {
  border: 0;
  background: transparent;
  color: #7e929e;
  cursor: pointer;
}

.wo-map-filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 0;
}

.wo-map-filters button {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  white-space: nowrap;
  border: 1px solid rgba(150,205,235,.12);
  border-radius: 11px;
  background: rgba(12,27,38,.76);
  color: #91a5b1;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.wo-map-filters button:hover,
.wo-map-filters button.active {
  color: #eaf7fc;
  border-color: rgba(110,193,232,.42);
  background: rgba(62,139,181,.17);
}

.wo-map-filters small {
  min-width: 18px;
  padding: 2px 5px;
  border-radius: 20px;
  background: rgba(255,255,255,.07);
  color: #91a9b6;
}

.wo-map-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 15px;
}

.wo-map-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(150,205,235,.13);
  border-radius: 20px;
  background: #091721;
}

.wo-map-header,
.wo-map-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 14px 17px;
  background: rgba(255,255,255,.025);
}

.wo-map-header {
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.wo-map-header strong {
  display: block;
  font-size: 14px;
}

.wo-map-header span {
  display: block;
  margin-top: 3px;
  color: #708591;
  font-size: 11px;
}

.wo-legend-toggle {
  padding: 7px 10px;
  border: 1px solid rgba(150,205,235,.14);
  border-radius: 9px;
  background: rgba(255,255,255,.035);
  color: #9db1bc;
  cursor: pointer;
  font-size: 11px;
}

.wo-map-canvas {
  position: relative;
  min-height: 650px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 50%, rgba(103,183,220,.17), transparent 23%),
    radial-gradient(circle at 15% 20%, rgba(124,183,211,.08), transparent 25%),
    radial-gradient(circle at 85% 80%, rgba(124,183,211,.08), transparent 25%),
    #10232e;
}

.wo-map-snow-layer {
  position: absolute;
  inset: 0;
  opacity: .65;
  background-image:
    radial-gradient(circle, rgba(255,255,255,.08) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 25px 25px, 41px 41px;
  background-position: 0 0, 13px 17px;
}

.wo-map-grid {
  position: absolute;
  inset: 0;
  opacity: .13;
  pointer-events: none;
}

.wo-map-grid span {
  position: absolute;
  background: rgba(180,225,243,.5);
}

.wo-map-grid span:nth-child(-n+10) {
  top: 0;
  bottom: 0;
  width: 1px;
}

.wo-map-grid span:nth-child(n+11) {
  left: 0;
  right: 0;
  height: 1px;
}

.wo-map-grid span:nth-child(1) { left: 10%; }
.wo-map-grid span:nth-child(2) { left: 20%; }
.wo-map-grid span:nth-child(3) { left: 30%; }
.wo-map-grid span:nth-child(4) { left: 40%; }
.wo-map-grid span:nth-child(5) { left: 50%; }
.wo-map-grid span:nth-child(6) { left: 60%; }
.wo-map-grid span:nth-child(7) { left: 70%; }
.wo-map-grid span:nth-child(8) { left: 80%; }
.wo-map-grid span:nth-child(9) { left: 90%; }
.wo-map-grid span:nth-child(10) { left: 100%; }

.wo-map-grid span:nth-child(11) { top: 10%; }
.wo-map-grid span:nth-child(12) { top: 20%; }
.wo-map-grid span:nth-child(13) { top: 30%; }
.wo-map-grid span:nth-child(14) { top: 40%; }
.wo-map-grid span:nth-child(15) { top: 50%; }
.wo-map-grid span:nth-child(16) { top: 60%; }
.wo-map-grid span:nth-child(17) { top: 70%; }
.wo-map-grid span:nth-child(18) { top: 80%; }
.wo-map-grid span:nth-child(19) { top: 90%; }
.wo-map-grid span:nth-child(20) { top: 100%; }

.wo-map-road {
  position: absolute;
  height: 3px;
  border-radius: 50%;
  background: rgba(208,230,239,.16);
  transform-origin: center;
  pointer-events: none;
}

.road-a {
  width: 85%;
  left: 7%;
  top: 50%;
}

.road-b {
  width: 85%;
  left: 7%;
  top: 50%;
  transform: rotate(90deg);
}

.road-c {
  width: 65%;
  left: 18%;
  top: 50%;
  transform: rotate(35deg);
}

.road-d {
  width: 65%;
  left: 18%;
  top: 50%;
  transform: rotate(-35deg);
}

.wo-map-center-zone {
  position: absolute;
  left: 50%;
  top: 48%;
  width: 125px;
  height: 125px;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 2px dashed rgba(173,219,237,.23);
  background: rgba(116,180,210,.06);
  color: rgba(215,237,246,.45);
  pointer-events: none;
}

.wo-map-center-zone span {
  font-size: 29px;
}

.wo-map-center-zone strong {
  margin-top: 5px;
  font-size: 8px;
  letter-spacing: .13em;
}

.wo-map-title-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 9px;
  background: rgba(5,15,22,.82);
  border: 1px solid rgba(150,205,235,.12);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .12em;
}

.wo-map-compass {
  position: absolute;
  right: 15px;
  top: 14px;
  z-index: 4;
  width: 38px;
  height: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: rgba(5,15,22,.82);
  border: 1px solid rgba(150,205,235,.12);
  color: #9dbbc8;
  font-size: 11px;
}

.wo-map-compass div {
  font-size: 18px;
  line-height: 15px;
}

.wo-map-marker {
  position: absolute;
  z-index: 5;
  width: 38px;
  height: 38px;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255,255,255,.25);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,.32);
  transition: .18s ease;
}

.wo-map-marker:hover,
.wo-map-marker.is-selected {
  z-index: 20;
  transform: translate(-50%, -50%) scale(1.18);
  border-color: white;
  box-shadow: 0 0 0 5px rgba(255,255,255,.07), 0 9px 25px rgba(0,0,0,.4);
}

.wo-marker-icon {
  font-size: 14px;
  line-height: 15px;
}

.wo-marker-label {
  font-size: 7px;
  font-weight: 900;
  line-height: 8px;
}

.wo-map-marker.wo-marker-fortress,
.wo-detail-icon.wo-marker-fortress,
.wo-legend-icon.wo-marker-fortress {
  background: rgba(154,79,76,.9);
}

.wo-map-marker.wo-marker-stronghold,
.wo-detail-icon.wo-marker-stronghold,
.wo-legend-icon.wo-marker-stronghold {
  background: rgba(102,82,154,.9);
}

.wo-map-marker.wo-marker-facility,
.wo-detail-icon.wo-marker-facility,
.wo-legend-icon.wo-marker-facility {
  background: rgba(50,127,157,.9);
}

.wo-map-marker.wo-marker-castle,
.wo-detail-icon.wo-marker-castle,
.wo-legend-icon.wo-marker-castle {
  background: rgba(173,123,50,.95);
}

.wo-map-marker.wo-marker-resource,
.wo-detail-icon.wo-marker-resource,
.wo-legend-icon.wo-marker-resource {
  background: rgba(62,129,79,.9);
}

.wo-map-marker.wo-marker-territory,
.wo-detail-icon.wo-marker-territory,
.wo-legend-icon.wo-marker-territory {
  background: rgba(53,120,144,.9);
}

.wo-map-marker.wo-marker-event,
.wo-detail-icon.wo-marker-event,
.wo-legend-icon.wo-marker-event {
  background: rgba(147,75,124,.9);
}

.wo-map-empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8197a3;
  text-align: center;
}

.wo-map-empty div {
  margin-bottom: 8px;
  font-size: 28px;
}

.wo-map-empty strong {
  color: #d7e4e9;
}

.wo-map-empty span {
  margin-top: 4px;
  font-size: 12px;
}

.wo-map-footer {
  border-top: 1px solid rgba(255,255,255,.06);
  color: #708591;
  font-size: 11px;
}

.wo-map-footer b {
  color: #c9dbe3;
}

.wo-map-sidebar {
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(150,205,235,.13);
  border-radius: 20px;
  background: #0a1822;
}

.wo-map-sidebar.hidden {
  display: none;
}

.wo-sidebar-heading {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 17px;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.wo-sidebar-heading div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wo-sidebar-heading div span {
  font-size: 17px;
}

.wo-sidebar-heading strong {
  font-size: 13px;
}

.wo-sidebar-heading small {
  color: #647985;
  font-size: 10px;
}

.wo-legend-list {
  padding: 8px;
}

.wo-legend-list button {
  width: 100%;
  display: grid;
  grid-template-columns: 34px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 9px;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: #9cb0ba;
  text-align: left;
  cursor: pointer;
}

.wo-legend-list button:hover {
  background: rgba(255,255,255,.04);
  color: white;
}

.wo-legend-icon {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: white;
  font-size: 14px;
}

.wo-legend-list b {
  min-width: 20px;
  text-align: center;
  color: #718692;
  font-size: 11px;
}

.wo-map-tip {
  margin: 10px;
  padding: 14px;
  border-radius: 13px;
  background: rgba(93,168,201,.07);
  border: 1px solid rgba(93,168,201,.12);
}

.wo-map-tip strong {
  font-size: 12px;
}

.wo-map-tip p {
  margin: 6px 0 0;
  color: #788e9a;
  font-size: 11px;
  line-height: 1.6;
}

.wo-location-detail {
  position: relative;
  padding: 22px;
}

.wo-detail-close {
  position: absolute;
  top: 13px;
  right: 13px;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  background: rgba(255,255,255,.05);
  color: #8498a3;
  cursor: pointer;
}

.wo-detail-icon {
  width: 55px;
  height: 55px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  color: white;
  font-size: 25px;
  margin-bottom: 13px;
}

.wo-detail-type {
  display: inline-block;
  color: #7ebbd9;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.wo-location-detail h3 {
  margin: 7px 0;
  font-size: 22px;
}

.wo-location-detail p {
  color: #8da1ac;
  font-size: 12px;
  line-height: 1.65;
}

.wo-detail-state {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 11px;
  border-radius: 10px;
  background: rgba(255,255,255,.035);
  color: #718792;
  font-size: 11px;
}

.wo-detail-state strong {
  color: #c9dbe3;
}

.wo-clear-selection {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid rgba(130,195,225,.2);
  border-radius: 10px;
  background: rgba(82,155,190,.08);
  color: #9dcee4;
  cursor: pointer;
}

/* ============================================================
   REAL 4K BATTLE MAPS
   ============================================================ */

.wo-real-maps {
  margin-top: 42px;
}

.wo-battle-map-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.wo-battle-map-tabs button {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px;
  border: 1px solid rgba(150,205,235,.12);
  border-radius: 15px;
  background: rgba(11,27,39,.72);
  color: #94aab5;
  text-align: left;
  cursor: pointer;
  transition: .18s ease;
}

.wo-battle-map-tabs button:hover,
.wo-battle-map-tabs button.active {
  border-color: rgba(113,195,232,.38);
  background: rgba(44,103,132,.16);
  color: #eaf7fc;
}

.wo-battle-map-tabs button > span:first-child {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(107,184,218,.1);
  font-size: 21px;
}

.wo-battle-map-tabs button > span:nth-child(2) {
  min-width: 0;
  flex: 1;
}

.wo-battle-map-tabs strong {
  display: block;
  font-size: 14px;
}

.wo-battle-map-tabs small {
  display: block;
  margin-top: 3px;
  color: #718691;
  font-size: 10px;
}

.wo-battle-map-tabs b {
  color: #6d8b99;
}

.wo-real-map-card {
  overflow: hidden;
  border: 1px solid rgba(150,205,235,.14);
  border-radius: 20px;
  background: #091721;
  box-shadow: 0 18px 45px rgba(0,0,0,.2);
}

.wo-real-map-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.wo-real-map-heading > div {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.wo-real-map-heading > div > span {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(108,184,218,.1);
  font-size: 21px;
}

.wo-real-map-heading strong {
  display: block;
  font-size: 15px;
}

.wo-real-map-heading small {
  display: block;
  margin-top: 4px;
  color: #728893;
  font-size: 10px;
  line-height: 1.45;
}

.wo-real-map-heading button {
  flex: 0 0 auto;
  padding: 9px 12px;
  border: 1px solid rgba(128,197,229,.18);
  border-radius: 10px;
  background: rgba(82,155,190,.08);
  color: #9bcde3;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
}

.wo-real-map-image-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #050d12;
}

.wo-real-map-image {
  display: block;
  width: 100%;
  height: auto;
  max-height: 850px;
  object-fit: contain;
  cursor: zoom-in;
}

.wo-real-map-overlay {
  position: absolute;
  left: 15px;
  bottom: 15px;
  padding: 7px 10px;
  border-radius: 8px;
  background: rgba(4,12,18,.82);
  border: 1px solid rgba(255,255,255,.1);
  color: #d5e5eb;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
  pointer-events: none;
}

.wo-image-missing {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 30px;
  text-align: center;
  color: #788d98;
  background:
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,.025),
      rgba(255,255,255,.025) 10px,
      transparent 10px,
      transparent 20px
    );
}

.wo-image-missing div {
  font-size: 40px;
  opacity: .65;
}

.wo-image-missing strong {
  color: #c9dbe2;
}

.wo-image-missing span {
  font-size: 11px;
}

.wo-image-missing b {
  color: #91c8df;
}

/* Fullscreen image */

.wo-image-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  background: rgba(2,8,12,.94);
  backdrop-filter: blur(8px);
}

.wo-image-modal-content {
  position: relative;
  width: min(1500px, 96vw);
  max-height: 94vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wo-full-map-image {
  display: block;
  max-width: 100%;
  max-height: 92vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 80px rgba(0,0,0,.6);
}

.wo-image-modal-close {
  position: fixed;
  top: 18px;
  right: 20px;
  z-index: 10001;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 12px;
  background: rgba(12,24,32,.9);
  color: white;
  cursor: pointer;
  font-size: 17px;
}

.wo-full-map-title {
  position: fixed;
  left: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 13px;
  border-radius: 11px;
  background: rgba(8,19,27,.9);
  border: 1px solid rgba(255,255,255,.1);
}

.wo-full-map-title span {
  font-size: 20px;
}

.wo-full-map-title strong {
  font-size: 13px;
}

.wo-full-map-title small {
  color: #8297a2;
  font-size: 10px;
}

/* ============================================================
   OTHER SECTIONS
   ============================================================ */

.wo-tools-section,
.wo-bottom-section {
  margin-top: 35px;
}

.wo-section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 15px;
}

.wo-section-heading h2 {
  margin: 0 0 7px;
  font-size: 25px;
}

.wo-section-heading p {
  margin: 0;
  color: #8196a1;
  font-size: 13px;
}

.wo-view-all {
  white-space: nowrap;
  color: #88c9e9;
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;
}

.wo-tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.wo-quick-card {
  position: relative;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(150,205,235,.12);
  border-radius: 15px;
  background: rgba(11,27,39,.72);
  transition: .18s ease;
}

.wo-quick-card:hover {
  transform: translateY(-2px);
  border-color: rgba(120,195,229,.3);
  background: rgba(20,42,56,.8);
}

.wo-quick-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(108,184,218,.1);
  font-size: 21px;
}

.wo-quick-content {
  min-width: 0;
  padding-right: 18px;
}

.wo-quick-content strong {
  display: block;
  font-size: 13px;
}

.wo-quick-content span {
  display: block;
  margin-top: 4px;
  color: #748995;
  font-size: 10px;
  line-height: 1.4;
}

.wo-quick-arrow {
  position: absolute;
  right: 12px;
  color: #68808d;
  font-size: 14px;
}

.wo-mini-heroes {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.wo-mini-hero {
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(150,205,235,.12);
  border-radius: 15px;
  background: rgba(11,27,39,.72);
}

.wo-mini-hero-image {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.035);
}

.wo-mini-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.wo-mini-hero-image span {
  font-size: 34px;
}

.wo-mini-hero strong {
  display: block;
  padding: 9px;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wo-map-note {
  display: flex;
  gap: 14px;
  padding: 18px;
  border: 1px solid rgba(150,205,235,.1);
  border-radius: 15px;
  background: rgba(11,27,39,.55);
}

.wo-note-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(91,166,202,.1);
  font-size: 21px;
}

.wo-map-note strong {
  display: block;
  font-size: 13px;
}

.wo-map-note p {
  margin: 5px 0 0;
  color: #788e9a;
  font-size: 11px;
  line-height: 1.65;
}

.wo-fallback-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 1050px) {
  .wo-map-layout {
    grid-template-columns: 1fr;
  }

  .wo-map-sidebar {
    min-height: 0;
  }

  .wo-tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .wo-mini-heroes {
    grid-template-columns: repeat(3, 1fr);
  }

  .wo-map-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 700px) {
  .wo-page-shell {
    width: min(100% - 16px, 1400px);
    padding-top: 12px;
  }

  .wo-section-hero {
    padding: 19px;
    gap: 13px;
    border-radius: 17px;
  }

  .wo-section-hero-icon {
    width: 55px;
    height: 55px;
    flex-basis: 55px;
    border-radius: 15px;
    font-size: 28px;
  }

  .wo-section-hero h1 {
    font-size: 26px;
  }

  .wo-section-hero p {
    font-size: 12px;
  }

  .wo-map-intro {
    padding: 17px;
  }

  .wo-map-intro h2 {
    font-size: 21px;
  }

  .wo-intro-badge {
    display: none;
  }

  .wo-map-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .wo-map-toolbar {
    flex-direction: column;
  }

  .wo-state-selector {
    justify-content: space-between;
  }

  .wo-map-canvas {
    min-height: 510px;
  }

  .wo-map-marker {
    width: 34px;
    height: 34px;
  }

  .wo-map-center-zone {
    width: 90px;
    height: 90px;
  }

  .wo-map-center-zone span {
    font-size: 22px;
  }

  .wo-map-center-zone strong {
    font-size: 6px;
  }

  .wo-section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .wo-battle-map-tabs {
    grid-template-columns: 1fr;
  }

  .wo-real-map-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .wo-real-map-heading button {
    width: 100%;
  }

  .wo-real-map-image {
    max-height: none;
  }

  .wo-tools-grid {
    grid-template-columns: 1fr;
  }

  .wo-mini-heroes {
    grid-template-columns: repeat(2, 1fr);
  }

  .wo-fallback-grid {
    grid-template-columns: 1fr;
  }

  .wo-image-modal {
    padding: 10px;
  }

  .wo-full-map-title {
    left: 10px;
    bottom: 10px;
  }
}
`