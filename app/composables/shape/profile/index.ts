/**
 * Profile Shape Renderers - Index file
 * Exports all profile shape rendering functions for metal cross-sections
 */

import type { ShapeContext, ShapeRenderData } from '../types'
import { INNER_2D } from '../../useShapeVisual'

/* Import individual shape renderers */
import { roundBar, squareBar, rectangularBar, hexagonalBar, flatBar, rebar, sheet } from './bars'
import { roundTube, squareTube, rectangularTube } from './tubes'
import { angleBar, channel, iBeam, hBeam, tBar, structChannel, lipChannel, topHat } from './structural'
import { tSlot, bulbFlat } from './specialized'

/** Profile renderer registry */
const profileRenderers: Record<string, (ctx: ShapeContext, maxSize: number) => ShapeRenderData> = {
  'round-bar': roundBar,
  'square-bar': squareBar,
  'rectangular-bar': rectangularBar,
  'hexagonal-bar': hexagonalBar,
  'flat-bar': flatBar,
  'rebar': rebar,
  'sheet': sheet,
  'round-tube': roundTube,
  'square-tube': squareTube,
  'rectangular-tube': rectangularTube,
  'angle-bar': angleBar,
  'channel': channel,
  'i-beam': iBeam,
  'h-beam': hBeam,
  't-bar': tBar,
  'struct-channel': structChannel,
  'lip-channel': lipChannel,
  'top-hat': topHat,
  't-slot': tSlot,
  'bulb-flat': bulbFlat,
}

/** Get shape data for a profile */
export function getProfileData(shapeId: string, ctx: ShapeContext): ShapeRenderData {
  const maxSize = INNER_2D * 0.85
  const renderer = profileRenderers[shapeId]
  if (renderer) {
    return renderer(ctx, maxSize)
  }
  /* Default fallback */
  return {
    type: 'circle',
    attrs: { cx: ctx.cx, cy: ctx.cy, r: INNER_2D * 0.3 },
    labels: [],
  }
}

/* Re-export individual shapes */
export {
  roundBar,
  squareBar,
  rectangularBar,
  hexagonalBar,
  flatBar,
  rebar,
  sheet,
  roundTube,
  squareTube,
  rectangularTube,
  angleBar,
  channel,
  iBeam,
  hBeam,
  tBar,
  structChannel,
  lipChannel,
  topHat,
  tSlot,
  bulbFlat,
}

