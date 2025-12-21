/**
 * Metal and Material Densities Database
 * Density values in kg/m³ (base unit)
 * 
 * Sources:
 * - Engineers Edge: Densities of Metals and Elements Table
 * - Various Solids Density Tables
 * - ASM Handbook: Properties and Selection
 */

/** Mechanical properties for stress-strain analysis */
export interface MechanicalProperties {
  /** Young's Modulus (Modulus of Elasticity) in GPa */
  youngsModulus: number
  /** Yield Strength (σy) in MPa */
  yieldStrength: number
  /** Ultimate Tensile Strength (σu) in MPa */
  tensileStrength: number
  /** Elongation at break in % */
  elongation: number
  /** Poisson's Ratio (dimensionless) */
  poissonsRatio: number
  /** Hardness (Brinell HB or Rockwell) */
  hardness?: string
  /** Material behavior type */
  behavior: 'ductile' | 'brittle' | 'plastic'
}

export interface Material {
  id: string
  name: string
  /** Density in kg/m³ */
  density: number
  /** Category for grouping */
  category: MaterialCategory
  /** Mechanical properties for stress-strain curve */
  mechanical?: MechanicalProperties
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
  /* General Purpose Steels */
  { 
    id: 'carbon-steel', name: 'Carbon Steel', density: 7860, category: 'steel',
    mechanical: { youngsModulus: 200, yieldStrength: 250, tensileStrength: 400, elongation: 25, poissonsRatio: 0.29, hardness: '120-180 HB', behavior: 'ductile' }
  },
  { 
    id: 'mild-steel', name: 'Mild Steel (A36)', density: 7860, category: 'steel',
    mechanical: { youngsModulus: 210, yieldStrength: 250, tensileStrength: 400, elongation: 23, poissonsRatio: 0.30, hardness: '119-159 HB', behavior: 'ductile' }
  },
  { 
    id: 'aisi-1018', name: 'AISI 1018 Steel', density: 7870, category: 'steel',
    mechanical: { youngsModulus: 205, yieldStrength: 370, tensileStrength: 440, elongation: 15, poissonsRatio: 0.29, hardness: '126 HB', behavior: 'ductile' }
  },
  { 
    id: 'aisi-1045', name: 'AISI 1045 Steel', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 206, yieldStrength: 530, tensileStrength: 625, elongation: 12, poissonsRatio: 0.29, hardness: '187 HB', behavior: 'ductile' }
  },
  /* High Strength Steels (Automotive, Heavy Equipment) */
  { 
    id: 'aisi-4130', name: 'AISI 4130 Chromoly', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 205, yieldStrength: 460, tensileStrength: 560, elongation: 22, poissonsRatio: 0.29, hardness: '197 HB', behavior: 'ductile' }
  },
  { 
    id: 'aisi-4140', name: 'AISI 4140 Steel', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 210, yieldStrength: 655, tensileStrength: 1020, elongation: 18, poissonsRatio: 0.29, hardness: '302 HB', behavior: 'ductile' }
  },
  { 
    id: 'aisi-4340', name: 'AISI 4340 Steel', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 205, yieldStrength: 862, tensileStrength: 1110, elongation: 12, poissonsRatio: 0.29, hardness: '321 HB', behavior: 'ductile' }
  },
  { 
    id: 'hsla-steel', name: 'HSLA Steel', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 200, yieldStrength: 450, tensileStrength: 550, elongation: 18, poissonsRatio: 0.29, hardness: '160 HB', behavior: 'ductile' }
  },
  { 
    id: 'boron-steel', name: 'Boron Steel (22MnB5)', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 210, yieldStrength: 1100, tensileStrength: 1500, elongation: 6, poissonsRatio: 0.29, hardness: '450 HV', behavior: 'ductile' }
  },
  { 
    id: 'maraging-steel', name: 'Maraging Steel 300', density: 8100, category: 'steel',
    mechanical: { youngsModulus: 190, yieldStrength: 2000, tensileStrength: 2050, elongation: 7, poissonsRatio: 0.30, hardness: '52 HRC', behavior: 'ductile' }
  },
  /* Stainless Steels (Kitchen, Medical, Food Industry) */
  { 
    id: 'stainless-201', name: 'Stainless Steel 201', density: 7800, category: 'steel',
    mechanical: { youngsModulus: 197, yieldStrength: 310, tensileStrength: 655, elongation: 40, poissonsRatio: 0.29, hardness: '95 HRB', behavior: 'ductile' }
  },
  { 
    id: 'stainless-301', name: 'Stainless Steel 301', density: 7880, category: 'steel',
    mechanical: { youngsModulus: 193, yieldStrength: 275, tensileStrength: 758, elongation: 40, poissonsRatio: 0.29, hardness: '88 HRB', behavior: 'ductile' }
  },
  { 
    id: 'stainless-303', name: 'Stainless Steel 303', density: 8000, category: 'steel',
    mechanical: { youngsModulus: 193, yieldStrength: 240, tensileStrength: 620, elongation: 35, poissonsRatio: 0.29, hardness: '96 HRB', behavior: 'ductile' }
  },
  { 
    id: 'stainless-304', name: 'Stainless Steel 304', density: 7930, category: 'steel',
    mechanical: { youngsModulus: 193, yieldStrength: 215, tensileStrength: 505, elongation: 40, poissonsRatio: 0.29, hardness: '88 HRB', behavior: 'ductile' }
  },
  { 
    id: 'stainless-304l', name: 'Stainless Steel 304L', density: 7930, category: 'steel',
    mechanical: { youngsModulus: 193, yieldStrength: 170, tensileStrength: 485, elongation: 40, poissonsRatio: 0.29, hardness: '79 HRB', behavior: 'ductile' }
  },
  { 
    id: 'stainless-316', name: 'Stainless Steel 316', density: 7990, category: 'steel',
    mechanical: { youngsModulus: 193, yieldStrength: 205, tensileStrength: 515, elongation: 40, poissonsRatio: 0.30, hardness: '79 HRB', behavior: 'ductile' }
  },
  { 
    id: 'stainless-316l', name: 'Stainless Steel 316L (Surgical)', density: 7990, category: 'steel',
    mechanical: { youngsModulus: 193, yieldStrength: 170, tensileStrength: 485, elongation: 40, poissonsRatio: 0.30, hardness: '79 HRB', behavior: 'ductile' }
  },
  { 
    id: 'stainless-410', name: 'Stainless Steel 410', density: 7740, category: 'steel',
    mechanical: { youngsModulus: 200, yieldStrength: 275, tensileStrength: 485, elongation: 20, poissonsRatio: 0.28, hardness: '96 HRB', behavior: 'ductile' }
  },
  { 
    id: 'stainless-420', name: 'Stainless Steel 420 (Cutlery)', density: 7740, category: 'steel',
    mechanical: { youngsModulus: 200, yieldStrength: 345, tensileStrength: 655, elongation: 15, poissonsRatio: 0.28, hardness: '50 HRC', behavior: 'ductile' }
  },
  { 
    id: 'stainless-430', name: 'Stainless Steel 430', density: 7720, category: 'steel',
    mechanical: { youngsModulus: 200, yieldStrength: 310, tensileStrength: 450, elongation: 22, poissonsRatio: 0.28, hardness: '89 HRB', behavior: 'ductile' }
  },
  { 
    id: 'stainless-440c', name: 'Stainless Steel 440C (Knife)', density: 7650, category: 'steel',
    mechanical: { youngsModulus: 200, yieldStrength: 1900, tensileStrength: 1970, elongation: 2, poissonsRatio: 0.28, hardness: '58 HRC', behavior: 'brittle' }
  },
  { 
    id: 'stainless-17-4ph', name: 'Stainless Steel 17-4 PH', density: 7780, category: 'steel',
    mechanical: { youngsModulus: 197, yieldStrength: 1170, tensileStrength: 1310, elongation: 10, poissonsRatio: 0.29, hardness: '40 HRC', behavior: 'ductile' }
  },
  { 
    id: 'stainless-duplex', name: 'Duplex Stainless Steel', density: 7800, category: 'steel',
    mechanical: { youngsModulus: 200, yieldStrength: 450, tensileStrength: 620, elongation: 25, poissonsRatio: 0.29, hardness: '290 HB', behavior: 'ductile' }
  },
  /* Tool & Spring Steels */
  { 
    id: 'tool-steel-d2', name: 'Tool Steel D2', density: 7700, category: 'steel',
    mechanical: { youngsModulus: 210, yieldStrength: 1380, tensileStrength: 1860, elongation: 1, poissonsRatio: 0.28, hardness: '60-62 HRC', behavior: 'brittle' }
  },
  { 
    id: 'tool-steel-m2', name: 'Tool Steel M2 (HSS)', density: 8160, category: 'steel',
    mechanical: { youngsModulus: 220, yieldStrength: 1000, tensileStrength: 1200, elongation: 8, poissonsRatio: 0.28, hardness: '64-66 HRC', behavior: 'brittle' }
  },
  { 
    id: 'tool-steel', name: 'Tool Steel (General)', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 210, yieldStrength: 500, tensileStrength: 700, elongation: 12, poissonsRatio: 0.28, hardness: '55-65 HRC', behavior: 'ductile' }
  },
  { 
    id: 'spring-steel', name: 'Spring Steel', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 210, yieldStrength: 1200, tensileStrength: 1500, elongation: 8, poissonsRatio: 0.29, hardness: '45-50 HRC', behavior: 'ductile' }
  },
  /* Cast & Specialty Irons */
  { 
    id: 'cast-iron-grey', name: 'Grey Cast Iron', density: 7150, category: 'steel',
    mechanical: { youngsModulus: 110, yieldStrength: 150, tensileStrength: 250, elongation: 0.5, poissonsRatio: 0.26, hardness: '180-240 HB', behavior: 'brittle' }
  },
  { 
    id: 'cast-iron-ductile', name: 'Ductile Cast Iron', density: 7100, category: 'steel',
    mechanical: { youngsModulus: 165, yieldStrength: 275, tensileStrength: 415, elongation: 18, poissonsRatio: 0.28, hardness: '140-200 HB', behavior: 'ductile' }
  },
  { 
    id: 'cast-iron', name: 'Cast Iron', density: 7200, category: 'steel',
    mechanical: { youngsModulus: 130, yieldStrength: 130, tensileStrength: 200, elongation: 0.5, poissonsRatio: 0.26, hardness: '180-220 HB', behavior: 'brittle' }
  },
  { 
    id: 'wrought-iron', name: 'Wrought Iron', density: 7740, category: 'steel',
    mechanical: { youngsModulus: 190, yieldStrength: 200, tensileStrength: 340, elongation: 30, poissonsRatio: 0.30, hardness: '100 HB', behavior: 'ductile' }
  },
  /* Construction & Coated Steels */
  { 
    id: 'galvanized-steel', name: 'Galvanized Steel', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 200, yieldStrength: 250, tensileStrength: 400, elongation: 25, poissonsRatio: 0.29, hardness: '120-180 HB', behavior: 'ductile' }
  },
  { 
    id: 'weathering-steel', name: 'Weathering Steel (Corten)', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 200, yieldStrength: 345, tensileStrength: 480, elongation: 20, poissonsRatio: 0.29, hardness: '150 HB', behavior: 'ductile' }
  },
  { 
    id: 'rebar-steel', name: 'Rebar Steel', density: 7850, category: 'steel',
    mechanical: { youngsModulus: 200, yieldStrength: 420, tensileStrength: 550, elongation: 14, poissonsRatio: 0.29, hardness: '160 HB', behavior: 'ductile' }
  },
]

