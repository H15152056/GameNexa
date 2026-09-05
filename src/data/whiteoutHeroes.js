// GameNexa Whiteout Survival hero database.
// Roster: Gen 1–17 (current roster researched September 2026).
// Portraits are loaded from the Whiteout Survival Wiki CDN; the site should
// display a rights notice because the game artwork remains the property of
// its respective rights holders.

const IMG = {
  Smith: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/smith.png',
  Eugene: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/eugene.png',
  Charlie: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/charlie.png',
  Cloris: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/cloris.png',
  Sergey: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/sergey.png',
  Jessie: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/jessie.png',
  Patrick: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/patrick.png',
  'Lumak Bokan': 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/05/3.png',
  'Ling Xue': 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/12/%E5%87%8C%E9%9B%AA350.jpg',
  Gina: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/Gina.png',
  Bahiti: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/bahiti.png',
  Jasser: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/10/1.jpg',
  'Seo-yoon': 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/10/2.jpg',
  Natalia: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/natalia.png',
  Jeronimo: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/jeronimo.png',
  Molly: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/molly.png',
  Zinman: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/zinman.png',
  Flint: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/flint.png',
  Philly: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/philly.png',
  Alonso: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/alonso.png',
  Logan: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/logan.png',
  Mia: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/mia.png',
  Greg: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/05/greg.png',
  Ahmose: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/09/ahmos.png',
  Reina: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/09/1690429616516_7.jpg',
  Lynn: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/09/1690429616507_5.jpg',
  Hector: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/09/1690429616489_3.jpg',
  Norah: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/09/1690429616472_1.jpg',
  Gwen: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/09/1690429616480_2.jpg',
  'Wu Ming': 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/11/wuming.jpg',
  Renee: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/11/rene.jpg',
  Wayne: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/11/wayne.jpg',
  Edith: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/03/20240222_2.jpg',
  Gordon: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/03/20240222_1.jpg',
  Bradley: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/03/20240222_3.jpg',
  Gatot: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/07/5.jpg',
  Sonya: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/07/6.jpg',
  Hendrik: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/07/7.jpg',
  Magnus: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/08/magnus.jpg',
  Fred: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/08/fred.jpg',
  Xura: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/08/xura.jpg',
  Gregory: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/12/gregory350.jpg',
  Freya: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/12/freya350.jpg',
  Blanchette: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/12/blanchette350.jpg',
  Eleonora: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/03/eleonora.jpg',
  Lloyd: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/03/Lloyd.jpg',
  Rufus: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/03/rufus.jpg',
  Hervor: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/20250519%E8%8B%B1%E9%9B%84%E5%A4%B4%E5%83%8FHervor-1.jpg',
  Karol: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/20250519%E8%8B%B1%E9%9B%84%E5%A4%B4%E5%83%8Fkarol-1.jpg',
  Ligeia: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/20250519%E8%8B%B1%E9%9B%84%E5%A4%B4%E5%83%8FLigeia-1.jpg',
  Gisela: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/08/20250519%E8%8B%B1%E9%9B%84%E5%A4%B4%E5%83%8Fgisela.jpg',
  Flora: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/08/20250519%E8%8B%B1%E9%9B%84%E5%A4%B4%E5%83%8FFlora.jpg',
  Vulcanus: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/08/20250519%E8%8B%B1%E9%9B%84%E5%A4%B4%E5%83%8Fvulcanus.jpg',
  Elif: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/01/%E8%89%BE%E4%B8%BD%E8%8A%99.png',
  Dominic: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/01/%E5%A4%9A%E7%B1%B3%E5%B0%BC%E5%85%8B.png',
  Cara: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/01/%E5%8D%A1%E6%8B%89.png',
  Hank: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/01/%E6%B1%89%E5%85%8B.png',
  Estrella: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/01/%E8%89%BE%E6%96%AF%E9%BB%9B%E6%8B%89%EF%BC%88%E7%94%BB%E5%AE%B6%EF%BC%89.png',
  Viveca: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/01/%E7%BB%B4%E8%96%87%E5%8D%A1.png',
  Seigel: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/03/hero_headpic_50059.png',
  Ursar: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/03/hero_headpic_50060.png',
  Aisling: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/03/hero_headpic_50061.png',
  Aiden: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/07/hero_headpic_50062.png',
  Bertha: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/07/hero_headpic_50063.png',
  Eleanor: 'https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2026/07/hero_headpic_50064.png',
}

