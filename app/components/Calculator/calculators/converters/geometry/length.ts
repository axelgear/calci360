import type { ConverterConfig } from '../../types'
import { lengthUnitsFull } from '../../units'

/**
 * Length Converter - Base unit for area, volume, speed, etc.
 * Base unit: meter (m)
 */
export const lengthConverter: ConverterConfig = {
  type: 'converter',
  name: 'Length Converter',
  description: 'Convert between different length and distance units including metric and imperial measurements',
  category: 'Unit Conversion',
  icon: 'straighten',
  keywords: ['length', 'distance', 'meter', 'feet', 'inches', 'miles', 'kilometers'],
  defaultFromUnit: 'meter',
  defaultToUnit: 'foot',
  precision: 6,
  showAllConversions: true,
  units: lengthUnitsFull,
}

