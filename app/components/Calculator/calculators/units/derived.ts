/**
 * Helper functions for deriving compound units from base units
 * Note: deriveArea and deriveVolume are defined in area.ts and volume.ts respectively
 */

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
 */
export function deriveForce(massToBase: number, lengthToBase: number, timeToBase: number): number {
  return massToBase * lengthToBase / (timeToBase * timeToBase)
}

/**
 * Derive energy units from force and length (force × length)
 * Base: Joule = N × m
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
 */
export function derivePower(energyToBase: number, timeToBase: number): number {
  return energyToBase / timeToBase
}

/**
 * Derive pressure/stress units from force and area (force/area)
 * Base: Pascal = N/m²
 */
export function derivePressure(forceToBase: number, areaToBase: number): number {
  return forceToBase / areaToBase
}

/**
 * Derive density units from mass and volume (mass/volume)
 * Base: kg/m³
 */
export function deriveDensity(massToBase: number, volumeToBase: number): number {
  return massToBase / volumeToBase
}

/**
 * Derive torque units from force and length (force × length)
 * Base: Newton-meter (same dimension as energy but different physical meaning)
 */
export function deriveTorque(forceToBase: number, lengthToBase: number): number {
  return forceToBase * lengthToBase
}

/**
 * Derive flow rate (volumetric) from volume and time (volume/time)
 * Base: m³/s
 */
export function deriveVolumetricFlowRate(volumeToBase: number, timeToBase: number): number {
  return volumeToBase / timeToBase
}

/**
 * Derive mass flow rate from mass and time (mass/time)
 * Base: kg/s
 */
export function deriveMassFlowRate(massToBase: number, timeToBase: number): number {
  return massToBase / timeToBase
}

/**
 * Derive frequency from time (1/time)
 * Base: Hertz = 1/s
 */
export function deriveFrequency(timeToBase: number): number {
  return 1 / timeToBase
}

/**
 * Derive angular velocity from angle and time (angle/time)
 * Base: rad/s
 */
export function deriveAngularVelocity(angleToBase: number, timeToBase: number): number {
  return angleToBase / timeToBase
}

/**
 * Derive data transfer rate from data and time (data/time)
 * Base: bit/s
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

