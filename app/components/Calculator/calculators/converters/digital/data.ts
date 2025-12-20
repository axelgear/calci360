import type { ConverterConfig } from '../../types'
import { data } from '../../base/data'

/**
 * Data Storage Converter
 * Base unit: bit (b)
 * 
 * Note: Data storage has two systems:
 * - Decimal (SI): 1 KB = 1000 B (kilobyte)
 * - Binary (IEC): 1 KiB = 1024 B (kibibyte)
 */

const D = data

export const dataConverter: ConverterConfig = {
  type: 'converter',
  name: 'Data Storage Converter',
  description: 'Convert between data storage units including bytes, kilobytes, megabytes, gigabytes, and terabytes',
  category: 'Unit Conversion',
  icon: 'storage',
  keywords: ['data', 'storage', 'byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'],
  defaultFromUnit: 'gigabyte',
  defaultToUnit: 'megabyte',
  precision: 6,
  showAllConversions: true,
  units: [
    /* Bits - Decimal (SI) */
    { id: 'bit', name: 'Bit', symbol: 'b', toBase: D.bit },
    { id: 'kilobit', name: 'Kilobit', symbol: 'kb', toBase: D.kilobit },
    { id: 'megabit', name: 'Megabit', symbol: 'Mb', toBase: D.megabit },
    { id: 'gigabit', name: 'Gigabit', symbol: 'Gb', toBase: D.gigabit },
    { id: 'terabit', name: 'Terabit', symbol: 'Tb', toBase: D.terabit },
    { id: 'petabit', name: 'Petabit', symbol: 'Pb', toBase: D.petabit },

    /* Bits - Binary (IEC) */
    { id: 'kibibit', name: 'Kibibit', symbol: 'Kib', toBase: D.kibibit },
    { id: 'mebibit', name: 'Mebibit', symbol: 'Mib', toBase: D.mebibit },
    { id: 'gibibit', name: 'Gibibit', symbol: 'Gib', toBase: D.gibibit },
    { id: 'tebibit', name: 'Tebibit', symbol: 'Tib', toBase: D.tebibit },
    
    /* Bytes - Decimal (SI) */
    { id: 'nibble', name: 'Nibble', symbol: 'nibble', toBase: D.nibble },
    { id: 'byte', name: 'Byte', symbol: 'B', toBase: D.byte },
    { id: 'kilobyte', name: 'Kilobyte', symbol: 'KB', toBase: D.kilobyte },
    { id: 'megabyte', name: 'Megabyte', symbol: 'MB', toBase: D.megabyte },
    { id: 'gigabyte', name: 'Gigabyte', symbol: 'GB', toBase: D.gigabyte },
    { id: 'terabyte', name: 'Terabyte', symbol: 'TB', toBase: D.terabyte },
    { id: 'petabyte', name: 'Petabyte', symbol: 'PB', toBase: D.petabyte },
    { id: 'exabyte', name: 'Exabyte', symbol: 'EB', toBase: D.exabyte },
    { id: 'zettabyte', name: 'Zettabyte', symbol: 'ZB', toBase: D.zettabyte },
    { id: 'yottabyte', name: 'Yottabyte', symbol: 'YB', toBase: D.yottabyte },

    /* Bytes - Binary (IEC) */
    { id: 'kibibyte', name: 'Kibibyte', symbol: 'KiB', toBase: D.kibibyte },
    { id: 'mebibyte', name: 'Mebibyte', symbol: 'MiB', toBase: D.mebibyte },
    { id: 'gibibyte', name: 'Gibibyte', symbol: 'GiB', toBase: D.gibibyte },
    { id: 'tebibyte', name: 'Tebibyte', symbol: 'TiB', toBase: D.tebibyte },
    { id: 'pebibyte', name: 'Pebibyte', symbol: 'PiB', toBase: D.pebibyte },
    { id: 'exbibyte', name: 'Exbibyte', symbol: 'EiB', toBase: D.exbibyte },

    /* Words (common architectures) */
    { id: 'word-16', name: 'Word (16-bit)', symbol: 'word₁₆', toBase: D['word-16'] },
    { id: 'word-32', name: 'Word (32-bit)', symbol: 'word₃₂', toBase: D['word-32'] },
    { id: 'word-64', name: 'Word (64-bit)', symbol: 'word₆₄', toBase: D['word-64'] },
  ],
}

