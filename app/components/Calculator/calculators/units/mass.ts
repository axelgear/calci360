/**
 * Mass Unit Definitions
 * Base unit: kilogram (kg)
 * All values represent conversion factor TO kilograms
 */

import type { UnitOption } from './types'

/* ========== RAW CONVERSION FACTORS ========== */
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
  'metric-ton': 1000,
  megagram: 1000,
  gigagram: 1e6,
  teragram: 1e9,

  /* Imperial / US Customary (Avoirdupois) */
  grain: 6.47989e-5,
  dram: 0.00177185,
  ounce: 0.0283495,
  pound: 0.45359237,
  stone: 6.35029318,
  quarter: 12.70058636,
  hundredweight: 45.359237,
  'hundredweight-uk': 50.80234544,
  'short-ton': 907.18474,
  'long-ton': 1016.0469088,

  /* Troy (precious metals) */
  'troy-grain': 6.47989e-5,
  'troy-pennyweight': 0.00155517384,
  'troy-ounce': 0.0311034768,
  'troy-pound': 0.3732417216,

  /* Apothecary (pharmacy, historical) */
  'apothecary-scruple': 0.0012959782,
  'apothecary-dram': 0.0038879346,
  'apothecary-ounce': 0.0311034768,
  'apothecary-pound': 0.3732417216,

  /* Gems / Jewelry */
  carat: 0.0002,
  'metric-carat': 0.0002,
  point: 0.000002,
  momme: 0.00375,

  /* Atomic / Physics */
  'atomic-mass-unit': 1.66053906660e-27,
  dalton: 1.66053906660e-27,
  'electron-mass': 9.1093837015e-31,
  'proton-mass': 1.67262192369e-27,
  'neutron-mass': 1.67492749804e-27,
  'planck-mass': 2.176434e-8,

  /* Engineering / Industry */
  slug: 14.593903,
  'pound-mass': 0.45359237,
  'kip': 453.59237,

  /* Historical / Regional */
  'chinese-liang': 0.05,
  'chinese-jin': 0.5,
  'chinese-dan': 50,
  'japanese-momme': 0.00375,
  'japanese-kan': 3.75,
  'indian-tola': 0.0116638,
  'indian-seer': 0.9331,
  'indian-maund': 37.324,
  drachma: 0.00388793,
  mina: 0.571,
  talent: 25.86,
  shekel: 0.0114,

  /* Food / Cooking (informal) */
  'stick-butter': 0.1134,

  /* Solar / Astronomical */
  'solar-mass': 1.98892e30,
  'earth-mass': 5.9722e24,
  'lunar-mass': 7.342e22,
  'jupiter-mass': 1.8982e27,
} as const

export type MassUnit = keyof typeof mass

/* ========== UNIT OPTION ARRAYS ========== */
const M = mass

/** Common mass units */
export const massUnitsCommon: UnitOption[] = [
  { id: 'milligram', name: 'Milligram', symbol: 'mg', toBase: M.milligram },
  { id: 'gram', name: 'Gram', symbol: 'g', toBase: M.gram },
  { id: 'kilogram', name: 'Kilogram', symbol: 'kg', toBase: M.kilogram },
  { id: 'metric-ton', name: 'Metric Ton', symbol: 't', toBase: M['metric-ton'] },
  { id: 'ounce', name: 'Ounce', symbol: 'oz', toBase: M.ounce },
  { id: 'pound', name: 'Pound', symbol: 'lb', toBase: M.pound },
  { id: 'stone', name: 'Stone', symbol: 'st', toBase: M.stone },
]

