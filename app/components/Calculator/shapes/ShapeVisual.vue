<script setup lang="ts">
/**
 * ShapeVisual - SVG visualization of geometric shapes
 * Renders dynamic shapes based on input values with dimension labels
 * Supports per-input unit display
 */

interface UnitOption {
  id: string
  name: string
  symbol: string
  toBase: number
}

interface ShapeLabel {
  x: number
  y: number
  text: string
  rotate?: number
  class?: string
}

interface ShapeExtra {
  type: string
  attrs: Record<string, unknown>
}

interface ShapeRenderData {
  type: string
  attrs: Record<string, unknown>
  labels: ShapeLabel[]
  extras?: ShapeExtra[]
}

const props = withDefaults(defineProps<{
  shapeId: string
  values: Record<string, number>
  inputUnits?: Record<string, string>
  lengthUnits?: UnitOption[]
  area: number
  areaUnit?: string
}>(), {
  areaUnit: 'units²',
})

/* Get the unit symbol for a specific input */
function getUnitSymbol(inputId: string): string {
  if (!props.inputUnits || !props.lengthUnits) return ''
  const unitId = props.inputUnits[inputId]
  if (!unitId) return ''
  const unit = props.lengthUnits.find(u => u.id === unitId)
  return unit?.symbol ?? ''
}

/* Viewbox size for consistent scaling */
const SIZE = 200
const PADDING = 30
const INNER = SIZE - PADDING * 2

/* Helper to format dimension values */
function fmt(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(1)
}

/* Helper to safely get a value with fallback */
function get(key: string, fallback = 1): number {
  return props.values[key] ?? fallback
}