/* Aluminum Alloys */
const aluminums: Material[] = [
  /* Pure & General Purpose */
  { 
    id: 'aluminum-pure', name: 'Aluminum (Pure)', density: 2700, category: 'aluminum',
    mechanical: { youngsModulus: 70, yieldStrength: 35, tensileStrength: 90, elongation: 50, poissonsRatio: 0.33, hardness: '23 HB', behavior: 'ductile' }
  },
  { 
    id: 'aluminum-1100', name: 'Aluminum 1100 (Kitchen/Food)', density: 2710, category: 'aluminum',
    mechanical: { youngsModulus: 69, yieldStrength: 34, tensileStrength: 90, elongation: 45, poissonsRatio: 0.33, hardness: '23 HB', behavior: 'ductile' }
  },
  /* 2xxx Series (Aerospace, Automotive) */
  { 
    id: 'aluminum-2014', name: 'Aluminum 2014-T6', density: 2800, category: 'aluminum',
    mechanical: { youngsModulus: 73, yieldStrength: 414, tensileStrength: 483, elongation: 13, poissonsRatio: 0.33, hardness: '135 HB', behavior: 'ductile' }
  },
  { 
    id: 'aluminum-2024', name: 'Aluminum 2024-T3 (Aerospace)', density: 2780, category: 'aluminum',
    mechanical: { youngsModulus: 73, yieldStrength: 345, tensileStrength: 485, elongation: 18, poissonsRatio: 0.33, hardness: '120 HB', behavior: 'ductile' }
  },
  /* 3xxx Series (Kitchen, HVAC) */
  { 
    id: 'aluminum-3003', name: 'Aluminum 3003 (Kitchen/HVAC)', density: 2730, category: 'aluminum',
    mechanical: { youngsModulus: 70, yieldStrength: 125, tensileStrength: 152, elongation: 20, poissonsRatio: 0.33, hardness: '35 HB', behavior: 'ductile' }
  },
  { 
    id: 'aluminum-3105', name: 'Aluminum 3105', density: 2720, category: 'aluminum',
    mechanical: { youngsModulus: 70, yieldStrength: 150, tensileStrength: 175, elongation: 15, poissonsRatio: 0.33, hardness: '45 HB', behavior: 'ductile' }
  },
  /* 5xxx Series (Marine, Construction) */
  { 
    id: 'aluminum-5052', name: 'Aluminum 5052 (Marine)', density: 2680, category: 'aluminum',
    mechanical: { youngsModulus: 70, yieldStrength: 195, tensileStrength: 230, elongation: 12, poissonsRatio: 0.33, hardness: '60 HB', behavior: 'ductile' }
  },
  { 
    id: 'aluminum-5083', name: 'Aluminum 5083 (Marine/Ship)', density: 2660, category: 'aluminum',
    mechanical: { youngsModulus: 70, yieldStrength: 228, tensileStrength: 317, elongation: 16, poissonsRatio: 0.33, hardness: '75 HB', behavior: 'ductile' }
  },
  { 
    id: 'aluminum-5086', name: 'Aluminum 5086', density: 2660, category: 'aluminum',
    mechanical: { youngsModulus: 71, yieldStrength: 207, tensileStrength: 290, elongation: 14, poissonsRatio: 0.33, hardness: '70 HB', behavior: 'ductile' }
  },
  /* 6xxx Series (Construction, Automotive, Extrusions) */
  { 
    id: 'aluminum-6061', name: 'Aluminum 6061-T6', density: 2700, category: 'aluminum',
    mechanical: { youngsModulus: 69, yieldStrength: 276, tensileStrength: 310, elongation: 12, poissonsRatio: 0.33, hardness: '95 HB', behavior: 'ductile' }
  },
  { 
    id: 'aluminum-6063', name: 'Aluminum 6063 (Extrusion)', density: 2690, category: 'aluminum',
    mechanical: { youngsModulus: 69, yieldStrength: 214, tensileStrength: 241, elongation: 12, poissonsRatio: 0.33, hardness: '73 HB', behavior: 'ductile' }
  },
  { 
    id: 'aluminum-6082', name: 'Aluminum 6082-T6', density: 2700, category: 'aluminum',
    mechanical: { youngsModulus: 70, yieldStrength: 250, tensileStrength: 290, elongation: 10, poissonsRatio: 0.33, hardness: '95 HB', behavior: 'ductile' }
  },
  /* 7xxx Series (Aerospace, High Strength) */
  { 
    id: 'aluminum-7050', name: 'Aluminum 7050 (Aerospace)', density: 2830, category: 'aluminum',
    mechanical: { youngsModulus: 72, yieldStrength: 490, tensileStrength: 550, elongation: 11, poissonsRatio: 0.33, hardness: '140 HB', behavior: 'ductile' }
  },
  { 
    id: 'aluminum-7075', name: 'Aluminum 7075-T6 (Aerospace)', density: 2810, category: 'aluminum',
    mechanical: { youngsModulus: 71, yieldStrength: 503, tensileStrength: 572, elongation: 11, poissonsRatio: 0.33, hardness: '150 HB', behavior: 'ductile' }
  },
  /* Cast Aluminum */
  { 
    id: 'aluminum-a356', name: 'Aluminum A356 (Cast)', density: 2680, category: 'aluminum',
    mechanical: { youngsModulus: 72, yieldStrength: 186, tensileStrength: 234, elongation: 6, poissonsRatio: 0.33, hardness: '80 HB', behavior: 'ductile' }
  },
  { 
    id: 'aluminum-380', name: 'Aluminum 380 (Die Cast)', density: 2740, category: 'aluminum',
    mechanical: { youngsModulus: 71, yieldStrength: 165, tensileStrength: 324, elongation: 3.5, poissonsRatio: 0.33, hardness: '80 HB', behavior: 'ductile' }
  },
  { 
    id: 'duralumin', name: 'Duralumin', density: 2780, category: 'aluminum',
    mechanical: { youngsModulus: 73, yieldStrength: 350, tensileStrength: 480, elongation: 18, poissonsRatio: 0.33, hardness: '120 HB', behavior: 'ductile' }
  },
]

