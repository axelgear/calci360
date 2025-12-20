import type { ConverterConfig } from '../../types'
import { length } from '../../base/length'
import { deriveArea } from '../../base/derived'

/**
 * Area Converter - Derived from Length² (length × length)
 * Base unit: square meter (m²)
 * 
 * Formula: area_toBase = length_toBase²
 */

const L = length

export const areaConverter: ConverterConfig = {
  type: 'converter',
  name: 'Area Converter',
  description: 'Convert between different area units including square meters, square feet, acres, and hectares',
  category: 'Unit Conversion',
  icon: 'square_foot',
  keywords: ['area', 'square', 'meter', 'feet', 'acres', 'hectares'],
  defaultFromUnit: 'square-meter',
  defaultToUnit: 'square-foot',
  precision: 6,
  showAllConversions: true,
  units: [
    /* Metric - derived from length² */
    { id: 'square-millimeter', name: 'Square Millimeter', symbol: 'mm²', toBase: deriveArea(L.millimeter) },
    { id: 'square-centimeter', name: 'Square Centimeter', symbol: 'cm²', toBase: deriveArea(L.centimeter) },
    { id: 'square-decimeter', name: 'Square Decimeter', symbol: 'dm²', toBase: deriveArea(L.decimeter) },
    { id: 'square-meter', name: 'Square Meter', symbol: 'm²', toBase: deriveArea(L.meter) },
    { id: 'are', name: 'Are', symbol: 'a', toBase: deriveArea(L.dekameter) }, /* 10m × 10m = 100m² */
    { id: 'hectare', name: 'Hectare', symbol: 'ha', toBase: deriveArea(L.hectometer) }, /* 100m × 100m = 10000m² */
    { id: 'square-kilometer', name: 'Square Kilometer', symbol: 'km²', toBase: deriveArea(L.kilometer) },
    
    /* Imperial - derived from length² */
    { id: 'square-inch', name: 'Square Inch', symbol: 'in²', toBase: deriveArea(L.inch) },
    { id: 'square-foot', name: 'Square Foot', symbol: 'ft²', toBase: deriveArea(L.foot) },
    { id: 'square-yard', name: 'Square Yard', symbol: 'yd²', toBase: deriveArea(L.yard) },
    { id: 'acre', name: 'Acre', symbol: 'ac', toBase: deriveArea(L.yard) * 4840 }, /* 4840 sq yards */
    { id: 'square-mile', name: 'Square Mile', symbol: 'mi²', toBase: deriveArea(L.mile) },
    
    /* US Survey */
    { id: 'square-survey-foot', name: 'Square Survey Foot', symbol: 'ft² (US)', toBase: deriveArea(L['us-survey-foot']) },
    { id: 'survey-acre', name: 'Survey Acre', symbol: 'ac (US)', toBase: deriveArea(L['us-survey-foot']) * 43560 },
    { id: 'section', name: 'Section', symbol: 'section', toBase: deriveArea(L.mile) }, /* 1 square mile */
    { id: 'township', name: 'Township', symbol: 'twp', toBase: deriveArea(L.mile) * 36 }, /* 36 square miles */
    
    /* Other */
    { id: 'square-rod', name: 'Square Rod', symbol: 'rd²', toBase: deriveArea(L.rod) },
    { id: 'rood', name: 'Rood', symbol: 'rood', toBase: deriveArea(L.yard) * 1210 }, /* 1210 sq yards = 1/4 acre */
    { id: 'circular-mil', name: 'Circular Mil', symbol: 'cmil', toBase: Math.PI / 4 * deriveArea(L.mil) },
    { id: 'barn', name: 'Barn', symbol: 'b', toBase: 1e-28 }, /* nuclear physics unit */
  ],
}

