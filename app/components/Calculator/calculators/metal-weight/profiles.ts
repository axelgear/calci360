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
  {
    id: 'h-beam',
    name: 'H-Beam (Wide Flange)',
    icon: 'view_week',
    category: 'structural',
    inputs: [
      { id: 'height', label: 'Total Height', symbol: 'H', default: 0.2, min: 0.001, step: 0.001 },
      { id: 'flangeWidth', label: 'Flange Width', symbol: 'b', default: 0.2, min: 0.001, step: 0.001, helpText: 'H-beams typically have flange width ≈ height' },
      { id: 'webThickness', label: 'Web Thickness', symbol: 'tw', default: 0.009, min: 0.0001, step: 0.0001 },
      { id: 'flangeThickness', label: 'Flange Thickness', symbol: 'tf', default: 0.014, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: '(2 * flangeWidth * flangeThickness + (height - 2 * flangeThickness) * webThickness) * length',
    formulaDisplay: 'V = (2×b×tf + (H−2tf)×tw) × L',
    formulaExplanation: 'Wide flange beam with flange width approximately equal to height.',
  },
  {
    id: 'flat-bar',
    name: 'Flat Bar',
    icon: 'horizontal_rule',
    category: 'bar',
    inputs: [
      { id: 'width', label: 'Width', symbol: 'w', default: 0.05, min: 0.001, step: 0.001 },
      { id: 'thickness', label: 'Thickness', symbol: 't', default: 0.005, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: 'width * thickness * length',
    formulaDisplay: 'V = w × t × L',
    formulaExplanation: 'Volume equals width times thickness times length.',
  },
  {
    id: 't-slot',
    name: 'T-Slot Extrusion',
    icon: 'space_bar',
    category: 'structural',
    inputs: [
      { id: 'size', label: 'Profile Size', symbol: 'S', default: 0.04, min: 0.001, step: 0.001, helpText: 'Outer dimension (e.g., 40mm for 4040)' },
      { id: 'wallThickness', label: 'Wall Thickness', symbol: 't', default: 0.002, min: 0.0001, step: 0.0001 },
      { id: 'slotWidth', label: 'Slot Width', symbol: 'sw', default: 0.008, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: '(Math.pow(size, 2) - Math.pow(size - 2 * wallThickness, 2) + 4 * wallThickness * (size - 2 * wallThickness) * 0.3 - 4 * slotWidth * wallThickness * 0.5) * length',
    formulaDisplay: 'V ≈ (S² − hollow + internal ribs − slots) × L',
    formulaExplanation: 'Approximation for standard T-slot aluminum extrusion profile.',
  },
  {
    id: 'bulb-flat',
    name: 'Bulb Flat',
    icon: 'commit',
    category: 'structural',
    inputs: [
      { id: 'height', label: 'Total Height', symbol: 'h', default: 0.12, min: 0.001, step: 0.001 },
      { id: 'webThickness', label: 'Web Thickness', symbol: 'tw', default: 0.007, min: 0.0001, step: 0.0001 },
      { id: 'bulbDiameter', label: 'Bulb Diameter', symbol: 'db', default: 0.02, min: 0.001, step: 0.001, helpText: 'Diameter of the bulb at the edge' },
      lengthInput,
    ],
    volumeFormula: '((height - bulbDiameter / 2) * webThickness + Math.PI * Math.pow(bulbDiameter / 2, 2) / 2) * length',
    formulaDisplay: 'V = ((h−db/2)×tw + π×(db/2)²/2) × L',
    formulaExplanation: 'Flat web plus semicircular bulb at one edge.',
  },
  {
    id: 'rebar',
    name: 'Rebar (Reinforcing Bar)',
    icon: 'linear_scale',
    category: 'bar',
    inputs: [
      { id: 'nominalDiameter', label: 'Nominal Diameter', symbol: 'dn', default: 0.012, min: 0.001, step: 0.001, helpText: 'Nominal diameter including ribs' },
      lengthInput,
    ],
    volumeFormula: 'Math.PI * Math.pow(nominalDiameter / 2, 2) * 0.888 * length',
    formulaDisplay: 'V = π × (dn/2)² × 0.888 × L',
    formulaExplanation: 'Effective area is ~88.8% of nominal due to rib geometry.',
  },
  {
    id: 'struct-channel',
    name: 'Structural Channel (C-Channel)',
    icon: 'view_sidebar',
    category: 'structural',
    inputs: [
      { id: 'height', label: 'Height', symbol: 'h', default: 0.15, min: 0.001, step: 0.001 },
      { id: 'flangeWidth', label: 'Flange Width', symbol: 'b', default: 0.075, min: 0.001, step: 0.001 },
      { id: 'webThickness', label: 'Web Thickness', symbol: 'tw', default: 0.009, min: 0.0001, step: 0.0001 },
      { id: 'flangeThickness', label: 'Flange Thickness', symbol: 'tf', default: 0.013, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: '(2 * flangeWidth * flangeThickness + (height - 2 * flangeThickness) * webThickness) * length',
    formulaDisplay: 'V = (2×b×tf + (h−2tf)×tw) × L',
    formulaExplanation: 'American standard channel with distinct flange and web thicknesses.',
  },
  {
    id: 'lip-channel',
    name: 'Lip Channel (Lipped C)',
    icon: 'format_indent_increase',
    category: 'structural',
    inputs: [
      { id: 'height', label: 'Height', symbol: 'h', default: 0.15, min: 0.001, step: 0.001 },
      { id: 'flangeWidth', label: 'Flange Width', symbol: 'b', default: 0.065, min: 0.001, step: 0.001 },
      { id: 'thickness', label: 'Thickness', symbol: 't', default: 0.002, min: 0.0001, step: 0.0001 },
      { id: 'lipHeight', label: 'Lip Height', symbol: 'c', default: 0.02, min: 0.001, step: 0.001, helpText: 'Inward lip for added stiffness' },
      lengthInput,
    ],
    volumeFormula: '(height + 2 * flangeWidth + 2 * lipHeight) * thickness * length',
    formulaDisplay: 'V = (h + 2b + 2c) × t × L',
    formulaExplanation: 'C-channel with inward-facing lips for increased rigidity.',
  },
  {
    id: 'top-hat',
    name: 'Top Hat Section',
    icon: 'crop_din',
    category: 'structural',
    inputs: [
      { id: 'height', label: 'Height', symbol: 'h', default: 0.05, min: 0.001, step: 0.001 },
      { id: 'topWidth', label: 'Top Width', symbol: 'wt', default: 0.04, min: 0.001, step: 0.001 },
      { id: 'bottomWidth', label: 'Bottom Flange Width', symbol: 'wb', default: 0.025, min: 0.001, step: 0.001, helpText: 'Width of each bottom flange' },
      { id: 'thickness', label: 'Thickness', symbol: 't', default: 0.0015, min: 0.0001, step: 0.0001 },
      lengthInput,
    ],
    volumeFormula: '(topWidth + 2 * height + 2 * bottomWidth) * thickness * length',
    formulaDisplay: 'V = (wt + 2h + 2wb) × t × L',
    formulaExplanation: 'Hat-shaped profile: top + two sides + two bottom flanges.',
  },
  {
    id: 'sigma-section',
    name: 'Sigma Section (Σ)',
    icon: 'functions',
    category: 'structural',
    inputs: [
      { id: 'height', label: 'Height', symbol: 'h', default: 0.2, min: 0.001, step: 0.001 },
      { id: 'flangeWidth', label: 'Flange Width', symbol: 'b', default: 0.07, min: 0.001, step: 0.001 },
      { id: 'thickness', label: 'Thickness', symbol: 't', default: 0.002, min: 0.0001, step: 0.0001 },
      { id: 'foldDepth', label: 'Fold Depth', symbol: 'd', default: 0.02, min: 0.001, step: 0.001, helpText: 'Depth of the inward folds' },
      { id: 'lipHeight', label: 'Lip Height', symbol: 'c', default: 0.02, min: 0, step: 0.001 },
      lengthInput,
    ],
    volumeFormula: '(height + 2 * flangeWidth + 2 * lipHeight + 4 * foldDepth) * thickness * length',
    formulaDisplay: 'V = (h + 2b + 2c + 4d) × t × L',
    formulaExplanation: 'Sigma-shaped cold-formed purlin with edge stiffeners.',
  },
  {
    id: 'uneven-sigma',
    name: 'Uneven Sigma Section',
    icon: 'format_strikethrough',
    category: 'structural',
    inputs: [
      { id: 'height', label: 'Height', symbol: 'h', default: 0.25, min: 0.001, step: 0.001 },
      { id: 'topFlangeWidth', label: 'Top Flange Width', symbol: 'bt', default: 0.08, min: 0.001, step: 0.001 },
      { id: 'bottomFlangeWidth', label: 'Bottom Flange Width', symbol: 'bb', default: 0.06, min: 0.001, step: 0.001 },
      { id: 'thickness', label: 'Thickness', symbol: 't', default: 0.002, min: 0.0001, step: 0.0001 },
      { id: 'foldDepth', label: 'Fold Depth', symbol: 'd', default: 0.02, min: 0.001, step: 0.001 },
      { id: 'lipHeight', label: 'Lip Height', symbol: 'c', default: 0.02, min: 0, step: 0.001 },
      lengthInput,
    ],
    volumeFormula: '(height + topFlangeWidth + bottomFlangeWidth + 2 * lipHeight + 4 * foldDepth) * thickness * length',
    formulaDisplay: 'V = (h + bt + bb + 2c + 4d) × t × L',
    formulaExplanation: 'Asymmetric sigma section with different top/bottom flange widths.',
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

