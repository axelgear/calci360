/**
 * Time Unit Definitions
 * Base unit: second (s)
 * All values represent conversion factor TO seconds
 */

import type { UnitOption } from './types'

/* ========== RAW CONVERSION FACTORS ========== */
export const time = {
  /* SI Metric */
  yoctosecond: 1e-24,
  zeptosecond: 1e-21,
  attosecond: 1e-18,
  femtosecond: 1e-15,
  picosecond: 1e-12,
  nanosecond: 1e-9,
  microsecond: 1e-6,
  millisecond: 0.001,
  centisecond: 0.01,
  decisecond: 0.1,
  second: 1,
  dekasecond: 10,
  hectosecond: 100,
  kilosecond: 1000,
  megasecond: 1e6,
  gigasecond: 1e9,

  /* Common Units */
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  fortnight: 1209600,
  month: 2629746,
  quarter: 7889238,
  year: 31557600,
  'common-year': 31536000,
  'leap-year': 31622400,
  decade: 315576000,
  century: 3155760000,
  millennium: 31557600000,

  /* Astronomical */
  'sidereal-second': 0.9972695663,
  'sidereal-minute': 59.83617398,
  'sidereal-hour': 3590.170439,
  'sidereal-day': 86164.0905,
  'sidereal-month': 2360591.5,
  'synodic-month': 2551442.8,
  'tropical-year': 31556925.2,
  'sidereal-year': 31558149.76,
  'anomalistic-year': 31558432.5,
  'draconic-year': 31557600 * 0.94901,
  'galactic-year': 7.5e15,

  /* Computing / Physics */
  jiffy: 0.01,
  'jiffy-physics': 3e-24,
  shake: 1e-8,
  'planck-time': 5.391247e-44,
  'svedberg': 1e-13,

  /* Historical / Cultural */
  moment: 90,
  'ke-chinese': 864,
  helek: 10 / 3,
  'indian-pala': 24,
  'indian-ghati': 1440,

  /* Music / Entertainment */
  beat: 0.5,

  /* Work / Business */
  'work-day': 28800,
  'work-week': 144000,
  'work-month': 576000,
  'work-year': 7488000,
} as const

export type TimeUnit = keyof typeof time

/* ========== UNIT OPTION ARRAYS ========== */
const T = time

/** Common time units */
export const timeUnitsCommon: UnitOption[] = [
  { id: 'millisecond', name: 'Millisecond', symbol: 'ms', toBase: T.millisecond },
  { id: 'second', name: 'Second', symbol: 's', toBase: T.second },
  { id: 'minute', name: 'Minute', symbol: 'min', toBase: T.minute },
  { id: 'hour', name: 'Hour', symbol: 'h', toBase: T.hour },
  { id: 'day', name: 'Day', symbol: 'd', toBase: T.day },
  { id: 'week', name: 'Week', symbol: 'wk', toBase: T.week },
  { id: 'month', name: 'Month', symbol: 'mo', toBase: T.month },
  { id: 'year', name: 'Year', symbol: 'yr', toBase: T.year },
]

/** Full time units for converter */
export const timeUnitsFull: UnitOption[] = [
  { id: 'picosecond', name: 'Picosecond', symbol: 'ps', toBase: T.picosecond },
  { id: 'nanosecond', name: 'Nanosecond', symbol: 'ns', toBase: T.nanosecond },
  { id: 'microsecond', name: 'Microsecond', symbol: 'μs', toBase: T.microsecond },
  { id: 'millisecond', name: 'Millisecond', symbol: 'ms', toBase: T.millisecond },
  { id: 'centisecond', name: 'Centisecond', symbol: 'cs', toBase: T.centisecond },
  { id: 'decisecond', name: 'Decisecond', symbol: 'ds', toBase: T.decisecond },
  { id: 'second', name: 'Second', symbol: 's', toBase: T.second },
  { id: 'dekasecond', name: 'Dekasecond', symbol: 'das', toBase: T.dekasecond },
  { id: 'hectosecond', name: 'Hectosecond', symbol: 'hs', toBase: T.hectosecond },
  { id: 'kilosecond', name: 'Kilosecond', symbol: 'ks', toBase: T.kilosecond },
  { id: 'megasecond', name: 'Megasecond', symbol: 'Ms', toBase: T.megasecond },
  { id: 'minute', name: 'Minute', symbol: 'min', toBase: T.minute },
  { id: 'hour', name: 'Hour', symbol: 'h', toBase: T.hour },
  { id: 'day', name: 'Day', symbol: 'd', toBase: T.day },
  { id: 'week', name: 'Week', symbol: 'wk', toBase: T.week },
  { id: 'fortnight', name: 'Fortnight', symbol: 'fn', toBase: T.fortnight },
  { id: 'month', name: 'Month (average)', symbol: 'mo', toBase: T.month },
  { id: 'quarter', name: 'Quarter', symbol: 'qtr', toBase: T.quarter },
  { id: 'year', name: 'Year (Julian)', symbol: 'yr', toBase: T.year },
  { id: 'common-year', name: 'Common Year (365d)', symbol: 'yr', toBase: T['common-year'] },
  { id: 'leap-year', name: 'Leap Year (366d)', symbol: 'leap yr', toBase: T['leap-year'] },
  { id: 'decade', name: 'Decade', symbol: 'dec', toBase: T.decade },
  { id: 'century', name: 'Century', symbol: 'c', toBase: T.century },
  { id: 'millennium', name: 'Millennium', symbol: 'mill', toBase: T.millennium },
  { id: 'sidereal-day', name: 'Sidereal Day', symbol: 'sd', toBase: T['sidereal-day'] },
  { id: 'sidereal-month', name: 'Sidereal Month', symbol: 'sm', toBase: T['sidereal-month'] },
  { id: 'synodic-month', name: 'Synodic Month (Lunar)', symbol: 'syn mo', toBase: T['synodic-month'] },
  { id: 'tropical-year', name: 'Tropical Year', symbol: 'ty', toBase: T['tropical-year'] },
  { id: 'sidereal-year', name: 'Sidereal Year', symbol: 'sy', toBase: T['sidereal-year'] },
  { id: 'anomalistic-year', name: 'Anomalistic Year', symbol: 'ay', toBase: T['anomalistic-year'] },
  { id: 'galactic-year', name: 'Galactic Year', symbol: 'GY', toBase: T['galactic-year'] },
  { id: 'jiffy', name: 'Jiffy (1/100 s)', symbol: 'jiffy', toBase: T.jiffy },
  { id: 'shake', name: 'Shake', symbol: 'shake', toBase: T.shake },
  { id: 'planck-time', name: 'Planck Time', symbol: 'tₚ', toBase: T['planck-time'] },
  { id: 'work-day', name: 'Work Day (8h)', symbol: 'work day', toBase: T['work-day'] },
  { id: 'work-week', name: 'Work Week (40h)', symbol: 'work wk', toBase: T['work-week'] },
]

/** Default time unit */
export const defaultTimeUnit: UnitOption = { id: 'second', name: 'Second', symbol: 's', toBase: 1 }
