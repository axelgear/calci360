/**
 * Mass Units (base: kilogram)
 * All values represent conversion factor TO kilograms
 */

export const mass = {
  /* SI Metric */
  yoctogram: 1e-27,
  zeptogram: 1e-24,
  attogram: 1e-21,
  femtogram: 1e-18,
  picogram: 1e-15,
  nanogram: 1e-12,
  microgram: 1e-9,
  milligram: 1e-6,
  centigram: 1e-5,
  decigram: 1e-4,
  gram: 0.001,
  dekagram: 0.01,
  hectogram: 0.1,
  kilogram: 1,
  'metric-ton': 1000, /* also called tonne */
  megagram: 1000, /* same as metric ton */
  gigagram: 1e6, /* kiloton */
  teragram: 1e9, /* megaton */

  /* Imperial / US Customary (Avoirdupois) */
  grain: 6.47989e-5, /* 1/7000 pound */
  dram: 0.00177185, /* 1/256 pound */
  ounce: 0.0283495, /* 1/16 pound */
  pound: 0.45359237, /* exactly by definition */
  stone: 6.35029318, /* 14 pounds (UK) */
  quarter: 12.70058636, /* 28 pounds (UK) */
  hundredweight: 45.359237, /* 100 pounds (US short) */
  'hundredweight-uk': 50.80234544, /* 112 pounds (UK long) */
  'short-ton': 907.18474, /* 2000 pounds */
  'long-ton': 1016.0469088, /* 2240 pounds */

  /* Troy (precious metals) */
  'troy-grain': 6.47989e-5, /* same as avoirdupois grain */
  'troy-pennyweight': 0.00155517384, /* 24 grains */
  'troy-ounce': 0.0311034768, /* 480 grains */
  'troy-pound': 0.3732417216, /* 12 troy ounces */

  /* Apothecary (pharmacy, historical) */
  'apothecary-scruple': 0.0012959782, /* 20 grains */
  'apothecary-dram': 0.0038879346, /* 60 grains */
  'apothecary-ounce': 0.0311034768, /* same as troy ounce */
  'apothecary-pound': 0.3732417216, /* same as troy pound */

  /* Gems / Jewelry */
  carat: 0.0002, /* exactly, for gemstones */
  'metric-carat': 0.0002, /* same */
  point: 0.000002, /* 1/100 carat */
  momme: 0.00375, /* Japanese pearl unit */

  /* Atomic / Physics */
  'atomic-mass-unit': 1.66053906660e-27, /* unified atomic mass unit (u or Da) */
  dalton: 1.66053906660e-27, /* same as amu */
  'electron-mass': 9.1093837015e-31,
  'proton-mass': 1.67262192369e-27,
  'neutron-mass': 1.67492749804e-27,
  'planck-mass': 2.176434e-8,

  /* Engineering / Industry */
  slug: 14.593903, /* mass that accelerates 1 ft/s² under 1 lbf */
  'pound-mass': 0.45359237, /* same as pound */
  'kip': 453.59237, /* 1000 pounds */

  /* Historical / Regional */
  'chinese-liang': 0.05, /* tael */
  'chinese-jin': 0.5, /* catty */
  'chinese-dan': 50, /* picul */
  'japanese-momme': 0.00375,
  'japanese-kan': 3.75,
  'indian-tola': 0.0116638, /* 11.66 grams */
  'indian-seer': 0.9331, /* approximately */
  'indian-maund': 37.324, /* 40 seers */
  drachma: 0.00388793, /* Greek, same as apothecary dram */
  mina: 0.571, /* ancient Greek */
  talent: 25.86, /* ancient Greek, 60 minas */
  shekel: 0.0114, /* biblical */

  /* Food / Cooking (informal) */
  'stick-butter': 0.1134, /* US butter stick, 1/4 pound */

  /* Solar / Astronomical */
  'solar-mass': 1.98892e30, /* M☉ */
  'earth-mass': 5.9722e24, /* M⊕ */
  'lunar-mass': 7.342e22, /* Moon */
  'jupiter-mass': 1.8982e27, /* M♃ */
} as const

export type MassUnit = keyof typeof mass

