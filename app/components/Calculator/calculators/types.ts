/**
 * Unit definition for converters
 */
export interface UnitDefinition {
  id: string
  name: string
  symbol: string
  /** Conversion factor to base unit (for linear conversions) */
  toBase: number
  /** Optional offset for temperature-like conversions (e.g., Celsius to Kelvin) */
  offset?: number
  /** For non-linear conversions, provide a custom function to convert TO base unit */
  toBaseCustom?: (value: number) => number
  /** For non-linear conversions, provide a custom function to convert FROM base unit */
  fromBaseCustom?: (value: number) => number
}

/**
 * Alias for UnitDefinition for convenience
 */
export type UnitConfig = UnitDefinition

/**
 * Unit category for grouping related units
 */
export interface UnitCategory {
  id: string
  name: string
  units: UnitDefinition[]
}

/**
 * Base calculator configuration
 */
export interface BaseCalculatorConfig {
  name: string
  description: string
  category: string
  icon: string
  /** SEO keywords */
  keywords?: string[]
}

/**
 * Converter configuration - for unit conversion calculators
 */
export interface ConverterConfig extends BaseCalculatorConfig {
  type: 'converter'
  /** Available units for conversion */
  units: UnitDefinition[]
  /** Default from unit id */
  defaultFromUnit: string
  /** Default to unit id */
  defaultToUnit: string
  /** Number of decimal places */
  precision?: number
  /** Show all conversions table */
  showAllConversions?: boolean
}

/**
 * Geometry calculator configuration (imported from geometry folder)
 */
export interface GeometryCalculatorConfig {
  type: 'geometry'
  name: string
  description: string
  category: string
  categoryDescription?: string
  icon: string
  keywords: string[]
  shapes: import('./geometry/types').ShapeDefinition[]
  defaultShape: string
  resultUnit: string
  resultLabel: string
}

/**
 * Metal weight calculator configuration
 */
export interface MetalWeightCalculatorConfig {
  type: 'metal-weight'
  name: string
  description: string
  category: string
  icon: string
  keywords: string[]
  resultLabel: string
}

/**
 * Union type for all calculator configs
 */
export type CalculatorConfig = ConverterConfig | GeometryCalculatorConfig | MetalWeightCalculatorConfig

/**
 * Type guard to check if config is a converter
 */
export function isConverterConfig(config: CalculatorConfig): config is ConverterConfig {
  return config.type === 'converter'
}

/**
 * Type guard to check if config is a geometry calculator
 */
export function isGeometryCalculatorConfig(config: CalculatorConfig): config is GeometryCalculatorConfig {
  return config.type === 'geometry'
}

/**
 * Type guard to check if config is a metal weight calculator
 */
export function isMetalWeightCalculatorConfig(config: CalculatorConfig): config is MetalWeightCalculatorConfig {
  return config.type === 'metal-weight'
}

/**
 * Conversion result with all unit conversions
 */
export interface ConversionResult {
  unitId: string
  unitName: string
  symbol: string
  value: number
  formatted: string
}

/**
 * Convert a value from one unit to another
 * Handles both linear (toBase factor) and non-linear (custom functions) conversions
 */
export function convertUnit(
  value: number,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition
): number {
  /* Step 1: Convert to base unit */
  let baseValue: number
  if (fromUnit.toBaseCustom) {
    /* Use custom function for non-linear conversions (e.g., Celsius) */
    baseValue = fromUnit.toBaseCustom(value)
  } else if (fromUnit.offset !== undefined) {
    /* Handle linear with offset */
    baseValue = (value + fromUnit.offset) * fromUnit.toBase
  } else {
    /* Standard linear conversion */
    baseValue = value * fromUnit.toBase
  }

  /* Step 2: Convert from base unit to target unit */
  if (toUnit.fromBaseCustom) {
    /* Use custom function for non-linear conversions */
    return toUnit.fromBaseCustom(baseValue)
  } else if (toUnit.offset !== undefined) {
    /* Handle linear with offset */
    return baseValue / toUnit.toBase - toUnit.offset
  } else {
    /* Standard linear conversion */
    return baseValue / toUnit.toBase
  }
}

/**
 * Format a number with appropriate precision
 */
export function formatNumber(value: number, precision: number = 6): string {
  if (!Number.isFinite(value)) return '—'
  
  /* For very small or very large numbers, use scientific notation */
  if (Math.abs(value) > 0 && (Math.abs(value) < 0.0001 || Math.abs(value) >= 1e9)) {
    return value.toExponential(precision)
  }
  
  /* Round to specified precision */
  const factor = Math.pow(10, precision)
  const rounded = Math.round(value * factor) / factor
  
  /* Format with locale grouping */
  return rounded.toLocaleString('en-US', {
    maximumFractionDigits: precision,
    useGrouping: true,
  })
}

/**
 * Get all conversions for a given value and source unit
 */
export function getAllConversions(
  value: number,
  fromUnit: UnitDefinition,
  units: UnitDefinition[],
  precision: number = 6
): ConversionResult[] {
  return units.map(toUnit => {
    const convertedValue = convertUnit(value, fromUnit, toUnit)
    return {
      unitId: toUnit.id,
      unitName: toUnit.name,
      symbol: toUnit.symbol,
      value: convertedValue,
      formatted: formatNumber(convertedValue, precision),
    }
  })
}
