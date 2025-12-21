/**
 * HVAC Duct Definitions
 * Formulas use SI units (meters, W, K)
 */

import type { DuctDefinition, DuctInput, InsulationMaterial } from './types'

/* Common length input */
const lengthInput: DuctInput = {
  id: 'length',
  label: 'Duct Length',
  symbol: 'L',
  unit: 'length',
  default: 10,
  min: 0.1,
  step: 0.5,
  helpText: 'Total length of the duct run',
}

/* Duct Definitions */
export const ductDefinitions: DuctDefinition[] = [
  {
    id: 'round',
    name: 'Round Duct',
    icon: 'trip_origin',
    inputs: [
      { id: 'diameter', label: 'Inner Diameter', symbol: 'D', unit: 'length', default: 0.3, min: 0.05, step: 0.01, helpText: 'Inside diameter of the duct' },
      lengthInput,
    ],
    hydraulicDiameterFormula: 'diameter',
    surfaceAreaFormula: 'Math.PI * diameter * length',
    crossSectionFormula: 'Math.PI * Math.pow(diameter / 2, 2)',
  },
  {
    id: 'rectangular',
    name: 'Rectangular Duct',
    icon: 'crop_landscape',
    inputs: [
      { id: 'width', label: 'Inner Width', symbol: 'W', unit: 'length', default: 0.4, min: 0.05, step: 0.01, helpText: 'Inside width of the duct' },
      { id: 'height', label: 'Inner Height', symbol: 'H', unit: 'length', default: 0.3, min: 0.05, step: 0.01, helpText: 'Inside height of the duct' },
      lengthInput,
    ],
    /* Hydraulic diameter: Dh = 4A/P = 4WH / 2(W+H) = 2WH / (W+H) */
    hydraulicDiameterFormula: '(2 * width * height) / (width + height)',
    surfaceAreaFormula: '2 * (width + height) * length',
    crossSectionFormula: 'width * height',
  },
]

/* Common Insulation Materials */
export const insulationMaterials: InsulationMaterial[] = [
  { id: 'none', name: 'No Insulation (Bare Duct)', thermalConductivity: 45, rValuePerInch: 0 },
  { id: 'fiberglass-blanket', name: 'Fiberglass Blanket', thermalConductivity: 0.04, rValuePerInch: 3.14 },
  { id: 'fiberglass-board', name: 'Fiberglass Board', thermalConductivity: 0.036, rValuePerInch: 4.35 },
  { id: 'mineral-wool', name: 'Mineral Wool', thermalConductivity: 0.038, rValuePerInch: 3.7 },
  { id: 'elastomeric-foam', name: 'Elastomeric Foam', thermalConductivity: 0.038, rValuePerInch: 3.6 },
  { id: 'polyisocyanurate', name: 'Polyisocyanurate (PIR)', thermalConductivity: 0.022, rValuePerInch: 6.5 },
  { id: 'phenolic-foam', name: 'Phenolic Foam', thermalConductivity: 0.020, rValuePerInch: 8.0 },
  { id: 'aerogel', name: 'Aerogel Blanket', thermalConductivity: 0.015, rValuePerInch: 10.3 },
]

/* Typical Heat Transfer Coefficients */
export const heatTransferCoefficients = {
  /* Inside duct (forced convection) - depends on velocity, typically 10-50 W/(m²·K) */
  insideTypical: 25,
  insideRange: { min: 10, max: 100 },
  /* Outside duct - depends on surrounding conditions */
  outsideStillAir: 5.68,    /* ~1 BTU/(hr·ft²·°F) = 5.68 W/(m²·K) */
  outsideMovingAir: 9.94,   /* ~1.75 BTU/(hr·ft²·°F) = 9.94 W/(m²·K) */
  outsideWind: 22.7,        /* ~4 BTU/(hr·ft²·°F) = 22.7 W/(m²·K) */
  outsideTypical: 5.68,
  outsideRange: { min: 2, max: 50 },
}

/* Exterior Duct Conditions */
export interface ExteriorCondition {
  id: string
  name: string
  description: string
  hOutside: number /* W/(m²·K) */
  hOutsideImperial: number /* BTU/(hr·ft²·°F) */
}

export const exteriorConditions: ExteriorCondition[] = [
  {
    id: 'still-air',
    name: 'Still Air',
    description: 'Indoor or enclosed space with no air movement',
    hOutside: 5.68,
    hOutsideImperial: 1,
  },
  {
    id: 'moving-air',
    name: 'Moving Air',
    description: 'Space with some air circulation (HVAC, fans)',
    hOutside: 9.94,
    hOutsideImperial: 1.75,
  },
  {
    id: 'outdoors',
    name: 'Outdoors (Wind)',
    description: 'Exposed to outdoor conditions with wind',
    hOutside: 22.7,
    hOutsideImperial: 4,
  },
]

export const defaultExteriorCondition = 'still-air'

export function getExteriorCondition(id: string): ExteriorCondition | undefined {
  return exteriorConditions.find(c => c.id === id)
}

/* Get duct definition by ID */
export function getDuctDefinition(id: string): DuctDefinition | undefined {
  return ductDefinitions.find(d => d.id === id)
}

/* Get insulation material by ID */
export function getInsulationMaterial(id: string): InsulationMaterial | undefined {
  return insulationMaterials.find(m => m.id === id)
}

/* Default duct type */
export const defaultDuctType = 'round'

/* Default insulation */
export const defaultInsulation = 'fiberglass-blanket'

