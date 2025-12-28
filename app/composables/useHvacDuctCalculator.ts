import { ref, computed, reactive, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * HVAC Duct Temperature Loss Calculator Composable
 * 
 * Calculates exit air temperature based on:
 * - Duct geometry (round or rectangular)
 * - Air flow parameters
 * - Insulation properties
 * - Ambient conditions
 * 
 * Heat Transfer Formula:
 * Q = U × A × ΔT_lm (Log Mean Temperature Difference)
 * 
 * Exit Temperature:
 * T_exit = T_ambient + (T_inlet - T_ambient) × exp(-NTU)
 * where NTU = U × A / (m_dot × c_p)
 */

import type { HvacDuctCalculatorConfig, DuctDefinition, InsulationMaterial, DuctInput } from '~/components/Calculator/calculators/hvac/types'
import {
  ductDefinitions,
  insulationMaterials,
  heatTransferCoefficients,
  exteriorConditions,
  getDuctDefinition,
  getInsulationMaterial,
  getExteriorCondition,
  defaultDuctType,
  defaultInsulation,
  defaultExteriorCondition,
} from '~/components/Calculator/calculators/hvac/ducts'
import {
  type UnitOption,
  lengthUnitsCommon as lengthUnits,
  defaultLengthUnit,
  temperatureUnitsFull as temperatureUnits,
  toKelvin,
  fromKelvin,
} from '~/components/Calculator/calculators/units'

/* Airflow units (base: m³/s) */
const airflowUnits: UnitOption[] = [
  { id: 'm3_s', name: 'Cubic Meters per Second', symbol: 'm³/s', toBase: 1 },
  { id: 'm3_h', name: 'Cubic Meters per Hour', symbol: 'm³/h', toBase: 1 / 3600 },
  { id: 'l_s', name: 'Liters per Second', symbol: 'L/s', toBase: 0.001 },
  { id: 'cfm', name: 'Cubic Feet per Minute', symbol: 'CFM', toBase: 0.000471947 },
]

/* Air velocity units (base: m/s) */
const velocityUnits: UnitOption[] = [
  { id: 'm_s', name: 'Meters per Second', symbol: 'm/s', toBase: 1 },
  { id: 'ft_min', name: 'Feet per Minute', symbol: 'ft/min', toBase: 0.00508 },
  { id: 'km_h', name: 'Kilometers per Hour', symbol: 'km/h', toBase: 1 / 3.6 },
]

/* Insulation thickness units (base: m) */
const thicknessUnits: UnitOption[] = [
  { id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: 0.001 },
  { id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: 0.01 },
  { id: 'inch', name: 'Inches', symbol: 'in', toBase: 0.0254 },
  { id: 'm', name: 'Meters', symbol: 'm', toBase: 1 },
]

/* Thermal conductivity units (base: W/(m·K)) */
const thermalConductivityUnits: UnitOption[] = [
  { id: 'w_mk', name: 'Watts per Meter-Kelvin', symbol: 'W/(m·K)', toBase: 1 },
  { id: 'btu_fthr_f', name: 'BTU per Foot-Hour-°F', symbol: 'BTU/(ft·h·°F)', toBase: 1.731 },
]

/* Heat transfer coefficient units (base: W/(m²·K)) */
const heatTransferUnits: UnitOption[] = [
  { id: 'w_m2k', name: 'Watts per Square Meter-Kelvin', symbol: 'W/(m²·K)', toBase: 1 },
  { id: 'btu_ft2hr_f', name: 'BTU per Square Foot-Hour-°F', symbol: 'BTU/(ft²·h·°F)', toBase: 5.678 },
]

/* Re-export for consumers */
export { lengthUnits, temperatureUnits, airflowUnits, velocityUnits, thicknessUnits, thermalConductivityUnits, heatTransferUnits, insulationMaterials, ductDefinitions, exteriorConditions }

/* Air properties at ~20°C */
const AIR_DENSITY = 1.2 /* kg/m³ */
const AIR_SPECIFIC_HEAT = 1006 /* J/(kg·K) */

export function useHvacDuctCalculator(config: Ref<HvacDuctCalculatorConfig>) {
  /* Duct type selection */
  const selectedDuctType = ref(defaultDuctType)
  const selectedDuct = computed<DuctDefinition | undefined>(() =>
    getDuctDefinition(selectedDuctType.value)
  )

  /* Insulation selection */
  const selectedInsulationId = ref(defaultInsulation)
  const selectedInsulation = computed<InsulationMaterial | undefined>(() =>
    getInsulationMaterial(selectedInsulationId.value)
  )

  /* Thermal conductivity - editable, syncs with insulation material (stored in display unit) */
  const customThermalConductivity = ref(0.04) /* display unit value */
  const thermalConductivityUnit = ref('w_mk')

  /* Get thermal conductivity unit object */
  const thermalConductivityUnitObj = computed((): UnitOption =>
    thermalConductivityUnits.find(u => u.id === thermalConductivityUnit.value) ?? thermalConductivityUnits[0]!
  )

  /* Sync thermal conductivity when insulation changes (convert to display unit) */
  watch(selectedInsulationId, () => {
    const kBase = selectedInsulation.value?.thermalConductivity ?? 0.04 /* W/(m·K) */
    customThermalConductivity.value = kBase / thermalConductivityUnitObj.value.toBase
  }, { immediate: true })

  /* Convert when unit changes */
  watch(thermalConductivityUnit, (newUnit: string, oldUnit: string) => {
    const oldUnitObj = thermalConductivityUnits.find(u => u.id === oldUnit)
    const newUnitObj = thermalConductivityUnits.find(u => u.id === newUnit)
    if (oldUnitObj && newUnitObj) {
      const valueInBase = customThermalConductivity.value * oldUnitObj.toBase
      customThermalConductivity.value = valueInBase / newUnitObj.toBase
    }
  })

  /* Check if k-value is custom (different from material default) */
  const isKValueCustom = computed(() => {
    const materialK = selectedInsulation.value?.thermalConductivity ?? 0.04
    const currentInBase = customThermalConductivity.value * thermalConductivityUnitObj.value.toBase
    return Math.abs(currentInBase - materialK) > 0.0001
  })

  /* Effective thermal conductivity in base unit W/(m·K) */
  const effectiveThermalConductivity = computed(() => 
    customThermalConductivity.value * thermalConductivityUnitObj.value.toBase
  )

  /* Exterior duct conditions */
  const selectedExteriorConditionId = ref(defaultExteriorCondition)
  const selectedExteriorCondition = computed(() =>
    getExteriorCondition(selectedExteriorConditionId.value)
  )

  /* Input values & units */
  const inputValues = reactive<Record<string, number>>({})
  const inputUnits = reactive<Record<string, string>>({})

  /* Temperature inputs */
  const inletTemp = ref(55) /* °C - typical supply air */
  const inletTempUnit = ref('celsius')
  const ambientTemp = ref(25) /* °C - typical ambient */
  const ambientTempUnit = ref('celsius')

  /* Heat transfer coefficients (stored in display unit) */
  const hInside = ref(heatTransferCoefficients.insideTypical) /* display unit value */
  const hInsideUnit = ref('w_m2k')
  const hOutside = ref(heatTransferCoefficients.outsideStillAir) /* display unit value */
  const hOutsideUnit = ref('w_m2k')

  /* Get h unit objects */
  const hInsideUnitObj = computed((): UnitOption =>
    heatTransferUnits.find(u => u.id === hInsideUnit.value) ?? heatTransferUnits[0]!
  )
  const hOutsideUnitObj = computed((): UnitOption =>
    heatTransferUnits.find(u => u.id === hOutsideUnit.value) ?? heatTransferUnits[0]!
  )

  /* Sync hOutside when exterior condition changes (convert to display unit) */
  watch(selectedExteriorConditionId, () => {
    const hBase = selectedExteriorCondition.value?.hOutside ?? heatTransferCoefficients.outsideStillAir
    hOutside.value = hBase / hOutsideUnitObj.value.toBase
  }, { immediate: true })

  /* Convert hInside when unit changes */
  watch(hInsideUnit, (newUnit: string, oldUnit: string) => {
    const oldUnitObj = heatTransferUnits.find(u => u.id === oldUnit)
    const newUnitObj = heatTransferUnits.find(u => u.id === newUnit)
    if (oldUnitObj && newUnitObj) {
      const valueInBase = hInside.value * oldUnitObj.toBase
      hInside.value = valueInBase / newUnitObj.toBase
    }
  })

  /* Convert hOutside when unit changes */
  watch(hOutsideUnit, (newUnit: string, oldUnit: string) => {
    const oldUnitObj = heatTransferUnits.find(u => u.id === oldUnit)
    const newUnitObj = heatTransferUnits.find(u => u.id === newUnit)
    if (oldUnitObj && newUnitObj) {
      const valueInBase = hOutside.value * oldUnitObj.toBase
      hOutside.value = valueInBase / newUnitObj.toBase
    }
  })

  /* Check if hOutside is custom (different from condition default) */
  const isHOutsideCustom = computed(() => {
    const conditionH = selectedExteriorCondition.value?.hOutside ?? heatTransferCoefficients.outsideStillAir
    const currentInBase = hOutside.value * hOutsideUnitObj.value.toBase
    return Math.abs(currentInBase - conditionH) > 0.01
  })

  /* Effective h values in base unit W/(m²·K) for calculations */
  const hInsideBase = computed(() => hInside.value * hInsideUnitObj.value.toBase)
  const hOutsideBase = computed(() => hOutside.value * hOutsideUnitObj.value.toBase)

  /* Insulation thickness */
  const insulationThickness = ref(25) /* mm */
  const insulationThicknessUnit = ref('mm')

  /* Airflow (two modes: volume flow or velocity) */
  const airflowMode = ref<'volume' | 'velocity'>('volume')
  const volumeFlow = ref(0.5) /* m³/s */
  const volumeFlowUnit = ref('m3_s')
  const airVelocity = ref(8) /* m/s typical duct velocity */
  const airVelocityUnit = ref('m_s')

  /* Temperature output unit */
  const outputTempUnit = ref('celsius')

  /* Initialize values when duct type changes */
  watch(selectedDuctType, () => {
    if (selectedDuct.value) {
      selectedDuct.value.inputs.forEach((input: DuctInput) => {
        if (inputValues[input.id] === undefined) {
          inputValues[input.id] = input.default
        }
        if (!inputUnits[input.id]) {
          inputUnits[input.id] = input.id === 'length' ? 'meter' : 'millimeter'
        }
      })
    }
  }, { immediate: true })

  /* Get unit object for an input */
  function getInputUnit(inputId: string): UnitOption {
    const unitId = inputUnits[inputId] || 'meter'
    return lengthUnits.find(u => u.id === unitId) ?? defaultLengthUnit
  }

  /* Get all input values converted to meters */
  function getValuesInMeters(): Record<string, number> {
    const result: Record<string, number> = {}
    for (const key in inputValues) {
      const val = inputValues[key]
      if (typeof val === 'number') {
        result[key] = val * getInputUnit(key).toBase
      }
    }
    return result
  }

  /* Handle input value change */
  function onInputValueChange(id: string, val: number) {
    inputValues[id] = val
  }

  /* Handle input unit change */
  function onInputUnitChange(id: string, unitId: string) {
    inputUnits[id] = unitId
  }

  /* Calculate duct surface area (m²) */
  const surfaceArea = computed(() => {
    if (!selectedDuct.value) return 0
    try {
      const values = getValuesInMeters()
      const func = new Function(...Object.keys(values), `return ${selectedDuct.value.surfaceAreaFormula}`)
      return func(...Object.values(values))
    } catch {
      return 0
    }
  })

  /* Calculate cross-sectional area (m²) */
  const crossSectionArea = computed(() => {
    if (!selectedDuct.value) return 0
    try {
      const values = getValuesInMeters()
      const func = new Function(...Object.keys(values), `return ${selectedDuct.value.crossSectionFormula}`)
      return func(...Object.values(values))
    } catch {
      return 0
    }
  })

  /* Calculate hydraulic diameter (m) */
  const hydraulicDiameter = computed(() => {
    if (!selectedDuct.value) return 0
    try {
      const values = getValuesInMeters()
      const func = new Function(...Object.keys(values), `return ${selectedDuct.value.hydraulicDiameterFormula}`)
      return func(...Object.values(values))
    } catch {
      return 0
    }
  })

  /* Calculate mass flow rate (kg/s) */
  const massFlowRate = computed(() => {
    if (airflowMode.value === 'volume') {
      const volUnit = airflowUnits.find(u => u.id === volumeFlowUnit.value)
      const volFlowM3s = volumeFlow.value * (volUnit?.toBase ?? 1)
      return volFlowM3s * AIR_DENSITY
    } else {
      const velUnit = velocityUnits.find(u => u.id === airVelocityUnit.value)
      const velMs = airVelocity.value * (velUnit?.toBase ?? 1)
      return velMs * crossSectionArea.value * AIR_DENSITY
    }
  })

  /* Calculate insulation thickness in meters */
  const insulationThicknessM = computed(() => {
    const unit = thicknessUnits.find(u => u.id === insulationThicknessUnit.value)
    return insulationThickness.value * (unit?.toBase ?? 0.001)
  })

  /* Calculate overall heat transfer coefficient U (W/(m²·K)) */
  const overallU = computed(() => {
    /* Thermal resistances in series:
     * R_total = 1/h_i + R_insulation + 1/h_o
     * R_insulation = thickness / k
     * U = 1 / R_total
     */
    const R_inside = 1 / hInsideBase.value
    const R_outside = 1 / hOutsideBase.value
    
    let R_insulation = 0
    const isInsulated = selectedInsulationId.value !== 'none' && insulationThicknessM.value > 0
    if (isInsulated) {
      R_insulation = insulationThicknessM.value / effectiveThermalConductivity.value
    }

    const R_total = R_inside + R_insulation + R_outside
    return 1 / R_total
  })

  /* Calculate NTU (Number of Transfer Units) */
  const ntu = computed(() => {
    if (massFlowRate.value <= 0) return 0
    return (overallU.value * surfaceArea.value) / (massFlowRate.value * AIR_SPECIFIC_HEAT)
  })

  /* Calculate exit temperature */
  const exitTempKelvin = computed(() => {
    const T_in = toKelvin(inletTemp.value, inletTempUnit.value)
    const T_amb = toKelvin(ambientTemp.value, ambientTempUnit.value)
    
    if (ntu.value <= 0) return T_in
    
    /* T_exit = T_ambient + (T_inlet - T_ambient) × exp(-NTU) */
    return T_amb + (T_in - T_amb) * Math.exp(-ntu.value)
  })

  /* Exit temperature in selected unit */
  const exitTemp = computed(() => {
    return fromKelvin(exitTempKelvin.value, outputTempUnit.value)
  })

  /* Temperature drop */
  const tempDrop = computed(() => {
    const T_in = toKelvin(inletTemp.value, inletTempUnit.value)
    const dropKelvin = T_in - exitTempKelvin.value
    /* Convert drop to output unit (Celsius and Kelvin have same delta) */
    if (outputTempUnit.value === 'fahrenheit') {
      return dropKelvin * 9 / 5
    }
    return dropKelvin
  })

  /* Heat loss rate (W) */
  const heatLossRate = computed(() => {
    return massFlowRate.value * AIR_SPECIFIC_HEAT * Math.abs(
      toKelvin(inletTemp.value, inletTempUnit.value) - exitTempKelvin.value
    )
  })

  /* Heat loss per unit length (W/m) */
  const heatLossPerMeter = computed(() => {
    const values = getValuesInMeters()
    const length = values.length || 1
    return heatLossRate.value / length
  })

  /* Thermal efficiency (%) */
  const thermalEfficiency = computed(() => {
    const T_in = toKelvin(inletTemp.value, inletTempUnit.value)
    const T_amb = toKelvin(ambientTemp.value, ambientTempUnit.value)
    const T_out = exitTempKelvin.value
    
    if (Math.abs(T_in - T_amb) < 0.001) return 100
    
    /* Efficiency = 1 - (T_loss / T_max_possible_loss) */
    return (1 - Math.abs(T_in - T_out) / Math.abs(T_in - T_amb)) * 100
  })

  /* R-value of insulation (imperial: ft²·°F·h/BTU) */
  const rValueImperial = computed(() => {
    const insulation = selectedInsulation.value
    if (!insulation || insulation.id === 'none') return 0
    
    /* Convert thickness to inches */
    const thicknessInches = insulationThicknessM.value / 0.0254
    return (insulation.rValuePerInch ?? 0) * thicknessInches
  })

  /* Formatted outputs */
  const formattedExitTemp = computed(() => {
    const unit = temperatureUnits.find(u => u.id === outputTempUnit.value)
    return `${exitTemp.value.toFixed(1)} ${unit?.symbol ?? '°C'}`
  })

  const formattedTempDrop = computed(() => {
    const unit = temperatureUnits.find(u => u.id === outputTempUnit.value)
    const symbol = unit?.id === 'fahrenheit' ? '°F' : (unit?.id === 'kelvin' ? 'K' : '°C')
    return `${tempDrop.value.toFixed(2)} ${symbol}`
  })

  const formattedHeatLoss = computed(() => {
    if (heatLossRate.value >= 1000) {
      return `${(heatLossRate.value / 1000).toFixed(2)} kW`
    }
    return `${heatLossRate.value.toFixed(1)} W`
  })

  const formattedEfficiency = computed(() => {
    return `${thermalEfficiency.value.toFixed(1)}%`
  })

  /* Copy functionality */
  const copied = ref(false)
  const copiedId = ref<string | null>(null)

  async function copyResult(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  return {
    /* State */
    selectedDuctType,
    selectedDuct,
    selectedInsulationId,
    selectedInsulation,
    inputValues,
    inputUnits,
    inletTemp,
    inletTempUnit,
    ambientTemp,
    ambientTempUnit,
    hInside,
    hOutside,
    insulationThickness,
    insulationThicknessUnit,
    airflowMode,
    volumeFlow,
    volumeFlowUnit,
    airVelocity,
    airVelocityUnit,
    outputTempUnit,
    /* Thermal conductivity (k-value) - editable */
    customThermalConductivity,
    thermalConductivityUnit,
    effectiveThermalConductivity,
    isKValueCustom,
    /* Heat transfer coefficients with units */
    hInsideUnit,
    hOutsideUnit,
    isHOutsideCustom,
    /* Exterior conditions */
    selectedExteriorConditionId,
    selectedExteriorCondition,

    /* Computed */
    surfaceArea,
    crossSectionArea,
    hydraulicDiameter,
    massFlowRate,
    insulationThicknessM,
    overallU,
    ntu,
    exitTemp,
    exitTempKelvin,
    tempDrop,
    heatLossRate,
    heatLossPerMeter,
    thermalEfficiency,
    rValueImperial,

    /* Formatted */
    formattedExitTemp,
    formattedTempDrop,
    formattedHeatLoss,
    formattedEfficiency,

    /* Units & Data */
    lengthUnits,
    temperatureUnits,
    airflowUnits,
    velocityUnits,
    thicknessUnits,
    thermalConductivityUnits,
    heatTransferUnits,
    insulationMaterials,
    ductDefinitions,
    exteriorConditions,

    /* Methods */
    getInputUnit,
    onInputValueChange,
    onInputUnitChange,

    /* Copy */
    copied,
    copiedId,
    copyResult,
  }
}

