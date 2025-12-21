/**
 * 3D Shape Renderers - Index file
 * Exports all 3D shape rendering functions
 */

import type { ShapeContext, Shape3DRenderData } from '../types'

/* Import individual shape renderers */
import { cube } from './cube'
import { box } from './box'
import { sphere, hemisphere, sphericalCap } from './sphere'
import { cylinder, cone, frustum, capsule } from './cylinder'
import { pyramidSquare, pyramidRect } from './pyramid'
import { tetrahedron, octahedron } from './polyhedra'
import { prismTriangular, prismHexagonal } from './prism'
import { torus, ellipsoid } from './torus'

/** Default 3D shape (generic box) */
function defaultShape3D(ctx: ShapeContext): Shape3DRenderData {
  const { isoProject, facePath } = ctx
  const size = 40
  const half = size

  const v = {
    ftl: [-half, half, -half] as [number, number, number],
    ftr: [half, half, -half] as [number, number, number],
    fbr: [half, 0, -half] as [number, number, number],
    fbl: [-half, 0, -half] as [number, number, number],
    btl: [-half, half, half] as [number, number, number],
    btr: [half, half, half] as [number, number, number],
    bbr: [half, 0, half] as [number, number, number],
    bbl: [-half, 0, half] as [number, number, number],
  }

  return {
    paths: [
      { d: facePath(v.ftl, v.fbl, v.bbl, v.btl), fill: 'var(--face-dark)' },
      { d: facePath(v.ftr, v.btr, v.bbr, v.fbr), fill: 'var(--face-medium)' },
      { d: facePath(v.ftl, v.btl, v.btr, v.ftr), fill: 'var(--face-light)' },
    ],
    labels: [],
  }
}

/** Shape renderer registry */
const shape3DRenderers: Record<string, (ctx: ShapeContext) => Shape3DRenderData> = {
  'cube': cube,
  'box': box,
  'sphere': sphere,
  'hemisphere': hemisphere,
  'spherical-cap': sphericalCap,
  'cylinder': cylinder,
  'cone': cone,
  'frustum': frustum,
  'capsule': capsule,
  'pyramid-square': pyramidSquare,
  'pyramid-rect': pyramidRect,
  'tetrahedron': tetrahedron,
  'octahedron': octahedron,
  'prism-triangular': prismTriangular,
  'prism-hexagonal': prismHexagonal,
  'torus': torus,
  'ellipsoid': ellipsoid,
}

/** Get shape data for a 3D shape */
export function getShape3DData(shapeId: string, ctx: ShapeContext): Shape3DRenderData {
  const renderer = shape3DRenderers[shapeId]
  if (renderer) {
    return renderer(ctx)
  }
  return defaultShape3D(ctx)
}

/* Re-export individual shapes for direct imports */
export {
  cube,
  box,
  sphere,
  hemisphere,
  sphericalCap,
  cylinder,
  cone,
  frustum,
  capsule,
  pyramidSquare,
  pyramidRect,
  tetrahedron,
  octahedron,
  prismTriangular,
  prismHexagonal,
  torus,
  ellipsoid,
  defaultShape3D,
}

