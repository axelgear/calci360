import type { ShapeContext, ShapeRenderData } from '../types'
import { INNER_2D } from '../../useShapeVisual'

export function square(ctx: ShapeContext): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
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

