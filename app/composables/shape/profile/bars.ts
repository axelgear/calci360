import type { ShapeContext, ShapeRenderData, ShapeLabel } from '../types'

export function roundBar(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
  const diameter = get('diameter', 0.02)
  const r = maxSize * 0.45
  return {
    type: 'circle',
    attrs: { cx, cy, r },
    labels: [{ x: cx, y: cy + r + 16, text: `⌀ ${fmt(diameter, true)} ${getUnitSymbol('diameter')}` }],
  }
}

export function squareBar(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
  const side = get('side', 0.02)
  const s = maxSize * 0.7
  return {
    type: 'rect',
    attrs: { x: cx - s / 2, y: cy - s / 2, width: s, height: s },
    labels: [{ x: cx, y: cy + s / 2 + 16, text: `a = ${fmt(side, true)} ${getUnitSymbol('side')}` }],
  }
}

export function rectangularBar(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
  const width = get('width', 0.03)
  const height = get('height', 0.02)
  const ratio = width / height
  let w = maxSize * 0.8
  let h = w / ratio
  if (h > maxSize * 0.7) { h = maxSize * 0.7; w = h * ratio }
  return {
    type: 'rect',
    attrs: { x: cx - w / 2, y: cy - h / 2, width: w, height: h },
    labels: [
      { x: cx, y: cy + h / 2 + 16, text: `w = ${fmt(width, true)} ${getUnitSymbol('width')}` },
      { x: cx - w / 2 - 10, y: cy, text: `h = ${fmt(height, true)}`, rotate: -90 },
    ],
  }
}

export function hexagonalBar(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
  const flatToFlat = get('flatToFlat', 0.02)
  const r = maxSize * 0.4
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')
  return {
    type: 'polygon',
    attrs: { points },
    labels: [{ x: cx, y: cy + r + 16, text: `f = ${fmt(flatToFlat, true)} ${getUnitSymbol('flatToFlat')}` }],
  }
}

export function flatBar(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
  const width = get('width', 0.05)
  const thickness = get('thickness', 0.005)
  const ratio = width / thickness
  let w = maxSize * 0.85
  let h = Math.max(w / ratio, maxSize * 0.1)
  if (h > maxSize * 0.3) { h = maxSize * 0.3; w = h * ratio }
  return {
    type: 'rect',
    attrs: { x: cx - w / 2, y: cy - h / 2, width: w, height: h },
    labels: [
      { x: cx, y: cy + h / 2 + 16, text: `w = ${fmt(width, true)} ${getUnitSymbol('width')}` },
      { x: cx, y: cy - h / 2 - 8, text: `t = ${fmt(thickness, true)}` },
    ],
  }
}

export function rebar(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
  const nomD = get('nominalDiameter', 0.012)
  const r = maxSize * 0.35
  const ribCount = 8
  const ribLines: string[] = []
  for (let i = 0; i < ribCount; i++) {
    const angle = (Math.PI * 2 * i) / ribCount
    const x1 = cx + r * 0.85 * Math.cos(angle)
    const y1 = cy + r * 0.85 * Math.sin(angle)
    const x2 = cx + r * 1.08 * Math.cos(angle)
    const y2 = cy + r * 1.08 * Math.sin(angle)
    ribLines.push(`M ${x1} ${y1} L ${x2} ${y2}`)
  }
  return {
    type: 'path',
    attrs: {
      d: `M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} ${ribLines.join(' ')}`,
    },
    labels: [{ x: cx, y: cy + r + 20, text: `⌀n = ${fmt(nomD, true)} ${getUnitSymbol('nominalDiameter')}` }],
  }
}

export function sheet(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, getUnitSymbol, cx, cy } = ctx
  const length = get('length', 1)
  const width = get('width', 0.5)
  const thickness = get('thickness', 0.002)
  const ratio = Math.min(Math.max(width / length, 0.3), 1)
  const w = maxSize * 0.9
  const h = Math.max(maxSize * 0.08, maxSize * 0.2 * ratio)
  return {
    type: 'rect',
    attrs: { x: cx - w / 2, y: cy - h / 2, width: w, height: h },
    labels: [
      { x: cx, y: cy - h / 2 - 12, text: `t = ${fmt(thickness, true)} ${getUnitSymbol('thickness')}` },
      { x: cx, y: cy + h / 2 + 16, text: `${fmt(length, true)} × ${fmt(width, true)} ${getUnitSymbol('length')}` },
    ],
  }
}

