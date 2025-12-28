/**
 * Area Unit Definitions
 * Base unit: square meter (m²)
 * Derived from Length² (length × length)
 */

import type { UnitOption } from './types'
import { length } from './length'

/* Derive area from length: length² */
export function deriveArea(lengthToBase: number): number {
  return lengthToBase * lengthToBase
}

const L = length

/** Common area units for geometry calculators */
export const areaUnitsCommon: UnitOption[] = [
  /* Metric */
  { id: 'square-millimeter', name: 'Square Millimeter', symbol: 'mm²', toBase: deriveArea(L.millimeter) },
  { id: 'square-centimeter', name: 'Square Centimeter', symbol: 'cm²', toBase: deriveArea(L.centimeter) },
  { id: 'square-meter', name: 'Square Meter', symbol: 'm²', toBase: deriveArea(L.meter) },
  { id: 'are', name: 'Are', symbol: 'a', toBase: deriveArea(L.dekameter) },
  { id: 'hectare', name: 'Hectare', symbol: 'ha', toBase: deriveArea(L.hectometer) },
  { id: 'square-kilometer', name: 'Square Kilometer', symbol: 'km²', toBase: deriveArea(L.kilometer) },
  /* Imperial */
  { id: 'square-inch', name: 'Square Inch', symbol: 'in²', toBase: deriveArea(L.inch) },
  { id: 'square-foot', name: 'Square Foot', symbol: 'ft²', toBase: deriveArea(L.foot) },
  { id: 'square-yard', name: 'Square Yard', symbol: 'yd²', toBase: deriveArea(L.yard) },
  { id: 'acre', name: 'Acre', symbol: 'ac', toBase: 4046.8564224 },
  { id: 'square-mile', name: 'Square Mile', symbol: 'mi²', toBase: deriveArea(L.mile) },
]

/** Full area units for converter */
export const areaUnitsFull: UnitOption[] = [
  ...areaUnitsCommon,
  /* Additional metric */
  { id: 'square-decimeter', name: 'Square Decimeter', symbol: 'dm²', toBase: deriveArea(L.decimeter) },
  { id: 'square-dekameter', name: 'Square Dekameter', symbol: 'dam²', toBase: deriveArea(L.dekameter) },
  { id: 'square-hectometer', name: 'Square Hectometer', symbol: 'hm²', toBase: deriveArea(L.hectometer) },
  /* Imperial additional */
  { id: 'square-rod', name: 'Square Rod', symbol: 'rd²', toBase: deriveArea(L.rod) },
  { id: 'rood', name: 'Rood', symbol: 'rood', toBase: deriveArea(L.rod) * 40 },
  { id: 'square-chain', name: 'Square Chain', symbol: 'ch²', toBase: deriveArea(L.chain) },
  /* Survey */
  { id: 'section', name: 'Section', symbol: 'section', toBase: deriveArea(L.mile) },
  { id: 'township', name: 'Township', symbol: 'twp', toBase: deriveArea(L.mile) * 36 },
]

/** Default area unit */
export const defaultAreaUnit: UnitOption = { id: 'square-meter', name: 'Square Meter', symbol: 'm²', toBase: 1 }

/** Main export for areaUnits - alias for areaUnitsCommon */
export const areaUnits = areaUnitsCommon
