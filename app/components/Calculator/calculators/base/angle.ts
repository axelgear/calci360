/**
 * Angle Units (base: radian)
 * All values represent conversion factor TO radians
 */

export const angle = {
  /* SI and Mathematical */
  radian: 1,
  milliradian: 0.001,
  microradian: 1e-6,

  /* Common Angular */
  degree: Math.PI / 180,
  arcminute: Math.PI / 10800, /* 1/60 degree */
  arcsecond: Math.PI / 648000, /* 1/3600 degree */
  milliarcsecond: Math.PI / 648000000,
  microarcsecond: Math.PI / 648000000000,

  /* Gradians / Metric Angle */
  gradian: Math.PI / 200, /* also called gon or grade */
  gon: Math.PI / 200,
  grade: Math.PI / 200,
  'centigrade-angle': Math.PI / 20000, /* 1/100 gradian */

  /* Revolutions / Cycles */
  turn: 2 * Math.PI,
  revolution: 2 * Math.PI,
  cycle: 2 * Math.PI,
  'full-circle': 2 * Math.PI,
  'half-circle': Math.PI,
  'quarter-circle': Math.PI / 2,

  /* Geometric Divisions */
  quadrant: Math.PI / 2, /* 90 degrees */
  sextant: Math.PI / 3, /* 60 degrees */
  octant: Math.PI / 4, /* 45 degrees */
  sign: Math.PI / 6, /* 30 degrees (zodiac sign) */
  'hour-angle': Math.PI / 12, /* 15 degrees (1 hour of rotation) */

  /* Military */
  'mil-nato': (2 * Math.PI) / 6400, /* NATO mil */
  'mil-ussr': (2 * Math.PI) / 6000, /* Soviet/Russian mil */
  'mil-sweden': (2 * Math.PI) / 6300, /* Swedish streck */

  /* Computing / Binary */
  'binary-radian': 2 * Math.PI / 256, /* brad, 1/256 turn */
  'binary-degree': 2 * Math.PI / 256, /* same as brad */

  /* Navigation / Surveying */
  point: (2 * Math.PI) / 32, /* compass point, 11.25 degrees */
  'compass-point': (2 * Math.PI) / 32,

  /* Time-based angles (for rotation) */
  'hour-hand': (2 * Math.PI) / 12, /* clock hour */
  'minute-hand': (2 * Math.PI) / 60, /* clock minute */
  'second-hand': (2 * Math.PI) / 60, /* clock second */

  /* Historical */
  'pechus': Math.PI / 180, /* Greek, same as degree */
} as const

export type AngleUnit = keyof typeof angle

/**
 * Convert angle to degrees (helper for display)
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Convert degrees to radians (helper for calculations)
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

