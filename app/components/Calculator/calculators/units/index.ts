/**
 * Centralized Unit Definitions
 * 
 * This module exports:
 * - Raw conversion factor objects (e.g., length, mass, time)
 * - UnitOption arrays for UI components (Common and Full sets)
 * - Default unit objects
 * - Helper functions (deriveArea, deriveVolume, etc.)
 */

/* Types */
export * from './types'

/* Length - Base unit: meter */
export {
  length,
  type LengthUnit,
  lengthUnitsCommon,
  lengthUnitsFull,
  defaultLengthUnit,
} from './length'

/* Time - Base unit: second */
export {
  time,
  type TimeUnit,
  timeUnitsCommon,
  timeUnitsFull,
  defaultTimeUnit,
} from './time'

/* Mass - Base unit: kilogram */
export {
  mass,
  type MassUnit,
  massUnitsCommon,
  massUnitsFull,
  defaultMassUnit,
} from './mass'

/* Angle - Base unit: radian */
export {
  angle,
  type AngleUnit,
  angleUnitsCommon,
  angleUnitsFull,
  defaultAngleUnit,
  toDegrees,
  toRadians,
} from './angle'

/* Data - Base unit: bit */
export {
  data,
  type DataUnit,
  dataUnitsCommon,
  dataUnitsFull,
  defaultDataUnit,
  bitsToBytes,
  bytesToBits,
} from './data'

/* Area - Derived from length² */
export {
  deriveArea,
  areaUnitsCommon,
  areaUnitsFull,
  defaultAreaUnit,
} from './area'

/* Volume - Derived from length³ */
export {
  deriveVolume,
  volumeUnitsCommon,
  volumeUnitsFull,
  defaultVolumeUnit,
} from './volume'

/* Electrical Units */
export {
  /* Current */
  current,
  type CurrentUnit,
  currentUnitsCommon,
  currentUnitsFull,
  defaultCurrentUnit,
  /* Voltage */
  voltage,
  type VoltageUnit,
  voltageUnitsCommon,
  voltageUnitsFull,
  defaultVoltageUnit,
  /* Resistance */
  resistance,
  type ResistanceUnit,
  resistanceUnitsCommon,
  resistanceUnitsFull,
  defaultResistanceUnit,
  /* Capacitance */
  capacitance,
  type CapacitanceUnit,
  capacitanceUnitsCommon,
  capacitanceUnitsFull,
  defaultCapacitanceUnit,
  /* Inductance */
  inductance,
  type InductanceUnit,
  inductanceUnitsCommon,
  inductanceUnitsFull,
  defaultInductanceUnit,
} from './electrical'

/* Temperature - Base unit: Kelvin (special non-linear conversions) */
export {
  CELSIUS_OFFSET,
  FAHRENHEIT_OFFSET,
  toKelvin,
  fromKelvin,
  convertTemperature,
  convertTempDelta,
  type TemperatureUnitOption,
  temperatureUnitsCommon,
  temperatureUnitsFull,
  defaultTemperatureUnit,
} from './temperature'

/* Physical Constants */
export * from './constants'

/* Derived Unit Helpers */
export {
  deriveSpeed,
  deriveAcceleration,
  deriveForce,
  deriveEnergy,
  deriveEnergyDirect,
  derivePower,
  derivePressure,
  deriveDensity,
  deriveTorque,
  deriveVolumetricFlowRate,
  deriveMassFlowRate,
  deriveFrequency,
  deriveAngularVelocity,
  deriveDataRate,
  deriveSpecificHeat,
  deriveViscosity,
  deriveKinematicViscosity,
} from './derived'
