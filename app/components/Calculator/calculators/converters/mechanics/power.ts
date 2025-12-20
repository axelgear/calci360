import type { ConverterConfig } from '../../types'
import { length } from '../../base/length'
import { time } from '../../base/time'
import { mass } from '../../base/mass'
import { STANDARD_GRAVITY } from '../../base/constants'
import { derivePower, deriveEnergyDirect } from '../../base/derived'

/**
 * Power Converter - Derived from Energy / Time (P = E / t)
 * Base unit: Watt (W = J/s = kg⋅m²/s³)
 * 
 * Formula: power_toBase = mass_toBase × length_toBase² / time_toBase³
 */

const L = length
const T = time
const M = mass
const g = STANDARD_GRAVITY

/* Joule per second = Watt */
const joule = deriveEnergyDirect(M.kilogram, L.meter, T.second)
const watt = derivePower(joule, T.second)

/* Calorie per second */
const calPerSec = 4.184 * watt

/* BTU per hour */
const btuPerHour = 1055.05585262 * watt / T.hour

/* Horsepower (mechanical): 550 ft⋅lbf/s */
const hpMech = 550 * M.pound * g * L.foot / T.second

/* Horsepower (metric): 75 kgf⋅m/s */
const hpMetric = 75 * M.kilogram * g * L.meter / T.second

export const powerConverter: ConverterConfig = {
  type: 'converter',
  name: 'Power Converter',
  description: 'Convert between power units including Watts, horsepower, BTU/hour, and kilowatts',
  category: 'Unit Conversion',
  icon: 'electric_bolt',
  keywords: ['power', 'watt', 'horsepower', 'kilowatt', 'btu', 'hp'],
  defaultFromUnit: 'watt',
  defaultToUnit: 'horsepower',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI - derived from kg⋅m²/s³ */
    { id: 'nanowatt', name: 'Nanowatt', symbol: 'nW', toBase: watt * 1e-9 },
    { id: 'microwatt', name: 'Microwatt', symbol: 'μW', toBase: watt * 1e-6 },
    { id: 'milliwatt', name: 'Milliwatt', symbol: 'mW', toBase: watt * 0.001 },
    { id: 'watt', name: 'Watt', symbol: 'W', toBase: watt },
    { id: 'kilowatt', name: 'Kilowatt', symbol: 'kW', toBase: watt * 1000 },
    { id: 'megawatt', name: 'Megawatt', symbol: 'MW', toBase: watt * 1e6 },
    { id: 'gigawatt', name: 'Gigawatt', symbol: 'GW', toBase: watt * 1e9 },
    { id: 'terawatt', name: 'Terawatt', symbol: 'TW', toBase: watt * 1e12 },
    
    /* Horsepower variants */
    { id: 'horsepower', name: 'Horsepower (mechanical)', symbol: 'hp', toBase: hpMech },
    { id: 'horsepower-metric', name: 'Horsepower (metric)', symbol: 'PS', toBase: hpMetric },
    { id: 'horsepower-electric', name: 'Horsepower (electric)', symbol: 'hp(E)', toBase: 746 * watt },
    { id: 'horsepower-boiler', name: 'Horsepower (boiler)', symbol: 'hp(S)', toBase: 9809.5 * watt },
    { id: 'horsepower-water', name: 'Horsepower (water)', symbol: 'hp (water)', toBase: 746.043 * watt },
    { id: 'pferdestärke', name: 'Pferdestärke', symbol: 'PS', toBase: hpMetric }, /* German metric hp */
    
    /* BTU-based */
    { id: 'btu-per-second', name: 'BTU per Second', symbol: 'BTU/s', toBase: 1055.05585262 * watt },
    { id: 'btu-per-minute', name: 'BTU per Minute', symbol: 'BTU/min', toBase: 1055.05585262 * watt / 60 },
    { id: 'btu-per-hour', name: 'BTU per Hour', symbol: 'BTU/h', toBase: btuPerHour },
    { id: 'mbtu-per-hour', name: 'MBTU per Hour', symbol: 'MBTU/h', toBase: btuPerHour * 1000 },
    { id: 'mmbtu-per-hour', name: 'MMBTU per Hour', symbol: 'MMBTU/h', toBase: btuPerHour * 1e6 },
    
    /* Refrigeration */
    { id: 'ton-refrigeration', name: 'Ton of Refrigeration', symbol: 'TR', toBase: 12000 * btuPerHour },
    { id: 'ton-refrigeration-it', name: 'Ton of Refrigeration (IT)', symbol: 'TR (IT)', toBase: 3516.853 * watt },
    
    /* Calorie-based */
    { id: 'calorie-per-second', name: 'Calorie per Second', symbol: 'cal/s', toBase: calPerSec },
    { id: 'calorie-per-minute', name: 'Calorie per Minute', symbol: 'cal/min', toBase: calPerSec / 60 },
    { id: 'calorie-per-hour', name: 'Calorie per Hour', symbol: 'cal/h', toBase: calPerSec / T.hour },
    { id: 'kilocalorie-per-second', name: 'Kilocalorie per Second', symbol: 'kcal/s', toBase: calPerSec * 1000 },
    { id: 'kilocalorie-per-hour', name: 'Kilocalorie per Hour', symbol: 'kcal/h', toBase: calPerSec * 1000 / T.hour },
    
    /* Foot-pound per time */
    { id: 'foot-pound-per-second', name: 'Foot-pound per Second', symbol: 'ft⋅lbf/s', toBase: M.pound * g * L.foot / T.second },
    { id: 'foot-pound-per-minute', name: 'Foot-pound per Minute', symbol: 'ft⋅lbf/min', toBase: M.pound * g * L.foot / T.minute },
    { id: 'foot-pound-per-hour', name: 'Foot-pound per Hour', symbol: 'ft⋅lbf/h', toBase: M.pound * g * L.foot / T.hour },
    
    /* CGS */
    { id: 'erg-per-second', name: 'Erg per Second', symbol: 'erg/s', toBase: deriveEnergyDirect(M.gram, L.centimeter, T.second) / T.second },
    
    /* Convenience */
    { id: 'joule-per-second', name: 'Joule per Second', symbol: 'J/s', toBase: watt },
    { id: 'joule-per-minute', name: 'Joule per Minute', symbol: 'J/min', toBase: watt / 60 },
    { id: 'joule-per-hour', name: 'Joule per Hour', symbol: 'J/h', toBase: watt / T.hour },
    { id: 'kilojoule-per-hour', name: 'Kilojoule per Hour', symbol: 'kJ/h', toBase: watt * 1000 / T.hour },
    { id: 'megajoule-per-hour', name: 'Megajoule per Hour', symbol: 'MJ/h', toBase: watt * 1e6 / T.hour },
    
    /* Volt-ampere (electrical) */
    { id: 'volt-ampere', name: 'Volt-ampere', symbol: 'VA', toBase: watt },
    { id: 'kilovolt-ampere', name: 'Kilovolt-ampere', symbol: 'kVA', toBase: watt * 1000 },
    { id: 'megavolt-ampere', name: 'Megavolt-ampere', symbol: 'MVA', toBase: watt * 1e6 },
    
    /* Solar */
    { id: 'solar-luminosity', name: 'Solar Luminosity', symbol: 'L☉', toBase: 3.828e26 * watt },
  ],
}