/* Copper and Copper Alloys */
const copperAlloys: Material[] = [
  /* Pure Copper (Electrical, Plumbing) */
  { 
    id: 'copper-pure', name: 'Copper (Pure/ETP)', density: 8960, category: 'copper-alloy',
    mechanical: { youngsModulus: 117, yieldStrength: 70, tensileStrength: 220, elongation: 45, poissonsRatio: 0.34, hardness: '40 HB', behavior: 'ductile' }
  },
  { 
    id: 'copper-c110', name: 'Copper C110 (Electrical)', density: 8940, category: 'copper-alloy',
    mechanical: { youngsModulus: 115, yieldStrength: 76, tensileStrength: 234, elongation: 40, poissonsRatio: 0.34, hardness: '50 HB', behavior: 'ductile' }
  },
  { 
    id: 'copper-deoxidized', name: 'Deoxidized Copper (Plumbing)', density: 8940, category: 'copper-alloy',
    mechanical: { youngsModulus: 117, yieldStrength: 69, tensileStrength: 220, elongation: 45, poissonsRatio: 0.34, hardness: '40 HB', behavior: 'ductile' }
  },
  /* Brass (Plumbing, Hardware, Instruments) */
  { 
    id: 'brass-c260', name: 'Brass C260 (Cartridge)', density: 8530, category: 'copper-alloy',
    mechanical: { youngsModulus: 110, yieldStrength: 125, tensileStrength: 340, elongation: 55, poissonsRatio: 0.34, hardness: '50 HB', behavior: 'ductile' }
  },
  { 
    id: 'brass-c360', name: 'Brass C360 (Free Cutting)', density: 8490, category: 'copper-alloy',
    mechanical: { youngsModulus: 97, yieldStrength: 140, tensileStrength: 380, elongation: 45, poissonsRatio: 0.34, hardness: '60 HB', behavior: 'ductile' }
  },
  { 
    id: 'brass-yellow', name: 'Yellow Brass', density: 8470, category: 'copper-alloy',
    mechanical: { youngsModulus: 100, yieldStrength: 150, tensileStrength: 350, elongation: 35, poissonsRatio: 0.34, hardness: '55 HB', behavior: 'ductile' }
  },
  { 
    id: 'brass-red', name: 'Red Brass (Plumbing)', density: 8750, category: 'copper-alloy',
    mechanical: { youngsModulus: 117, yieldStrength: 120, tensileStrength: 310, elongation: 40, poissonsRatio: 0.34, hardness: '50 HB', behavior: 'ductile' }
  },
  { 
    id: 'brass-naval', name: 'Naval Brass (Marine)', density: 8440, category: 'copper-alloy',
    mechanical: { youngsModulus: 100, yieldStrength: 175, tensileStrength: 415, elongation: 40, poissonsRatio: 0.34, hardness: '75 HB', behavior: 'ductile' }
  },
  { 
    id: 'brass-60-40', name: 'Brass 60/40 (Muntz)', density: 8520, category: 'copper-alloy',
    mechanical: { youngsModulus: 103, yieldStrength: 140, tensileStrength: 380, elongation: 45, poissonsRatio: 0.34, hardness: '60 HB', behavior: 'ductile' }
  },
  /* Bronze (Bearings, Marine, Heavy Industry) */
  { 
    id: 'bronze-phosphor', name: 'Phosphor Bronze', density: 8800, category: 'copper-alloy',
    mechanical: { youngsModulus: 110, yieldStrength: 280, tensileStrength: 450, elongation: 20, poissonsRatio: 0.34, hardness: '80 HB', behavior: 'ductile' }
  },
  { 
    id: 'bronze-aluminum', name: 'Aluminum Bronze', density: 8200, category: 'copper-alloy',
    mechanical: { youngsModulus: 120, yieldStrength: 310, tensileStrength: 620, elongation: 15, poissonsRatio: 0.32, hardness: '170 HB', behavior: 'ductile' }
  },
  { 
    id: 'bronze-silicon', name: 'Silicon Bronze', density: 8530, category: 'copper-alloy',
    mechanical: { youngsModulus: 103, yieldStrength: 240, tensileStrength: 480, elongation: 21, poissonsRatio: 0.34, hardness: '85 HB', behavior: 'ductile' }
  },
  { 
    id: 'bronze-bearing', name: 'Bearing Bronze (SAE 660)', density: 8930, category: 'copper-alloy',
    mechanical: { youngsModulus: 103, yieldStrength: 140, tensileStrength: 260, elongation: 15, poissonsRatio: 0.34, hardness: '65 HB', behavior: 'ductile' }
  },
  { 
    id: 'bronze-manganese', name: 'Manganese Bronze', density: 8300, category: 'copper-alloy',
    mechanical: { youngsModulus: 105, yieldStrength: 310, tensileStrength: 550, elongation: 20, poissonsRatio: 0.34, hardness: '150 HB', behavior: 'ductile' }
  },
  /* Specialty Copper Alloys */
  { 
    id: 'beryllium-copper', name: 'Beryllium Copper', density: 8250, category: 'copper-alloy',
    mechanical: { youngsModulus: 131, yieldStrength: 965, tensileStrength: 1100, elongation: 3, poissonsRatio: 0.30, hardness: '38 HRC', behavior: 'ductile' }
  },
  { 
    id: 'cupronickel-70-30', name: 'Cupronickel 70/30 (Marine)', density: 8940, category: 'copper-alloy',
    mechanical: { youngsModulus: 150, yieldStrength: 170, tensileStrength: 400, elongation: 35, poissonsRatio: 0.34, hardness: '70 HB', behavior: 'ductile' }
  },
  { 
    id: 'cupronickel-90-10', name: 'Cupronickel 90/10 (Condenser)', density: 8900, category: 'copper-alloy',
    mechanical: { youngsModulus: 135, yieldStrength: 120, tensileStrength: 320, elongation: 40, poissonsRatio: 0.34, hardness: '55 HB', behavior: 'ductile' }
  },
  { 
    id: 'nickel-silver', name: 'Nickel Silver (German Silver)', density: 8700, category: 'copper-alloy',
    mechanical: { youngsModulus: 117, yieldStrength: 200, tensileStrength: 470, elongation: 30, poissonsRatio: 0.34, hardness: '85 HB', behavior: 'ductile' }
  },
]

