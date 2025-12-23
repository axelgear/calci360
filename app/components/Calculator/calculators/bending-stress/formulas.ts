/**
 * Bending Stress Calculation Formulas
 * 
 * Key formulas:
 * - Bending Stress: σ = Mc/I = M/S
 * - Shear Stress: τ = VQ/(Ib)
 * - Deflection varies by beam type and loading
 */

import type {
  BeamConfiguration,
  BeamLoad,
  BeamSupport,
  DiagramPoint,
  ReactionForce,
  CalculationResults,
  BeamProfile,
  BeamMaterial,
  PointLoad,
  UniformDistributedLoad,
  TriangularLoad,
  AppliedMoment,
} from './types'

/* ============ REACTION CALCULATIONS ============ */

/**
 * Calculate reaction forces for a simply supported beam
 */
export function calculateSimplySupportedReactions(
  length: number,
  loads: BeamLoad[],
  supports: BeamSupport[]
): ReactionForce[] {
  const pinnedSupport = supports.find(s => s.type === 'pinned')
  const rollerSupport = supports.find(s => s.type === 'roller')
  
  if (!pinnedSupport || !rollerSupport) return []
  
  const posA = pinnedSupport.position * length
  const posB = rollerSupport.position * length
  const span = Math.abs(posB - posA)
  
  if (span === 0) return []
  
  let totalMomentAboutA = 0
  let totalVerticalForce = 0
  
  for (const load of loads) {
    if (load.type === 'point') {
      const loadPos = load.position * length
      const force = load.direction === 'down' ? -load.magnitude : load.magnitude
      totalVerticalForce += force
      totalMomentAboutA += force * (loadPos - posA)
    } else if (load.type === 'udl') {
      const startPos = load.startPosition * length
      const endPos = load.endPosition * length
      const loadLength = endPos - startPos
      const totalForce = load.magnitude * loadLength * (load.direction === 'down' ? -1 : 1)
      const centroid = (startPos + endPos) / 2
      totalVerticalForce += totalForce
      totalMomentAboutA += totalForce * (centroid - posA)
    } else if (load.type === 'triangular') {
      const startPos = load.startPosition * length
      const endPos = load.endPosition * length
      const loadLength = endPos - startPos
      const avgMagnitude = (load.magnitudeStart + load.magnitudeEnd) / 2
      const totalForce = avgMagnitude * loadLength * (load.direction === 'down' ? -1 : 1)
      /* Centroid of trapezoid */
      const centroid = startPos + loadLength * (load.magnitudeStart + 2 * load.magnitudeEnd) / (3 * (load.magnitudeStart + load.magnitudeEnd))
      totalVerticalForce += totalForce
      totalMomentAboutA += totalForce * (centroid - posA)
    } else if (load.type === 'moment') {
      const momentValue = load.direction === 'clockwise' ? -load.magnitude : load.magnitude
      totalMomentAboutA += momentValue
    }
  }
  
  /* Reaction at B from moment equilibrium about A */
  const reactionB = -totalMomentAboutA / span
  
  /* Reaction at A from vertical equilibrium */
  const reactionA = -totalVerticalForce - reactionB
  
  return [
    { supportId: pinnedSupport.id, position: posA, verticalForce: reactionA },
    { supportId: rollerSupport.id, position: posB, verticalForce: reactionB },
  ]
}

/**
 * Calculate reaction forces for a cantilever beam
 */
