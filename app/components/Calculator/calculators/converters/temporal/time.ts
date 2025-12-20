import type { ConverterConfig } from '../../types'
import { time } from '../../base/time'

/**
 * Time Converter - Base unit for speed, frequency, power, etc.
 * Base unit: second (s)
 */

const T = time

export const timeConverter: ConverterConfig = {
  type: 'converter',
  name: 'Time Converter',
  description: 'Convert between time units including seconds, minutes, hours, days, weeks, months, and years',
  category: 'Unit Conversion',
  icon: 'schedule',
  keywords: ['time', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'],
  defaultFromUnit: 'hour',
  defaultToUnit: 'minute',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI Metric */
    { id: 'picosecond', name: 'Picosecond', symbol: 'ps', toBase: T.picosecond },
    { id: 'nanosecond', name: 'Nanosecond', symbol: 'ns', toBase: T.nanosecond },
    { id: 'microsecond', name: 'Microsecond', symbol: 'μs', toBase: T.microsecond },
    { id: 'millisecond', name: 'Millisecond', symbol: 'ms', toBase: T.millisecond },
    { id: 'centisecond', name: 'Centisecond', symbol: 'cs', toBase: T.centisecond },
    { id: 'decisecond', name: 'Decisecond', symbol: 'ds', toBase: T.decisecond },
    { id: 'second', name: 'Second', symbol: 's', toBase: T.second },
    { id: 'dekasecond', name: 'Dekasecond', symbol: 'das', toBase: T.dekasecond },
    { id: 'hectosecond', name: 'Hectosecond', symbol: 'hs', toBase: T.hectosecond },
    { id: 'kilosecond', name: 'Kilosecond', symbol: 'ks', toBase: T.kilosecond },
    { id: 'megasecond', name: 'Megasecond', symbol: 'Ms', toBase: T.megasecond },

    /* Common */
    { id: 'minute', name: 'Minute', symbol: 'min', toBase: T.minute },
    { id: 'hour', name: 'Hour', symbol: 'h', toBase: T.hour },
    { id: 'day', name: 'Day', symbol: 'd', toBase: T.day },
    { id: 'week', name: 'Week', symbol: 'wk', toBase: T.week },
    { id: 'fortnight', name: 'Fortnight', symbol: 'fn', toBase: T.fortnight },
    { id: 'month', name: 'Month (average)', symbol: 'mo', toBase: T.month },
    { id: 'quarter', name: 'Quarter', symbol: 'qtr', toBase: T.quarter },
    { id: 'year', name: 'Year (Julian)', symbol: 'yr', toBase: T.year },
    { id: 'common-year', name: 'Common Year (365d)', symbol: 'yr', toBase: T['common-year'] },
    { id: 'leap-year', name: 'Leap Year (366d)', symbol: 'leap yr', toBase: T['leap-year'] },
    { id: 'decade', name: 'Decade', symbol: 'dec', toBase: T.decade },
    { id: 'century', name: 'Century', symbol: 'c', toBase: T.century },
    { id: 'millennium', name: 'Millennium', symbol: 'mill', toBase: T.millennium },

    /* Astronomical */
    { id: 'sidereal-day', name: 'Sidereal Day', symbol: 'sd', toBase: T['sidereal-day'] },
    { id: 'sidereal-month', name: 'Sidereal Month', symbol: 'sm', toBase: T['sidereal-month'] },
    { id: 'synodic-month', name: 'Synodic Month (Lunar)', symbol: 'syn mo', toBase: T['synodic-month'] },
    { id: 'tropical-year', name: 'Tropical Year', symbol: 'ty', toBase: T['tropical-year'] },
    { id: 'sidereal-year', name: 'Sidereal Year', symbol: 'sy', toBase: T['sidereal-year'] },
    { id: 'anomalistic-year', name: 'Anomalistic Year', symbol: 'ay', toBase: T['anomalistic-year'] },
    { id: 'galactic-year', name: 'Galactic Year', symbol: 'GY', toBase: T['galactic-year'] },

    /* Computing / Physics */
    { id: 'jiffy', name: 'Jiffy (1/100 s)', symbol: 'jiffy', toBase: T.jiffy },
    { id: 'shake', name: 'Shake', symbol: 'shake', toBase: T.shake },
    { id: 'planck-time', name: 'Planck Time', symbol: 'tₚ', toBase: T['planck-time'] },

    /* Work / Business */
    { id: 'work-day', name: 'Work Day (8h)', symbol: 'work day', toBase: T['work-day'] },
    { id: 'work-week', name: 'Work Week (40h)', symbol: 'work wk', toBase: T['work-week'] },
  ],
}

