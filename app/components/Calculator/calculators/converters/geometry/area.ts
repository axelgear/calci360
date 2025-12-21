import type { ConverterConfig } from '../../types'
import { areaUnitsFull, length, deriveArea } from '../../units'

/**
 * Area Converter - Derived from Length² (length × length)
 * Base unit: square meter (m²)
 */

const L = length

/* Extended area units (full set includes survey and specialized units) */
const extendedAreaUnits = [
  ...areaUnitsFull,
  /* US Survey */
  { id: 'square-survey-foot', name: 'Square Survey Foot', symbol: 'ft² (US)', toBase: deriveArea(L['us-survey-foot']) },
  { id: 'survey-acre', name: 'Survey Acre', symbol: 'ac (US)', toBase: deriveArea(L['us-survey-foot']) * 43560 },
  /* Other */
  { id: 'circular-mil', name: 'Circular Mil', symbol: 'cmil', toBase: Math.PI / 4 * deriveArea(L.mil) },
  { id: 'barn', name: 'Barn', symbol: 'b', toBase: 1e-28 }, /* nuclear physics unit */
]

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
  units: extendedAreaUnits,
}

