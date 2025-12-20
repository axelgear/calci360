import type { ConverterConfig } from '../../types'
import { length } from '../../base/length'
import { time } from '../../base/time'
import { mass } from '../../base/mass'
import { STANDARD_GRAVITY } from '../../base/constants'
import { deriveTorque, deriveForce } from '../../base/derived'

/**
 * Torque Converter - Derived from Force × Distance (τ = F × r)
 * Base unit: Newton-meter (N⋅m = kg⋅m²/s²)
 * 
 * Formula: torque_toBase = mass_toBase × length_toBase² / time_toBase²
 * 
 * Note: Torque has same dimensions as energy, but different physical meaning
 */

const L = length
const T = time
const M = mass
const g = STANDARD_GRAVITY

/* Newton: 1 N = 1 kg⋅m/s² */
const newton = deriveForce(M.kilogram, L.meter, T.second)

/* Newton-meter: 1 N⋅m = 1 kg⋅m²/s² */
const Nm = deriveTorque(newton, L.meter)

/* Dyne from CGS */
const dyne = deriveForce(M.gram, L.centimeter, T.second)

/* Gravitational forces */
const kgf = M.kilogram * g
const gf = M.gram * g
const lbf = M.pound * g
const ozf = M.ounce * g

export const torqueConverter: ConverterConfig = {
  type: 'converter',
  name: 'Torque Converter',
  description: 'Convert between torque units including Newton-meters, pound-feet, and kilogram-centimeters',
  category: 'Unit Conversion',
  icon: 'rotate_right',
  keywords: ['torque', 'newton', 'meter', 'pound', 'foot', 'kilogram'],
  defaultFromUnit: 'newton-meter',
  defaultToUnit: 'pound-foot',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI - derived from N⋅m */
    { id: 'micronewton-meter', name: 'Micronewton-meter', symbol: 'μN⋅m', toBase: Nm * 1e-6 },
    { id: 'millinewton-meter', name: 'Millinewton-meter', symbol: 'mN⋅m', toBase: Nm * 0.001 },
    { id: 'newton-millimeter', name: 'Newton-millimeter', symbol: 'N⋅mm', toBase: deriveTorque(newton, L.millimeter) },
    { id: 'newton-centimeter', name: 'Newton-centimeter', symbol: 'N⋅cm', toBase: deriveTorque(newton, L.centimeter) },
    { id: 'newton-meter', name: 'Newton-meter', symbol: 'N⋅m', toBase: Nm },
    { id: 'kilonewton-meter', name: 'Kilonewton-meter', symbol: 'kN⋅m', toBase: Nm * 1000 },
    { id: 'meganewton-meter', name: 'Meganewton-meter', symbol: 'MN⋅m', toBase: Nm * 1e6 },
    
    /* CGS - dyne⋅cm */
    { id: 'dyne-millimeter', name: 'Dyne-millimeter', symbol: 'dyn⋅mm', toBase: deriveTorque(dyne, L.millimeter) },
    { id: 'dyne-centimeter', name: 'Dyne-centimeter', symbol: 'dyn⋅cm', toBase: deriveTorque(dyne, L.centimeter) },
    { id: 'dyne-meter', name: 'Dyne-meter', symbol: 'dyn⋅m', toBase: deriveTorque(dyne, L.meter) },
    
    /* Gravitational metric - kgf × length */
    { id: 'gram-millimeter', name: 'Gram-force-millimeter', symbol: 'gf⋅mm', toBase: deriveTorque(gf, L.millimeter) },
    { id: 'gram-centimeter', name: 'Gram-force-centimeter', symbol: 'gf⋅cm', toBase: deriveTorque(gf, L.centimeter) },
    { id: 'gram-meter', name: 'Gram-force-meter', symbol: 'gf⋅m', toBase: deriveTorque(gf, L.meter) },
    { id: 'kilogram-millimeter', name: 'Kilogram-force-millimeter', symbol: 'kgf⋅mm', toBase: deriveTorque(kgf, L.millimeter) },
    { id: 'kilogram-centimeter', name: 'Kilogram-force-centimeter', symbol: 'kgf⋅cm', toBase: deriveTorque(kgf, L.centimeter) },
    { id: 'kilogram-meter', name: 'Kilogram-force-meter', symbol: 'kgf⋅m', toBase: deriveTorque(kgf, L.meter) },
    
    /* Imperial - lbf × length */
    { id: 'ounce-inch', name: 'Ounce-force-inch', symbol: 'ozf⋅in', toBase: deriveTorque(ozf, L.inch) },
    { id: 'ounce-foot', name: 'Ounce-force-foot', symbol: 'ozf⋅ft', toBase: deriveTorque(ozf, L.foot) },
    { id: 'pound-inch', name: 'Pound-force-inch', symbol: 'lbf⋅in', toBase: deriveTorque(lbf, L.inch) },
    { id: 'pound-foot', name: 'Pound-force-foot', symbol: 'lbf⋅ft', toBase: deriveTorque(lbf, L.foot) },
    { id: 'kilopound-inch', name: 'Kilopound-force-inch', symbol: 'kip⋅in', toBase: deriveTorque(lbf * 1000, L.inch) },
    { id: 'kilopound-foot', name: 'Kilopound-force-foot', symbol: 'kip⋅ft', toBase: deriveTorque(lbf * 1000, L.foot) },
    
    /* Absolute imperial (using poundal) */
    { id: 'poundal-foot', name: 'Poundal-foot', symbol: 'pdl⋅ft', toBase: deriveTorque(deriveForce(M.pound, L.foot, T.second), L.foot) },
  ],
}

