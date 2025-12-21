/**
 * Air Properties for Duct Sizing Calculations
 * Based on standard atmospheric conditions
 */

import type { AirCondition } from './types'

/* ========== STANDARD AIR CONDITIONS ========== */

export const airConditions: AirCondition[] = [
  {
    id: 'air-20c-stp',
    name: '20°C Air STP',
    temperature: 20,
    relativeHumidity: 50,
    pressure: 101.325,
    density: 1.2014,
    viscosity: 0.0643, /* kg/(m·h) = 1.786e-5 Pa·s */
    specificHeat: 1.0048,
  },
  {
    id: 'air-13c-97rh',
    name: '13°C Air at 97% RH and 1 atm',
    temperature: 13,
    relativeHumidity: 97,
    pressure: 101.325,
    density: 1.235,
    viscosity: 0.0625,
    specificHeat: 1.006,
  },
  {
    id: 'air-25c-50rh',
    name: '25°C Air at 50% RH and 1 atm',
    temperature: 25,
    relativeHumidity: 50,
    pressure: 101.325,
    density: 1.184,
    viscosity: 0.0660,
    specificHeat: 1.007,
  },
  {
    id: 'air-37c-23rh',
    name: '37°C Air at 23% RH and 1 atm',
    temperature: 37,
    relativeHumidity: 23,
    pressure: 101.325,
    density: 1.128,
    viscosity: 0.0695,
    specificHeat: 1.008,
  },
  {
    id: 'air-52c-11rh',
    name: '52°C Air at 11% RH and 1 atm',
    temperature: 52,
    relativeHumidity: 11,
    pressure: 101.325,
    density: 1.066,
    viscosity: 0.0734,
    specificHeat: 1.009,
  },
]

/* ========== AIR PROPERTY CALCULATIONS ========== */

/**
 * Calculate air density from temperature and pressure
 * Using ideal gas law: ρ = P / (R * T)
 * @param tempC - Temperature in °C
 * @param pressureKPa - Pressure in kPa (default: 101.325 = 1 atm)
 * @returns Density in kg/m³
 */
export function calculateAirDensity(tempC: number, pressureKPa = 101.325): number {
  const R = 287.05 /* J/(kg·K) - specific gas constant for air */
  const T = tempC + 273.15 /* Convert to Kelvin */
  return (pressureKPa * 1000) / (R * T)
}

/**
 * Calculate dynamic viscosity of air
 * Using Sutherland's formula
 * @param tempC - Temperature in °C
 * @returns Dynamic viscosity in Pa·s
 */
export function calculateAirViscosity(tempC: number): number {
  const T = tempC + 273.15 /* Kelvin */
  const T0 = 273.15 /* Reference temperature */
  const mu0 = 1.716e-5 /* Reference viscosity at T0 in Pa·s */
  const S = 110.4 /* Sutherland constant for air */
  
  return mu0 * Math.pow(T / T0, 1.5) * (T0 + S) / (T + S)
}

/**
 * Calculate kinematic viscosity
 * @param tempC - Temperature in °C
 * @param pressureKPa - Pressure in kPa
 * @returns Kinematic viscosity in m²/s
 */
export function calculateKinematicViscosity(tempC: number, pressureKPa = 101.325): number {
  const density = calculateAirDensity(tempC, pressureKPa)
  const dynamicViscosity = calculateAirViscosity(tempC)
  return dynamicViscosity / density
}

/**
 * Calculate specific heat of air (approximately constant for typical HVAC temps)
 * @param tempC - Temperature in °C
 * @returns Specific heat in kJ/(kg·°C)
 */
export function calculateSpecificHeat(tempC: number): number {
  /* Cp varies slightly with temperature, use linear approximation */
  /* At 0°C: 1.005, at 100°C: 1.009 */
  return 1.005 + (tempC / 100) * 0.004
}

/**
 * Get air properties for given conditions
 */
export function getAirProperties(tempC: number, pressureKPa = 101.325): {
  density: number
  dynamicViscosity: number
  kinematicViscosity: number
  specificHeat: number
} {
  return {
    density: calculateAirDensity(tempC, pressureKPa),
    dynamicViscosity: calculateAirViscosity(tempC),
    kinematicViscosity: calculateKinematicViscosity(tempC, pressureKPa),
    specificHeat: calculateSpecificHeat(tempC),
  }
}

/** Get air condition by ID */
export function getAirCondition(id: string): AirCondition | undefined {
  return airConditions.find(a => a.id === id)
}

/** Default air condition */
export const defaultAirCondition = airConditions[0]!

