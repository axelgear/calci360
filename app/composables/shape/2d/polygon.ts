import type { ShapeContext, ShapeRenderData, ShapeLabel } from '../types'
import { INNER_2D } from '../../useShapeVisual'

export function regularPolygon(ctx: ShapeContext, shapeId: string): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const nVal = get('n', 8)
  const side = get('side', 5)
  const n = shapeId === 'pentagon' ? 5 : shapeId === 'hexagon' ? 6 : Math.floor(nVal)
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
  if (shapeId === 'regular-polygon') {
    labels.push({ x: cx, y: cy + 5, text: `n = ${n}`, class: 'center-label' })
  }
  return { type: 'polygon', attrs: { points }, labels }
}

export function pentagon(ctx: ShapeContext): ShapeRenderData {
  return regularPolygon(ctx, 'pentagon')
}

export function hexagon(ctx: ShapeContext): ShapeRenderData {
  return regularPolygon(ctx, 'hexagon')
}

