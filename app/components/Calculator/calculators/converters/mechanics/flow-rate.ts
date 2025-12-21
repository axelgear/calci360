import type { ConverterConfig } from '../../types'
import { length, time, deriveVolume, deriveVolumetricFlowRate } from '../../units'

/**
 * Flow Rate Converter - Derived from Volume / Time (Q = V / t)
 * Base unit: cubic meter per second (m³/s)
 * 
 * Formula: flowRate_toBase = length_toBase³ / time_toBase
 */

const L = length
const T = time

/* Volume helpers */
const m3 = deriveVolume(L.meter)
const dm3 = deriveVolume(L.decimeter) /* = 1 liter */
const cm3 = deriveVolume(L.centimeter)
const ft3 = deriveVolume(L.foot)
const in3 = deriveVolume(L.inch)
const galUS = 231 * in3 /* US gallon = 231 cubic inches */
const galUK = 4.54609 * dm3 /* UK gallon = 4.54609 liters */
const bblOil = 42 * galUS /* Oil barrel = 42 US gallons */
const acreFt = 43560 * deriveVolume(L.foot) /* Acre-foot */

export const flowRateConverter: ConverterConfig = {
  type: 'converter',
  name: 'Flow Rate Converter',
  description: 'Convert between volumetric flow rate units including L/min, GPM, CFM, and m³/h',
  category: 'Unit Conversion',
  icon: 'water',
  keywords: ['flow', 'rate', 'liter', 'gallon', 'cubic', 'minute', 'second'],
  defaultFromUnit: 'liter-per-minute',
  defaultToUnit: 'gallon-per-minute',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI - derived from m³/time */
    { id: 'cubic-meter-per-second', name: 'Cubic Meter per Second', symbol: 'm³/s', toBase: deriveVolumetricFlowRate(m3, T.second) },
    { id: 'cubic-meter-per-minute', name: 'Cubic Meter per Minute', symbol: 'm³/min', toBase: deriveVolumetricFlowRate(m3, T.minute) },
    { id: 'cubic-meter-per-hour', name: 'Cubic Meter per Hour', symbol: 'm³/h', toBase: deriveVolumetricFlowRate(m3, T.hour) },
    { id: 'cubic-meter-per-day', name: 'Cubic Meter per Day', symbol: 'm³/d', toBase: deriveVolumetricFlowRate(m3, T.day) },
    
    /* Cubic centimeter */
    { id: 'cubic-centimeter-per-second', name: 'Cubic Centimeter per Second', symbol: 'cm³/s', toBase: deriveVolumetricFlowRate(cm3, T.second) },
    { id: 'cubic-centimeter-per-minute', name: 'Cubic Centimeter per Minute', symbol: 'cm³/min', toBase: deriveVolumetricFlowRate(cm3, T.minute) },
    
    /* Liters - derived from dm³/time */
    { id: 'milliliter-per-second', name: 'Milliliter per Second', symbol: 'mL/s', toBase: deriveVolumetricFlowRate(dm3 / 1000, T.second) },
    { id: 'milliliter-per-minute', name: 'Milliliter per Minute', symbol: 'mL/min', toBase: deriveVolumetricFlowRate(dm3 / 1000, T.minute) },
    { id: 'milliliter-per-hour', name: 'Milliliter per Hour', symbol: 'mL/h', toBase: deriveVolumetricFlowRate(dm3 / 1000, T.hour) },
    { id: 'liter-per-second', name: 'Liter per Second', symbol: 'L/s', toBase: deriveVolumetricFlowRate(dm3, T.second) },
    { id: 'liter-per-minute', name: 'Liter per Minute', symbol: 'L/min', toBase: deriveVolumetricFlowRate(dm3, T.minute) },
    { id: 'liter-per-hour', name: 'Liter per Hour', symbol: 'L/h', toBase: deriveVolumetricFlowRate(dm3, T.hour) },
    { id: 'liter-per-day', name: 'Liter per Day', symbol: 'L/d', toBase: deriveVolumetricFlowRate(dm3, T.day) },
    { id: 'kiloliter-per-hour', name: 'Kiloliter per Hour', symbol: 'kL/h', toBase: deriveVolumetricFlowRate(dm3 * 1000, T.hour) },
    { id: 'megaliter-per-day', name: 'Megaliter per Day', symbol: 'ML/d', toBase: deriveVolumetricFlowRate(dm3 * 1e6, T.day) },
    
    /* US Gallons - derived from galUS/time */
    { id: 'gallon-per-second', name: 'Gallon per Second (US)', symbol: 'gal/s', toBase: deriveVolumetricFlowRate(galUS, T.second) },
    { id: 'gallon-per-minute', name: 'Gallon per Minute (US)', symbol: 'GPM', toBase: deriveVolumetricFlowRate(galUS, T.minute) },
    { id: 'gallon-per-hour', name: 'Gallon per Hour (US)', symbol: 'gal/h', toBase: deriveVolumetricFlowRate(galUS, T.hour) },
    { id: 'gallon-per-day', name: 'Gallon per Day (US)', symbol: 'gal/d', toBase: deriveVolumetricFlowRate(galUS, T.day) },
    { id: 'million-gallon-per-day', name: 'Million Gallon per Day (US)', symbol: 'MGD', toBase: deriveVolumetricFlowRate(galUS * 1e6, T.day) },
    
    /* UK Gallons */
    { id: 'gallon-per-minute-uk', name: 'Gallon per Minute (UK)', symbol: 'GPM (UK)', toBase: deriveVolumetricFlowRate(galUK, T.minute) },
    { id: 'gallon-per-hour-uk', name: 'Gallon per Hour (UK)', symbol: 'gal/h (UK)', toBase: deriveVolumetricFlowRate(galUK, T.hour) },
    
    /* Cubic feet - derived from ft³/time */
    { id: 'cubic-foot-per-second', name: 'Cubic Foot per Second', symbol: 'ft³/s', toBase: deriveVolumetricFlowRate(ft3, T.second) },
    { id: 'cubic-foot-per-minute', name: 'Cubic Foot per Minute', symbol: 'CFM', toBase: deriveVolumetricFlowRate(ft3, T.minute) },
    { id: 'cubic-foot-per-hour', name: 'Cubic Foot per Hour', symbol: 'ft³/h', toBase: deriveVolumetricFlowRate(ft3, T.hour) },
    { id: 'cubic-foot-per-day', name: 'Cubic Foot per Day', symbol: 'ft³/d', toBase: deriveVolumetricFlowRate(ft3, T.day) },
    
    /* Cubic inch */
    { id: 'cubic-inch-per-second', name: 'Cubic Inch per Second', symbol: 'in³/s', toBase: deriveVolumetricFlowRate(in3, T.second) },
    { id: 'cubic-inch-per-minute', name: 'Cubic Inch per Minute', symbol: 'in³/min', toBase: deriveVolumetricFlowRate(in3, T.minute) },
    
    /* Industry specific */
    { id: 'barrel-per-second', name: 'Barrel per Second (Oil)', symbol: 'bbl/s', toBase: deriveVolumetricFlowRate(bblOil, T.second) },
    { id: 'barrel-per-minute', name: 'Barrel per Minute (Oil)', symbol: 'bbl/min', toBase: deriveVolumetricFlowRate(bblOil, T.minute) },
    { id: 'barrel-per-hour', name: 'Barrel per Hour (Oil)', symbol: 'bbl/h', toBase: deriveVolumetricFlowRate(bblOil, T.hour) },
    { id: 'barrel-per-day', name: 'Barrel per Day (Oil)', symbol: 'bbl/d', toBase: deriveVolumetricFlowRate(bblOil, T.day) },
    { id: 'acre-foot-per-day', name: 'Acre-foot per Day', symbol: 'ac⋅ft/d', toBase: deriveVolumetricFlowRate(acreFt, T.day) },
    { id: 'acre-foot-per-year', name: 'Acre-foot per Year', symbol: 'ac⋅ft/yr', toBase: deriveVolumetricFlowRate(acreFt, T.year) },
  ],
}

