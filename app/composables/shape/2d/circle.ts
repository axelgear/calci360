import type { ShapeContext, ShapeRenderData } from '../types'
import { INNER_2D } from '../../useShapeVisual'

export function circle(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
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

export function ellipse(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
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

export function ring(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
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

export function sector(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
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

