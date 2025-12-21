import type { ConverterConfig } from '../../types'
import { volumeUnitsFull } from '../../units'

/**
 * Volume Converter - Derived from Length³ (length × length × length)
 * Base unit: cubic meter (m³)
 */
export const volumeConverter: ConverterConfig = {
  type: 'converter',
  name: 'Volume Converter',
  description: 'Convert between different volume units including liters, gallons, cubic meters, and fluid ounces',
  category: 'Unit Conversion',
  icon: 'water_drop',
  keywords: ['volume', 'liter', 'gallon', 'cubic', 'fluid', 'ounce'],
  defaultFromUnit: 'liter',
  defaultToUnit: 'gallon-us',
  precision: 6,
  showAllConversions: true,
  units: volumeUnitsFull,
}

