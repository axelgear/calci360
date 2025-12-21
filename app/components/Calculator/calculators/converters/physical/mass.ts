import type { ConverterConfig } from '../../types'
import { massUnitsFull } from '../../units'

/**
 * Mass/Weight Converter - Base unit for force, energy, density, etc.
 * Base unit: kilogram (kg)
 */
export const massConverter: ConverterConfig = {
  type: 'converter',
  name: 'Mass/Weight Converter',
  description: 'Convert between different mass and weight units including kilograms, pounds, ounces, and tons',
  category: 'Unit Conversion',
  icon: 'scale',
  keywords: ['mass', 'weight', 'kilogram', 'pound', 'ounce', 'ton', 'gram'],
  defaultFromUnit: 'kilogram',
  defaultToUnit: 'pound',
  precision: 6,
  showAllConversions: true,
  units: massUnitsFull,
}

