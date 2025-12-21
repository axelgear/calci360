import type { ShapeContext, Shape3DRenderData } from '../types'
import { SIZE_2D } from '../../useShapeVisual'

const BASE_SCALE = 8
const cx = SIZE_2D / 2
const cy = SIZE_2D / 2

export function sphere(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol, ellipsePoints } = ctx
  const r = get('radius', 5)
  const radius = r * BASE_SCALE * 0.9

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

export function hemisphere(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol } = ctx
  const r = get('radius', 5)
  const radius = r * BASE_SCALE * 0.9
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

export function sphericalCap(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol } = ctx
  const R = get('R', 8)
  const h = get('h', 3)
  const scale = BASE_SCALE * 0.7

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

