import type { ShapeContext, Shape3DRenderData } from '../types'

const BASE_SCALE = 8

export function pyramidSquare(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol, isoProject } = ctx
  const a = get('base', 6)
  const h = get('height', 8)
  const maxDim = Math.max(a, h)
  const scale = (BASE_SCALE * 5) / maxDim

  const half = (a * scale) / 2
  const height = h * scale

  const apex: [number, number, number] = [0, height, 0]
  const fl: [number, number, number] = [-half, 0, -half]
  const fr: [number, number, number] = [half, 0, -half]
  const br: [number, number, number] = [half, 0, half]
  const bl: [number, number, number] = [-half, 0, half]

  const pApex = isoProject(...apex)
  const pFL = isoProject(...fl)
  const pFR = isoProject(...fr)
  const pBR = isoProject(...br)
  const pBL = isoProject(...bl)

  return {
    paths: [
      { d: `M${pApex.x},${pApex.y} L${pFL.x},${pFL.y} L${pBL.x},${pBL.y} Z`, fill: 'var(--face-dark)' },
      { d: `M${pApex.x},${pApex.y} L${pFR.x},${pFR.y} L${pBR.x},${pBR.y} Z`, fill: 'var(--face-medium)' },
      { d: `M${pApex.x},${pApex.y} L${pFL.x},${pFL.y} L${pFR.x},${pFR.y} Z`, fill: 'var(--face-light)' },
      { d: `M${pFL.x},${pFL.y} L${pFR.x},${pFR.y} L${pBR.x},${pBR.y} L${pBL.x},${pBL.y} Z`, fill: 'var(--face-base)' },
    ],
    labels: [
      { x: (pFL.x + pFR.x) / 2, y: pFL.y + 20, text: `a = ${fmt(a)} ${getUnitSymbol('base')}` },
      { x: pApex.x + 25, y: (pApex.y + pFR.y) / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
    ],
  }
}

export function pyramidRect(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol, isoProject } = ctx
  const l = get('length', 8)
  const w = get('width', 5)
  const h = get('height', 7)
  const maxDim = Math.max(l, w, h)
  const scale = (BASE_SCALE * 5) / maxDim

  const lh = (l * scale) / 2
  const wh = (w * scale) / 2
  const height = h * scale

  const apex: [number, number, number] = [0, height, 0]
  const fl: [number, number, number] = [-lh, 0, -wh]
  const fr: [number, number, number] = [lh, 0, -wh]
  const br: [number, number, number] = [lh, 0, wh]
  const bl: [number, number, number] = [-lh, 0, wh]

  const pApex = isoProject(...apex)
  const pFL = isoProject(...fl)
  const pFR = isoProject(...fr)
  const pBR = isoProject(...br)
  const pBL = isoProject(...bl)

  return {
    paths: [
      { d: `M${pApex.x},${pApex.y} L${pFL.x},${pFL.y} L${pBL.x},${pBL.y} Z`, fill: 'var(--face-dark)' },
      { d: `M${pApex.x},${pApex.y} L${pFR.x},${pFR.y} L${pBR.x},${pBR.y} Z`, fill: 'var(--face-medium)' },
      { d: `M${pApex.x},${pApex.y} L${pFL.x},${pFL.y} L${pFR.x},${pFR.y} Z`, fill: 'var(--face-light)' },
      { d: `M${pFL.x},${pFL.y} L${pFR.x},${pFR.y} L${pBR.x},${pBR.y} L${pBL.x},${pBL.y} Z`, fill: 'var(--face-base)' },
    ],
    labels: [
      { x: (pFL.x + pFR.x) / 2, y: pFL.y + 20, text: `l = ${fmt(l)} ${getUnitSymbol('length')}` },
      { x: pBL.x - 15, y: (pFL.y + pBL.y) / 2, text: `w = ${fmt(w)}` },
      { x: pApex.x + 25, y: (pApex.y + pFR.y) / 2, text: `h = ${fmt(h)}` },
    ],
  }
}

