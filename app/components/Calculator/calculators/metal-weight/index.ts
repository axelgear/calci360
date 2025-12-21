/**
 * Metal Weight Calculator Module
 */

export * from './types'
export * from './materials'
export * from './profiles'

import type { MetalWeightCalculatorConfig } from './types'

export const metalWeightCalculator: MetalWeightCalculatorConfig = {
  type: 'metal-weight',
  name: 'Metal Weight Calculator',
  description: 'Calculate the weight of metal bars, sheets, tubes, and structural profiles. Supports steel, aluminum, copper, brass, and many other materials.',
  category: 'Engineering',
  icon: 'scale',
  keywords: [
    'metal', 'weight', 'steel', 'aluminum', 'copper', 'brass', 'iron', 
    'mass', 'density', 'bar', 'tube', 'pipe', 'sheet', 'plate', 
    'i-beam', 'channel', 'angle', 'profile', 'structural'
  ],
  resultLabel: 'Weight',
}

