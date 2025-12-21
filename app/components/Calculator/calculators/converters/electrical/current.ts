import type { ConverterConfig } from '../../types'
import { currentUnitsFull } from '../../units'

/**
 * Electrical Current Converter
 * Base unit: Ampere (A)
 */
export const currentConverter: ConverterConfig = {
  type: 'converter',
  name: 'Electrical Current Converter',
  description: 'Convert between electrical current units including amperes, milliamperes, and microamperes',
  category: 'Electrical',
  icon: 'electrical_services',
  keywords: ['current', 'ampere', 'amp', 'milliamp', 'microamp', 'electricity', 'electrical'],
  defaultFromUnit: 'ampere',
  defaultToUnit: 'milliampere',
  precision: 9,
  showAllConversions: true,
  units: currentUnitsFull,
}
