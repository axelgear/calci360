/**
 * Metal and Material Densities Database
 * Density values in kg/m³ (base unit)
 * 
 * Sources:
 * - Engineers Edge: Densities of Metals and Elements Table
 * - Various Solids Density Tables
 */

export interface Material {
  id: string
  name: string
  /** Density in kg/m³ */
  density: number
  /** Category for grouping */
  category: MaterialCategory
}

export type MaterialCategory = 
  | 'steel'
  | 'aluminum'
  | 'copper-alloy'
  | 'precious'
  | 'other-metal'
  | 'plastic'
  | 'wood'

export interface MaterialGroup {
  id: MaterialCategory
  name: string
  materials: Material[]
}

/* Common Steels */
const steels: Material[] = [
  { id: 'carbon-steel', name: 'Carbon Steel', density: 7860, category: 'steel' },
  { id: 'mild-steel', name: 'Mild Steel', density: 7860, category: 'steel' },
  { id: 'stainless-304', name: 'Stainless Steel 304', density: 7930, category: 'steel' },
  { id: 'stainless-316', name: 'Stainless Steel 316', density: 7990, category: 'steel' },
  { id: 'stainless-430', name: 'Stainless Steel 430', density: 7720, category: 'steel' },
  { id: 'tool-steel', name: 'Tool Steel', density: 7850, category: 'steel' },
  { id: 'spring-steel', name: 'Spring Steel', density: 7850, category: 'steel' },
  { id: 'cast-iron', name: 'Cast Iron', density: 7200, category: 'steel' },
  { id: 'wrought-iron', name: 'Wrought Iron', density: 7740, category: 'steel' },
  { id: 'galvanized-steel', name: 'Galvanized Steel', density: 7850, category: 'steel' },
]

/* Aluminum Alloys */
const aluminums: Material[] = [
  { id: 'aluminum-pure', name: 'Aluminum (Pure)', density: 2700, category: 'aluminum' },
  { id: 'aluminum-1100', name: 'Aluminum 1100', density: 2710, category: 'aluminum' },
  { id: 'aluminum-2024', name: 'Aluminum 2024-T3', density: 2780, category: 'aluminum' },
  { id: 'aluminum-5052', name: 'Aluminum 5052', density: 2680, category: 'aluminum' },
  { id: 'aluminum-6061', name: 'Aluminum 6061-T6', density: 2700, category: 'aluminum' },
  { id: 'aluminum-6063', name: 'Aluminum 6063', density: 2690, category: 'aluminum' },
  { id: 'aluminum-7050', name: 'Aluminum 7050', density: 2830, category: 'aluminum' },
  { id: 'aluminum-7075', name: 'Aluminum 7075-T6', density: 2810, category: 'aluminum' },
  { id: 'duralumin', name: 'Duralumin', density: 2780, category: 'aluminum' },
]

/* Copper and Copper Alloys */
const copperAlloys: Material[] = [
  { id: 'copper-pure', name: 'Copper (Pure)', density: 8960, category: 'copper-alloy' },
  { id: 'brass-yellow', name: 'Brass (Yellow)', density: 8470, category: 'copper-alloy' },
  { id: 'brass-red', name: 'Brass (Red)', density: 8750, category: 'copper-alloy' },
  { id: 'brass-60-40', name: 'Brass 60/40', density: 8520, category: 'copper-alloy' },
  { id: 'bronze-phosphor', name: 'Phosphor Bronze', density: 8800, category: 'copper-alloy' },
  { id: 'bronze-aluminum', name: 'Aluminum Bronze', density: 8200, category: 'copper-alloy' },
  { id: 'beryllium-copper', name: 'Beryllium Copper', density: 8250, category: 'copper-alloy' },
  { id: 'cupronickel', name: 'Cupronickel', density: 8900, category: 'copper-alloy' },
]

/* Precious and Specialty Metals */
const preciousMetals: Material[] = [
  { id: 'gold', name: 'Gold', density: 19300, category: 'precious' },
  { id: 'silver', name: 'Silver', density: 10500, category: 'precious' },
  { id: 'platinum', name: 'Platinum', density: 21450, category: 'precious' },
  { id: 'palladium', name: 'Palladium', density: 12000, category: 'precious' },
]