export function calculateCantileverReactions(
  length: number,
  loads: BeamLoad[],
  supports: BeamSupport[]
): ReactionForce[] {
  const fixedSupport = supports.find(s => s.type === 'fixed')
  
  if (!fixedSupport) return []
  
  const posFixed = fixedSupport.position * length
  
  let totalVerticalForce = 0
  let totalMomentAboutFixed = 0
  
  for (const load of loads) {
    if (load.type === 'point') {
      const loadPos = load.position * length
      const force = load.direction === 'down' ? -load.magnitude : load.magnitude
      totalVerticalForce += force
      totalMomentAboutFixed += force * (loadPos - posFixed)
    } else if (load.type === 'udl') {
      const startPos = load.startPosition * length
      const endPos = load.endPosition * length
      const loadLength = endPos - startPos
      const totalForce = load.magnitude * loadLength * (load.direction === 'down' ? -1 : 1)
      const centroid = (startPos + endPos) / 2
      totalVerticalForce += totalForce
      totalMomentAboutFixed += totalForce * (centroid - posFixed)
    } else if (load.type === 'triangular') {
      const startPos = load.startPosition * length
      const endPos = load.endPosition * length
      const loadLength = endPos - startPos
      const avgMagnitude = (load.magnitudeStart + load.magnitudeEnd) / 2
      const totalForce = avgMagnitude * loadLength * (load.direction === 'down' ? -1 : 1)
      const centroid = startPos + loadLength * (load.magnitudeStart + 2 * load.magnitudeEnd) / (3 * (load.magnitudeStart + load.magnitudeEnd))
      totalVerticalForce += totalForce
      totalMomentAboutFixed += totalForce * (centroid - posFixed)
    } else if (load.type === 'moment') {
      const momentValue = load.direction === 'clockwise' ? -load.magnitude : load.magnitude
      totalMomentAboutFixed += momentValue
    }
  }
  
  return [
    {
      supportId: fixedSupport.id,
      position: posFixed,
      verticalForce: -totalVerticalForce,
      moment: -totalMomentAboutFixed,
    },
  ]
}

/**
 * Calculate reaction forces for a fixed-fixed beam (statically indeterminate)
 * Using superposition method for symmetric cases
 */
export function calculateFixedFixedReactions(
  length: number,
  loads: BeamLoad[],
  supports: BeamSupport[]
): ReactionForce[] {
  const fixedA = supports.find(s => s.type === 'fixed' && s.position < 0.5)
  const fixedB = supports.find(s => s.type === 'fixed' && s.position >= 0.5)
  
  if (!fixedA || !fixedB) return []
  
  /* For fixed-fixed beams, we use standard formulas */
  let totalReactionA = 0
  let totalMomentA = 0
  let totalReactionB = 0
  let totalMomentB = 0
  
  for (const load of loads) {
    if (load.type === 'point') {
      const P = load.direction === 'down' ? load.magnitude : -load.magnitude
      const a = load.position * length
      const b = length - a
      
      /* Fixed-fixed beam with point load formulas */
      const Ra = P * b * b * (3 * a + b) / (length * length * length)
      const Rb = P * a * a * (a + 3 * b) / (length * length * length)
      const Ma = -P * a * b * b / (length * length)
      const Mb = P * a * a * b / (length * length)
      
      totalReactionA += Ra
      totalReactionB += Rb
      totalMomentA += Ma
      totalMomentB += Mb
    } else if (load.type === 'udl') {
      const w = load.direction === 'down' ? load.magnitude : -load.magnitude
      const startPos = load.startPosition * length
      const endPos = load.endPosition * length
      
      /* For full span UDL on fixed-fixed beam */
      if (startPos === 0 && endPos === length) {
        totalReactionA += w * length / 2
        totalReactionB += w * length / 2
        totalMomentA += -w * length * length / 12
        totalMomentB += w * length * length / 12
      } else {
        /* Approximate partial UDL */
        const loadLength = endPos - startPos
        const totalForce = w * loadLength
        const centroid = (startPos + endPos) / 2
        const a = centroid
        const b = length - a
        
        totalReactionA += totalForce * b * b * (3 * a + b) / (length * length * length)
        totalReactionB += totalForce * a * a * (a + 3 * b) / (length * length * length)
        totalMomentA += -totalForce * a * b * b / (length * length)
        totalMomentB += totalForce * a * a * b / (length * length)
      }
    } else if (load.type === 'moment') {
      const M = load.direction === 'clockwise' ? -load.magnitude : load.magnitude
      const a = load.position * length
      const b = length - a
      
      /* Fixed-fixed beam with applied moment formulas */
      totalReactionA += -6 * M * a * b / (length * length * length)
      totalReactionB += 6 * M * a * b / (length * length * length)
      totalMomentA += M * b * (2 * a - b) / (length * length)
      totalMomentB += M * a * (2 * b - a) / (length * length)
    }
  }
  
  return [
    {
      supportId: fixedA.id,
      position: 0,
      verticalForce: totalReactionA,
      moment: totalMomentA,
    },
    {
      supportId: fixedB.id,
      position: length,
      verticalForce: totalReactionB,
      moment: totalMomentB,
    },
  ]
}

