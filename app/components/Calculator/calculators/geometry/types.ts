/**
 * Geometry Calculator Types
 */

export interface ShapeInput {
  id: string
  label: string
  symbol: string
  min?: number
  max?: number
  step?: number
  default?: number
}

export interface AdditionalResult {
  id: string
  label: string
  formula: string
  /** Unit suffix (e.g., 'units²', 'units') */
  unit: string
  calculate: (values: Record<string, number>) => number
}

export interface ShapeDefinition {
  id: string
  name: string
  icon: string
  inputs: ShapeInput[]
  /** Formula as a function that takes input values */
  calculate: (values: Record<string, number>) => number
  /** LaTeX or plain text formula for display */
  formula: string
  /** Human-readable formula explanation */
  formulaExplanation: string
  /** Additional calculated values (surface area, diagonals, etc.) */
  additionalResults?: AdditionalResult[]
}

export interface GeometryCalculatorConfig {
  type: 'geometry'
  name: string
  description: string
  category: string
  categoryDescription?: string
  icon: string
  keywords: string[]
  shapes: ShapeDefinition[]
  defaultShape: string
  /** Unit for the result (e.g., 'units²' for area) */
  resultUnit: string
  resultLabel: string
}

