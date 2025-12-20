import type { ConverterConfig } from '../../types'
import { angle } from '../../base/angle'

/**
 * Angle Converter - Base unit (like length/time/mass)
 * Base unit: radian (rad)
 * 
 * Note: Angles are dimensionless quantities (ratio of arc length to radius)
 */

const A = angle

export const angleConverter: ConverterConfig = {
  type: 'converter',
  name: 'Angle Converter',
  description: 'Convert between angle units including degrees, radians, gradians, and arcminutes',
  category: 'Unit Conversion',
  icon: 'architecture',
  keywords: ['angle', 'degree', 'radian', 'gradian', 'arcminute', 'arcsecond'],
  defaultFromUnit: 'degree',
  defaultToUnit: 'radian',
  precision: 8,
  showAllConversions: true,
  units: [
    /* SI and Mathematical */
    { id: 'radian', name: 'Radian', symbol: 'rad', toBase: A.radian },
    { id: 'milliradian', name: 'Milliradian', symbol: 'mrad', toBase: A.milliradian },
    { id: 'microradian', name: 'Microradian', symbol: 'μrad', toBase: A.microradian },

    /* Common Angular */
    { id: 'degree', name: 'Degree', symbol: '°', toBase: A.degree },
    { id: 'arcminute', name: 'Arcminute', symbol: '′', toBase: A.arcminute },
    { id: 'arcsecond', name: 'Arcsecond', symbol: '″', toBase: A.arcsecond },
    { id: 'milliarcsecond', name: 'Milliarcsecond', symbol: 'mas', toBase: A.milliarcsecond },
    { id: 'microarcsecond', name: 'Microarcsecond', symbol: 'μas', toBase: A.microarcsecond },

    /* Gradians */
    { id: 'gradian', name: 'Gradian (Gon)', symbol: 'grad', toBase: A.gradian },
    { id: 'centigrade-angle', name: 'Centigrade (angle)', symbol: 'cgon', toBase: A['centigrade-angle'] },

    /* Revolutions / Cycles */
    { id: 'turn', name: 'Turn (Revolution)', symbol: 'tr', toBase: A.turn },
    { id: 'half-circle', name: 'Half Circle', symbol: 'π rad', toBase: A['half-circle'] },
    { id: 'quarter-circle', name: 'Quarter Circle', symbol: 'π/2 rad', toBase: A['quarter-circle'] },

    /* Geometric Divisions */
    { id: 'quadrant', name: 'Quadrant', symbol: 'quad', toBase: A.quadrant },
    { id: 'sextant', name: 'Sextant', symbol: 'sext', toBase: A.sextant },
    { id: 'octant', name: 'Octant', symbol: 'oct', toBase: A.octant },
    { id: 'sign', name: 'Sign (Zodiac)', symbol: 'sign', toBase: A.sign },
    { id: 'hour-angle', name: 'Hour Angle', symbol: 'HA', toBase: A['hour-angle'] },

    /* Military */
    { id: 'mil-nato', name: 'Mil (NATO)', symbol: 'mil', toBase: A['mil-nato'] },
    { id: 'mil-ussr', name: 'Mil (USSR)', symbol: 'mil (RU)', toBase: A['mil-ussr'] },
    { id: 'mil-sweden', name: 'Streck (Sweden)', symbol: 'streck', toBase: A['mil-sweden'] },

    /* Navigation */
    { id: 'compass-point', name: 'Compass Point', symbol: 'pt', toBase: A['compass-point'] },

    /* Computing */
    { id: 'binary-radian', name: 'Binary Radian (Brad)', symbol: 'brad', toBase: A['binary-radian'] },
  ],
}

