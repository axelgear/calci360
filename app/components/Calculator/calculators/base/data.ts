/**
 * Digital Data/Information Units (base: bit)
 * All values represent conversion factor TO bits
 */

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
  nibble: 4, /* half byte */
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

  /* Legacy / Informal (using binary interpretation) */
  'kilobyte-binary': 8 * 1024, /* KB as traditionally used */
  'megabyte-binary': 8 * 1024 ** 2,
  'gigabyte-binary': 8 * 1024 ** 3,
  'terabyte-binary': 8 * 1024 ** 4,

  /* Words (architecture dependent, common sizes) */
  'word-16': 16,
  'word-32': 32,
  'word-64': 64,
  'word-128': 128,

  /* Storage Media (informal) */
  'floppy-1440': 8 * 1474560, /* 1.44 MB floppy */
  'cd-700': 8 * 700 * 1000 ** 2, /* 700 MB CD */
  'dvd-single': 8 * 4.7 * 1000 ** 3, /* 4.7 GB DVD */
  'dvd-dual': 8 * 8.5 * 1000 ** 3, /* 8.5 GB DVD-DL */
  'bluray-single': 8 * 25 * 1000 ** 3, /* 25 GB Blu-ray */
  'bluray-dual': 8 * 50 * 1000 ** 3, /* 50 GB Blu-ray */
} as const

export type DataUnit = keyof typeof data

/**
 * Convert bits to bytes
 */
export function bitsToBytes(bits: number): number {
  return bits / 8
}

/**
 * Convert bytes to bits
 */
export function bytesToBits(bytes: number): number {
  return bytes * 8
}

