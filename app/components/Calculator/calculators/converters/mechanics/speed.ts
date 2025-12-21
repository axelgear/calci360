import type { ConverterConfig } from '../../types'
import { length, time, deriveSpeed, SPEED_OF_LIGHT, SPEED_OF_SOUND } from '../../units'

/**
 * Speed/Velocity Converter - Derived from Length / Time
 * Base unit: meter per second (m/s)
 * 
 * Formula: speed_toBase = length_toBase / time_toBase
 */

const L = length
const T = time

export const speedConverter: ConverterConfig = {
  type: 'converter',
  name: 'Speed/Velocity Converter',
  description: 'Convert between speed units including m/s, km/h, mph, knots, and Mach number',
  category: 'Unit Conversion',
  icon: 'speed',
  keywords: ['speed', 'velocity', 'meter', 'kilometer', 'mile', 'knot', 'mach'],
  defaultFromUnit: 'kilometer-per-hour',
  defaultToUnit: 'mile-per-hour',
  precision: 6,
  showAllConversions: true,
  units: [
    /* Metric - derived from length/time */
    { id: 'millimeter-per-second', name: 'Millimeter per Second', symbol: 'mm/s', toBase: deriveSpeed(L.millimeter, T.second) },
    { id: 'centimeter-per-second', name: 'Centimeter per Second', symbol: 'cm/s', toBase: deriveSpeed(L.centimeter, T.second) },
    { id: 'meter-per-second', name: 'Meter per Second', symbol: 'm/s', toBase: deriveSpeed(L.meter, T.second) },
    { id: 'meter-per-minute', name: 'Meter per Minute', symbol: 'm/min', toBase: deriveSpeed(L.meter, T.minute) },
    { id: 'meter-per-hour', name: 'Meter per Hour', symbol: 'm/h', toBase: deriveSpeed(L.meter, T.hour) },
    { id: 'kilometer-per-second', name: 'Kilometer per Second', symbol: 'km/s', toBase: deriveSpeed(L.kilometer, T.second) },
    { id: 'kilometer-per-minute', name: 'Kilometer per Minute', symbol: 'km/min', toBase: deriveSpeed(L.kilometer, T.minute) },
    { id: 'kilometer-per-hour', name: 'Kilometer per Hour', symbol: 'km/h', toBase: deriveSpeed(L.kilometer, T.hour) },
    
    /* Imperial - derived from length/time */
    { id: 'inch-per-second', name: 'Inch per Second', symbol: 'in/s', toBase: deriveSpeed(L.inch, T.second) },
    { id: 'foot-per-second', name: 'Foot per Second', symbol: 'ft/s', toBase: deriveSpeed(L.foot, T.second) },
    { id: 'foot-per-minute', name: 'Foot per Minute', symbol: 'ft/min', toBase: deriveSpeed(L.foot, T.minute) },
    { id: 'foot-per-hour', name: 'Foot per Hour', symbol: 'ft/h', toBase: deriveSpeed(L.foot, T.hour) },
    { id: 'yard-per-second', name: 'Yard per Second', symbol: 'yd/s', toBase: deriveSpeed(L.yard, T.second) },
    { id: 'mile-per-second', name: 'Mile per Second', symbol: 'mi/s', toBase: deriveSpeed(L.mile, T.second) },
    { id: 'mile-per-minute', name: 'Mile per Minute', symbol: 'mi/min', toBase: deriveSpeed(L.mile, T.minute) },
    { id: 'mile-per-hour', name: 'Mile per Hour', symbol: 'mph', toBase: deriveSpeed(L.mile, T.hour) },
    
    /* Nautical - derived from nautical mile/hour */
    { id: 'knot', name: 'Knot', symbol: 'kn', toBase: deriveSpeed(L['nautical-mile'], T.hour) },
    { id: 'knot-admiralty', name: 'Knot (Admiralty)', symbol: 'kn (Adm)', toBase: 1853.184 / T.hour },
    
    /* Physics constants */
    { id: 'mach', name: 'Mach (at sea level)', symbol: 'Ma', toBase: SPEED_OF_SOUND },
    { id: 'speed-of-light', name: 'Speed of Light', symbol: 'c', toBase: SPEED_OF_LIGHT },

    /* Astronomical */
    { id: 'earth-velocity', name: 'Earth Orbital Velocity', symbol: 'v⊕', toBase: 29780 }, /* m/s around Sun */
    { id: 'cosmic-velocity-1', name: 'First Cosmic Velocity', symbol: 'v₁', toBase: 7910 }, /* Earth orbit */
    { id: 'cosmic-velocity-2', name: 'Second Cosmic Velocity', symbol: 'v₂', toBase: 11186 }, /* Earth escape */
    { id: 'cosmic-velocity-3', name: 'Third Cosmic Velocity', symbol: 'v₃', toBase: 16650 }, /* Solar escape */
  ],
}

