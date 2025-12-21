import type { ShapeContext, Shape3DRenderData } from '../types'
import { SIZE_2D } from '../../useShapeVisual'

const BASE_SCALE = 8
const cx = SIZE_2D / 2
const cy = SIZE_2D / 2

export function torus(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol } = ctx
  const R = get('R', 6)
  const r = get('r', 2)
  const maxDim = R + r
  const scale = (BASE_SCALE * 5) / maxDim

  const majorR = R * scale
  const tubeR = r * scale

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

export function ellipsoid(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol } = ctx
  const a = get('a', 6)
  const b = get('b', 4)
  const c = get('c', 3)
  const maxDim = Math.max(a, b, c)
  const scale = (BASE_SCALE * 5) / maxDim

  const rx = a * scale
  const ry = c * scale * 0.7
  const rz = b * scale

  return {
    paths: [
      { d: `M${cx - rx},${cy} A${rx},${ry} 0 1,1 ${cx + rx},${cy} A${rx},${ry} 0 1,1 ${cx - rx},${cy}`, fill: 'url(#sphereGradient)' },
      { d: `M${cx - rx},${cy} Q${cx},${cy + ry * 0.5} ${cx + rx},${cy} Q${cx},${cy - ry * 0.5} ${cx - rx},${cy}`, fill: 'none', stroke: true },
    ],
    labels: [
      { x: cx + rx + 10, y: cy, text: `a = ${fmt(a)} ${getUnitSymbol('a')}` },
      { x: cx, y: cy - ry - 10, text: `c = ${fmt(c)}` },
      { x: cx - 40, y: cy + 10, text: `b = ${fmt(b)}` },
    ],
  }
}

