import type { ConverterConfig } from '../../types'

/**
 * Viscosity Converter (Dynamic Viscosity)
 * Base unit: Pascal Second (Pa·s)
 */
export const viscosityConverter: ConverterConfig = {
  type: 'converter',
  name: 'Viscosity Converter',
  description: 'Convert between dynamic viscosity units including pascal-seconds, poise, and centipoise',
  category: 'Specialized',
  icon: 'opacity',
  keywords: ['viscosity', 'pascal', 'poise', 'centipoise', 'fluid', 'liquid', 'dynamic'],
  defaultFromUnit: 'pascal-second',
  defaultToUnit: 'centipoise',
  precision: 9,
  showAllConversions: true,
  units: [
    /* SI Units */
    { id: 'pascal-second', name: 'Pascal Second', symbol: 'Pa·s', toBase: 1 },
    { id: 'millipascal-second', name: 'Millipascal Second', symbol: 'mPa·s', toBase: 0.001 },
    
    /* CGS Units */
    { id: 'poise', name: 'Poise', symbol: 'P', toBase: 0.1 },
    { id: 'centipoise', name: 'Centipoise', symbol: 'cP', toBase: 0.001 },
    
    /* Imperial */
    { id: 'pound-per-foot-second', name: 'Pound per Foot Second', symbol: 'lb/(ft·s)', toBase: 1.48816 },
    { id: 'pound-per-foot-hour', name: 'Pound per Foot Hour', symbol: 'lb/(ft·h)', toBase: 0.000413378 },
  ],
}


