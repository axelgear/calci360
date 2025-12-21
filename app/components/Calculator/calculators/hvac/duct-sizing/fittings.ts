/**
 * HVAC Duct Fittings Library
 * Equivalent lengths based on ASHRAE and SMACNA standards
 */

import type { FittingType, DuctDimensions } from './types'

/* ========== EQUIVALENT LENGTH HELPERS ========== */

/** Get equivalent diameter for rectangular duct */
export function getEquivalentDiameter(width: number, height: number): number {
  /* De = 1.3 * (a*b)^0.625 / (a+b)^0.25 */
  return 1.3 * Math.pow(width * height, 0.625) / Math.pow(width + height, 0.25)
}

/** Get duct size in mm for EL calculation */
function getDuctSizeMm(duct: DuctDimensions): number {
  if (duct.shape === 'round') {
    return duct.diameter
  }
  return getEquivalentDiameter(duct.width, duct.height)
}

/* ========== ELBOWS ========== */

export const elbowFittings: FittingType[] = [
  /* Round elbows - radius throat */
  {
    id: 'elbow-90-round-smooth',
    name: '90° Round Elbow (Smooth)',
    category: 'elbow',
    icon: 'turn_right',
    equivalentLength: (duct) => {
      const d = getDuctSizeMm(duct)
      if (d <= 280) return 3.0 /* 10 EL */
      if (d <= 533) return 4.6 /* 15 EL */
      if (d <= 686) return 6.1 /* 20 EL */
      return 7.6 /* 25 EL */
    },
    description: '90° smooth radius elbow for round duct',
  },
  {
    id: 'elbow-90-round-3pc',
    name: '90° Round Elbow (3-piece)',
    category: 'elbow',
    icon: 'turn_right',
    equivalentLength: (duct) => {
      const d = getDuctSizeMm(duct)
      if (d <= 280) return 4.6
      if (d <= 533) return 6.1
      return 9.1
    },
    description: '90° 3-piece round elbow',
  },
  {
    id: 'elbow-90-round-5pc',
    name: '90° Round Elbow (5-piece)',
    category: 'elbow',
    icon: 'turn_right',
    equivalentLength: (duct) => {
      const d = getDuctSizeMm(duct)
      if (d <= 280) return 3.0
      if (d <= 533) return 4.6
      return 6.1
    },
    description: '90° 5-piece round elbow',
  },
  {
    id: 'elbow-45-round',
    name: '45° Round Elbow',
    category: 'elbow',
    icon: 'turn_slight_right',
    equivalentLength: (duct) => {
      const d = getDuctSizeMm(duct)
      if (d <= 280) return 1.5
      if (d <= 533) return 2.4
      return 3.0
    },
    description: '45° round elbow',
  },

  /* Rectangular elbows - radius throat */
  {
    id: 'elbow-90-rect-radius',
    name: '90° Rect Elbow (Radius Throat)',
    category: 'elbow',
    icon: 'turn_right',
    equivalentLength: (duct) => {
      const d = getDuctSizeMm(duct)
      /* Based on SMACNA: ranges from 10-25 EL depending on size */
      if (d <= 280) return 3.0
      if (d <= 533) return 4.6
      if (d <= 686) return 6.1
      if (d <= 838) return 7.6
      return 9.1
    },
    kFactor: 0.22,
    description: '90° rectangular elbow with radius throat',
  },
  {
    id: 'elbow-90-rect-square',
    name: '90° Rect Elbow (Square Throat)',
    category: 'elbow',
    icon: 'turn_right',
    equivalentLength: (duct) => {
      const d = getDuctSizeMm(duct)
      /* Square throat has higher loss */
      if (d <= 280) return 12.2 /* 40 EL */
      if (d <= 381) return 16.8 /* 55 EL */
      if (d <= 533) return 22.9 /* 75 EL */
      if (d <= 686) return 30.5 /* 100 EL */
      return 38.1 /* 125 EL */
    },
    kFactor: 1.3,
    description: '90° rectangular elbow with square (mitered) throat',
  },
  {
    id: 'elbow-45-rect',
    name: '45° Rect Elbow',
    category: 'elbow',
    icon: 'turn_slight_right',
    equivalentLength: 3.0, /* ~10-20 EL typical */
    description: '45° rectangular elbow',
  },
]