/* ============ SHEAR DIAGRAM CALCULATIONS ============ */

/**
 * Generate shear force diagram points
 */
export function generateShearDiagram(
  length: number,
  loads: BeamLoad[],
  reactions: ReactionForce[],
  numPoints = 100
): DiagramPoint[] {
  const points: DiagramPoint[] = []
  
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * length
    let shear = 0
    
    /* Add reaction contributions */
    for (const reaction of reactions) {
      if (reaction.position <= x) {
        shear += reaction.verticalForce
      }
    }
    
    /* Add load contributions */
    for (const load of loads) {
      if (load.type === 'point') {
        const loadPos = load.position * length
        if (loadPos <= x) {
          shear += load.direction === 'down' ? -load.magnitude : load.magnitude
        }
      } else if (load.type === 'udl') {
        const startPos = load.startPosition * length
        const endPos = load.endPosition * length
        const sign = load.direction === 'down' ? -1 : 1
        
        if (x >= startPos) {
          const effectiveEnd = Math.min(x, endPos)
          const loadedLength = effectiveEnd - startPos
          shear += sign * load.magnitude * loadedLength
        }
      } else if (load.type === 'triangular') {
        const startPos = load.startPosition * length
        const endPos = load.endPosition * length
        const sign = load.direction === 'down' ? -1 : 1
        
        if (x >= startPos) {
          const totalLength = endPos - startPos
          const effectiveEnd = Math.min(x, endPos)
          const loadedLength = effectiveEnd - startPos
          
          /* Linear interpolation of load intensity */
          const ratio = loadedLength / totalLength
          const avgIntensity = load.magnitudeStart + (load.magnitudeEnd - load.magnitudeStart) * ratio / 2
          shear += sign * avgIntensity * loadedLength
        }
      }
      /* Moments don't affect shear diagram directly */
    }
    
    points.push({ x, value: shear })
  }
  
  return points
}

/* ============ MOMENT DIAGRAM CALCULATIONS ============ */

/**
 * Generate bending moment diagram points
 */
export function generateMomentDiagram(
  length: number,
  loads: BeamLoad[],
  reactions: ReactionForce[],
  numPoints = 100
): DiagramPoint[] {
  const points: DiagramPoint[] = []
  
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * length
    let moment = 0
    
    /* Add reaction moment contributions */
    for (const reaction of reactions) {
      if (reaction.position <= x) {
        /* Reaction force creates moment */
        moment += reaction.verticalForce * (x - reaction.position)
        /* Add reaction moment for fixed supports */
        if (reaction.moment) {
          moment += reaction.moment
        }
      }
    }
    
    /* Add load moment contributions */
    for (const load of loads) {
      if (load.type === 'point') {
        const loadPos = load.position * length
        if (loadPos <= x) {
          const force = load.direction === 'down' ? -load.magnitude : load.magnitude
          moment += force * (x - loadPos)
        }
      } else if (load.type === 'udl') {
        const startPos = load.startPosition * length
        const endPos = load.endPosition * length
        const sign = load.direction === 'down' ? -1 : 1
        
        if (x >= startPos) {
          const effectiveEnd = Math.min(x, endPos)
          const loadedLength = effectiveEnd - startPos
          const totalForce = sign * load.magnitude * loadedLength
          const centroidFromStart = loadedLength / 2
          const leverArm = x - startPos - centroidFromStart
          moment += totalForce * leverArm
        }
      } else if (load.type === 'triangular') {
        const startPos = load.startPosition * length
        const endPos = load.endPosition * length
        const sign = load.direction === 'down' ? -1 : 1
        
        if (x >= startPos) {
          const totalLength = endPos - startPos
          const effectiveEnd = Math.min(x, endPos)
          const loadedLength = effectiveEnd - startPos
          
          const ratio = loadedLength / totalLength
          const avgIntensity = load.magnitudeStart + (load.magnitudeEnd - load.magnitudeStart) * ratio / 2
          const totalForce = sign * avgIntensity * loadedLength
          
          /* Centroid of loaded portion */
          const centroidOffset = loadedLength * (load.magnitudeStart + 2 * avgIntensity) / (3 * (load.magnitudeStart + avgIntensity))
          moment += totalForce * (x - startPos - centroidOffset)
        }
      } else if (load.type === 'moment') {
        const loadPos = load.position * length
        if (loadPos <= x) {
          moment += load.direction === 'clockwise' ? -load.magnitude : load.magnitude
        }
      }
    }
    
    points.push({ x, value: moment })
  }
  
  return points
}