const roles = {
  Smith: ['Economy', 'Iron gathering'], Eugene: ['Economy', 'Wood gathering'], Charlie: ['Economy', 'Growth'], Cloris: ['Economy', 'Growth'],
  Sergey: ['Tank', 'Defense / garrison'], Jessie: ['Rally Joiner', 'Damage buff'], Patrick: ['Healer', 'Defense / garrison'],
  'Lumak Bokan': ['Support', 'Hunting / defense'], 'Ling Xue': ['Support', 'Training / defense'], Gina: ['DPS', 'Arena / splash'], Bahiti: ['DPS', 'Early rally / Bear'],
  Jasser: ['Rally Joiner', 'Damage buff'], 'Seo-yoon': ['Rally Joiner', 'Attack buff'], Natalia: ['DPS / Tank', 'Arena / rally'], Jeronimo: ['DPS / Rally Lead', 'Attack rally / Bear'], Molly: ['DPS / AoE', 'Arena / rally'], Zinman: ['Support', 'Construction / rally'],
  Flint: ['Tank / DPS', 'Rally / Bear'], Philly: ['Healer / Support', 'Defense / garrison'], Alonso: ['DPS / Rally Lead', 'Bear / attack rally'], Logan: ['Tank / Defense', 'Garrison'], Mia: ['DPS / Rally Lead', 'Bear / attack rally'], Greg: ['DPS / Control', 'Arena / defense'],
  Ahmose: ['Tank / Support', 'Garrison'], Reina: ['DPS / Rally Joiner', 'Rally / Arena'], Lynn: ['Support / Control', 'Arena / defense'], Hector: ['Tank / Rally Lead', 'Bear / frontline'], Norah: ['DPS / Control', 'Arena / rally'], Gwen: ['DPS', 'Rally / Bear / Arena'],
  'Wu Ming': ['Tank / DPS', 'Arena / rally'], Renee: ['DPS / Support', 'Rally / Arena'], Wayne: ['DPS / Support', 'Marksman-heavy rallies'], Edith: ['Tank / Support', 'Garrison / defense'], Gordon: ['DPS / Control', 'Arena'], Bradley: ['DPS / Rally Lead', 'Bear / rally / Arena'],
  Gatot: ['Tank / DPS', 'Arena / rally'], Sonya: ['DPS / Control', 'Arena / rally'], Hendrik: ['DPS / Support', 'Arena / rally'], Magnus: ['Tank / DPS', 'Arena / rally / Bear joiner'], Fred: ['Tank / DPS', 'Arena / rally'], Xura: ['Healer / Support', 'Arena / garrison'],
  Gregory: ['Tank / DPS', 'Arena / rally'], Freya: ['DPS / Control', 'Arena / rally'], Blanchette: ['DPS / AoE', 'Bear / rally / Arena'], Eleonora: ['DPS / Rally Lead', 'Bear / attack rally / Arena'], Lloyd: ['Support / Defense', 'Garrison'], Rufus: ['DPS / Rally Lead', 'Bear / attack rally / Arena'],
  Hervor: ['Tank / Rally Lead', 'Bear / rally / Arena'], Karol: ['DPS / Support', 'Rally / Arena'], Ligeia: ['DPS / Debuff', 'Bear / rally / Arena'], Gisela: ['Tank / Support', 'Rally / defense'], Flora: ['DPS / Support', 'Rally / Arena'], Vulcanus: ['DPS / Rally Lead', 'Bear / rally / Arena'],
  Elif: ['Tank / Rally Lead', 'Rally / Arena'], Dominic: ['DPS / Rally Lead', 'Rally / Arena'], Cara: ['DPS', 'Rally / Arena'], Hank: ['Tank / DPS', 'Bear / Arena'], Estrella: ['DPS / Support', 'Rally / Arena'], Viveca: ['DPS / Rally Lead', 'Bear / rally / Arena'],
  Seigel: ['Tank / Garrison', 'Defense / Arena'], Ursar: ['DPS / Support', 'Rally / Arena'], Aisling: ['DPS / Rally Lead', 'Bear / rally / Arena'], Aiden: ['Tank / DPS', 'Arena / defense'], Bertha: ['Healer / Support', 'Arena / rally joiner'], Eleanor: ['DPS / Rally Lead', 'Bear / attack rally / Arena'],
}

