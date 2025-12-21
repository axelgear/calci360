/**
 * HVAC Duct Sizing Calculations
 * Based on ASHRAE Fundamentals and SMACNA standards
 * Uses Standard Duct Sizing Table (Equal-Friction Method 0.10 in.wg per 100 ft)
 */

import type { DuctDimensions, DuctSegment, DuctSystem, DuctNode, SystemResults, BOMItem } from './types'
import { calculateAirDensity, calculateAirViscosity, calculateSpecificHeat } from './air-properties'
import { getFitting, calculateEquivalentLength, getEquivalentDiameter } from './fittings'
import { getStandardDuctSize, inchesToMm, standardDuctSizes, getAllDuctSizeOptions } from './standard-sizes'

/* Re-export standard sizes for use in other modules */
export { standardDuctSizes, getStandardDuctSize, getAllDuctSizeOptions } from './standard-sizes'

/* ========== CONSTANTS ========== */

const GRAVITY = 9.81 /* m/s² */

/* ========== UNIT CONVERSIONS ========== */

export function cfmToM3s(cfm: number): number {
  return cfm * 0.000471947
}

export function m3sToCfm(m3s: number): number {
  return m3s / 0.000471947
}

export function paToInWg(pa: number): number {
  return pa * 0.00401865
}

export function inWgToPa(inWg: number): number {
  return inWg / 0.00401865
}

export function mmToInch(mm: number): number {
  return mm / 25.4
}

export function inchToMm(inch: number): number {
  return inch * 25.4
}

/* ========== DUCT CALCULATIONS ========== */

/**
 * Calculate equivalent diameter for rectangular duct
 * De = 1.3 * (a*b)^0.625 / (a+b)^0.25
 */
export function equivalentDiameter(width: number, height: number): number {
  return 1.3 * Math.pow(width * height, 0.625) / Math.pow(width + height, 0.25)
}

/**
 * Calculate cross-sectional area
 * @returns Area in m² (input in mm)
 */
export function ductArea(duct: DuctDimensions): number {
  if (duct.shape === 'round') {
    return Math.PI * Math.pow(duct.diameter / 1000 / 2, 2)
  }
  return (duct.width / 1000) * (duct.height / 1000)
}

/**
 * Calculate hydraulic diameter
 * Dh = 4 * Area / Perimeter
 */
export function hydraulicDiameter(duct: DuctDimensions): number {
  if (duct.shape === 'round') {
    return duct.diameter / 1000 /* m */
  }
  const a = duct.width / 1000
  const b = duct.height / 1000
  return (4 * a * b) / (2 * (a + b))
}

/**
 * Calculate velocity from flow rate and duct size
 * @param cfm - Flow rate in CFM
 * @param duct - Duct dimensions
 * @returns Velocity in m/s
 */
export function calculateVelocity(cfm: number, duct: DuctDimensions): number {
  const flowM3s = cfmToM3s(cfm)
  const area = ductArea(duct)
  return flowM3s / area
}

/**
 * Calculate velocity from flow rate and duct size
 * @param flowM3s - Flow rate in m³/s
 * @param duct - Duct dimensions
 * @returns Velocity in m/s
 */
export function calculateVelocityMetric(flowM3s: number, duct: DuctDimensions): number {
  const area = ductArea(duct)
  return flowM3s / area
}

/**
 * Calculate Reynolds number
 */
export function reynoldsNumber(velocity: number, Dh: number, density: number, viscosity: number): number {
  return (density * velocity * Dh) / viscosity
}

/**
 * Calculate friction factor using Colebrook-White equation (implicit)
 * For typical galvanized steel duct, roughness ε ≈ 0.00015 m (0.15 mm)
 */
export function frictionFactor(Re: number, Dh: number, roughness = 0.00015): number {
  if (Re < 2300) {
    /* Laminar flow */
    return 64 / Re
  }
  
  /* Turbulent - use Haaland approximation of Colebrook-White */
  const relRoughness = roughness / Dh
  const f = Math.pow(
    -1.8 * Math.log10(
      Math.pow(relRoughness / 3.7, 1.11) + 6.9 / Re
    ),
    -2
  )
  return f
}