/* Precious and Specialty Metals (Jewelry, Electronics, Catalysts) */
const preciousMetals: Material[] = [
  { 
    id: 'gold-pure', name: 'Gold (24K Pure)', density: 19300, category: 'precious',
    mechanical: { youngsModulus: 79, yieldStrength: 205, tensileStrength: 220, elongation: 45, poissonsRatio: 0.44, hardness: '25 HV', behavior: 'ductile' }
  },
  { 
    id: 'gold-18k', name: 'Gold 18K (75%)', density: 15500, category: 'precious',
    mechanical: { youngsModulus: 85, yieldStrength: 300, tensileStrength: 350, elongation: 30, poissonsRatio: 0.42, hardness: '120 HV', behavior: 'ductile' }
  },
  { 
    id: 'gold-14k', name: 'Gold 14K (58.5%)', density: 13100, category: 'precious',
    mechanical: { youngsModulus: 90, yieldStrength: 350, tensileStrength: 400, elongation: 25, poissonsRatio: 0.40, hardness: '150 HV', behavior: 'ductile' }
  },
  { 
    id: 'silver', name: 'Silver (Pure)', density: 10500, category: 'precious',
    mechanical: { youngsModulus: 83, yieldStrength: 170, tensileStrength: 290, elongation: 48, poissonsRatio: 0.37, hardness: '25 HV', behavior: 'ductile' }
  },
  { 
    id: 'silver-sterling', name: 'Sterling Silver (92.5%)', density: 10400, category: 'precious',
    mechanical: { youngsModulus: 80, yieldStrength: 230, tensileStrength: 330, elongation: 40, poissonsRatio: 0.37, hardness: '75 HV', behavior: 'ductile' }
  },
  { 
    id: 'platinum', name: 'Platinum', density: 21450, category: 'precious',
    mechanical: { youngsModulus: 168, yieldStrength: 125, tensileStrength: 240, elongation: 35, poissonsRatio: 0.38, hardness: '40 HV', behavior: 'ductile' }
  },
  { 
    id: 'palladium', name: 'Palladium', density: 12000, category: 'precious',
    mechanical: { youngsModulus: 121, yieldStrength: 205, tensileStrength: 275, elongation: 30, poissonsRatio: 0.39, hardness: '40 HV', behavior: 'ductile' }
  },
  { 
    id: 'rhodium', name: 'Rhodium', density: 12410, category: 'precious',
    mechanical: { youngsModulus: 380, yieldStrength: 230, tensileStrength: 280, elongation: 8, poissonsRatio: 0.26, hardness: '101 HV', behavior: 'brittle' }
  },
  { 
    id: 'iridium', name: 'Iridium', density: 22560, category: 'precious',
    mechanical: { youngsModulus: 528, yieldStrength: 1000, tensileStrength: 1100, elongation: 2, poissonsRatio: 0.26, hardness: '200 HV', behavior: 'brittle' }
  },
]

