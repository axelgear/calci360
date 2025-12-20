import type { GeometryCalculatorConfig } from './types'

/**
 * Volume Calculator - Calculate volumes of various 3D geometric shapes
 * 
 * Helper to safely get values with defaults
 */
const get = (v: Record<string, number | undefined>, key: string, fallback = 1): number => {
  const val = v[key]
  return typeof val === 'number' ? val : fallback
}

export const volumeCalculator: GeometryCalculatorConfig = {
  type: 'geometry',
  name: 'Volume Calculator',
  description: 'Calculate the volume of 3D geometric shapes including cubes, spheres, cylinders, cones, and more with visual representations',
  category: 'Geometry',
  categoryDescription: 'Geometry calculators for shapes, areas, volumes, and spatial calculations',
  icon: 'view_in_ar',
  keywords: ['volume', 'geometry', '3d', 'cube', 'sphere', 'cylinder', 'cone', 'pyramid', 'prism'],
  resultUnit: 'units³',
  resultLabel: 'Volume',
  defaultShape: 'cube',
  shapes: [
    /* Cube */
    {
      id: 'cube',
      name: 'Cube',
      icon: 'check_box_outline_blank',
      inputs: [
        { id: 'side', label: 'Side Length', symbol: 'a', min: 0.1, default: 5 },
        { id: 'face-diagonal', label: 'Face Diagonal', symbol: 'f', min: 0.1, default: 5 * Math.SQRT2 },
        { id: 'space-diagonal', label: 'Space Diagonal', symbol: 'd', min: 0.1, default: 5 * Math.sqrt(3) },
      ],
      calculate: (v) => {
        const side =
          typeof v.side === 'number'
            ? v.side
            : typeof v['face-diagonal'] === 'number'
              ? v['face-diagonal'] / Math.SQRT2
              : typeof v['space-diagonal'] === 'number'
                ? v['space-diagonal'] / Math.sqrt(3)
                : 5
        return side * side * side
      },
      formula: 'V = a³',
      formulaExplanation: 'Volume equals side cubed',
      additionalResults: [
        {
          id: 'surface-area',
          label: 'Surface Area',
          formula: 'A = 6a²',
          unit: 'units²',
          calculate: (v) => {
            const side =
              typeof v.side === 'number'
                ? v.side
                : typeof v['face-diagonal'] === 'number'
                  ? v['face-diagonal'] / Math.SQRT2
                  : typeof v['space-diagonal'] === 'number'
                    ? v['space-diagonal'] / Math.sqrt(3)
                    : 5
            return 6 * side * side
          },
        },
      ],
    },
    
    /* Rectangular Prism (Box) */
    {
      id: 'box',
      name: 'Rectangular Box',
      icon: 'crop_square',
      inputs: [
        { id: 'length', label: 'Length', symbol: 'l', min: 0.1, default: 8 },
        { id: 'width', label: 'Width', symbol: 'w', min: 0.1, default: 5 },
        { id: 'height', label: 'Height', symbol: 'h', min: 0.1, default: 4 },
      ],
      calculate: (v) => get(v, 'length', 8) * get(v, 'width', 5) * get(v, 'height', 4),
      formula: 'V = l × w × h',
      formulaExplanation: 'Volume equals length times width times height',
    },
    
    /* Sphere */
    {
      id: 'sphere',
      name: 'Sphere',
      icon: 'circle',
      inputs: [
        { id: 'radius', label: 'Radius', symbol: 'r', min: 0.1, default: 5 },
      ],
      calculate: (v) => {
        const r = get(v, 'radius', 5)
        return (4 / 3) * Math.PI * r * r * r
      },
      formula: 'V = (4/3)πr³',
      formulaExplanation: 'Volume equals four-thirds pi times radius cubed',
    },
    
    /* Hemisphere */
    {
      id: 'hemisphere',
      name: 'Hemisphere',
      icon: 'brightness_low',
      inputs: [
        { id: 'radius', label: 'Radius', symbol: 'r', min: 0.1, default: 5 },
      ],
      calculate: (v) => {
        const r = get(v, 'radius', 5)
        return (2 / 3) * Math.PI * r * r * r
      },
      formula: 'V = (2/3)πr³',
      formulaExplanation: 'Volume equals two-thirds pi times radius cubed',
    },
    
    /* Cylinder */
    {
      id: 'cylinder',
      name: 'Cylinder',
      icon: 'lens',
      inputs: [
        { id: 'radius', label: 'Radius', symbol: 'r', min: 0.1, default: 4 },
        { id: 'height', label: 'Height', symbol: 'h', min: 0.1, default: 8 },
      ],
      calculate: (v) => {
        const r = get(v, 'radius', 4)
        const h = get(v, 'height', 8)
        return Math.PI * r * r * h
      },
      formula: 'V = πr²h',
      formulaExplanation: 'Volume equals pi times radius squared times height',
    },
    
    /* Cone */
    {
      id: 'cone',
      name: 'Cone',
      icon: 'change_history',
      inputs: [
        { id: 'radius', label: 'Base Radius', symbol: 'r', min: 0.1, default: 4 },
        { id: 'height', label: 'Height', symbol: 'h', min: 0.1, default: 9 },
      ],
      calculate: (v) => {
        const r = get(v, 'radius', 4)
        const h = get(v, 'height', 9)
        return (1 / 3) * Math.PI * r * r * h
      },
      formula: 'V = (1/3)πr²h',
      formulaExplanation: 'Volume equals one-third pi times radius squared times height',
    },
    
    /* Truncated Cone (Frustum) */
    {
      id: 'frustum',
      name: 'Truncated Cone',
      icon: 'signal_cellular_4_bar',
      inputs: [
        { id: 'r1', label: 'Top Radius', symbol: 'r₁', min: 0.1, default: 2 },
        { id: 'r2', label: 'Bottom Radius', symbol: 'r₂', min: 0.1, default: 5 },
        { id: 'height', label: 'Height', symbol: 'h', min: 0.1, default: 6 },
      ],
      calculate: (v) => {
        const r1 = get(v, 'r1', 2)
        const r2 = get(v, 'r2', 5)
        const h = get(v, 'height', 6)
        return (1 / 3) * Math.PI * h * (r1 * r1 + r1 * r2 + r2 * r2)
      },
      formula: 'V = (1/3)πh(r₁² + r₁r₂ + r₂²)',
      formulaExplanation: 'Volume of a cone with top cut off',
    },
    
    /* Square Pyramid */
    {
      id: 'pyramid-square',
      name: 'Square Pyramid',
      icon: 'details',
      inputs: [
        { id: 'base', label: 'Base Side', symbol: 'a', min: 0.1, default: 6 },
        { id: 'height', label: 'Height', symbol: 'h', min: 0.1, default: 8 },
      ],
      calculate: (v) => {
        const a = get(v, 'base', 6)
        const h = get(v, 'height', 8)
        return (1 / 3) * a * a * h
      },
      formula: 'V = (1/3)a²h',
      formulaExplanation: 'Volume equals one-third times base squared times height',
    },
    
    /* Rectangular Pyramid */
    {
      id: 'pyramid-rect',
      name: 'Rectangular Pyramid',
      icon: 'details',
      inputs: [
        { id: 'length', label: 'Base Length', symbol: 'l', min: 0.1, default: 8 },
        { id: 'width', label: 'Base Width', symbol: 'w', min: 0.1, default: 5 },
        { id: 'height', label: 'Height', symbol: 'h', min: 0.1, default: 7 },
      ],
      calculate: (v) => {
        const l = get(v, 'length', 8)
        const w = get(v, 'width', 5)
        const h = get(v, 'height', 7)
        return (1 / 3) * l * w * h
      },
      formula: 'V = (1/3)lwh',
      formulaExplanation: 'Volume equals one-third times base area times height',
    },
    
    /* Triangular Prism */
    {
      id: 'prism-triangular',
      name: 'Triangular Prism',
      icon: 'play_arrow',
      inputs: [
        { id: 'base', label: 'Triangle Base', symbol: 'b', min: 0.1, default: 6 },
        { id: 'triHeight', label: 'Triangle Height', symbol: 'h₁', min: 0.1, default: 5 },
        { id: 'length', label: 'Prism Length', symbol: 'l', min: 0.1, default: 10 },
      ],
      calculate: (v) => {
        const b = get(v, 'base', 6)
        const th = get(v, 'triHeight', 5)
        const l = get(v, 'length', 10)
        return 0.5 * b * th * l
      },
      formula: 'V = (1/2)bh₁l',
      formulaExplanation: 'Volume equals triangle area times prism length',
    },
    
    /* Ellipsoid */
    {
      id: 'ellipsoid',
      name: 'Ellipsoid',
      icon: 'brightness_1',
      inputs: [
        { id: 'a', label: 'Semi-axis a', symbol: 'a', min: 0.1, default: 6 },
        { id: 'b', label: 'Semi-axis b', symbol: 'b', min: 0.1, default: 4 },
        { id: 'c', label: 'Semi-axis c', symbol: 'c', min: 0.1, default: 3 },
      ],
      calculate: (v) => {
        const a = get(v, 'a', 6)
        const b = get(v, 'b', 4)
        const c = get(v, 'c', 3)
        return (4 / 3) * Math.PI * a * b * c
      },
      formula: 'V = (4/3)πabc',
      formulaExplanation: 'Volume equals four-thirds pi times all three semi-axes',
    },
    
    /* Torus (Donut) */
    {
      id: 'torus',
      name: 'Torus (Donut)',
      icon: 'radio_button_unchecked',
      inputs: [
        { id: 'R', label: 'Major Radius', symbol: 'R', min: 0.1, default: 8 },
        { id: 'r', label: 'Tube Radius', symbol: 'r', min: 0.1, default: 2 },
      ],
      calculate: (v) => {
        const R = get(v, 'R', 8)
        const r = get(v, 'r', 2)
        return 2 * Math.PI * Math.PI * R * r * r
      },
      formula: 'V = 2π²Rr²',
      formulaExplanation: 'Volume equals 2π² times major radius times tube radius squared',
    },
    
    /* Capsule (Cylinder with hemisphere ends) */
    {
      id: 'capsule',
      name: 'Capsule',
      icon: 'medication',
      inputs: [
        { id: 'radius', label: 'Radius', symbol: 'r', min: 0.1, default: 3 },
        { id: 'height', label: 'Cylinder Height', symbol: 'h', min: 0.1, default: 8 },
      ],
      calculate: (v) => {
        const r = get(v, 'radius', 3)
        const h = get(v, 'height', 8)
        /* Cylinder + Sphere */
        return Math.PI * r * r * h + (4 / 3) * Math.PI * r * r * r
      },
      formula: 'V = πr²h + (4/3)πr³',
      formulaExplanation: 'Volume equals cylinder plus sphere (two hemispheres)',
    },
    
    /* Regular Tetrahedron */
    {
      id: 'tetrahedron',
      name: 'Tetrahedron',
      icon: 'change_history',
      inputs: [
        { id: 'edge', label: 'Edge Length', symbol: 'a', min: 0.1, default: 6 },
      ],
      calculate: (v) => {
        const a = get(v, 'edge', 6)
        return (a * a * a * Math.sqrt(2)) / 12
      },
      formula: 'V = (a³√2)/12',
      formulaExplanation: 'Volume of regular tetrahedron with edge length a',
    },
    
    /* Regular Octahedron */
    {
      id: 'octahedron',
      name: 'Octahedron',
      icon: 'diamond',
      inputs: [
        { id: 'edge', label: 'Edge Length', symbol: 'a', min: 0.1, default: 5 },
      ],
      calculate: (v) => {
        const a = get(v, 'edge', 5)
        return (a * a * a * Math.sqrt(2)) / 3
      },
      formula: 'V = (a³√2)/3',
      formulaExplanation: 'Volume of regular octahedron with edge length a',
    },
    
    /* Spherical Cap */
    {
      id: 'spherical-cap',
      name: 'Spherical Cap',
      icon: 'brightness_medium',
      inputs: [
        { id: 'R', label: 'Sphere Radius', symbol: 'R', min: 0.1, default: 8 },
        { id: 'h', label: 'Cap Height', symbol: 'h', min: 0.1, default: 3 },
      ],
      calculate: (v) => {
        const R = get(v, 'R', 8)
        const h = get(v, 'h', 3)
        return (Math.PI * h * h * (3 * R - h)) / 3
      },
      formula: 'V = (πh²(3R-h))/3',
      formulaExplanation: 'Volume of a cap cut from a sphere',
    },
  ],
}