/**
 * Calculate friction loss (pressure drop per unit length)
 * ΔP/L = f * (ρ * v²) / (2 * Dh)
 * @returns Pa/m
 */
export function frictionLoss(
  velocity: number,
  Dh: number,
  density: number,
  f: number
): number {
  return f * (density * velocity * velocity) / (2 * Dh)
}

/**
 * Calculate velocity pressure
 * Pv = 0.5 * ρ * v²
 * @returns Pa
 */
export function velocityPressure(velocity: number, density: number): number {
  return 0.5 * density * velocity * velocity
}

/**
 * Size duct for given CFM using Standard Duct Sizing Table
 * Based on Equal-Friction Method (0.10 in.wg per 100 ft)
 * @param cfm - Required airflow in CFM
 * @param shape - 'round' or 'rectangular'
 * @returns Recommended duct size from standard table
 */
export function sizeDuctEqualFriction(
  cfm: number,
  _targetFriction: number,
  _maxVelocity: number,
  shape: 'round' | 'rectangular',
  _tempC = 20
): DuctDimensions {
  const stdSize = getStandardDuctSize(cfm, shape)
  
  if (shape === 'round') {
    const size = stdSize.sizeInMm as { diameter: number }
    return { shape: 'round', diameter: size.diameter }
  } else {
    const size = stdSize.sizeInMm as { width: number; height: number }
    return { shape: 'rectangular', width: size.width, height: size.height }
  }
}

/**
 * Size duct for given CFM using velocity method
 * Now uses standard duct sizing table for consistency
 */
export function sizeDuctVelocity(
  cfm: number,
  _targetVelocity: number,
  shape: 'round' | 'rectangular'
): DuctDimensions {
  /* Use standard sizing table - same as equal friction method */
  return sizeDuctEqualFriction(cfm, 0, 0, shape)
}

/* ========== SYSTEM CALCULATIONS ========== */

/**
 * Calculate total CFM at each node by traversing tree from leaves
 * CFM flows FROM AHU/junctions TO diffusers (downstream)
 * Each parent's CFM = sum of all downstream children's CFM
 */
export function calculateNodeCFM(system: DuctSystem): Map<string, number> {
  const nodeCFM = new Map<string, number>()
  const visited = new Set<string>()
  
  /* Build adjacency list (parent to children) */
  const parentToChildren = new Map<string, string[]>()
  
  for (const segment of system.segments) {
    const children = parentToChildren.get(segment.fromNodeId) ?? []
    children.push(segment.toNodeId)
    parentToChildren.set(segment.fromNodeId, children)
  }
  
  /* DFS to calculate CFM (post-order: calculate children first, then sum) */
  function calculateCFM(nodeId: string): number {
    if (visited.has(nodeId)) {
      return nodeCFM.get(nodeId) ?? 0
    }
    visited.add(nodeId)
    
    const node = system.nodes.find(n => n.id === nodeId)
    const children = parentToChildren.get(nodeId) ?? []
    
    /* Sum CFM from all downstream children */
    const childrenCFM = children.reduce((sum, childId) => sum + calculateCFM(childId), 0)
    
    /* 
     * For diffusers (leaf nodes): use their specified CFM
     * For junctions/AHU: CFM is sum of downstream branches
     * If a diffuser has children (unusual), add its own CFM to children's total
     */
    let totalCFM: number
    if (node?.type === 'diffuser' && node.cfm) {
      /* Diffuser node - its CFM requirement */
      /* If it has children (unusual topology), add them */
      totalCFM = node.cfm + childrenCFM
    } else {
      /* Junction or AHU - just sum children */
      totalCFM = childrenCFM
    }
    
    nodeCFM.set(nodeId, totalCFM)
    return totalCFM
  }
  
  /* Find root node (AHU) and calculate from there */
  const ahuNode = system.nodes.find(n => n.type === 'ahu')
  if (ahuNode) {
    calculateCFM(ahuNode.id)
  }
  
  /* Also calculate for any disconnected nodes */
  for (const node of system.nodes) {
    if (!visited.has(node.id)) {
      calculateCFM(node.id)
    }
  }
  
  return nodeCFM
}