/* Other Metals */
const otherMetals: Material[] = [
  /* Titanium (Medical, Aerospace, Automotive) */
  { 
    id: 'titanium-grade1', name: 'Titanium Grade 1 (Pure)', density: 4510, category: 'other-metal',
    mechanical: { youngsModulus: 102, yieldStrength: 170, tensileStrength: 240, elongation: 24, poissonsRatio: 0.34, hardness: '120 HV', behavior: 'ductile' }
  },
  { 
    id: 'titanium-grade2', name: 'Titanium Grade 2 (Medical)', density: 4510, category: 'other-metal',
    mechanical: { youngsModulus: 103, yieldStrength: 275, tensileStrength: 345, elongation: 20, poissonsRatio: 0.34, hardness: '145 HV', behavior: 'ductile' }
  },
  { 
    id: 'titanium', name: 'Titanium Grade 4', density: 4510, category: 'other-metal',
    mechanical: { youngsModulus: 116, yieldStrength: 483, tensileStrength: 550, elongation: 15, poissonsRatio: 0.34, hardness: '250 HV', behavior: 'ductile' }
  },
  { 
    id: 'titanium-6al4v', name: 'Titanium 6Al-4V (Aerospace)', density: 4430, category: 'other-metal',
    mechanical: { youngsModulus: 114, yieldStrength: 880, tensileStrength: 950, elongation: 14, poissonsRatio: 0.34, hardness: '36 HRC', behavior: 'ductile' }
  },
  { 
    id: 'titanium-6al4v-eli', name: 'Ti-6Al-4V ELI (Medical Implant)', density: 4430, category: 'other-metal',
    mechanical: { youngsModulus: 110, yieldStrength: 795, tensileStrength: 860, elongation: 15, poissonsRatio: 0.34, hardness: '33 HRC', behavior: 'ductile' }
  },
  /* Nickel Alloys (Aerospace, Chemical, Nuclear) */
  { 
    id: 'nickel', name: 'Nickel (Pure)', density: 8900, category: 'other-metal',
    mechanical: { youngsModulus: 200, yieldStrength: 140, tensileStrength: 450, elongation: 30, poissonsRatio: 0.31, hardness: '80 HB', behavior: 'ductile' }
  },
  { 
    id: 'inconel-600', name: 'Inconel 600', density: 8470, category: 'other-metal',
    mechanical: { youngsModulus: 214, yieldStrength: 310, tensileStrength: 620, elongation: 40, poissonsRatio: 0.29, hardness: '80 HRB', behavior: 'ductile' }
  },
  { 
    id: 'inconel-625', name: 'Inconel 625 (Marine)', density: 8440, category: 'other-metal',
    mechanical: { youngsModulus: 207, yieldStrength: 517, tensileStrength: 930, elongation: 30, poissonsRatio: 0.28, hardness: '98 HRB', behavior: 'ductile' }
  },
  { 
    id: 'inconel-718', name: 'Inconel 718 (Aerospace)', density: 8190, category: 'other-metal',
    mechanical: { youngsModulus: 200, yieldStrength: 1100, tensileStrength: 1375, elongation: 12, poissonsRatio: 0.29, hardness: '40 HRC', behavior: 'ductile' }
  },
  { 
    id: 'monel-400', name: 'Monel 400 (Chemical)', density: 8800, category: 'other-metal',
    mechanical: { youngsModulus: 179, yieldStrength: 240, tensileStrength: 550, elongation: 35, poissonsRatio: 0.32, hardness: '130 HB', behavior: 'ductile' }
  },
  { 
    id: 'hastelloy-c276', name: 'Hastelloy C-276 (Chemical)', density: 8890, category: 'other-metal',
    mechanical: { youngsModulus: 205, yieldStrength: 355, tensileStrength: 785, elongation: 40, poissonsRatio: 0.31, hardness: '90 HRB', behavior: 'ductile' }
  },
  { 
    id: 'nimonic-80a', name: 'Nimonic 80A', density: 8190, category: 'other-metal',
    mechanical: { youngsModulus: 222, yieldStrength: 620, tensileStrength: 1000, elongation: 20, poissonsRatio: 0.30, hardness: '250 HV', behavior: 'ductile' }
  },
  /* Cobalt Alloys (Medical, Dental, Aerospace) */
  { 
    id: 'cobalt', name: 'Cobalt (Pure)', density: 8860, category: 'other-metal',
    mechanical: { youngsModulus: 211, yieldStrength: 310, tensileStrength: 450, elongation: 10, poissonsRatio: 0.31, hardness: '125 HB', behavior: 'ductile' }
  },
  { 
    id: 'cobalt-chrome', name: 'CoCr (Medical Implant)', density: 8300, category: 'other-metal',
    mechanical: { youngsModulus: 230, yieldStrength: 450, tensileStrength: 900, elongation: 8, poissonsRatio: 0.30, hardness: '36 HRC', behavior: 'ductile' }
  },
  { 
    id: 'stellite-6', name: 'Stellite 6 (Wear-Resistant)', density: 8440, category: 'other-metal',
    mechanical: { youngsModulus: 237, yieldStrength: 620, tensileStrength: 1030, elongation: 1, poissonsRatio: 0.30, hardness: '40 HRC', behavior: 'brittle' }
  },
  /* Magnesium (Automotive, Aerospace) */
  { 
    id: 'magnesium', name: 'Magnesium (Pure)', density: 1740, category: 'other-metal',
    mechanical: { youngsModulus: 45, yieldStrength: 130, tensileStrength: 230, elongation: 8, poissonsRatio: 0.29, hardness: '50 HB', behavior: 'ductile' }
  },
  { 
    id: 'magnesium-az31', name: 'Magnesium AZ31 (Automotive)', density: 1770, category: 'other-metal',
    mechanical: { youngsModulus: 45, yieldStrength: 200, tensileStrength: 290, elongation: 15, poissonsRatio: 0.35, hardness: '60 HB', behavior: 'ductile' }
  },
  { 
    id: 'magnesium-az91', name: 'Magnesium AZ91 (Cast)', density: 1810, category: 'other-metal',
    mechanical: { youngsModulus: 45, yieldStrength: 160, tensileStrength: 240, elongation: 3, poissonsRatio: 0.35, hardness: '63 HB', behavior: 'ductile' }
  },
  /* Zinc Alloys (Die Casting, Galvanizing) */
  { 
    id: 'zinc', name: 'Zinc (Pure)', density: 7140, category: 'other-metal',
    mechanical: { youngsModulus: 83, yieldStrength: 110, tensileStrength: 150, elongation: 15, poissonsRatio: 0.25, hardness: '52 HB', behavior: 'ductile' }
  },
  { 
    id: 'zamak-3', name: 'Zamak 3 (Die Cast)', density: 6600, category: 'other-metal',
    mechanical: { youngsModulus: 83, yieldStrength: 220, tensileStrength: 280, elongation: 10, poissonsRatio: 0.27, hardness: '82 HB', behavior: 'ductile' }
  },
  { 
    id: 'zamak-5', name: 'Zamak 5 (Die Cast)', density: 6700, category: 'other-metal',
    mechanical: { youngsModulus: 85, yieldStrength: 230, tensileStrength: 330, elongation: 7, poissonsRatio: 0.27, hardness: '91 HB', behavior: 'ductile' }
  },
  /* Heavy Metals & Specialty */
  { 
    id: 'lead', name: 'Lead', density: 11340, category: 'other-metal',
    mechanical: { youngsModulus: 16, yieldStrength: 11, tensileStrength: 18, elongation: 50, poissonsRatio: 0.44, hardness: '5 HB', behavior: 'plastic' }
  },
  { 
    id: 'tin', name: 'Tin', density: 7310, category: 'other-metal',
    mechanical: { youngsModulus: 50, yieldStrength: 11, tensileStrength: 27, elongation: 40, poissonsRatio: 0.36, hardness: '5 HB', behavior: 'plastic' }
  },
  { 
    id: 'tungsten', name: 'Tungsten', density: 19300, category: 'other-metal',
    mechanical: { youngsModulus: 411, yieldStrength: 750, tensileStrength: 980, elongation: 2, poissonsRatio: 0.28, hardness: '300 HV', behavior: 'brittle' }
  },
  { 
    id: 'tungsten-carbide', name: 'Tungsten Carbide', density: 15630, category: 'other-metal',
    mechanical: { youngsModulus: 600, yieldStrength: 530, tensileStrength: 530, elongation: 0, poissonsRatio: 0.22, hardness: '1700 HV', behavior: 'brittle' }
  },
  { 
    id: 'chromium', name: 'Chromium', density: 7190, category: 'other-metal',
    mechanical: { youngsModulus: 279, yieldStrength: 200, tensileStrength: 280, elongation: 2, poissonsRatio: 0.21, hardness: '170 HV', behavior: 'brittle' }
  },
  { 
    id: 'manganese', name: 'Manganese', density: 7440, category: 'other-metal',
    mechanical: { youngsModulus: 198, yieldStrength: 350, tensileStrength: 500, elongation: 4, poissonsRatio: 0.29, hardness: '210 HB', behavior: 'brittle' }
  },
  { 
    id: 'molybdenum', name: 'Molybdenum', density: 10220, category: 'other-metal',
    mechanical: { youngsModulus: 329, yieldStrength: 550, tensileStrength: 700, elongation: 25, poissonsRatio: 0.31, hardness: '230 HV', behavior: 'ductile' }
  },
  /* Specialty / Low Expansion */
  { 
    id: 'invar', name: 'Invar 36 (Low Expansion)', density: 8050, category: 'other-metal',
    mechanical: { youngsModulus: 141, yieldStrength: 276, tensileStrength: 483, elongation: 35, poissonsRatio: 0.29, hardness: '160 HB', behavior: 'ductile' }
  },
  { 
    id: 'kovar', name: 'Kovar (Glass-Metal Seal)', density: 8360, category: 'other-metal',
    mechanical: { youngsModulus: 138, yieldStrength: 310, tensileStrength: 520, elongation: 30, poissonsRatio: 0.30, hardness: '150 HB', behavior: 'ductile' }
  },
  /* Refractory Metals (High Temp) */
  { 
    id: 'tantalum', name: 'Tantalum (Medical/Chemical)', density: 16650, category: 'other-metal',
    mechanical: { youngsModulus: 186, yieldStrength: 165, tensileStrength: 285, elongation: 40, poissonsRatio: 0.35, hardness: '120 HV', behavior: 'ductile' }
  },
  { 
    id: 'niobium', name: 'Niobium (Superconductor)', density: 8570, category: 'other-metal',
    mechanical: { youngsModulus: 105, yieldStrength: 105, tensileStrength: 275, elongation: 30, poissonsRatio: 0.40, hardness: '80 HV', behavior: 'ductile' }
  },
  { 
    id: 'zirconium', name: 'Zirconium (Nuclear)', density: 6510, category: 'other-metal',
    mechanical: { youngsModulus: 68, yieldStrength: 230, tensileStrength: 330, elongation: 25, poissonsRatio: 0.34, hardness: '145 HV', behavior: 'ductile' }
  },
]

