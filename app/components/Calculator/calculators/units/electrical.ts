/**
 * Electrical Unit Definitions
 * Includes: Current, Voltage, Resistance, Capacitance, Inductance
 */

import type { UnitOption } from './types'

/* =====================================================================
 * ELECTRICAL CURRENT
 * Base: Ampere (A) - SI base unit
 * ===================================================================== */

export const current = {
  ampere: 1,
  milliampere: 0.001,
  microampere: 1e-6,
  nanoampere: 1e-9,
  kiloampere: 1000,
  abampere: 10,
  statampere: 3.33564e-10,
} as const

export type CurrentUnit = keyof typeof current

const C = current

export const currentUnitsCommon: UnitOption[] = [
  { id: 'ampere', name: 'Ampere', symbol: 'A', toBase: C.ampere },
  { id: 'milliampere', name: 'Milliampere', symbol: 'mA', toBase: C.milliampere },
  { id: 'microampere', name: 'Microampere', symbol: 'μA', toBase: C.microampere },
  { id: 'kiloampere', name: 'Kiloampere', symbol: 'kA', toBase: C.kiloampere },
]

export const currentUnitsFull: UnitOption[] = [
  { id: 'ampere', name: 'Ampere', symbol: 'A', toBase: C.ampere },
  { id: 'milliampere', name: 'Milliampere', symbol: 'mA', toBase: C.milliampere },
  { id: 'microampere', name: 'Microampere', symbol: 'μA', toBase: C.microampere },
  { id: 'nanoampere', name: 'Nanoampere', symbol: 'nA', toBase: C.nanoampere },
  { id: 'kiloampere', name: 'Kiloampere', symbol: 'kA', toBase: C.kiloampere },
  { id: 'abampere', name: 'Abampere', symbol: 'abA', toBase: C.abampere },
  { id: 'statampere', name: 'Statampere', symbol: 'statA', toBase: C.statampere },
]

export const defaultCurrentUnit: UnitOption = { id: 'ampere', name: 'Ampere', symbol: 'A', toBase: 1 }


/* =====================================================================
 * ELECTRICAL VOLTAGE
 * Base: Volt (V) - SI derived unit
 * ===================================================================== */

export const voltage = {
  volt: 1,
  millivolt: 0.001,
  microvolt: 1e-6,
  nanovolt: 1e-9,
  kilovolt: 1000,
  megavolt: 1e6,
  abvolt: 1e-8,
  statvolt: 299.792458,
} as const

export type VoltageUnit = keyof typeof voltage

const V = voltage

export const voltageUnitsCommon: UnitOption[] = [
  { id: 'volt', name: 'Volt', symbol: 'V', toBase: V.volt },
  { id: 'millivolt', name: 'Millivolt', symbol: 'mV', toBase: V.millivolt },
  { id: 'microvolt', name: 'Microvolt', symbol: 'μV', toBase: V.microvolt },
  { id: 'kilovolt', name: 'Kilovolt', symbol: 'kV', toBase: V.kilovolt },
]

export const voltageUnitsFull: UnitOption[] = [
  { id: 'volt', name: 'Volt', symbol: 'V', toBase: V.volt },
  { id: 'millivolt', name: 'Millivolt', symbol: 'mV', toBase: V.millivolt },
  { id: 'microvolt', name: 'Microvolt', symbol: 'μV', toBase: V.microvolt },
  { id: 'nanovolt', name: 'Nanovolt', symbol: 'nV', toBase: V.nanovolt },
  { id: 'kilovolt', name: 'Kilovolt', symbol: 'kV', toBase: V.kilovolt },
  { id: 'megavolt', name: 'Megavolt', symbol: 'MV', toBase: V.megavolt },
  { id: 'abvolt', name: 'Abvolt', symbol: 'abV', toBase: V.abvolt },
  { id: 'statvolt', name: 'Statvolt', symbol: 'statV', toBase: V.statvolt },
]

export const defaultVoltageUnit: UnitOption = { id: 'volt', name: 'Volt', symbol: 'V', toBase: 1 }


/* =====================================================================
 * ELECTRICAL RESISTANCE
 * Base: Ohm (Ω) - SI derived unit
 * ===================================================================== */

export const resistance = {
  ohm: 1,
  milliohm: 0.001,
  microohm: 1e-6,
  kiloohm: 1000,
  megaohm: 1e6,
  gigaohm: 1e9,
  abohm: 1e-9,
  statohm: 8.98755e11,
} as const

export type ResistanceUnit = keyof typeof resistance

const R = resistance

export const resistanceUnitsCommon: UnitOption[] = [
  { id: 'ohm', name: 'Ohm', symbol: 'Ω', toBase: R.ohm },
  { id: 'milliohm', name: 'Milliohm', symbol: 'mΩ', toBase: R.milliohm },
  { id: 'kiloohm', name: 'Kiloohm', symbol: 'kΩ', toBase: R.kiloohm },
  { id: 'megaohm', name: 'Megaohm', symbol: 'MΩ', toBase: R.megaohm },
]

