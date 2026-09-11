export const whiteoutFacilities = [
  { id: 'facility-01', name: 'Facility Alpha', type: 'Strategic Facility', description: 'Strategic facility for alliance positioning and planning.' },
  { id: 'facility-02', name: 'Facility Bravo', type: 'Strategic Facility', description: 'Strategic facility on the eastern side of the state map.' },
  { id: 'facility-03', name: 'Facility Charlie', type: 'Strategic Facility', description: 'Northern facility position.' },
  { id: 'facility-04', name: 'Facility Delta', type: 'Strategic Facility', description: 'Southern facility position.' },
]

export const whiteoutFortresses = [1,2,3,4].map((n) => ({
  id: `fortress-${String(n).padStart(2,'0')}`,
  name: `Fortress ${String(n).padStart(2,'0')}`,
  type: 'Fortress',
  description: 'Major alliance objective. Control and timing are important during state activities.',
}))

export const whiteoutStrongholds = [1,2,3,4,5,6].map((n) => ({
  id: `stronghold-${String(n).padStart(2,'0')}`,
  name: `Stronghold ${String(n).padStart(2,'0')}`,
  type: 'Stronghold',
  description: 'Stronghold location for alliance planning and coordinated attacks.',
}))

export const whiteoutResources = [
  { id: 'resource-01', name: 'Resource Zone North', type: 'Resource Zone', description: 'Northern resource area.' },
  { id: 'resource-02', name: 'Resource Zone West', type: 'Resource Zone', description: 'Western resource area.' },
  { id: 'resource-03', name: 'Resource Zone East', type: 'Resource Zone', description: 'Eastern resource area.' },
  { id: 'resource-04', name: 'Resource Zone South', type: 'Resource Zone', description: 'Southern resource area.' },
]

export const whiteoutEvents = [
  { id: 'event-01', name: 'Bear Trap', type: 'Alliance Event', description: 'Coordinate rally joiners, buffs and timing for maximum alliance damage.' },
  { id: 'event-02', name: 'Crazy Joe', type: 'Alliance Event', description: 'Prepare defenses, troop assignments and rally support before the event.' },
  { id: 'event-03', name: 'Foundry Battle', type: 'Battle Event', description: 'Plan lanes, objectives, reinforcements and coordinated movement.' },
]

export const whiteoutBuildings = [
  { id: 'building-furnace', name: 'Furnace', type: 'Main Building', description: 'Main progression building controlling major unlocks and power.' },
  { id: 'building-embassy', name: 'Embassy', type: 'Alliance Building', description: 'Increases reinforcement capacity and alliance support.' },
  { id: 'building-command-center', name: 'Command Center', type: 'Military Building', description: 'Supports troop capacity and march systems.' },
  { id: 'building-infirmary', name: 'Infirmary', type: 'Military Building', description: 'Provides wounded troop capacity.' },
  { id: 'building-war-academy', name: 'War Academy', type: 'Research Building', description: 'Unlocks advanced research and military progression.' },
]

export const whiteoutResearch = [
  { id: 'research-construction', name: 'Construction Speed', type: 'Economy', description: 'Improves construction speed and progression efficiency.' },
  { id: 'research-gathering', name: 'Gathering Speed', type: 'Economy', description: 'Improves resource gathering speed.' },
  { id: 'research-attack', name: 'Troop Attack', type: 'Battle', description: 'Improves troop attack.' },
  { id: 'research-defense', name: 'Troop Defense', type: 'Battle', description: 'Improves troop defense.' },
  { id: 'research-march', name: 'Troop March Speed', type: 'March', description: 'Improves march speed.' },
]

export const whiteoutTroops = [
  { id: 'troop-infantry', name: 'Infantry', type: 'Frontline', description: 'Shield and frontline troops built for durability.' },
  { id: 'troop-lancer', name: 'Lancer', type: 'Melee', description: 'Fast melee troops with balanced combat utility.' },
  { id: 'troop-marksman', name: 'Marksman', type: 'Ranged', description: 'Ranged damage troops used for sustained DPS.' },
]

