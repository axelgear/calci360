import { ref, computed, reactive, watch } from '#imports'
import type { Ref } from 'vue'
import type { MetalWeightCalculatorConfig } from '~/components/Calculator/calculators/metal-weight/types'
import {
  metalProfiles,
  getProfile,
  defaultProfile,
  allMaterials,
  getMaterial,
  defaultMaterial,
  type ProfileDefinition,
  type Material,
} from '~/components/Calculator/calculators/metal-weight/types'
import type { UnitOption } from '~/components/Calculator/calculators/units/types'
import {
  lengthUnits,
  defaultLengthUnit,
} from '~/components/Calculator/calculators/units/length'
import {
  massUnitsCommon as massUnits,
  defaultMassUnit,
} from '~/components/Calculator/calculators/units/mass'

/* Density units (base unit: kg/m³) */
const densityUnits: UnitOption[] = [
  { id: 'kg_m3', name: 'Kilogram per Cubic Meter', symbol: 'kg/m³', toBase: 1 },
  { id: 'g_cm3', name: 'Gram per Cubic Centimeter', symbol: 'g/cm³', toBase: 1000 },
  { id: 'lb_ft3', name: 'Pound per Cubic Foot', symbol: 'lb/ft³', toBase: 16.018463 },
  { id: 'lb_in3', name: 'Pound per Cubic Inch', symbol: 'lb/in³', toBase: 27679.9047 },
]

/* Re-export for consumers */
export { massUnits, densityUnits, metalProfiles, allMaterials }

export interface WeightConversionResult {
  id: string
  name: string
  symbol: string
  value: number
  formatted: string
}