/* ============ DEFLECTION CALCULATIONS ============ */

/**
 * Calculate deflection using integration of moment/EI
 * Simplified formulas for common cases
 */
export function generateDeflectionCurve(
  length: number,
  loads: BeamLoad[],
  reactions: ReactionForce[],
  momentDiagram: DiagramPoint[],
  E: number, /* Young's modulus (Pa) */
  I: number, /* Moment of inertia (m⁴) */
  beamType: string,
  numPoints = 100
): DiagramPoint[] {
  const EI = E * I
  const points: DiagramPoint[] = []
  
  /* For simple cases, use analytical formulas */
  /* For complex cases, use numerical integration */
  
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * length
    let deflection = 0
    
    for (const load of loads) {
      if (load.type === 'point') {
        const P = load.direction === 'down' ? load.magnitude : -load.magnitude
        const a = load.position * length
        
        if (beamType === 'cantilever') {
          /* Cantilever with point load at distance a from fixed end */
          if (x <= a) {
            deflection += (P * x * x / (6 * EI)) * (3 * a - x)
          } else {
            deflection += (P * a * a / (6 * EI)) * (3 * x - a)
          }
        } else if (beamType === 'simply-supported') {
          /* Simply supported with point load */
          const b = length - a
          if (x <= a) {
            deflection += (P * b * x / (6 * EI * length)) * (length * length - b * b - x * x)
          } else {
            deflection += (P * a * (length - x) / (6 * EI * length)) * (2 * length * x - x * x - a * a)
          }
        } else if (beamType === 'fixed-fixed') {
          /* Fixed-fixed with point load */
          const b = length - a
          if (x <= a) {
            deflection += (P * b * b * x * x / (6 * EI * length * length * length)) * (3 * a * length - 3 * a * x - b * x)
          } else {
            deflection += (P * a * a * (length - x) * (length - x) / (6 * EI * length * length * length)) * (3 * b * length - 3 * b * (length - x) - a * (length - x))
          }
        }
      } else if (load.type === 'udl') {
        const w = load.direction === 'down' ? load.magnitude : -load.magnitude
        const start = load.startPosition * length
        const end = load.endPosition * length
        
        /* Full span UDL */
        if (start === 0 && end === length) {
          if (beamType === 'cantilever') {
            deflection += (w * x * x / (24 * EI)) * (6 * length * length - 4 * length * x + x * x)
          } else if (beamType === 'simply-supported') {
            deflection += (w * x / (24 * EI)) * (length * length * length - 2 * length * x * x + x * x * x)
          } else if (beamType === 'fixed-fixed') {
            deflection += (w * x * x / (24 * EI)) * (length - x) * (length - x)
          }
        }
      }
    }
    
    points.push({ x, value: deflection })
  }
  
  return points
}

/* ============ STRESS CALCULATIONS ============ */

/**
 * Calculate maximum bending stress
 * σ = Mc/I = M/S
 */
