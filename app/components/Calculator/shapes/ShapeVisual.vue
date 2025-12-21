<script setup lang="ts">
/**
 * ShapeVisual - Unified SVG visualization component
 * Supports three modes:
 * - 'area': 2D geometric shapes (rectangle, circle, triangle, etc.)
 * - 'volume': 3D isometric shapes (cube, sphere, cylinder, etc.)
 * - 'profile': Metal profile cross-sections (round bar, tube, I-beam, etc.)
 */
import {
  useShapeVisual,
  type ShapeMode,
  type ShapeRenderData,
  type Shape3DRenderData,
  type ShapeLabel,
  SIZE_2D,
  INNER_2D,
} from '@/composables/useShapeVisual'

interface UnitOption {
  id: string
  name: string
  symbol: string
  toBase: number
}

const props = withDefaults(defineProps<{
  mode: ShapeMode
  shapeId: string
  values: Record<string, number>
  inputUnits?: Record<string, string>
  lengthUnits?: UnitOption[]
  /* Result display */
  result: number
  resultUnit?: string
  resultLabel?: string
  /* Profile mode only */
  material?: string
}>(), {
  resultUnit: '',
  resultLabel: '',
  material: '',
})

/* Use shared composable */
const {
  getUnitSymbol,
  fmt,
  get,
  formatResult,
  isoProject,
  facePath,
  ellipsePoints,
} = useShapeVisual(
  toRef(props, 'inputUnits'),
  toRef(props, 'lengthUnits'),
  toRef(props, 'values')
)

/* ============================================================
   2D AREA SHAPES
   ============================================================ */