/* Compute shape paths and label positions based on shape type and values */
const shapeData = computed<ShapeRenderData>(() => {
  const cx = SIZE / 2
  const cy = SIZE / 2

  switch (props.shapeId) {
    case 'rectangle': {
      const length = get('length', 10)
      const width = get('width', 6)
      const ratio = length / width
      let w = INNER
      let h = INNER / ratio
      if (h > INNER) { h = INNER; w = h * ratio }
      const x = cx - w / 2
      const y = cy - h / 2
      return {
        type: 'rect',
        attrs: { x, y, width: w, height: h },
        labels: [
          { x: cx, y: y + h + 16, text: `l = ${fmt(length)} ${getUnitSymbol('length')}` },
          { x: x - 8, y: cy, text: `w = ${fmt(width)} ${getUnitSymbol('width')}`, rotate: -90 },
        ],
      }
    }

    case 'square': {
      const side = get('side', 8)
      const s = INNER * 0.8
      const x = cx - s / 2
      const y = cy - s / 2
      return {
        type: 'rect',
        attrs: { x, y, width: s, height: s },
        labels: [
          { x: cx, y: y + s + 16, text: `s = ${fmt(side)} ${getUnitSymbol('side')}` },
        ],
      }
    }

    case 'triangle': {
      const base = get('base', 10)
      const height = get('height', 8)
      const ratio = base / height
      let bw = INNER
      let h = INNER / ratio
      if (h > INNER * 0.9) { h = INNER * 0.9; bw = h * ratio }
      const x1 = cx - bw / 2
      const y1 = cy + h / 2
      const x2 = cx + bw / 2
      const y2 = y1
      const x3 = cx
      const y3 = cy - h / 2
      return {
        type: 'polygon',
        attrs: { points: `${x1},${y1} ${x2},${y2} ${x3},${y3}` },
        labels: [
          { x: cx, y: y1 + 16, text: `b = ${fmt(base)} ${getUnitSymbol('base')}` },
          { x: x3 + 20, y: cy, text: `h = ${fmt(height)} ${getUnitSymbol('height')}` },
        ],
        extras: [
          { type: 'line', attrs: { x1: x3, y1: y3, x2: x3, y2: y1, class: 'dimension-line' } },
        ],
      }
    }

    case 'triangle-heron': {
      const a = get('a', 5)
      const b = get('b', 6)
      const c = get('c', 7)
      const angleC = Math.acos((a * a + b * b - c * c) / (2 * a * b))
      const scale = INNER / Math.max(a, b, c) * 0.7
      const x1 = cx - (a * scale) / 2
      const y1 = cy + 30
      const x2 = x1 + a * scale
      const y2 = y1
      const x3 = x1 + b * scale * Math.cos(angleC)
      const y3 = y1 - b * scale * Math.sin(angleC)
      return {
        type: 'polygon',
        attrs: { points: `${x1},${y1} ${x2},${y2} ${x3},${y3}` },
        labels: [
          { x: (x1 + x2) / 2, y: y1 + 16, text: `a = ${fmt(a)} ${getUnitSymbol('a')}` },
          { x: (x2 + x3) / 2 + 10, y: (y2 + y3) / 2, text: `c = ${fmt(c)} ${getUnitSymbol('c')}` },
          { x: (x1 + x3) / 2 - 10, y: (y1 + y3) / 2, text: `b = ${fmt(b)} ${getUnitSymbol('b')}` },
        ],
      }
    }

    case 'circle': {
      const radius = get('radius', 5)
      const r = INNER / 2 * 0.85
      return {
        type: 'circle',
        attrs: { cx, cy, r },
        labels: [
          { x: cx + r / 2 + 10, y: cy - 5, text: `r = ${fmt(radius)} ${getUnitSymbol('radius')}` },
        ],
        extras: [
          { type: 'line', attrs: { x1: cx, y1: cy, x2: cx + r, y2: cy, class: 'dimension-line' } },
          { type: 'circle', attrs: { cx, cy, r: 3, class: 'center-dot' } },
        ],
      }
    }

    case 'ellipse': {
      const aVal = get('a', 8)
      const bVal = get('b', 5)
      const ratio = aVal / bVal
      let rx = INNER / 2 * 0.9
      let ry = rx / ratio
      if (ry > INNER / 2 * 0.8) { ry = INNER / 2 * 0.8; rx = ry * ratio }
      return {
        type: 'ellipse',
        attrs: { cx, cy, rx, ry },
        labels: [
          { x: cx + rx / 2, y: cy - 8, text: `a = ${fmt(aVal)} ${getUnitSymbol('a')}` },
          { x: cx + 8, y: cy - ry / 2, text: `b = ${fmt(bVal)} ${getUnitSymbol('b')}` },
        ],
        extras: [
          { type: 'line', attrs: { x1: cx, y1: cy, x2: cx + rx, y2: cy, class: 'dimension-line' } },
          { type: 'line', attrs: { x1: cx, y1: cy, x2: cx, y2: cy - ry, class: 'dimension-line' } },
        ],
      }
    }

    case 'parallelogram': {
      const base = get('base', 10)
      const height = get('height', 6)
      const ratio = base / height
      let bw = INNER
      let h = INNER / ratio * 0.7
      if (h > INNER * 0.7) { h = INNER * 0.7; bw = h * ratio }
      const skew = h * 0.4
      const x1 = cx - bw / 2 + skew
      const y1 = cy - h / 2
      const x2 = x1 + bw
      const y2 = y1
      const x3 = x2 - skew * 2
      const y3 = cy + h / 2
      const x4 = x3 - bw
      const y4 = y3
      return {
        type: 'polygon',
        attrs: { points: `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}` },
        labels: [
          { x: (x3 + x4) / 2, y: y3 + 16, text: `b = ${fmt(base)} ${getUnitSymbol('base')}` },
          { x: x4 - 16, y: cy, text: `h = ${fmt(height)} ${getUnitSymbol('height')}`, rotate: -90 },
        ],
        extras: [
          { type: 'line', attrs: { x1: x4, y1: y1, x2: x4, y2: y4, class: 'dimension-line dashed' } },
        ],
      }
    }

    case 'trapezoid': {
      const aVal = get('a', 12)
      const bVal = get('b', 8)
      const height = get('height', 5)
      const topRatio = bVal / aVal
      let bottom = INNER * 0.9
      let top = bottom * topRatio
      let h = height / aVal * bottom * 0.8
      if (h > INNER * 0.7) h = INNER * 0.7
      const offset = (bottom - top) / 2
      return {
        type: 'polygon',
        attrs: { points: `${cx - bottom / 2},${cy + h / 2} ${cx + bottom / 2},${cy + h / 2} ${cx + top / 2},${cy - h / 2} ${cx - top / 2},${cy - h / 2}` },
        labels: [
          { x: cx, y: cy + h / 2 + 16, text: `a = ${fmt(aVal)}` },
          { x: cx, y: cy - h / 2 - 10, text: `b = ${fmt(bVal)}` },
          { x: cx - bottom / 2 - 16, y: cy, text: `h = ${fmt(height)}`, rotate: -90 },
        ],
        extras: [
          { type: 'line', attrs: { x1: cx - bottom / 2 + offset, y1: cy - h / 2, x2: cx - bottom / 2 + offset, y2: cy + h / 2, class: 'dimension-line dashed' } },
        ],
      }
    }

    case 'rhombus': {
      const d1 = get('d1', 10)
      const d2 = get('d2', 8)
      const ratio = d1 / d2
      let d1v = INNER * 0.85
      let d2v = d1v / ratio
      if (d2v > INNER * 0.85) { d2v = INNER * 0.85; d1v = d2v * ratio }
      return {
        type: 'polygon',
        attrs: { points: `${cx},${cy - d2v / 2} ${cx + d1v / 2},${cy} ${cx},${cy + d2v / 2} ${cx - d1v / 2},${cy}` },
        labels: [
          { x: cx + d1v / 4 + 16, y: cy, text: `d₁ = ${fmt(d1)}` },
          { x: cx, y: cy - d2v / 4 - 12, text: `d₂ = ${fmt(d2)}` },
        ],
        extras: [
          { type: 'line', attrs: { x1: cx - d1v / 2, y1: cy, x2: cx + d1v / 2, y2: cy, class: 'dimension-line' } },
          { type: 'line', attrs: { x1: cx, y1: cy - d2v / 2, x2: cx, y2: cy + d2v / 2, class: 'dimension-line' } },
        ],
      }
    }

    case 'pentagon':
    case 'hexagon':
    case 'regular-polygon': {
      const nVal = get('n', 8)
      const side = get('side', 5)
      const n = props.shapeId === 'pentagon' ? 5 : props.shapeId === 'hexagon' ? 6 : Math.floor(nVal)
      const r = INNER / 2 * 0.85
      const angleOffset = -Math.PI / 2
      const points = Array.from({ length: n }, (_, i) => {
        const angle = angleOffset + (2 * Math.PI * i) / n
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
      }).join(' ')
      const angle1 = angleOffset
      const angle2 = angleOffset + (2 * Math.PI) / n
      const mx = cx + r * (Math.cos(angle1) + Math.cos(angle2)) / 2
      const my = cy + r * (Math.sin(angle1) + Math.sin(angle2)) / 2
      const labels: ShapeLabel[] = [
        { x: mx + 15, y: my - 10, text: `s = ${fmt(side)}` },
      ]
      if (props.shapeId === 'regular-polygon') {
        labels.push({ x: cx, y: cy + 5, text: `n = ${n}`, class: 'center-label' })
      }
      return {
        type: 'polygon',
        attrs: { points },
        labels,
      }
    }

    case 'sector': {
      const radius = get('radius', 8)
      const angle = get('angle', 90)
      const r = INNER / 2 * 0.9
      const angleRad = (angle * Math.PI) / 180
      const startAngle = -Math.PI / 2
      const endAngle = startAngle + angleRad
      const x1 = cx + r * Math.cos(startAngle)
      const y1 = cy + r * Math.sin(startAngle)
      const x2 = cx + r * Math.cos(endAngle)
      const y2 = cy + r * Math.sin(endAngle)
      const largeArc = angle > 180 ? 1 : 0
      const path = `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`
      return {
        type: 'path',
        attrs: { d: path },
        labels: [
          { x: cx + r / 2 + 10, y: cy - r / 3, text: `r = ${fmt(radius)}` },
          { x: cx + 35, y: cy + 15, text: `θ = ${fmt(angle)}°` },
        ],
        extras: [
          { type: 'path', attrs: { d: `M ${cx},${cy - 20} A 20,20 0 ${angle > 180 ? 1 : 0},1 ${cx + 20 * Math.cos(endAngle)},${cy + 20 * Math.sin(endAngle)}`, class: 'angle-arc' } },
        ],
      }
    }

    case 'ring': {
      const outer = get('outer', 8)
      const inner = get('inner', 4)
      const ratio = inner / outer
      const R = INNER / 2 * 0.9
      const r = R * ratio
      return {
        type: 'ring',
        attrs: { cx, cy, R, r },
        labels: [
          { x: cx + R / 2 + 15, y: cy - 5, text: `R = ${fmt(outer)}` },
          { x: cx + r / 2 + 5, y: cy + 15, text: `r = ${fmt(inner)}` },
        ],
        extras: [
          { type: 'line', attrs: { x1: cx, y1: cy, x2: cx + R, y2: cy, class: 'dimension-line' } },
          { type: 'line', attrs: { x1: cx, y1: cy, x2: cx + r, y2: cy + 2, class: 'dimension-line' } },
        ],
      }
    }

    default:
      return { type: 'unknown', attrs: {}, labels: [] }
  }
})
</script>