/**
 * Calculate all segment properties
 */
export function calculateSegments(
  system: DuctSystem,
  nodeCFM: Map<string, number>
): void {
  const tempC = system.supplyAirTemp
  const density = calculateAirDensity(tempC)
  const viscosity = calculateAirViscosity(tempC)
  
  for (const segment of system.segments) {
    /* Get CFM for this segment (flow going TO the toNode) */
    const cfm = nodeCFM.get(segment.toNodeId) ?? 0
    
    /* Size duct if not manually specified */
    let ductSize: DuctDimensions
    if (segment.manualSize) {
      ductSize = segment.manualSize
    } else {
      if (system.designMethod === 'equal-friction') {
        ductSize = sizeDuctEqualFriction(
          cfm,
          system.targetFriction ?? 1.0,
          system.maxVelocity,
          'rectangular',
          tempC
        )
      } else {
        ductSize = sizeDuctVelocity(
          cfm,
          system.targetVelocity ?? 5.0,
          'rectangular'
        )
      }
    }
    
    /* Calculate flow properties */
    const velocity = calculateVelocity(cfm, ductSize)
    const Dh = hydraulicDiameter(ductSize)
    const Re = reynoldsNumber(velocity, Dh, density, viscosity)
    const f = frictionFactor(Re, Dh)
    const friction = frictionLoss(velocity, Dh, density, f)
    const Pv = velocityPressure(velocity, density)
    
    /* Calculate equivalent length from fittings */
    let totalEL = 0
    for (const fitting of segment.fittings) {
      const fittingType = getFitting(fitting.fittingId)
      if (fittingType) {
        const el = fitting.customEL ?? calculateEquivalentLength(fittingType, ductSize)
        totalEL += el * fitting.quantity
      }
    }
    
    /* Total pressure drop = friction * (actual length + equivalent length) */
    const effectiveLength = segment.length + totalEL
    const totalPressureDrop = friction * effectiveLength
    
    /* Temperature drop (simplified) */
    const tempDrop = calculateTempDrop(
      segment.length,
      ductSize,
      cfm,
      system.supplyAirTemp,
      system.ambientTemp,
      segment.insulation?.thickness ?? 0
    )
    
    segment.calculated = {
      cfm,
      ductSize,
      velocity,
      velocityPressure: Pv,
      frictionLoss: friction,
      totalPressureDrop,
      equivalentLength: totalEL,
      tempDrop,
    }
  }
}

/**
 * Calculate temperature drop through a duct segment
 */
function calculateTempDrop(
  length: number,
  ductSize: DuctDimensions,
  cfm: number,
  supplyTemp: number,
  ambientTemp: number,
  insulationThickness: number
): number {
  const flowM3s = cfmToM3s(cfm)
  const density = calculateAirDensity(supplyTemp)
  const cp = calculateSpecificHeat(supplyTemp) * 1000 /* J/(kg·K) */
  const massFlow = flowM3s * density /* kg/s */
  
  /* Surface area */
  let surfaceArea: number
  if (ductSize.shape === 'round') {
    surfaceArea = Math.PI * (ductSize.diameter / 1000) * length
  } else {
    surfaceArea = 2 * ((ductSize.width / 1000) + (ductSize.height / 1000)) * length
  }
  
  /* U-value (simplified) */
  const hInside = 25 /* W/(m²·K) */
  const hOutside = 10 /* W/(m²·K) */
  const kInsulation = insulationThickness > 0 ? 0.04 : 45 /* W/(m·K) */
  const rInsulation = insulationThickness > 0 ? (insulationThickness / 1000) / kInsulation : 0
  
  const U = 1 / (1 / hInside + rInsulation + 1 / hOutside)
  
  /* NTU method */
  const ntu = (U * surfaceArea) / (massFlow * cp)
  const effectiveness = 1 - Math.exp(-ntu)
  
  return effectiveness * (supplyTemp - ambientTemp)
}

/**
 * Find critical path (highest pressure drop)
 */
