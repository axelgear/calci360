/**
 * HVAC Duct Sizing Calculator Types
 * Supports tree-based duct network design with branches, fittings, and diffusers
 */

/* ========== AIR PROPERTIES ========== */

export interface AirCondition {
  id: string
  name: string
  temperature: number /* °C */
  relativeHumidity: number /* % */
  pressure: number /* kPa - atmospheric */
  density: number /* kg/m³ */
  viscosity: number /* kg/(m·h) or Pa·s */
  specificHeat: number /* kJ/(kg·°C) */
}

/* ========== DUCT SHAPES ========== */

export type DuctShape = 'round' | 'rectangular'

export interface RoundDuct {
  shape: 'round'
  diameter: number /* mm */
}

export interface RectangularDuct {
  shape: 'rectangular'
  width: number /* mm */
  height: number /* mm */
}

export type DuctDimensions = RoundDuct | RectangularDuct

/* ========== FITTINGS ========== */

export type FittingCategory = 
  | 'elbow'
  | 'transition'
  | 'takeoff'
  | 'boot'
  | 'collar'
  | 'damper'
  | 'diffuser'

export interface FittingType {
  id: string
  name: string
  category: FittingCategory
  icon: string
  /* Equivalent length calculation - can be fixed or based on size */
  equivalentLength: number | ((ductSize: DuctDimensions) => number)
  /* Pressure loss coefficient (K factor) - alternative to EL */
  kFactor?: number
  /* Description */
  description?: string
}

/* ========== DUCT NETWORK NODES ========== */

export type NodeType = 'ahu' | 'junction' | 'diffuser' | 'end' | 'return'

export interface DuctNode {
  id: string
  type: NodeType
  name: string
  /* Position for visual layout */
  position: { x: number; y: number }
  /* For diffusers/returns: CFM requirement */
  cfm?: number
  /* Room/zone name */
  zone?: string
  /* Component ID for detailed HVAC component type */
  componentId?: string
}

/* ========== DUCT SEGMENTS ========== */

export interface SegmentFitting {
  fittingId: string
  quantity: number
  /* Override equivalent length if needed */
  customEL?: number
}

/* Insulation properties */
export interface InsulationProperties {
  material: string
  thickness: number /* mm */
  kValue: number /* W/(m·K) - thermal conductivity */
  rValue?: number /* m²·K/W - thermal resistance (calculated) */
}

/* Common insulation materials with default k-values */
export const insulationMaterials = [
  { id: 'fiberglass', name: 'Fiberglass', kValue: 0.04 },
  { id: 'mineral-wool', name: 'Mineral Wool', kValue: 0.038 },
  { id: 'foam-rubber', name: 'Foam Rubber', kValue: 0.036 },
  { id: 'polyurethane', name: 'Polyurethane Foam', kValue: 0.025 },
  { id: 'phenolic', name: 'Phenolic Foam', kValue: 0.022 },
  { id: 'elastomeric', name: 'Elastomeric', kValue: 0.037 },
  { id: 'custom', name: 'Custom', kValue: 0.04 },
] as const

export interface DuctSegment {
  id: string
  fromNodeId: string
  toNodeId: string
  /* Handle IDs for Vue Flow edge rendering */
  sourceHandle?: string | null
  targetHandle?: string | null
  /* Segment properties */
  length: number /* m or ft */
  fittings: SegmentFitting[]
  insulated: boolean
  insulation?: InsulationProperties
  /* Manual override or auto-calculated */
  manualSize?: DuctDimensions
  /* Calculated values (populated by calculator) */
  calculated?: {
    cfm: number
    ductSize: DuctDimensions
    velocity: number /* m/s */
    velocityPressure: number /* Pa */
    frictionLoss: number /* Pa/m */
    totalPressureDrop: number /* Pa */
    equivalentLength: number /* m - sum of fittings */
    tempDrop: number /* °C */
  }
}

/* ========== DUCT SYSTEM ========== */

export interface DuctSystem {
  id: string
  name: string
  /* Design parameters */
  designMethod: 'equal-friction' | 'static-regain' | 'velocity-reduction'
  targetVelocity?: number /* m/s - for velocity method */
  targetFriction?: number /* Pa/m - for friction method */
  maxVelocity: number /* m/s - safety limit */
  /* Air conditions */
  supplyAirTemp: number /* °C */
  ambientTemp: number /* °C */
  airCondition: string /* reference to AirCondition id */
  /* Unit system */
  units: 'metric' | 'imperial'
  /* Network structure */
  nodes: DuctNode[]
  segments: DuctSegment[]
}

/* ========== CALCULATION RESULTS ========== */

export interface SystemResults {
  totalCFM: number
  totalPressureDrop: number /* Pa or in.wg */
  criticalPath: string[] /* segment IDs */
  criticalPathPressure: number
  /* Bill of Materials */
  bom: BOMItem[]
  /* Warnings/errors */
  warnings: string[]
}

export interface BOMItem {
  description: string
  size: string
  quantity: number
  unit: string
  length?: number
  material?: string
}

/* ========== DUCT SIZING CONFIG ========== */

export interface DuctSizingConfig {
  type: 'duct-sizing'
  name: string
  description: string
  category: string
  icon: string
  keywords: string[]
}

