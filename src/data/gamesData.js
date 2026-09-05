import genshinBanner from '../assets/banners/genshin-original-banner.png'
import whiteoutBanner from '../assets/banners/whiteout-original-banner.png'
import { whiteoutHeroes } from './whiteoutHeroes'
import { genshinCharacters } from './genshinCharacters'

export const gamesData = {
  genshin: {
    slug: 'genshin',
    name: 'Genshin Impact',
    category: 'Action RPG',
    description:
      'Characters, builds and practical guides.',
    icon: '⚔️',
    featured: true,

    image:
      genshinBanner,

    highlights: [
      { value: genshinCharacters.length, label: 'characters' },
      { value: '7', label: 'elements' },
      { value: '5', label: 'weapon types' },
    ],


    characters: [
      {
        name: 'Arlecchino',
        role: 'Pyro . Main DPS',
        icon: '🔥'
      },
      {
        name: 'Zhongli',
        role: 'Geo . Support',
        icon: '🛡️'
      },
      {
        name: 'Furina',
        role: 'Hydro . Support',
        icon: '💧'
      },
      {
        name: 'Nefer',
        role: 'Dendro . DPS',
        icon: '🌿'
      }
    ],

    guides: [
      {
        icon: '⚔️',
        title: 'Character Builds',
        desc: 'Weapons, artifacts and talents.',
        content: [
          {
            heading: 'Choose the Character Role First',
            paragraphs: [
              'Before building a character, decide what role you want them to perform. Main DPS characters usually need strong offensive stats, while supports often need Energy Recharge, utility or survivability.',
              'Do not automatically copy another player’s build without checking how the character fits your own team.'
            ]
          },
          {
            heading: 'Weapons',
            paragraphs: [
              'Choose a weapon that improves the character’s main purpose. Damage dealers generally benefit from offensive stats, while support characters may prefer Energy Recharge or other utility.',
              'For free-to-play players, a well-refined craftable or event weapon can often be a better practical choice than chasing an expensive signature weapon.'
            ]
          },
          {
            heading: 'Artifacts',
            paragraphs: [
              'Artifact sets should support the character’s role and team. Prioritize useful main stats before worrying about perfect substats.',
              'For many damage characters, useful priorities include Crit Rate, Crit DMG and the appropriate elemental or physical damage bonus, but the exact balance depends on the character.'
            ]
          },
          {
            heading: 'Talents and Leveling',
            paragraphs: [
              'Do not spend every resource equally. Upgrade the talents that the character actually uses most often.',
              'Level important weapons and characters first, then work toward better artifacts as your account becomes stronger.'
            ]
          }
        ]
      },

      {
        icon: '👥',
        title: 'Team Compositions',
        desc: 'Build powerful teams for your characters.',
        content: [
          {
            heading: 'Build Around Synergy',
            paragraphs: [
              'A strong Genshin team is usually built around a clear damage plan rather than four individually powerful characters.',
              'Think about elemental reactions, field time, energy needs, buffs, healing and survivability before selecting the final four members.'
            ]
          },
          {
            heading: 'Main DPS and Supports',
            paragraphs: [
              'A typical team can contain a main damage dealer, one or more supports, a sub-DPS and a healer or shielder.',
              'Some teams use two characters with the same element to improve energy generation or activate an Elemental Resonance bonus.'
            ]
          },
          {
            heading: 'Energy Management',
            paragraphs: [
              'Many powerful abilities require Elemental Energy. Use Elemental Skills efficiently and collect particles with the character who needs them.',
              'If a character cannot consistently use their Burst when needed, consider more Energy Recharge or better team particle generation.'
            ]
          },
          {
            heading: 'Rotation',
            paragraphs: [
              'A rotation is the order in which you use your characters’ abilities. Good rotations allow buffs, debuffs and reactions to overlap.',
              'Practice the rotation against easy enemies first so you can perform it naturally during difficult fights.'
            ]
          }
        ]
      },

      {
        icon: '🗺️',
        title: 'Exploration',
        desc: 'Regions, quests, puzzles and collectibles.',
        content: [
          {
            heading: 'Explore Methodically',
            paragraphs: [
              'When entering a new region, activate Teleport Waypoints and Statues of The Seven as soon as possible. This makes future exploration much faster.',
              'Use the in-game map and mark locations that contain puzzles, resources or areas you want to revisit.'
            ]
          },
          {
            heading: 'Use Elemental Abilities',
            paragraphs: [
              'Many puzzles and exploration mechanics require specific elements or character abilities.',
              'Keeping several different elements available in your exploration team can save time when you encounter environmental puzzles.'
            ]
          },
          {
            heading: 'Collect Resources',
            paragraphs: [
              'Pick up local specialties, ore, enemy materials and other useful resources while exploring. Character ascension can require large quantities later.',
              'If you frequently use a character, learn where their important materials come from and collect them during normal exploration instead of farming everything at once.'
            ]
          },
          {
            heading: 'Do Not Rush',
            paragraphs: [
              'Genshin Impact rewards exploration. Hidden chests, quests and puzzles are often found away from the main objective.',
              'Take screenshots or place map markers for locations that you want to investigate later.'
            ]
          }
        ]
      },

      {
        icon: '💎',
        title: 'Primogems',
        desc: 'Learn where to get rewards and Primogems.',
        content: [
          {
            heading: 'Daily Commissions',
            paragraphs: [
              'Daily activities are one of the most consistent ways for regular players to build Primogem income over time.',
              'Make completing daily objectives part of your normal routine if you are saving for a future character.'
            ]
          },
          {
            heading: 'Quests and Exploration',
            paragraphs: [
              'Archon Quests, Story Quests, World Quests, puzzles, chests and exploration objectives can provide rewards.',
              'New regions can be especially valuable because exploration systems often provide multiple sources of rewards.'
            ]
          },
          {
            heading: 'Events',
            paragraphs: [
              'Limited-time events frequently provide Primogems alongside other useful rewards.',
              'Check the event menu regularly and complete the available objectives before their deadlines.'
            ]
          },
          {
            heading: 'Save Efficiently',
            paragraphs: [
              'If you are saving for a specific character, avoid spending Primogems impulsively on banners that you do not actually want.',
              'Set a target and keep track of your wishes so you know how much progress you have made toward your next goal.'
            ]
          }
        ]
      }
    ]
  },

  whiteoutSurvival: {
    slug: 'whiteout-survival',
    name: 'Whiteout Survival',
    category: 'Strategy Survival',
    description:
      'Whiteout Survival heroes, team strategy and practical guides.',
    icon: '❄️',
    featured: true,

    image:
      whiteoutBanner,

    highlights: [
      { value: whiteoutHeroes.length, label: 'heroes' },
      { value: '17', label: 'generations' },
      { value: '3', label: 'troop classes' },
    ],

    // ========================================================
    // WHITEOUT SURVIVAL HERO DATABASE
    // Source: whiteoutHeroes.js
    // Generations 1–17
    // ========================================================
    characters: whiteoutHeroes,

    guides: [
      {
        icon: '🔥',
        title: 'Furnace Progression',
        desc: 'Upgrade your Furnace and unlock stronger progression.',
        content: [
          {
            heading: 'Prioritize the Furnace',
            paragraphs: [
              'The Furnace is the central progression building in Whiteout Survival. Increasing its level unlocks additional buildings, research and progression opportunities.',
              'Before starting a Furnace upgrade, check the required buildings and resources so you can complete the upgrade efficiently.'
            ]
          },
          {
            heading: 'Prepare Resources',
            paragraphs: [
              'Large upgrades can require significant amounts of resources.',
              'Use resource items carefully and collect resources from your city, alliance activities and other available sources before starting important upgrades.'
            ]
          },
          {
            heading: 'Do Not Ignore Research',
            paragraphs: [
              'Research provides long-term improvements to your city, economy and military.',
              'Keep your research queue active whenever possible so your account continues progressing while you work on other upgrades.'
            ]
          }
        ]
      },

      {
        icon: '⚔️',
        title: 'Troops & Combat',
        desc: 'Learn troop types, counters and combat basics.',
        content: [
          {
            heading: 'Three Main Troop Types',
            paragraphs: [
              'Whiteout Survival uses Infantry, Lancers and Marksmen as its primary troop types.',
              'Each troop type has strengths and weaknesses, so building a balanced army can be useful when preparing for different situations.'
            ]
          },
          {
            heading: 'Troop Counters',
            paragraphs: [
              'Infantry generally counters Marksmen, Marksmen counters Lancers, and Lancers counters Infantry.',
              'Use the appropriate troop type when you know what enemy composition you will face.'
            ]
          },
          {
            heading: 'Upgrade Troop Tiers',
            paragraphs: [
              'Higher-tier troops provide stronger combat performance and are important for later progression.',
              'Focus on unlocking and training stronger troops while keeping enough lower-tier troops available for useful secondary tasks when needed.'
            ]
          }
        ]
      },

      {
        icon: '👥',
        title: 'Alliance Guide',
        desc: 'Rallies, assistance, research and alliance activities.',
        content: [
          {
            heading: 'Alliance Assistance',
            paragraphs: [
              'Alliance assistance can reduce the time required for building and research upgrades.',
              'Check alliance requests regularly and help other members whenever possible.'
            ]
          },
          {
            heading: 'Alliance Research',
            paragraphs: [
              'Alliance research provides benefits to members and improves the overall strength of the alliance.',
              'Active participation helps the alliance unlock stronger bonuses and progress more efficiently.'
            ]
          },
          {
            heading: 'Rallies',
            paragraphs: [
              'Rallies allow alliance members to combine their armies against powerful targets.',
              'Follow rally instructions and send the requested heroes and troops instead of joining randomly.'
            ]
          }
        ]
      },

      {
        icon: '⛏️',
        title: 'Resource Management',
        desc: 'Gather resources and improve your economy.',
        content: [
          {
            heading: 'Gather Regularly',
            paragraphs: [
              'Regular gathering is important for maintaining a steady supply of resources.',
              'Send troops to suitable gathering locations whenever your marches are available.'
            ]
          },
          {
            heading: 'Protect Your Resources',
            paragraphs: [
              'Avoid keeping unnecessary amounts of exposed resources when you are not actively upgrading something.',
              'Plan major upgrades in advance so resources are converted into permanent progression instead of sitting unused.'
            ]
          },
          {
            heading: 'Use Resource Items Wisely',
            paragraphs: [
              'Resource items stored in your inventory can be useful when you need to complete an important upgrade.',
              'Saving some resource items for major progression requirements can prevent unnecessary shortages.'
            ]
          }
        ]
      }
    ]
  },

}