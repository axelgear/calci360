/**
 * HVAC Shape Renderers - Index file
 * Exports HVAC duct shape rendering functions
 */

import type { ShapeContext, HvacRenderData } from '../types'
import { SIZE_2D } from '../../useShapeVisual'

const cx = SIZE_2D / 2
const cy = SIZE_2D / 2

/** Round duct data */
export function roundDuct(ctx: ShapeContext): HvacRenderData {
  const { get, fmt, getUnitSymbol } = ctx
  const diameter = get('diameter', 0.3)
  const length = get('length', 10)

  return {
    type: 'round',
    labels: [
      { x: cx, y: cy + 50, text: `L = ${fmt(length)} ${getUnitSymbol('length')}` },
      { x: 45, y: 35, text: `⌀ ${fmt(diameter)} ${getUnitSymbol('diameter')}` },
    ],
  }
}

/** Rectangular duct data */
export function rectangularDuct(ctx: ShapeContext): HvacRenderData {
  const { get, fmt, getUnitSymbol } = ctx
  const width = get('width', 0.4)
  const height = get('height', 0.3)
  const length = get('length', 10)

  return {
    type: 'rectangular',
    labels: [
      { x: 120, y: SIZE_2D - 25, text: `L = ${fmt(length)} ${getUnitSymbol('length')}` },
      { x: 95, y: 25, text: `W = ${fmt(width)} ${getUnitSymbol('width')}` },
      { x: 12, y: 90, text: `H = ${fmt(height)} ${getUnitSymbol('height')}` },
    ],
  }
}

/** Get HVAC shape data */
export function getHvacData(shapeId: string, ctx: ShapeContext): HvacRenderData {
  if (shapeId === 'round') {
    return roundDuct(ctx)
  }
  return rectangularDuct(ctx)
}

