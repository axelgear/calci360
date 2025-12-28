// GDT Symbols based on FreeCAD-GDT implementation
export interface GDTSymbol {
  name: string
  symbol: string
  svg?: string
  category: 'form' | 'orientation' | 'location' | 'runout'
}

export const GDTSymbols: Record<string, GDTSymbol> = {
  // Form Tolerances
  straightness: {
    name: 'Straightness',
    symbol: '⎯',
    category: 'form',
    svg: `<path d="M 10 32 L 54 32" stroke="currentColor" stroke-width="3" fill="none"/>`
  },
  flatness: {
    name: 'Flatness',
    symbol: '⏥',
    category: 'form',
    svg: `<path d="M 10 20 L 54 20 L 54 44 L 10 44 Z" stroke="currentColor" stroke-width="2" fill="none"/>`
  },
  circularity: {
    name: 'Circularity',
    symbol: '○',
    category: 'form',
    svg: `<circle cx="32" cy="32" r="20" stroke="currentColor" stroke-width="3" fill="none"/>`
  },
  cylindricity: {
    name: 'Cylindricity',
    symbol: '⌭',
    category: 'form',
    svg: `<ellipse cx="32" cy="20" rx="20" ry="8" stroke="currentColor" stroke-width="2" fill="none"/>
          <ellipse cx="32" cy="44" rx="20" ry="8" stroke="currentColor" stroke-width="2" fill="none"/>
          <line x1="12" y1="20" x2="12" y2="44" stroke="currentColor" stroke-width="2"/>
          <line x1="52" y1="20" x2="52" y2="44" stroke="currentColor" stroke-width="2"/>`
  },
  profileOfLine: {
    name: 'Profile of a Line',
    symbol: '⌒',
    category: 'form',
    svg: `<path d="M 10 40 Q 32 20 54 40" stroke="currentColor" stroke-width="3" fill="none"/>`
  },
  profileOfSurface: {
    name: 'Profile of a Surface',
    symbol: '⌓',
    category: 'form',
    svg: `<path d="M 10 35 Q 32 15 54 35" stroke="currentColor" stroke-width="3" fill="none"/>
          <path d="M 10 40 Q 32 20 54 40" stroke="currentColor" stroke-width="3" fill="none"/>`
  },
  
  // Orientation Tolerances
  perpendicularity: {
    name: 'Perpendicularity',
    symbol: '⊥',
    category: 'orientation',
    svg: `<path d="M 32 18 L 32 44 M 18 44 L 46 44" stroke="currentColor" stroke-width="3" fill="none"/>`
  },
  angularity: {
    name: 'Angularity',
    symbol: '∠',
    category: 'orientation',
    svg: `<path d="M 18 44 L 46 44 L 32 20" stroke="currentColor" stroke-width="3" fill="none"/>`
  },
  parallelism: {
    name: 'Parallelism',
    symbol: '∥',
    category: 'orientation',
    svg: `<path d="M 20 25 L 44 25 M 20 39 L 44 39" stroke="currentColor" stroke-width="3" fill="none"/>`
  },
  
  // Location Tolerances
  position: {
    name: 'Position',
    symbol: '⌖',
    category: 'location',
    svg: `<circle cx="32" cy="32" r="12" stroke="currentColor" stroke-width="3" fill="none"/>
          <line x1="32" y1="10" x2="32" y2="54" stroke="currentColor" stroke-width="2"/>
          <line x1="10" y1="32" x2="54" y2="32" stroke="currentColor" stroke-width="2"/>`
  },
  concentricity: {
    name: 'Concentricity',
    symbol: '◎',
    category: 'location',
    svg: `<circle cx="32" cy="32" r="20" stroke="currentColor" stroke-width="3" fill="none"/>
          <circle cx="32" cy="32" r="8" stroke="currentColor" stroke-width="3" fill="none"/>`
  },
  symmetry: {
    name: 'Symmetry',
    symbol: '⊜',
    category: 'location',
    svg: `<path d="M 32 10 L 32 54" stroke="currentColor" stroke-width="2" stroke-dasharray="4,2"/>
          <path d="M 20 20 L 20 44 L 26 44 L 26 20 Z" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M 38 20 L 38 44 L 44 44 L 44 20 Z" stroke="currentColor" stroke-width="2" fill="none"/>`
  },
  
  // Runout Tolerances
  circularRunout: {
    name: 'Circular Run-out',
    symbol: '↗',
    category: 'runout',
    svg: `<path d="M 20 44 L 44 20" stroke="currentColor" stroke-width="3" fill="none"/>
          <path d="M 38 20 L 44 20 L 44 26" stroke="currentColor" stroke-width="3" fill="none"/>`
  },
  totalRunout: {
    name: 'Total Run-out',
    symbol: '↗↗',
    category: 'runout',
    svg: `<path d="M 16 44 L 40 20" stroke="currentColor" stroke-width="3" fill="none"/>
          <path d="M 34 20 L 40 20 L 40 26" stroke="currentColor" stroke-width="3" fill="none"/>
          <path d="M 24 44 L 48 20" stroke="currentColor" stroke-width="3" fill="none"/>
          <path d="M 42 20 L 48 20 L 48 26" stroke="currentColor" stroke-width="3" fill="none"/>`
  }
}

