import type { ShapeContext, Shape3DRenderData } from '../types'
import { SIZE_2D } from '../../useShapeVisual'

const BASE_SCALE = 8
const cx = SIZE_2D / 2
const cy = SIZE_2D / 2

export function cylinder(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol } = ctx
  const r = get('radius', 4)
  const h = get('height', 8)
  const maxDim = Math.max(r * 2, h)
  const scale = (BASE_SCALE * 5) / maxDim

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

export function cone(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol } = ctx
  const r = get('radius', 4)
  const h = get('height', 9)
  const maxDim = Math.max(r * 2, h)
  const scale = (BASE_SCALE * 5) / maxDim

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

export function frustum(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol } = ctx
  const r1 = get('r1', 2)
  const r2 = get('r2', 5)
  const h = get('height', 6)
  const maxDim = Math.max(r2 * 2, h)
  const scale = (BASE_SCALE * 5) / maxDim

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

export function capsule(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol } = ctx
  const r = get('radius', 3)
  const h = get('height', 8)
  const maxDim = Math.max(r * 2, h + r * 2)
  const scale = (BASE_SCALE * 5) / maxDim

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

