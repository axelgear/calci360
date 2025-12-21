/**
 * Data/Information Unit Definitions
 * Base unit: bit (b)
 * All values represent conversion factor TO bits
 */

import type { UnitOption } from './types'

/* ========== RAW CONVERSION FACTORS ========== */
export const data = {
  /* Bits */
  bit: 1,
  kilobit: 1000,
  megabit: 1000 ** 2,
  gigabit: 1000 ** 3,
  terabit: 1000 ** 4,
  petabit: 1000 ** 5,
  exabit: 1000 ** 6,
  zettabit: 1000 ** 7,
  yottabit: 1000 ** 8,

  /* Binary Bits (IEC) */
  kibibit: 1024,
  mebibit: 1024 ** 2,
  gibibit: 1024 ** 3,
  tebibit: 1024 ** 4,
  pebibit: 1024 ** 5,
  exbibit: 1024 ** 6,
  zebibit: 1024 ** 7,
  yobibit: 1024 ** 8,

  /* Bytes (1 byte = 8 bits) */
  nibble: 4,
  byte: 8,
  kilobyte: 8 * 1000,
  megabyte: 8 * 1000 ** 2,
  gigabyte: 8 * 1000 ** 3,
  terabyte: 8 * 1000 ** 4,
  petabyte: 8 * 1000 ** 5,
  exabyte: 8 * 1000 ** 6,
  zettabyte: 8 * 1000 ** 7,
  yottabyte: 8 * 1000 ** 8,

  /* Binary Bytes (IEC) */
  kibibyte: 8 * 1024,
  mebibyte: 8 * 1024 ** 2,
  gibibyte: 8 * 1024 ** 3,
  tebibyte: 8 * 1024 ** 4,
  pebibyte: 8 * 1024 ** 5,
  exbibyte: 8 * 1024 ** 6,
  zebibyte: 8 * 1024 ** 7,
  yobibyte: 8 * 1024 ** 8,

  /* Legacy / Informal */
  'kilobyte-binary': 8 * 1024,
  'megabyte-binary': 8 * 1024 ** 2,
  'gigabyte-binary': 8 * 1024 ** 3,
  'terabyte-binary': 8 * 1024 ** 4,

  /* Words */
  'word-16': 16,
  'word-32': 32,
  'word-64': 64,
  'word-128': 128,

  /* Storage Media */
  'floppy-1440': 8 * 1474560,
  'cd-700': 8 * 700 * 1000 ** 2,
  'dvd-single': 8 * 4.7 * 1000 ** 3,
  'dvd-dual': 8 * 8.5 * 1000 ** 3,
  'bluray-single': 8 * 25 * 1000 ** 3,
  'bluray-dual': 8 * 50 * 1000 ** 3,
} as const

export type DataUnit = keyof typeof data

/** Convert bits to bytes */
export function bitsToBytes(bits: number): number {
  return bits / 8
}

/** Convert bytes to bits */
export function bytesToBits(bytes: number): number {
  return bytes * 8
}

/* ========== UNIT OPTION ARRAYS ========== */
const D = data

/** Common data units */
export const dataUnitsCommon: UnitOption[] = [
  { id: 'bit', name: 'Bit', symbol: 'b', toBase: D.bit },
  { id: 'byte', name: 'Byte', symbol: 'B', toBase: D.byte },
  { id: 'kilobyte', name: 'Kilobyte', symbol: 'KB', toBase: D.kilobyte },
  { id: 'megabyte', name: 'Megabyte', symbol: 'MB', toBase: D.megabyte },
  { id: 'gigabyte', name: 'Gigabyte', symbol: 'GB', toBase: D.gigabyte },
  { id: 'terabyte', name: 'Terabyte', symbol: 'TB', toBase: D.terabyte },
]

/** Full data units for converter */
export const dataUnitsFull: UnitOption[] = [
  { id: 'bit', name: 'Bit', symbol: 'b', toBase: D.bit },
  { id: 'kilobit', name: 'Kilobit', symbol: 'kb', toBase: D.kilobit },
  { id: 'megabit', name: 'Megabit', symbol: 'Mb', toBase: D.megabit },
  { id: 'gigabit', name: 'Gigabit', symbol: 'Gb', toBase: D.gigabit },
  { id: 'terabit', name: 'Terabit', symbol: 'Tb', toBase: D.terabit },
  { id: 'petabit', name: 'Petabit', symbol: 'Pb', toBase: D.petabit },
  { id: 'kibibit', name: 'Kibibit', symbol: 'Kib', toBase: D.kibibit },
  { id: 'mebibit', name: 'Mebibit', symbol: 'Mib', toBase: D.mebibit },
  { id: 'gibibit', name: 'Gibibit', symbol: 'Gib', toBase: D.gibibit },
  { id: 'tebibit', name: 'Tebibit', symbol: 'Tib', toBase: D.tebibit },
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
  { id: 'kibibyte', name: 'Kibibyte', symbol: 'KiB', toBase: D.kibibyte },
  { id: 'mebibyte', name: 'Mebibyte', symbol: 'MiB', toBase: D.mebibyte },
  { id: 'gibibyte', name: 'Gibibyte', symbol: 'GiB', toBase: D.gibibyte },
  { id: 'tebibyte', name: 'Tebibyte', symbol: 'TiB', toBase: D.tebibyte },
  { id: 'pebibyte', name: 'Pebibyte', symbol: 'PiB', toBase: D.pebibyte },
  { id: 'exbibyte', name: 'Exbibyte', symbol: 'EiB', toBase: D.exbibyte },
  { id: 'word-16', name: 'Word (16-bit)', symbol: 'word₁₆', toBase: D['word-16'] },
  { id: 'word-32', name: 'Word (32-bit)', symbol: 'word₃₂', toBase: D['word-32'] },
  { id: 'word-64', name: 'Word (64-bit)', symbol: 'word₆₄', toBase: D['word-64'] },
]

/** Default data unit */
export const defaultDataUnit: UnitOption = { id: 'byte', name: 'Byte', symbol: 'B', toBase: 8 }