/* Other Metals */
const otherMetals: Material[] = [
  { id: 'titanium', name: 'Titanium', density: 4510, category: 'other-metal' },
  { id: 'titanium-6al4v', name: 'Titanium 6Al-4V', density: 4430, category: 'other-metal' },
  { id: 'nickel', name: 'Nickel', density: 8900, category: 'other-metal' },
  { id: 'inconel-625', name: 'Inconel 625', density: 8440, category: 'other-metal' },
  { id: 'monel-400', name: 'Monel 400', density: 8800, category: 'other-metal' },
  { id: 'magnesium', name: 'Magnesium', density: 1740, category: 'other-metal' },
  { id: 'zinc', name: 'Zinc', density: 7140, category: 'other-metal' },
  { id: 'lead', name: 'Lead', density: 11340, category: 'other-metal' },
  { id: 'tin', name: 'Tin', density: 7310, category: 'other-metal' },
  { id: 'tungsten', name: 'Tungsten', density: 19300, category: 'other-metal' },
  { id: 'cobalt', name: 'Cobalt', density: 8860, category: 'other-metal' },
  { id: 'chromium', name: 'Chromium', density: 7190, category: 'other-metal' },
  { id: 'manganese', name: 'Manganese', density: 7440, category: 'other-metal' },
  { id: 'molybdenum', name: 'Molybdenum', density: 10220, category: 'other-metal' },
  { id: 'hastelloy', name: 'Hastelloy', density: 8890, category: 'other-metal' },
]

/* Plastics (for comparison) */
const plastics: Material[] = [
  { id: 'abs', name: 'ABS', density: 1050, category: 'plastic' },
  { id: 'acrylic', name: 'Acrylic (PMMA)', density: 1180, category: 'plastic' },
  { id: 'nylon-6', name: 'Nylon 6', density: 1140, category: 'plastic' },
  { id: 'polycarbonate', name: 'Polycarbonate', density: 1200, category: 'plastic' },
  { id: 'hdpe', name: 'HDPE', density: 960, category: 'plastic' },
  { id: 'pvc', name: 'PVC', density: 1400, category: 'plastic' },
  { id: 'ptfe', name: 'PTFE (Teflon)', density: 2200, category: 'plastic' },
  { id: 'delrin', name: 'Delrin (POM)', density: 1410, category: 'plastic' },
]

/* Wood (approximate, seasoned) */
const woods: Material[] = [
  { id: 'oak', name: 'Oak', density: 750, category: 'wood' },
  { id: 'maple', name: 'Maple', density: 700, category: 'wood' },
  { id: 'pine', name: 'Pine', density: 510, category: 'wood' },
  { id: 'birch', name: 'Birch', density: 670, category: 'wood' },
  { id: 'walnut', name: 'Walnut', density: 660, category: 'wood' },
  { id: 'plywood', name: 'Plywood', density: 600, category: 'wood' },
  { id: 'mdf', name: 'MDF', density: 750, category: 'wood' },
]

/* All materials combined */
export const allMaterials: Material[] = [
  ...steels,
  ...aluminums,
  ...copperAlloys,
  ...preciousMetals,
  ...otherMetals,
  ...plastics,
  ...woods,
]

/* Materials grouped by category */
export const materialGroups: MaterialGroup[] = [
  { id: 'steel', name: 'Steel & Iron', materials: steels },
  { id: 'aluminum', name: 'Aluminum', materials: aluminums },
  { id: 'copper-alloy', name: 'Copper & Brass', materials: copperAlloys },
  { id: 'precious', name: 'Precious Metals', materials: preciousMetals },
  { id: 'other-metal', name: 'Other Metals', materials: otherMetals },
  { id: 'plastic', name: 'Plastics', materials: plastics },
  { id: 'wood', name: 'Wood', materials: woods },
]

/* Get material by ID */
export function getMaterial(id: string): Material | undefined {
  return allMaterials.find(m => m.id === id)
}

/* Default material */
export const defaultMaterial = 'carbon-steel'

