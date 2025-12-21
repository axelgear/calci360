import type { ConverterConfig } from '../../types'

/**
 * Radioactivity Converter
 * Base unit: Becquerel (Bq)
 */
export const radioactivityConverter: ConverterConfig = {
  type: 'converter',
  name: 'Radioactivity Converter',
  description: 'Convert between radioactivity units including becquerels and curies',
  category: 'Specialized',
  icon: 'warning',
  keywords: ['radioactivity', 'becquerel', 'curie', 'radiation', 'nuclear', 'decay'],
  defaultFromUnit: 'becquerel',
  defaultToUnit: 'curie',
  precision: 9,
  showAllConversions: true,
  units: [
    /* SI Units */
    { id: 'becquerel', name: 'Becquerel', symbol: 'Bq', toBase: 1 },
    { id: 'kilobecquerel', name: 'Kilobecquerel', symbol: 'kBq', toBase: 1000 },
    { id: 'megabecquerel', name: 'Megabecquerel', symbol: 'MBq', toBase: 1e6 },
    { id: 'gigabecquerel', name: 'Gigabecquerel', symbol: 'GBq', toBase: 1e9 },
    
    /* Non-SI Units */
    { id: 'curie', name: 'Curie', symbol: 'Ci', toBase: 3.7e10 },
    { id: 'millicurie', name: 'Millicurie', symbol: 'mCi', toBase: 3.7e7 },
    { id: 'microcurie', name: 'Microcurie', symbol: 'μCi', toBase: 37000 },
    { id: 'nanocurie', name: 'Nanocurie', symbol: 'nCi', toBase: 37 },
    { id: 'picocurie', name: 'Picocurie', symbol: 'pCi', toBase: 0.037 },
  ],
}


