import type { ShapeContext, ShapeRenderData } from '../types'

export function roundTube(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
  const od = get('outerDiameter', 0.05)
  const wall = get('wallThickness', 0.003)
  const wallRatio = Math.min(wall / (od / 2), 0.4)
  const outerR = maxSize * 0.42
  const innerR = outerR * (1 - wallRatio * 2)
  return {
    type: 'path',
    attrs: {
      d: `M ${cx + outerR} ${cy} A ${outerR} ${outerR} 0 1 1 ${cx - outerR} ${cy} A ${outerR} ${outerR} 0 1 1 ${cx + outerR} ${cy} M ${cx + innerR} ${cy} A ${innerR} ${innerR} 0 1 0 ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 1 0 ${cx + innerR} ${cy}`,
      'fill-rule': 'evenodd',
    },
    labels: [
      { x: cx, y: cy + outerR + 16, text: `OD = ${fmt(od, true)} ${getUnitSymbol('outerDiameter')}` },
      { x: cx + outerR * 0.5, y: cy - outerR * 0.7, text: `t = ${fmt(wall, true)}` },
    ],
  }
}

export function squareTube(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
  const outerSide = get('outerSide', 0.05)
  const wall = get('wallThickness', 0.003)
  const wallRatio = Math.min(wall / outerSide, 0.2)
  const outer = maxSize * 0.7
  const wallVisual = outer * wallRatio * 2
  const inner = outer - wallVisual * 2
  const ox = cx - outer / 2
  const oy = cy - outer / 2
  const ix = cx - inner / 2
  const iy = cy - inner / 2
  return {
    type: 'path',
    attrs: {
      d: `M ${ox} ${oy} h ${outer} v ${outer} h ${-outer} Z M ${ix} ${iy} v ${inner} h ${inner} v ${-inner} Z`,
      'fill-rule': 'evenodd',
    },
    labels: [
      { x: cx, y: cy + outer / 2 + 16, text: `a = ${fmt(outerSide, true)} ${getUnitSymbol('outerSide')}` },
      { x: cx + outer / 2 + 8, y: cy, text: `t = ${fmt(wall, true)}` },
    ],
  }
}

export function rectangularTube(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const outerW = get('outerWidth', 0.06)
  const outerH = get('outerHeight', 0.04)
  const wall = get('wallThickness', 0.003)
  const ratio = outerW / outerH
  let w = maxSize * 0.8
  let h = w / ratio
  if (h > maxSize * 0.6) { h = maxSize * 0.6; w = h * ratio }
  const wallRatio = Math.min(wall / Math.min(outerW, outerH), 0.15)
  const wallVisual = Math.min(w, h) * wallRatio * 2
  const innerW = w - wallVisual * 2
  const innerH = h - wallVisual * 2
  const ox = cx - w / 2
  const oy = cy - h / 2
  const ix = cx - innerW / 2
  const iy = cy - innerH / 2
  return {
    type: 'path',
    attrs: {
      d: `M ${ox} ${oy} h ${w} v ${h} h ${-w} Z M ${ix} ${iy} v ${innerH} h ${innerW} v ${-innerH} Z`,
      'fill-rule': 'evenodd',
    },
    labels: [
      { x: cx, y: cy + h / 2 + 16, text: `${fmt(outerW, true)} × ${fmt(outerH, true)}` },
      { x: cx + w / 2 + 8, y: cy, text: `t = ${fmt(wall, true)}` },
    ],
  }
}