/* ========== TRANSITIONS / REDUCERS ========== */

export const transitionFittings: FittingType[] = [
  {
    id: 'transition-rect-rect',
    name: 'Rectangular Transition',
    category: 'transition',
    icon: 'unfold_less',
    equivalentLength: 0, /* Minimal loss if gradual */
    kFactor: 0.05,
    description: 'Gradual rectangular to rectangular transition',
  },
  {
    id: 'transition-round-rect',
    name: 'Round to Rectangular',
    category: 'transition',
    icon: 'transform',
    equivalentLength: 4.6, /* ~15 EL */
    description: 'Round to rectangular transition',
  },
  {
    id: 'transition-rect-round',
    name: 'Rectangular to Round',
    category: 'transition',
    icon: 'transform',
    equivalentLength: 4.6, /* ~15 EL */
    description: 'Rectangular to round transition',
  },
  {
    id: 'reducer-concentric',
    name: 'Concentric Reducer',
    category: 'transition',
    icon: 'unfold_less',
    equivalentLength: 0,
    kFactor: 0.04, /* For gradual */
    description: 'Gradual concentric reducer',
  },
  {
    id: 'reducer-eccentric',
    name: 'Eccentric Reducer',
    category: 'transition',
    icon: 'unfold_less',
    equivalentLength: 1.5,
    description: 'Eccentric reducer (one side flat)',
  },
]

/* ========== TAKEOFFS / BRANCHES ========== */

export const takeoffFittings: FittingType[] = [
  {
    id: 'takeoff-90-round',
    name: '90° Round Takeoff',
    category: 'takeoff',
    icon: 'call_split',
    equivalentLength: 10.7, /* ~35 EL */
    description: '90° round branch takeoff from main',
  },
  {
    id: 'takeoff-45-round',
    name: '45° Round Takeoff',
    category: 'takeoff',
    icon: 'call_split',
    equivalentLength: 6.1, /* ~20 EL */
    description: '45° round branch takeoff',
  },
  {
    id: 'takeoff-conical',
    name: 'Conical Takeoff',
    category: 'takeoff',
    icon: 'call_split',
    equivalentLength: 4.6, /* ~15 EL - lower loss */
    description: 'Conical (spin-in) takeoff - lower pressure loss',
  },
  {
    id: 'takeoff-rect',
    name: 'Rectangular Takeoff',
    category: 'takeoff',
    icon: 'call_split',
    equivalentLength: 10.7,
    description: 'Rectangular branch takeoff',
  },
  {
    id: 'wye-branch',
    name: 'Wye Branch',
    category: 'takeoff',
    icon: 'call_split',
    equivalentLength: 3.0, /* Lower loss than 90° */
    description: 'Wye (Y) branch fitting',
  },
]

/* ========== BOOTS / REGISTER BOXES ========== */

export const bootFittings: FittingType[] = [
  {
    id: 'boot-90',
    name: '90° Register Boot',
    category: 'boot',
    icon: 'exit_to_app',
    equivalentLength: 9.1, /* ~30 EL */
    description: '90° register boot for floor/ceiling registers',
  },
  {
    id: 'boot-straight',
    name: 'Straight Register Boot',
    category: 'boot',
    icon: 'exit_to_app',
    equivalentLength: 1.5, /* ~5 EL */
    description: 'Straight-through register boot',
  },
  {
    id: 'boot-end',
    name: 'End Boot',
    category: 'boot',
    icon: 'exit_to_app',
    equivalentLength: 15.2, /* ~50 EL */
    description: 'End-of-run register boot',
  },
  {
    id: 'boot-stackhead',
    name: 'Stackhead Boot',
    category: 'boot',
    icon: 'exit_to_app',
    equivalentLength: 12.2, /* ~40 EL */
    description: 'Stackhead boot for wall registers',
  },
]

/* ========== COLLARS / STARTING COLLARS ========== */

