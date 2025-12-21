/**
 * Angle Unit Definitions
 * Base unit: radian (rad)
 * All values represent conversion factor TO radians
 */

import type { UnitOption } from './types'

/* ========== RAW CONVERSION FACTORS ========== */
export const angle = {
  /* SI and Mathematical */
  radian: 1,
  milliradian: 0.001,
  microradian: 1e-6,

  /* Common Angular */
  degree: Math.PI / 180,
  arcminute: Math.PI / 10800,
  arcsecond: Math.PI / 648000,
  milliarcsecond: Math.PI / 648000000,
  microarcsecond: Math.PI / 648000000000,

  /* Gradians / Metric Angle */
  gradian: Math.PI / 200,
  gon: Math.PI / 200,
  grade: Math.PI / 200,
  'centigrade-angle': Math.PI / 20000,

  /* Revolutions / Cycles */
  turn: 2 * Math.PI,
  revolution: 2 * Math.PI,
  cycle: 2 * Math.PI,
  'full-circle': 2 * Math.PI,
  'half-circle': Math.PI,
  'quarter-circle': Math.PI / 2,

  /* Geometric Divisions */
  quadrant: Math.PI / 2,
  sextant: Math.PI / 3,
  octant: Math.PI / 4,
  sign: Math.PI / 6,
  'hour-angle': Math.PI / 12,

  /* Military */
  'mil-nato': (2 * Math.PI) / 6400,
  'mil-ussr': (2 * Math.PI) / 6000,
  'mil-sweden': (2 * Math.PI) / 6300,

  /* Computing / Binary */
  'binary-radian': 2 * Math.PI / 256,
  'binary-degree': 2 * Math.PI / 256,

  /* Navigation / Surveying */
  point: (2 * Math.PI) / 32,
  'compass-point': (2 * Math.PI) / 32,

  /* Time-based angles */
  'hour-hand': (2 * Math.PI) / 12,
  'minute-hand': (2 * Math.PI) / 60,
  'second-hand': (2 * Math.PI) / 60,

  /* Historical */
  'pechus': Math.PI / 180,
} as const

export type AngleUnit = keyof typeof angle

/** Convert angle to degrees */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

/** Convert degrees to radians */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/* ========== UNIT OPTION ARRAYS ========== */
const A = angle

/** Common angle units */
export const angleUnitsCommon: UnitOption[] = [
  { id: 'degree', name: 'Degree', symbol: '°', toBase: A.degree },
  { id: 'radian', name: 'Radian', symbol: 'rad', toBase: A.radian },
  { id: 'gradian', name: 'Gradian', symbol: 'grad', toBase: A.gradian },
  { id: 'arcminute', name: 'Arcminute', symbol: '′', toBase: A.arcminute },
  { id: 'arcsecond', name: 'Arcsecond', symbol: '″', toBase: A.arcsecond },
  { id: 'turn', name: 'Turn', symbol: 'tr', toBase: A.turn },
]

/** Full angle units for converter */
export const angleUnitsFull: UnitOption[] = [
  { id: 'radian', name: 'Radian', symbol: 'rad', toBase: A.radian },
  { id: 'milliradian', name: 'Milliradian', symbol: 'mrad', toBase: A.milliradian },
  { id: 'microradian', name: 'Microradian', symbol: 'μrad', toBase: A.microradian },
  { id: 'degree', name: 'Degree', symbol: '°', toBase: A.degree },
  { id: 'arcminute', name: 'Arcminute', symbol: '′', toBase: A.arcminute },
  { id: 'arcsecond', name: 'Arcsecond', symbol: '″', toBase: A.arcsecond },
  { id: 'milliarcsecond', name: 'Milliarcsecond', symbol: 'mas', toBase: A.milliarcsecond },
  { id: 'microarcsecond', name: 'Microarcsecond', symbol: 'μas', toBase: A.microarcsecond },
  { id: 'gradian', name: 'Gradian (Gon)', symbol: 'grad', toBase: A.gradian },
  { id: 'centigrade-angle', name: 'Centigrade (angle)', symbol: 'cgon', toBase: A['centigrade-angle'] },
  { id: 'turn', name: 'Turn (Revolution)', symbol: 'tr', toBase: A.turn },
  { id: 'half-circle', name: 'Half Circle', symbol: 'π rad', toBase: A['half-circle'] },
  { id: 'quarter-circle', name: 'Quarter Circle', symbol: 'π/2 rad', toBase: A['quarter-circle'] },
  { id: 'quadrant', name: 'Quadrant', symbol: 'quad', toBase: A.quadrant },
  { id: 'sextant', name: 'Sextant', symbol: 'sext', toBase: A.sextant },
  { id: 'octant', name: 'Octant', symbol: 'oct', toBase: A.octant },
  { id: 'sign', name: 'Sign (Zodiac)', symbol: 'sign', toBase: A.sign },
  { id: 'hour-angle', name: 'Hour Angle', symbol: 'HA', toBase: A['hour-angle'] },
  { id: 'mil-nato', name: 'Mil (NATO)', symbol: 'mil', toBase: A['mil-nato'] },
  { id: 'mil-ussr', name: 'Mil (USSR)', symbol: 'mil (RU)', toBase: A['mil-ussr'] },
  { id: 'mil-sweden', name: 'Streck (Sweden)', symbol: 'streck', toBase: A['mil-sweden'] },
  { id: 'compass-point', name: 'Compass Point', symbol: 'pt', toBase: A['compass-point'] },
  { id: 'binary-radian', name: 'Binary Radian (Brad)', symbol: 'brad', toBase: A['binary-radian'] },
]

/** Default angle unit */
export const defaultAngleUnit: UnitOption = { id: 'radian', name: 'Radian', symbol: 'rad', toBase: 1 }
