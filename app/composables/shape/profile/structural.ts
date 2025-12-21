import type { ShapeContext, ShapeRenderData } from '../types'

export function angleBar(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const legA = get('legA', 0.05)
  const legB = get('legB', 0.05)
  const thick = get('thickness', 0.005)
  const ratio = legA / legB
  const thickRatio = Math.min(thick / Math.min(legA, legB), 0.25)
  let a = maxSize * 0.7
  let b = a / ratio
  if (b > maxSize * 0.7) { b = maxSize * 0.7; a = b * ratio }
  const t = Math.min(a, b) * thickRatio
  const x0 = cx - a / 2
  const y0 = cy - b / 2
  return {
    type: 'path',
    attrs: { d: `M ${x0} ${y0} h ${t} v ${b - t} h ${a - t} v ${t} h ${-a} Z` },
    labels: [
      { x: cx, y: cy + b / 2 + 16, text: `${fmt(legA, true)} × ${fmt(legB, true)}` },
      { x: x0 + t + 10, y: y0 + 10, text: `t = ${fmt(thick, true)}` },
    ],
  }
}

export function channel(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const height = get('height', 0.1)
  const width = get('width', 0.05)
  const thick = get('thickness', 0.006)
  const hRatio = height / width
  const thickRatio = Math.min(thick / width, 0.2)
  let w = maxSize * 0.5
  let h = w * hRatio
  if (h > maxSize * 0.75) { h = maxSize * 0.75; w = h / hRatio }
  const t = w * thickRatio
  const x = cx - w / 2
  const y = cy - h / 2
  return {
    type: 'path',
    attrs: { d: `M ${x} ${y} h ${w} v ${t} h ${-(w - t)} v ${h - t * 2} h ${w - t} v ${t} h ${-w} Z` },
    labels: [
      { x: cx, y: cy + h / 2 + 16, text: `H = ${fmt(height, true)}` },
      { x: cx + w / 2 + 10, y: cy, text: `w = ${fmt(width, true)}` },
    ],
  }
}

export function iBeam(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const height = get('height', 0.1)
  const flangeW = get('flangeWidth', 0.05)
  const webT = get('webThickness', 0.005)
  const flangeT = get('flangeThickness', 0.008)
  const hRatio = height / flangeW
  let w = maxSize * 0.65
  let h = w * hRatio
  if (h > maxSize * 0.8) { h = maxSize * 0.8; w = h / hRatio }
  const tfRatio = Math.min(flangeT / height, 0.15)
  const twRatio = Math.min(webT / flangeW, 0.2)
  const tf = h * tfRatio
  const tw = w * twRatio
  const x = cx - w / 2
  const y = cy - h / 2
  return {
    type: 'path',
    attrs: { d: `M ${x} ${y} h ${w} v ${tf} h ${-(w - tw) / 2} v ${h - tf * 2} h ${(w - tw) / 2} v ${tf} h ${-w} v ${-tf} h ${(w - tw) / 2} v ${-(h - tf * 2)} h ${-(w - tw) / 2} Z` },
    labels: [
      { x: cx, y: cy + h / 2 + 16, text: `H = ${fmt(height, true)}` },
      { x: cx + w / 2 + 10, y: cy - h / 2 + tf / 2, text: `b = ${fmt(flangeW, true)}` },
    ],
  }
}

export function hBeam(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const height = get('height', 0.2)
  const flangeW = get('flangeWidth', 0.2)
  const webT = get('webThickness', 0.009)
  const flangeT = get('flangeThickness', 0.014)
  const hRatio = height / flangeW
  let w = maxSize * 0.7
  let h = w * hRatio
  if (h > maxSize * 0.75) { h = maxSize * 0.75; w = h / hRatio }
  const tfRatio = Math.min(flangeT / height, 0.12)
  const twRatio = Math.min(webT / flangeW, 0.15)
  const tf = h * tfRatio
  const tw = w * twRatio
  const x = cx - w / 2
  const y = cy - h / 2
  return {
    type: 'path',
    attrs: { d: `M ${x} ${y} h ${w} v ${tf} h ${-(w - tw) / 2} v ${h - tf * 2} h ${(w - tw) / 2} v ${tf} h ${-w} v ${-tf} h ${(w - tw) / 2} v ${-(h - tf * 2)} h ${-(w - tw) / 2} Z` },
    labels: [
      { x: cx, y: cy + h / 2 + 16, text: `H = ${fmt(height, true)}` },
      { x: cx + w / 2 + 10, y: cy, text: `b = ${fmt(flangeW, true)}` },
    ],
  }
}

