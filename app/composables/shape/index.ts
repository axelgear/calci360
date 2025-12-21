/**
 * Shape Composables - Central index
 * Re-exports all shape rendering functions and types
 */

/* Types */
export type {
  ShapeLabel,
  ShapeExtra,
  ShapePath,
  ShapeRenderData,
  Shape3DRenderData,
  HvacRenderData,
  ShapeContext,
  Shape2DRenderer,
  Shape3DRenderer,
  ProfileRenderer,
  HvacRenderer,
} from './types'

/* 2D Shapes */
export { getShape2DData } from './2d'

/* 3D Shapes */
export { getShape3DData } from './3d'

/* Profile Shapes */
export { getProfileData } from './profile'

/* HVAC Shapes */
export { getHvacData } from './hvac'

