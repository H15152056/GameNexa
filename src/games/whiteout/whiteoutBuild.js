// ============================================================
// WHITEOUT SURVIVAL — build/role helper
// ============================================================
// Game-specific logic for Whiteout Survival lives in this
// src/games/whiteout/ folder. To remove this game from the
// site, delete this folder plus src/games/whiteout usages in
// GamePage.jsx and src/data/whiteoutHeroes.js / gamesData.js.

export function getWhiteoutBuildProfile(character) {
  const role = character?.role || 'Combat'
  const isRally = Boolean(
    character?.rallyJoiner || /Rally/i.test(role)
  )
  const isHealer = Boolean(
    character?.healer || /Healer/i.test(role)
  )
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
      character?.rarity === 'Mythic' ||
      character?.quality === 'SSR'
        ? 'Exclusive Gear recommended'
        : 'Standard hero progression',
  }
}
