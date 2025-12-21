import type { ConverterConfig } from '../../types'
import { length, time, mass, derivePressure, deriveForce, deriveArea, STANDARD_GRAVITY, STANDARD_ATMOSPHERE } from '../../units'

/**
 * Pressure Converter - Derived from Force / Area (P = F / A)
 * Base unit: Pascal (Pa = N/m² = kg/(m⋅s²))
 * 
 * Formula: pressure_toBase = mass_toBase / (length_toBase × time_toBase²)
 */

const L = length
const T = time
const M = mass
const g = STANDARD_GRAVITY

/* Pascal: 1 Pa = 1 N/m² = 1 kg / (1 m × 1 s²) */
const newton = deriveForce(M.kilogram, L.meter, T.second)
const pascal = derivePressure(newton, deriveArea(L.meter))

/* Standard atmosphere */
const atm = STANDARD_ATMOSPHERE * pascal

/* Bar: 100,000 Pa */
const bar = 100000 * pascal

/* mmHg (Torr): defined from density of mercury × g × height */
const MERCURY_DENSITY = 13595.1 /* kg/m³ at 0°C */
const mmHg = MERCURY_DENSITY * g * L.millimeter * pascal

/* PSI: lbf per square inch */
const lbf = M.pound * g
const psi = derivePressure(lbf, deriveArea(L.inch))

/* Water column density */
const WATER_DENSITY = 1000 /* kg/m³ at 4°C */

export const pressureConverter: ConverterConfig = {
  type: 'converter',
  name: 'Pressure Converter',
  description: 'Convert between pressure units including PSI, Bar, Pascal, atmospheres, and mmHg',
  category: 'Unit Conversion',
  icon: 'speed',
  keywords: ['pressure', 'psi', 'bar', 'pascal', 'atmosphere', 'mmhg', 'torr'],
  defaultFromUnit: 'bar',
  defaultToUnit: 'psi',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI - derived from N/m² */
    { id: 'micropascal', name: 'Micropascal', symbol: 'μPa', toBase: pascal * 1e-6 },
    { id: 'millipascal', name: 'Millipascal', symbol: 'mPa', toBase: pascal * 0.001 },
    { id: 'pascal', name: 'Pascal', symbol: 'Pa', toBase: pascal },
    { id: 'hectopascal', name: 'Hectopascal', symbol: 'hPa', toBase: pascal * 100 },
    { id: 'kilopascal', name: 'Kilopascal', symbol: 'kPa', toBase: pascal * 1000 },
    { id: 'megapascal', name: 'Megapascal', symbol: 'MPa', toBase: pascal * 1e6 },
    { id: 'gigapascal', name: 'Gigapascal', symbol: 'GPa', toBase: pascal * 1e9 },
    
    /* Bar */
    { id: 'microbar', name: 'Microbar', symbol: 'μbar', toBase: bar * 1e-6 },
    { id: 'millibar', name: 'Millibar', symbol: 'mbar', toBase: bar * 0.001 },
    { id: 'centibar', name: 'Centibar', symbol: 'cbar', toBase: bar * 0.01 },
    { id: 'decibar', name: 'Decibar', symbol: 'dbar', toBase: bar * 0.1 },
    { id: 'bar', name: 'Bar', symbol: 'bar', toBase: bar },
    { id: 'kilobar', name: 'Kilobar', symbol: 'kbar', toBase: bar * 1000 },
    { id: 'megabar', name: 'Megabar', symbol: 'Mbar', toBase: bar * 1e6 },
    
    /* Atmosphere */
    { id: 'atmosphere', name: 'Atmosphere (standard)', symbol: 'atm', toBase: atm },
    { id: 'technical-atmosphere', name: 'Technical Atmosphere', symbol: 'at', toBase: M.kilogram * g / deriveArea(L.centimeter) },
    
    /* Mercury column */
    { id: 'mmhg', name: 'mmHg (Torr)', symbol: 'mmHg', toBase: mmHg },
    { id: 'cmhg', name: 'cmHg', symbol: 'cmHg', toBase: mmHg * 10 },
    { id: 'inhg', name: 'Inches of Mercury', symbol: 'inHg', toBase: MERCURY_DENSITY * g * L.inch * pascal },
    { id: 'torr', name: 'Torr', symbol: 'Torr', toBase: atm / 760 }, /* 1/760 of standard atmosphere */
    
    /* Water column */
    { id: 'mmh2o', name: 'mm of Water', symbol: 'mmH₂O', toBase: WATER_DENSITY * g * L.millimeter * pascal },
    { id: 'cmh2o', name: 'cm of Water', symbol: 'cmH₂O', toBase: WATER_DENSITY * g * L.centimeter * pascal },
    { id: 'mh2o', name: 'Meter of Water', symbol: 'mH₂O', toBase: WATER_DENSITY * g * L.meter * pascal },
    { id: 'inh2o', name: 'Inches of Water', symbol: 'inH₂O', toBase: WATER_DENSITY * g * L.inch * pascal },
    { id: 'fth2o', name: 'Feet of Water', symbol: 'ftH₂O', toBase: WATER_DENSITY * g * L.foot * pascal },
    
    /* Imperial - derived from lbf/in² */
    { id: 'psi', name: 'PSI', symbol: 'psi', toBase: psi },
    { id: 'ksi', name: 'KSI', symbol: 'ksi', toBase: psi * 1000 },
    { id: 'psia', name: 'PSIA (absolute)', symbol: 'psia', toBase: psi },
    { id: 'psf', name: 'PSF', symbol: 'psf', toBase: derivePressure(lbf, deriveArea(L.foot)) },
    { id: 'ksf', name: 'KSF', symbol: 'ksf', toBase: derivePressure(lbf, deriveArea(L.foot)) * 1000 },
    
    /* kgf-based */
    { id: 'kgf-cm2', name: 'kgf/cm²', symbol: 'kgf/cm²', toBase: M.kilogram * g / deriveArea(L.centimeter) },
    { id: 'kgf-m2', name: 'kgf/m²', symbol: 'kgf/m²', toBase: M.kilogram * g / deriveArea(L.meter) },
    { id: 'kgf-mm2', name: 'kgf/mm²', symbol: 'kgf/mm²', toBase: M.kilogram * g / deriveArea(L.millimeter) },
    
    /* CGS */
    { id: 'barye', name: 'Barye', symbol: 'Ba', toBase: 0.1 * pascal }, /* 1 dyn/cm² */
    
    /* Other */
    { id: 'pieze', name: 'Pieze', symbol: 'pz', toBase: 1000 * pascal }, /* MTS unit */
  ],
}