export const whiteoutBearTrap = [
  { id: 'beartrap-rally', name: 'Rally Setup', type: 'Bear Trap', description: 'Use appropriate rally leads and joiner buffs to maximize damage.' },
  { id: 'beartrap-timing', name: 'Timing', type: 'Bear Trap', description: 'Coordinate rallies and joins so marches arrive consistently.' },
  { id: 'beartrap-joiners', name: 'Joiner Heroes', type: 'Bear Trap', description: 'Choose support heroes that provide useful rally buffs when joining.' },
]

export const whiteoutMaps = [
  { id: 'sunfire', name: 'Sunfire Castle', type: 'castle', short: 'SF', x: 50, y: 48, description: 'Central strategic landmark for major state-wide competition.' },
  { id: 'fortress-01', name: 'Fortress 01', type: 'fortress', short: 'F1', x: 24, y: 25, description: 'Major alliance objective.' },
  { id: 'fortress-02', name: 'Fortress 02', type: 'fortress', short: 'F2', x: 76, y: 26, description: 'Northern strategic fortress.' },
  { id: 'fortress-03', name: 'Fortress 03', type: 'fortress', short: 'F3', x: 23, y: 72, description: 'Southern strategic fortress.' },
  { id: 'fortress-04', name: 'Fortress 04', type: 'fortress', short: 'F4', x: 77, y: 72, description: 'Southern strategic fortress.' },
  { id: 'stronghold-01', name: 'Stronghold 01', type: 'stronghold', short: 'S1', x: 38, y: 25, description: 'Northern stronghold.' },
  { id: 'stronghold-02', name: 'Stronghold 02', type: 'stronghold', short: 'S2', x: 62, y: 25, description: 'Northern stronghold.' },
  { id: 'stronghold-03', name: 'Stronghold 03', type: 'stronghold', short: 'S3', x: 29, y: 49, description: 'Central-west stronghold.' },
  { id: 'stronghold-04', name: 'Stronghold 04', type: 'stronghold', short: 'S4', x: 71, y: 49, description: 'Central-east stronghold.' },
  { id: 'stronghold-05', name: 'Stronghold 05', type: 'stronghold', short: 'S5', x: 38, y: 73, description: 'Southern stronghold.' },
  { id: 'stronghold-06', name: 'Stronghold 06', type: 'stronghold', short: 'S6', x: 62, y: 73, description: 'Southern stronghold.' },
  { id: 'facility-01', name: 'Facility Alpha', type: 'facility', short: 'A', x: 17, y: 45, description: 'Strategic facility.' },
  { id: 'facility-02', name: 'Facility Bravo', type: 'facility', short: 'B', x: 83, y: 45, description: 'Eastern strategic facility.' },
  { id: 'facility-03', name: 'Facility Charlie', type: 'facility', short: 'C', x: 45, y: 17, description: 'Northern facility.' },
  { id: 'facility-04', name: 'Facility Delta', type: 'facility', short: 'D', x: 55, y: 83, description: 'Southern facility.' },
  { id: 'resource-01', name: 'Resource Zone North', type: 'resource', short: 'R', x: 50, y: 11, description: 'Northern resource area.' },
  { id: 'resource-02', name: 'Resource Zone West', type: 'resource', short: 'R', x: 10, y: 50, description: 'Western resource area.' },
  { id: 'resource-03', name: 'Resource Zone East', type: 'resource', short: 'R', x: 90, y: 50, description: 'Eastern resource area.' },
  { id: 'resource-04', name: 'Resource Zone South', type: 'resource', short: 'R', x: 50, y: 89, description: 'Southern resource area.' },
  { id: 'territory-01', name: 'Alliance Territory West', type: 'territory', short: 'T', x: 34, y: 40, description: 'Alliance territory planning zone.' },
  { id: 'territory-02', name: 'Alliance Territory East', type: 'territory', short: 'T', x: 66, y: 40, description: 'Alliance territory planning zone.' },
  { id: 'event-01', name: 'Battle Event', type: 'event', short: 'E', x: 42, y: 58, description: 'Event location.' },
  { id: 'event-02', name: 'State Event', type: 'event', short: 'E', x: 58, y: 58, description: 'State event location.' },
]
