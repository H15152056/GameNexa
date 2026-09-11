// ============================================================
// GENSHIN IMPACT — build/role helper
// ============================================================
// Game-specific logic for Genshin Impact lives in this
// src/games/genshin/ folder. To remove this game from the
// site, delete this folder plus src/games/genshin usages in
// GamePage.jsx and src/data/genshinCharacters.js / gamesData.js.

const genshinBuildByRole = {
  'Main DPS': {
    artifacts: '4pc role / reaction set',
    mainStats: 'ATK% / Elemental DMG / CRIT',
    substats: 'CRIT Rate / CRIT DMG > ATK% > ER',
    talentPriority: 'Normal Attack / Skill / Burst — follow the character kit',
    weaponAdvice:
      'Signature weapon first; otherwise CRIT, ATK or Elemental Mastery options that match the kit.',
  },
  'Sub DPS': {
    artifacts:
      '4pc Golden Troupe / Emblem of Severed Fate / reaction set',
    mainStats: 'ATK% / Elemental DMG / CRIT',
    substats: 'CRIT Rate / CRIT DMG > ER > ATK%',
    talentPriority:
      'Elemental Skill / Burst > Normal Attack when off-field',
    weaponAdvice:
      'Signature or strong CRIT/ER/EM weapon depending on the character’s rotation.',
  },
  Support: {
    artifacts:
      '4pc Noblesse Oblige / Scroll of the Hero of Cinder City / kit-specific set',
    mainStats:
      'ER or HP/DEF/EM as required / Elemental DMG or Healing / CRIT or Healing Bonus',
    substats:
      'Energy Recharge > required scaling stat > CRIT/EM',
    talentPriority: 'Skill / Burst > Normal Attack',
    weaponAdvice:
      'Energy Recharge or team-buffing option; use the signature when its passive is relevant.',
  },
  DPS: {
    artifacts:
      '4pc character/reaction set or Golden Troupe when off-field',
    mainStats: 'ATK% / Elemental DMG / CRIT',
    substats:
      'CRIT Rate / CRIT DMG > ATK% > ER/EM',
    talentPriority:
      'Skill / Burst > Normal Attack unless the kit says otherwise',
    weaponAdvice:
      'Signature or a high-value CRIT/ATK/EM option suited to the character.',
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

export function getGenshinBuildProfile(character) {
  const role = character?.role || 'Support'
  const profile =
    genshinBuildByRole[role] || genshinBuildByRole.Support

  return {
    ...profile,
    ascensionGem:
      genshinElementGem[character?.element] ||
      'Elemental Ascension Gem',
    identity: `${character?.element || 'Elemental'} ${
      character?.weapon || 'Weapon'
    } · ${role}`,
  }
}
