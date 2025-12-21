/**
 * Duct Sizing Calculator - Module Index
 */

import type { DuctSizingConfig } from './types'

/* Export types */
export * from './types'

/* Export fittings */
export * from './fittings'

/* Export air properties */
export * from './air-properties'

/* Export calculations */
export * from './calculations'

/* Calculator configuration */
export const ductSizingCalculator: DuctSizingConfig = {
  type: 'duct-sizing',
  name: 'Duct Sizing Calculator',
  description: 'Design HVAC duct systems with automatic sizing, pressure drop calculations, and bill of materials',
  category: 'HVAC',
  icon: 'air',
  keywords: [
    'hvac', 'duct', 'sizing', 'cfm', 'airflow', 'pressure drop',
    'friction', 'velocity', 'fitting', 'elbow', 'branch', 'diffuser',
    'bom', 'bill of materials', 'duct design', 'ductwork',
  ],
}

