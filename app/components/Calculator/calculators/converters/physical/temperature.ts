import type { ConverterConfig } from '../../types'
import { temperatureUnitsFull } from '../../units'

/**
 * Temperature Converter - Special case with non-linear conversions
 * Base unit: Kelvin (K)
 * 
 * Temperature conversions are NOT simply multiplicative like other units.
 * Each scale has a different zero point, requiring custom conversion formulas.
 * 
 * Units are defined in calculators/units/temperature.ts
 */

export const temperatureConverter: ConverterConfig = {
  type: 'converter',
  name: 'Temperature Converter',
  description: 'Convert between temperature scales including Celsius, Fahrenheit, Kelvin, and Rankine',
  category: 'Unit Conversion',
  icon: 'thermostat',
  keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'rankine', 'degrees'],
  defaultFromUnit: 'celsius',
  defaultToUnit: 'fahrenheit',
  precision: 4,
  showAllConversions: true,
  units: temperatureUnitsFull,
}
