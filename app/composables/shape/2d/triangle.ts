import type { ShapeContext, ShapeRenderData } from '../types'
import { INNER_2D } from '../../useShapeVisual'

export function triangle(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
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

export function triangleHeron(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
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

