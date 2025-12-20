import type { ConverterConfig } from '../../types'
import { time } from '../../base/time'
import { SPEED_OF_LIGHT } from '../../base/constants'
import { deriveFrequency } from '../../base/derived'

/**
 * Frequency Converter - Derived from 1 / Time (f = 1 / T)
 * Base unit: Hertz (Hz = 1/s = s⁻¹)
 * 
 * Formula: frequency_toBase = 1 / time_toBase
 */

const T = time

/* Hertz: 1 Hz = 1 cycle per second */
const hertz = deriveFrequency(T.second)

export const frequencyConverter: ConverterConfig = {
  type: 'converter',
  name: 'Frequency Converter',
  description: 'Convert between frequency units including Hertz, RPM, radians per second, and beats per minute',
  category: 'Unit Conversion',
  icon: 'radio',
  keywords: ['frequency', 'hertz', 'rpm', 'radian', 'cycle', 'oscillation'],
  defaultFromUnit: 'hertz',
  defaultToUnit: 'rpm',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI - Hertz (cycles per second) */
    { id: 'picohertz', name: 'Picohertz', symbol: 'pHz', toBase: hertz * 1e-12 },
    { id: 'nanohertz', name: 'Nanohertz', symbol: 'nHz', toBase: hertz * 1e-9 },
    { id: 'microhertz', name: 'Microhertz', symbol: 'μHz', toBase: hertz * 1e-6 },
    { id: 'millihertz', name: 'Millihertz', symbol: 'mHz', toBase: hertz * 0.001 },
    { id: 'hertz', name: 'Hertz', symbol: 'Hz', toBase: hertz },
    { id: 'kilohertz', name: 'Kilohertz', symbol: 'kHz', toBase: hertz * 1000 },
    { id: 'megahertz', name: 'Megahertz', symbol: 'MHz', toBase: hertz * 1e6 },
    { id: 'gigahertz', name: 'Gigahertz', symbol: 'GHz', toBase: hertz * 1e9 },
    { id: 'terahertz', name: 'Terahertz', symbol: 'THz', toBase: hertz * 1e12 },
    { id: 'petahertz', name: 'Petahertz', symbol: 'PHz', toBase: hertz * 1e15 },
    
    /* Rotational - derived from cycles per time */
    { id: 'rpm', name: 'Revolutions per Minute', symbol: 'rpm', toBase: deriveFrequency(T.minute) },
    { id: 'rps', name: 'Revolutions per Second', symbol: 'rps', toBase: deriveFrequency(T.second) },
    { id: 'rph', name: 'Revolutions per Hour', symbol: 'rph', toBase: deriveFrequency(T.hour) },
    { id: 'rpd', name: 'Revolutions per Day', symbol: 'rpd', toBase: deriveFrequency(T.day) },
    
    /* Angular - derived from radians per time */
    { id: 'radian-per-second', name: 'Radian per Second', symbol: 'rad/s', toBase: hertz / (2 * Math.PI) },
    { id: 'radian-per-minute', name: 'Radian per Minute', symbol: 'rad/min', toBase: deriveFrequency(T.minute) / (2 * Math.PI) },
    { id: 'radian-per-hour', name: 'Radian per Hour', symbol: 'rad/h', toBase: deriveFrequency(T.hour) / (2 * Math.PI) },
    { id: 'degree-per-second', name: 'Degree per Second', symbol: '°/s', toBase: hertz / 360 },
    { id: 'degree-per-minute', name: 'Degree per Minute', symbol: '°/min', toBase: deriveFrequency(T.minute) / 360 },
    { id: 'degree-per-hour', name: 'Degree per Hour', symbol: '°/h', toBase: deriveFrequency(T.hour) / 360 },
    
    /* Period-based */
    { id: 'cycle-per-second', name: 'Cycle per Second', symbol: 'cps', toBase: hertz },
    { id: 'cycle-per-minute', name: 'Cycle per Minute', symbol: 'cpm', toBase: deriveFrequency(T.minute) },
    { id: 'cycle-per-hour', name: 'Cycle per Hour', symbol: 'cph', toBase: deriveFrequency(T.hour) },
    
    /* Audio/Music */
    { id: 'beats-per-minute', name: 'Beats per Minute', symbol: 'BPM', toBase: deriveFrequency(T.minute) },
    { id: 'actions-per-minute', name: 'Actions per Minute', symbol: 'APM', toBase: deriveFrequency(T.minute) },
    
    /* Computing */
    { id: 'frames-per-second', name: 'Frames per Second', symbol: 'fps', toBase: hertz },
    
    /* Wavelength (using speed of light c = f × λ → f = c / λ) */
    { id: 'per-meter', name: 'Per Meter (wavelength)', symbol: '/m', toBase: SPEED_OF_LIGHT },
    { id: 'per-centimeter', name: 'Per Centimeter (wavenumber)', symbol: 'cm⁻¹', toBase: SPEED_OF_LIGHT * 100 },
  ],
}

