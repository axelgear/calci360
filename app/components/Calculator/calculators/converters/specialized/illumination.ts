import type { ConverterConfig } from '../../types'

/**
 * Illumination Converter
 * Base unit: Lux (lx)
 */
export const illuminationConverter: ConverterConfig = {
  type: 'converter',
  name: 'Illumination Converter',
  description: 'Convert between illumination units including lux, foot-candles, and phot',
  category: 'Specialized',
  icon: 'lightbulb',
  keywords: ['illumination', 'lux', 'foot-candle', 'lighting', 'luminance', 'brightness'],
  defaultFromUnit: 'lux',
  defaultToUnit: 'foot-candle',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI Units */
    { id: 'lux', name: 'Lux', symbol: 'lx', toBase: 1 },
    { id: 'kilolux', name: 'Kilolux', symbol: 'klx', toBase: 1000 },
    { id: 'millilux', name: 'Millilux', symbol: 'mlx', toBase: 0.001 },
    { id: 'nox', name: 'Nox', symbol: 'nx', toBase: 0.001 },
    
    /* Imperial / CGS */
    { id: 'foot-candle', name: 'Foot-candle', symbol: 'fc', toBase: 10.764 },
    { id: 'phot', name: 'Phot', symbol: 'ph', toBase: 10000 },
  ],
}