export const collarFittings: FittingType[] = [
  {
    id: 'collar-starting-offset',
    name: 'Offset Starting Collar',
    category: 'collar',
    icon: 'radio_button_checked',
    equivalentLength: 3.0, /* ~10 EL */
    description: 'Offset starting collar from plenum',
  },
  {
    id: 'collar-starting-straight',
    name: 'Straight Starting Collar',
    category: 'collar',
    icon: 'radio_button_checked',
    equivalentLength: 10.7, /* ~35 EL */
    description: 'Straight starting collar from plenum',
  },
  {
    id: 'collar-snap-round',
    name: 'Snap Collar (Round)',
    category: 'collar',
    icon: 'radio_button_checked',
    equivalentLength: 10.7, /* ~35 EL */
    description: 'Round snap collar connection',
  },
]

/* ========== DAMPERS ========== */

export const damperFittings: FittingType[] = [
  {
    id: 'damper-balancing',
    name: 'Balancing Damper',
    category: 'damper',
    icon: 'tune',
    equivalentLength: 3.0,
    kFactor: 0.2, /* When partially open */
    description: 'Manual balancing damper (open position)',
  },
  {
    id: 'damper-fire',
    name: 'Fire Damper',
    category: 'damper',
    icon: 'local_fire_department',
    equivalentLength: 6.1, /* ~20 EL */
    description: 'Fire/smoke damper (open position)',
  },
  {
    id: 'damper-backdraft',
    name: 'Backdraft Damper',
    category: 'damper',
    icon: 'swap_horiz',
    equivalentLength: 9.1, /* ~30 EL */
    description: 'Backdraft/gravity damper',
  },
]

/* ========== DIFFUSERS / GRILLES ========== */

export const diffuserFittings: FittingType[] = [
  {
    id: 'diffuser-ceiling-square',
    name: 'Ceiling Diffuser (Square)',
    category: 'diffuser',
    icon: 'grid_4x4',
    equivalentLength: 0, /* Terminal - no EL */
    kFactor: 0.5, /* Typical */
    description: 'Square ceiling diffuser',
  },
  {
    id: 'diffuser-ceiling-round',
    name: 'Ceiling Diffuser (Round)',
    category: 'diffuser',
    icon: 'trip_origin',
    equivalentLength: 0,
    kFactor: 0.4,
    description: 'Round ceiling diffuser',
  },
  {
    id: 'diffuser-linear',
    name: 'Linear Diffuser',
    category: 'diffuser',
    icon: 'view_stream',
    equivalentLength: 0,
    kFactor: 0.6,
    description: 'Linear slot diffuser',
  },
  {
    id: 'grille-supply',
    name: 'Supply Grille',
    category: 'diffuser',
    icon: 'grid_on',
    equivalentLength: 0,
    kFactor: 0.5,
    description: 'Wall/floor supply grille',
  },
  {
    id: 'grille-return',
    name: 'Return Grille',
    category: 'diffuser',
    icon: 'grid_on',
    equivalentLength: 0,
    kFactor: 0.3,
    description: 'Return air grille',
  },
]

/* ========== ALL FITTINGS ========== */

/* Segment fittings - these add equivalent length to duct segments */
/* NOTE: diffuserFittings are NOT included - they are terminal nodes with CFM, not segment fittings */
export const allFittings: FittingType[] = [
  ...elbowFittings,
  ...transitionFittings,
  ...takeoffFittings,
  ...bootFittings,
  ...collarFittings,
  ...damperFittings,
]

/** Get fitting by ID */
export function getFitting(id: string): FittingType | undefined {
  return allFittings.find(f => f.id === id)
}

/** Get fittings by category */
export function getFittingsByCategory(category: string): FittingType[] {
  return allFittings.filter(f => f.category === category)
}

/** Calculate equivalent length for a fitting */
export function calculateEquivalentLength(fitting: FittingType, ductSize: DuctDimensions): number {
  if (typeof fitting.equivalentLength === 'function') {
    return fitting.equivalentLength(ductSize)
  }
  return fitting.equivalentLength
}

