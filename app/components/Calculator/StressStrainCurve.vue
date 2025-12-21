<script setup lang="ts">
/**
 * StressStrainCurve - SVG visualization of stress-strain relationship
 * Based on Hooke's Law: stress = k × strain
 * Shows: Proportional limit, Yield point, Ultimate strength, Fracture point
 */
import type { MechanicalProperties } from './calculators/metal-weight/materials'

const props = defineProps<{
  material: string
  mechanical: MechanicalProperties
}>()

/* Chart dimensions */
const CHART = {
  width: 280,
  height: 220,
  padding: { left: 35, right: 20, top: 20, bottom: 35 },
  get innerWidth() { return this.width - this.padding.left - this.padding.right },
  get innerHeight() { return this.height - this.padding.top - this.padding.bottom },
  get originX() { return this.padding.left },
  get originY() { return this.height - this.padding.bottom }
}

/* Normalized values for curve scaling based on actual stress-strain diagram
 * Reference points:
 * O = Origin
 * A = Proportional Limit (end of Hooke's Law linear region)
 * B = Upper Yield Point (peak before yield drop)
 * C = Lower Yield Point (dip after upper yield)
 * D = Ultimate Tensile Strength (maximum stress)
 * E = Fracture Point (break)
 */
const curveData = computed(() => {
  const { yieldStrength, tensileStrength, elongation, behavior } = props.mechanical
  
  /* Normalize stress and strain for display */
  const maxStress = tensileStrength * 1.15
  const maxStrain = Math.max(elongation * 1.1, 30) /* Minimum 30% for visibility */
  
  /* Calculate strain positions (% of total elongation) */
  const elasticStrain = Math.min(2, elongation * 0.08)        /* ~2% for elastic region */
  const yieldStrain = Math.min(3, elongation * 0.12)          /* Yield point region */
  const hardeningStrain = elongation * 0.65                    /* Strain hardening ends */
  const fractureStrain = elongation                            /* Fracture at full elongation */
  
  /* Key points on the curve */
  const points = {
    /* A - Proportional Limit */
    proportional: {
      strain: (elasticStrain / maxStrain) * CHART.innerWidth,
      stress: ((yieldStrength * 0.95) / maxStress) * CHART.innerHeight
    },
    /* B - Upper Yield Point */
    upperYield: {
      strain: ((elasticStrain + 0.3) / maxStrain) * CHART.innerWidth,
      stress: ((yieldStrength * 1.02) / maxStress) * CHART.innerHeight
    },
    /* C - Lower Yield Point (dip) */
    lowerYield: {
      strain: ((yieldStrain) / maxStrain) * CHART.innerWidth,
      stress: ((yieldStrength * 0.92) / maxStress) * CHART.innerHeight
    },
    /* D - Ultimate Tensile Strength */
    ultimate: {
      strain: ((hardeningStrain) / maxStrain) * CHART.innerWidth,
      stress: (tensileStrength / maxStress) * CHART.innerHeight
    },
    /* E - Fracture Point */
    fracture: {
      strain: ((fractureStrain) / maxStrain) * CHART.innerWidth,
      stress: ((tensileStrength * 0.75) / maxStress) * CHART.innerHeight
    }
  }
  
  return {
    points,
    behavior,
    maxStress,
    maxStrain,
    elasticStrain
  }
})

/* Generate SVG path based on material behavior
 * Creates accurate stress-strain curve shape:
 * O→A: Linear elastic (Hooke's Law)
 * A→B: Slight curve to upper yield
 * B→C: Drop to lower yield (yield point phenomenon)
 * C→D: Strain hardening (curve rises to ultimate)
 * D→E: Necking (curve drops to fracture)
 */
