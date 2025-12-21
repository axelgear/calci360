/**
 * HVAC Calculator Module
 */

export * from './types'
export * from './ducts'

import type { HvacDuctCalculatorConfig } from './types'

export const hvacDuctCalculator: HvacDuctCalculatorConfig = {
  type: 'hvac-duct',
  name: 'Duct Temperature Loss Calculator',
  description: 'Calculate temperature loss through insulated or uninsulated HVAC air ducts. Supports round and rectangular ducts with various insulation types.',
  category: 'HVAC',
  icon: 'air',
  keywords: [
    'hvac', 'duct', 'temperature', 'heat loss', 'insulation', 'air conditioning',
    'heating', 'ventilation', 'thermal', 'r-value', 'round duct', 'rectangular duct',
    'supply air', 'return air', 'ducting', 'airflow', 'heat transfer'
  ],
  resultLabel: 'Exit Temperature',
}