const tiers = {
  Aiden: 'A+', Bertha: 'A+', Eleanor: 'S', Aisling: 'S', Seigel: 'S', Ursar: 'A+', Estrella: 'S+', Hank: 'S', Viveca: 'A+',
  Cara: 'S', Dominic: 'S+', Elif: 'S+', Flora: 'S', Gisela: 'A+', Vulcanus: 'S+', Hervor: 'S', Karol: 'S+', Ligeia: 'A', Eleonora: 'S+', Lloyd: 'A', Rufus: 'A+', Blanchette: 'S+', Freya: 'A+', Gregory: 'A', Fred: 'S', Magnus: 'S+', Xura: 'S', Gatot: 'S', Hendrik: 'A+', Sonya: 'S', Bradley: 'S', Edith: 'A', Gordon: 'A', Renee: 'S', Wayne: 'A+', 'Wu Ming': 'A', Gwen: 'A', Hector: 'S', Norah: 'S', Ahmose: 'A', Lynn: 'A+', Reina: 'A', Greg: 'A', Logan: 'B+', Mia: 'A', Alonso: 'A', Flint: 'S', Philly: 'A+', Bahiti: 'B+', Charlie: 'C', Cloris: 'C', Eugene: 'C', Gina: 'B', Jasser: 'B', Jeronimo: 'S+', Jessie: 'B+', 'Ling Xue': 'B', 'Lumak Bokan': 'B', Molly: 'S', Natalia: 'A+', Patrick: 'B', 'Seo-yoon': 'B', Sergey: 'B+', Smith: 'C', Zinman: 'B+',
}

const rarity = {
  Smith: 'Rare', Eugene: 'Rare', Charlie: 'Rare', Cloris: 'Rare', Sergey: 'Epic', Jessie: 'Epic', Patrick: 'Epic', 'Lumak Bokan': 'Epic', 'Ling Xue': 'Epic', Gina: 'Epic', Bahiti: 'Epic', Jasser: 'Epic', 'Seo-yoon': 'Epic',
  Jeronimo: 'Mythic', Molly: 'Mythic', Natalia: 'Mythic', Zinman: 'Mythic',
}

const generations = {
  1: ['Smith','Eugene','Charlie','Cloris','Sergey','Jessie','Patrick','Lumak Bokan','Ling Xue','Gina','Bahiti','Jasser','Seo-yoon','Natalia','Jeronimo','Molly','Zinman'],
  2: ['Flint','Philly','Alonso'], 3: ['Logan','Mia','Greg'], 4: ['Ahmose','Reina','Lynn'], 5: ['Hector','Norah','Gwen'], 6: ['Renee','Wayne','Wu Ming'], 7: ['Bradley','Edith','Gordon'], 8: ['Gatot','Sonya','Hendrik'], 9: ['Fred','Magnus','Xura'], 10: ['Gregory','Freya','Blanchette'], 11: ['Eleonora','Lloyd','Rufus'], 12: ['Hervor','Karol','Ligeia'], 13: ['Gisela','Flora','Vulcanus'], 14: ['Elif','Dominic','Cara'], 15: ['Hank','Estrella','Viveca'], 16: ['Seigel','Ursar','Aisling'], 17: ['Aiden','Bertha','Eleanor'],
}

const classByName = {
  Smith:'Infantry', Eugene:'Infantry', Charlie:'Lancer', Cloris:'Marksman', Sergey:'Infantry', Jessie:'Lancer', Patrick:'Lancer', 'Lumak Bokan':'Lancer', 'Ling Xue':'Lancer', Gina:'Marksman', Bahiti:'Marksman', Jasser:'Marksman', 'Seo-yoon':'Marksman', Natalia:'Infantry', Jeronimo:'Infantry', Molly:'Lancer', Zinman:'Marksman',
  Flint:'Infantry', Philly:'Lancer', Alonso:'Marksman', Logan:'Infantry', Mia:'Lancer', Greg:'Marksman', Ahmose:'Infantry', Reina:'Lancer', Lynn:'Marksman', Hector:'Infantry', Norah:'Lancer', Gwen:'Marksman', 'Wu Ming':'Infantry', Renee:'Lancer', Wayne:'Marksman', Edith:'Infantry', Gordon:'Lancer', Bradley:'Marksman', Gatot:'Infantry', Sonya:'Lancer', Hendrik:'Marksman', Magnus:'Infantry', Fred:'Lancer', Xura:'Marksman', Gregory:'Infantry', Freya:'Lancer', Blanchette:'Marksman', Eleonora:'Infantry', Lloyd:'Lancer', Rufus:'Marksman', Hervor:'Infantry', Karol:'Lancer', Ligeia:'Marksman', Gisela:'Infantry', Flora:'Lancer', Vulcanus:'Marksman', Elif:'Infantry', Dominic:'Lancer', Cara:'Marksman', Hank:'Infantry', Estrella:'Lancer', Viveca:'Marksman', Seigel:'Infantry', Ursar:'Lancer', Aisling:'Marksman', Aiden:'Infantry', Bertha:'Lancer', Eleanor:'Marksman',
}