const curvePath = computed(() => {
  const { points, behavior } = curveData.value
  const { proportional, upperYield, lowerYield, ultimate, fracture } = points
  
  /* Starting point (origin) */
  const O = { x: CHART.originX, y: CHART.originY }
  
  /* Convert to SVG coordinates (y is inverted) */
  const A = { x: O.x + proportional.strain, y: O.y - proportional.stress }
  const B = { x: O.x + upperYield.strain, y: O.y - upperYield.stress }
  const C = { x: O.x + lowerYield.strain, y: O.y - lowerYield.stress }
  const D = { x: O.x + ultimate.strain, y: O.y - ultimate.stress }
  const E = { x: O.x + fracture.strain, y: O.y - fracture.stress }
  
  if (behavior === 'brittle') {
    /* Brittle: Linear to peak, sudden fracture (no yield drop, no necking) */
    return `M ${O.x} ${O.y}
            L ${A.x} ${A.y}
            L ${D.x * 0.6 + O.x * 0.4} ${D.y}`
  } else if (behavior === 'plastic') {
    /* Highly Plastic: Low yield, very gradual curve, large elongation */
    return `M ${O.x} ${O.y}
            L ${A.x * 0.7 + O.x * 0.3} ${A.y + 15}
            Q ${B.x} ${B.y + 10}, ${C.x + 10} ${C.y + 5}
            Q ${(C.x + D.x) / 2} ${C.y}, ${D.x} ${D.y + 5}
            Q ${(D.x + E.x) / 2} ${D.y + 3}, ${E.x} ${E.y}`
  } else {
    /* Ductile: Classic stress-strain curve with all regions */
    return `M ${O.x} ${O.y}
            L ${A.x} ${A.y}
            Q ${A.x + 3} ${A.y - 2}, ${B.x} ${B.y}
            Q ${B.x + 3} ${B.y + 3}, ${C.x} ${C.y}
            Q ${(C.x + D.x) / 2} ${C.y - 10}, ${D.x} ${D.y}
            Q ${D.x + 15} ${D.y + 15}, ${E.x} ${E.y}`
  }
})

/* Points for markers on the curve */
const curvePoints = computed(() => {
  const O = { x: CHART.originX, y: CHART.originY }
  const { points } = curveData.value
  
  return {
    /* A - Proportional Limit */
    proportional: { 
      x: O.x + points.proportional.strain, 
      y: O.y - points.proportional.stress 
    },
    /* B - Upper Yield Point */
    upperYield: { 
      x: O.x + points.upperYield.strain, 
      y: O.y - points.upperYield.stress 
    },
    /* C - Lower Yield Point */
    lowerYield: { 
      x: O.x + points.lowerYield.strain, 
      y: O.y - points.lowerYield.stress 
    },
    /* D - Ultimate Strength */
    ultimate: { 
      x: O.x + points.ultimate.strain, 
      y: O.y - points.ultimate.stress 
    },
    /* E - Fracture Point */
    fracture: { 
      x: O.x + points.fracture.strain, 
      y: O.y - points.fracture.stress 
    }
  }
})

/* Hooke's Law line (linear elastic region O to A) */
const hookesLine = computed(() => {
  const O = { x: CHART.originX, y: CHART.originY }
  const { points } = curveData.value
  
  return `M ${O.x} ${O.y} L ${O.x + points.proportional.strain} ${O.y - points.proportional.stress}`
})
</script>