export function tBar(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const flangeW = get('flangeWidth', 0.05)
  const totalH = get('totalHeight', 0.05)
  const flangeT = get('flangeThickness', 0.005)
  const webT = get('webThickness', 0.005)
  const hRatio = totalH / flangeW
  let w = maxSize * 0.65
  let h = w * hRatio
  if (h > maxSize * 0.7) { h = maxSize * 0.7; w = h / hRatio }
  const tfRatio = Math.min(flangeT / totalH, 0.25)
  const twRatio = Math.min(webT / flangeW, 0.25)
  const tf = h * tfRatio
  const tw = w * twRatio
  const x = cx - w / 2
  const y = cy - h / 2
  return {
    type: 'path',
    attrs: { d: `M ${x} ${y} h ${w} v ${tf} h ${-(w - tw) / 2} v ${h - tf} h ${-tw} v ${-(h - tf)} h ${-(w - tw) / 2} Z` },
    labels: [
      { x: cx, y: cy + h / 2 + 16, text: `${fmt(flangeW, true)} × ${fmt(totalH, true)}` },
    ],
  }
}

export function structChannel(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const height = get('height', 0.15)
  const flangeW = get('flangeWidth', 0.075)
  const webT = get('webThickness', 0.009)
  const flangeT = get('flangeThickness', 0.013)
  const hRatio = height / flangeW
  let b = maxSize * 0.45
  let h = b * hRatio
  if (h > maxSize * 0.75) { h = maxSize * 0.75; b = h / hRatio }
  const tfRatio = Math.min(flangeT / height, 0.12)
  const twRatio = Math.min(webT / flangeW, 0.2)
  const tf = h * tfRatio
  const tw = b * twRatio
  const x = cx - b / 2
  const y = cy - h / 2
  return {
    type: 'path',
    attrs: { d: `M ${x} ${y} h ${b} v ${tf} h ${-(b - tw)} v ${h - tf * 2} h ${b - tw} v ${tf} h ${-b} Z` },
    labels: [
      { x: cx, y: cy + h / 2 + 16, text: `H = ${fmt(height, true)}` },
      { x: cx + b / 2 + 10, y: cy - h / 2 + tf / 2, text: `b = ${fmt(flangeW, true)}` },
    ],
  }
}

export function lipChannel(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const height = get('height', 0.15)
  const flangeW = get('flangeWidth', 0.065)
  const thick = get('thickness', 0.002)
  const lipH = get('lipHeight', 0.02)
  const hRatio = height / flangeW
  let b = maxSize * 0.45
  let h = b * hRatio
  if (h > maxSize * 0.7) { h = maxSize * 0.7; b = h / hRatio }
  const t = Math.max(b * 0.06, 2)
  const lip = h * (lipH / height)
  const x = cx - b / 2
  const y = cy - h / 2
  return {
    type: 'path',
    attrs: {
      d: `M ${x} ${y} h ${b} v ${lip} h ${-t} v ${-lip + t} h ${-(b - t * 2)} v ${h - t * 2} h ${b - t * 2} v ${-lip + t} h ${t} v ${lip} h ${-b} Z`,
    },
    labels: [
      { x: cx, y: cy + h / 2 + 16, text: `H = ${fmt(height, true)}` },
      { x: cx + b / 2 + 10, y: cy, text: `c = ${fmt(lipH, true)}` },
    ],
  }
}

export function topHat(ctx: ShapeContext, maxSize: number): ShapeRenderData {
  const { get, fmt, cx, cy } = ctx
  const height = get('height', 0.05)
  const topW = get('topWidth', 0.04)
  const bottomW = get('bottomWidth', 0.025)
  const thick = get('thickness', 0.0015)
  const totalW = topW + 2 * bottomW
  const hRatio = height / totalW
  let w = maxSize * 0.75
  let h = Math.min(w * hRatio, maxSize * 0.4)
  const topRatio = topW / totalW
  const bottomRatio = bottomW / totalW
  const tw = w * topRatio
  const bw = w * bottomRatio
  const t = Math.max(w * 0.04, 2)
  const x = cx - w / 2
  const y = cy - h / 2
  return {
    type: 'path',
    attrs: {
      d: `
        M ${x} ${y + h} h ${bw} v ${-h} h ${tw} v ${h} h ${bw} v ${-t}
        h ${-(bw - t)} v ${-(h - t)} h ${-(tw + t * 2)} v ${h - t} h ${-(bw - t)} Z
      `,
    },
    labels: [
      { x: cx, y: cy + h / 2 + 16, text: `wt = ${fmt(topW, true)}` },
      { x: cx - w / 2 - 10, y: cy, text: `h = ${fmt(height, true)}`, rotate: -90 },
    ],
  }
}

