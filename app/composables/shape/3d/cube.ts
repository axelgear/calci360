import type { ShapeContext, Shape3DRenderData } from '../types'
import { SIZE_2D } from '../../useShapeVisual'

const BASE_SCALE = 8
const cx = SIZE_2D / 2

export function cube(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol, isoProject } = ctx
  const s = get('side', 5)
  const size = s * BASE_SCALE * 0.8
  const half = size / 2

  const p = {
    ftl: isoProject(-half, size, -half),
    ftr: isoProject(half, size, -half),
    fbr: isoProject(half, 0, -half),
    fbl: isoProject(-half, 0, -half),
    btl: isoProject(-half, size, half),
    btr: isoProject(half, size, half),
    bbr: isoProject(half, 0, half),
    bbl: isoProject(-half, 0, half),
  }

  const outline = `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.bbl.x},${p.bbl.y} L${p.bbr.x},${p.bbr.y} L${p.fbr.x},${p.fbr.y} L${p.ftr.x},${p.ftr.y} Z`
  const center = p.fbl
  const innerEdges = `M${p.ftl.x},${p.ftl.y} L${center.x},${center.y} L${p.bbl.x},${p.bbl.y} M${center.x},${center.y} L${p.fbr.x},${p.fbr.y}`
  const spaceDiagonal = `M${p.bbl.x},${p.bbl.y} L${p.ftr.x},${p.ftr.y}`
  const faceDiagonal = `M${p.ftr.x},${p.ftr.y} L${p.bbr.x},${p.bbr.y}`

  return {
    paths: [
      { d: `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.btr.x},${p.btr.y} L${p.ftr.x},${p.ftr.y} Z`, fill: 'var(--cube-top)', noStroke: true },
      { d: `M${p.ftl.x},${p.ftl.y} L${p.fbl.x},${p.fbl.y} L${p.bbl.x},${p.bbl.y} L${p.btl.x},${p.btl.y} Z`, fill: 'var(--cube-left)', noStroke: true },
      { d: `M${p.ftr.x},${p.ftr.y} L${p.fbr.x},${p.fbr.y} L${p.bbr.x},${p.bbr.y} L${p.btr.x},${p.btr.y} Z`, fill: 'var(--cube-right)', noStroke: true },
      { d: innerEdges, fill: 'none', stroke: true },
      { d: spaceDiagonal, fill: 'none', stroke: true, strokeColor: '#0066cc', strokeWidth: 2.5 },
      { d: faceDiagonal, fill: 'none', stroke: true, strokeColor: '#cc5500', strokeWidth: 2.5 },
      { d: `M${p.btl.x},${p.btl.y} L${p.bbr.x},${p.bbr.y}`, fill: 'none', stroke: true, strokeColor: 'rgb(var(--text-rgb) / 35%)', strokeWidth: 1.5, strokeDasharray: '6 4' },
      { d: `M${p.btl.x},${p.btl.y} L${p.fbl.x},${p.fbl.y}`, fill: 'none', stroke: true, strokeColor: 'rgb(var(--text-rgb) / 35%)', strokeWidth: 1.5, strokeDasharray: '6 4' },
    ],
    outline,
    labels: [
      { x: cx, y: p.fbr.y + 20, text: `a = ${fmt(s)} ${getUnitSymbol('side')}` },
      { x: (p.bbl.x + p.ftr.x) / 2 - 15, y: (p.bbl.y + p.ftr.y) / 2 - 8, text: 'd', class: 'diagonal-label space' },
      { x: (p.ftr.x + p.bbr.x) / 2 + 12, y: (p.ftr.y + p.bbr.y) / 2, text: 'f', class: 'diagonal-label face' },
    ],
  }
}

