/**
 * Time Units (base: second)
 * All values represent conversion factor TO seconds
 */

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
  fortnight: 1209600, /* 2 weeks */
  month: 2629746, /* average month (365.25/12 days) */
  quarter: 7889238, /* 3 months */
  year: 31557600, /* Julian year (365.25 days) */
  'common-year': 31536000, /* 365 days */
  'leap-year': 31622400, /* 366 days */
  decade: 315576000, /* 10 Julian years */
  century: 3155760000, /* 100 Julian years */
  millennium: 31557600000, /* 1000 Julian years */

  /* Astronomical */
  'sidereal-second': 0.9972695663, /* relative to stars */
  'sidereal-minute': 59.83617398,
  'sidereal-hour': 3590.170439,
  'sidereal-day': 86164.0905, /* Earth rotation relative to stars */
  'sidereal-month': 2360591.5, /* Moon orbit relative to stars */
  'synodic-month': 2551442.8, /* lunar phases cycle (29.53 days) */
  'tropical-year': 31556925.2, /* equinox to equinox */
  'sidereal-year': 31558149.76, /* relative to stars */
  'anomalistic-year': 31558432.5, /* perihelion to perihelion */
  'draconic-year': 31557600 * 0.94901, /* eclipse year */
  'galactic-year': 7.5e15, /* Sun's orbit around Milky Way */

  /* Computing / Physics */
  jiffy: 0.01, /* 1/100 second (computing context) */
  'jiffy-physics': 3e-24, /* time for light to travel 1 fermi */
  shake: 1e-8, /* 10 nanoseconds (nuclear physics) */
  'planck-time': 5.391247e-44, /* smallest meaningful time unit */
  'svedberg': 1e-13, /* sedimentation unit */

  /* Historical / Cultural */
  moment: 90, /* medieval unit, 1/40 hour */
  'ke-chinese': 864, /* traditional Chinese unit, 1/100 day */
  helek: 10 / 3, /* Hebrew unit, 1/1080 hour */
  'indian-pala': 24, /* traditional Indian unit */
  'indian-ghati': 1440, /* 60 palas */

  /* Music / Entertainment */
  beat: 0.5, /* at 120 BPM */

  /* Work / Business */
  'work-day': 28800, /* 8 hours */
  'work-week': 144000, /* 40 hours */
  'work-month': 576000, /* 160 hours typical */
  'work-year': 7488000, /* 2080 hours (52 weeks × 40 hours) */
} as const

export type TimeUnit = keyof typeof time

