/**
 * Metal Profile Shapes Definition
 * Each profile has inputs for dimensions and a volume formula
 */

export interface ProfileInput {
  id: string
  label: string
  symbol: string
  default: number
  min?: number
  max?: number
  step?: number
  helpText?: string
}

export interface ProfileDefinition {
  id: string
  name: string
  icon: string
  /** Profile category for grouping */
  category: ProfileCategory
  /** Input dimensions required */
  inputs: ProfileInput[]
  /** Volume formula (result in m³ when inputs are in meters) */
  volumeFormula: string
  /** Human-readable formula */
  formulaDisplay: string
  /** Optional explanation */
  formulaExplanation?: string
}

export type ProfileCategory = 'bar' | 'sheet' | 'tube' | 'structural'

/* Common length input used by all profiles */
const lengthInput: ProfileInput = {
  id: 'length',
  label: 'Length',
  symbol: 'L',
  default: 1,
  min: 0.001,
  step: 0.01,
  helpText: 'Total length of the piece',
}

/* Profile definitions */
export const metalProfiles: ProfileDefinition[] = [
  /* === Bar Profiles === */
  {
    id: 'round-bar',
    name: 'Round Bar',
    icon: 'radio_button_unchecked',
    category: 'bar',
    inputs: [
      { id: 'diameter', label: 'Diameter', symbol: 'd', default: 0.02, min: 0.001, step: 0.001 },
      lengthInput,
    ],
    volumeFormula: 'Math.PI * Math.pow(diameter / 2, 2) * length',
    formulaDisplay: 'V = π × (d/2)² × L',
    formulaExplanation: 'Volume equals π times the radius squared times length.',
  },
  {
    id: 'square-bar',
    name: 'Square Bar',
    icon: 'crop_square',
    category: 'bar',
    inputs: [
      { id: 'side', label: 'Side', symbol: 'a', default: 0.02, min: 0.001, step: 0.001 },
      lengthInput,
    ],
    volumeFormula: 'Math.pow(side, 2) * length',
    formulaDisplay: 'V = a² × L',
    formulaExplanation: 'Volume equals side squared times length.',
  },
  {
    id: 'rectangular-bar',
    name: 'Rectangular Bar',
    icon: 'rectangle',
    category: 'bar',
    inputs: [
      { id: 'width', label: 'Width', symbol: 'w', default: 0.03, min: 0.001, step: 0.001 },
      { id: 'height', label: 'Height', symbol: 'h', default: 0.02, min: 0.001, step: 0.001 },
      lengthInput,
    ],
    volumeFormula: 'width * height * length',
    formulaDisplay: 'V = w × h × L',
    formulaExplanation: 'Volume equals width times height times length.',
  },
  {
    id: 'hexagonal-bar',
    name: 'Hexagonal Bar',
    icon: 'hexagon',
    category: 'bar',
    inputs: [
      { id: 'flatToFlat', label: 'Flat-to-Flat', symbol: 'f', default: 0.02, min: 0.001, step: 0.001, helpText: 'Distance between parallel flats' },
      lengthInput,
    ],
    volumeFormula: '(3 * Math.sqrt(3) / 2) * Math.pow(flatToFlat / Math.sqrt(3), 2) * length',
    formulaDisplay: 'V = (3√3/2) × s² × L',
    formulaExplanation: 'Where s = f/√3 (side length from flat-to-flat distance).',
  },

  /* === Sheet / Plate === */
  {
    id: 'sheet',
    name: 'Sheet / Plate',
    icon: 'web_asset',
    category: 'sheet',
    inputs: [
      lengthInput,
      { id: 'width', label: 'Width', symbol: 'w', default: 0.5, min: 0.001, step: 0.01 },
      { id: 'thickness', label: 'Thickness', symbol: 't', default: 0.002, min: 0.0001, step: 0.0001 },
    ],
    volumeFormula: 'length * width * thickness',
    formulaDisplay: 'V = L × w × t',
    formulaExplanation: 'Volume equals length times width times thickness.',
  },

  /* === Tubes / Pipes === */
  {
    id: 'round-tube',
    name: 'Round Tube',
    icon: 'trip_origin',
    category: 'tube',
    inputs: [
      { id: 'outerDiameter', label: 'Outer Diameter', symbol: 'OD', default: 0.05, min: 0.001, step: 0.001 },
      { id: 'wallThickness', label: 'Wall Thickness', symbol: 't', default: 0.003, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: 'Math.PI * (Math.pow(outerDiameter / 2, 2) - Math.pow((outerDiameter - 2 * wallThickness) / 2, 2)) * length',
    formulaDisplay: 'V = π × (OD²/4 − ID²/4) × L',
    formulaExplanation: 'Where ID = OD - 2t (inner diameter).',
  },
  {
    id: 'square-tube',
    name: 'Square Tube',
    icon: 'check_box_outline_blank',
    category: 'tube',
    inputs: [
      { id: 'outerSide', label: 'Outer Side', symbol: 'a', default: 0.05, min: 0.001, step: 0.001 },
      { id: 'wallThickness', label: 'Wall Thickness', symbol: 't', default: 0.003, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: '(Math.pow(outerSide, 2) - Math.pow(outerSide - 2 * wallThickness, 2)) * length',
    formulaDisplay: 'V = (a² − (a−2t)²) × L',
    formulaExplanation: 'Outer area minus inner area times length.',
  },
  {
    id: 'rectangular-tube',
    name: 'Rectangular Tube',
    icon: 'crop_landscape',
    category: 'tube',
    inputs: [
      { id: 'outerWidth', label: 'Outer Width', symbol: 'W', default: 0.06, min: 0.001, step: 0.001 },
      { id: 'outerHeight', label: 'Outer Height', symbol: 'H', default: 0.04, min: 0.001, step: 0.001 },
      { id: 'wallThickness', label: 'Wall Thickness', symbol: 't', default: 0.003, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: '(outerWidth * outerHeight - (outerWidth - 2 * wallThickness) * (outerHeight - 2 * wallThickness)) * length',
    formulaDisplay: 'V = (W×H − (W−2t)×(H−2t)) × L',
    formulaExplanation: 'Outer area minus inner area times length.',
  },

  /* === Structural Profiles === */
  {
    id: 'angle-bar',
    name: 'Angle Bar (L-Profile)',
    icon: 'turn_right',
    category: 'structural',
    inputs: [
      { id: 'legA', label: 'Leg A', symbol: 'a', default: 0.05, min: 0.001, step: 0.001 },
      { id: 'legB', label: 'Leg B', symbol: 'b', default: 0.05, min: 0.001, step: 0.001 },
      { id: 'thickness', label: 'Thickness', symbol: 't', default: 0.005, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: '(legA + legB - thickness) * thickness * length',
    formulaDisplay: 'V = (a + b − t) × t × L',
    formulaExplanation: 'Approximation for equal/unequal angle profiles.',
  },
  {
    id: 'channel',
    name: 'Channel (U-Profile)',
    icon: 'signal_cellular_4_bar',
    category: 'structural',
    inputs: [
      { id: 'height', label: 'Height', symbol: 'h', default: 0.1, min: 0.001, step: 0.001 },
      { id: 'width', label: 'Flange Width', symbol: 'w', default: 0.05, min: 0.001, step: 0.001 },
      { id: 'thickness', label: 'Thickness', symbol: 't', default: 0.006, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: '(height + 2 * (width - thickness)) * thickness * length',
    formulaDisplay: 'V = (h + 2×(w−t)) × t × L',
    formulaExplanation: 'Web plus two flanges, accounting for overlap.',
  },
  {
    id: 'i-beam',
    name: 'I-Beam / H-Beam',
    icon: 'view_column',
    category: 'structural',
    inputs: [
      { id: 'height', label: 'Total Height', symbol: 'H', default: 0.1, min: 0.001, step: 0.001 },
      { id: 'flangeWidth', label: 'Flange Width', symbol: 'b', default: 0.05, min: 0.001, step: 0.001 },
      { id: 'webThickness', label: 'Web Thickness', symbol: 'tw', default: 0.005, min: 0.0001, step: 0.0001 },
      { id: 'flangeThickness', label: 'Flange Thickness', symbol: 'tf', default: 0.008, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: '(2 * flangeWidth * flangeThickness + (height - 2 * flangeThickness) * webThickness) * length',
    formulaDisplay: 'V = (2×b×tf + (H−2tf)×tw) × L',
    formulaExplanation: 'Two flanges plus web.',
  },
  {
    id: 't-bar',
    name: 'T-Bar',
    icon: 'vertical_align_top',
    category: 'structural',
    inputs: [
      { id: 'flangeWidth', label: 'Flange Width', symbol: 'b', default: 0.05, min: 0.001, step: 0.001 },
      { id: 'totalHeight', label: 'Total Height', symbol: 'H', default: 0.05, min: 0.001, step: 0.001 },
      { id: 'flangeThickness', label: 'Flange Thickness', symbol: 'tf', default: 0.005, min: 0.0001, step: 0.0001 },
      { id: 'webThickness', label: 'Web Thickness', symbol: 'tw', default: 0.005, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: '(flangeWidth * flangeThickness + (totalHeight - flangeThickness) * webThickness) * length',
    formulaDisplay: 'V = (b×tf + (H−tf)×tw) × L',
    formulaExplanation: 'Flange area plus web area times length.',
  },
]

/* Get profile by ID */
export function getProfile(id: string): ProfileDefinition | undefined {
  return metalProfiles.find(p => p.id === id)
}

/* Get profiles by category */
export function getProfilesByCategory(category: ProfileCategory): ProfileDefinition[] {
  return metalProfiles.filter(p => p.category === category)
}

/* Default profile */
export const defaultProfile = 'round-bar'

/* Profile categories with labels */
export const profileCategories: { id: ProfileCategory; name: string }[] = [
  { id: 'bar', name: 'Bars' },
  { id: 'sheet', name: 'Sheets & Plates' },
  { id: 'tube', name: 'Tubes & Pipes' },
  { id: 'structural', name: 'Structural' },
]

