import type { ConverterConfig } from '../../types'

/**
 * Magnetic Field Converter
 * Base unit: Tesla (T)
 */
export const magneticFieldConverter: ConverterConfig = {
  type: 'converter',
  name: 'Magnetic Field Converter',
  description: 'Convert between magnetic field units including tesla, gauss, and weber per square meter',
  category: 'Specialized',
  icon: 'explore',
  keywords: ['magnetic', 'field', 'tesla', 'gauss', 'flux', 'magnetism'],
  defaultFromUnit: 'tesla',
  defaultToUnit: 'gauss',
  precision: 9,
  showAllConversions: true,
  units: [
    /* SI Units */
    { id: 'tesla', name: 'Tesla', symbol: 'T', toBase: 1 },
    { id: 'millitesla', name: 'Millitesla', symbol: 'mT', toBase: 0.001 },
    { id: 'microtesla', name: 'Microtesla', symbol: 'μT', toBase: 1e-6 },
    { id: 'nanotesla', name: 'Nanotesla', symbol: 'nT', toBase: 1e-9 },
    { id: 'weber-per-m2', name: 'Weber per m²', symbol: 'Wb/m²', toBase: 1 },
    
    /* CGS Units */
    { id: 'gauss', name: 'Gauss', symbol: 'G', toBase: 0.0001 },
    { id: 'milligauss', name: 'Milligauss', symbol: 'mG', toBase: 1e-7 },
  ],
}


