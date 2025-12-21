import type { ConverterConfig } from '../../types'

/**
 * Thermal Conductivity Converter
 * Base unit: Watt per meter-Kelvin (W/(m·K))
 */
export const thermalConductivityConverter: ConverterConfig = {
  type: 'converter',
  name: 'Thermal Conductivity Converter',
  description: 'Convert between thermal conductivity units including watts per meter-kelvin and BTU per hour-foot-degree Fahrenheit',
  category: 'Specialized',
  icon: 'device_thermostat',
  keywords: ['thermal', 'conductivity', 'heat', 'transfer', 'insulation', 'temperature'],
  defaultFromUnit: 'watt-per-meter-kelvin',
  defaultToUnit: 'btu-per-hour-foot-fahrenheit',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI Units */
    { id: 'watt-per-meter-kelvin', name: 'Watt per m·K', symbol: 'W/(m·K)', toBase: 1 },
    { id: 'watt-per-cm-kelvin', name: 'Watt per cm·K', symbol: 'W/(cm·K)', toBase: 100 },
    { id: 'kilowatt-per-meter-kelvin', name: 'Kilowatt per m·K', symbol: 'kW/(m·K)', toBase: 1000 },
    
    /* CGS / Other */
    { id: 'cal-per-s-cm-celsius', name: 'Cal per s·cm·°C', symbol: 'cal/(s·cm·°C)', toBase: 418.4 },
    
    /* Imperial */
    { id: 'btu-per-hour-foot-fahrenheit', name: 'BTU per h·ft·°F', symbol: 'BTU/(h·ft·°F)', toBase: 1.731 },
    { id: 'btu-inch-per-hour-ft2-fahrenheit', name: 'BTU·in per h·ft²·°F', symbol: 'BTU·in/(h·ft²·°F)', toBase: 0.144228 },
  ],
}


