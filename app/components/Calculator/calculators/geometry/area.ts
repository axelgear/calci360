import type { GeometryCalculatorConfig } from './types'

/**
 * Area Calculator - Calculate areas of various geometric shapes
 * 
 * Helper to safely get values with defaults
 */
const get = (v: Record<string, number | undefined>, key: string, fallback = 1): number => {
  const val = v[key]
  return typeof val === 'number' ? val : fallback
}

export const areaCalculator: GeometryCalculatorConfig = {
  type: 'geometry',
  name: 'Area Calculator',
  description: 'Calculate the area of geometric shapes including triangles, rectangles, circles, and polygons with visual representations',
  category: 'Geometry',
  categoryDescription: 'Geometry calculators for shapes, areas, volumes, and spatial calculations',
  icon: 'square_foot',
  keywords: ['area', 'geometry', 'triangle', 'rectangle', 'circle', 'square', 'polygon', 'shape'],
  resultUnit: 'units²',
  resultLabel: 'Area',
  defaultShape: 'rectangle',
  shapes: [
    /* Rectangle */
    {
      id: 'rectangle',
      name: 'Rectangle',
      icon: 'rectangle',
      inputs: [
        { id: 'length', label: 'Length', symbol: 'l', min: 0.1, default: 10 },
        { id: 'width', label: 'Width', symbol: 'w', min: 0.1, default: 6 },
      ],
      calculate: (v) => get(v, 'length', 10) * get(v, 'width', 6),
      formula: 'A = l × w',
      formulaExplanation: 'Area equals length times width',
    },
    
    /* Square */
    {
      id: 'square',
      name: 'Square',
      icon: 'check_box_outline_blank',
      inputs: [
        { id: 'side', label: 'Side', symbol: 's', min: 0.1, default: 8 },
      ],
      calculate: (v) => {
        const s = get(v, 'side', 8)
        return s * s
      },
      formula: 'A = s²',
      formulaExplanation: 'Area equals side squared',
    },
    
    /* Triangle (base × height) */
    {
      id: 'triangle',
      name: 'Triangle',
      icon: 'change_history',
      inputs: [
        { id: 'base', label: 'Base', symbol: 'b', min: 0.1, default: 10 },
        { id: 'height', label: 'Height', symbol: 'h', min: 0.1, default: 8 },
      ],
      calculate: (v) => (get(v, 'base', 10) * get(v, 'height', 8)) / 2,
      formula: 'A = ½ × b × h',
      formulaExplanation: 'Area equals half of base times height',
    },
    
    /* Triangle (3 sides - Heron's formula) */
    {
      id: 'triangle-heron',
      name: 'Triangle (3 sides)',
      icon: 'change_history',
      inputs: [
        { id: 'a', label: 'Side a', symbol: 'a', min: 0.1, default: 5 },
        { id: 'b', label: 'Side b', symbol: 'b', min: 0.1, default: 6 },
        { id: 'c', label: 'Side c', symbol: 'c', min: 0.1, default: 7 },
      ],
      calculate: (v) => {
        const a = get(v, 'a', 5)
        const b = get(v, 'b', 6)
        const c = get(v, 'c', 7)
        const s = (a + b + c) / 2 /* semi-perimeter */
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))
        return isNaN(area) ? 0 : area /* Return 0 for invalid triangles */
      },
      formula: 'A = √[s(s-a)(s-b)(s-c)]',
      formulaExplanation: "Heron's formula where s = (a+b+c)/2",
    },
    
    /* Circle */
    {
      id: 'circle',
      name: 'Circle',
      icon: 'radio_button_unchecked',
      inputs: [
        { id: 'radius', label: 'Radius', symbol: 'r', min: 0.1, default: 5 },
      ],
      calculate: (v) => {
        const r = get(v, 'radius', 5)
        return Math.PI * r * r
      },
      formula: 'A = π × r²',
      formulaExplanation: 'Area equals pi times radius squared',
    },
    
    /* Ellipse */
    {
      id: 'ellipse',
      name: 'Ellipse',
      icon: 'lens',
      inputs: [
        { id: 'a', label: 'Semi-major axis', symbol: 'a', min: 0.1, default: 8 },
        { id: 'b', label: 'Semi-minor axis', symbol: 'b', min: 0.1, default: 5 },
      ],
      calculate: (v) => Math.PI * get(v, 'a', 8) * get(v, 'b', 5),
      formula: 'A = π × a × b',
      formulaExplanation: 'Area equals pi times both semi-axes',
    },
    
    /* Parallelogram */
    {
      id: 'parallelogram',
      name: 'Parallelogram',
      icon: 'crop_landscape',
      inputs: [
        { id: 'base', label: 'Base', symbol: 'b', min: 0.1, default: 10 },
        { id: 'height', label: 'Height', symbol: 'h', min: 0.1, default: 6 },
      ],
      calculate: (v) => get(v, 'base', 10) * get(v, 'height', 6),
      formula: 'A = b × h',
      formulaExplanation: 'Area equals base times perpendicular height',
    },
    
    /* Trapezoid */
    {
      id: 'trapezoid',
      name: 'Trapezoid',
      icon: 'signal_cellular_0_bar',
      inputs: [
        { id: 'a', label: 'Parallel side a', symbol: 'a', min: 0.1, default: 12 },
        { id: 'b', label: 'Parallel side b', symbol: 'b', min: 0.1, default: 8 },
        { id: 'height', label: 'Height', symbol: 'h', min: 0.1, default: 5 },
      ],
      calculate: (v) => ((get(v, 'a', 12) + get(v, 'b', 8)) / 2) * get(v, 'height', 5),
      formula: 'A = ½ × (a + b) × h',
      formulaExplanation: 'Area equals average of parallel sides times height',
    },
    
    /* Rhombus */
    {
      id: 'rhombus',
      name: 'Rhombus',
      icon: 'diamond',
      inputs: [
        { id: 'd1', label: 'Diagonal 1', symbol: 'd₁', min: 0.1, default: 10 },
        { id: 'd2', label: 'Diagonal 2', symbol: 'd₂', min: 0.1, default: 8 },
      ],
      calculate: (v) => (get(v, 'd1', 10) * get(v, 'd2', 8)) / 2,
      formula: 'A = ½ × d₁ × d₂',
      formulaExplanation: 'Area equals half the product of diagonals',
    },
    
    /* Regular Pentagon */
    {
      id: 'pentagon',
      name: 'Regular Pentagon',
      icon: 'pentagon',
      inputs: [
        { id: 'side', label: 'Side length', symbol: 's', min: 0.1, default: 6 },
      ],
      calculate: (v) => {
        const s = get(v, 'side', 6)
        return (s * s * Math.sqrt(25 + 10 * Math.sqrt(5))) / 4
      },
      formula: 'A = (s² × √(25 + 10√5)) / 4',
      formulaExplanation: 'Area of regular pentagon with side s',
    },
    
    /* Regular Hexagon */
    {
      id: 'hexagon',
      name: 'Regular Hexagon',
      icon: 'hexagon',
      inputs: [
        { id: 'side', label: 'Side length', symbol: 's', min: 0.1, default: 5 },
      ],
      calculate: (v) => {
        const s = get(v, 'side', 5)
        return (3 * Math.sqrt(3) / 2) * s * s
      },
      formula: 'A = (3√3 / 2) × s²',
      formulaExplanation: 'Area of regular hexagon with side s',
    },
    
    /* Regular Polygon (n sides) */
    {
      id: 'regular-polygon',
      name: 'Regular Polygon',
      icon: 'category',
      inputs: [
        { id: 'n', label: 'Number of sides', symbol: 'n', min: 3, max: 20, step: 1, default: 8 },
        { id: 'side', label: 'Side length', symbol: 's', min: 0.1, default: 5 },
      ],
      calculate: (v) => {
        const n = Math.floor(get(v, 'n', 8))
        const s = get(v, 'side', 5)
        return (n * s * s) / (4 * Math.tan(Math.PI / n))
      },
      formula: 'A = (n × s²) / (4 × tan(π/n))',
      formulaExplanation: 'Area of regular n-sided polygon',
    },
    
    /* Sector */
    {
      id: 'sector',
      name: 'Circle Sector',
      icon: 'pie_chart',
      inputs: [
        { id: 'radius', label: 'Radius', symbol: 'r', min: 0.1, default: 8 },
        { id: 'angle', label: 'Angle (degrees)', symbol: 'θ', min: 0.1, max: 360, default: 90 },
      ],
      calculate: (v) => {
        const r = get(v, 'radius', 8)
        const angle = get(v, 'angle', 90)
        return (angle / 360) * Math.PI * r * r
      },
      formula: 'A = (θ/360) × π × r²',
      formulaExplanation: 'Fraction of circle area based on angle',
    },
    
    /* Ring (Annulus) */
    {
      id: 'ring',
      name: 'Ring (Annulus)',
      icon: 'trip_origin',
      inputs: [
        { id: 'outer', label: 'Outer radius', symbol: 'R', min: 0.1, default: 8 },
        { id: 'inner', label: 'Inner radius', symbol: 'r', min: 0.1, default: 4 },
      ],
      calculate: (v) => {
        const R = get(v, 'outer', 8)
        const r = get(v, 'inner', 4)
        return Math.PI * (R * R - r * r)
      },
      formula: 'A = π × (R² - r²)',
      formulaExplanation: 'Area between two concentric circles',
    },
  ],
}

