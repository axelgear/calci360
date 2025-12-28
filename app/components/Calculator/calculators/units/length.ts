/**
 * Length Unit Definitions
 * Base unit: meter (m)
 * All values represent conversion factor TO meters
 */

import type { UnitOption } from './types'

/* ========== RAW CONVERSION FACTORS ========== */
export const length = {
  /* SI Metric */
  yoctometer: 1e-24,
  zeptometer: 1e-21,
  attometer: 1e-18,
  femtometer: 1e-15,
  picometer: 1e-12,
  nanometer: 1e-9,
  micrometer: 1e-6,
  millimeter: 0.001,
  centimeter: 0.01,
  decimeter: 0.1,
  meter: 1,
  dekameter: 10,
  hectometer: 100,
  kilometer: 1000,
  megameter: 1e6,
  gigameter: 1e9,
  terameter: 1e12,

  /* Imperial / US Customary */
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
  'us-survey-foot': 1200 / 3937,
  'us-survey-mile': (1200 / 3937) * 5280,
  league: 4828.032,
  furlong: 201.168,
  chain: 20.1168,
  rod: 5.0292,
  link: 0.201168,

  /* Nautical */
  'nautical-mile': 1852,
  'nautical-league': 5556,
  fathom: 1.8288,
  cable: 185.2,

  /* Typography */
  point: 0.0003527778,
  pica: 0.0042333333,
  twip: 0.000017639,
  'didot-point': 0.000376065,
  cicero: 0.004512780,

  /* Astronomical */
  'astronomical-unit': 149_597_870_700,
  'light-year': 9_460_730_472_580_800,
  parsec: 3.085677581491367e16,
  kiloparsec: 3.085677581491367e19,
  megaparsec: 3.085677581491367e22,
  'light-second': 299_792_458,
  'light-minute': 17_987_547_480,
  'light-hour': 1_079_252_848_800,
  'light-day': 25_902_068_371_200,

  /* Atomic / Quantum */
  angstrom: 1e-10,
  fermi: 1e-15,
  'bohr-radius': 5.29177210903e-11,
  'planck-length': 1.616255e-35,
  'compton-wavelength-electron': 2.42631023867e-12,
  'compton-wavelength-proton': 1.32140985539e-15,

  /* Industrial / Engineering */
  mil: 0.0000254,
  microinch: 2.54e-8,
  caliber: 0.000254,

  /* Historical / Regional */
  'chinese-li': 500,
  'chinese-chi': 1 / 3,
  'chinese-cun': 1 / 30,
  'japanese-shaku': 10 / 33,
  'japanese-sun': 1 / 33,
  'japanese-ken': 60 / 33,
  'russian-verst': 1066.8,
  'roman-mile': 1479.804,
  'greek-stadion': 185,
  cubit: 0.4572,
  'royal-cubit': 0.524,
  span: 0.2286,
  hand: 0.1016,
  digit: 0.01905,
  palm: 0.0762,
  ell: 1.143,
  'flemish-ell': 0.686,
  smoot: 1.7018,
} as const

export type LengthUnit = keyof typeof length

/* ========== UNIT OPTION ARRAYS ========== */
const L = length

/** Common length units for geometry calculators */
export const lengthUnitsCommon: UnitOption[] = [
  { id: 'millimeter', name: 'Millimeter', symbol: 'mm', toBase: L.millimeter },
  { id: 'centimeter', name: 'Centimeter', symbol: 'cm', toBase: L.centimeter },
  { id: 'meter', name: 'Meter', symbol: 'm', toBase: L.meter },
  { id: 'kilometer', name: 'Kilometer', symbol: 'km', toBase: L.kilometer },
  { id: 'inch', name: 'Inch', symbol: 'in', toBase: L.inch },
  { id: 'foot', name: 'Foot', symbol: 'ft', toBase: L.foot },
  { id: 'yard', name: 'Yard', symbol: 'yd', toBase: L.yard },
  { id: 'mile', name: 'Mile', symbol: 'mi', toBase: L.mile },
  { id: 'micrometer', name: 'Micrometer', symbol: 'μm', toBase: L.micrometer },
  { id: 'nanometer', name: 'Nanometer', symbol: 'nm', toBase: L.nanometer },
  { id: 'nautical-mile', name: 'Nautical Mile', symbol: 'NM', toBase: L['nautical-mile'] },
]