export const resistanceUnitsFull: UnitOption[] = [
  { id: 'ohm', name: 'Ohm', symbol: 'Ω', toBase: R.ohm },
  { id: 'milliohm', name: 'Milliohm', symbol: 'mΩ', toBase: R.milliohm },
  { id: 'microohm', name: 'Microohm', symbol: 'μΩ', toBase: R.microohm },
  { id: 'kiloohm', name: 'Kiloohm', symbol: 'kΩ', toBase: R.kiloohm },
  { id: 'megaohm', name: 'Megaohm', symbol: 'MΩ', toBase: R.megaohm },
  { id: 'gigaohm', name: 'Gigaohm', symbol: 'GΩ', toBase: R.gigaohm },
  { id: 'abohm', name: 'Abohm', symbol: 'abΩ', toBase: R.abohm },
  { id: 'statohm', name: 'Statohm', symbol: 'statΩ', toBase: R.statohm },
]

export const defaultResistanceUnit: UnitOption = { id: 'ohm', name: 'Ohm', symbol: 'Ω', toBase: 1 }


/* =====================================================================
 * ELECTRICAL CAPACITANCE
 * Base: Farad (F) - SI derived unit
 * ===================================================================== */

export const capacitance = {
  farad: 1,
  millifarad: 0.001,
  microfarad: 1e-6,
  nanofarad: 1e-9,
  picofarad: 1e-12,
  abfarad: 1e9,
  statfarad: 1.112650e-12,
} as const

export type CapacitanceUnit = keyof typeof capacitance

const Cap = capacitance

export const capacitanceUnitsCommon: UnitOption[] = [
  { id: 'farad', name: 'Farad', symbol: 'F', toBase: Cap.farad },
  { id: 'microfarad', name: 'Microfarad', symbol: 'μF', toBase: Cap.microfarad },
  { id: 'nanofarad', name: 'Nanofarad', symbol: 'nF', toBase: Cap.nanofarad },
  { id: 'picofarad', name: 'Picofarad', symbol: 'pF', toBase: Cap.picofarad },
]

export const capacitanceUnitsFull: UnitOption[] = [
  { id: 'farad', name: 'Farad', symbol: 'F', toBase: Cap.farad },
  { id: 'millifarad', name: 'Millifarad', symbol: 'mF', toBase: Cap.millifarad },
  { id: 'microfarad', name: 'Microfarad', symbol: 'μF', toBase: Cap.microfarad },
  { id: 'nanofarad', name: 'Nanofarad', symbol: 'nF', toBase: Cap.nanofarad },
  { id: 'picofarad', name: 'Picofarad', symbol: 'pF', toBase: Cap.picofarad },
  { id: 'abfarad', name: 'Abfarad', symbol: 'abF', toBase: Cap.abfarad },
  { id: 'statfarad', name: 'Statfarad', symbol: 'statF', toBase: Cap.statfarad },
]

export const defaultCapacitanceUnit: UnitOption = { id: 'farad', name: 'Farad', symbol: 'F', toBase: 1 }


/* =====================================================================
 * ELECTRICAL INDUCTANCE
 * Base: Henry (H) - SI derived unit
 * ===================================================================== */

export const inductance = {
  henry: 1,
  millihenry: 0.001,
  microhenry: 1e-6,
  nanohenry: 1e-9,
  kilohenry: 1000,
  abhenry: 1e-9,
  stathenry: 8.98755e11,
} as const

export type InductanceUnit = keyof typeof inductance

const Ind = inductance

export const inductanceUnitsCommon: UnitOption[] = [
  { id: 'henry', name: 'Henry', symbol: 'H', toBase: Ind.henry },
  { id: 'millihenry', name: 'Millihenry', symbol: 'mH', toBase: Ind.millihenry },
  { id: 'microhenry', name: 'Microhenry', symbol: 'μH', toBase: Ind.microhenry },
]

export const inductanceUnitsFull: UnitOption[] = [
  { id: 'henry', name: 'Henry', symbol: 'H', toBase: Ind.henry },
  { id: 'millihenry', name: 'Millihenry', symbol: 'mH', toBase: Ind.millihenry },
  { id: 'microhenry', name: 'Microhenry', symbol: 'μH', toBase: Ind.microhenry },
  { id: 'nanohenry', name: 'Nanohenry', symbol: 'nH', toBase: Ind.nanohenry },
  { id: 'kilohenry', name: 'Kilohenry', symbol: 'kH', toBase: Ind.kilohenry },
  { id: 'abhenry', name: 'Abhenry', symbol: 'abH', toBase: Ind.abhenry },
  { id: 'stathenry', name: 'Stathenry', symbol: 'statH', toBase: Ind.stathenry },
]

export const defaultInductanceUnit: UnitOption = { id: 'henry', name: 'Henry', symbol: 'H', toBase: 1 }
