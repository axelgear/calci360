import type { ConverterConfig } from '../../types'
import { dataUnitsFull } from '../../units'

/**
 * Data Storage Converter
 * Base unit: bit (b)
 */
export const dataConverter: ConverterConfig = {
  type: 'converter',
  name: 'Data Storage Converter',
  description: 'Convert between data storage units including bytes, kilobytes, megabytes, gigabytes, and terabytes',
  category: 'Unit Conversion',
  icon: 'storage',
  keywords: ['data', 'storage', 'byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'],
  defaultFromUnit: 'gigabyte',
  defaultToUnit: 'megabyte',
  precision: 6,
  showAllConversions: true,
  units: dataUnitsFull,
}

