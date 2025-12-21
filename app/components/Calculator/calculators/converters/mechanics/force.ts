import type { ConverterConfig } from '../../types'
import { length, time, mass, deriveForce, STANDARD_GRAVITY } from '../../units'

/**
 * Force Converter - Derived from Mass × Acceleration (F = m × a)
 * Base unit: Newton (N = kg⋅m/s²)
 * 
 * Formula: force_toBase = mass_toBase × length_toBase / time_toBase²
 * 
 * Gravitational units use: force = mass × g (standard gravity)
 */

const L = length
const T = time
const M = mass
const g = STANDARD_GRAVITY

/* Newton: 1 N = 1 kg × 1 m / 1 s² = 1 */
const newton = deriveForce(M.kilogram, L.meter, T.second)

export const forceConverter: ConverterConfig = {
  type: 'converter',
  name: 'Force Converter',
  description: 'Convert between force units including Newtons, pound-force, kilogram-force, and dynes',
  category: 'Unit Conversion',
  icon: 'fitness_center',
  keywords: ['force', 'newton', 'pound', 'kilogram', 'dyne', 'kgf', 'lbf'],
  defaultFromUnit: 'newton',
  defaultToUnit: 'pound-force',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI - derived from kg⋅m/s² */
    { id: 'nanonewton', name: 'Nanonewton', symbol: 'nN', toBase: newton * 1e-9 },
    { id: 'micronewton', name: 'Micronewton', symbol: 'μN', toBase: newton * 1e-6 },
    { id: 'millinewton', name: 'Millinewton', symbol: 'mN', toBase: newton * 0.001 },
    { id: 'newton', name: 'Newton', symbol: 'N', toBase: newton },
    { id: 'dekanewton', name: 'Dekanewton', symbol: 'daN', toBase: newton * 10 },
    { id: 'kilonewton', name: 'Kilonewton', symbol: 'kN', toBase: newton * 1000 },
    { id: 'meganewton', name: 'Meganewton', symbol: 'MN', toBase: newton * 1e6 },
    { id: 'giganewton', name: 'Giganewton', symbol: 'GN', toBase: newton * 1e9 },
    
    /* CGS - dyne = g⋅cm/s² */
    { id: 'dyne', name: 'Dyne', symbol: 'dyn', toBase: deriveForce(M.gram, L.centimeter, T.second) },
    
    /* Gravitational metric - force = mass × g */
    { id: 'milligram-force', name: 'Milligram-force', symbol: 'mgf', toBase: M.milligram * g },
    { id: 'gram-force', name: 'Gram-force', symbol: 'gf', toBase: M.gram * g },
    { id: 'kilogram-force', name: 'Kilogram-force', symbol: 'kgf', toBase: M.kilogram * g },
    { id: 'metric-ton-force', name: 'Metric Ton-force', symbol: 'tf', toBase: M['metric-ton'] * g },
    { id: 'pond', name: 'Pond', symbol: 'p', toBase: M.gram * g }, /* same as gram-force */
    { id: 'kilopond', name: 'Kilopond', symbol: 'kp', toBase: M.kilogram * g }, /* same as kilogram-force */
    
    /* Imperial gravitational - force = mass × g */
    { id: 'ounce-force', name: 'Ounce-force', symbol: 'ozf', toBase: M.ounce * g },
    { id: 'pound-force', name: 'Pound-force', symbol: 'lbf', toBase: M.pound * g },
    { id: 'kip', name: 'Kip (kilopound)', symbol: 'kip', toBase: M.pound * g * 1000 }, /* 1000 lbf */
    { id: 'short-ton-force', name: 'Short Ton-force', symbol: 'tonf (US)', toBase: M['short-ton'] * g },
    { id: 'long-ton-force', name: 'Long Ton-force', symbol: 'tonf (UK)', toBase: M['long-ton'] * g },
    
    /* Poundal - lb⋅ft/s² (absolute unit, not gravitational) */
    { id: 'poundal', name: 'Poundal', symbol: 'pdl', toBase: deriveForce(M.pound, L.foot, T.second) },
    
    /* MTS system */
    { id: 'sthene', name: 'Sthène', symbol: 'sn', toBase: deriveForce(M['metric-ton'], L.meter, T.second) },
    
    /* Atomic */
    { id: 'atomic-unit-force', name: 'Atomic Unit of Force', symbol: 'Eₕ/a₀', toBase: 8.2387234983e-8 },
  ],
}

