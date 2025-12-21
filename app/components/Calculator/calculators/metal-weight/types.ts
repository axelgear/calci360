/**
 * Metal Weight Calculator Types
 */

import type { ProfileDefinition } from './profiles'
import type { Material, MaterialGroup, MechanicalProperties } from './materials'

export type { ProfileDefinition, Material, MaterialGroup, MechanicalProperties }

export interface MetalWeightCalculatorConfig {
  type: 'metal-weight'
  name: string
  description: string
  category: string
  icon: string
  keywords: string[]
  resultLabel: string
}

/* Re-export profile and material functions */
export { 
  metalProfiles, 
  getProfile, 
  defaultProfile, 
  profileCategories,
  type ProfileInput,
  type ProfileCategory,
} from './profiles'

export {
  allMaterials,
  materialGroups,
  getMaterial,
  defaultMaterial,
  type MaterialCategory,
} from './materials'

