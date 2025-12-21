/**
 * Shape Types - Shared type definitions for all shape renderers
 */

export interface ShapeLabel {
  x: number
  y: number
  text: string
  rotate?: number
  class?: string
}

export interface ShapeExtra {
  type: string
  attrs: Record<string, unknown>
}

export interface ShapePath {
  d: string
  fill: string
  stroke?: boolean
  noStroke?: boolean
  strokeColor?: string
  strokeWidth?: number
  strokeDasharray?: string
}

export interface ShapeRenderData {
  type: string
  attrs: Record<string, unknown>
  labels: ShapeLabel[]
  extras?: ShapeExtra[]
}

export interface Shape3DRenderData {
  paths: ShapePath[]
  labels: ShapeLabel[]
  outline?: string
}

export interface HvacRenderData {
  type: 'round' | 'rectangular'
  labels: ShapeLabel[]
}

/** Shape context with helper functions */
export interface ShapeContext {
  get: (key: string, fallback?: number) => number
  fmt: (n: number, compact?: boolean) => string
  getUnitSymbol: (inputId: string) => string
  isoProject: (x: number, y: number, z: number) => { x: number; y: number }
  facePath: (p1: [number, number, number], p2: [number, number, number], p3: [number, number, number], p4: [number, number, number]) => string
  ellipsePoints: (centerY: number, rx: number, ry: number, segments?: number) => string
  cx: number
  cy: number
}

/** Shape renderer function type */
export type Shape2DRenderer = (ctx: ShapeContext) => ShapeRenderData
export type Shape3DRenderer = (ctx: ShapeContext) => Shape3DRenderData
export type ProfileRenderer = (ctx: ShapeContext, maxSize: number) => ShapeRenderData
export type HvacRenderer = (ctx: ShapeContext) => HvacRenderData