/** Full length units for converter */
export const lengthUnitsFull: UnitOption[] = [
  { id: 'picometer', name: 'Picometer', symbol: 'pm', toBase: L.picometer },
  { id: 'nanometer', name: 'Nanometer', symbol: 'nm', toBase: L.nanometer },
  { id: 'micrometer', name: 'Micrometer', symbol: 'μm', toBase: L.micrometer },
  { id: 'millimeter', name: 'Millimeter', symbol: 'mm', toBase: L.millimeter },
  { id: 'centimeter', name: 'Centimeter', symbol: 'cm', toBase: L.centimeter },
  { id: 'decimeter', name: 'Decimeter', symbol: 'dm', toBase: L.decimeter },
  { id: 'meter', name: 'Meter', symbol: 'm', toBase: L.meter },
  { id: 'dekameter', name: 'Dekameter', symbol: 'dam', toBase: L.dekameter },
  { id: 'hectometer', name: 'Hectometer', symbol: 'hm', toBase: L.hectometer },
  { id: 'kilometer', name: 'Kilometer', symbol: 'km', toBase: L.kilometer },
  { id: 'megameter', name: 'Megameter', symbol: 'Mm', toBase: L.megameter },
  { id: 'inch', name: 'Inch', symbol: 'in', toBase: L.inch },
  { id: 'foot', name: 'Foot', symbol: 'ft', toBase: L.foot },
  { id: 'yard', name: 'Yard', symbol: 'yd', toBase: L.yard },
  { id: 'mile', name: 'Mile', symbol: 'mi', toBase: L.mile },
  { id: 'us-survey-foot', name: 'US Survey Foot', symbol: 'ft (US)', toBase: L['us-survey-foot'] },
  { id: 'league', name: 'League', symbol: 'lea', toBase: L.league },
  { id: 'furlong', name: 'Furlong', symbol: 'fur', toBase: L.furlong },
  { id: 'chain', name: 'Chain', symbol: 'ch', toBase: L.chain },
  { id: 'rod', name: 'Rod', symbol: 'rd', toBase: L.rod },
  { id: 'nautical-mile', name: 'Nautical Mile', symbol: 'nmi', toBase: L['nautical-mile'] },
  { id: 'fathom', name: 'Fathom', symbol: 'ftm', toBase: L.fathom },
  { id: 'cable', name: 'Cable', symbol: 'cable', toBase: L.cable },
  { id: 'point', name: 'Point', symbol: 'pt', toBase: L.point },
  { id: 'pica', name: 'Pica', symbol: 'pc', toBase: L.pica },
  { id: 'light-year', name: 'Light Year', symbol: 'ly', toBase: L['light-year'] },
  { id: 'astronomical-unit', name: 'Astronomical Unit', symbol: 'AU', toBase: L['astronomical-unit'] },
  { id: 'parsec', name: 'Parsec', symbol: 'pc', toBase: L.parsec },
  { id: 'light-second', name: 'Light Second', symbol: 'ls', toBase: L['light-second'] },
  { id: 'light-minute', name: 'Light Minute', symbol: 'lm', toBase: L['light-minute'] },
  { id: 'angstrom', name: 'Ångström', symbol: 'Å', toBase: L.angstrom },
  { id: 'fermi', name: 'Fermi', symbol: 'fm', toBase: L.fermi },
  { id: 'bohr-radius', name: 'Bohr Radius', symbol: 'a₀', toBase: L['bohr-radius'] },
  { id: 'planck-length', name: 'Planck Length', symbol: 'ℓₚ', toBase: L['planck-length'] },
  { id: 'mil', name: 'Mil (Thou)', symbol: 'mil', toBase: L.mil },
  { id: 'microinch', name: 'Microinch', symbol: 'μin', toBase: L.microinch },
  { id: 'cubit', name: 'Cubit', symbol: 'cubit', toBase: L.cubit },
  { id: 'hand', name: 'Hand', symbol: 'hh', toBase: L.hand },
  { id: 'span', name: 'Span', symbol: 'span', toBase: L.span },
  { id: 'smoot', name: 'Smoot', symbol: 'smoot', toBase: L.smoot },
]

/** Default length unit */
export const defaultLengthUnit: UnitOption = { id: 'meter', name: 'Meter', symbol: 'm', toBase: 1 }

/** Main export for lengthUnits - alias for lengthUnitsCommon */
export const lengthUnits = lengthUnitsCommon