const shape2DData = computed<ShapeRenderData>(() => {
  if (props.mode !== 'area') return { type: 'unknown', attrs: {}, labels: [] }

  const cx = SIZE_2D / 2
  const cy = SIZE_2D / 2

  switch (props.shapeId) {
    case 'rectangle': {
      const length = get('length', 10)
      const width = get('width', 6)
      const ratio = length / width
      let w = INNER_2D
      let h = INNER_2D / ratio
      if (h > INNER_2D) { h = INNER_2D; w = h * ratio }
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
      const s = INNER_2D * 0.8
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
      let bw = INNER_2D
      let h = INNER_2D / ratio
      if (h > INNER_2D * 0.9) { h = INNER_2D * 0.9; bw = h * ratio }
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
      const scale = INNER_2D / Math.max(a, b, c) * 0.7
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
      const r = INNER_2D / 2 * 0.85
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
      let rx = INNER_2D / 2 * 0.9
      let ry = rx / ratio
      if (ry > INNER_2D / 2 * 0.8) { ry = INNER_2D / 2 * 0.8; rx = ry * ratio }
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
      let bw = INNER_2D
      let h = INNER_2D / ratio * 0.7
      if (h > INNER_2D * 0.7) { h = INNER_2D * 0.7; bw = h * ratio }
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
      const bottom = INNER_2D * 0.9
      const top = bottom * topRatio
      let h = height / aVal * bottom * 0.8
      if (h > INNER_2D * 0.7) h = INNER_2D * 0.7
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
      let d1v = INNER_2D * 0.85
      let d2v = d1v / ratio
      if (d2v > INNER_2D * 0.85) { d2v = INNER_2D * 0.85; d1v = d2v * ratio }
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
      const r = INNER_2D / 2 * 0.85
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
      return { type: 'polygon', attrs: { points }, labels }
    }

    case 'sector': {
      const radius = get('radius', 8)
      const angle = get('angle', 90)
      const r = INNER_2D / 2 * 0.9
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
      const R = INNER_2D / 2 * 0.9
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

/* ============================================================
   3D VOLUME SHAPES
   ============================================================ */
const shape3DData = computed<Shape3DRenderData>(() => {
  if (props.mode !== 'volume') return { paths: [], labels: [] }

  const baseScale = 8
  const cx = SIZE_2D / 2
  const cy = SIZE_2D / 2

  switch (props.shapeId) {
    case 'cube': {
      const s = get('side', 5)
      const size = s * baseScale * 0.8
      const half = size / 2

      const p = {
        ftl: isoProject(-half, size, -half),
        ftr: isoProject(half, size, -half),
        fbr: isoProject(half, 0, -half),
        fbl: isoProject(-half, 0, -half),
        btl: isoProject(-half, size, half),
        btr: isoProject(half, size, half),
        bbr: isoProject(half, 0, half),
        bbl: isoProject(-half, 0, half),
      }

      const outline = `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.bbl.x},${p.bbl.y} L${p.bbr.x},${p.bbr.y} L${p.fbr.x},${p.fbr.y} L${p.ftr.x},${p.ftr.y} Z`
      const center = p.fbl
      const innerEdges = `M${p.ftl.x},${p.ftl.y} L${center.x},${center.y} L${p.bbl.x},${p.bbl.y} M${center.x},${center.y} L${p.fbr.x},${p.fbr.y}`
      const spaceDiagonal = `M${p.bbl.x},${p.bbl.y} L${p.ftr.x},${p.ftr.y}`
      const faceDiagonal = `M${p.ftr.x},${p.ftr.y} L${p.bbr.x},${p.bbr.y}`

      return {
        paths: [
          { d: `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.btr.x},${p.btr.y} L${p.ftr.x},${p.ftr.y} Z`, fill: 'var(--cube-top)', noStroke: true },
          { d: `M${p.ftl.x},${p.ftl.y} L${p.fbl.x},${p.fbl.y} L${p.bbl.x},${p.bbl.y} L${p.btl.x},${p.btl.y} Z`, fill: 'var(--cube-left)', noStroke: true },
          { d: `M${p.ftr.x},${p.ftr.y} L${p.fbr.x},${p.fbr.y} L${p.bbr.x},${p.bbr.y} L${p.btr.x},${p.btr.y} Z`, fill: 'var(--cube-right)', noStroke: true },
          { d: innerEdges, fill: 'none', stroke: true },
          { d: spaceDiagonal, fill: 'none', stroke: true, strokeColor: '#0066cc', strokeWidth: 2.5 },
          { d: faceDiagonal, fill: 'none', stroke: true, strokeColor: '#cc5500', strokeWidth: 2.5 },
          { d: `M${p.btl.x},${p.btl.y} L${p.bbr.x},${p.bbr.y}`, fill: 'none', stroke: true, strokeColor: 'rgb(var(--text-rgb) / 35%)', strokeWidth: 1.5, strokeDasharray: '6 4' },
          { d: `M${p.btl.x},${p.btl.y} L${p.fbl.x},${p.fbl.y}`, fill: 'none', stroke: true, strokeColor: 'rgb(var(--text-rgb) / 35%)', strokeWidth: 1.5, strokeDasharray: '6 4' },
        ],
        outline,
        labels: [
          { x: cx, y: p.fbr.y + 20, text: `a = ${fmt(s)} ${getUnitSymbol('side')}` },
          { x: (p.bbl.x + p.ftr.x) / 2 - 15, y: (p.bbl.y + p.ftr.y) / 2 - 8, text: 'd', class: 'diagonal-label space' },
          { x: (p.ftr.x + p.bbr.x) / 2 + 12, y: (p.ftr.y + p.bbr.y) / 2, text: 'f', class: 'diagonal-label face' },
        ],
      }
    }

    case 'box': {
      const l = get('length', 8)
      const w = get('width', 5)
      const h = get('height', 4)
      const maxDim = Math.max(l, w, h)
      const scale = (baseScale * 4) / maxDim

      const lh = (l * scale) / 2
      const wh = (w * scale) / 2
      const hh = h * scale

      const p = {
        ftl: isoProject(-lh, hh, -wh),
        ftr: isoProject(lh, hh, -wh),
        fbr: isoProject(lh, 0, -wh),
        fbl: isoProject(-lh, 0, -wh),
        btl: isoProject(-lh, hh, wh),
        btr: isoProject(lh, hh, wh),
        bbr: isoProject(lh, 0, wh),
        bbl: isoProject(-lh, 0, wh),
      }

      const outline = `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.bbl.x},${p.bbl.y} L${p.bbr.x},${p.bbr.y} L${p.fbr.x},${p.fbr.y} L${p.ftr.x},${p.ftr.y} Z`
      const center = p.fbl
      const innerEdges = `M${p.ftl.x},${p.ftl.y} L${center.x},${center.y} L${p.bbl.x},${p.bbl.y} M${center.x},${center.y} L${p.fbr.x},${p.fbr.y}`

      return {
        paths: [
          { d: `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.btr.x},${p.btr.y} L${p.ftr.x},${p.ftr.y} Z`, fill: 'var(--cube-top)', noStroke: true },
          { d: `M${p.ftl.x},${p.ftl.y} L${p.fbl.x},${p.fbl.y} L${p.bbl.x},${p.bbl.y} L${p.btl.x},${p.btl.y} Z`, fill: 'var(--cube-left)', noStroke: true },
          { d: `M${p.ftr.x},${p.ftr.y} L${p.fbr.x},${p.fbr.y} L${p.bbr.x},${p.bbr.y} L${p.btr.x},${p.btr.y} Z`, fill: 'var(--cube-right)', noStroke: true },
          { d: innerEdges, fill: 'none', stroke: true },
        ],
        outline,
        labels: [
          { x: p.btr.x + 15, y: (p.btr.y + p.bbr.y) / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
          { x: (p.ftr.x + p.btr.x) / 2, y: p.ftl.y - 10, text: `l = ${fmt(l)} ${getUnitSymbol('length')}` },
          { x: p.btl.x - 30, y: (p.btl.y + p.bbl.y) / 2, text: `w = ${fmt(w)} ${getUnitSymbol('width')}` },
        ],
      }
    }

    case 'sphere': {
      const r = get('radius', 5)
      const radius = r * baseScale * 0.9

      return {
        paths: [
          { d: `M${cx - radius},${cy} A${radius},${radius} 0 1,1 ${cx + radius},${cy} A${radius},${radius} 0 1,1 ${cx - radius},${cy}`, fill: 'url(#sphereGradient)' },
          { d: ellipsePoints(0, radius, radius * 0.3, 48), fill: 'none', stroke: true },
          { d: `M${cx},${cy - radius} Q${cx + radius * 0.5},${cy} ${cx},${cy + radius} Q${cx - radius * 0.5},${cy} ${cx},${cy - radius}`, fill: 'none', stroke: true },
        ],
        labels: [
          { x: cx + radius + 15, y: cy, text: `r = ${fmt(r)} ${getUnitSymbol('radius')}` },
        ],
      }
    }

    case 'hemisphere': {
      const r = get('radius', 5)
      const radius = r * baseScale * 0.9
      const ellipseRy = radius * 0.35

      return {
        paths: [
          { d: `M${cx - radius},${cy} A${radius},${radius} 0 0,1 ${cx + radius},${cy}`, fill: 'url(#hemisphereGradient)' },
          { d: `M${cx - radius},${cy} Q${cx},${cy + ellipseRy} ${cx + radius},${cy} Q${cx},${cy - ellipseRy} ${cx - radius},${cy}`, fill: 'var(--face-medium)' },
        ],
        labels: [
          { x: cx, y: cy + ellipseRy + 20, text: `r = ${fmt(r)} ${getUnitSymbol('radius')}` },
        ],
      }
    }

    case 'cylinder': {
      const r = get('radius', 4)
      const h = get('height', 8)
      const maxDim = Math.max(r * 2, h)
      const scale = (baseScale * 5) / maxDim

      const radius = r * scale
      const height = h * scale
      const ellipseRy = radius * 0.35

      const bodyPath = `M${cx - radius},${cy} L${cx - radius},${cy - height} Q${cx},${cy - height - ellipseRy} ${cx + radius},${cy - height} L${cx + radius},${cy} Q${cx},${cy + ellipseRy} ${cx - radius},${cy}`
      const topEllipse = `M${cx - radius},${cy - height} Q${cx},${cy - height + ellipseRy} ${cx + radius},${cy - height} Q${cx},${cy - height - ellipseRy} ${cx - radius},${cy - height}`

      return {
        paths: [
          { d: bodyPath, fill: 'url(#cylinderGradient)' },
          { d: topEllipse, fill: 'var(--face-light)' },
        ],
        labels: [
          { x: cx, y: cy + ellipseRy + 20, text: `r = ${fmt(r)} ${getUnitSymbol('radius')}` },
          { x: cx + radius + 15, y: cy - height / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }

    case 'cone': {
      const r = get('radius', 4)
      const h = get('height', 9)
      const maxDim = Math.max(r * 2, h)
      const scale = (baseScale * 5) / maxDim

      const radius = r * scale
      const height = h * scale
      const ellipseRy = radius * 0.35

      const conePath = `M${cx},${cy - height} L${cx - radius},${cy} Q${cx},${cy + ellipseRy} ${cx + radius},${cy} Z`
      const basePath = `M${cx - radius},${cy} Q${cx},${cy + ellipseRy} ${cx + radius},${cy} Q${cx},${cy - ellipseRy} ${cx - radius},${cy}`

      return {
        paths: [
          { d: conePath, fill: 'url(#coneGradient)' },
          { d: basePath, fill: 'var(--face-medium)' },
        ],
        labels: [
          { x: cx, y: cy + ellipseRy + 20, text: `r = ${fmt(r)} ${getUnitSymbol('radius')}` },
          { x: cx + radius / 2 + 20, y: cy - height / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }

    case 'frustum': {
      const r1 = get('r1', 2)
      const r2 = get('r2', 5)
      const h = get('height', 6)
      const maxDim = Math.max(r2 * 2, h)
      const scale = (baseScale * 5) / maxDim

      const topR = r1 * scale
      const botR = r2 * scale
      const height = h * scale
      const topRy = topR * 0.35
      const botRy = botR * 0.35

      const bodyPath = `M${cx - topR},${cy - height} L${cx - botR},${cy} Q${cx},${cy + botRy} ${cx + botR},${cy} L${cx + topR},${cy - height} Q${cx},${cy - height - topRy} ${cx - topR},${cy - height}`
      const topEllipse = `M${cx - topR},${cy - height} Q${cx},${cy - height + topRy} ${cx + topR},${cy - height} Q${cx},${cy - height - topRy} ${cx - topR},${cy - height}`

      return {
        paths: [
          { d: bodyPath, fill: 'url(#cylinderGradient)' },
          { d: topEllipse, fill: 'var(--face-light)' },
        ],
        labels: [
          { x: cx, y: cy - height - topRy - 10, text: `r₁ = ${fmt(r1)} ${getUnitSymbol('r1')}` },
          { x: cx, y: cy + botRy + 20, text: `r₂ = ${fmt(r2)} ${getUnitSymbol('r2')}` },
          { x: cx + botR + 15, y: cy - height / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }

    case 'pyramid-square': {
      const a = get('base', 6)
      const h = get('height', 8)
      const maxDim = Math.max(a, h)
      const scale = (baseScale * 5) / maxDim

      const half = (a * scale) / 2
      const height = h * scale

      const apex: [number, number, number] = [0, height, 0]
      const fl: [number, number, number] = [-half, 0, -half]
      const fr: [number, number, number] = [half, 0, -half]
      const br: [number, number, number] = [half, 0, half]
      const bl: [number, number, number] = [-half, 0, half]

      const pApex = isoProject(...apex)
      const pFL = isoProject(...fl)
      const pFR = isoProject(...fr)
      const pBR = isoProject(...br)
      const pBL = isoProject(...bl)

      return {
        paths: [
          { d: `M${pApex.x},${pApex.y} L${pFL.x},${pFL.y} L${pBL.x},${pBL.y} Z`, fill: 'var(--face-dark)' },
          { d: `M${pApex.x},${pApex.y} L${pFR.x},${pFR.y} L${pBR.x},${pBR.y} Z`, fill: 'var(--face-medium)' },
          { d: `M${pApex.x},${pApex.y} L${pFL.x},${pFL.y} L${pFR.x},${pFR.y} Z`, fill: 'var(--face-light)' },
          { d: `M${pFL.x},${pFL.y} L${pFR.x},${pFR.y} L${pBR.x},${pBR.y} L${pBL.x},${pBL.y} Z`, fill: 'var(--face-base)' },
        ],
        labels: [
          { x: (pFL.x + pFR.x) / 2, y: pFL.y + 20, text: `a = ${fmt(a)} ${getUnitSymbol('base')}` },
          { x: pApex.x + 25, y: (pApex.y + pFR.y) / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }

    case 'pyramid-rect': {
      const l = get('length', 8)
      const w = get('width', 5)
      const h = get('height', 7)
      const maxDim = Math.max(l, w, h)
      const scale = (baseScale * 5) / maxDim

      const lh = (l * scale) / 2
      const wh = (w * scale) / 2
      const height = h * scale

      const apex: [number, number, number] = [0, height, 0]
      const fl: [number, number, number] = [-lh, 0, -wh]
      const fr: [number, number, number] = [lh, 0, -wh]
      const br: [number, number, number] = [lh, 0, wh]
      const bl: [number, number, number] = [-lh, 0, wh]

      const pApex = isoProject(...apex)
      const pFL = isoProject(...fl)
      const pFR = isoProject(...fr)
      const pBR = isoProject(...br)
      const pBL = isoProject(...bl)

      return {
        paths: [
          { d: `M${pApex.x},${pApex.y} L${pFL.x},${pFL.y} L${pBL.x},${pBL.y} Z`, fill: 'var(--face-dark)' },
          { d: `M${pApex.x},${pApex.y} L${pFR.x},${pFR.y} L${pBR.x},${pBR.y} Z`, fill: 'var(--face-medium)' },
          { d: `M${pApex.x},${pApex.y} L${pFL.x},${pFL.y} L${pFR.x},${pFR.y} Z`, fill: 'var(--face-light)' },
          { d: `M${pFL.x},${pFL.y} L${pFR.x},${pFR.y} L${pBR.x},${pBR.y} L${pBL.x},${pBL.y} Z`, fill: 'var(--face-base)' },
        ],
        labels: [
          { x: (pFL.x + pFR.x) / 2, y: pFL.y + 20, text: `l = ${fmt(l)} ${getUnitSymbol('length')}` },
          { x: pBL.x - 30, y: (pFL.y + pBL.y) / 2, text: `w = ${fmt(w)} ${getUnitSymbol('width')}` },
          { x: pApex.x + 25, y: (pApex.y + pFR.y) / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }

    case 'prism-triangular': {
      const b = get('base', 6)
      const th = get('triHeight', 5)
      const l = get('length', 10)
      const maxDim = Math.max(b, th, l)
      const scale = (baseScale * 4) / maxDim

      const bh = (b * scale) / 2
      const height = th * scale
      const lh = (l * scale) / 2

      const ftl: [number, number, number] = [0, height, -lh]
      const fbl: [number, number, number] = [-bh, 0, -lh]
      const fbr: [number, number, number] = [bh, 0, -lh]
      const btl: [number, number, number] = [0, height, lh]
      const bbl: [number, number, number] = [-bh, 0, lh]
      const bbr: [number, number, number] = [bh, 0, lh]

      const pFTL = isoProject(...ftl)
      const pFBL = isoProject(...fbl)
      const pFBR = isoProject(...fbr)
      const pBTL = isoProject(...btl)
      const pBBL = isoProject(...bbl)
      const pBBR = isoProject(...bbr)

      return {
        paths: [
          { d: `M${pFTL.x},${pFTL.y} L${pFBL.x},${pFBL.y} L${pBBL.x},${pBBL.y} L${pBTL.x},${pBTL.y} Z`, fill: 'var(--face-dark)' },
          { d: `M${pFBL.x},${pFBL.y} L${pFBR.x},${pFBR.y} L${pBBR.x},${pBBR.y} L${pBBL.x},${pBBL.y} Z`, fill: 'var(--face-base)' },
          { d: `M${pFTL.x},${pFTL.y} L${pFBR.x},${pFBR.y} L${pBBR.x},${pBBR.y} L${pBTL.x},${pBTL.y} Z`, fill: 'var(--face-medium)' },
          { d: `M${pFTL.x},${pFTL.y} L${pFBL.x},${pFBL.y} L${pFBR.x},${pFBR.y} Z`, fill: 'var(--face-light)' },
        ],
        labels: [
          { x: (pFBL.x + pFBR.x) / 2, y: pFBL.y + 15, text: `b = ${fmt(b)} ${getUnitSymbol('base')}` },
          { x: pFTL.x - 25, y: (pFTL.y + pFBL.y) / 2, text: `h₁ = ${fmt(th)} ${getUnitSymbol('triHeight')}` },
          { x: (pFBR.x + pBBR.x) / 2 + 20, y: (pFBR.y + pBBR.y) / 2, text: `l = ${fmt(l)} ${getUnitSymbol('length')}` },
        ],
      }
    }

    case 'ellipsoid': {
      const a = get('a', 6)
      const b = get('b', 4)
      const c = get('c', 3)
      const maxDim = Math.max(a, b, c)
      const scale = (baseScale * 5) / maxDim

      const rx = a * scale
      const ry = b * scale
      const rz = c * scale

      return {
        paths: [
          { d: `M${cx - rx},${cy} A${rx},${rz} 0 1,1 ${cx + rx},${cy} A${rx},${rz} 0 1,1 ${cx - rx},${cy}`, fill: 'url(#sphereGradient)' },
          { d: `M${cx - rx},${cy} Q${cx},${cy + ry * 0.4} ${cx + rx},${cy} Q${cx},${cy - ry * 0.4} ${cx - rx},${cy}`, fill: 'none', stroke: true },
        ],
        labels: [
          { x: cx + rx + 10, y: cy, text: `a = ${fmt(a)} ${getUnitSymbol('a')}` },
          { x: cx, y: cy + rz + 15, text: `b = ${fmt(b)} ${getUnitSymbol('b')}` },
          { x: cx - rx - 25, y: cy - 10, text: `c = ${fmt(c)} ${getUnitSymbol('c')}` },
        ],
      }
    }

    case 'torus': {
      const R = get('R', 8)
      const r = get('r', 2)
      const scale = baseScale * 0.8

      const majorR = R * scale * 0.5
      const tubeR = r * scale * 0.5

      const outerRx = majorR + tubeR
      const innerRx = majorR - tubeR
      const ry = tubeR * 0.7

      return {
        paths: [
          { d: `M${cx - outerRx},${cy} A${outerRx},${ry * 2} 0 0,1 ${cx + outerRx},${cy}`, fill: 'var(--face-dark)' },
          { d: `M${cx - innerRx},${cy} A${innerRx},${ry * 1.5} 0 0,0 ${cx + innerRx},${cy}`, fill: 'var(--main-bg)' },
          { d: `M${cx - outerRx},${cy} A${outerRx},${ry * 2} 0 0,0 ${cx + outerRx},${cy} L${cx + innerRx},${cy} A${innerRx},${ry * 1.5} 0 0,1 ${cx - innerRx},${cy} Z`, fill: 'url(#torusGradient)' },
        ],
        labels: [
          { x: cx + majorR + 15, y: cy - 10, text: `R = ${fmt(R)} ${getUnitSymbol('R')}` },
          { x: cx, y: cy - tubeR - 10, text: `r = ${fmt(r)} ${getUnitSymbol('r')}` },
        ],
      }
    }

    case 'capsule': {
      const r = get('radius', 3)
      const h = get('height', 8)
      const maxDim = Math.max(r * 2, h + r * 2)
      const scale = (baseScale * 5) / maxDim

      const radius = r * scale
      const height = h * scale

      return {
        paths: [
          { d: `M${cx - radius},${cy} L${cx - radius},${cy - height} A${radius},${radius} 0 0,1 ${cx + radius},${cy - height} L${cx + radius},${cy} A${radius},${radius} 0 0,1 ${cx - radius},${cy}`, fill: 'url(#cylinderGradient)' },
          { d: `M${cx - radius},${cy - height} A${radius},${radius} 0 0,1 ${cx + radius},${cy - height}`, fill: 'none', stroke: true },
        ],
        labels: [
          { x: cx, y: cy + radius * 0.5 + 15, text: `r = ${fmt(r)} ${getUnitSymbol('radius')}` },
          { x: cx + radius + 15, y: cy - height / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }

    case 'tetrahedron': {
      const a = get('edge', 6)
      const scale = baseScale * 0.9
      const edge = a * scale

      const h = edge * Math.sqrt(2 / 3)
      const r = edge / Math.sqrt(3)

      const top: [number, number, number] = [0, h, 0]
      const v1: [number, number, number] = [0, 0, -r]
      const v2: [number, number, number] = [-r * Math.cos(Math.PI / 6), 0, r * Math.sin(Math.PI / 6)]
      const v3: [number, number, number] = [r * Math.cos(Math.PI / 6), 0, r * Math.sin(Math.PI / 6)]

      const pTop = isoProject(...top)
      const pV1 = isoProject(...v1)
      const pV2 = isoProject(...v2)
      const pV3 = isoProject(...v3)

      return {
        paths: [
          { d: `M${pTop.x},${pTop.y} L${pV2.x},${pV2.y} L${pV1.x},${pV1.y} Z`, fill: 'var(--face-dark)' },
          { d: `M${pTop.x},${pTop.y} L${pV1.x},${pV1.y} L${pV3.x},${pV3.y} Z`, fill: 'var(--face-light)' },
          { d: `M${pTop.x},${pTop.y} L${pV3.x},${pV3.y} L${pV2.x},${pV2.y} Z`, fill: 'var(--face-medium)' },
          { d: `M${pV1.x},${pV1.y} L${pV2.x},${pV2.y} L${pV3.x},${pV3.y} Z`, fill: 'var(--face-base)' },
        ],
        labels: [
          { x: (pV1.x + pV3.x) / 2 + 15, y: (pV1.y + pV3.y) / 2 + 15, text: `a = ${fmt(a)} ${getUnitSymbol('edge')}` },
        ],
      }
    }

    case 'octahedron': {
      const a = get('edge', 5)
      const scale = baseScale * 0.7
      const edge = a * scale

      const half = edge / Math.sqrt(2)

      const top: [number, number, number] = [0, half, 0]
      const bot: [number, number, number] = [0, -half, 0]
      const front: [number, number, number] = [0, 0, -half]
      const back: [number, number, number] = [0, 0, half]
      const left: [number, number, number] = [-half, 0, 0]
      const right: [number, number, number] = [half, 0, 0]

      const pTop = isoProject(...top)
      const pBot = isoProject(...bot)
      const pFront = isoProject(...front)
      const pBack = isoProject(...back)
      const pLeft = isoProject(...left)
      const pRight = isoProject(...right)

      return {
        paths: [
          { d: `M${pTop.x},${pTop.y} L${pLeft.x},${pLeft.y} L${pFront.x},${pFront.y} Z`, fill: 'var(--face-dark)' },
          { d: `M${pTop.x},${pTop.y} L${pFront.x},${pFront.y} L${pRight.x},${pRight.y} Z`, fill: 'var(--face-light)' },
          { d: `M${pTop.x},${pTop.y} L${pRight.x},${pRight.y} L${pBack.x},${pBack.y} Z`, fill: 'var(--face-medium)' },
          { d: `M${pTop.x},${pTop.y} L${pBack.x},${pBack.y} L${pLeft.x},${pLeft.y} Z`, fill: 'var(--face-dark)' },
          { d: `M${pBot.x},${pBot.y} L${pFront.x},${pFront.y} L${pRight.x},${pRight.y} Z`, fill: 'var(--face-base)' },
          { d: `M${pBot.x},${pBot.y} L${pRight.x},${pRight.y} L${pBack.x},${pBack.y} Z`, fill: 'var(--face-medium)' },
        ],
        labels: [
          { x: pRight.x + 15, y: pRight.y, text: `a = ${fmt(a)} ${getUnitSymbol('edge')}` },
        ],
      }
    }

    case 'spherical-cap': {
      const R = get('R', 8)
      const h = get('h', 3)
      const scale = baseScale * 0.7

      const sphereR = R * scale
      const capH = h * scale
      const baseR = Math.sqrt(capH * (2 * sphereR - capH))
      const ellipseRy = baseR * 0.35

      return {
        paths: [
          { d: `M${cx - baseR},${cy} A${sphereR},${sphereR} 0 0,1 ${cx + baseR},${cy}`, fill: 'url(#hemisphereGradient)' },
          { d: `M${cx - baseR},${cy} Q${cx},${cy + ellipseRy} ${cx + baseR},${cy} Q${cx},${cy - ellipseRy} ${cx - baseR},${cy}`, fill: 'var(--face-medium)' },
        ],
        labels: [
          { x: cx + baseR + 15, y: cy - capH / 2, text: `R = ${fmt(R)} ${getUnitSymbol('R')}` },
          { x: cx - 35, y: cy - capH / 2, text: `h = ${fmt(h)} ${getUnitSymbol('h')}` },
        ],
      }
    }

    default: {
      const size = 40
      const half = size

      const v = {
        ftl: [-half, half, -half] as [number, number, number],
        ftr: [half, half, -half] as [number, number, number],
        fbr: [half, 0, -half] as [number, number, number],
        fbl: [-half, 0, -half] as [number, number, number],
        btl: [-half, half, half] as [number, number, number],
        btr: [half, half, half] as [number, number, number],
        bbr: [half, 0, half] as [number, number, number],
        bbl: [-half, 0, half] as [number, number, number],
      }

      return {
        paths: [
          { d: facePath(v.ftl, v.fbl, v.bbl, v.btl), fill: 'var(--face-dark)' },
          { d: facePath(v.ftr, v.btr, v.bbr, v.fbr), fill: 'var(--face-medium)' },
          { d: facePath(v.ftl, v.btl, v.btr, v.ftr), fill: 'var(--face-light)' },
        ],
        labels: [],
      }
    }
  }
})

/* ============================================================
   METAL PROFILE SHAPES - Dynamic scaling based on actual dimensions
   ============================================================ */
const profileData = computed(() => {
  if (props.mode !== 'profile') return { type: 'unknown', attrs: {}, labels: [] }

  const cx = SIZE_2D / 2
  const cy = SIZE_2D / 2
  const maxSize = INNER_2D * 0.85 /* Maximum shape size */

  let pathData: { type: string; attrs: Record<string, unknown> }
  let labels: ShapeLabel[] = []

  switch (props.shapeId) {
    case 'round-bar': {
      const diameter = get('diameter', 0.02)
      const r = maxSize * 0.45 /* Visual radius */
      pathData = { type: 'circle', attrs: { cx, cy, r } }
      labels = [{ x: cx, y: cy + r + 16, text: `⌀ ${fmt(diameter, true)} ${getUnitSymbol('diameter')}` }]
      break
    }

    case 'square-bar': {
      const side = get('side', 0.02)
      const s = maxSize * 0.7
      pathData = { type: 'rect', attrs: { x: cx - s / 2, y: cy - s / 2, width: s, height: s } }
      labels = [
        { x: cx, y: cy + s / 2 + 16, text: `a = ${fmt(side, true)} ${getUnitSymbol('side')}` },
      ]
      break
    }

    case 'rectangular-bar': {
      const width = get('width', 0.03)
      const height = get('height', 0.02)
      const ratio = width / height
      let w = maxSize * 0.8
      let h = w / ratio
      if (h > maxSize * 0.7) { h = maxSize * 0.7; w = h * ratio }
      pathData = { type: 'rect', attrs: { x: cx - w / 2, y: cy - h / 2, width: w, height: h } }
      labels = [
        { x: cx, y: cy + h / 2 + 16, text: `w = ${fmt(width, true)} ${getUnitSymbol('width')}` },
        { x: cx - w / 2 - 10, y: cy, text: `h = ${fmt(height, true)}`, rotate: -90 },
      ]
      break
    }

    case 'hexagonal-bar': {
      const flatToFlat = get('flatToFlat', 0.02)
      const r = maxSize * 0.4 /* Circumradius for drawing */
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
      }).join(' ')
      pathData = { type: 'polygon', attrs: { points } }
      labels = [{ x: cx, y: cy + r + 16, text: `f = ${fmt(flatToFlat, true)} ${getUnitSymbol('flatToFlat')}` }]
      break
    }

    case 'sheet': {
      const length = get('length', 1)
      const width = get('width', 0.5)
      const thickness = get('thickness', 0.002)
      /* Sheet shown as thin rectangle - emphasize the length/width ratio */
      const ratio = Math.min(Math.max(width / length, 0.3), 1)
      const w = maxSize * 0.9
      const h = Math.max(maxSize * 0.08, maxSize * 0.2 * ratio) /* Thin but visible */
      pathData = { type: 'rect', attrs: { x: cx - w / 2, y: cy - h / 2, width: w, height: h } }
      labels = [
        { x: cx, y: cy - h / 2 - 12, text: `t = ${fmt(thickness, true)} ${getUnitSymbol('thickness')}` },
        { x: cx, y: cy + h / 2 + 16, text: `${fmt(length, true)} × ${fmt(width, true)} ${getUnitSymbol('length')}` },
      ]
      break
    }

    case 'round-tube': {
      const od = get('outerDiameter', 0.05)
      const wall = get('wallThickness', 0.003)
      const wallRatio = Math.min(wall / (od / 2), 0.4) /* Wall as fraction of radius */
      const outerR = maxSize * 0.42
      const innerR = outerR * (1 - wallRatio * 2)
      pathData = {
        type: 'path',
        attrs: {
          d: `M ${cx + outerR} ${cy} A ${outerR} ${outerR} 0 1 1 ${cx - outerR} ${cy} A ${outerR} ${outerR} 0 1 1 ${cx + outerR} ${cy} M ${cx + innerR} ${cy} A ${innerR} ${innerR} 0 1 0 ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 1 0 ${cx + innerR} ${cy}`,
          'fill-rule': 'evenodd',
        },
      }
      labels = [
        { x: cx, y: cy + outerR + 16, text: `OD = ${fmt(od, true)} ${getUnitSymbol('outerDiameter')}` },
        { x: cx + outerR * 0.5, y: cy - outerR * 0.7, text: `t = ${fmt(wall, true)}` },
      ]
      break
    }

    case 'square-tube': {
      const outerSide = get('outerSide', 0.05)
      const wall = get('wallThickness', 0.003)
      const wallRatio = Math.min(wall / outerSide, 0.2)
      const outer = maxSize * 0.7
      const wallVisual = outer * wallRatio * 2
      const inner = outer - wallVisual * 2
      const ox = cx - outer / 2
      const oy = cy - outer / 2
      const ix = cx - inner / 2
      const iy = cy - inner / 2
      pathData = {
        type: 'path',
        attrs: {
          d: `M ${ox} ${oy} h ${outer} v ${outer} h ${-outer} Z M ${ix} ${iy} v ${inner} h ${inner} v ${-inner} Z`,
          'fill-rule': 'evenodd',
        },
      }
      labels = [
        { x: cx, y: cy + outer / 2 + 16, text: `a = ${fmt(outerSide, true)} ${getUnitSymbol('outerSide')}` },
        { x: cx + outer / 2 + 8, y: cy, text: `t = ${fmt(wall, true)}` },
      ]
      break
    }

    case 'rectangular-tube': {
      const outerW = get('outerWidth', 0.06)
      const outerH = get('outerHeight', 0.04)
      const wall = get('wallThickness', 0.003)
      const ratio = outerW / outerH
      let w = maxSize * 0.8
      let h = w / ratio
      if (h > maxSize * 0.6) { h = maxSize * 0.6; w = h * ratio }
      const wallRatio = Math.min(wall / Math.min(outerW, outerH), 0.15)
      const wallVisual = Math.min(w, h) * wallRatio * 2
      const innerW = w - wallVisual * 2
      const innerH = h - wallVisual * 2
      const ox = cx - w / 2
      const oy = cy - h / 2
      const ix = cx - innerW / 2
      const iy = cy - innerH / 2
      pathData = {
        type: 'path',
        attrs: {
          d: `M ${ox} ${oy} h ${w} v ${h} h ${-w} Z M ${ix} ${iy} v ${innerH} h ${innerW} v ${-innerH} Z`,
          'fill-rule': 'evenodd',
        },
      }
      labels = [
        { x: cx, y: cy + h / 2 + 16, text: `${fmt(outerW, true)} × ${fmt(outerH, true)}` },
        { x: cx + w / 2 + 8, y: cy, text: `t = ${fmt(wall, true)}` },
      ]
      break
    }

    case 'angle-bar': {
      const legA = get('legA', 0.05)
      const legB = get('legB', 0.05)
      const thick = get('thickness', 0.005)
      const ratio = legA / legB
      const thickRatio = Math.min(thick / Math.min(legA, legB), 0.25)
      let a = maxSize * 0.7
      let b = a / ratio
      if (b > maxSize * 0.7) { b = maxSize * 0.7; a = b * ratio }
      const t = Math.min(a, b) * thickRatio
      const x0 = cx - a / 2
      const y0 = cy - b / 2
      pathData = {
        type: 'path',
        attrs: { d: `M ${x0} ${y0} h ${t} v ${b - t} h ${a - t} v ${t} h ${-a} Z` },
      }
      labels = [
        { x: cx, y: cy + b / 2 + 16, text: `${fmt(legA, true)} × ${fmt(legB, true)}` },
        { x: x0 + t + 10, y: y0 + 10, text: `t = ${fmt(thick, true)}` },
      ]
      break
    }

    case 'channel': {
      const height = get('height', 0.1)
      const width = get('width', 0.05)
      const thick = get('thickness', 0.006)
      const hRatio = height / width
      const thickRatio = Math.min(thick / width, 0.2)
      let w = maxSize * 0.5
      let h = w * hRatio
      if (h > maxSize * 0.75) { h = maxSize * 0.75; w = h / hRatio }
      const t = w * thickRatio
      const x = cx - w / 2
      const y = cy - h / 2
      pathData = {
        type: 'path',
        attrs: { d: `M ${x} ${y} h ${w} v ${t} h ${-(w - t)} v ${h - t * 2} h ${w - t} v ${t} h ${-w} Z` },
      }
      labels = [
        { x: cx, y: cy + h / 2 + 16, text: `H = ${fmt(height, true)}` },
        { x: cx + w / 2 + 10, y: cy, text: `w = ${fmt(width, true)}` },
      ]
      break
    }

    case 'i-beam': {
      const height = get('height', 0.1)
      const flangeW = get('flangeWidth', 0.05)
      const webT = get('webThickness', 0.005)
      const flangeT = get('flangeThickness', 0.008)
      const hRatio = height / flangeW
      let w = maxSize * 0.65
      let h = w * hRatio
      if (h > maxSize * 0.8) { h = maxSize * 0.8; w = h / hRatio }
      const tfRatio = Math.min(flangeT / height, 0.15)
      const twRatio = Math.min(webT / flangeW, 0.2)
      const tf = h * tfRatio
      const tw = w * twRatio
      const x = cx - w / 2
      const y = cy - h / 2
      pathData = {
        type: 'path',
        attrs: { d: `M ${x} ${y} h ${w} v ${tf} h ${-(w - tw) / 2} v ${h - tf * 2} h ${(w - tw) / 2} v ${tf} h ${-w} v ${-tf} h ${(w - tw) / 2} v ${-(h - tf * 2)} h ${-(w - tw) / 2} Z` },
      }
      labels = [
        { x: cx, y: cy + h / 2 + 16, text: `H = ${fmt(height, true)}` },
        { x: cx + w / 2 + 10, y: cy - h / 2 + tf / 2, text: `b = ${fmt(flangeW, true)}` },
      ]
      break
    }

    case 't-bar': {
      const flangeW = get('flangeWidth', 0.05)
      const totalH = get('totalHeight', 0.05)
      const flangeT = get('flangeThickness', 0.005)
      const webT = get('webThickness', 0.005)
      const hRatio = totalH / flangeW
      let w = maxSize * 0.65
      let h = w * hRatio
      if (h > maxSize * 0.7) { h = maxSize * 0.7; w = h / hRatio }
      const tfRatio = Math.min(flangeT / totalH, 0.25)
      const twRatio = Math.min(webT / flangeW, 0.25)
      const tf = h * tfRatio
      const tw = w * twRatio
      const x = cx - w / 2
      const y = cy - h / 2
      pathData = {
        type: 'path',
        attrs: { d: `M ${x} ${y} h ${w} v ${tf} h ${-(w - tw) / 2} v ${h - tf} h ${-tw} v ${-(h - tf)} h ${-(w - tw) / 2} Z` },
      }
      labels = [
        { x: cx, y: cy + h / 2 + 16, text: `${fmt(flangeW, true)} × ${fmt(totalH, true)}` },
      ]
      break
    }

    case 'h-beam': {
      /* H-Beam (Wide Flange) - similar to I-beam but flanges ≈ height */
      const height = get('height', 0.2)
      const flangeW = get('flangeWidth', 0.2)
      const webT = get('webThickness', 0.009)
      const flangeT = get('flangeThickness', 0.014)
      const hRatio = height / flangeW
      let w = maxSize * 0.7
      let h = w * hRatio
      if (h > maxSize * 0.75) { h = maxSize * 0.75; w = h / hRatio }
      const tfRatio = Math.min(flangeT / height, 0.12)
      const twRatio = Math.min(webT / flangeW, 0.15)
      const tf = h * tfRatio
      const tw = w * twRatio
      const x = cx - w / 2
      const y = cy - h / 2
      pathData = {
        type: 'path',
        attrs: { d: `M ${x} ${y} h ${w} v ${tf} h ${-(w - tw) / 2} v ${h - tf * 2} h ${(w - tw) / 2} v ${tf} h ${-w} v ${-tf} h ${(w - tw) / 2} v ${-(h - tf * 2)} h ${-(w - tw) / 2} Z` },
      }
      labels = [
        { x: cx, y: cy + h / 2 + 16, text: `H = ${fmt(height, true)}` },
        { x: cx + w / 2 + 10, y: cy, text: `b = ${fmt(flangeW, true)}` },
      ]
      break
    }

    case 'flat-bar': {
      /* Flat Bar - thin rectangle */
      const width = get('width', 0.05)
      const thickness = get('thickness', 0.005)
      const ratio = width / thickness
      let w = maxSize * 0.85
      let h = Math.max(w / ratio, maxSize * 0.1) /* Ensure visible thickness */
      if (h > maxSize * 0.3) { h = maxSize * 0.3; w = h * ratio }
      pathData = { type: 'rect', attrs: { x: cx - w / 2, y: cy - h / 2, width: w, height: h } }
      labels = [
        { x: cx, y: cy + h / 2 + 16, text: `w = ${fmt(width, true)} ${getUnitSymbol('width')}` },
        { x: cx, y: cy - h / 2 - 8, text: `t = ${fmt(thickness, true)}` },
      ]
      break
    }

    case 't-slot': {
      /* T-Slot Extrusion - square profile with slots on each side */
      const size = get('size', 0.04)
      const wallT = get('wallThickness', 0.002)
      const slotW = get('slotWidth', 0.008)
      const s = maxSize * 0.75
      const wallRatio = Math.min(wallT / size, 0.1)
      const slotRatio = Math.min(slotW / size, 0.25)
      const wall = s * wallRatio
      const slot = s * slotRatio
      const x = cx - s / 2
      const y = cy - s / 2
      /* Outer square with 4 T-slots */
      const slotDepth = s * 0.25
      const inner = s - wall * 2
      pathData = {
        type: 'path',
        attrs: {
          d: `
            M ${x} ${y} h ${s} v ${s} h ${-s} Z
            M ${x + wall} ${y + wall} v ${inner} h ${inner} v ${-inner} Z
            M ${cx - slot / 2} ${y} v ${slotDepth} h ${slot} v ${-slotDepth} Z
            M ${cx - slot / 2} ${y + s} v ${-slotDepth} h ${slot} v ${slotDepth} Z
            M ${x} ${cy - slot / 2} h ${slotDepth} v ${slot} h ${-slotDepth} Z
            M ${x + s} ${cy - slot / 2} h ${-slotDepth} v ${slot} h ${slotDepth} Z
          `,
          'fill-rule': 'evenodd',
        },
      }
      labels = [
        { x: cx, y: cy + s / 2 + 16, text: `S = ${fmt(size, true)} ${getUnitSymbol('size')}` },
      ]
      break
    }

    case 'bulb-flat': {
      /* Bulb Flat - flat bar with semicircular bulb on one edge */
      const height = get('height', 0.12)
      const webT = get('webThickness', 0.007)
      const bulbD = get('bulbDiameter', 0.02)
      const hRatio = height / bulbD
      let h = maxSize * 0.7
      let bulbR = h / hRatio / 2
      if (bulbR > maxSize * 0.12) { bulbR = maxSize * 0.12; h = bulbR * 2 * hRatio }
      const webRatio = Math.min(webT / bulbD, 0.5)
      const web = bulbR * 2 * webRatio
      const x = cx - web / 2
      const y = cy - h / 2
      pathData = {
        type: 'path',
        attrs: {
          d: `M ${x} ${y} h ${web} v ${h - bulbR} a ${bulbR} ${bulbR} 0 1 1 ${-web} 0 Z`,
        },
      }
      labels = [
        { x: cx - web / 2 - 12, y: cy, text: `h = ${fmt(height, true)}`, rotate: -90 },
        { x: cx, y: cy + h / 2 + 16, text: `db = ${fmt(bulbD, true)}` },
      ]
      break
    }

    case 'rebar': {
      /* Rebar - round bar with visual indication of ribs */
      const nomD = get('nominalDiameter', 0.012)
      const r = maxSize * 0.35
      const ribCount = 8
      pathData = { type: 'circle', attrs: { cx, cy, r } }
      /* Add visual ribs */
      const ribLines: string[] = []
      for (let i = 0; i < ribCount; i++) {
        const angle = (Math.PI * 2 * i) / ribCount
        const x1 = cx + r * 0.85 * Math.cos(angle)
        const y1 = cy + r * 0.85 * Math.sin(angle)
        const x2 = cx + r * 1.08 * Math.cos(angle)
        const y2 = cy + r * 1.08 * Math.sin(angle)
        ribLines.push(`M ${x1} ${y1} L ${x2} ${y2}`)
      }
      pathData = {
        type: 'path',
        attrs: {
          d: `M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} ${ribLines.join(' ')}`,
        },
      }
      labels = [{ x: cx, y: cy + r + 20, text: `⌀n = ${fmt(nomD, true)} ${getUnitSymbol('nominalDiameter')}` }]
      break
    }

    case 'struct-channel': {
      /* Structural Channel - C-channel with distinct flange/web thicknesses */
      const height = get('height', 0.15)
      const flangeW = get('flangeWidth', 0.075)
      const webT = get('webThickness', 0.009)
      const flangeT = get('flangeThickness', 0.013)
      const hRatio = height / flangeW
      let b = maxSize * 0.45
      let h = b * hRatio
      if (h > maxSize * 0.75) { h = maxSize * 0.75; b = h / hRatio }
      const tfRatio = Math.min(flangeT / height, 0.12)
      const twRatio = Math.min(webT / flangeW, 0.2)
      const tf = h * tfRatio
      const tw = b * twRatio
      const x = cx - b / 2
      const y = cy - h / 2
      pathData = {
        type: 'path',
        attrs: { d: `M ${x} ${y} h ${b} v ${tf} h ${-(b - tw)} v ${h - tf * 2} h ${b - tw} v ${tf} h ${-b} Z` },
      }
      labels = [
        { x: cx, y: cy + h / 2 + 16, text: `H = ${fmt(height, true)}` },
        { x: cx + b / 2 + 10, y: cy - h / 2 + tf / 2, text: `b = ${fmt(flangeW, true)}` },
      ]
      break
    }

    case 'lip-channel': {
      /* Lip Channel - C-channel with inward lips */
      const height = get('height', 0.15)
      const flangeW = get('flangeWidth', 0.065)
      const thick = get('thickness', 0.002)
      const lipH = get('lipHeight', 0.02)
      const hRatio = height / flangeW
      let b = maxSize * 0.45
      let h = b * hRatio
      if (h > maxSize * 0.7) { h = maxSize * 0.7; b = h / hRatio }
      const t = Math.max(b * 0.06, 2)
      const lip = h * (lipH / height)
      const x = cx - b / 2
      const y = cy - h / 2
      /* C-shape with inward lips at top and bottom */
      pathData = {
        type: 'path',
        attrs: {
          d: `M ${x} ${y} h ${b} v ${lip} h ${-t} v ${-lip + t} h ${-(b - t * 2)} v ${h - t * 2} h ${b - t * 2} v ${-lip + t} h ${t} v ${lip} h ${-b} Z`,
        },
      }
      labels = [
        { x: cx, y: cy + h / 2 + 16, text: `H = ${fmt(height, true)}` },
        { x: cx + b / 2 + 10, y: cy, text: `c = ${fmt(lipH, true)}` },
      ]
      break
    }

    case 'top-hat': {
      /* Top Hat Section - hat-shaped profile */
      const height = get('height', 0.05)
      const topW = get('topWidth', 0.04)
      const bottomW = get('bottomWidth', 0.025)
      const thick = get('thickness', 0.0015)
      /* Total width = topW + 2*bottomW */
      const totalW = topW + 2 * bottomW
      const hRatio = height / totalW
      let w = maxSize * 0.75
      let h = Math.min(w * hRatio, maxSize * 0.4)
      const topRatio = topW / totalW
      const bottomRatio = bottomW / totalW
      const tw = w * topRatio
      const bw = w * bottomRatio
      const t = Math.max(w * 0.04, 2)
      const x = cx - w / 2
      const y = cy - h / 2
      /* Hat shape: bottom flanges, sides going up, top */
      pathData = {
        type: 'path',
        attrs: {
          d: `
            M ${x} ${y + h} h ${bw} v ${-h} h ${tw} v ${h} h ${bw} v ${-t}
            h ${-(bw - t)} v ${-(h - t)} h ${-(tw + t * 2)} v ${h - t} h ${-(bw - t)} Z
          `,
        },
      }
      labels = [
        { x: cx, y: cy + h / 2 + 16, text: `wt = ${fmt(topW, true)}` },
        { x: cx - w / 2 - 10, y: cy, text: `h = ${fmt(height, true)}`, rotate: -90 },
      ]
      break
    }

    case 'sigma-section': {
      /* Sigma Section - Σ-shaped cold-formed section */
      const height = get('height', 0.2)
      const flangeW = get('flangeWidth', 0.07)
      const thick = get('thickness', 0.002)
      const foldD = get('foldDepth', 0.02)
      const lipH = get('lipHeight', 0.02)
      const hRatio = height / flangeW
      let b = maxSize * 0.4
      let h = b * hRatio
      if (h > maxSize * 0.7) { h = maxSize * 0.7; b = h / hRatio }
      const t = Math.max(b * 0.06, 2)
      const fold = b * (foldD / flangeW) * 1.5
      const lip = lipH > 0 ? h * (lipH / height) : 0
      const x = cx - b / 2
      const y = cy - h / 2
      /* Sigma shape: flanges with inward folds creating Σ profile */
      pathData = {
        type: 'path',
        attrs: {
          d: lip > 0
            ? `
              M ${x + b} ${y - lip} v ${lip + t} h ${-b} l ${fold} ${(h - t * 2) / 2} l ${-fold} ${(h - t * 2) / 2} h ${b} v ${t + lip}
              h ${-t} v ${-lip} h ${-(b - t * 2)} l ${fold} ${-(h - t * 2) / 2} l ${-fold} ${-(h - t * 2) / 2} h ${b - t * 2} v ${-lip} Z
            `
            : `
              M ${x + b} ${y} v ${t} h ${-b} l ${fold} ${(h - t * 2) / 2} l ${-fold} ${(h - t * 2) / 2} h ${b} v ${t}
              h ${-t} h ${-(b - t * 2)} l ${fold} ${-(h - t * 2) / 2} l ${-fold} ${-(h - t * 2) / 2} h ${b - t * 2} h ${-t} Z
            `,
        },
      }
      labels = [
        { x: cx, y: cy + h / 2 + (lip > 0 ? lip : 0) + 16, text: `H = ${fmt(height, true)}` },
      ]
      break
    }

    case 'uneven-sigma': {
      /* Uneven Sigma - asymmetric sigma section */
      const height = get('height', 0.25)
      const topB = get('topFlangeWidth', 0.08)
      const botB = get('bottomFlangeWidth', 0.06)
      const thick = get('thickness', 0.002)
      const foldD = get('foldDepth', 0.02)
      const lipH = get('lipHeight', 0.02)
      const maxFlange = Math.max(topB, botB)
      const hRatio = height / maxFlange
      let bMax = maxSize * 0.4
      let h = bMax * hRatio
      if (h > maxSize * 0.7) { h = maxSize * 0.7; bMax = h / hRatio }
      const bTop = bMax * (topB / maxFlange)
      const bBot = bMax * (botB / maxFlange)
      const t = Math.max(bMax * 0.06, 2)
      const fold = bMax * (foldD / maxFlange) * 1.5
      const lip = lipH > 0 ? h * (lipH / height) : 0
      const x = cx - bMax / 2
      const y = cy - h / 2
      /* Asymmetric sigma with different top/bottom flange widths */
      pathData = {
        type: 'path',
        attrs: {
          d: lip > 0
            ? `
              M ${x + bTop} ${y - lip} v ${lip + t} h ${-bTop} l ${fold} ${(h - t * 2) / 2} l ${-fold} ${(h - t * 2) / 2} h ${bBot} v ${t + lip}
              h ${-t} v ${-lip} h ${-(bBot - t * 2)} l ${fold} ${-(h - t * 2) / 2} l ${-fold} ${-(h - t * 2) / 2} h ${bTop - t * 2} v ${-lip} Z
            `
            : `
              M ${x + bTop} ${y} v ${t} h ${-bTop} l ${fold} ${(h - t * 2) / 2} l ${-fold} ${(h - t * 2) / 2} h ${bBot} v ${t}
              h ${-t} h ${-(bBot - t * 2)} l ${fold} ${-(h - t * 2) / 2} l ${-fold} ${-(h - t * 2) / 2} h ${bTop - t * 2} h ${-t} Z
            `,
        },
      }
      labels = [
        { x: cx, y: cy + h / 2 + (lip > 0 ? lip : 0) + 16, text: `H = ${fmt(height, true)}` },
        { x: cx, y: cy - h / 2 - (lip > 0 ? lip : 0) - 8, text: `bt = ${fmt(topB, true)}, bb = ${fmt(botB, true)}` },
      ]
      break
    }

    default:
      pathData = { type: 'circle', attrs: { cx, cy, r: INNER_2D * 0.3 } }
  }

  return { ...pathData, labels }
})

/* Formatted result display */
const resultDisplay = computed(() => formatResult(props.result, 3))
</script>

<template>
  <!-- ============================================================
       2D AREA MODE
       ============================================================ -->
  <svg
    v-if="mode === 'area'"
    class="shape-visual mode-area"
    :viewBox="`0 0 ${SIZE_2D} ${SIZE_2D}`"
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

    <!-- Background grid -->
    <g class="grid" opacity="0.15">
      <line v-for="i in 9" :key="`h${i}`" :x1="0" :y1="i * 20" :x2="SIZE_2D" :y2="i * 20" />
      <line v-for="i in 9" :key="`v${i}`" :x1="i * 20" :y1="0" :x2="i * 20" :y2="SIZE_2D" />
    </g>

    <!-- Extra elements -->
    <template v-if="shape2DData.extras">
      <component
        v-for="(extra, i) in shape2DData.extras"
        :key="`extra-${i}`"
        :is="extra.type"
        v-bind="extra.attrs"
      />
    </template>

    <!-- Main shape -->
    <template v-if="shape2DData.type === 'ring'">
      <circle
        :cx="Number(shape2DData.attrs.cx)"
        :cy="Number(shape2DData.attrs.cy)"
        :r="Number(shape2DData.attrs.R)"
        class="shape-main outer-ring"
      />
      <circle
        :cx="Number(shape2DData.attrs.cx)"
        :cy="Number(shape2DData.attrs.cy)"
        :r="Number(shape2DData.attrs.r)"
        class="shape-inner"
      />
    </template>
    <component
      v-else
      :is="shape2DData.type"
      v-bind="shape2DData.attrs"
      class="shape-main"
    />

    <!-- Dimension labels -->
    <text
      v-for="(label, i) in shape2DData.labels"
      :key="`label-${i}`"
      :x="label.x"
      :y="label.y"
      :transform="label.rotate ? `rotate(${label.rotate}, ${label.x}, ${label.y})` : undefined"
      :class="['dimension-label', label.class]"
    >
      {{ label.text }}
    </text>

    <!-- Result display -->
    <g class="result-display" :transform="`translate(${SIZE_2D / 2}, ${SIZE_2D - 12})`">
      <text class="result-value">{{ resultDisplay }} {{ resultUnit }}</text>
    </g>
  </svg>

  <!-- ============================================================
       3D VOLUME MODE
       ============================================================ -->
  <svg
    v-else-if="mode === 'volume'"
    class="shape-visual mode-volume"
    :viewBox="`0 0 ${SIZE_2D} ${SIZE_2D}`"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="shape-fill-3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb) / 25%)" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb) / 40%)" />
      </linearGradient>
      <linearGradient id="cylinderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
        <stop offset="50%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.25" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
      </linearGradient>
      <radialGradient id="sphereGradient" cx="35%" cy="35%" r="60%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.7" />
        <stop offset="60%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.3" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
      </radialGradient>
      <linearGradient id="hemisphereGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.4" />
        <stop offset="50%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.6" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.3" />
      </linearGradient>
      <linearGradient id="coneGradient" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.2" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
      </linearGradient>
      <linearGradient id="torusGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.3" />
      </linearGradient>
    </defs>

    <!-- Background grid (same as 2D) -->
    <g class="grid" opacity="0.15">
      <line v-for="i in 9" :key="`h${i}`" :x1="0" :y1="i * 20" :x2="SIZE_2D" :y2="i * 20" />
      <line v-for="i in 9" :key="`v${i}`" :x1="i * 20" :y1="0" :x2="i * 20" :y2="SIZE_2D" />
    </g>

    <!-- Shape paths -->
    <path
      v-for="(path, i) in shape3DData.paths"
      :key="i"
      :d="path.d"
      :fill="path.fill"
      :stroke="path.noStroke ? 'none' : (path.strokeColor ?? (path.stroke === false ? 'none' : 'var(--accent-500)'))"
      :stroke-width="path.strokeWidth ?? (path.stroke ? 1.5 : 2)"
      :stroke-dasharray="path.strokeDasharray"
      stroke-linejoin="round"
    />

    <!-- Outline -->
    <path
      v-if="shape3DData.outline"
      :d="shape3DData.outline"
      fill="none"
      stroke="var(--accent-500)"
      stroke-width="2"
      stroke-linejoin="round"
    />

    <!-- Dimension labels -->
    <g class="labels-3d">
      <g v-for="(label, i) in shape3DData.labels" :key="'label-' + i" :class="label.class">
        <rect
          v-if="!label.class?.includes('diagonal-label')"
          :x="label.x - 30"
          :y="label.y - 9"
          width="60"
          height="18"
          rx="4"
          class="label-bg"
        />
        <text :x="label.x" :y="label.y + 4" text-anchor="middle" :class="['label-text', label.class]">
          {{ label.text }}
        </text>
      </g>
    </g>

    <!-- Result display (same position as 2D) -->
    <g class="result-display" :transform="`translate(${SIZE_2D / 2}, ${SIZE_2D - 12})`">
      <text class="result-value">{{ resultDisplay }} {{ resultUnit }}</text>
    </g>
  </svg>

  <!-- ============================================================
       METAL PROFILE MODE
       ============================================================ -->
  <svg
    v-else-if="mode === 'profile'"
    class="shape-visual mode-profile"
    :viewBox="`0 0 ${SIZE_2D} ${SIZE_2D}`"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="profile-fill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb) / 25%)" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb) / 40%)" />
      </linearGradient>
      <filter id="profile-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Background grid (same as 2D) -->
    <g class="grid" opacity="0.15">
      <line v-for="i in 9" :key="`h${i}`" :x1="0" :y1="i * 20" :x2="SIZE_2D" :y2="i * 20" />
      <line v-for="i in 9" :key="`v${i}`" :x1="i * 20" :y1="0" :x2="i * 20" :y2="SIZE_2D" />
    </g>

    <!-- Profile shape -->
    <component :is="profileData.type" v-bind="profileData.attrs" class="shape-main" />

    <!-- Dimension labels -->
    <text
      v-for="(label, i) in profileData.labels"
      :key="i"
      :x="label.x"
      :y="label.y"
      :transform="label.rotate ? `rotate(${label.rotate} ${label.x} ${label.y})` : undefined"
      class="dimension-label"
    >
      {{ label.text }}
    </text>

    <!-- Material badge -->
    <g v-if="material" class="material-badge-svg" transform="translate(10, 20)">
      <rect x="0" y="-12" :width="material.length * 6 + 12" height="18" rx="4" class="badge-bg" />
      <text x="6" y="2" class="badge-text">{{ material.toUpperCase() }}</text>
    </g>

    <!-- Result display (same position as 2D) -->
    <g class="result-display" :transform="`translate(${SIZE_2D / 2}, ${SIZE_2D - 12})`">
      <text class="result-value">{{ resultDisplay }} {{ resultUnit }}</text>
    </g>
  </svg>
</template>

<style scoped lang="scss">
/* ============================================================
   SHARED STYLES - All modes use the same base styling
   ============================================================ */
.shape-visual {
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 5%) 0%, transparent 100%);
  border-radius: 1rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);

  /* CSS variables for 3D faces */
  --face-light: rgb(var(--accent-500-rgb) / 55%);
  --face-medium: rgb(var(--accent-500-rgb) / 40%);
  --face-dark: rgb(var(--accent-500-rgb) / 28%);
  --face-base: rgb(var(--accent-500-rgb) / 20%);
  --cube-top: #2d8b9e;
  --cube-right: #1e6a7a;
  --cube-left: #154d5a;
}

/* Grid - shared across all modes */
.grid line {
  stroke: var(--accent-500);
  stroke-width: 0.5;
}

/* Dimension labels - shared across all modes */
.dimension-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  fill: var(--text);
  text-anchor: middle;
  dominant-baseline: middle;
}

/* Shape main - shared across 2D and profile modes */
.shape-main {
  fill: url(#shape-fill);
  stroke: var(--accent-500);
  stroke-width: 2;
  filter: url(#shape-glow);
  transition: all 0.3s ease;
}

/* Result display - shared across all modes */
.result-display {
  .result-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    fill: var(--accent-500);
    text-anchor: middle;
  }
}

/* ============================================================
   2D AREA MODE
   ============================================================ */
.mode-area {
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

  .center-label {
    font-size: 14px;
    fill: var(--accent-500);
  }
}

/* ============================================================
   3D VOLUME MODE
   ============================================================ */
.mode-volume {
  .labels-3d {
    .label-bg {
      fill: rgb(var(--accent-500-rgb) / 15%);
    }

    .label-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      fill: var(--text);

      &.diagonal-label {
        font-size: 12px;
        font-weight: 700;
        font-style: italic;

        &.space {
          fill: #0066cc;
        }

        &.face {
          fill: #cc5500;
        }
      }
    }
  }
}

/* ============================================================
   METAL PROFILE MODE
   ============================================================ */
.mode-profile {
  .shape-main {
    fill: url(#profile-fill);
    filter: url(#profile-glow);
  }

  .material-badge-svg {
    .badge-bg {
      fill: rgb(var(--accent-500-rgb) / 15%);
      width: auto;
    }

    .badge-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      fill: var(--accent-500);
      letter-spacing: 0.05em;
    }
  }
}
</style>
