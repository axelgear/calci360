import type { ConverterConfig } from '../../types'
import { capacitanceUnitsFull } from '../../units'

/**
 * Electrical Capacitance Converter
 * Base unit: Farad (F)
 */
export const capacitanceConverter: ConverterConfig = {
  type: 'converter',
  name: 'Electrical Capacitance Converter',
  description: 'Convert between capacitance units including farads, microfarads, nanofarads, and picofarads',
  category: 'Electrical',
  icon: 'battery_charging_full',
  keywords: ['capacitance', 'farad', 'microfarad', 'nanofarad', 'picofarad', 'electricity', 'capacitor'],
  defaultFromUnit: 'microfarad',
  defaultToUnit: 'nanofarad',
  precision: 12,
  showAllConversions: true,
  units: capacitanceUnitsFull,
}
