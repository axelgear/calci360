/**
 * Length Units (base: meter)
 * All values represent conversion factor TO meters
 */

export const length = {
  /* SI Metric */
  yoctometer: 1e-24,
  zeptometer: 1e-21,
  attometer: 1e-18,
  femtometer: 1e-15, /* also called fermi */
  picometer: 1e-12,
  nanometer: 1e-9,
  micrometer: 1e-6, /* also called micron */
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
  'us-survey-foot': 1200 / 3937, /* exactly 0.3048006096... */
  'us-survey-mile': (1200 / 3937) * 5280,
  league: 4828.032, /* 3 miles */
  furlong: 201.168, /* 1/8 mile */
  chain: 20.1168, /* 1/80 mile, Gunter's chain */
  rod: 5.0292, /* also pole or perch */
  link: 0.201168, /* 1/100 chain */

  /* Nautical */
  'nautical-mile': 1852,
  'nautical-league': 5556, /* 3 nautical miles */
  fathom: 1.8288,
  cable: 185.2, /* 1/10 nautical mile */

  /* Typography */
  point: 0.0003527778, /* 1/72 inch (PostScript point) */
  pica: 0.0042333333, /* 12 points */
  twip: 0.000017639, /* 1/20 point */
  'didot-point': 0.000376065, /* French point */
  cicero: 0.004512780, /* 12 didot points */

  /* Astronomical */
  'astronomical-unit': 149_597_870_700, /* AU - Earth-Sun distance */
  'light-year': 9_460_730_472_580_800, /* distance light travels in 1 year */
  parsec: 3.085677581491367e16, /* parallax of 1 arcsecond */
  kiloparsec: 3.085677581491367e19,
  megaparsec: 3.085677581491367e22,
  'light-second': 299_792_458,
  'light-minute': 17_987_547_480,
  'light-hour': 1_079_252_848_800,
  'light-day': 25_902_068_371_200,

  /* Atomic / Quantum */
  angstrom: 1e-10, /* Å */
  fermi: 1e-15, /* fm, same as femtometer */
  'bohr-radius': 5.29177210903e-11, /* a₀ */
  'planck-length': 1.616255e-35,
  'compton-wavelength-electron': 2.42631023867e-12,
  'compton-wavelength-proton': 1.32140985539e-15,

  /* Industrial / Engineering */
  mil: 0.0000254, /* 1/1000 inch, also called thou */
  microinch: 2.54e-8,
  caliber: 0.000254, /* 1/100 inch (for bullet diameter) */

  /* Historical / Regional */
  'chinese-li': 500, /* traditional Chinese unit */
  'chinese-chi': 1 / 3, /* Chinese foot */
  'chinese-cun': 1 / 30, /* Chinese inch */
  'japanese-shaku': 10 / 33, /* Japanese foot */
  'japanese-sun': 1 / 33, /* Japanese inch */
  'japanese-ken': 60 / 33, /* Japanese fathom */
  'russian-verst': 1066.8, /* Russian mile */
  'roman-mile': 1479.804, /* mille passus */
  'greek-stadion': 185, /* approximately */
  cubit: 0.4572, /* ancient unit, approximately 18 inches */
  'royal-cubit': 0.524, /* Egyptian royal cubit */
  span: 0.2286, /* 9 inches, half cubit */
  hand: 0.1016, /* 4 inches, for horse height */
  digit: 0.01905, /* 3/4 inch */
  palm: 0.0762, /* 3 inches */
  ell: 1.143, /* 45 inches, English ell */
  'flemish-ell': 0.686, /* 27 inches */
  smoot: 1.7018, /* Oliver Smoot's height */
} as const

export type LengthUnit = keyof typeof length

