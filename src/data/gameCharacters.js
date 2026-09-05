export const gameCharacters = {
  genshin: [
    {
      name: 'Arlecchino',
      role: '5★ · Pyro · Main DPS',
      description:
        'The Knave of the Fatui Harbingers and a powerful Pyro damage dealer.',
      weapon: 'Polearm',
      faction: 'Fatui · House of the Hearth',
      element: 'pyro',
      icon: '🔥',
      image: null
    },
    {
      name: 'Zhongli',
      role: '5★ · Geo · Support',
      description:
        'The former Geo Archon and one of Liyue’s most powerful protectors.',
      weapon: 'Polearm',
      faction: 'Liyue',
      element: 'geo',
      icon: '🪨',
      image: null
    },
    {
      name: 'Furina',
      role: '5★ · Hydro · Support',
      description:
        'A powerful Hydro support character from Fontaine.',
      weapon: 'Sword',
      faction: 'Fontaine',
      element: 'hydro',
      icon: '💧',
      image: null
    },
    {
      name: 'Nefer',
      role: '5★ · Dendro · DPS',
      description:
        'A powerful Dendro character from the newer Teyvat roster.',
      weapon: 'Catalyst',
      faction: 'Nod-Krai',
      element: 'dendro',
      icon: '🌿',
      image: null
    },
    {
      name: 'Aino',
      role: '4★ · Hydro · Support',
      description:
        'A Hydro character from Nod-Krai who uses a Claymore.',
      weapon: 'Claymore',
      faction: 'Nod-Krai',
      element: 'hydro',
      icon: '💧',
      image: null
    }
  ],


  'whiteout-survival': [
    // =========================
    // GENERATION 1
    // =========================
    {
      name: 'Jeronimo',
      generation: 1,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Rally Captain',
      description:
        'A powerful early-generation Infantry hero and one of the strongest foundational rally captains in Whiteout Survival.',
      skills: [
        'Combo Slash',
        'Sword Art',
        'Lone Wolf'
      ],
      gear: 'Dawnbreak',
      bearTrap: 'Excellent rally captain and one of the strongest early Bear Trap choices.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'High priority for early progression',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Natalia',
      generation: 1,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Rally Support',
      description:
        'A strong Infantry combat hero with excellent early-game damage and useful rally performance.',
      skills: [
        'Beast Charge',
        'Whip',
        'Rage Response'
      ],
      gear: 'Gale Force',
      bearTrap: 'Strong early Bear Trap option, especially for Infantry-focused rallies.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'High priority',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Molly',
      generation: 1,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A versatile early Lancer hero with strong combat utility and long-term value for developing accounts.',
      skills: [
        'Super Snowball',
        'Frost Ambush',
        'Youthful Persistence'
      ],
      gear: 'Yeti Spirit',
      bearTrap: 'Useful Lancer option in early Bear Trap lineups.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'Very High priority',
      icon: '❄️',
      image: null
    },
    {
      name: 'Zinman',
      generation: 1,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A Gen 1 Marksman hero focused on ranged combat and offensive utility.',
      skills: [
        'Combat Skill',
        'Ranged Support',
        'Marksman Ability'
      ],
      gear: 'Exclusive Gear',
      bearTrap: 'Useful early Marksman option.',
      rally: 'Good',
      joiner: 'Good',
      pvp: 'Good',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 2
    // =========================
    {
      name: 'Flint',
      generation: 2,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Rally Captain',
      description:
        'A powerful Infantry hero who remains useful for Bear Trap, rallies and PvP after Gen 1.',
      skills: [
        'Flame Combat',
        'Infantry Defense',
        'Fire Protection'
      ],
      gear: 'Exclusive Gear',
      bearTrap: 'Excellent early-to-mid generation rally option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Excellent',
      f2p: 'High priority',
      icon: '🔥',
      image: null
    },
    {
      name: 'Philly',
      generation: 2,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Support · Healing',
      description:
        'A support-focused hero providing healing and utility for combat and exploration.',
      skills: [
        'Healing',
        'Support',
        'Recovery'
      ],
      gear: 'Exclusive Gear',
      bearTrap: 'Limited damage value compared with top offensive heroes.',
      rally: 'Good',
      joiner: 'Good',
      pvp: 'Good',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'Medium',
      icon: '💚',
      image: null
    },
    {
      name: 'Alonso',
      generation: 2,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A ranged Marksman hero designed for strong offensive combat.',
      skills: [
        'Ranged Attack',
        'Critical Damage',
        'Marksman Support'
      ],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Marksman damage option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 3
    // =========================
    {
      name: 'Logan',
      generation: 3,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A durable Infantry hero built for frontline combat and defensive strength.',
      skills: ['Infantry Attack', 'Defense', 'Frontline Protection'],
      gear: 'Exclusive Gear',
      bearTrap: 'Useful Infantry option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Mia',
      generation: 3,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Rally Captain',
      description:
        'One of the most important Lancer heroes for rally-focused players, with strong long-term value.',
      skills: ['Lancer Attack', 'Rally Damage', 'Combat Enhancement'],
      gear: 'Exclusive Gear',
      bearTrap: 'Excellent Lancer rally captain, especially with developed Exclusive Gear.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'Very High priority',
      icon: '⚡',
      image: null
    },
    {
      name: 'Greg',
      generation: 3,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A ranged combat hero specializing in Marksman offensive performance.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Marksman choice.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 4
    // =========================
    {
      name: 'Ahmose',
      generation: 4,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A strong Infantry hero with excellent frontline and defensive combat performance.',
      skills: ['Infantry Power', 'Defense', 'Frontline Combat'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Infantry option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Reina',
      generation: 4,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A powerful Lancer hero with strong offensive utility and excellent event value.',
      skills: ['Lancer Damage', 'Combat Buff', 'Offensive Support'],
      gear: 'Exclusive Gear',
      bearTrap: 'Excellent Lancer option and useful for joiner formations.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'High priority',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Lynn',
      generation: 4,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A ranged Marksman hero offering strong offensive combat utility.',
      skills: ['Marksman Damage', 'Ranged Attack', 'Combat Support'],
      gear: 'Exclusive Gear',
      bearTrap: 'Excellent Marksman option for developing accounts.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'High priority',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 5
    // =========================
    {
      name: 'Hector',
      generation: 5,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Rally Captain',
      description:
        'A high-value Infantry hero with excellent rally performance and strong long-term usefulness.',
      skills: ['Infantry Attack', 'Rally Buff', 'Defensive Power'],
      gear: 'Exclusive Gear',
      bearTrap: 'Excellent Bear Trap Infantry captain and strong F2P investment.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Excellent',
      f2p: 'Very High priority',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Norah',
      generation: 5,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A powerful Lancer hero designed for offensive combat and rally performance.',
      skills: ['Lancer Attack', 'Damage Buff', 'Combat Support'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Lancer choice.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'High priority',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Gwen',
      generation: 5,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A ranged damage hero with strong Marksman combat performance.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Offensive Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Marksman damage option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 6
    // =========================
    {
      name: 'Wu Ming',
      generation: 6,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A later-generation Infantry hero focused on strong frontline combat.',
      skills: ['Infantry Attack', 'Defense', 'Combat Enhancement'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Infantry choice.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Renee',
      generation: 6,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A strong Lancer hero useful in combat, rallies and event formations.',
      skills: ['Lancer Attack', 'Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Lancer choice.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'High priority',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Wayne',
      generation: 6,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A Marksman hero focused on ranged offensive performance.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Offensive Support'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Marksman choice.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 7
    // =========================
    {
      name: 'Edith',
      generation: 7,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A Gen 7 Infantry hero built for stronger late-game frontline combat.',
      skills: ['Infantry Power', 'Defense', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Useful Infantry option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Gordon',
      generation: 7,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A Lancer combat hero with strong offensive potential.',
      skills: ['Lancer Attack', 'Combat Damage', 'Offensive Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Good Lancer option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Bradley',
      generation: 7,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A versatile Marksman hero with strong cross-generation value in combat and Bear Trap.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Combat Support'],
      gear: 'Exclusive Gear',
      bearTrap: 'Excellent Bear Trap and joiner value.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'High priority',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 8
    // =========================
    {
      name: 'Gatot',
      generation: 8,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A Gen 8 Infantry hero designed for powerful frontline combat.',
      skills: ['Infantry Attack', 'Defense', 'Frontline Power'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Infantry choice.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Sonya',
      generation: 8,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A powerful Lancer hero useful for offensive formations and events.',
      skills: ['Lancer Attack', 'Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Lancer option.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'High priority',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Hendrik',
      generation: 8,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A ranged Marksman hero built for late-game offensive combat.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Offensive Support'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Marksman option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 9
    // =========================
    {
      name: 'Magnus',
      generation: 9,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A powerful late-generation Infantry hero designed for frontline combat.',
      skills: ['Infantry Attack', 'Defense', 'Combat Enhancement'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Infantry option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Fred',
      generation: 9,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A Gen 9 Lancer hero focused on offensive combat performance.',
      skills: ['Lancer Attack', 'Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Lancer option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Xura',
      generation: 9,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A Gen 9 ranged hero specializing in Marksman combat.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Combat Support'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Marksman choice.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 10
    // =========================
    {
      name: 'Gregory',
      generation: 10,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A Gen 10 Infantry hero designed for strong frontline performance.',
      skills: ['Infantry Attack', 'Defense', 'Combat Power'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Infantry option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Freya',
      generation: 10,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A Gen 10 Lancer hero focused on offensive combat.',
      skills: ['Lancer Attack', 'Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Lancer option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Blanchette',
      generation: 10,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A Gen 10 Marksman hero providing ranged offensive power.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Offensive Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Marksman choice.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 11
    // =========================
    {
      name: 'Eleonora',
      generation: 11,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A Gen 11 Infantry hero designed for advanced combat.',
      skills: ['Infantry Attack', 'Defense', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Infantry option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Lloyd',
      generation: 11,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A Gen 11 Lancer hero focused on offensive combat and rally performance.',
      skills: ['Lancer Attack', 'Damage', 'Rally Support'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Lancer option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Rufus',
      generation: 11,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A powerful ranged hero with excellent offensive utility in later-generation content.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Excellent Marksman and joiner option.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'High priority',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 12
    // =========================
    {
      name: 'Hervor',
      generation: 12,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A Gen 12 Infantry hero for advanced frontline combat.',
      skills: ['Infantry Attack', 'Defense', 'Combat Enhancement'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Infantry option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Karol',
      generation: 12,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A strong Lancer hero with excellent offensive and event utility.',
      skills: ['Lancer Attack', 'Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Excellent Lancer choice.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'High priority',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Ligeia',
      generation: 12,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A Gen 12 ranged Marksman hero for advanced offensive content.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Offensive Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Marksman option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 13
    // =========================
    {
      name: 'Gisela',
      generation: 13,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A Gen 13 Infantry hero designed for advanced frontline combat.',
      skills: ['Infantry Attack', 'Defense', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Infantry option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Flora',
      generation: 13,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A Gen 13 Lancer hero focused on powerful offensive combat.',
      skills: ['Lancer Attack', 'Damage', 'Combat Enhancement'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Lancer option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🌿',
      image: null
    },
    {
      name: 'Vulcanus',
      generation: 13,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A Gen 13 Marksman hero specializing in ranged offensive performance.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Marksman option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 14
    // =========================
    {
      name: 'Elif',
      generation: 14,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A Gen 14 Infantry hero designed for advanced frontline combat.',
      skills: ['Infantry Attack', 'Defense', 'Combat Power'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Infantry option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Dominic',
      generation: 14,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Rally Captain',
      description:
        'A high-value Lancer hero with excellent rally and Bear Trap performance.',
      skills: ['Lancer Attack', 'Rally Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Excellent Lancer rally captain and top damage option.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'High priority',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Cara',
      generation: 14,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A Gen 14 Marksman hero designed for advanced ranged combat.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Offensive Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Marksman option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 15
    // =========================
    {
      name: 'Hank',
      generation: 15,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A Gen 15 Infantry hero designed for advanced late-game combat.',
      skills: ['Infantry Attack', 'Defense', 'Combat Enhancement'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong late-generation Infantry option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Estrella',
      generation: 15,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A Gen 15 Lancer hero for high-level offensive combat.',
      skills: ['Lancer Attack', 'Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong Lancer option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Viveca',
      generation: 15,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A Gen 15 Marksman hero built for powerful late-game ranged damage.',
      skills: ['Marksman Attack', 'Ranged Damage', 'Combat Buff'],
      gear: 'Exclusive Gear',
      bearTrap: 'Strong late-game Marksman option.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Good',
      f2p: 'Medium',
      icon: '🏹',
      image: null
    },

    // =========================
    // GENERATION 16
    // =========================
    {
      name: 'Seigel',
      generation: 16,
      rarity: '5★',
      troopType: 'Infantry',
      role: 'Combat · Infantry',
      description:
        'A Gen 16 Infantry hero designed for high-level frontline combat.',
      skills: [
        'Spike Guard',
        'Spear of the Moon',
        'Cursed Protection'
      ],
      gear: 'Blacklight Halberd',
      bearTrap: 'Advanced Infantry option for current-generation content.',
      rally: 'Excellent',
      joiner: 'Good',
      pvp: 'Excellent',
      garrison: 'Excellent',
      exploration: 'Good',
      f2p: 'Current-generation investment',
      icon: '🛡️',
      image: null
    },
    {
      name: 'Ursar',
      generation: 16,
      rarity: '5★',
      troopType: 'Lancer',
      role: 'Combat · Lancer',
      description:
        'A Gen 16 Lancer hero built for advanced offensive combat and current-generation content.',
      skills: [
        'Lancer Combat',
        'Advanced Assault',
        'Battle Enhancement'
      ],
      gear: 'Exclusive Gear',
      bearTrap: 'Current-generation Lancer option.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'Current-generation investment',
      icon: '⚔️',
      image: null
    },
    {
      name: 'Aisling',
      generation: 16,
      rarity: '5★',
      troopType: 'Marksman',
      role: 'Combat · Marksman',
      description:
        'A Gen 16 Marksman hero designed for current-generation ranged combat.',
      skills: [
        'Wild Growth',
        'Fruits of Plenty',
        'Bladestones'
      ],
      gear: 'Cord of Destiny',
      bearTrap: 'Current-generation Marksman option.',
      rally: 'Excellent',
      joiner: 'Excellent',
      pvp: 'Excellent',
      garrison: 'Good',
      exploration: 'Excellent',
      f2p: 'Current-generation investment',
      icon: '🏹',
      image: null
    }
  ]
}