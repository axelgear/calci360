import type { CalculatorConfig } from './types'

/* Import all converters from categorized folders */
import {
  /* Geometry */
  lengthConverter,
  areaConverter as areaUnitConverter,
  volumeConverter,
  angleConverter,
  /* Mechanics */
  forceConverter,
  energyConverter,
  powerConverter,
  pressureConverter,
  torqueConverter,
  speedConverter,
  flowRateConverter,
  /* Physical */
  massConverter,
  densityConverter,
  temperatureConverter,
  /* Temporal */
  timeConverter,
  frequencyConverter,
  /* Digital */
  dataConverter,
  /* Electrical */
  currentConverter,
  voltageConverter,
  resistanceConverter,
  capacitanceConverter,
  inductanceConverter,
  /* Specialized */
  illuminationConverter,
  magneticFieldConverter,
  radioactivityConverter,
  radiationDoseConverter,
  surfaceTensionConverter,
  viscosityConverter,
  thermalConductivityConverter,
  heatCapacityConverter,
} from './converters'

/* Import geometry calculators */
import { areaCalculator, volumeCalculator } from './geometry'

/* Import engineering calculators */
import { metalWeightCalculator } from './metal-weight'

/* Import HVAC calculators */
import { hvacDuctCalculator } from './hvac'

/**
 * Registry of all available calculators
 * Key is the URL slug, value is the calculator configuration
 */
export const calculators: Record<string, CalculatorConfig> = {
  /* ============ Geometry Calculators ============ */
  'area-calculator': areaCalculator,
  'volume-calculator': volumeCalculator,
  
  /* ============ Engineering Calculators ============ */
  'metal-weight-calculator': metalWeightCalculator,
  
  /* ============ HVAC Calculators ============ */
  'duct-heat-loss-calculator': hvacDuctCalculator,
  
  /* ============ Unit Converters ============ */
  
  /* Converters - Geometry */
  'length-converter': lengthConverter,
  'area-converter': areaUnitConverter,
  'volume-converter': volumeConverter,
  'angle-converter': angleConverter,
  
  /* Converters - Physical Properties */
  'mass-converter': massConverter,
  'temperature-converter': temperatureConverter,
  'density-converter': densityConverter,
  
  /* Converters - Temporal */
  'time-converter': timeConverter,
  'frequency-converter': frequencyConverter,
  
  /* Converters - Mechanics */
  'speed-converter': speedConverter,
  'pressure-converter': pressureConverter,
  'force-converter': forceConverter,
  'energy-converter': energyConverter,
  'power-converter': powerConverter,
  'torque-converter': torqueConverter,
  'flow-rate-converter': flowRateConverter,
  
  /* Converters - Digital */
  'data-converter': dataConverter,
  
  /* Converters - Electrical */
  'current-converter': currentConverter,
  'voltage-converter': voltageConverter,
  'resistance-converter': resistanceConverter,
  'capacitance-converter': capacitanceConverter,
  'inductance-converter': inductanceConverter,
  
  /* Converters - Specialized */
  'illumination-converter': illuminationConverter,
  'magnetic-field-converter': magneticFieldConverter,
  'radioactivity-converter': radioactivityConverter,
  'radiation-dose-converter': radiationDoseConverter,
  'surface-tension-converter': surfaceTensionConverter,
  'viscosity-converter': viscosityConverter,
  'thermal-conductivity-converter': thermalConductivityConverter,
  'heat-capacity-converter': heatCapacityConverter,
}

/**
 * Get a calculator by its slug
 */
export function getCalculator(slug: string): CalculatorConfig | undefined {
  return calculators[slug]
}

/**
 * Get all calculator slugs
 */
export function getCalculatorSlugs(): string[] {
  return Object.keys(calculators)
}

/**
 * Get calculators grouped by category
 */
export function getCalculatorsByCategory(): Record<string, { slug: string; config: CalculatorConfig }[]> {
  const grouped: Record<string, { slug: string; config: CalculatorConfig }[]> = {}
  
  for (const [slug, config] of Object.entries(calculators)) {
    const category = config.category
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category]!.push({ slug, config })
  }
  
  return grouped
}
