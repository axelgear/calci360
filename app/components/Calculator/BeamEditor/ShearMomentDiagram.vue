<script setup lang="ts">
import type { DiagramPoint, ReactionForce } from '~/components/Calculator/calculators/bending-stress/types'
import { useUiTranslator } from '~/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = defineProps<{
  beamLength: number
  shearDiagram: DiagramPoint[]
  momentDiagram: DiagramPoint[]
  deflectionCurve?: DiagramPoint[]
  reactions: ReactionForce[]
  maxShear: number
  minShear: number
  maxMoment: number
  minMoment: number
  maxDeflection?: number
}>()

/* Chart dimensions */
const WIDTH = 600
const HEIGHT = 120
const PADDING = { top: 20, right: 20, bottom: 30, left: 50 }
const CHART_WIDTH = WIDTH - PADDING.left - PADDING.right
const CHART_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom

/* Scale position (0 to L) to X coordinate */
function scaleX(x: number): number {
  return PADDING.left + (x / props.beamLength) * CHART_WIDTH
}

/* Scale value to Y coordinate (inverted for SVG) */
function scaleY(value: number, minVal: number, maxVal: number): number {
  const range = Math.max(Math.abs(maxVal), Math.abs(minVal)) || 1
  const normalizedValue = value / range /* -1 to 1 */
  const centerY = PADDING.top + CHART_HEIGHT / 2
  return centerY - (normalizedValue * CHART_HEIGHT / 2)
}

/* Generate SVG path from diagram points */
function generatePath(points: DiagramPoint[], minVal: number, maxVal: number): string {
  if (points.length === 0) return ''
  
  const pathParts = points.map((point, index) => {
    const x = scaleX(point.x)
    const y = scaleY(point.value, minVal, maxVal)
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  })
  
  return pathParts.join(' ')
}

/* Generate filled area path (from baseline to curve) */
function generateAreaPath(points: DiagramPoint[], minVal: number, maxVal: number): string {
  if (points.length === 0) return ''
  
  const centerY = PADDING.top + CHART_HEIGHT / 2
  const first = points[0]
  const last = points[points.length - 1]
  
  let path = `M ${scaleX(first.x)} ${centerY}`
  
  for (const point of points) {
    path += ` L ${scaleX(point.x)} ${scaleY(point.value, minVal, maxVal)}`
  }
  
  path += ` L ${scaleX(last.x)} ${centerY} Z`
  
  return path
}