export function useMetalWeightCalculator(config: Ref<MetalWeightCalculatorConfig>) {
  /* Selected profile */
  const selectedProfileId = ref(defaultProfile)
  const selectedProfile = computed<ProfileDefinition | undefined>(() =>
    getProfile(selectedProfileId.value)
  )

  /* Selected material */
  const selectedMaterialId = ref(defaultMaterial)
  const selectedMaterial = computed<Material | undefined>(() =>
    getMaterial(selectedMaterialId.value)
  )

  /* Custom density override - stored in display unit */
  const customDensity = ref<number>(7860)
  const densityUnitId = ref('kg_m3')

  /* Get density unit object - always defaults to kg/m³ */
  const densityUnitObj = computed((): UnitOption =>
    densityUnits.find(u => u.id === densityUnitId.value) || densityUnits[0]!
  )

  /* Effective density used in calculations (always in kg/m³ = base unit) */
  const effectiveDensity = computed(() => {
    if (customDensity.value > 0) {
      return customDensity.value * densityUnitObj.value.toBase
    }
    return selectedMaterial.value?.density ?? 7860 /* Default to steel */
  })

  /* Check if density is custom (different from material default) */
  const isDensityCustom = computed(() => {
    const currentInBase = customDensity.value * densityUnitObj.value.toBase
    return Math.abs(currentInBase - (selectedMaterial.value?.density ?? 7860)) > 0.01
  })

  /* Sync custom density when material changes - convert to display unit */
  watch(selectedMaterialId, () => {
    const materialDensity = selectedMaterial.value?.density ?? 7860
    customDensity.value = materialDensity / densityUnitObj.value.toBase
  }, { immediate: true })

  /* When density unit changes, convert the value */
  watch(densityUnitId, (newUnit, oldUnit) => {
    const oldUnitObj = densityUnits.find(u => u.id === oldUnit)
    const newUnitObj = densityUnits.find(u => u.id === newUnit)
    if (oldUnitObj && newUnitObj) {
      /* Convert: value_in_base = old_value * old_toBase, then new_value = value_in_base / new_toBase */
      const valueInBase = customDensity.value * oldUnitObj.toBase
      customDensity.value = valueInBase / newUnitObj.toBase
    }
  })

  /* Unit length for purchasing (value in display unit, e.g., 6 meters) */
  const unitLength = ref<number>(6)
  const unitLengthUnit = ref('meter')

  /* Quantity multiplier */
  const quantity = ref(1)

  /* Input values & units */
  const inputValues = reactive<Record<string, number>>({})
  const inputUnits = reactive<Record<string, string>>({})

  /* Output unit selection */
  const selectedOutputUnit = ref('kilogram')
  const currentOutputUnit = computed((): UnitOption => {
    return massUnits.find(u => u.id === selectedOutputUnit.value) ?? defaultMassUnit
  })

  /* Get unit object for an input */
  function getInputUnit(inputId: string): UnitOption {
    const unitId = inputUnits[inputId] || 'meter'
    return lengthUnits.find(u => u.id === unitId) ?? defaultLengthUnit
  }

  /* Convert meters to a target unit */
  function fromMeters(val: number, unitId: string): number {
    const unit = lengthUnits.find(u => u.id === unitId)
    return val / (unit?.toBase ?? 1)
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

  /* Initialize values when profile changes */
  watch(selectedProfileId, () => {
    if (selectedProfile.value) {
      selectedProfile.value.inputs.forEach(input => {
        inputValues[input.id] = input.default ?? 1
        if (!inputUnits[input.id]) {
          /* Use meter for 'length', millimeter for all other dimensions */
          inputUnits[input.id] = input.id === 'length' ? 'meter' : 'millimeter'
        }
      })
    }
  }, { immediate: true })

  /* Handle input value change */
  function onInputValueChange(id: string, val: number) {
    inputValues[id] = val
  }

  /* Handle input unit change */
  function onInputUnitChange(id: string, unitId: string) {
    inputUnits[id] = unitId
  }

  /* Calculate volume in cubic meters using the profile formula */
  const calculatedVolume = computed(() => {
    if (!selectedProfile.value) return 0
    try {
      const values = getValuesInMeters()
      /* Evaluate the formula string */
      const func = new Function(...Object.keys(values), `return ${selectedProfile.value.volumeFormula}`)
      return func(...Object.values(values))
    } catch {
      return 0
    }
  })

  /* Calculate weight in kg (base mass unit) */
  const calculatedWeightBase = computed(() => {
    /* Weight = Volume (m³) × Density (kg/m³) × Quantity */
    return calculatedVolume.value * effectiveDensity.value * quantity.value
  })

  /* Cross-sectional area in m² (base unit for calculations) */
  const crossSectionAreaBase = computed(() => {
    if (!selectedProfile.value) return 0
    try {
      const values = getValuesInMeters()
      values.length = 1 /* 1 meter */
      const func = new Function(...Object.keys(values), `return ${selectedProfile.value.volumeFormula}`)
      return func(...Object.values(values)) /* m³ per meter = m² */
    } catch {
      return 0
    }
  })

  /* Get the required length in meters (from the 'length' input) */
  const requiredLengthInMeters = computed(() => {
    const lengthValue = inputValues.length ?? 0
    const lengthUnitId = inputUnits.length ?? 'meter'
    const unit = lengthUnits.find(u => u.id === lengthUnitId)
    return lengthValue * (unit?.toBase ?? 1) * quantity.value
  })

  /* Unit length converted to meters */
  const unitLengthInMeters = computed(() => {
    const unit = lengthUnits.find(u => u.id === unitLengthUnit.value)
    return unitLength.value * (unit?.toBase ?? 1)
  })

  /* Purchasing calculations */
  const purchaseCalc = computed(() => {
    const required = requiredLengthInMeters.value
    const unitLen = unitLengthInMeters.value

    if (required <= 0 || unitLen <= 0) {
      return {
        unitsNeeded: 0,
        totalPurchaseLength: 0,
        surplusLength: 0,
        surplusWeight: 0,
        totalPurchaseWeight: 0,
      }
    }

    /* Number of units needed (round up) */
    const unitsNeeded = Math.ceil(required / unitLen)

    /* Total length being purchased */
    const totalPurchaseLength = unitsNeeded * unitLen

    /* Surplus length */
    const surplusLength = totalPurchaseLength - required

    /* Weight per meter (based on cross section and density) */
    const weightPerMeter = crossSectionAreaBase.value * effectiveDensity.value /* kg per meter */

    /* Surplus weight */
    const surplusWeight = surplusLength * weightPerMeter

    /* Total purchase weight */
    const totalPurchaseWeight = totalPurchaseLength * weightPerMeter

    return {
      unitsNeeded,
      totalPurchaseLength,
      surplusLength,
      surplusWeight,
      totalPurchaseWeight,
    }
  })

  /* Convert to selected output unit */
  const calculatedWeight = computed(() => {
    return calculatedWeightBase.value / currentOutputUnit.value.toBase
  })

  /* Format result for display */
  const formattedWeight = computed(() => {
    return formatNumber(calculatedWeight.value)
  })

  /* Volume in liters for display */
  const volumeInLiters = computed(() => {
    return calculatedVolume.value * 1000 * quantity.value
  })

  const formattedVolume = computed(() => {
    if (volumeInLiters.value < 0.001) {
      return `${formatNumber(volumeInLiters.value * 1000, 4)} mL`
    }
    return `${formatNumber(volumeInLiters.value, 4)} L`
  })

  /* Cross-sectional area in mm² for display */
  const crossSectionArea = computed(() => {
    if (!selectedProfile.value) return 0
    /* Calculate volume for 1 meter length, then divide by 1 to get area */
    try {
      const values = getValuesInMeters()
      const lengthBackup = values.length ?? 1
      values.length = 1 /* 1 meter */
      const func = new Function(...Object.keys(values), `return ${selectedProfile.value.volumeFormula}`)
      const volumePerMeter = func(...Object.values(values))
      values.length = lengthBackup
      return volumePerMeter * 1e6 /* Convert m² to mm² */
    } catch {
      return 0
    }
  })

  const formattedCrossSection = computed(() => {
    return `${formatNumber(crossSectionArea.value, 2)} mm²`
  })

  /* All weight conversions for table */
  const allConversions = computed<WeightConversionResult[]>(() => {
    const base = calculatedWeightBase.value
    if (!Number.isFinite(base) || base <= 0) return []

    return massUnits.map(unit => {
      const converted = base / unit.toBase
      return {
        id: unit.id,
        name: unit.name,
        symbol: unit.symbol,
        value: converted,
        formatted: formatNumber(converted, 6),
      }
    })
  })

  /* Copy functionality */
  const copied = ref(false)
  const copiedId = ref<string | null>(null)

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(calculatedWeight.value.toString())
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  async function copyConversion(id: string, value: number) {
    try {
      await navigator.clipboard.writeText(value.toString())
      copiedId.value = id
      setTimeout(() => (copiedId.value = null), 2000)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  return {
    /* State */
    selectedProfileId,
    selectedProfile,
    selectedMaterialId,
    selectedMaterial,
    customDensity,
    densityUnitId,
    densityUnitObj,
    effectiveDensity,
    isDensityCustom,
    unitLength,
    unitLengthUnit,
    quantity,
    inputValues,
    inputUnits,
    selectedOutputUnit,
    currentOutputUnit,

    /* Computed */
    calculatedVolume,
    calculatedWeightBase,
    calculatedWeight,
    formattedWeight,
    volumeInLiters,
    formattedVolume,
    crossSectionAreaBase,
    crossSectionArea,
    formattedCrossSection,
    allConversions,
    requiredLengthInMeters,
    unitLengthInMeters,
    purchaseCalc,

    /* Units & Data */
    lengthUnits,
    massUnits,
    densityUnits,

    /* Methods */
    getInputUnit,
    onInputValueChange,
    onInputUnitChange,

    /* Copy */
    copied,
    copiedId,
    copyResult,
    copyConversion,
  }
}

/* Helper: Format number for display */
function formatNumber(val: number, maxDecimals = 4): string {
  if (!Number.isFinite(val) || val < 0) return '—'
  if (val === 0) return '0'
  if (val < 0.0001 || val >= 1e9) return val.toExponential(maxDecimals)
  return val.toLocaleString('en-US', { maximumFractionDigits: maxDecimals })
}

