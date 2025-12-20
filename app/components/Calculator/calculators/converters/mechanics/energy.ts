import type { ConverterConfig } from '../../types'
import { length } from '../../base/length'
import { time } from '../../base/time'
import { mass } from '../../base/mass'
import { STANDARD_GRAVITY, ELEMENTARY_CHARGE } from '../../base/constants'
import { deriveEnergyDirect } from '../../base/derived'

/**
 * Energy Converter - Derived from Force × Distance (E = F × d)
 * Base unit: Joule (J = N⋅m = kg⋅m²/s²)
 * 
 * Formula: energy_toBase = mass_toBase × length_toBase² / time_toBase²
 */

const L = length
const T = time
const M = mass
const g = STANDARD_GRAVITY

/* Joule: 1 J = 1 kg × 1 m² / 1 s² */
const joule = deriveEnergyDirect(M.kilogram, L.meter, T.second)

/* Calorie (thermochemical): defined as 4.184 J exactly */
const calorie = 4.184 * joule

/* BTU (IT): defined as 1055.05585262 J */
const btu = 1055.05585262 * joule

/* Electronvolt: defined as elementary charge × 1 V = 1.602176634e-19 J exactly */
const eV = ELEMENTARY_CHARGE * joule

export const energyConverter: ConverterConfig = {
  type: 'converter',
  name: 'Energy Converter',
  description: 'Convert between energy units including Joules, calories, kilowatt-hours, and BTU',
  category: 'Unit Conversion',
  icon: 'bolt',
  keywords: ['energy', 'joule', 'calorie', 'kilowatt', 'btu', 'electron volt'],
  defaultFromUnit: 'joule',
  defaultToUnit: 'calorie',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI - derived from kg⋅m²/s² */
    { id: 'nanojoule', name: 'Nanojoule', symbol: 'nJ', toBase: joule * 1e-9 },
    { id: 'microjoule', name: 'Microjoule', symbol: 'μJ', toBase: joule * 1e-6 },
    { id: 'millijoule', name: 'Millijoule', symbol: 'mJ', toBase: joule * 0.001 },
    { id: 'joule', name: 'Joule', symbol: 'J', toBase: joule },
    { id: 'kilojoule', name: 'Kilojoule', symbol: 'kJ', toBase: joule * 1000 },
    { id: 'megajoule', name: 'Megajoule', symbol: 'MJ', toBase: joule * 1e6 },
    { id: 'gigajoule', name: 'Gigajoule', symbol: 'GJ', toBase: joule * 1e9 },
    { id: 'terajoule', name: 'Terajoule', symbol: 'TJ', toBase: joule * 1e12 },
    
    /* Watt-hour - derived from power × time */
    { id: 'watt-second', name: 'Watt-second', symbol: 'W⋅s', toBase: joule },
    { id: 'watt-hour', name: 'Watt-hour', symbol: 'Wh', toBase: joule * T.hour },
    { id: 'kilowatt-hour', name: 'Kilowatt-hour', symbol: 'kWh', toBase: joule * T.hour * 1000 },
    { id: 'megawatt-hour', name: 'Megawatt-hour', symbol: 'MWh', toBase: joule * T.hour * 1e6 },
    { id: 'gigawatt-hour', name: 'Gigawatt-hour', symbol: 'GWh', toBase: joule * T.hour * 1e9 },
    { id: 'terawatt-hour', name: 'Terawatt-hour', symbol: 'TWh', toBase: joule * T.hour * 1e12 },
    
    /* Calorie */
    { id: 'calorie', name: 'Calorie (th)', symbol: 'cal', toBase: calorie },
    { id: 'kilocalorie', name: 'Kilocalorie', symbol: 'kcal', toBase: calorie * 1000 },
    { id: 'calorie-food', name: 'Calorie (food)', symbol: 'Cal', toBase: calorie * 1000 }, /* Same as kcal */
    { id: 'calorie-it', name: 'Calorie (IT)', symbol: 'cal (IT)', toBase: 4.1868 * joule },
    
    /* BTU */
    { id: 'btu', name: 'BTU (IT)', symbol: 'BTU', toBase: btu },
    { id: 'btu-th', name: 'BTU (th)', symbol: 'BTU (th)', toBase: 1054.35 * joule },
    { id: 'therm', name: 'Therm', symbol: 'thm', toBase: btu * 100000 },
    { id: 'quad', name: 'Quad', symbol: 'quad', toBase: btu * 1e15 },
    
    /* CGS - erg = g⋅cm²/s² */
    { id: 'erg', name: 'Erg', symbol: 'erg', toBase: deriveEnergyDirect(M.gram, L.centimeter, T.second) },
    
    /* Foot-pound - derived from lbf × ft */
    { id: 'foot-pound', name: 'Foot-pound', symbol: 'ft⋅lbf', toBase: M.pound * g * L.foot },
    { id: 'inch-pound', name: 'Inch-pound', symbol: 'in⋅lbf', toBase: M.pound * g * L.inch },
    { id: 'foot-poundal', name: 'Foot-poundal', symbol: 'ft⋅pdl', toBase: deriveEnergyDirect(M.pound, L.foot, T.second) },
    
    /* Atomic */
    { id: 'electronvolt', name: 'Electronvolt', symbol: 'eV', toBase: eV },
    { id: 'millielectronvolt', name: 'Millielectronvolt', symbol: 'meV', toBase: eV * 0.001 },
    { id: 'kiloelectronvolt', name: 'Kiloelectronvolt', symbol: 'keV', toBase: eV * 1000 },
    { id: 'megaelectronvolt', name: 'Megaelectronvolt', symbol: 'MeV', toBase: eV * 1e6 },
    { id: 'gigaelectronvolt', name: 'Gigaelectronvolt', symbol: 'GeV', toBase: eV * 1e9 },
    { id: 'teraelectronvolt', name: 'Teraelectronvolt', symbol: 'TeV', toBase: eV * 1e12 },
    
    /* Other */
    { id: 'ton-tnt', name: 'Ton of TNT', symbol: 'tTNT', toBase: calorie * 1e9 }, /* 1 ton TNT = 1 Gcal */
    { id: 'kiloton-tnt', name: 'Kiloton of TNT', symbol: 'ktTNT', toBase: calorie * 1e12 },
    { id: 'megaton-tnt', name: 'Megaton of TNT', symbol: 'MtTNT', toBase: calorie * 1e15 },
    { id: 'hartree', name: 'Hartree', symbol: 'Eₕ', toBase: 4.3597447222071e-18 * joule },
    { id: 'rydberg', name: 'Rydberg', symbol: 'Ry', toBase: 2.1798723611035e-18 * joule },
    { id: 'ton-oil-equivalent', name: 'Ton Oil Equivalent', symbol: 'toe', toBase: 41.868e9 * joule },
    { id: 'barrel-oil-equivalent', name: 'Barrel Oil Equivalent', symbol: 'boe', toBase: 6.1178632e9 * joule },
  ],
}