// Material Condition Modifiers
export const MaterialConditions = {
  MMC: 'Ⓜ', // Maximum Material Condition
  LMC: 'Ⓛ', // Least Material Condition
  RFS: 'Ⓢ'  // Regardless of Feature Size
}

// Datum Reference Frame
export interface DatumReference {
  label: string // A, B, C, etc.
  modifier?: keyof typeof MaterialConditions
}

// Feature Control Frame
export interface FeatureControlFrame {
  characteristic: keyof typeof GDTSymbols
  tolerance: string
  materialCondition?: keyof typeof MaterialConditions
  datumReferences?: DatumReference[]
}

// Welding Symbols
export const WeldingSymbols = {
  fillet: {
    name: 'Fillet Weld',
    svg: `<path d="M 10 54 L 32 10 L 54 54" stroke="currentColor" stroke-width="2" fill="none"/>`
  },
  groove: {
    name: 'Groove Weld',
    svg: `<path d="M 10 32 L 54 32" stroke="currentColor" stroke-width="8" fill="none"/>`
  },
  plug: {
    name: 'Plug Weld',
    svg: `<rect x="20" y="20" width="24" height="24" stroke="currentColor" stroke-width="2" fill="currentColor"/>`
  },
  spot: {
    name: 'Spot Weld',
    svg: `<circle cx="32" cy="32" r="12" stroke="currentColor" stroke-width="2" fill="currentColor"/>`
  },
  seam: {
    name: 'Seam Weld',
    svg: `<ellipse cx="32" cy="32" rx="20" ry="10" stroke="currentColor" stroke-width="2" fill="none"/>`
  }
}

// Surface Texture Symbols
export const SurfaceTexture = {
  machined: {
    name: 'Machined',
    value: 'Ra',
    svg: `<path d="M 10 50 L 32 20 L 54 50" stroke="currentColor" stroke-width="2" fill="none"/>`
  },
  ground: {
    name: 'Ground',
    value: 'Rz',
    svg: `<path d="M 10 50 L 32 20 L 54 50" stroke="currentColor" stroke-width="2" fill="none"/>
          <line x1="10" y1="40" x2="54" y2="40" stroke="currentColor" stroke-width="1"/>`
  },
  rolled: {
    name: 'Rolled',
    value: 'Rt',
    svg: `<path d="M 10 50 L 32 20 L 54 50" stroke="currentColor" stroke-width="2" fill="none"/>
          <circle cx="32" cy="40" r="5" stroke="currentColor" stroke-width="1" fill="none"/>`
  }
}
