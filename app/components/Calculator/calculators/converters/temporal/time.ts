import type { ConverterConfig } from '../../types'
import { timeUnitsFull } from '../../units'

/**
 * Time Converter - Base unit for speed, frequency, power, etc.
 * Base unit: second (s)
 */
export const timeConverter: ConverterConfig = {
  type: 'converter',
  name: 'Time Converter',
  description: 'Convert between time units including seconds, minutes, hours, days, weeks, months, and years',
  category: 'Unit Conversion',
  icon: 'schedule',
  keywords: ['time', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'],
  defaultFromUnit: 'hour',
  defaultToUnit: 'minute',
  precision: 6,
  showAllConversions: true,
  units: timeUnitsFull,
}

