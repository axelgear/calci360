/**
 * Helper functions for deriving compound units from base units
 */

/**
 * Derive area units from length (length²)
 * @param lengthToBase - length conversion factor to base (meters)
 * @returns area conversion factor to base (square meters)
 */
export function deriveArea(lengthToBase: number): number {
  return lengthToBase * lengthToBase
}

/**
 * Derive volume units from length (length³)
 * @param lengthToBase - length conversion factor to base (meters)
 * @returns volume conversion factor to base (cubic meters)
 */
export function deriveVolume(lengthToBase: number): number {
  return lengthToBase * lengthToBase * lengthToBase
}

/**
 * Derive speed units from length and time (length/time)
 * @param lengthToBase - length conversion factor to base (meters)
 * @param timeToBase - time conversion factor to base (seconds)
 * @returns speed conversion factor to base (m/s)
 */
export function deriveSpeed(lengthToBase: number, timeToBase: number): number {
  return lengthToBase / timeToBase
}

/**
 * Derive acceleration units from length and time (length/time²)
 * @param lengthToBase - length conversion factor to base (meters)
 * @param timeToBase - time conversion factor to base (seconds)
 * @returns acceleration conversion factor to base (m/s²)
 */
export function deriveAcceleration(lengthToBase: number, timeToBase: number): number {
  return lengthToBase / (timeToBase * timeToBase)
}

/**
 * Derive force units from mass, length, and time (mass × length/time²)
 * Base: Newton = kg × m/s²
 * @param massToBase - mass conversion factor to base (kg)
 * @param lengthToBase - length conversion factor to base (m)
 * @param timeToBase - time conversion factor to base (s)
 * @returns force conversion factor to base (N)
 */
export function deriveForce(massToBase: number, lengthToBase: number, timeToBase: number): number {
  return massToBase * lengthToBase / (timeToBase * timeToBase)
}

/**
 * Derive energy units from force and length (force × length)
 * Base: Joule = N × m
 * @param forceToBase - force conversion factor to base (N)
 * @param lengthToBase - length conversion factor to base (m)
 * @returns energy conversion factor to base (J)
 */
export function deriveEnergy(forceToBase: number, lengthToBase: number): number {
  return forceToBase * lengthToBase
}

/**
 * Derive energy directly from mass, length, and time
 * Base: Joule = kg × m²/s²
 */
export function deriveEnergyDirect(massToBase: number, lengthToBase: number, timeToBase: number): number {
  return massToBase * lengthToBase * lengthToBase / (timeToBase * timeToBase)
}

/**
 * Derive power units from energy and time (energy/time)
 * Base: Watt = J/s
 * @param energyToBase - energy conversion factor to base (J)
 * @param timeToBase - time conversion factor to base (s)
 * @returns power conversion factor to base (W)
 */
export function derivePower(energyToBase: number, timeToBase: number): number {
  return energyToBase / timeToBase
}

/**
 * Derive pressure/stress units from force and area (force/area)
 * Base: Pascal = N/m²
 * @param forceToBase - force conversion factor to base (N)
 * @param areaToBase - area conversion factor to base (m²)
 * @returns pressure conversion factor to base (Pa)
 */
export function derivePressure(forceToBase: number, areaToBase: number): number {
  return forceToBase / areaToBase
}

/**
 * Derive density units from mass and volume (mass/volume)
 * Base: kg/m³
 * @param massToBase - mass conversion factor to base (kg)
 * @param volumeToBase - volume conversion factor to base (m³)
 * @returns density conversion factor to base (kg/m³)
 */
export function deriveDensity(massToBase: number, volumeToBase: number): number {
  return massToBase / volumeToBase
}

/**
 * Derive torque units from force and length (force × length)
 * Base: Newton-meter (same dimension as energy but different physical meaning)
 * @param forceToBase - force conversion factor to base (N)
 * @param lengthToBase - length conversion factor to base (m)
 * @returns torque conversion factor to base (N·m)
 */
export function deriveTorque(forceToBase: number, lengthToBase: number): number {
  return forceToBase * lengthToBase
}

/**
 * Derive flow rate (volumetric) from volume and time (volume/time)
 * Base: m³/s
 * @param volumeToBase - volume conversion factor to base (m³)
 * @param timeToBase - time conversion factor to base (s)
 * @returns flow rate conversion factor to base (m³/s)
 */
export function deriveVolumetricFlowRate(volumeToBase: number, timeToBase: number): number {
  return volumeToBase / timeToBase
}

/**
 * Derive mass flow rate from mass and time (mass/time)
 * Base: kg/s
 * @param massToBase - mass conversion factor to base (kg)
 * @param timeToBase - time conversion factor to base (s)
 * @returns mass flow rate conversion factor to base (kg/s)
 */
export function deriveMassFlowRate(massToBase: number, timeToBase: number): number {
  return massToBase / timeToBase
}

/**
 * Derive frequency from time (1/time)
 * Base: Hertz = 1/s
 * @param timeToBase - time conversion factor to base (s)
 * @returns frequency conversion factor to base (Hz)
 */
export function deriveFrequency(timeToBase: number): number {
  return 1 / timeToBase
}

/**
 * Derive angular velocity from angle and time (angle/time)
 * Base: rad/s
 * @param angleToBase - angle conversion factor to base (rad)
 * @param timeToBase - time conversion factor to base (s)
 * @returns angular velocity conversion factor to base (rad/s)
 */
export function deriveAngularVelocity(angleToBase: number, timeToBase: number): number {
  return angleToBase / timeToBase
}

/**
 * Derive data transfer rate from data and time (data/time)
 * Base: bit/s
 * @param dataToBase - data conversion factor to base (bits)
 * @param timeToBase - time conversion factor to base (s)
 * @returns data rate conversion factor to base (bit/s)
 */
export function deriveDataRate(dataToBase: number, timeToBase: number): number {
  return dataToBase / timeToBase
}

/**
 * Derive specific heat capacity from energy, mass, and temperature
 * Base: J/(kg·K)
 */
export function deriveSpecificHeat(energyToBase: number, massToBase: number): number {
  return energyToBase / massToBase
}

/**
 * Derive viscosity (dynamic) from pressure and time
 * Base: Pa·s
 */
export function deriveViscosity(pressureToBase: number, timeToBase: number): number {
  return pressureToBase * timeToBase
}

/**
 * Derive kinematic viscosity from area and time
 * Base: m²/s
 */
export function deriveKinematicViscosity(areaToBase: number, timeToBase: number): number {
  return areaToBase / timeToBase
}

