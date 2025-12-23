/**
 * Bending Stress Calculator Types
 * Supports cantilever, simply supported, and fixed-fixed beams
 * with various load types and interactive shear/moment diagrams
 */

/* ============ BEAM SUPPORT TYPES ============ */

export type SupportType = 'fixed' | 'pinned' | 'roller' | 'free'

export interface BeamSupport {
  id: string
  type: SupportType
  position: number /* 0-1 normalized position along beam */
}

/* ============ LOAD TYPES ============ */

export type LoadType = 'point' | 'udl' | 'triangular' | 'moment'

export interface BaseLoad {
  id: string
  type: LoadType
  position: number /* 0-1 normalized position along beam */
}

export interface PointLoad extends BaseLoad {
  type: 'point'
  magnitude: number /* Force in N or kN */
  direction: 'up' | 'down'
}

export interface UniformDistributedLoad extends BaseLoad {
  type: 'udl'
  magnitude: number /* Force per unit length (N/m or kN/m) */
  startPosition: number /* 0-1 normalized start */
  endPosition: number /* 0-1 normalized end */
  direction: 'up' | 'down'
}

export interface TriangularLoad extends BaseLoad {
  type: 'triangular'
  magnitudeStart: number /* Force at start (N/m) */
  magnitudeEnd: number /* Force at end (N/m) */
  startPosition: number /* 0-1 normalized start */
  endPosition: number /* 0-1 normalized end */
  direction: 'up' | 'down'
}

export interface AppliedMoment extends BaseLoad {
  type: 'moment'
  magnitude: number /* Moment in N·m or kN·m */
  direction: 'clockwise' | 'counterclockwise'
}

export type BeamLoad = PointLoad | UniformDistributedLoad | TriangularLoad | AppliedMoment

/* ============ BEAM CONFIGURATION ============ */

export type BeamType = 'cantilever' | 'simply-supported' | 'fixed-fixed' | 'custom'

export interface BeamConfiguration {
  type: BeamType
  length: number /* Length in meters */
  supports: BeamSupport[]
  loads: BeamLoad[]
}

/* ============ BEAM PROFILE (Cross Section) ============ */

export interface BeamProfile {
  id: string
  name: string
  /* Cross-sectional properties - can be calculated from metal-weight profiles */
  area: number /* Cross-sectional area (m²) */
  momentOfInertia: number /* Second moment of area I (m⁴) */
  sectionModulus: number /* S = I/c (m³) */
  centroidY: number /* Distance from neutral axis to extreme fiber (m) */
  /* For shear calculations */
  webThickness?: number /* For I/H beams */
  flangeWidth?: number
}

/* ============ MATERIAL PROPERTIES ============ */

export interface BeamMaterial {
  id: string
  name: string
  youngsModulus: number /* E in Pa (N/m²) */
  yieldStrength: number /* σy in Pa */
  density: number /* kg/m³ */
  allowableBendingStress?: number /* σallow in Pa */
  allowableShearStress?: number /* τallow in Pa */
}

/* ============ CALCULATION RESULTS ============ */

export interface DiagramPoint {
  x: number /* Position along beam (0 to L) */
  value: number /* Shear force (N) or Bending moment (N·m) */
}

export interface ReactionForce {
  supportId: string
  position: number
  verticalForce: number /* Reaction force (N), positive up */
  moment?: number /* Reaction moment (N·m), for fixed supports */
  horizontalForce?: number /* For inclined loads */
}

export interface CalculationResults {
  /* Reactions */
  reactions: ReactionForce[]
  
  /* Shear diagram */
  shearDiagram: DiagramPoint[]
  maxShear: number
  maxShearPosition: number
  minShear: number
  minShearPosition: number
  
  /* Moment diagram */
  momentDiagram: DiagramPoint[]
  maxMoment: number
  maxMomentPosition: number
  minMoment: number
  minMomentPosition: number
  
  /* Stress results */
  maxBendingStress: number /* σ = Mc/I (Pa) */
  maxShearStress: number /* τ = VQ/Ib (Pa) */
  
  /* Deflection */
  maxDeflection: number /* Maximum deflection (m) */
  maxDeflectionPosition: number
  deflectionCurve: DiagramPoint[]
  
