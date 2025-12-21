import type { ShapeContext, ShapeRenderData } from '../types'
import { INNER_2D } from '../../useShapeVisual'

export function parallelogram(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
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

export function trapezoid(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
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

export function rhombus(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
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