/* Plastics & Polymers */
const plastics: Material[] = [
  /* Common Thermoplastics (Automotive, Consumer) */
  { 
    id: 'abs', name: 'ABS (Automotive)', density: 1050, category: 'plastic',
    mechanical: { youngsModulus: 2.3, yieldStrength: 45, tensileStrength: 50, elongation: 20, poissonsRatio: 0.35, hardness: '100 HRR', behavior: 'plastic' }
  },
  { 
    id: 'abs-pc', name: 'ABS/PC Blend', density: 1100, category: 'plastic',
    mechanical: { youngsModulus: 2.5, yieldStrength: 55, tensileStrength: 60, elongation: 50, poissonsRatio: 0.36, hardness: '95 HRR', behavior: 'ductile' }
  },
  { 
    id: 'polycarbonate', name: 'Polycarbonate (Safety)', density: 1200, category: 'plastic',
    mechanical: { youngsModulus: 2.4, yieldStrength: 65, tensileStrength: 70, elongation: 100, poissonsRatio: 0.37, hardness: '70 HRM', behavior: 'ductile' }
  },
  { 
    id: 'acrylic', name: 'Acrylic (PMMA)', density: 1180, category: 'plastic',
    mechanical: { youngsModulus: 3.1, yieldStrength: 70, tensileStrength: 75, elongation: 5, poissonsRatio: 0.37, hardness: '95 HRM', behavior: 'brittle' }
  },
  /* Polyethylene (Packaging, Containers) */
  { 
    id: 'hdpe', name: 'HDPE (Container)', density: 960, category: 'plastic',
    mechanical: { youngsModulus: 1.1, yieldStrength: 26, tensileStrength: 32, elongation: 500, poissonsRatio: 0.40, hardness: '65 HRD', behavior: 'plastic' }
  },
  { 
    id: 'ldpe', name: 'LDPE (Film)', density: 920, category: 'plastic',
    mechanical: { youngsModulus: 0.2, yieldStrength: 10, tensileStrength: 12, elongation: 400, poissonsRatio: 0.42, hardness: '45 HRD', behavior: 'plastic' }
  },
  { 
    id: 'uhmwpe', name: 'UHMWPE (Medical/Bearings)', density: 940, category: 'plastic',
    mechanical: { youngsModulus: 0.7, yieldStrength: 22, tensileStrength: 40, elongation: 350, poissonsRatio: 0.40, hardness: '60 HRD', behavior: 'plastic' }
  },
  /* Polypropylene */
  { 
    id: 'pp', name: 'Polypropylene (Kitchen)', density: 905, category: 'plastic',
    mechanical: { youngsModulus: 1.5, yieldStrength: 35, tensileStrength: 40, elongation: 150, poissonsRatio: 0.40, hardness: '95 HRR', behavior: 'plastic' }
  },
  { 
    id: 'pp-gf30', name: 'PP Glass Filled 30%', density: 1140, category: 'plastic',
    mechanical: { youngsModulus: 6.0, yieldStrength: 90, tensileStrength: 100, elongation: 4, poissonsRatio: 0.35, hardness: '108 HRR', behavior: 'brittle' }
  },
  /* PVC */
  { 
    id: 'pvc', name: 'PVC Rigid (Piping)', density: 1400, category: 'plastic',
    mechanical: { youngsModulus: 3.0, yieldStrength: 50, tensileStrength: 55, elongation: 30, poissonsRatio: 0.38, hardness: '80 HRD', behavior: 'plastic' }
  },
  { 
    id: 'pvc-flexible', name: 'PVC Flexible', density: 1300, category: 'plastic',
    mechanical: { youngsModulus: 0.01, yieldStrength: 10, tensileStrength: 15, elongation: 300, poissonsRatio: 0.45, hardness: '40 HRA', behavior: 'plastic' }
  },
  { 
    id: 'cpvc', name: 'CPVC (Hot Water)', density: 1550, category: 'plastic',
    mechanical: { youngsModulus: 3.1, yieldStrength: 55, tensileStrength: 60, elongation: 25, poissonsRatio: 0.38, hardness: '82 HRD', behavior: 'plastic' }
  },
  /* Engineering Plastics (Industrial, Medical) */
  { 
    id: 'nylon-6', name: 'Nylon 6 (PA6)', density: 1140, category: 'plastic',
    mechanical: { youngsModulus: 2.8, yieldStrength: 80, tensileStrength: 85, elongation: 50, poissonsRatio: 0.39, hardness: '118 HRR', behavior: 'plastic' }
  },
  { 
    id: 'nylon-66', name: 'Nylon 66 (PA66)', density: 1140, category: 'plastic',
    mechanical: { youngsModulus: 3.0, yieldStrength: 85, tensileStrength: 90, elongation: 40, poissonsRatio: 0.39, hardness: '120 HRR', behavior: 'ductile' }
  },
  { 
    id: 'nylon-gf', name: 'Nylon Glass Filled', density: 1350, category: 'plastic',
    mechanical: { youngsModulus: 9.0, yieldStrength: 145, tensileStrength: 170, elongation: 3, poissonsRatio: 0.35, hardness: '92 HRM', behavior: 'brittle' }
  },
  { 
    id: 'delrin', name: 'Delrin (POM/Acetal)', density: 1410, category: 'plastic',
    mechanical: { youngsModulus: 3.1, yieldStrength: 75, tensileStrength: 80, elongation: 35, poissonsRatio: 0.35, hardness: '94 HRM', behavior: 'ductile' }
  },
  { 
    id: 'pet', name: 'PET (Bottles)', density: 1380, category: 'plastic',
    mechanical: { youngsModulus: 2.8, yieldStrength: 55, tensileStrength: 70, elongation: 70, poissonsRatio: 0.40, hardness: '85 HRM', behavior: 'ductile' }
  },
  { 
    id: 'petg', name: 'PETG (Food Contact)', density: 1270, category: 'plastic',
    mechanical: { youngsModulus: 2.0, yieldStrength: 50, tensileStrength: 55, elongation: 110, poissonsRatio: 0.40, hardness: '82 HRM', behavior: 'ductile' }
  },
  /* High Performance (Aerospace, Medical) */
  { 
    id: 'peek', name: 'PEEK (Medical/Aerospace)', density: 1320, category: 'plastic',
    mechanical: { youngsModulus: 3.6, yieldStrength: 100, tensileStrength: 110, elongation: 25, poissonsRatio: 0.36, hardness: '99 HRM', behavior: 'ductile' }
  },
  { 
    id: 'pei', name: 'PEI Ultem (Aerospace)', density: 1270, category: 'plastic',
    mechanical: { youngsModulus: 3.0, yieldStrength: 105, tensileStrength: 115, elongation: 60, poissonsRatio: 0.36, hardness: '109 HRM', behavior: 'ductile' }
  },
  { 
    id: 'pps', name: 'PPS (Chemical)', density: 1350, category: 'plastic',
    mechanical: { youngsModulus: 3.8, yieldStrength: 95, tensileStrength: 105, elongation: 2, poissonsRatio: 0.35, hardness: '100 HRR', behavior: 'brittle' }
  },
  { 
    id: 'psu', name: 'Polysulfone (Medical)', density: 1240, category: 'plastic',
    mechanical: { youngsModulus: 2.5, yieldStrength: 75, tensileStrength: 80, elongation: 50, poissonsRatio: 0.37, hardness: '85 HRM', behavior: 'ductile' }
  },
  /* Fluoropolymers (Chemical, Non-Stick) */
  { 
    id: 'ptfe', name: 'PTFE Teflon (Non-Stick)', density: 2200, category: 'plastic',
    mechanical: { youngsModulus: 0.5, yieldStrength: 10, tensileStrength: 25, elongation: 350, poissonsRatio: 0.46, hardness: '55 HRD', behavior: 'plastic' }
  },
  { 
    id: 'pvdf', name: 'PVDF Kynar (Chemical)', density: 1780, category: 'plastic',
    mechanical: { youngsModulus: 2.1, yieldStrength: 50, tensileStrength: 55, elongation: 25, poissonsRatio: 0.38, hardness: '78 HRD', behavior: 'ductile' }
  },
  { 
    id: 'fep', name: 'FEP (Wire Insulation)', density: 2150, category: 'plastic',
    mechanical: { youngsModulus: 0.5, yieldStrength: 12, tensileStrength: 23, elongation: 300, poissonsRatio: 0.46, hardness: '56 HRD', behavior: 'plastic' }
  },
  /* Elastomers & Rubber */
  { 
    id: 'silicone', name: 'Silicone Rubber', density: 1100, category: 'plastic',
    mechanical: { youngsModulus: 0.005, yieldStrength: 5, tensileStrength: 10, elongation: 500, poissonsRatio: 0.48, hardness: '50 HRA', behavior: 'plastic' }
  },
  { 
    id: 'polyurethane', name: 'Polyurethane (Wheels)', density: 1200, category: 'plastic',
    mechanical: { youngsModulus: 0.02, yieldStrength: 30, tensileStrength: 40, elongation: 400, poissonsRatio: 0.47, hardness: '70 HRA', behavior: 'plastic' }
  },
  { 
    id: 'tpu', name: 'TPU (Flexible)', density: 1200, category: 'plastic',
    mechanical: { youngsModulus: 0.015, yieldStrength: 25, tensileStrength: 50, elongation: 500, poissonsRatio: 0.48, hardness: '85 HRA', behavior: 'plastic' }
  },
  { 
    id: 'neoprene', name: 'Neoprene (Seals)', density: 1230, category: 'plastic',
    mechanical: { youngsModulus: 0.003, yieldStrength: 8, tensileStrength: 15, elongation: 400, poissonsRatio: 0.49, hardness: '55 HRA', behavior: 'plastic' }
  },
  { 
    id: 'epdm', name: 'EPDM (Gaskets)', density: 1150, category: 'plastic',
    mechanical: { youngsModulus: 0.008, yieldStrength: 7, tensileStrength: 14, elongation: 350, poissonsRatio: 0.48, hardness: '60 HRA', behavior: 'plastic' }
  },
  /* Thermosets & Composites */
  { 
    id: 'epoxy', name: 'Epoxy Resin', density: 1200, category: 'plastic',
    mechanical: { youngsModulus: 3.5, yieldStrength: 80, tensileStrength: 90, elongation: 4, poissonsRatio: 0.35, hardness: '85 HRM', behavior: 'brittle' }
  },
  { 
    id: 'fiberglass', name: 'Fiberglass (GRP)', density: 1800, category: 'plastic',
    mechanical: { youngsModulus: 15, yieldStrength: 200, tensileStrength: 280, elongation: 2, poissonsRatio: 0.28, hardness: '50 HRB', behavior: 'brittle' }
  },
  { 
    id: 'carbon-fiber', name: 'Carbon Fiber (CFRP)', density: 1600, category: 'plastic',
    mechanical: { youngsModulus: 70, yieldStrength: 500, tensileStrength: 600, elongation: 1.5, poissonsRatio: 0.30, hardness: '60 HRB', behavior: 'brittle' }
  },
  { 
    id: 'bakelite', name: 'Bakelite (Electrical)', density: 1360, category: 'plastic',
    mechanical: { youngsModulus: 4.5, yieldStrength: 50, tensileStrength: 60, elongation: 1, poissonsRatio: 0.35, hardness: '90 HRM', behavior: 'brittle' }
  },
]

