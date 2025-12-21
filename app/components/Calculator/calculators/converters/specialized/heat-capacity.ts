import type { ConverterConfig } from '../../types'

/**
 * Heat Capacity Converter (Specific Heat Capacity)
 * Base unit: Joule per kilogram-Kelvin (J/(kg·K))
 */
export const heatCapacityConverter: ConverterConfig = {
  type: 'converter',
  name: 'Heat Capacity Converter',
  description: 'Convert between specific heat capacity units including joules per kilogram-kelvin and BTU per pound-degree Fahrenheit',
  category: 'Specialized',
  icon: 'local_fire_department',
  keywords: ['heat', 'capacity', 'specific', 'thermal', 'joule', 'BTU', 'calorie'],
  defaultFromUnit: 'joule-per-kg-kelvin',
  defaultToUnit: 'btu-per-lb-fahrenheit',
  precision: 6,
  showAllConversions: true,
  units: [
    /* SI Units */
    { id: 'joule-per-kg-kelvin', name: 'Joule per kg·K', symbol: 'J/(kg·K)', toBase: 1 },
    { id: 'kilojoule-per-kg-kelvin', name: 'Kilojoule per kg·K', symbol: 'kJ/(kg·K)', toBase: 1000 },
    
    /* CGS / Other */
    { id: 'calorie-per-g-kelvin', name: 'Calorie per g·K', symbol: 'cal/(g·K)', toBase: 4184 },
    { id: 'kilocalorie-per-kg-kelvin', name: 'Kilocalorie per kg·K', symbol: 'kcal/(kg·K)', toBase: 4184 },
    
    /* Imperial */
    { id: 'btu-per-lb-fahrenheit', name: 'BTU per lb·°F', symbol: 'BTU/(lb·°F)', toBase: 4186.8 },
    { id: 'btu-per-lb-rankine', name: 'BTU per lb·°R', symbol: 'BTU/(lb·°R)', toBase: 4186.8 },
  ],
}


