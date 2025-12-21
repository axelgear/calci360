/**
 * Standard Duct Sizes Table
 * Based on Equal-Friction Method (0.10 in.wg per 100 ft)
 * Dimensions in inches, will be converted to mm when used
 */

export interface RectangularOption {
  width: number  /* inches */
  height: number /* inches */
}

export interface StandardDuctSize {
  cfm: number
  rectangular: RectangularOption[]
  roundDiameter: number /* inches */
}

/* Standard duct sizes based on ASHRAE/SMACNA guidelines */
export const standardDuctSizes: StandardDuctSize[] = [
  { cfm: 50, rectangular: [{ width: 6, height: 4 }], roundDiameter: 5 },
  { cfm: 75, rectangular: [{ width: 6, height: 4 }], roundDiameter: 6 },
  { cfm: 100, rectangular: [{ width: 8, height: 4 }, { width: 6, height: 6 }], roundDiameter: 6 },
  { cfm: 125, rectangular: [{ width: 10, height: 4 }, { width: 6, height: 6 }], roundDiameter: 7 },
  { cfm: 150, rectangular: [{ width: 10, height: 4 }, { width: 8, height: 6 }], roundDiameter: 7 },
  { cfm: 175, rectangular: [{ width: 12, height: 4 }, { width: 8, height: 6 }], roundDiameter: 8 },
  { cfm: 200, rectangular: [{ width: 14, height: 4 }, { width: 8, height: 6 }], roundDiameter: 8 },
  { cfm: 225, rectangular: [{ width: 16, height: 4 }, { width: 10, height: 6 }], roundDiameter: 8 },
  { cfm: 250, rectangular: [{ width: 16, height: 4 }, { width: 10, height: 6 }], roundDiameter: 9 },
  { cfm: 275, rectangular: [{ width: 12, height: 6 }, { width: 8, height: 8 }], roundDiameter: 9 },
  { cfm: 300, rectangular: [{ width: 12, height: 6 }, { width: 8, height: 8 }], roundDiameter: 9 },
  { cfm: 400, rectangular: [{ width: 14, height: 6 }, { width: 10, height: 8 }], roundDiameter: 10 },
  { cfm: 500, rectangular: [{ width: 18, height: 6 }, { width: 12, height: 8 }, { width: 10, height: 10 }], roundDiameter: 11 },
  { cfm: 600, rectangular: [{ width: 20, height: 6 }, { width: 14, height: 8 }, { width: 12, height: 10 }], roundDiameter: 12 },
  { cfm: 700, rectangular: [{ width: 24, height: 6 }, { width: 16, height: 8 }, { width: 12, height: 10 }], roundDiameter: 12 },
  { cfm: 800, rectangular: [{ width: 26, height: 6 }, { width: 18, height: 8 }, { width: 14, height: 10 }, { width: 12, height: 12 }], roundDiameter: 13 },
  { cfm: 900, rectangular: [{ width: 30, height: 6 }, { width: 20, height: 8 }, { width: 16, height: 10 }, { width: 12, height: 12 }], roundDiameter: 14 },
  { cfm: 1000, rectangular: [{ width: 22, height: 8 }, { width: 16, height: 10 }, { width: 14, height: 12 }], roundDiameter: 14 },
  { cfm: 1100, rectangular: [{ width: 24, height: 8 }, { width: 18, height: 10 }, { width: 16, height: 12 }], roundDiameter: 15 },
  { cfm: 1200, rectangular: [{ width: 26, height: 8 }, { width: 20, height: 10 }, { width: 16, height: 12 }], roundDiameter: 15 },
  { cfm: 1300, rectangular: [{ width: 28, height: 8 }, { width: 20, height: 10 }, { width: 18, height: 12 }], roundDiameter: 16 },
  { cfm: 1400, rectangular: [{ width: 30, height: 8 }, { width: 22, height: 10 }, { width: 18, height: 12 }], roundDiameter: 16 },
  { cfm: 1500, rectangular: [{ width: 24, height: 10 }, { width: 20, height: 12 }], roundDiameter: 16 },
  { cfm: 1600, rectangular: [{ width: 24, height: 10 }, { width: 20, height: 12 }], roundDiameter: 17 },
  { cfm: 1700, rectangular: [{ width: 26, height: 10 }, { width: 22, height: 12 }], roundDiameter: 17 },
  { cfm: 1800, rectangular: [{ width: 28, height: 10 }, { width: 22, height: 12 }], roundDiameter: 18 },
  { cfm: 1900, rectangular: [{ width: 30, height: 10 }, { width: 22, height: 12 }], roundDiameter: 18 },
  { cfm: 2000, rectangular: [{ width: 24, height: 12 }], roundDiameter: 18 },
  { cfm: 2500, rectangular: [{ width: 30, height: 12 }, { width: 24, height: 14 }], roundDiameter: 20 },
  { cfm: 3000, rectangular: [{ width: 28, height: 14 }, { width: 24, height: 16 }], roundDiameter: 22 },
  { cfm: 3500, rectangular: [{ width: 32, height: 14 }, { width: 28, height: 16 }], roundDiameter: 24 },
  { cfm: 4000, rectangular: [{ width: 36, height: 14 }, { width: 30, height: 16 }, { width: 24, height: 20 }], roundDiameter: 25 },
  { cfm: 5000, rectangular: [{ width: 36, height: 16 }, { width: 30, height: 20 }], roundDiameter: 28 },
  { cfm: 6000, rectangular: [{ width: 42, height: 16 }, { width: 36, height: 20 }], roundDiameter: 30 },
  { cfm: 7000, rectangular: [{ width: 48, height: 16 }, { width: 40, height: 20 }], roundDiameter: 32 },
  { cfm: 8000, rectangular: [{ width: 48, height: 18 }, { width: 42, height: 20 }], roundDiameter: 34 },
  { cfm: 10000, rectangular: [{ width: 48, height: 22 }, { width: 44, height: 24 }], roundDiameter: 38 },
  { cfm: 12000, rectangular: [{ width: 54, height: 22 }, { width: 48, height: 26 }], roundDiameter: 42 },
  { cfm: 15000, rectangular: [{ width: 60, height: 24 }, { width: 52, height: 28 }], roundDiameter: 46 },
  { cfm: 20000, rectangular: [{ width: 72, height: 24 }, { width: 60, height: 30 }], roundDiameter: 52 },
  { cfm: 25000, rectangular: [{ width: 72, height: 30 }, { width: 60, height: 36 }], roundDiameter: 58 },
  { cfm: 30000, rectangular: [{ width: 84, height: 30 }, { width: 72, height: 36 }], roundDiameter: 64 },
]