/* Format value for axis labels */
function formatValue(value: number, type: 'shear' | 'moment' | 'deflection'): string {
  if (type === 'deflection') {
    return `${(value * 1000).toFixed(1)} mm`
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)} kN${type === 'moment' ? '·m' : ''}`
  }
  return `${value.toFixed(0)} N${type === 'moment' ? '·m' : ''}`
}

/* Computed paths */
const shearPath = computed(() => generatePath(props.shearDiagram, props.minShear, props.maxShear))
const shearAreaPath = computed(() => generateAreaPath(props.shearDiagram, props.minShear, props.maxShear))
const momentPath = computed(() => generatePath(props.momentDiagram, props.minMoment, props.maxMoment))
const momentAreaPath = computed(() => generateAreaPath(props.momentDiagram, props.minMoment, props.maxMoment))

const deflectionPath = computed(() => {
  if (!props.deflectionCurve || props.deflectionCurve.length === 0) return ''
  const maxDef = props.maxDeflection ?? 0.001
  return generatePath(props.deflectionCurve, -Math.abs(maxDef), Math.abs(maxDef))
})

/* Y axis tick values */
const shearTicks = computed(() => {
  const max = Math.max(Math.abs(props.maxShear), Math.abs(props.minShear))
  return [-max, 0, max].filter(v => isFinite(v))
})

const momentTicks = computed(() => {
  const max = Math.max(Math.abs(props.maxMoment), Math.abs(props.minMoment))
  return [-max, 0, max].filter(v => isFinite(v))
})
</script>

<template>
  <div class="shear-moment-diagram">
    <!-- Shear Force Diagram -->
    <div class="diagram-section">
      <h4 class="diagram-title">
        <span class="material-icons">swap_vert</span>
        {{ t('Shear Force Diagram (SFD)') }}
      </h4>
      <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" class="diagram-svg shear-diagram">
        <!-- Grid lines -->
        <line
          :x1="PADDING.left"
          :y1="PADDING.top + CHART_HEIGHT / 2"
          :x2="PADDING.left + CHART_WIDTH"
          :y2="PADDING.top + CHART_HEIGHT / 2"
          class="axis-line"
        />
        
        <!-- Filled area -->
        <path
          v-if="shearAreaPath"
          :d="shearAreaPath"
          class="area-fill shear-fill"
        />
        
        <!-- Curve line -->
        <path
          v-if="shearPath"
          :d="shearPath"
          class="curve-line shear-line"
        />
        
        <!-- Y-axis labels -->
        <text
          v-for="tick in shearTicks"
          :key="tick"
          :x="PADDING.left - 5"
          :y="scaleY(tick, minShear, maxShear)"
          class="axis-label"
          text-anchor="end"
          dominant-baseline="middle"
        >{{ formatValue(tick, 'shear') }}</text>
        
        <!-- X-axis labels -->
        <text
          :x="PADDING.left"
          :y="HEIGHT - 5"
          class="axis-label"
        >0</text>
        <text
          :x="PADDING.left + CHART_WIDTH / 2"
          :y="HEIGHT - 5"
          class="axis-label"
          text-anchor="middle"
        >{{ (beamLength / 2).toFixed(1) }}m</text>
        <text
          :x="PADDING.left + CHART_WIDTH"
          :y="HEIGHT - 5"
          class="axis-label"
          text-anchor="end"
        >{{ beamLength.toFixed(1) }}m</text>
        
        <!-- Max/Min indicators -->
        <g v-if="maxShear !== 0">
          <circle
            :cx="scaleX(shearDiagram.find(p => p.value === maxShear)?.x ?? 0)"
            :cy="scaleY(maxShear, minShear, maxShear)"
            r="4"
            class="indicator max-indicator"
          />
          <text
            :x="scaleX(shearDiagram.find(p => p.value === maxShear)?.x ?? 0) + 5"
            :y="scaleY(maxShear, minShear, maxShear) - 8"
            class="indicator-label"
          >V_max = {{ formatValue(maxShear, 'shear') }}</text>
        </g>
      </svg>
    </div>

    <!-- Bending Moment Diagram -->
    <div class="diagram-section">
      <h4 class="diagram-title">
        <span class="material-icons">sync_alt</span>
        {{ t('Bending Moment Diagram (BMD)') }}
      </h4>
      <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" class="diagram-svg moment-diagram">
        <!-- Grid lines -->
        <line
          :x1="PADDING.left"
          :y1="PADDING.top + CHART_HEIGHT / 2"
          :x2="PADDING.left + CHART_WIDTH"
          :y2="PADDING.top + CHART_HEIGHT / 2"
          class="axis-line"
        />
        
        <!-- Filled area -->
        <path
          v-if="momentAreaPath"
          :d="momentAreaPath"
          class="area-fill moment-fill"
        />
        
        <!-- Curve line -->
        <path
          v-if="momentPath"
          :d="momentPath"
          class="curve-line moment-line"
        />
        
        <!-- Y-axis labels -->
        <text
          v-for="tick in momentTicks"
          :key="tick"
          :x="PADDING.left - 5"
          :y="scaleY(tick, minMoment, maxMoment)"
          class="axis-label"
          text-anchor="end"
          dominant-baseline="middle"
        >{{ formatValue(tick, 'moment') }}</text>
        
        <!-- X-axis labels -->
        <text
          :x="PADDING.left"
          :y="HEIGHT - 5"
          class="axis-label"
        >0</text>
        <text
          :x="PADDING.left + CHART_WIDTH / 2"
          :y="HEIGHT - 5"
          class="axis-label"
          text-anchor="middle"
        >{{ (beamLength / 2).toFixed(1) }}m</text>
        <text
          :x="PADDING.left + CHART_WIDTH"
          :y="HEIGHT - 5"
          class="axis-label"
          text-anchor="end"
        >{{ beamLength.toFixed(1) }}m</text>
        
        <!-- Max indicator -->
        <g v-if="maxMoment !== 0">
          <circle
            :cx="scaleX(momentDiagram.find(p => p.value === maxMoment)?.x ?? 0)"
            :cy="scaleY(maxMoment, minMoment, maxMoment)"
            r="4"
            class="indicator max-indicator"
          />
          <text
            :x="scaleX(momentDiagram.find(p => p.value === maxMoment)?.x ?? 0) + 5"
            :y="scaleY(maxMoment, minMoment, maxMoment) - 8"
            class="indicator-label"
          >M_max = {{ formatValue(maxMoment, 'moment') }}</text>
        </g>
      </svg>
    </div>

    <!-- Deflection Curve (optional) -->
    <div v-if="deflectionCurve && deflectionCurve.length > 0" class="diagram-section">
      <h4 class="diagram-title">
        <span class="material-icons">trending_down</span>
        {{ t('Deflection Curve') }}
      </h4>
      <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" class="diagram-svg deflection-diagram">
        <!-- Grid lines -->
        <line
          :x1="PADDING.left"
          :y1="PADDING.top + CHART_HEIGHT / 2"
          :x2="PADDING.left + CHART_WIDTH"
          :y2="PADDING.top + CHART_HEIGHT / 2"
          class="axis-line"
        />
        
        <!-- Curve line -->
        <path
          v-if="deflectionPath"
          :d="deflectionPath"
          class="curve-line deflection-line"
        />
        
        <!-- Max deflection indicator -->
        <g v-if="maxDeflection">
          <text
            :x="PADDING.left + CHART_WIDTH / 2"
            :y="PADDING.top + 10"
            class="indicator-label"
            text-anchor="middle"
          >δ_max = {{ formatValue(maxDeflection, 'deflection') }}</text>
        </g>
        
        <!-- X-axis labels -->
        <text
          :x="PADDING.left"
          :y="HEIGHT - 5"
          class="axis-label"
        >0</text>
        <text
          :x="PADDING.left + CHART_WIDTH"
          :y="HEIGHT - 5"
          class="axis-label"
          text-anchor="end"
        >{{ beamLength.toFixed(1) }}m</text>
      </svg>
    </div>

    <!-- Reactions Summary -->
    <div class="reactions-summary">
      <h4 class="summary-title">
        <span class="material-icons">arrow_upward</span>
        {{ t('Support Reactions') }}
      </h4>
      <div class="reactions-grid">
        <div v-for="reaction in reactions" :key="reaction.supportId" class="reaction-item">
          <span class="reaction-label">@ {{ reaction.position.toFixed(2) }}m</span>
          <span class="reaction-value">
            R = {{ formatValue(reaction.verticalForce, 'shear') }}
          </span>
          <span v-if="reaction.moment" class="reaction-moment">
            M = {{ formatValue(reaction.moment, 'moment') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shear-moment-diagram {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.diagram-section {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.diagram-title {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);

  .material-icons {
    font-size: 1rem;
    color: var(--accent-500);
  }
}

.diagram-svg {
  width: 100%;
  height: auto;
  max-height: 140px;
}

.axis-line {
  stroke: var(--neutral);
  stroke-width: 1;
  stroke-dasharray: 4 2;
  opacity: 0.5;
}

.area-fill {
  opacity: 0.2;
}

.shear-fill {
  fill: #3b82f6;
}

.moment-fill {
  fill: #ef4444;
}

.curve-line {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.shear-line {
  stroke: #3b82f6;
}

.moment-line {
  stroke: #ef4444;
}

.deflection-line {
  stroke: #22c55e;
  stroke-dasharray: 5 3;
}

.axis-label {
  font-size: 9px;
  font-family: 'JetBrains Mono', monospace;
  fill: var(--neutral);
}

.indicator {
  stroke-width: 2;
}

.max-indicator {
  fill: var(--accent-500);
  stroke: white;
}

.indicator-label {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  fill: var(--accent-500);
}

.reactions-summary {
  background: rgb(var(--accent-500-rgb) / 5%);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text);

  .material-icons {
    font-size: 1rem;
    color: var(--accent-500);
  }
}

.reactions-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.reaction-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.5rem 0.75rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 0.5rem;
  min-width: 100px;
}

.reaction-label {
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--neutral);
}

.reaction-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.reaction-moment {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent-500);
}
</style>