export function calculateMaxBendingStress(
  maxMoment: number, /* N·m */
  profile: BeamProfile
): number {
  return Math.abs(maxMoment) / profile.sectionModulus /* Pa */
}

/**
 * Calculate maximum shear stress
 * τ = 1.5 * V / A for rectangular sections
 * τ = VQ/(Ib) for other sections
 */
export function calculateMaxShearStress(
  maxShear: number, /* N */
  profile: BeamProfile
): number {
  /* Simplified: assume 1.5 factor for max shear stress */
  return 1.5 * Math.abs(maxShear) / profile.area /* Pa */
}

/* ============ SECTION MODULUS CALCULATIONS ============ */

/**
 * Calculate section modulus for common shapes
 */
export function calculateSectionModulus(
  shapeId: string,
  dimensions: Record<string, number>
): { I: number; S: number; c: number; A: number } {
  let I = 0 /* Moment of inertia (m⁴) */
  let c = 0 /* Distance to extreme fiber (m) */
  let A = 0 /* Cross-sectional area (m²) */
  
  switch (shapeId) {
    case 'rectangular-bar':
    case 'sheet': {
      const b = dimensions.width || 0.05
      const h = dimensions.height || dimensions.thickness || 0.1
      I = (b * Math.pow(h, 3)) / 12
      c = h / 2
      A = b * h
      break
    }
    
    case 'round-bar': {
      const d = dimensions.diameter || 0.05
      const r = d / 2
      I = (Math.PI * Math.pow(r, 4)) / 4
      c = r
      A = Math.PI * r * r
      break
    }
    
    case 'round-tube': {
      const OD = dimensions.outerDiameter || 0.05
      const t = dimensions.wallThickness || 0.003
      const ID = OD - 2 * t
      const rOuter = OD / 2
      const rInner = ID / 2
      I = (Math.PI / 4) * (Math.pow(rOuter, 4) - Math.pow(rInner, 4))
      c = rOuter
      A = Math.PI * (rOuter * rOuter - rInner * rInner)
      break
    }
    
    case 'i-beam':
    case 'h-beam': {
      const H = dimensions.height || 0.2
      const b = dimensions.flangeWidth || 0.1
      const tw = dimensions.webThickness || 0.01
      const tf = dimensions.flangeThickness || 0.015
      
      /* I-beam: I = (bH³ - (b-tw)(H-2tf)³) / 12 */
      I = (b * Math.pow(H, 3) - (b - tw) * Math.pow(H - 2 * tf, 3)) / 12
      c = H / 2
      A = 2 * b * tf + (H - 2 * tf) * tw
      break
    }
    
    case 'channel': {
      const h = dimensions.height || 0.15
      const w = dimensions.width || 0.05
      const t = dimensions.thickness || 0.006
      
      /* Simplified channel section */
      I = (w * Math.pow(h, 3) - (w - t) * Math.pow(h - 2 * t, 3)) / 12
      c = h / 2
      A = h * t + 2 * (w - t) * t
      break
    }
    
    case 't-bar': {
      const b = dimensions.flangeWidth || 0.05
      const H = dimensions.totalHeight || 0.05
      const tf = dimensions.flangeThickness || 0.005
      const tw = dimensions.webThickness || 0.005
      
      /* T-section - need to find neutral axis first */
      const flangeArea = b * tf
      const webArea = (H - tf) * tw
      A = flangeArea + webArea
      
      const flangeCentroid = tf / 2
      const webCentroid = tf + (H - tf) / 2
      const neutralAxis = (flangeArea * flangeCentroid + webArea * webCentroid) / A
      
      /* Parallel axis theorem */
      I = (b * Math.pow(tf, 3)) / 12 + flangeArea * Math.pow(neutralAxis - flangeCentroid, 2) +
          (tw * Math.pow(H - tf, 3)) / 12 + webArea * Math.pow(webCentroid - neutralAxis, 2)
      
      c = Math.max(neutralAxis, H - neutralAxis)
      break
    }
    
    default: {
      /* Default to rectangular */
      const b = 0.05
      const h = 0.1
      I = (b * Math.pow(h, 3)) / 12
      c = h / 2
      A = b * h
    }
  }
  
  const S = I / c /* Section modulus */
  
  return { I, S, c, A }
}

