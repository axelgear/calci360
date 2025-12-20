<script setup lang="ts">
/**
 * Shape3DVisual - Isometric 3D visualization of geometric shapes using SVG
 * Renders pseudo-3D shapes with dimension labels
 */

interface UnitOption {
  id: string
  name: string
  symbol: string
  toBase: number
}

const props = withDefaults(defineProps<{
  shapeId: string
  values: Record<string, number>
  inputUnits?: Record<string, string>
  lengthUnits?: UnitOption[]
  volume: number
  volumeUnit?: string
}>(), {
  volumeUnit: 'units³',
})

/* Get the unit symbol for a specific input */
function getUnitSymbol(inputId: string): string {
  if (!props.inputUnits || !props.lengthUnits) return ''
  const unitId = props.inputUnits[inputId]
  if (!unitId) return ''
  const unit = props.lengthUnits.find(u => u.id === unitId)
  return unit?.symbol ?? ''
}

/* Helper to format dimension values */
function fmt(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(1)
}

/* Helper to safely get a value with fallback */
function get(key: string, fallback = 1): number {
  return props.values[key] ?? fallback
}

/* SVG viewBox dimensions */
const viewBox = '0 0 240 200'
const cx = 120 /* center x */
const cy = 100 /* center y */

/* Isometric projection helpers */
const ISO_ANGLE = Math.PI / 6 /* 30 degrees */
const COS_30 = Math.cos(ISO_ANGLE)
const SIN_30 = Math.sin(ISO_ANGLE)

/* Convert 3D point to isometric 2D */
function isoProject(x: number, y: number, z: number): { x: number; y: number } {
  return {
    x: cx + (x - z) * COS_30,
    y: cy + (x + z) * SIN_30 - y,
  }
}

