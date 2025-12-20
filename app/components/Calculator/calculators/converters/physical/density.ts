import type { ConverterConfig } from '../../types'
import { length } from '../../base/length'
import { mass } from '../../base/mass'
import { deriveVolume, deriveDensity } from '../../base/derived'

/**
 * Density Converter - Derived from Mass / Volume (ρ = m / V)
 * Base unit: kilogram per cubic meter (kg/m³)
 * 
 * Formula: density_toBase = mass_toBase / length_toBase³
 */

const L = length
const M = mass

/* Volume helpers */
const m3 = deriveVolume(L.meter)
const cm3 = deriveVolume(L.centimeter)
const mm3 = deriveVolume(L.millimeter)
const ft3 = deriveVolume(L.foot)
const in3 = deriveVolume(L.inch)
const dm3 = deriveVolume(L.decimeter) /* = 1 liter */
const galUS = 231 * in3
const galUK = 4.54609 * dm3

export const densityConverter: ConverterConfig = {
  type: 'converter',
  name: 'Density Converter',
  description: 'Convert between density units including kg/m³, g/cm³, lb/ft³, and lb/in³',
  category: 'Unit Conversion',
  icon: 'science',
  keywords: ['density', 'kilogram', 'meter', 'gram', 'cubic', 'pound'],
  defaultFromUnit: 'kilogram-per-cubic-meter',
  defaultToUnit: 'gram-per-cubic-centimeter',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI - derived from mass/length³ */
    { id: 'kilogram-per-cubic-meter', name: 'Kilogram per Cubic Meter', symbol: 'kg/m³', toBase: deriveDensity(M.kilogram, m3) },
    { id: 'gram-per-cubic-meter', name: 'Gram per Cubic Meter', symbol: 'g/m³', toBase: deriveDensity(M.gram, m3) },
    { id: 'gram-per-cubic-centimeter', name: 'Gram per Cubic Centimeter', symbol: 'g/cm³', toBase: deriveDensity(M.gram, cm3) },
    { id: 'gram-per-cubic-millimeter', name: 'Gram per Cubic Millimeter', symbol: 'g/mm³', toBase: deriveDensity(M.gram, mm3) },
    { id: 'kilogram-per-cubic-centimeter', name: 'Kilogram per Cubic Centimeter', symbol: 'kg/cm³', toBase: deriveDensity(M.kilogram, cm3) },
    { id: 'kilogram-per-cubic-decimeter', name: 'Kilogram per Cubic Decimeter', symbol: 'kg/dm³', toBase: deriveDensity(M.kilogram, dm3) },
    { id: 'megagram-per-cubic-meter', name: 'Megagram per Cubic Meter', symbol: 'Mg/m³', toBase: deriveDensity(M['metric-ton'], m3) },
    
    /* Liter-based (1 L = 1 dm³) */
    { id: 'milligram-per-milliliter', name: 'Milligram per Milliliter', symbol: 'mg/mL', toBase: deriveDensity(M.milligram, dm3 / 1000) },
    { id: 'gram-per-milliliter', name: 'Gram per Milliliter', symbol: 'g/mL', toBase: deriveDensity(M.gram, dm3 / 1000) },
    { id: 'kilogram-per-liter', name: 'Kilogram per Liter', symbol: 'kg/L', toBase: deriveDensity(M.kilogram, dm3) },
    { id: 'gram-per-liter', name: 'Gram per Liter', symbol: 'g/L', toBase: deriveDensity(M.gram, dm3) },
    { id: 'milligram-per-liter', name: 'Milligram per Liter', symbol: 'mg/L', toBase: deriveDensity(M.milligram, dm3) },
    { id: 'microgram-per-liter', name: 'Microgram per Liter', symbol: 'μg/L', toBase: deriveDensity(M.microgram, dm3) },
    
    /* Imperial - derived from mass/length³ */
    { id: 'pound-per-cubic-foot', name: 'Pound per Cubic Foot', symbol: 'lb/ft³', toBase: deriveDensity(M.pound, ft3) },
    { id: 'pound-per-cubic-inch', name: 'Pound per Cubic Inch', symbol: 'lb/in³', toBase: deriveDensity(M.pound, in3) },
    { id: 'pound-per-cubic-yard', name: 'Pound per Cubic Yard', symbol: 'lb/yd³', toBase: deriveDensity(M.pound, deriveVolume(L.yard)) },
    { id: 'ounce-per-cubic-inch', name: 'Ounce per Cubic Inch', symbol: 'oz/in³', toBase: deriveDensity(M.ounce, in3) },
    { id: 'ounce-per-cubic-foot', name: 'Ounce per Cubic Foot', symbol: 'oz/ft³', toBase: deriveDensity(M.ounce, ft3) },
    
    /* Gallon-based */
    { id: 'pound-per-gallon-us', name: 'Pound per Gallon (US)', symbol: 'lb/gal', toBase: deriveDensity(M.pound, galUS) },
    { id: 'pound-per-gallon-uk', name: 'Pound per Gallon (UK)', symbol: 'lb/gal (UK)', toBase: deriveDensity(M.pound, galUK) },
    { id: 'ounce-per-gallon-us', name: 'Ounce per Gallon (US)', symbol: 'oz/gal', toBase: deriveDensity(M.ounce, galUS) },
    { id: 'ounce-per-gallon-uk', name: 'Ounce per Gallon (UK)', symbol: 'oz/gal (UK)', toBase: deriveDensity(M.ounce, galUK) },
    
    /* Engineering */
    { id: 'slug-per-cubic-foot', name: 'Slug per Cubic Foot', symbol: 'slug/ft³', toBase: deriveDensity(M.slug, ft3) },
    { id: 'tonne-per-cubic-meter', name: 'Tonne per Cubic Meter', symbol: 't/m³', toBase: deriveDensity(M['metric-ton'], m3) },
    { id: 'long-ton-per-cubic-yard', name: 'Long Ton per Cubic Yard', symbol: 'ton/yd³ (UK)', toBase: deriveDensity(M['long-ton'], deriveVolume(L.yard)) },
    { id: 'short-ton-per-cubic-yard', name: 'Short Ton per Cubic Yard', symbol: 'ton/yd³ (US)', toBase: deriveDensity(M['short-ton'], deriveVolume(L.yard)) },
    
    /* Specific gravity (relative to water at 4°C, where water = 1000 kg/m³) */
    { id: 'specific-gravity', name: 'Specific Gravity (water=1)', symbol: 'SG', toBase: 1000 }, /* relative to water */
  ],
}

