/**
 * Temperature Unit Definitions
 * Base unit: Kelvin (K)
 * 
 * Temperature is special - conversions are NOT simple multiplication.
 * Each scale has a different zero point requiring custom conversion formulas.
 */

import type { UnitOption } from './types'

/* ========== CONSTANTS ========== */
export const CELSIUS_OFFSET = 273.15
export const FAHRENHEIT_OFFSET = 459.67

/* ========== CONVERSION FUNCTIONS ========== */

/** Convert any temperature to Kelvin (base unit) */
export function toKelvin(value: number, fromUnit: string): number {
  switch (fromUnit) {
    case 'kelvin': return value
    case 'celsius': return value + CELSIUS_OFFSET
    case 'fahrenheit': return (value + FAHRENHEIT_OFFSET) * 5 / 9
    case 'rankine': return value * 5 / 9
    case 'reaumur': return value * 5 / 4 + CELSIUS_OFFSET
    case 'delisle': return 373.15 - value * 2 / 3
    case 'newton-temp': return value * 100 / 33 + CELSIUS_OFFSET
    case 'romer': return (value - 7.5) * 40 / 21 + CELSIUS_OFFSET
    default: return value + CELSIUS_OFFSET
  }
}

/** Convert Kelvin to any temperature unit */
export function fromKelvin(kelvin: number, toUnit: string): number {
  switch (toUnit) {
    case 'kelvin': return kelvin
    case 'celsius': return kelvin - CELSIUS_OFFSET
    case 'fahrenheit': return kelvin * 9 / 5 - FAHRENHEIT_OFFSET
    case 'rankine': return kelvin * 9 / 5
    case 'reaumur': return (kelvin - CELSIUS_OFFSET) * 4 / 5
    case 'delisle': return (373.15 - kelvin) * 3 / 2
    case 'newton-temp': return (kelvin - CELSIUS_OFFSET) * 33 / 100
    case 'romer': return (kelvin - CELSIUS_OFFSET) * 21 / 40 + 7.5
    default: return kelvin - CELSIUS_OFFSET
  }
}

/** Convert between any two temperature units */
export function convertTemperature(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value
  const kelvin = toKelvin(value, fromUnit)
  return fromKelvin(kelvin, toUnit)
}

/** Convert temperature difference (delta) - different from absolute conversion */
export function convertTempDelta(delta: number, fromUnit: string, toUnit: string): number {
  /* Celsius and Kelvin have same delta (1°C = 1K difference) */
  /* Fahrenheit: 1°C = 1.8°F difference */
  const celsiusDelta = fromUnit === 'fahrenheit' ? delta / 1.8 : delta
  return toUnit === 'fahrenheit' ? celsiusDelta * 1.8 : celsiusDelta
}

/* ========== EXTENDED UNIT OPTION TYPE ========== */
export interface TemperatureUnitOption extends UnitOption {
  toBaseCustom?: (value: number) => number
  fromBaseCustom?: (value: number) => number
}

/* ========== UNIT OPTION ARRAYS ========== */

/** Common temperature units for calculators */
export const temperatureUnitsCommon: TemperatureUnitOption[] = [
  { 
    id: 'celsius', 
    name: 'Celsius', 
    symbol: '°C', 
    toBase: 1,
    toBaseCustom: (v) => v + CELSIUS_OFFSET,
    fromBaseCustom: (v) => v - CELSIUS_OFFSET,
  },
  { 
    id: 'fahrenheit', 
    name: 'Fahrenheit', 
    symbol: '°F', 
    toBase: 1,
    toBaseCustom: (v) => (v + FAHRENHEIT_OFFSET) * 5 / 9,
    fromBaseCustom: (v) => v * 9 / 5 - FAHRENHEIT_OFFSET,
  },
  { 
    id: 'kelvin', 
    name: 'Kelvin', 
    symbol: 'K', 
    toBase: 1,
    toBaseCustom: (v) => v,
    fromBaseCustom: (v) => v,
  },
]

/** Full temperature units for converter */
export const temperatureUnitsFull: TemperatureUnitOption[] = [
  ...temperatureUnitsCommon,
  { 
    id: 'rankine', 
    name: 'Rankine', 
    symbol: '°R', 
    toBase: 5 / 9,
    toBaseCustom: (v) => v * 5 / 9,
    fromBaseCustom: (v) => v * 9 / 5,
  },
  { 
    id: 'reaumur', 
    name: 'Réaumur', 
    symbol: '°Ré', 
    toBase: 1,
    toBaseCustom: (v) => v * 5 / 4 + CELSIUS_OFFSET,
    fromBaseCustom: (v) => (v - CELSIUS_OFFSET) * 4 / 5,
  },
  { 
    id: 'delisle', 
    name: 'Delisle', 
    symbol: '°De', 
    toBase: 1,
    toBaseCustom: (v) => 373.15 - v * 2 / 3,
    fromBaseCustom: (v) => (373.15 - v) * 3 / 2,
  },
  { 
    id: 'newton-temp', 
    name: 'Newton (temperature)', 
    symbol: '°N', 
    toBase: 1,
    toBaseCustom: (v) => v * 100 / 33 + CELSIUS_OFFSET,
    fromBaseCustom: (v) => (v - CELSIUS_OFFSET) * 33 / 100,
  },
  { 
    id: 'romer', 
    name: 'Rømer', 
    symbol: '°Rø', 
    toBase: 1,
    toBaseCustom: (v) => (v - 7.5) * 40 / 21 + CELSIUS_OFFSET,
    fromBaseCustom: (v) => (v - CELSIUS_OFFSET) * 21 / 40 + 7.5,
  },
  {
    id: 'planck-temperature',
    name: 'Planck Temperature',
    symbol: 'Tₚ',
    toBase: 1.416784e32,
    toBaseCustom: (v) => v * 1.416784e32,
    fromBaseCustom: (v) => v / 1.416784e32,
  },
]

/** Default temperature unit */
export const defaultTemperatureUnit: TemperatureUnitOption = {
  id: 'celsius',
  name: 'Celsius',
  symbol: '°C',
  toBase: 1,
  toBaseCustom: (v) => v + CELSIUS_OFFSET,
  fromBaseCustom: (v) => v - CELSIUS_OFFSET,
}

