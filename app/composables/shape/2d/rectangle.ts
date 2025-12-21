import type { ShapeContext, ShapeRenderData } from '../types'
import { INNER_2D } from '../../useShapeVisual'

export function rectangle(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
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