const healerNames = new Set(['Philly', 'Xura', 'Bertha'])
const rallyJoinerNames = new Set(['Jessie', 'Jasser', 'Jeronimo', 'Seo-yoon', 'Reina', 'Magnus', 'Rufus', 'Bradley', 'Viveca', 'Eleanor'])

const heroNotes = {
  Philly: 'Primary early healer: strong for defensive rallies, garrison and sustain.',
  Xura: 'Arena sustain specialist: team healing plus damage reduction makes her a support carry.',
  Bertha: 'Modern support/healer: team healing, Attack boost and a useful Squad Lethality joiner skill.',
  Jessie: 'Long-term rally joiner. Her first expedition skill is the key value when joining another rally.',
  Jasser: 'Long-term offensive rally joiner whose first expedition skill improves troop damage.',
  Jeronimo: 'Premium early infantry and rally option; also valuable as a rally joiner when not leading.',
  Molly: 'Excellent early free carry for Arena and a useful early Lancer rally option.',
  Alonso: 'Long-lived Marksman rally/Bear option and one of the strongest early investment targets.',
  Bradley: 'Marksman damage specialist with strong Bear/rally and Arena value.',
  Blanchette: 'High-impact AoE Marksman and a major free power spike around Gen 10.',
  Magnus: 'Aggressive Infantry frontline with strong Arena value and a useful rally-joiner buff.',
  Eleanor: 'High-end Marksman damage/rally option; strongest Gen 17 investment for spenders according to current tier guidance.',
}

const buildRecommendation = (name, role) => {
  if (healerNames.has(name)) return 'Prioritize support/healing skills first; pair with a durable frontline and a main DPS.'
  if (role.includes('Tank')) return 'Pair with a strong damage dealer and a support/healer; ideal for the frontline when the mode needs durability.'
  if (role.includes('Rally Lead')) return 'Best used with complementary Infantry + Lancer + Marksman roles; prioritize all-troop buffs and damage amplification.'
  if (role.includes('DPS')) return 'Pair with a frontline/tank and a support that increases Attack, Lethality, or damage dealt.'
  if (role.includes('Rally Joiner')) return 'Use as the first hero when joining another rally when their first expedition skill is the desired buff.'
  return 'Use according to the mode: economy heroes for progression, defensive heroes for garrison, and combat heroes for rallies/Arena.'
}

export const whiteoutHeroes = Object.entries(generations).flatMap(([generation, names]) =>
  names.map((name) => {
    const [role, bestFor] = roles[name] || ['Combat', 'General']
    return {
      name,
      generation: Number(generation),
      troopType: classByName[name],
      rarity: rarity[name] || 'Mythic',
      quality: (rarity[name] || 'Mythic') === 'Mythic' ? 'SSR' : 'SR',
      tier: tiers[name] || 'B',
      role,
      bestFor,
      image: IMG[name] || '',
      healer: healerNames.has(name),
      rallyJoiner: rallyJoinerNames.has(name),
      notes: heroNotes[name] || `${name} is a ${role.toLowerCase()} best suited to ${bestFor.toLowerCase()}.`,
      synergy: buildRecommendation(name, role),
      ratings: { tier: tiers[name] || 'B' },
    }
  })
)

export const whiteoutHeroMeta = {
  rosterCount: whiteoutHeroes.length,
  healerNames: [...healerNames],
  rallyJoinerNames: [...rallyJoinerNames],
  classes: ['Infantry', 'Lancer', 'Marksman'],
  generations: Object.keys(generations).map(Number),
}