/* Wood (approximate, seasoned) - Properties parallel to grain */
const woods: Material[] = [
  /* Hardwoods (Furniture, Flooring, Construction) */
  { 
    id: 'oak-red', name: 'Red Oak', density: 750, category: 'wood',
    mechanical: { youngsModulus: 12.5, yieldStrength: 40, tensileStrength: 95, elongation: 1.5, poissonsRatio: 0.35, hardness: '1290 HJ', behavior: 'brittle' }
  },
  { 
    id: 'oak-white', name: 'White Oak', density: 770, category: 'wood',
    mechanical: { youngsModulus: 12.3, yieldStrength: 42, tensileStrength: 98, elongation: 1.4, poissonsRatio: 0.35, hardness: '1360 HJ', behavior: 'brittle' }
  },
  { 
    id: 'maple-hard', name: 'Hard Maple', density: 705, category: 'wood',
    mechanical: { youngsModulus: 12.6, yieldStrength: 48, tensileStrength: 115, elongation: 1.8, poissonsRatio: 0.35, hardness: '1450 HJ', behavior: 'brittle' }
  },
  { 
    id: 'maple-soft', name: 'Soft Maple', density: 630, category: 'wood',
    mechanical: { youngsModulus: 11.2, yieldStrength: 38, tensileStrength: 90, elongation: 1.6, poissonsRatio: 0.35, hardness: '950 HJ', behavior: 'brittle' }
  },
  { 
    id: 'birch', name: 'Birch', density: 670, category: 'wood',
    mechanical: { youngsModulus: 13.0, yieldStrength: 42, tensileStrength: 100, elongation: 1.6, poissonsRatio: 0.35, hardness: '1260 HJ', behavior: 'brittle' }
  },
  { 
    id: 'walnut', name: 'Black Walnut', density: 660, category: 'wood',
    mechanical: { youngsModulus: 11.6, yieldStrength: 38, tensileStrength: 90, elongation: 1.4, poissonsRatio: 0.35, hardness: '1010 HJ', behavior: 'brittle' }
  },
  { 
    id: 'cherry', name: 'Cherry', density: 580, category: 'wood',
    mechanical: { youngsModulus: 10.3, yieldStrength: 35, tensileStrength: 85, elongation: 1.3, poissonsRatio: 0.35, hardness: '950 HJ', behavior: 'brittle' }
  },
  { 
    id: 'ash', name: 'Ash', density: 670, category: 'wood',
    mechanical: { youngsModulus: 12.0, yieldStrength: 42, tensileStrength: 95, elongation: 1.5, poissonsRatio: 0.35, hardness: '1320 HJ', behavior: 'brittle' }
  },
  { 
    id: 'hickory', name: 'Hickory', density: 830, category: 'wood',
    mechanical: { youngsModulus: 14.9, yieldStrength: 55, tensileStrength: 135, elongation: 2.0, poissonsRatio: 0.35, hardness: '1820 HJ', behavior: 'brittle' }
  },
  { 
    id: 'beech', name: 'Beech', density: 720, category: 'wood',
    mechanical: { youngsModulus: 11.9, yieldStrength: 40, tensileStrength: 100, elongation: 1.5, poissonsRatio: 0.35, hardness: '1300 HJ', behavior: 'brittle' }
  },
  /* Exotic Hardwoods */
  { 
    id: 'teak', name: 'Teak', density: 650, category: 'wood',
    mechanical: { youngsModulus: 13.3, yieldStrength: 50, tensileStrength: 105, elongation: 1.2, poissonsRatio: 0.35, hardness: '1000 HJ', behavior: 'brittle' }
  },
  { 
    id: 'mahogany', name: 'Mahogany', density: 540, category: 'wood',
    mechanical: { youngsModulus: 10.1, yieldStrength: 33, tensileStrength: 78, elongation: 1.3, poissonsRatio: 0.35, hardness: '800 HJ', behavior: 'brittle' }
  },
  { 
    id: 'ebony', name: 'Ebony', density: 1050, category: 'wood',
    mechanical: { youngsModulus: 17.0, yieldStrength: 65, tensileStrength: 140, elongation: 1.0, poissonsRatio: 0.35, hardness: '3220 HJ', behavior: 'brittle' }
  },
  { 
    id: 'rosewood', name: 'Rosewood', density: 880, category: 'wood',
    mechanical: { youngsModulus: 14.5, yieldStrength: 55, tensileStrength: 120, elongation: 1.2, poissonsRatio: 0.35, hardness: '2400 HJ', behavior: 'brittle' }
  },
  { 
    id: 'bamboo', name: 'Bamboo', density: 700, category: 'wood',
    mechanical: { youngsModulus: 20.0, yieldStrength: 60, tensileStrength: 140, elongation: 1.5, poissonsRatio: 0.30, hardness: '1380 HJ', behavior: 'brittle' }
  },
  /* Softwoods (Construction, Framing) */
  { 
    id: 'pine-southern', name: 'Southern Pine', density: 570, category: 'wood',
    mechanical: { youngsModulus: 12.3, yieldStrength: 38, tensileStrength: 90, elongation: 1.4, poissonsRatio: 0.30, hardness: '690 HJ', behavior: 'brittle' }
  },
  { 
    id: 'pine-white', name: 'White Pine', density: 400, category: 'wood',
    mechanical: { youngsModulus: 8.5, yieldStrength: 25, tensileStrength: 65, elongation: 1.2, poissonsRatio: 0.30, hardness: '380 HJ', behavior: 'brittle' }
  },
  { 
    id: 'douglas-fir', name: 'Douglas Fir', density: 530, category: 'wood',
    mechanical: { youngsModulus: 13.4, yieldStrength: 38, tensileStrength: 90, elongation: 1.5, poissonsRatio: 0.30, hardness: '660 HJ', behavior: 'brittle' }
  },
  { 
    id: 'spruce', name: 'Spruce', density: 450, category: 'wood',
    mechanical: { youngsModulus: 9.7, yieldStrength: 30, tensileStrength: 75, elongation: 1.3, poissonsRatio: 0.30, hardness: '490 HJ', behavior: 'brittle' }
  },
  { 
    id: 'cedar-western', name: 'Western Red Cedar', density: 370, category: 'wood',
    mechanical: { youngsModulus: 7.7, yieldStrength: 25, tensileStrength: 55, elongation: 1.0, poissonsRatio: 0.30, hardness: '350 HJ', behavior: 'brittle' }
  },
  { 
    id: 'redwood', name: 'Redwood', density: 420, category: 'wood',
    mechanical: { youngsModulus: 9.2, yieldStrength: 28, tensileStrength: 70, elongation: 1.2, poissonsRatio: 0.30, hardness: '420 HJ', behavior: 'brittle' }
  },
  { 
    id: 'hemlock', name: 'Hemlock', density: 480, category: 'wood',
    mechanical: { youngsModulus: 10.8, yieldStrength: 32, tensileStrength: 80, elongation: 1.4, poissonsRatio: 0.30, hardness: '500 HJ', behavior: 'brittle' }
  },
  /* Engineered Wood Products */
  { 
    id: 'plywood', name: 'Plywood', density: 600, category: 'wood',
    mechanical: { youngsModulus: 8.5, yieldStrength: 25, tensileStrength: 50, elongation: 2.0, poissonsRatio: 0.30, hardness: 'N/A', behavior: 'brittle' }
  },
  { 
    id: 'plywood-marine', name: 'Marine Plywood', density: 680, category: 'wood',
    mechanical: { youngsModulus: 9.5, yieldStrength: 30, tensileStrength: 60, elongation: 2.0, poissonsRatio: 0.30, hardness: 'N/A', behavior: 'brittle' }
  },
  { 
    id: 'osb', name: 'OSB', density: 650, category: 'wood',
    mechanical: { youngsModulus: 5.5, yieldStrength: 18, tensileStrength: 35, elongation: 1.0, poissonsRatio: 0.30, hardness: 'N/A', behavior: 'brittle' }
  },
  { 
    id: 'mdf', name: 'MDF', density: 750, category: 'wood',
    mechanical: { youngsModulus: 4.0, yieldStrength: 15, tensileStrength: 25, elongation: 0.8, poissonsRatio: 0.25, hardness: 'N/A', behavior: 'brittle' }
  },
  { 
    id: 'particle-board', name: 'Particle Board', density: 700, category: 'wood',
    mechanical: { youngsModulus: 2.5, yieldStrength: 10, tensileStrength: 18, elongation: 0.5, poissonsRatio: 0.25, hardness: 'N/A', behavior: 'brittle' }
  },
  { 
    id: 'hdf', name: 'HDF (Hardboard)', density: 900, category: 'wood',
    mechanical: { youngsModulus: 5.0, yieldStrength: 20, tensileStrength: 35, elongation: 0.8, poissonsRatio: 0.25, hardness: 'N/A', behavior: 'brittle' }
  },
  { 
    id: 'lvl', name: 'LVL (Laminated Veneer)', density: 580, category: 'wood',
    mechanical: { youngsModulus: 13.0, yieldStrength: 35, tensileStrength: 80, elongation: 1.5, poissonsRatio: 0.30, hardness: 'N/A', behavior: 'brittle' }
  },
  { 
    id: 'glulam', name: 'Glulam Beam', density: 500, category: 'wood',
    mechanical: { youngsModulus: 12.5, yieldStrength: 32, tensileStrength: 75, elongation: 1.5, poissonsRatio: 0.30, hardness: 'N/A', behavior: 'brittle' }
  },
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


