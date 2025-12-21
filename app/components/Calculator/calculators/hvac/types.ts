/**
 * HVAC Duct Calculator Types
 */

export type DuctType = 'round' | 'rectangular'

export interface DuctInput {
  id: string
  label: string
  symbol: string
  unit: string
  default: number
  min?: number
  max?: number
  step?: number
  helpText?: string
}

export interface DuctDefinition {
  id: DuctType
  name: string
  icon: string
  inputs: DuctInput[]
  /** Hydraulic diameter formula (for heat transfer calculations) */
  hydraulicDiameterFormula: string
  /** Surface area per unit length formula */
  surfaceAreaFormula: string
  /** Cross-sectional area formula */
  crossSectionFormula: string
}

export interface InsulationMaterial {
  id: string
  name: string
  /** Thermal conductivity in W/(m·K) */
  thermalConductivity: number
  /** Typical R-value per inch in (ft²·°F·h)/BTU */
  rValuePerInch?: number
}

/** HVAC Duct Calculator Configuration */
export interface HvacDuctCalculatorConfig {
  type: 'hvac-duct'
  name: string
  description: string
  category: string
  icon: string
  keywords: string[]
  resultLabel: string
}

