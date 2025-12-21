import type { ShapeContext, Shape3DRenderData } from '../types'

const BASE_SCALE = 8

export function prismTriangular(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol, isoProject, facePath } = ctx
  const base = get('base', 4)
  const h = get('height', 6)
  const l = get('length', 8)
  const maxDim = Math.max(base, h, l)
  const scale = (BASE_SCALE * 4) / maxDim

  const bh = (base * scale) / 2
  const hh = h * scale
  const lh = (l * scale) / 2

  /* Triangle vertices at z = -lh (front) and z = lh (back) */
  const fbl: [number, number, number] = [-bh, 0, -lh]
  const fbr: [number, number, number] = [bh, 0, -lh]
  const ft: [number, number, number] = [0, hh, -lh]
  const bbl: [number, number, number] = [-bh, 0, lh]
  const bbr: [number, number, number] = [bh, 0, lh]
  const bt: [number, number, number] = [0, hh, lh]

  return {
    paths: [
      { d: facePath(ft, fbl, bbl, bt), fill: 'var(--face-dark)' },
      { d: facePath(ft, bt, bbr, fbr), fill: 'var(--face-medium)' },
      { d: facePath(ft, fbl, fbr, ft), fill: 'var(--face-light)' },
      { d: facePath(bt, bbl, bbr, bt), fill: 'var(--face-base)' },
      { d: facePath(fbl, fbr, bbr, bbl), fill: 'var(--face-base)' },
    ],
    labels: [
      { x: isoProject(...fbl).x - 10, y: isoProject(...fbl).y + 15, text: `b = ${fmt(base)}` },
      { x: isoProject(...ft).x + 20, y: (isoProject(...ft).y + isoProject(...fbr).y) / 2, text: `h = ${fmt(h)}` },
      { x: (isoProject(...ft).x + isoProject(...bt).x) / 2, y: isoProject(...ft).y - 10, text: `l = ${fmt(l)} ${getUnitSymbol('length')}` },
    ],
  }
}

export function prismHexagonal(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol, isoProject } = ctx
  const a = get('apothem', 4)
  const h = get('height', 8)
  const maxDim = Math.max(a * 2, h)
  const scale = (BASE_SCALE * 4) / maxDim

  const apothem = a * scale
  const height = h * scale
  const side = apothem / Math.cos(Math.PI / 6)

  /* Generate hexagon vertices */
  const hexPoints = (y: number) => {
    const pts: [number, number, number][] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 6) + (i * Math.PI / 3)
      pts.push([side * Math.cos(angle), y, side * Math.sin(angle)])
    }
    return pts
  }

  const bottomHex = hexPoints(0)
  const topHex = hexPoints(height)

  /* Project points */
  const pBottom = bottomHex.map(p => isoProject(...p))
  const pTop = topHex.map(p => isoProject(...p))

  /* Create path for top face */
  const topPath = pTop.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ') + ' Z'

  /* Create visible side faces (0, 1, 2 are typically visible in isometric) */
  const sidePaths = [0, 1, 2].map(i => {
    const next = (i + 1) % 6
    return `M${pTop[i].x},${pTop[i].y} L${pBottom[i].x},${pBottom[i].y} L${pBottom[next].x},${pBottom[next].y} L${pTop[next].x},${pTop[next].y} Z`
  })

  return {
    paths: [
      { d: sidePaths[0], fill: 'var(--face-dark)' },
      { d: sidePaths[1], fill: 'var(--face-medium)' },
      { d: sidePaths[2], fill: 'var(--face-light)' },
      { d: topPath, fill: 'var(--face-light)' },
    ],
    labels: [
      { x: pBottom[1].x + 15, y: (pTop[1].y + pBottom[1].y) / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
      { x: pTop[0].x - 25, y: pTop[0].y - 5, text: `a = ${fmt(a)}` },
    ],
  }
}

