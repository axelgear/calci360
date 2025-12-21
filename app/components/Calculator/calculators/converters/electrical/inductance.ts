import type { ConverterConfig } from '../../types'
import { inductanceUnitsFull } from '../../units'

/**
 * Electrical Inductance Converter
 * Base unit: Henry (H)
 */
export const inductanceConverter: ConverterConfig = {
  type: 'converter',
  name: 'Electrical Inductance Converter',
  description: 'Convert between inductance units including henrys, millihenrys, microhenrys, and nanohenrys',
  category: 'Electrical',
  icon: 'trip_origin',
  keywords: ['inductance', 'henry', 'millihenry', 'microhenry', 'nanohenry', 'electricity', 'inductor', 'coil'],
  defaultFromUnit: 'millihenry',
  defaultToUnit: 'microhenry',
  precision: 9,
  showAllConversions: true,
  units: inductanceUnitsFull,
}