<template>
  <svg
    class="shape-visual"
    :viewBox="`0 0 ${SIZE} ${SIZE}`"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="shape-fill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb) / 25%)" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb) / 40%)" />
      </linearGradient>
      <filter id="shape-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Background grid (subtle) -->
    <g class="grid" opacity="0.15">
      <line v-for="i in 9" :key="`h${i}`" :x1="0" :y1="i * 20" :x2="SIZE" :y2="i * 20" />
      <line v-for="i in 9" :key="`v${i}`" :x1="i * 20" :y1="0" :x2="i * 20" :y2="SIZE" />
    </g>

    <!-- Extra elements (dimension lines, etc.) -->
    <template v-if="shapeData.extras">
      <component
        v-for="(extra, i) in shapeData.extras"
        :key="`extra-${i}`"
        :is="extra.type"
        v-bind="extra.attrs"
      />
    </template>

    <!-- Main shape -->
    <template v-if="shapeData.type === 'ring'">
      <!-- Ring needs special handling with two circles -->
      <circle
        :cx="Number(shapeData.attrs.cx)"
        :cy="Number(shapeData.attrs.cy)"
        :r="Number(shapeData.attrs.R)"
        class="shape-main outer-ring"
      />
      <circle
        :cx="Number(shapeData.attrs.cx)"
        :cy="Number(shapeData.attrs.cy)"
        :r="Number(shapeData.attrs.r)"
        class="shape-inner"
      />
    </template>
    <component
      v-else
      :is="shapeData.type"
      v-bind="shapeData.attrs"
      class="shape-main"
    />

    <!-- Dimension labels -->
    <text
      v-for="(label, i) in shapeData.labels"
      :key="`label-${i}`"
      :x="label.x"
      :y="label.y"
      :transform="label.rotate ? `rotate(${label.rotate}, ${label.x}, ${label.y})` : undefined"
      :class="['dimension-label', label.class]"
    >
      {{ label.text }}
    </text>

    <!-- Area display in center -->
    <g class="area-display" :transform="`translate(${SIZE / 2}, ${SIZE - 12})`">
      <text class="area-value">
        {{ area.toLocaleString('en-US', { maximumFractionDigits: 2 }) }} {{ areaUnit }}
      </text>
    </g>
  </svg>
