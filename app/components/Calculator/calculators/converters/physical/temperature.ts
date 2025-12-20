import type { ConverterConfig, UnitConfig } from '../../types'
import { CELSIUS_OFFSET } from '../../base/constants'

/**
 * Temperature Converter - Special case with non-linear conversions
 * Base unit: Kelvin (K)
 * 
 * Temperature conversions are NOT simply multiplicative like other units.
 * Each scale has a different zero point, requiring custom conversion formulas.
 * 
 * Formulas (to Kelvin):
 * - Celsius:    K = C + 273.15
 * - Fahrenheit: K = (F + 459.67) × 5/9
 * - Rankine:    K = R × 5/9
 * - Réaumur:    K = Re × 5/4 + 273.15
 * - Delisle:    K = 373.15 - De × 2/3
 * - Newton:     K = N × 100/33 + 273.15
 * - Rømer:      K = (Rø - 7.5) × 40/21 + 273.15
 */

/* Special units with custom conversion functions */
const temperatureUnits: UnitConfig[] = [
  {
    id: 'kelvin',
    name: 'Kelvin',
    symbol: 'K',
    toBase: 1,
    toBaseCustom: (value: number) => value,
    fromBaseCustom: (value: number) => value,
  },
  {
    id: 'celsius',
    name: 'Celsius',
    symbol: '°C',
    toBase: 1, /* Placeholder, custom function used */
    toBaseCustom: (value: number) => value + CELSIUS_OFFSET,
    fromBaseCustom: (value: number) => value - CELSIUS_OFFSET,
  },
  {
    id: 'fahrenheit',
    name: 'Fahrenheit',
    symbol: '°F',
    toBase: 1, /* Placeholder, custom function used */
    toBaseCustom: (value: number) => (value + 459.67) * 5 / 9,
    fromBaseCustom: (value: number) => value * 9 / 5 - 459.67,
  },
  {
    id: 'rankine',
    name: 'Rankine',
    symbol: '°R',
    toBase: 5 / 9, /* K = R × 5/9 */
  },
  {
    id: 'reaumur',
    name: 'Réaumur',
    symbol: '°Ré',
    toBase: 1, /* Placeholder, custom function used */
    toBaseCustom: (value: number) => value * 5 / 4 + CELSIUS_OFFSET,
    fromBaseCustom: (value: number) => (value - CELSIUS_OFFSET) * 4 / 5,
  },
  {
    id: 'delisle',
    name: 'Delisle',
    symbol: '°De',
    toBase: 1, /* Placeholder, custom function used */
    toBaseCustom: (value: number) => 373.15 - value * 2 / 3,
    fromBaseCustom: (value: number) => (373.15 - value) * 3 / 2,
  },
  {
    id: 'newton-temp',
    name: 'Newton (temperature)',
    symbol: '°N',
    toBase: 1, /* Placeholder, custom function used */
    toBaseCustom: (value: number) => value * 100 / 33 + CELSIUS_OFFSET,
    fromBaseCustom: (value: number) => (value - CELSIUS_OFFSET) * 33 / 100,
  },
  {
    id: 'romer',
    name: 'Rømer',
    symbol: '°Rø',
    toBase: 1, /* Placeholder, custom function used */
    toBaseCustom: (value: number) => (value - 7.5) * 40 / 21 + CELSIUS_OFFSET,
    fromBaseCustom: (value: number) => (value - CELSIUS_OFFSET) * 21 / 40 + 7.5,
  },
  {
    id: 'planck-temperature',
    name: 'Planck Temperature',
    symbol: 'Tₚ',
    toBase: 1.416784e32, /* 1 Planck temperature = 1.416784×10³² K */
  },
]

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
  units: temperatureUnits,
}