/**
 * Get standard duct size for given CFM
 * Uses interpolation to find the best match
 */
export function getStandardDuctSize(cfm: number, shape: 'round' | 'rectangular' = 'rectangular'): {
  cfm: number
  size: { width: number; height: number } | { diameter: number }
  sizeInMm: { width: number; height: number } | { diameter: number }
  allOptions?: { width: number; height: number }[]
} {
  /* Find the size that can handle the CFM (round up to next standard size) */
  let selectedSize = standardDuctSizes[standardDuctSizes.length - 1]!
  
  for (const size of standardDuctSizes) {
    if (size.cfm >= cfm) {
      selectedSize = size
      break
    }
  }
  
  const inchToMm = (inch: number) => Math.round(inch * 25.4)
  
  if (shape === 'round') {
    return {
      cfm: selectedSize.cfm,
      size: { diameter: selectedSize.roundDiameter },
      sizeInMm: { diameter: inchToMm(selectedSize.roundDiameter) },
    }
  } else {
    /* Select first rectangular option (typically the most common) */
    const rect = selectedSize.rectangular[0]!
    return {
      cfm: selectedSize.cfm,
      size: { width: rect.width, height: rect.height },
      sizeInMm: { width: inchToMm(rect.width), height: inchToMm(rect.height) },
      allOptions: selectedSize.rectangular,
    }
  }
}

/**
 * Get all standard duct size options for given CFM
 */
export function getAllDuctSizeOptions(cfm: number): StandardDuctSize | null {
  for (const size of standardDuctSizes) {
    if (size.cfm >= cfm) {
      return size
    }
  }
  return standardDuctSizes[standardDuctSizes.length - 1] ?? null
}

/**
 * Convert inches to mm
 */
export function inchesToMm(inches: number): number {
  return Math.round(inches * 25.4)
}

/**
 * Convert mm to inches
 */
export function mmToInches(mm: number): number {
  return mm / 25.4
}

