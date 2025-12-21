import type { ShapeContext, Shape3DRenderData } from '../types'

const BASE_SCALE = 8

export function box(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol, isoProject } = ctx
  const l = get('length', 8)
  const w = get('width', 5)
  const h = get('height', 4)
  const maxDim = Math.max(l, w, h)
  const scale = (BASE_SCALE * 4) / maxDim

  const lh = (l * scale) / 2
  const wh = (w * scale) / 2
  const hh = h * scale

  const p = {
    ftl: isoProject(-lh, hh, -wh),
    ftr: isoProject(lh, hh, -wh),
    fbr: isoProject(lh, 0, -wh),
    fbl: isoProject(-lh, 0, -wh),
    btl: isoProject(-lh, hh, wh),
    btr: isoProject(lh, hh, wh),
    bbr: isoProject(lh, 0, wh),
    bbl: isoProject(-lh, 0, wh),
  }

  const outline = `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.bbl.x},${p.bbl.y} L${p.bbr.x},${p.bbr.y} L${p.fbr.x},${p.fbr.y} L${p.ftr.x},${p.ftr.y} Z`
  const center = p.fbl
  const innerEdges = `M${p.ftl.x},${p.ftl.y} L${center.x},${center.y} L${p.bbl.x},${p.bbl.y} M${center.x},${center.y} L${p.fbr.x},${p.fbr.y}`

  return {
    paths: [
      { d: `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.btr.x},${p.btr.y} L${p.ftr.x},${p.ftr.y} Z`, fill: 'var(--cube-top)', noStroke: true },
      { d: `M${p.ftl.x},${p.ftl.y} L${p.fbl.x},${p.fbl.y} L${p.bbl.x},${p.bbl.y} L${p.btl.x},${p.btl.y} Z`, fill: 'var(--cube-left)', noStroke: true },
      { d: `M${p.ftr.x},${p.ftr.y} L${p.fbr.x},${p.fbr.y} L${p.bbr.x},${p.bbr.y} L${p.btr.x},${p.btr.y} Z`, fill: 'var(--cube-right)', noStroke: true },
      { d: innerEdges, fill: 'none', stroke: true },
    ],
    outline,
    labels: [
      { x: p.btr.x + 15, y: (p.btr.y + p.bbr.y) / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
      { x: (p.ftr.x + p.btr.x) / 2, y: p.ftl.y - 10, text: `l = ${fmt(l)} ${getUnitSymbol('length')}` },
      { x: p.btl.x - 30, y: (p.btl.y + p.bbl.y) / 2, text: `w = ${fmt(w)} ${getUnitSymbol('width')}` },
    ],
  }
}

