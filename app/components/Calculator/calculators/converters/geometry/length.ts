import type { ConverterConfig } from '../../types'
import { length } from '../../base/length'

/**
 * Length Converter - Base unit for area, volume, speed, etc.
 * Base unit: meter (m)
 */
export const lengthConverter: ConverterConfig = {
  type: 'converter',
  name: 'Length Converter',
  description: 'Convert between different length and distance units including metric and imperial measurements',
  category: 'Unit Conversion',
  icon: 'straighten',
  keywords: ['length', 'distance', 'meter', 'feet', 'inches', 'miles', 'kilometers'],
  defaultFromUnit: 'meter',
  defaultToUnit: 'foot',
  precision: 6,
  showAllConversions: true,
  units: [
    /* Metric SI */
    { id: 'picometer', name: 'Picometer', symbol: 'pm', toBase: length.picometer },
    { id: 'nanometer', name: 'Nanometer', symbol: 'nm', toBase: length.nanometer },
    { id: 'micrometer', name: 'Micrometer', symbol: 'μm', toBase: length.micrometer },
    { id: 'millimeter', name: 'Millimeter', symbol: 'mm', toBase: length.millimeter },
    { id: 'centimeter', name: 'Centimeter', symbol: 'cm', toBase: length.centimeter },
    { id: 'decimeter', name: 'Decimeter', symbol: 'dm', toBase: length.decimeter },
    { id: 'meter', name: 'Meter', symbol: 'm', toBase: length.meter },
    { id: 'dekameter', name: 'Dekameter', symbol: 'dam', toBase: length.dekameter },
    { id: 'hectometer', name: 'Hectometer', symbol: 'hm', toBase: length.hectometer },
    { id: 'kilometer', name: 'Kilometer', symbol: 'km', toBase: length.kilometer },
    { id: 'megameter', name: 'Megameter', symbol: 'Mm', toBase: length.megameter },

    /* Imperial */
    { id: 'inch', name: 'Inch', symbol: 'in', toBase: length.inch },
    { id: 'foot', name: 'Foot', symbol: 'ft', toBase: length.foot },
    { id: 'yard', name: 'Yard', symbol: 'yd', toBase: length.yard },
    { id: 'mile', name: 'Mile', symbol: 'mi', toBase: length.mile },
    { id: 'us-survey-foot', name: 'US Survey Foot', symbol: 'ft (US)', toBase: length['us-survey-foot'] },
    { id: 'league', name: 'League', symbol: 'lea', toBase: length.league },
    { id: 'furlong', name: 'Furlong', symbol: 'fur', toBase: length.furlong },
    { id: 'chain', name: 'Chain', symbol: 'ch', toBase: length.chain },
    { id: 'rod', name: 'Rod', symbol: 'rd', toBase: length.rod },

    /* Nautical */
    { id: 'nautical-mile', name: 'Nautical Mile', symbol: 'nmi', toBase: length['nautical-mile'] },
    { id: 'fathom', name: 'Fathom', symbol: 'ftm', toBase: length.fathom },
    { id: 'cable', name: 'Cable', symbol: 'cable', toBase: length.cable },

    /* Typography */
    { id: 'point', name: 'Point', symbol: 'pt', toBase: length.point },
    { id: 'pica', name: 'Pica', symbol: 'pc', toBase: length.pica },

    /* Astronomical */
    { id: 'light-year', name: 'Light Year', symbol: 'ly', toBase: length['light-year'] },
    { id: 'astronomical-unit', name: 'Astronomical Unit', symbol: 'AU', toBase: length['astronomical-unit'] },
    { id: 'parsec', name: 'Parsec', symbol: 'pc', toBase: length.parsec },
    { id: 'light-second', name: 'Light Second', symbol: 'ls', toBase: length['light-second'] },
    { id: 'light-minute', name: 'Light Minute', symbol: 'lm', toBase: length['light-minute'] },

    /* Atomic / Quantum */
    { id: 'angstrom', name: 'Ångström', symbol: 'Å', toBase: length.angstrom },
    { id: 'fermi', name: 'Fermi', symbol: 'fm', toBase: length.fermi },
    { id: 'bohr-radius', name: 'Bohr Radius', symbol: 'a₀', toBase: length['bohr-radius'] },
    { id: 'planck-length', name: 'Planck Length', symbol: 'ℓₚ', toBase: length['planck-length'] },

    /* Industrial */
    { id: 'mil', name: 'Mil (Thou)', symbol: 'mil', toBase: length.mil },
    { id: 'microinch', name: 'Microinch', symbol: 'μin', toBase: length.microinch },

    /* Historical */
    { id: 'cubit', name: 'Cubit', symbol: 'cubit', toBase: length.cubit },
    { id: 'hand', name: 'Hand', symbol: 'hh', toBase: length.hand },
    { id: 'span', name: 'Span', symbol: 'span', toBase: length.span },
    { id: 'smoot', name: 'Smoot', symbol: 'smoot', toBase: length.smoot },
  ],
}

