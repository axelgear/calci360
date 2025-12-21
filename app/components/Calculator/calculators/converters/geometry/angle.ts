import type { ConverterConfig } from '../../types'
import { angleUnitsFull } from '../../units'

/**
 * Angle Converter - Base unit (like length/time/mass)
 * Base unit: radian (rad)
 */
export const angleConverter: ConverterConfig = {
  type: 'converter',
  name: 'Angle Converter',
  description: 'Convert between angle units including degrees, radians, gradians, and arcminutes',
  category: 'Unit Conversion',
  icon: 'architecture',
  keywords: ['angle', 'degree', 'radian', 'gradian', 'arcminute', 'arcsecond'],
  defaultFromUnit: 'degree',
  defaultToUnit: 'radian',
  precision: 8,
  showAllConversions: true,
  units: angleUnitsFull,
}

