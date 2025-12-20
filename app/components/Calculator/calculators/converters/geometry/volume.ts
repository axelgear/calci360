import type { ConverterConfig } from '../../types'
import { length } from '../../base/length'
import { deriveVolume } from '../../base/derived'

/**
 * Volume Converter - Derived from Length³ (length × length × length)
 * Base unit: cubic meter (m³)
 * 
 * Formula: volume_toBase = length_toBase³
 * 
 * Note: Liters and liquid measures are defined relative to dm³:
 * 1 liter = 1 dm³ = 0.001 m³
 */

const L = length
const dm3 = deriveVolume(L.decimeter) /* 1 liter = 1 dm³ */
const in3 = deriveVolume(L.inch)
const galUS = 231 * in3 /* US gallon = 231 cubic inches by law */
const galUK = 4.54609 * dm3 /* UK gallon = 4.54609 liters exactly */

export const volumeConverter: ConverterConfig = {
  type: 'converter',
  name: 'Volume Converter',
  description: 'Convert between different volume units including liters, gallons, cubic meters, and fluid ounces',
  category: 'Unit Conversion',
  icon: 'water_drop',
  keywords: ['volume', 'liter', 'gallon', 'cubic', 'fluid', 'ounce'],
  defaultFromUnit: 'liter',
  defaultToUnit: 'gallon-us',
  precision: 6,
  showAllConversions: true,
  units: [
    /* Metric - derived from length³ */
    { id: 'cubic-millimeter', name: 'Cubic Millimeter', symbol: 'mm³', toBase: deriveVolume(L.millimeter) },
    { id: 'cubic-centimeter', name: 'Cubic Centimeter', symbol: 'cm³', toBase: deriveVolume(L.centimeter) },
    { id: 'cubic-decimeter', name: 'Cubic Decimeter', symbol: 'dm³', toBase: dm3 },
    { id: 'cubic-meter', name: 'Cubic Meter', symbol: 'm³', toBase: deriveVolume(L.meter) },
    { id: 'cubic-kilometer', name: 'Cubic Kilometer', symbol: 'km³', toBase: deriveVolume(L.kilometer) },
    
    /* Liters - based on dm³ */
    { id: 'microliter', name: 'Microliter', symbol: 'μL', toBase: dm3 / 1e6 },
    { id: 'milliliter', name: 'Milliliter', symbol: 'mL', toBase: dm3 / 1000 },
    { id: 'centiliter', name: 'Centiliter', symbol: 'cL', toBase: dm3 / 100 },
    { id: 'deciliter', name: 'Deciliter', symbol: 'dL', toBase: dm3 / 10 },
    { id: 'liter', name: 'Liter', symbol: 'L', toBase: dm3 },
    { id: 'dekaliter', name: 'Dekaliter', symbol: 'daL', toBase: dm3 * 10 },
    { id: 'hectoliter', name: 'Hectoliter', symbol: 'hL', toBase: dm3 * 100 },
    { id: 'kiloliter', name: 'Kiloliter', symbol: 'kL', toBase: dm3 * 1000 },
    
    /* Imperial - derived from length³ */
    { id: 'cubic-inch', name: 'Cubic Inch', symbol: 'in³', toBase: in3 },
    { id: 'cubic-foot', name: 'Cubic Foot', symbol: 'ft³', toBase: deriveVolume(L.foot) },
    { id: 'cubic-yard', name: 'Cubic Yard', symbol: 'yd³', toBase: deriveVolume(L.yard) },
    { id: 'board-foot', name: 'Board Foot', symbol: 'FBM', toBase: L.foot * L.foot * L.inch },
    { id: 'cord', name: 'Cord', symbol: 'cord', toBase: 128 * deriveVolume(L.foot) },
    
    /* US Liquid - defined from gallon (231 cubic inches by law) */
    { id: 'gallon-us', name: 'Gallon (US)', symbol: 'gal', toBase: galUS },
    { id: 'half-gallon-us', name: 'Half Gallon (US)', symbol: '½ gal', toBase: galUS / 2 },
    { id: 'quart-us', name: 'Quart (US)', symbol: 'qt', toBase: galUS / 4 },
    { id: 'pint-us', name: 'Pint (US)', symbol: 'pt', toBase: galUS / 8 },
    { id: 'cup-us', name: 'Cup (US)', symbol: 'cup', toBase: galUS / 16 },
    { id: 'gill-us', name: 'Gill (US)', symbol: 'gi', toBase: galUS / 32 },
    { id: 'fluid-ounce-us', name: 'Fluid Ounce (US)', symbol: 'fl oz', toBase: galUS / 128 },
    { id: 'tablespoon-us', name: 'Tablespoon (US)', symbol: 'tbsp', toBase: galUS / 256 },
    { id: 'teaspoon-us', name: 'Teaspoon (US)', symbol: 'tsp', toBase: galUS / 768 },
    { id: 'fluid-dram-us', name: 'Fluid Dram (US)', symbol: 'fl dr', toBase: galUS / 1024 },
    { id: 'minim-us', name: 'Minim (US)', symbol: 'min', toBase: galUS / 61440 },
    
    /* UK Imperial - defined from gallon (4.54609 L by definition) */
    { id: 'gallon-uk', name: 'Gallon (UK)', symbol: 'gal (UK)', toBase: galUK },
    { id: 'quart-uk', name: 'Quart (UK)', symbol: 'qt (UK)', toBase: galUK / 4 },
    { id: 'pint-uk', name: 'Pint (UK)', symbol: 'pt (UK)', toBase: galUK / 8 },
    { id: 'gill-uk', name: 'Gill (UK)', symbol: 'gi (UK)', toBase: galUK / 32 },
    { id: 'fluid-ounce-uk', name: 'Fluid Ounce (UK)', symbol: 'fl oz (UK)', toBase: galUK / 160 },
    
    /* Barrels */
    { id: 'barrel-oil', name: 'Barrel (Oil)', symbol: 'bbl', toBase: 42 * galUS }, /* 42 US gallons */
    { id: 'barrel-us', name: 'Barrel (US Liquid)', symbol: 'bbl (US)', toBase: 31.5 * galUS }, /* 31.5 US gallons */
    { id: 'barrel-us-dry', name: 'Barrel (US Dry)', symbol: 'bbl (dry)', toBase: 7056 * in3 },
    { id: 'barrel-uk', name: 'Barrel (UK)', symbol: 'bbl (UK)', toBase: 36 * galUK },
    
    /* Dry measures */
    { id: 'bushel-us', name: 'Bushel (US)', symbol: 'bu', toBase: 2150.42 * in3 },
    { id: 'peck-us', name: 'Peck (US)', symbol: 'pk', toBase: 537.605 * in3 },
    { id: 'bushel-uk', name: 'Bushel (UK)', symbol: 'bu (UK)', toBase: 8 * galUK },
    
    /* Cooking (metric) */
    { id: 'tablespoon-metric', name: 'Tablespoon (Metric)', symbol: 'tbsp (metric)', toBase: 15 * dm3 / 1000 },
    { id: 'teaspoon-metric', name: 'Teaspoon (Metric)', symbol: 'tsp (metric)', toBase: 5 * dm3 / 1000 },
  ],
}