/* ============ MAIN CALCULATION FUNCTION ============ */

/**
 * Perform full beam analysis
 */
export function analyzeBeam(
  config: BeamConfiguration,
  profile: BeamProfile,
  material: BeamMaterial
): CalculationResults {
  const { length, loads, supports } = config
  const beamType = config.type
  
  /* Calculate reactions based on beam type */
  let reactions: ReactionForce[] = []
  
  if (beamType === 'cantilever') {
    reactions = calculateCantileverReactions(length, loads, supports)
  } else if (beamType === 'simply-supported') {
    reactions = calculateSimplySupportedReactions(length, loads, supports)
  } else if (beamType === 'fixed-fixed') {
    reactions = calculateFixedFixedReactions(length, loads, supports)
  } else {
    /* Custom or other - use simply supported as fallback */
    reactions = calculateSimplySupportedReactions(length, loads, supports)
  }
  
  /* Generate diagrams */
  const shearDiagram = generateShearDiagram(length, loads, reactions)
  const momentDiagram = generateMomentDiagram(length, loads, reactions)
  const deflectionCurve = generateDeflectionCurve(
    length,
    loads,
    reactions,
    momentDiagram,
    material.youngsModulus,
    profile.momentOfInertia,
    beamType
  )
  
  /* Find max/min values */
  let maxShear = 0, maxShearPosition = 0, minShear = 0, minShearPosition = 0
  for (const point of shearDiagram) {
    if (point.value > maxShear) {
      maxShear = point.value
      maxShearPosition = point.x
    }
    if (point.value < minShear) {
      minShear = point.value
      minShearPosition = point.x
    }
  }
  
  let maxMoment = 0, maxMomentPosition = 0, minMoment = 0, minMomentPosition = 0
  for (const point of momentDiagram) {
    if (point.value > maxMoment) {
      maxMoment = point.value
      maxMomentPosition = point.x
    }
    if (point.value < minMoment) {
      minMoment = point.value
      minMomentPosition = point.x
    }
  }
  
  let maxDeflection = 0, maxDeflectionPosition = 0
  for (const point of deflectionCurve) {
    if (Math.abs(point.value) > Math.abs(maxDeflection)) {
      maxDeflection = point.value
      maxDeflectionPosition = point.x
    }
  }
  
  /* Calculate stresses */
  const criticalMoment = Math.max(Math.abs(maxMoment), Math.abs(minMoment))
  const criticalShear = Math.max(Math.abs(maxShear), Math.abs(minShear))
  
  const maxBendingStress = calculateMaxBendingStress(criticalMoment, profile)
  const maxShearStress = calculateMaxShearStress(criticalShear, profile)
  
  /* Safety checks */
  const allowableBending = material.allowableBendingStress || material.yieldStrength * 0.6
  const allowableShear = material.allowableShearStress || material.yieldStrength * 0.4
  const allowableDeflection = length / 360 /* Common limit L/360 */
  
  const bendingStressSafe = maxBendingStress <= allowableBending
  const shearStressSafe = maxShearStress <= allowableShear
  const deflectionSafe = Math.abs(maxDeflection) <= allowableDeflection
  
  const safetyFactor = Math.min(
    allowableBending / maxBendingStress,
    allowableShear / maxShearStress
  )
  
  return {
    reactions,
    shearDiagram,
    maxShear,
    maxShearPosition,
    minShear,
    minShearPosition,
    momentDiagram,
    maxMoment,
    maxMomentPosition,
    minMoment,
    minMomentPosition,
    maxBendingStress,
    maxShearStress,
    maxDeflection,
    maxDeflectionPosition,
    deflectionCurve,
    bendingStressSafe,
    shearStressSafe,
    deflectionSafe,
    safetyFactor,
  }
}