/* Generate SVG path for a face given 4 3D points */
function facePath(p1: [number, number, number], p2: [number, number, number], p3: [number, number, number], p4: [number, number, number]): string {
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

/* Shape rendering data */
interface ShapePath {
  d: string
  fill: string
  stroke?: boolean
  noStroke?: boolean
  strokeColor?: string
  strokeWidth?: number
  strokeDasharray?: string
}

interface ShapeLabel {
  x: number
  y: number
  text: string
  class?: string
}

interface ShapeData {
  paths: ShapePath[]
  labels: ShapeLabel[]
  outline?: string /* Outer edge path for solid shapes */
}

const shapeData = computed<ShapeData>(() => {
  const baseScale = 8 /* pixels per unit */
  
  switch (props.shapeId) {
    /* ========== CUBE ========== */
    case 'cube': {
      const s = get('side', 5)
      const size = s * baseScale * 0.8
      const half = size / 2
      
      /* Project the 8 vertices of the cube */
      const p = {
        /* Front face (z = -half) */
        ftl: isoProject(-half, size, -half),
        ftr: isoProject(half, size, -half),
        fbr: isoProject(half, 0, -half),
        fbl: isoProject(-half, 0, -half),
        /* Back face (z = +half) */
        btl: isoProject(-half, size, half),
        btr: isoProject(half, size, half),
        bbr: isoProject(half, 0, half),
        bbl: isoProject(-half, 0, half),
      }
      
      /* Outer visible hexagon outline - only 6 outer vertices */
      const outline = `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.bbl.x},${p.bbl.y} L${p.bbr.x},${p.bbr.y} L${p.fbr.x},${p.fbr.y} L${p.ftr.x},${p.ftr.y} Z`
      
      /* Inner Y-edges: center point where 3 faces meet (fbl = btr in screen coords) */
      const center = p.fbl
      const innerEdges = `M${p.ftl.x},${p.ftl.y} L${center.x},${center.y} L${p.bbl.x},${p.bbl.y} M${center.x},${center.y} L${p.fbr.x},${p.fbr.y}`
      
      /* Space diagonal: from bottom-left-back to top-right-front */
      const spaceDiagonal = `M${p.bbl.x},${p.bbl.y} L${p.ftr.x},${p.ftr.y}`
      
      /* Face diagonal: across the right face (visible) */
      const faceDiagonal = `M${p.ftr.x},${p.ftr.y} L${p.bbr.x},${p.bbr.y}`

      /* Hidden edges (dashed) - back vertical and top-back edge */
      const hiddenEdges = [
        { d: `M${p.btl.x},${p.btl.y} L${p.bbr.x},${p.bbr.y}`, fill: 'none', stroke: true, strokeColor: 'rgb(var(--text-rgb) / 35%)', strokeWidth: 1.5, strokeDasharray: '6 4' },
        { d: `M${p.btl.x},${p.btl.y} L${p.fbl.x},${p.fbl.y}`, fill: 'none', stroke: true, strokeColor: 'rgb(var(--text-rgb) / 35%)', strokeWidth: 1.5, strokeDasharray: '6 4' },
      ]
      
      return {
        paths: [
          /* Top face (brightest) */
          { d: `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.btr.x},${p.btr.y} L${p.ftr.x},${p.ftr.y} Z`, fill: 'var(--cube-top)', noStroke: true },
          /* Left face (darkest) */
          { d: `M${p.ftl.x},${p.ftl.y} L${p.fbl.x},${p.fbl.y} L${p.bbl.x},${p.bbl.y} L${p.btl.x},${p.btl.y} Z`, fill: 'var(--cube-left)', noStroke: true },
          /* Right face (medium) */
          { d: `M${p.ftr.x},${p.ftr.y} L${p.fbr.x},${p.fbr.y} L${p.bbr.x},${p.bbr.y} L${p.btr.x},${p.btr.y} Z`, fill: 'var(--cube-right)', noStroke: true },
          /* Inner Y-edges */
          { d: innerEdges, fill: 'none', stroke: true },
          /* Space diagonal (d) - blue */
          { d: spaceDiagonal, fill: 'none', stroke: true, strokeColor: '#0066cc', strokeWidth: 2.5 },
          /* Face diagonal (f) - orange/red */
          { d: faceDiagonal, fill: 'none', stroke: true, strokeColor: '#cc5500', strokeWidth: 2.5 },
          /* Hidden dashed edges */
          ...hiddenEdges,
        ],
        outline,
        labels: [
          { x: cx, y: p.fbr.y + 20, text: `a = ${fmt(s)} ${getUnitSymbol('side')}` },
          /* Diagonal labels */
          { x: (p.bbl.x + p.ftr.x) / 2 - 15, y: (p.bbl.y + p.ftr.y) / 2 - 8, text: 'd', class: 'diagonal-label space' },
          { x: (p.ftr.x + p.bbr.x) / 2 + 12, y: (p.ftr.y + p.bbr.y) / 2, text: 'f', class: 'diagonal-label face' },
        ],
      }
    }
    
    /* ========== BOX (Rectangular Prism) ========== */
    case 'box': {
      const l = get('length', 8)
      const w = get('width', 5)
      const h = get('height', 4)
      const maxDim = Math.max(l, w, h)
      const scale = (baseScale * 4) / maxDim
      
      const lh = (l * scale) / 2 /* half length (x-axis) */
      const wh = (w * scale) / 2 /* half width (z-axis / depth) */
      const hh = h * scale        /* full height (y-axis) */
      
      /* Project the 8 vertices */
      const p = {
        /* Front face (z = -wh) */
        ftl: isoProject(-lh, hh, -wh),
        ftr: isoProject(lh, hh, -wh),
        fbr: isoProject(lh, 0, -wh),
        fbl: isoProject(-lh, 0, -wh),
        /* Back face (z = +wh) */
        btl: isoProject(-lh, hh, wh),
        btr: isoProject(lh, hh, wh),
        bbr: isoProject(lh, 0, wh),
        bbl: isoProject(-lh, 0, wh),
      }
      
      /* Outer visible hexagon outline - only 6 outer vertices */
      const outline = `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.bbl.x},${p.bbl.y} L${p.bbr.x},${p.bbr.y} L${p.fbr.x},${p.fbr.y} L${p.ftr.x},${p.ftr.y} Z`
      
      /* Inner Y-edges: center point where 3 faces meet */
      const center = p.fbl
      const innerEdges = `M${p.ftl.x},${p.ftl.y} L${center.x},${center.y} L${p.bbl.x},${p.bbl.y} M${center.x},${center.y} L${p.fbr.x},${p.fbr.y}`
      
      return {
        paths: [
          /* Top face (brightest) */
          { d: `M${p.ftl.x},${p.ftl.y} L${p.btl.x},${p.btl.y} L${p.btr.x},${p.btr.y} L${p.ftr.x},${p.ftr.y} Z`, fill: 'var(--cube-top)', noStroke: true },
          /* Left face (darkest) */
          { d: `M${p.ftl.x},${p.ftl.y} L${p.fbl.x},${p.fbl.y} L${p.bbl.x},${p.bbl.y} L${p.btl.x},${p.btl.y} Z`, fill: 'var(--cube-left)', noStroke: true },
          /* Right face (medium) */
          { d: `M${p.ftr.x},${p.ftr.y} L${p.fbr.x},${p.fbr.y} L${p.bbr.x},${p.bbr.y} L${p.btr.x},${p.btr.y} Z`, fill: 'var(--cube-right)', noStroke: true },
          /* Inner Y-edges */
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
    
    /* ========== SPHERE ========== */
    case 'sphere': {
      const r = get('radius', 5)
      const radius = r * baseScale * 0.9
      
      return {
        paths: [
          /* Main sphere body - gradient circle */
          { d: `M${cx - radius},${cy} A${radius},${radius} 0 1,1 ${cx + radius},${cy} A${radius},${radius} 0 1,1 ${cx - radius},${cy}`, fill: 'url(#sphereGradient)' },
          /* Equator line */
          { d: ellipsePoints(0, radius, radius * 0.3, 48), fill: 'none', stroke: true },
          /* Meridian line */
          { d: `M${cx},${cy - radius} Q${cx + radius * 0.5},${cy} ${cx},${cy + radius} Q${cx - radius * 0.5},${cy} ${cx},${cy - radius}`, fill: 'none', stroke: true },
        ],
        labels: [
          { x: cx + radius + 15, y: cy, text: `r = ${fmt(r)} ${getUnitSymbol('radius')}` },
        ],
      }
    }
    
    /* ========== HEMISPHERE ========== */
    case 'hemisphere': {
      const r = get('radius', 5)
      const radius = r * baseScale * 0.9
      const ellipseRy = radius * 0.35
      
      return {
        paths: [
          /* Dome - arc */
          { d: `M${cx - radius},${cy} A${radius},${radius} 0 0,1 ${cx + radius},${cy}`, fill: 'url(#hemisphereGradient)' },
          /* Base ellipse */
          { d: `M${cx - radius},${cy} Q${cx},${cy + ellipseRy} ${cx + radius},${cy} Q${cx},${cy - ellipseRy} ${cx - radius},${cy}`, fill: 'var(--face-medium)' },
        ],
        labels: [
          { x: cx, y: cy + ellipseRy + 20, text: `r = ${fmt(r)} ${getUnitSymbol('radius')}` },
        ],
      }
    }
    
    /* ========== CYLINDER ========== */
    case 'cylinder': {
      const r = get('radius', 4)
      const h = get('height', 8)
      const maxDim = Math.max(r * 2, h)
      const scale = (baseScale * 5) / maxDim
      
      const radius = r * scale
      const height = h * scale
      const ellipseRy = radius * 0.35
      
      /* Body path - side of cylinder */
      const bodyPath = `
        M${cx - radius},${cy}
        L${cx - radius},${cy - height}
        Q${cx},${cy - height - ellipseRy} ${cx + radius},${cy - height}
        L${cx + radius},${cy}
        Q${cx},${cy + ellipseRy} ${cx - radius},${cy}
      `
      
      /* Top ellipse */
      const topEllipse = `
        M${cx - radius},${cy - height}
        Q${cx},${cy - height + ellipseRy} ${cx + radius},${cy - height}
        Q${cx},${cy - height - ellipseRy} ${cx - radius},${cy - height}
      `
      
      return {
        paths: [
          /* Body */
          { d: bodyPath, fill: 'url(#cylinderGradient)' },
          /* Top */
          { d: topEllipse, fill: 'var(--face-light)' },
        ],
        labels: [
          { x: cx, y: cy + ellipseRy + 20, text: `r = ${fmt(r)} ${getUnitSymbol('radius')}` },
          { x: cx + radius + 15, y: cy - height / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }
    
    /* ========== CONE ========== */
    case 'cone': {
      const r = get('radius', 4)
      const h = get('height', 9)
      const maxDim = Math.max(r * 2, h)
      const scale = (baseScale * 5) / maxDim
      
      const radius = r * scale
      const height = h * scale
      const ellipseRy = radius * 0.35
      
      /* Cone body - triangle to apex */
      const conePath = `
        M${cx},${cy - height}
        L${cx - radius},${cy}
        Q${cx},${cy + ellipseRy} ${cx + radius},${cy}
        Z
      `
      
      /* Base ellipse */
      const basePath = `
        M${cx - radius},${cy}
        Q${cx},${cy + ellipseRy} ${cx + radius},${cy}
        Q${cx},${cy - ellipseRy} ${cx - radius},${cy}
      `
      
      return {
        paths: [
          { d: conePath, fill: 'url(#coneGradient)' },
          { d: basePath, fill: 'var(--face-medium)' },
        ],
        labels: [
          { x: cx, y: cy + ellipseRy + 20, text: `r = ${fmt(r)} ${getUnitSymbol('radius')}` },
          { x: cx + radius / 2 + 20, y: cy - height / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }
    
    /* ========== FRUSTUM (Truncated Cone) ========== */
    case 'frustum': {
      const r1 = get('r1', 2)
      const r2 = get('r2', 5)
      const h = get('height', 6)
      const maxDim = Math.max(r2 * 2, h)
      const scale = (baseScale * 5) / maxDim
      
      const topR = r1 * scale
      const botR = r2 * scale
      const height = h * scale
      const topRy = topR * 0.35
      const botRy = botR * 0.35
      
      const bodyPath = `
        M${cx - topR},${cy - height}
        L${cx - botR},${cy}
        Q${cx},${cy + botRy} ${cx + botR},${cy}
        L${cx + topR},${cy - height}
        Q${cx},${cy - height - topRy} ${cx - topR},${cy - height}
      `
      
      const topEllipse = `
        M${cx - topR},${cy - height}
        Q${cx},${cy - height + topRy} ${cx + topR},${cy - height}
        Q${cx},${cy - height - topRy} ${cx - topR},${cy - height}
      `
      
      return {
        paths: [
          { d: bodyPath, fill: 'url(#cylinderGradient)' },
          { d: topEllipse, fill: 'var(--face-light)' },
        ],
        labels: [
          { x: cx, y: cy - height - topRy - 10, text: `r₁ = ${fmt(r1)} ${getUnitSymbol('r1')}` },
          { x: cx, y: cy + botRy + 20, text: `r₂ = ${fmt(r2)} ${getUnitSymbol('r2')}` },
          { x: cx + botR + 15, y: cy - height / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }
    
    /* ========== SQUARE PYRAMID ========== */
    case 'pyramid-square': {
      const a = get('base', 6)
      const h = get('height', 8)
      const maxDim = Math.max(a, h)
      const scale = (baseScale * 5) / maxDim
      
      const half = (a * scale) / 2
      const height = h * scale
      
      /* Apex and base corners in 3D */
      const apex: [number, number, number] = [0, height, 0]
      const fl: [number, number, number] = [-half, 0, -half]
      const fr: [number, number, number] = [half, 0, -half]
      const br: [number, number, number] = [half, 0, half]
      const bl: [number, number, number] = [-half, 0, half]
      
      /* Project to 2D */
      const pApex = isoProject(...apex)
      const pFL = isoProject(...fl)
      const pFR = isoProject(...fr)
      const pBR = isoProject(...br)
      const pBL = isoProject(...bl)
      
      return {
        paths: [
          /* Left face */
          { d: `M${pApex.x},${pApex.y} L${pFL.x},${pFL.y} L${pBL.x},${pBL.y} Z`, fill: 'var(--face-dark)' },
          /* Right face */
          { d: `M${pApex.x},${pApex.y} L${pFR.x},${pFR.y} L${pBR.x},${pBR.y} Z`, fill: 'var(--face-medium)' },
          /* Front face */
          { d: `M${pApex.x},${pApex.y} L${pFL.x},${pFL.y} L${pFR.x},${pFR.y} Z`, fill: 'var(--face-light)' },
          /* Base */
          { d: `M${pFL.x},${pFL.y} L${pFR.x},${pFR.y} L${pBR.x},${pBR.y} L${pBL.x},${pBL.y} Z`, fill: 'var(--face-base)' },
        ],
        labels: [
          { x: (pFL.x + pFR.x) / 2, y: pFL.y + 20, text: `a = ${fmt(a)} ${getUnitSymbol('base')}` },
          { x: pApex.x + 25, y: (pApex.y + pFR.y) / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }
    
    /* ========== RECTANGULAR PYRAMID ========== */
    case 'pyramid-rect': {
      const l = get('length', 8)
      const w = get('width', 5)
      const h = get('height', 7)
      const maxDim = Math.max(l, w, h)
      const scale = (baseScale * 5) / maxDim
      
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
          { x: pBL.x - 30, y: (pFL.y + pBL.y) / 2, text: `w = ${fmt(w)} ${getUnitSymbol('width')}` },
          { x: pApex.x + 25, y: (pApex.y + pFR.y) / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }
    
    /* ========== TRIANGULAR PRISM ========== */
    case 'prism-triangular': {
      const b = get('base', 6)
      const th = get('triHeight', 5)
      const l = get('length', 10)
      const maxDim = Math.max(b, th, l)
      const scale = (baseScale * 4) / maxDim
      
      const bh = (b * scale) / 2
      const height = th * scale
      const lh = (l * scale) / 2
      
      /* Triangle vertices at front and back */
      const ftl: [number, number, number] = [0, height, -lh]
      const fbl: [number, number, number] = [-bh, 0, -lh]
      const fbr: [number, number, number] = [bh, 0, -lh]
      const btl: [number, number, number] = [0, height, lh]
      const bbl: [number, number, number] = [-bh, 0, lh]
      const bbr: [number, number, number] = [bh, 0, lh]
      
      const pFTL = isoProject(...ftl)
      const pFBL = isoProject(...fbl)
      const pFBR = isoProject(...fbr)
      const pBTL = isoProject(...btl)
      const pBBL = isoProject(...bbl)
      const pBBR = isoProject(...bbr)
      
      return {
        paths: [
          /* Left side */
          { d: `M${pFTL.x},${pFTL.y} L${pFBL.x},${pFBL.y} L${pBBL.x},${pBBL.y} L${pBTL.x},${pBTL.y} Z`, fill: 'var(--face-dark)' },
          /* Bottom */
          { d: `M${pFBL.x},${pFBL.y} L${pFBR.x},${pFBR.y} L${pBBR.x},${pBBR.y} L${pBBL.x},${pBBL.y} Z`, fill: 'var(--face-base)' },
          /* Right side */
          { d: `M${pFTL.x},${pFTL.y} L${pFBR.x},${pFBR.y} L${pBBR.x},${pBBR.y} L${pBTL.x},${pBTL.y} Z`, fill: 'var(--face-medium)' },
          /* Front triangle */
          { d: `M${pFTL.x},${pFTL.y} L${pFBL.x},${pFBL.y} L${pFBR.x},${pFBR.y} Z`, fill: 'var(--face-light)' },
        ],
        labels: [
          { x: (pFBL.x + pFBR.x) / 2, y: pFBL.y + 15, text: `b = ${fmt(b)} ${getUnitSymbol('base')}` },
          { x: pFTL.x - 25, y: (pFTL.y + pFBL.y) / 2, text: `h₁ = ${fmt(th)} ${getUnitSymbol('triHeight')}` },
          { x: (pFBR.x + pBBR.x) / 2 + 20, y: (pFBR.y + pBBR.y) / 2, text: `l = ${fmt(l)} ${getUnitSymbol('length')}` },
        ],
      }
    }
    
    /* ========== ELLIPSOID ========== */
    case 'ellipsoid': {
      const a = get('a', 6)
      const b = get('b', 4)
      const c = get('c', 3)
      const maxDim = Math.max(a, b, c)
      const scale = (baseScale * 5) / maxDim
      
      const rx = a * scale
      const ry = b * scale
      const rz = c * scale
      
      return {
        paths: [
          /* Main ellipse */
          { d: `M${cx - rx},${cy} A${rx},${rz} 0 1,1 ${cx + rx},${cy} A${rx},${rz} 0 1,1 ${cx - rx},${cy}`, fill: 'url(#sphereGradient)' },
          /* Horizontal ring */
          { d: `M${cx - rx},${cy} Q${cx},${cy + ry * 0.4} ${cx + rx},${cy} Q${cx},${cy - ry * 0.4} ${cx - rx},${cy}`, fill: 'none', stroke: true },
        ],
        labels: [
          { x: cx + rx + 10, y: cy, text: `a = ${fmt(a)} ${getUnitSymbol('a')}` },
          { x: cx, y: cy + rz + 15, text: `b = ${fmt(b)} ${getUnitSymbol('b')}` },
          { x: cx - rx - 25, y: cy - 10, text: `c = ${fmt(c)} ${getUnitSymbol('c')}` },
        ],
      }
    }
    
    /* ========== TORUS ========== */
    case 'torus': {
      const R = get('R', 8)
      const r = get('r', 2)
      const scale = baseScale * 0.8
      
      const majorR = R * scale * 0.5
      const tubeR = r * scale * 0.5
      
      /* Outer and inner ellipses for torus shape */
      const outerRx = majorR + tubeR
      const innerRx = majorR - tubeR
      const ry = tubeR * 0.7 /* perspective squash */
      
      return {
        paths: [
          /* Back half (darker) */
          { d: `M${cx - outerRx},${cy} A${outerRx},${ry * 2} 0 0,1 ${cx + outerRx},${cy}`, fill: 'var(--face-dark)' },
          /* Inner hole */
          { d: `M${cx - innerRx},${cy} A${innerRx},${ry * 1.5} 0 0,0 ${cx + innerRx},${cy}`, fill: 'var(--main-bg)' },
          /* Front half */
          { d: `M${cx - outerRx},${cy} A${outerRx},${ry * 2} 0 0,0 ${cx + outerRx},${cy} L${cx + innerRx},${cy} A${innerRx},${ry * 1.5} 0 0,1 ${cx - innerRx},${cy} Z`, fill: 'url(#torusGradient)' },
        ],
        labels: [
          { x: cx + majorR + 15, y: cy - 10, text: `R = ${fmt(R)} ${getUnitSymbol('R')}` },
          { x: cx, y: cy - tubeR - 10, text: `r = ${fmt(r)} ${getUnitSymbol('r')}` },
        ],
      }
    }
    
    /* ========== CAPSULE ========== */
    case 'capsule': {
      const r = get('radius', 3)
      const h = get('height', 8)
      const maxDim = Math.max(r * 2, h + r * 2)
      const scale = (baseScale * 5) / maxDim
      
      const radius = r * scale
      const height = h * scale
      const ellipseRy = radius * 0.35
      
      return {
        paths: [
          /* Body */
          { d: `M${cx - radius},${cy} L${cx - radius},${cy - height} A${radius},${radius} 0 0,1 ${cx + radius},${cy - height} L${cx + radius},${cy} A${radius},${radius} 0 0,1 ${cx - radius},${cy}`, fill: 'url(#cylinderGradient)' },
          /* Top cap highlight */
          { d: `M${cx - radius},${cy - height} A${radius},${radius} 0 0,1 ${cx + radius},${cy - height}`, fill: 'none', stroke: true },
        ],
        labels: [
          { x: cx, y: cy + radius * 0.5 + 15, text: `r = ${fmt(r)} ${getUnitSymbol('radius')}` },
          { x: cx + radius + 15, y: cy - height / 2, text: `h = ${fmt(h)} ${getUnitSymbol('height')}` },
        ],
      }
    }
    
    /* ========== TETRAHEDRON ========== */
    case 'tetrahedron': {
      const a = get('edge', 6)
      const scale = baseScale * 0.9
      const edge = a * scale
      
      /* Regular tetrahedron vertices */
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
    
    /* ========== OCTAHEDRON ========== */
    case 'octahedron': {
      const a = get('edge', 5)
      const scale = baseScale * 0.7
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
          /* Top faces */
          { d: `M${pTop.x},${pTop.y} L${pLeft.x},${pLeft.y} L${pFront.x},${pFront.y} Z`, fill: 'var(--face-dark)' },
          { d: `M${pTop.x},${pTop.y} L${pFront.x},${pFront.y} L${pRight.x},${pRight.y} Z`, fill: 'var(--face-light)' },
          { d: `M${pTop.x},${pTop.y} L${pRight.x},${pRight.y} L${pBack.x},${pBack.y} Z`, fill: 'var(--face-medium)' },
          { d: `M${pTop.x},${pTop.y} L${pBack.x},${pBack.y} L${pLeft.x},${pLeft.y} Z`, fill: 'var(--face-dark)' },
          /* Bottom faces */
          { d: `M${pBot.x},${pBot.y} L${pFront.x},${pFront.y} L${pRight.x},${pRight.y} Z`, fill: 'var(--face-base)' },
          { d: `M${pBot.x},${pBot.y} L${pRight.x},${pRight.y} L${pBack.x},${pBack.y} Z`, fill: 'var(--face-medium)' },
        ],
        labels: [
          { x: pRight.x + 15, y: pRight.y, text: `a = ${fmt(a)} ${getUnitSymbol('edge')}` },
        ],
      }
    }
    
    /* ========== SPHERICAL CAP ========== */
    case 'spherical-cap': {
      const R = get('R', 8)
      const h = get('h', 3)
      const scale = baseScale * 0.7
      
      const sphereR = R * scale
      const capH = h * scale
      /* Base radius of cap: r = sqrt(h(2R-h)) */
      const baseR = Math.sqrt(capH * (2 * sphereR - capH))
      const ellipseRy = baseR * 0.35
      
      /* Arc for cap dome */
      const startAngle = Math.asin(baseR / sphereR)
      
      return {
        paths: [
          /* Cap dome */
          { d: `M${cx - baseR},${cy} A${sphereR},${sphereR} 0 0,1 ${cx + baseR},${cy}`, fill: 'url(#hemisphereGradient)' },
          /* Base ellipse */
          { d: `M${cx - baseR},${cy} Q${cx},${cy + ellipseRy} ${cx + baseR},${cy} Q${cx},${cy - ellipseRy} ${cx - baseR},${cy}`, fill: 'var(--face-medium)' },
        ],
        labels: [
          { x: cx + baseR + 15, y: cy - capH / 2, text: `R = ${fmt(R)} ${getUnitSymbol('R')}` },
          { x: cx - 35, y: cy - capH / 2, text: `h = ${fmt(h)} ${getUnitSymbol('h')}` },
        ],
      }
    }
    
    /* Default fallback - cube */
    default: {
      const size = 40
      const half = size
      
      const v = {
        ftl: [-half, half, -half] as [number, number, number],
        ftr: [half, half, -half] as [number, number, number],
        fbr: [half, 0, -half] as [number, number, number],
        fbl: [-half, 0, -half] as [number, number, number],
        btl: [-half, half, half] as [number, number, number],
        btr: [half, half, half] as [number, number, number],
        bbr: [half, 0, half] as [number, number, number],
        bbl: [-half, 0, half] as [number, number, number],
      }
      
      return {
        paths: [
          { d: facePath(v.ftl, v.fbl, v.bbl, v.btl), fill: 'var(--face-dark)' },
          { d: facePath(v.ftr, v.btr, v.bbr, v.fbr), fill: 'var(--face-medium)' },
          { d: facePath(v.ftl, v.btl, v.btr, v.ftr), fill: 'var(--face-light)' },
        ],
        labels: [],
      }
    }
  }
})
</script>

<template>
  <div class="shape-3d-visual">
    <svg :viewBox="viewBox" class="shape-svg">
      <!-- Gradient Definitions -->
      <defs>
        <linearGradient id="cylinderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
          <stop offset="50%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.25" />
          <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
        </linearGradient>
        <radialGradient id="sphereGradient" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.7" />
          <stop offset="60%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.3" />
          <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
        </radialGradient>
        <linearGradient id="hemisphereGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.4" />
          <stop offset="50%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.6" />
          <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.3" />
        </linearGradient>
        <linearGradient id="coneGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.2" />
          <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
        </linearGradient>
        <linearGradient id="torusGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
          <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.3" />
        </linearGradient>
      </defs>
      
      <!-- Shape paths -->
      <path
        v-for="(path, i) in shapeData.paths"
        :key="i"
        :d="path.d"
        :fill="path.fill"
        :stroke="path.noStroke ? 'none' : (path.strokeColor ?? (path.stroke === false ? 'none' : 'var(--accent-500)'))"
        :stroke-width="path.strokeWidth ?? (path.stroke ? 1.5 : 1)"
        :stroke-dasharray="path.strokeDasharray"
        stroke-linejoin="round"
      />
      
      <!-- Outline for solid shapes -->
      <path
        v-if="shapeData.outline"
        :d="shapeData.outline"
        fill="none"
        stroke="var(--accent-500)"
        stroke-width="2"
        stroke-linejoin="round"
      />
      
      <!-- Dimension labels -->
      <g class="labels">
        <g v-for="(label, i) in shapeData.labels" :key="'label-' + i" :class="label.class">
          <rect
            v-if="!label.class?.includes('diagonal-label')"
            :x="label.x - 30"
            :y="label.y - 9"
            width="60"
            height="18"
            rx="4"
            class="label-bg"
          />
          <text
            :x="label.x"
            :y="label.y + 4"
            text-anchor="middle"
            :class="['label-text', label.class]"
          >
            {{ label.text }}
          </text>
        </g>
      </g>
    </svg>
    
    <!-- Volume Display -->
    <div class="volume-display">
      <span class="volume-value">
        {{ volume.toLocaleString('en-US', { maximumFractionDigits: 2 }) }}
      </span>
      <span class="volume-unit">{{ volumeUnit }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shape-3d-visual {
  /* Semi-transparent faces for curved shapes */
  --face-light: rgb(var(--accent-500-rgb) / 55%);
  --face-medium: rgb(var(--accent-500-rgb) / 40%);
  --face-dark: rgb(var(--accent-500-rgb) / 28%);
  --face-base: rgb(var(--accent-500-rgb) / 20%);
  
  /* Solid opaque faces for cube/box - no transparency to avoid seeing through */
  --cube-top: #2d8b9e;
  --cube-right: #1e6a7a;
  --cube-left: #154d5a;
  
  position: relative;
  width: 100%;
  height: 280px;
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 5%) 0%, transparent 100%);
  border-radius: 1rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.shape-svg {
  width: 100%;
  height: calc(100% - 50px);
  max-width: 320px;
}

.labels {
  .label-bg {
    fill: rgb(var(--accent-500-rgb) / 15%);
  }
  
  .label-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    fill: var(--text);
    
    /* Diagonal label styles */
    &.diagonal-label {
      font-size: 12px;
      font-weight: 700;
      font-style: italic;
      
      &.space {
        fill: #0066cc;
      }
      
      &.face {
        fill: #cc5500;
      }
    }
  }
}

/* Volume Display */
.volume-display {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  background: rgb(var(--accent-500-rgb) / 12%);
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  
  .volume-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent-500);
  }
  
  .volume-unit {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
    opacity: 0.8;
  }
}
</style>
