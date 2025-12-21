import type { ConverterConfig } from '../../types'

/**
 * Radiation Dose Converter
 * Base unit: Gray (Gy) for absorbed dose, Sievert (Sv) for equivalent dose
 */
export const radiationDoseConverter: ConverterConfig = {
  type: 'converter',
  name: 'Radiation Dose Converter',
  description: 'Convert between radiation dose units including gray, sievert, rad, and rem',
  category: 'Specialized',
  icon: 'science',
  keywords: ['radiation', 'dose', 'gray', 'sievert', 'rad', 'rem', 'nuclear', 'exposure'],
  defaultFromUnit: 'gray',
  defaultToUnit: 'rad',
  precision: 9,
  showAllConversions: true,
  units: [
    /* Absorbed Dose - SI */
    { id: 'gray', name: 'Gray', symbol: 'Gy', toBase: 1 },
    { id: 'milligray', name: 'Milligray', symbol: 'mGy', toBase: 0.001 },
    { id: 'microgray', name: 'Microgray', symbol: 'μGy', toBase: 1e-6 },
    { id: 'rad', name: 'Rad', symbol: 'rad', toBase: 0.01 },
    
    /* Equivalent Dose - SI */
    { id: 'sievert', name: 'Sievert', symbol: 'Sv', toBase: 1 },
    { id: 'millisievert', name: 'Millisievert', symbol: 'mSv', toBase: 0.001 },
    { id: 'microsievert', name: 'Microsievert', symbol: 'μSv', toBase: 1e-6 },
    { id: 'rem', name: 'Rem', symbol: 'rem', toBase: 0.01 },
    { id: 'millirem', name: 'Millirem', symbol: 'mrem', toBase: 0.00001 },
  ],
}


