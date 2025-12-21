import type { ConverterConfig } from '../../types'
import { resistanceUnitsFull } from '../../units'

/**
 * Electrical Resistance Converter
 * Base unit: Ohm (Ω)
 */
export const resistanceConverter: ConverterConfig = {
  type: 'converter',
  name: 'Electrical Resistance Converter',
  description: 'Convert between resistance units including ohms, kilohms, and megohms',
  category: 'Electrical',
  icon: 'settings_input_component',
  keywords: ['resistance', 'ohm', 'kilohm', 'megohm', 'electricity', 'electrical', 'impedance'],
  defaultFromUnit: 'ohm',
  defaultToUnit: 'kiloohm',
  precision: 9,
  showAllConversions: true,
  units: resistanceUnitsFull,
}