/** Full mass units for converter */
export const massUnitsFull: UnitOption[] = [
  { id: 'picogram', name: 'Picogram', symbol: 'pg', toBase: M.picogram },
  { id: 'nanogram', name: 'Nanogram', symbol: 'ng', toBase: M.nanogram },
  { id: 'microgram', name: 'Microgram', symbol: 'μg', toBase: M.microgram },
  { id: 'milligram', name: 'Milligram', symbol: 'mg', toBase: M.milligram },
  { id: 'centigram', name: 'Centigram', symbol: 'cg', toBase: M.centigram },
  { id: 'decigram', name: 'Decigram', symbol: 'dg', toBase: M.decigram },
  { id: 'gram', name: 'Gram', symbol: 'g', toBase: M.gram },
  { id: 'dekagram', name: 'Dekagram', symbol: 'dag', toBase: M.dekagram },
  { id: 'hectogram', name: 'Hectogram', symbol: 'hg', toBase: M.hectogram },
  { id: 'kilogram', name: 'Kilogram', symbol: 'kg', toBase: M.kilogram },
  { id: 'metric-ton', name: 'Metric Ton (Tonne)', symbol: 't', toBase: M['metric-ton'] },
  { id: 'gigagram', name: 'Gigagram (Kiloton)', symbol: 'Gg', toBase: M.gigagram },
  { id: 'grain', name: 'Grain', symbol: 'gr', toBase: M.grain },
  { id: 'dram', name: 'Dram', symbol: 'dr', toBase: M.dram },
  { id: 'ounce', name: 'Ounce', symbol: 'oz', toBase: M.ounce },
  { id: 'pound', name: 'Pound', symbol: 'lb', toBase: M.pound },
  { id: 'stone', name: 'Stone', symbol: 'st', toBase: M.stone },
  { id: 'quarter', name: 'Quarter', symbol: 'qr', toBase: M.quarter },
  { id: 'hundredweight', name: 'Hundredweight (US)', symbol: 'cwt', toBase: M.hundredweight },
  { id: 'hundredweight-uk', name: 'Hundredweight (UK)', symbol: 'cwt (UK)', toBase: M['hundredweight-uk'] },
  { id: 'short-ton', name: 'Short Ton (US)', symbol: 'ton (US)', toBase: M['short-ton'] },
  { id: 'long-ton', name: 'Long Ton (UK)', symbol: 'ton (UK)', toBase: M['long-ton'] },
  { id: 'troy-grain', name: 'Troy Grain', symbol: 'gr t', toBase: M['troy-grain'] },
  { id: 'troy-pennyweight', name: 'Pennyweight', symbol: 'dwt', toBase: M['troy-pennyweight'] },
  { id: 'troy-ounce', name: 'Troy Ounce', symbol: 'oz t', toBase: M['troy-ounce'] },
  { id: 'troy-pound', name: 'Troy Pound', symbol: 'lb t', toBase: M['troy-pound'] },
  { id: 'carat', name: 'Carat', symbol: 'ct', toBase: M.carat },
  { id: 'point', name: 'Point (gem)', symbol: 'pt', toBase: M.point },
  { id: 'momme', name: 'Momme', symbol: 'momme', toBase: M.momme },
  { id: 'atomic-mass-unit', name: 'Atomic Mass Unit', symbol: 'u', toBase: M['atomic-mass-unit'] },
  { id: 'dalton', name: 'Dalton', symbol: 'Da', toBase: M.dalton },
  { id: 'electron-mass', name: 'Electron Mass', symbol: 'mₑ', toBase: M['electron-mass'] },
  { id: 'proton-mass', name: 'Proton Mass', symbol: 'mₚ', toBase: M['proton-mass'] },
  { id: 'planck-mass', name: 'Planck Mass', symbol: 'mₚₗ', toBase: M['planck-mass'] },
  { id: 'slug', name: 'Slug', symbol: 'slug', toBase: M.slug },
  { id: 'kip', name: 'Kip', symbol: 'kip', toBase: M.kip },
  { id: 'chinese-liang', name: 'Liang (Tael)', symbol: '両', toBase: M['chinese-liang'] },
  { id: 'chinese-jin', name: 'Jin (Catty)', symbol: '斤', toBase: M['chinese-jin'] },
  { id: 'indian-tola', name: 'Tola', symbol: 'tola', toBase: M['indian-tola'] },
  { id: 'solar-mass', name: 'Solar Mass', symbol: 'M☉', toBase: M['solar-mass'] },
  { id: 'earth-mass', name: 'Earth Mass', symbol: 'M⊕', toBase: M['earth-mass'] },
]

/** Default mass unit */
export const defaultMassUnit: UnitOption = { id: 'kilogram', name: 'Kilogram', symbol: 'kg', toBase: 1 }
