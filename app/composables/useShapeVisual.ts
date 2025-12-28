/**
 * useShapeVisual - Shared logic for shape visualization components
 * Provides helpers, types, and shape rendering functions for 2D, 3D, and profile shapes
 */

import type { Ref } from 'vue'
import type { UnitOption } from '~/components/Calculator/calculators/units/types'

/* ============ TYPES ============ */

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

export type ShapeMode = 'area' | 'volume' | 'profile' | 'hvac'

/* ============ CONSTANTS ============ */

/* Shared constants - All modes use the same SIZE for consistency */
export const SIZE_2D = 200
export const PADDING_2D = 30
export const INNER_2D = SIZE_2D - PADDING_2D * 2

/* Isometric projection constants */
const ISO_ANGLE = Math.PI / 6 /* 30 degrees */
const COS_30 = Math.cos(ISO_ANGLE)
const SIN_30 = Math.sin(ISO_ANGLE)
const CENTER = SIZE_2D / 2 /* 100 - center of the viewbox */

/* ============ COMPOSABLE ============ */

export function useShapeVisual(
  inputUnits: Ref<Record<string, string> | undefined>,
  lengthUnits: Ref<UnitOption[] | undefined>,
  values: Ref<Record<string, number>>
) {
  /* Get the unit symbol for a specific input */
  function getUnitSymbol(inputId: string): string {
    if (!inputUnits.value || !lengthUnits.value) return ''
    const unitId = inputUnits.value[inputId]
    if (!unitId) return ''
    const unit = lengthUnits.value.find(u => u.id === unitId)
    return unit?.symbol ?? ''
  }

  /* Format dimension values */
  function fmt(n: number, compact = false): string {
    if (compact) {
      if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
      if (n >= 100) return n.toFixed(0)
      if (n >= 10) return n.toFixed(1)
      if (n >= 1) return n.toFixed(2)
      return n.toFixed(3)
    }
    return n % 1 === 0 ? n.toString() : n.toFixed(1)
  }

  /* Safely get a value with fallback */
  function get(key: string, fallback = 1): number {
    return values.value[key] ?? fallback
  }

  /* ============ ISOMETRIC PROJECTION HELPERS ============ */

  /* Convert 3D point to isometric 2D */
  function isoProject(x: number, y: number, z: number): { x: number; y: number } {
    return {
      x: CENTER + (x - z) * COS_30,
      y: CENTER + (x + z) * SIN_30 - y,
    }
  }

  /* Generate SVG path for a face given 4 3D points */
  function facePath(
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    p4: [number, number, number]
  ): string {
    const a = isoProject(...p1)
    const b = isoProject(...p2)
    const c = isoProject(...p3)
    const d = isoProject(...p4)
    return `M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y} L${d.x},${d.y} Z`
  }

  /* Generate ellipse points for cylinder/cone tops */
  function ellipsePoints(centerY: number, rx: number, ry: number, segments = 32): string {
    const points: string[] = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * 2 * Math.PI
      const x = Math.cos(angle) * rx
      const z = Math.sin(angle) * ry
      const p = isoProject(x, centerY, z)
      points.push(i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)
    }
    return points.join(' ') + ' Z'
  }

  /* ============ FORMAT RESULT DISPLAY ============ */

  function formatResult(value: number, maxDecimals = 2): string {
    if (!Number.isFinite(value) || value <= 0) return '—'
    if (value < 0.0001) return value.toExponential(2)
    return value.toLocaleString('en-US', { maximumFractionDigits: maxDecimals })
  }

  return {
    /* Helpers */
    getUnitSymbol,
    fmt,
    get,
    formatResult,

    /* Isometric projection */
    isoProject,
    facePath,
    ellipsePoints,

    /* Constants */
    SIZE_2D,
    INNER_2D,
  }
}

export default useShapeVisual

