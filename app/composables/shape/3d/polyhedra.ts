import type { ShapeContext, Shape3DRenderData } from '../types'

const BASE_SCALE = 8

export function tetrahedron(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol, isoProject } = ctx
  const a = get('edge', 6)
  const scale = BASE_SCALE * 0.9
  const edge = a * scale

  const h = edge * Math.sqrt(2 / 3)
  const r = edge / Math.sqrt(3)

  const top: [number, number, number] = [0, h, 0]
  const v1: [number, number, number] = [0, 0, -r]
  const v2: [number, number, number] = [-r * Math.cos(Math.PI / 6), 0, r * Math.sin(Math.PI / 6)]
  const v3: [number, number, number] = [r * Math.cos(Math.PI / 6), 0, r * Math.sin(Math.PI / 6)]

  const pTop = isoProject(...top)
  const pV1 = isoProject(...v1)
  const pV2 = isoProject(...v2)
  const pV3 = isoProject(...v3)

  return {
    paths: [
      { d: `M${pTop.x},${pTop.y} L${pV2.x},${pV2.y} L${pV1.x},${pV1.y} Z`, fill: 'var(--face-dark)' },
      { d: `M${pTop.x},${pTop.y} L${pV1.x},${pV1.y} L${pV3.x},${pV3.y} Z`, fill: 'var(--face-light)' },
      { d: `M${pTop.x},${pTop.y} L${pV3.x},${pV3.y} L${pV2.x},${pV2.y} Z`, fill: 'var(--face-medium)' },
      { d: `M${pV1.x},${pV1.y} L${pV2.x},${pV2.y} L${pV3.x},${pV3.y} Z`, fill: 'var(--face-base)' },
    ],
    labels: [
      { x: (pV1.x + pV3.x) / 2 + 15, y: (pV1.y + pV3.y) / 2 + 15, text: `a = ${fmt(a)} ${getUnitSymbol('edge')}` },
    ],
  }
}

export function octahedron(ctx: ShapeContext): Shape3DRenderData {
  const { get, fmt, getUnitSymbol, isoProject } = ctx
  const a = get('edge', 5)
  const scale = BASE_SCALE * 0.7
  const edge = a * scale

  const half = edge / Math.sqrt(2)

  const top: [number, number, number] = [0, half, 0]
  const bot: [number, number, number] = [0, -half, 0]
  const front: [number, number, number] = [0, 0, -half]
  const back: [number, number, number] = [0, 0, half]
  const left: [number, number, number] = [-half, 0, 0]
  const right: [number, number, number] = [half, 0, 0]

  const pTop = isoProject(...top)
  const pBot = isoProject(...bot)
  const pFront = isoProject(...front)
  const pBack = isoProject(...back)
  const pLeft = isoProject(...left)
  const pRight = isoProject(...right)

  return {
    paths: [
      { d: `M${pTop.x},${pTop.y} L${pLeft.x},${pLeft.y} L${pFront.x},${pFront.y} Z`, fill: 'var(--face-dark)' },
      { d: `M${pTop.x},${pTop.y} L${pFront.x},${pFront.y} L${pRight.x},${pRight.y} Z`, fill: 'var(--face-light)' },
      { d: `M${pTop.x},${pTop.y} L${pRight.x},${pRight.y} L${pBack.x},${pBack.y} Z`, fill: 'var(--face-medium)' },
      { d: `M${pTop.x},${pTop.y} L${pBack.x},${pBack.y} L${pLeft.x},${pLeft.y} Z`, fill: 'var(--face-dark)' },
      { d: `M${pBot.x},${pBot.y} L${pFront.x},${pFront.y} L${pRight.x},${pRight.y} Z`, fill: 'var(--face-base)' },
      { d: `M${pBot.x},${pBot.y} L${pRight.x},${pRight.y} L${pBack.x},${pBack.y} Z`, fill: 'var(--face-medium)' },
    ],
    labels: [
      { x: pRight.x + 15, y: pRight.y, text: `a = ${fmt(a)} ${getUnitSymbol('edge')}` },
    ],
  }
}

