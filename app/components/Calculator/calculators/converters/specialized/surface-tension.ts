import type { ConverterConfig } from '../../types'

/**
 * Surface Tension Converter
 * Base unit: Newton per Meter (N/m)
 */
export const surfaceTensionConverter: ConverterConfig = {
  type: 'converter',
  name: 'Surface Tension Converter',
  description: 'Convert between surface tension units including newtons per meter and dynes per centimeter',
  category: 'Specialized',
  icon: 'water_drop',
  keywords: ['surface', 'tension', 'newton', 'dyne', 'fluid', 'liquid', 'capillary'],
  defaultFromUnit: 'newton-per-meter',
  defaultToUnit: 'dyne-per-cm',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI Units */
    { id: 'newton-per-meter', name: 'Newton per Meter', symbol: 'N/m', toBase: 1 },
    { id: 'millinewton-per-meter', name: 'Millinewton per Meter', symbol: 'mN/m', toBase: 0.001 },
    { id: 'joule-per-m2', name: 'Joule per m²', symbol: 'J/m²', toBase: 1 },
    
    /* CGS Units */
    { id: 'dyne-per-cm', name: 'Dyne per Centimeter', symbol: 'dyn/cm', toBase: 0.001 },
    { id: 'erg-per-cm2', name: 'Erg per cm²', symbol: 'erg/cm²', toBase: 0.001 },
    
    /* Imperial */
    { id: 'pound-force-per-foot', name: 'Pound-force per Foot', symbol: 'lbf/ft', toBase: 14.5939 },
    { id: 'pound-force-per-inch', name: 'Pound-force per Inch', symbol: 'lbf/in', toBase: 175.127 },
  ],
}