  /* Safety checks */
  bendingStressSafe: boolean
  shearStressSafe: boolean
  deflectionSafe: boolean
  safetyFactor: number
}

/* ============ PRESET BEAM CONFIGURATIONS ============ */

export interface BeamPreset {
  id: string
  name: string
  icon: string
  description: string
  beamType: BeamType
  supports: Omit<BeamSupport, 'id'>[]
}

export const beamPresets: BeamPreset[] = [
  {
    id: 'cantilever',
    name: 'Cantilever Beam',
    icon: 'vertical_align_bottom',
    description: 'Fixed at one end, free at the other',
    beamType: 'cantilever',
    supports: [
      { type: 'fixed', position: 0 },
    ],
  },
  {
    id: 'simply-supported',
    name: 'Simply Supported',
    icon: 'horizontal_rule',
    description: 'Pinned at one end, roller at the other',
    beamType: 'simply-supported',
    supports: [
      { type: 'pinned', position: 0 },
      { type: 'roller', position: 1 },
    ],
  },
  {
    id: 'fixed-fixed',
    name: 'Fixed-Fixed Beam',
    icon: 'unfold_less',
    description: 'Fixed at both ends',
    beamType: 'fixed-fixed',
    supports: [
      { type: 'fixed', position: 0 },
      { type: 'fixed', position: 1 },
    ],
  },
  {
    id: 'propped-cantilever',
    name: 'Propped Cantilever',
    icon: 'vertical_align_center',
    description: 'Fixed at one end, roller support at other',
    beamType: 'custom',
    supports: [
      { type: 'fixed', position: 0 },
      { type: 'roller', position: 1 },
    ],
  },
  {
    id: 'overhanging',
    name: 'Overhanging Beam',
    icon: 'trending_flat',
    description: 'Simply supported with overhang',
    beamType: 'custom',
    supports: [
      { type: 'pinned', position: 0.2 },
      { type: 'roller', position: 0.8 },
    ],
  },
]

/* ============ LOAD PRESETS ============ */

export interface LoadPreset {
  id: string
  name: string
  icon: string
  type: LoadType
  description: string
}

export const loadPresets: LoadPreset[] = [
  {
    id: 'point-load',
    name: 'Point Load',
    icon: 'arrow_downward',
    type: 'point',
    description: 'Concentrated force at a point',
  },
  {
    id: 'udl',
    name: 'Uniform Load (UDL)',
    icon: 'density_medium',
    type: 'udl',
    description: 'Uniformly distributed load',
  },
  {
    id: 'triangular',
    name: 'Triangular Load',
    icon: 'change_history',
    type: 'triangular',
    description: 'Linearly varying distributed load',
  },
  {
    id: 'moment',
    name: 'Applied Moment',
    icon: 'rotate_right',
    type: 'moment',
    description: 'Concentrated moment/torque',
  },
]

/* ============ CALCULATOR CONFIG ============ */

export interface BendingStressCalculatorConfig {
  type: 'bending-stress'
  name: string
  description: string
  category: string
  icon: string
  keywords: string[]
}

/* ============ UNIT OPTIONS ============ */

export type ForceUnit = 'N' | 'kN' | 'lbf' | 'kip'
export type LengthUnit = 'm' | 'mm' | 'cm' | 'ft' | 'in'
export type StressUnit = 'Pa' | 'kPa' | 'MPa' | 'GPa' | 'psi' | 'ksi'
export type MomentUnit = 'N·m' | 'kN·m' | 'lb·ft' | 'kip·ft'

export interface UnitSystem {
  force: ForceUnit
  length: LengthUnit
  stress: StressUnit
  moment: MomentUnit
}

export const unitSystems: Record<string, UnitSystem> = {
  SI: { force: 'kN', length: 'm', stress: 'MPa', moment: 'kN·m' },
  metric: { force: 'N', length: 'mm', stress: 'MPa', moment: 'N·m' },
  imperial: { force: 'lbf', length: 'ft', stress: 'psi', moment: 'lb·ft' },
  US: { force: 'kip', length: 'ft', stress: 'ksi', moment: 'kip·ft' },
}