</template>

<style scoped lang="scss">
.shape-visual {
  width: 100%;
  height: auto;
  max-height: 280px;
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 5%) 0%, transparent 100%);
  border-radius: 1rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
}

.grid line {
  stroke: var(--accent-500);
  stroke-width: 0.5;
}

.shape-main {
  fill: url(#shape-fill);
  stroke: var(--accent-500);
  stroke-width: 2;
  filter: url(#shape-glow);
  transition: all 0.3s ease;
}

.outer-ring {
  fill: url(#shape-fill);
}

.shape-inner {
  fill: var(--main-bg);
  stroke: var(--accent-500);
  stroke-width: 2;
}

.dimension-line {
  stroke: var(--accent-500);
  stroke-width: 1.5;
  stroke-dasharray: none;
  opacity: 0.7;

  &.dashed {
    stroke-dasharray: 4 3;
  }
}

.angle-arc {
  fill: none;
  stroke: var(--accent-500);
  stroke-width: 1.5;
  opacity: 0.7;
}

.center-dot {
  fill: var(--accent-500);
}

.dimension-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  fill: var(--text);
  text-anchor: middle;
  dominant-baseline: middle;

  &.center-label {
    font-size: 14px;
    fill: var(--accent-500);
  }
}

.area-display {
  .area-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    fill: var(--accent-500);
    text-anchor: middle;
  }
}
</style>

