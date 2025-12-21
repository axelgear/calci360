import type { ConverterConfig } from '../../types'
import { voltageUnitsFull } from '../../units'

/**
 * Electrical Voltage Converter
 * Base unit: Volt (V)
 */
export const voltageConverter: ConverterConfig = {
  type: 'converter',
  name: 'Electrical Voltage Converter',
  description: 'Convert between voltage units including volts, millivolts, kilovolts, and megavolts',
  category: 'Electrical',
  icon: 'flash_on',
  keywords: ['voltage', 'volt', 'millivolt', 'kilovolt', 'electricity', 'electrical', 'potential'],
  defaultFromUnit: 'volt',
  defaultToUnit: 'millivolt',
  precision: 9,
  showAllConversions: true,
  units: voltageUnitsFull,
}
