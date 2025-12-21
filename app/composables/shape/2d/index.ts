/**
 * 2D Shape Renderers - Index file
 * Exports all 2D shape rendering functions
 */

import type { ShapeContext, ShapeRenderData } from '../types'

/* Import individual shape renderers */
import { rectangle } from './rectangle'
import { square } from './square'
import { triangle, triangleHeron } from './triangle'
import { circle, ellipse, ring, sector } from './circle'
import { parallelogram, trapezoid, rhombus } from './quadrilateral'
import { regularPolygon, pentagon, hexagon } from './polygon'

/** Shape renderer registry */
const shape2DRenderers: Record<string, (ctx: ShapeContext) => ShapeRenderData> = {
  'rectangle': rectangle,
  'square': square,
  'triangle': triangle,
  'triangle-heron': triangleHeron,
  'circle': circle,
  'ellipse': ellipse,
  'ring': ring,
  'sector': sector,
  'parallelogram': parallelogram,
  'trapezoid': trapezoid,
  'rhombus': rhombus,
  'pentagon': pentagon,
  'hexagon': hexagon,
  'regular-polygon': (ctx) => regularPolygon(ctx, 'regular-polygon'),
}

/** Get shape data for a 2D shape */
export function getShape2DData(shapeId: string, ctx: ShapeContext): ShapeRenderData {
  const renderer = shape2DRenderers[shapeId]
  if (renderer) {
    return renderer(ctx)
  }
  return { type: 'unknown', attrs: {}, labels: [] }
}

/* Re-export individual shapes for direct imports */
export {
  rectangle,
  square,
  triangle,
  triangleHeron,
  circle,
  ellipse,
  ring,
  sector,
  parallelogram,
  trapezoid,
  rhombus,
  regularPolygon,
  pentagon,
  hexagon,
}

