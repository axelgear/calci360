import type { ShapeContext, ShapeRenderData } from '../types'

export function tSlot(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
  const size = get('size', 0.04)
  const wallT = get('wallThickness', 0.002)
  const slotW = get('slotWidth', 0.008)
  const s = maxSize * 0.75
  const wallRatio = Math.min(wallT / size, 0.1)
  const slotRatio = Math.min(slotW / size, 0.25)
  const wall = s * wallRatio
  const slot = s * slotRatio
  const x = cx - s / 2
  const y = cy - s / 2
  const slotDepth = s * 0.25
  const inner = s - wall * 2
  return {
    type: 'path',
    attrs: {
      d: `
        M ${x} ${y} h ${s} v ${s} h ${-s} Z
        M ${x + wall} ${y + wall} v ${inner} h ${inner} v ${-inner} Z
        M ${cx - slot / 2} ${y} v ${slotDepth} h ${slot} v ${-slotDepth} Z
        M ${cx - slot / 2} ${y + s} v ${-slotDepth} h ${slot} v ${slotDepth} Z
        M ${x} ${cy - slot / 2} h ${slotDepth} v ${slot} h ${-slotDepth} Z
        M ${x + s} ${cy - slot / 2} h ${-slotDepth} v ${slot} h ${slotDepth} Z
      `,
      'fill-rule': 'evenodd',
    },
    labels: [
      { x: cx, y: cy + s / 2 + 16, text: `S = ${fmt(size, true)} ${getUnitSymbol('size')}` },
    ],
  }
}

export function bulbFlat(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const height = get('height', 0.12)
  const webT = get('webThickness', 0.007)
  const bulbD = get('bulbDiameter', 0.02)
  const hRatio = height / bulbD
  let h = maxSize * 0.7
  let bulbR = h / hRatio / 2
  if (bulbR > maxSize * 0.12) { bulbR = maxSize * 0.12; h = bulbR * 2 * hRatio }
  const webRatio = Math.min(webT / bulbD, 0.5)
  const web = bulbR * 2 * webRatio
  const x = cx - web / 2
  const y = cy - h / 2
  return {
    type: 'path',
    attrs: {
      d: `M ${x} ${y} h ${web} v ${h - bulbR} a ${bulbR} ${bulbR} 0 1 1 ${-web} 0 Z`,
    },
    labels: [
      { x: cx - web / 2 - 12, y: cy, text: `h = ${fmt(height, true)}`, rotate: -90 },
      { x: cx, y: cy + h / 2 + 16, text: `db = ${fmt(bulbD, true)}` },
    ],
  }
}