<template>
  <div class="stress-strain-curve">
    <div class="curve-header">
      <span class="material-icons">show_chart</span>
      <span class="curve-title">Stress-Strain Curve</span>
      <span class="material-name">{{ material }}</span>
    </div>
    
    <svg :viewBox="`0 0 ${CHART.width} ${CHART.height}`" class="curve-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <!-- Gradient for curve -->
        <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.7" />
          <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="1" />
        </linearGradient>
      </defs>
      
      <!-- Grid lines -->
      <g class="grid" opacity="0.1">
        <line 
          v-for="i in 6" 
          :key="`h${i}`" 
          :x1="CHART.originX" 
          :y1="CHART.padding.top + (i - 1) * (CHART.innerHeight / 5)" 
          :x2="CHART.width - CHART.padding.right" 
          :y2="CHART.padding.top + (i - 1) * (CHART.innerHeight / 5)" 
          stroke="var(--accent-500)" 
        />
        <line 
          v-for="i in 6" 
          :key="`v${i}`" 
          :x1="CHART.originX + (i - 1) * (CHART.innerWidth / 5)" 
          :y1="CHART.padding.top" 
          :x2="CHART.originX + (i - 1) * (CHART.innerWidth / 5)" 
          :y2="CHART.originY" 
          stroke="var(--accent-500)" 
        />
      </g>
      
      <!-- Axes -->
      <g class="axes">
        <!-- Y-axis (Stress) -->
        <line :x1="CHART.originX" :y1="CHART.originY" :x2="CHART.originX" :y2="CHART.padding.top - 5" stroke="var(--text)" stroke-width="1.5" />
        <polygon :points="`${CHART.originX},${CHART.padding.top - 10} ${CHART.originX - 4},${CHART.padding.top - 2} ${CHART.originX + 4},${CHART.padding.top - 2}`" fill="var(--text)" />
        
        <!-- X-axis (Strain) -->
        <line :x1="CHART.originX" :y1="CHART.originY" :x2="CHART.width - CHART.padding.right + 5" :y2="CHART.originY" stroke="var(--text)" stroke-width="1.5" />
        <polygon :points="`${CHART.width - CHART.padding.right + 10},${CHART.originY} ${CHART.width - CHART.padding.right + 2},${CHART.originY - 4} ${CHART.width - CHART.padding.right + 2},${CHART.originY + 4}`" fill="var(--text)" />
      </g>
      
      <!-- Axis labels -->
      <text :x="12" :y="CHART.height / 2" class="axis-label" :transform="`rotate(-90, 12, ${CHART.height / 2})`">Stress (σ)</text>
      <text :x="CHART.width / 2" :y="CHART.height - 8" class="axis-label">Strain (ε)</text>
      
      <!-- Elastic region fill (triangle O-A-vertical) -->
      <path 
        :d="`M ${CHART.originX} ${CHART.originY} L ${curvePoints.proportional.x} ${curvePoints.proportional.y} L ${curvePoints.proportional.x} ${CHART.originY} Z`"
        fill="var(--accent-500)"
        opacity="0.06"
      />
      
      <!-- Hooke's Law dashed line extension -->
      <path :d="hookesLine" stroke="var(--accent-500)" stroke-width="1" stroke-dasharray="4 2" opacity="0.25" fill="none" />
      
      <!-- Main curve -->
      <path 
        :d="curvePath" 
        stroke="url(#curveGradient)" 
        stroke-width="2.5" 
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <!-- Key points with labels -->
      <g class="curve-points">
        <!-- A - Proportional Limit -->
        <circle :cx="curvePoints.proportional.x" :cy="curvePoints.proportional.y" r="4" class="point" />
        <text :x="curvePoints.proportional.x - 12" :y="curvePoints.proportional.y - 8" class="point-label">A</text>
        
        <!-- B - Upper Yield Point -->
        <circle :cx="curvePoints.upperYield.x" :cy="curvePoints.upperYield.y" r="4" class="point" />
        <text :x="curvePoints.upperYield.x + 6" :y="curvePoints.upperYield.y - 8" class="point-label">B</text>
        
        <!-- C - Lower Yield Point -->
        <circle :cx="curvePoints.lowerYield.x" :cy="curvePoints.lowerYield.y" r="4" class="point" />
        <text :x="curvePoints.lowerYield.x + 6" :y="curvePoints.lowerYield.y + 12" class="point-label">C</text>
        
        <!-- D - Ultimate Strength -->
        <circle :cx="curvePoints.ultimate.x" :cy="curvePoints.ultimate.y" r="5" class="point" />
        <text :x="curvePoints.ultimate.x + 8" :y="curvePoints.ultimate.y - 8" class="point-label">D</text>
        
        <!-- E - Fracture Point -->
        <circle :cx="curvePoints.fracture.x" :cy="curvePoints.fracture.y" r="5" class="point fracture" />
        <text :x="curvePoints.fracture.x + 8" :y="curvePoints.fracture.y - 5" class="point-label">E</text>
      </g>
      
      <!-- Region Labels -->
      <g class="region-labels">
        <text :x="CHART.originX + 8" :y="CHART.originY - 8" class="region-label">Linear</text>
        <text :x="curvePoints.lowerYield.x + 5" :y="CHART.originY - 8" class="region-label">Strain Hardening</text>
        <text :x="curvePoints.ultimate.x + 5" :y="CHART.originY - 8" class="region-label">Necking</text>
      </g>
      
      <!-- Horizontal reference lines for yield and ultimate stress -->
      <line 
        :x1="CHART.originX" 
        :y1="curvePoints.upperYield.y" 
        :x2="curvePoints.upperYield.x" 
        :y2="curvePoints.upperYield.y" 
        stroke="var(--accent-500)" 
        stroke-width="0.5" 
        stroke-dasharray="2 2" 
        opacity="0.3"
      />
      <line 
        :x1="CHART.originX" 
        :y1="curvePoints.ultimate.y" 
        :x2="curvePoints.ultimate.x" 
        :y2="curvePoints.ultimate.y" 
        stroke="var(--accent-500)" 
        stroke-width="0.5" 
        stroke-dasharray="2 2" 
        opacity="0.3"
      />
      
      <!-- Stress level labels on Y-axis -->
      <text :x="CHART.originX - 3" :y="curvePoints.upperYield.y + 3" class="stress-label">σᵧ</text>
      <text :x="CHART.originX - 3" :y="curvePoints.ultimate.y + 3" class="stress-label">σᵤ</text>
    </svg>
    
    <!-- Legend -->
    <div class="curve-legend">
      <div class="legend-item">
        <span class="legend-label">A</span>
        <span class="legend-text">Proportional Limit</span>
      </div>
      <div class="legend-item">
        <span class="legend-label">B</span>
        <span class="legend-text">Upper Yield</span>
      </div>
      <div class="legend-item">
        <span class="legend-label">C</span>
        <span class="legend-text">Lower Yield</span>
      </div>
      <div class="legend-item">
        <span class="legend-label">D</span>
        <span class="legend-text">Ultimate (σᵤ): {{ mechanical.tensileStrength }} MPa</span>
      </div>
      <div class="legend-item">
        <span class="legend-label hollow">E</span>
        <span class="legend-text">Fracture: {{ mechanical.elongation }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stress-strain-curve {
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 5%) 0%, transparent 100%);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 1rem;
  padding: 1rem;
}

.curve-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  .material-icons {
    font-size: 1.1rem;
    color: var(--accent-500);
  }
  
  .curve-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
  }
  
  .material-name {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--accent-500);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
}

.curve-svg {
  width: 100%;
  height: auto;
  min-height: 200px;
}

.axis-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  fill: var(--text);
  opacity: 0.7;
}

.point-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  fill: var(--accent-500);
  font-weight: 700;
}

.region-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  fill: var(--text);
  opacity: 0.5;
}

.curve-points {
  .point {
    fill: var(--accent-500);
    transition: r 0.2s ease;
    
    &.fracture {
      fill: none;
      stroke: var(--accent-500);
      stroke-width: 2;
    }
  }
}

.stress-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  fill: var(--accent-500);
  font-weight: 600;
  text-anchor: end;
}

.curve-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgb(var(--accent-500-rgb) / 10%);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.legend-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-500);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  color: var(--main-bg);
  
  &.hollow {
    background: transparent;
    border: 2px solid var(--accent-500);
    color: var(--accent-500);
  }
}

.legend-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text);
  opacity: 0.8;
}
</style>