export function findCriticalPath(system: DuctSystem): { path: string[], pressure: number } {
  const paths: { path: string[], pressure: number }[] = []
  
  /* Find all leaf nodes (diffusers) */
  const leafNodes = system.nodes.filter(n => n.type === 'diffuser')
  
  /* Build parent map */
  const childToParentSegment = new Map<string, DuctSegment>()
  for (const segment of system.segments) {
    childToParentSegment.set(segment.toNodeId, segment)
  }
  
  /* Trace path from each leaf to root */
  for (const leaf of leafNodes) {
    const path: string[] = []
    let totalPressure = 0
    let currentNodeId = leaf.id
    
    while (childToParentSegment.has(currentNodeId)) {
      const segment = childToParentSegment.get(currentNodeId)!
      path.unshift(segment.id)
      totalPressure += segment.calculated?.totalPressureDrop ?? 0
      currentNodeId = segment.fromNodeId
    }
    
    paths.push({ path, pressure: totalPressure })
  }
  
  /* Return path with highest pressure */
  return paths.reduce((max, p) => p.pressure > max.pressure ? p : max, { path: [], pressure: 0 })
}

/**
 * Generate Bill of Materials
 */
export function generateBOM(system: DuctSystem): BOMItem[] {
  const bom: BOMItem[] = []
  
  /* Aggregate duct lengths by size */
  const ductSizes = new Map<string, number>()
  
  for (const segment of system.segments) {
    if (!segment.calculated) continue
    
    const size = segment.calculated.ductSize
    const sizeKey = size.shape === 'round'
      ? `Round ${size.diameter}mm`
      : `Rect ${size.width}x${size.height}mm`
    
    ductSizes.set(sizeKey, (ductSizes.get(sizeKey) ?? 0) + segment.length)
  }
  
  /* Add duct items */
  for (const [size, length] of ductSizes) {
    bom.push({
      description: `Duct - ${size}`,
      size,
      quantity: Math.ceil(length),
      unit: 'm',
      length,
      material: 'Galvanized Steel',
    })
  }
  
  /* Aggregate fittings */
  const fittingCounts = new Map<string, { fitting: string, count: number }>()
  
  for (const segment of system.segments) {
    for (const f of segment.fittings) {
      const fittingType = getFitting(f.fittingId)
      if (!fittingType) continue
      
      const key = f.fittingId
      const current = fittingCounts.get(key) ?? { fitting: fittingType.name, count: 0 }
      current.count += f.quantity
      fittingCounts.set(key, current)
    }
  }
  
  /* Add fitting items */
  for (const [_, item] of fittingCounts) {
    bom.push({
      description: item.fitting,
      size: '-',
      quantity: item.count,
      unit: 'pcs',
    })
  }
  
  /* Add diffusers */
  const diffuserCount = system.nodes.filter(n => n.type === 'diffuser').length
  if (diffuserCount > 0) {
    bom.push({
      description: 'Diffuser/Grille',
      size: '-',
      quantity: diffuserCount,
      unit: 'pcs',
    })
  }
  
  return bom
}

/**
 * Calculate complete system results
 */
export function calculateSystem(system: DuctSystem): SystemResults {
  const warnings: string[] = []
  
  /* Calculate CFM at each node */
  const nodeCFM = calculateNodeCFM(system)
  
  /* Calculate segment properties */
  calculateSegments(system, nodeCFM)
  
  /* Check for warnings */
  for (const segment of system.segments) {
    if (segment.calculated) {
      if (segment.calculated.velocity > system.maxVelocity) {
        warnings.push(`Segment to ${segment.toNodeId}: velocity ${segment.calculated.velocity.toFixed(1)} m/s exceeds max ${system.maxVelocity} m/s`)
      }
    }
  }
  
  /* Find critical path */
  const critical = findCriticalPath(system)
  
  /* Generate BOM */
  const bom = generateBOM(system)
  
  /* Get total CFM */
  const ahuNode = system.nodes.find(n => n.type === 'ahu')
  const totalCFM = ahuNode ? (nodeCFM.get(ahuNode.id) ?? 0) : 0
  
  return {
    totalCFM,
    totalPressureDrop: critical.pressure,
    criticalPath: critical.path,
    criticalPathPressure: critical.pressure,
    bom,
    warnings,
  }
}

