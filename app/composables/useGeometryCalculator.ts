import type { GeometryCalculatorConfig, ShapeDefinition } from '~/components/Calculator/calculators/geometry/types'
import {
  type UnitOption,
  lengthUnitsCommon as lengthUnits,
  areaUnitsCommon as areaUnits,
  volumeUnitsCommon as volumeUnits,
  defaultLengthUnit,
  defaultAreaUnit,
  defaultVolumeUnit,
} from '~/components/Calculator/calculators/units'

/* Re-export for consumers */
export type { UnitOption }
export { lengthUnits, areaUnits, volumeUnits }

export type CalculatorMode = 'area' | 'volume'

export interface ConversionResult {
  id: string
  name: string
  symbol: string
  value: number
  formatted: string
}

export interface ComputedAdditionalResult {
  id: string
  label: string
  value: number
  formatted: string
  units: UnitOption[]
  selectedUnit: string
  currentUnit: UnitOption
  unitType: 'area' | 'volume' | 'length'
}

export function useGeometryCalculator(config: Ref<GeometryCalculatorConfig>, mode: CalculatorMode) {
  /* Output units based on mode */
  const outputUnits = mode === 'area' ? areaUnits : volumeUnits
  const defaultOutputUnit = mode === 'area' ? 'square-meter' : 'cubic-meter'
  
  /* Selected shape */
  const selectedShapeId = ref(config.value.defaultShape)
  const selectedShape = computed<ShapeDefinition | undefined>(() =>
    config.value.shapes.find(s => s.id === selectedShapeId.value)
  )
  
  /* Input values & units */
  const inputValues = reactive<Record<string, number>>({})
  const inputUnits = reactive<Record<string, string>>({})
  
  /* Fallback units from centralized definitions */
  const fallbackLengthUnit = defaultLengthUnit
  const fallbackAreaUnit = defaultAreaUnit
  const fallbackVolumeUnit = defaultVolumeUnit
  
  /* Output unit selection */
  const selectedOutputUnit = ref(defaultOutputUnit)
  const defaultOutputUnitObj = outputUnits.find(u => u.id === defaultOutputUnit) ?? (mode === 'area' ? fallbackAreaUnit : fallbackVolumeUnit)
  const currentOutputUnit = computed((): UnitOption => {
    return outputUnits.find(u => u.id === selectedOutputUnit.value) ?? defaultOutputUnitObj
  })
  
  /* For volume: additional area units for surface area */
  const selectedAreaUnit = ref('square-meter')
  const currentAreaUnit = computed((): UnitOption => {
    return areaUnits.find(u => u.id === selectedAreaUnit.value) ?? fallbackAreaUnit
  })
  
  /* Cube syncing (volume mode only) */
  const syncingCube = ref(false)
  const lastCubeEdited = ref<string | null>(null)
  
  /* Get unit object for an input */
  function getInputUnit(inputId: string): UnitOption {
    const unitId = inputUnits[inputId] || 'meter'
    return lengthUnits.find(u => u.id === unitId) ?? fallbackLengthUnit
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
  
  /* Sync cube inputs (side, face diagonal, space diagonal) */
  function syncCubeInputs(sourceId?: string) {
    if (mode !== 'volume' || selectedShapeId.value !== 'cube') return
    if (syncingCube.value) return
    
    const sideId = 'side'
    const faceId = 'face-diagonal'
    const spaceId = 'space-diagonal'
    
    const sideVal = inputValues[sideId]
    const faceVal = inputValues[faceId]
    const spaceVal = inputValues[spaceId]
    
    const sideUnit = getInputUnit(sideId)
    const faceUnit = getInputUnit(faceId)
    const spaceUnit = getInputUnit(spaceId)
    
    let chosen: 'side' | 'face' | 'space' | null = null
    if (sourceId === sideId && typeof sideVal === 'number') chosen = 'side'
    else if (sourceId === faceId && typeof faceVal === 'number') chosen = 'face'
    else if (sourceId === spaceId && typeof spaceVal === 'number') chosen = 'space'
    else if (typeof sideVal === 'number') chosen = 'side'
    else if (typeof faceVal === 'number') chosen = 'face'
    else if (typeof spaceVal === 'number') chosen = 'space'
    
    let sideMeters: number
    switch (chosen) {
      case 'side':
        sideMeters = (sideVal ?? 5) * sideUnit.toBase
        break
      case 'face':
        sideMeters = (faceVal ?? 5 * Math.SQRT2) * faceUnit.toBase / Math.SQRT2
        break
      case 'space':
        sideMeters = (spaceVal ?? 5 * Math.sqrt(3)) * spaceUnit.toBase / Math.sqrt(3)
        break
      default:
        sideMeters = 5
    }
    
    syncingCube.value = true
    inputValues[sideId] = fromMeters(sideMeters, inputUnits[sideId] || 'meter')
    inputValues[faceId] = fromMeters(sideMeters * Math.SQRT2, inputUnits[faceId] || 'meter')
    inputValues[spaceId] = fromMeters(sideMeters * Math.sqrt(3), inputUnits[spaceId] || 'meter')
    syncingCube.value = false
  }
  
  /* Initialize values when shape changes */
  watch(selectedShapeId, () => {
    if (selectedShape.value) {
      selectedShape.value.inputs.forEach(input => {
        inputValues[input.id] = input.default ?? 1
        if (!inputUnits[input.id]) {
          inputUnits[input.id] = 'meter'
        }
      })
      if (mode === 'volume' && selectedShapeId.value === 'cube') {
        syncCubeInputs()
      }
    }
  }, { immediate: true })
  
  /* Handle input value change */
  function onInputValueChange(id: string, val: number) {
    inputValues[id] = val
    if (mode === 'volume' && selectedShapeId.value === 'cube') {
      lastCubeEdited.value = id
      syncCubeInputs(id)
    }
  }
  
  /* Handle input unit change */
  function onInputUnitChange(id: string, unitId: string) {
    inputUnits[id] = unitId
    if (mode === 'volume' && selectedShapeId.value === 'cube') {
      syncCubeInputs(lastCubeEdited.value ?? id)
    }
  }
  
  /* Calculate base result */
  const calculatedBase = computed(() => {
    if (!selectedShape.value) return 0
    try {
      return selectedShape.value.calculate(getValuesInMeters())
    } catch {
      return 0
    }
  })
  
  /* Convert to selected output unit */
  const calculatedResult = computed(() => {
    return calculatedBase.value / currentOutputUnit.value.toBase
  })
  
  /* Format result for display */
  const formattedResult = computed(() => {
    return formatNumber(calculatedResult.value)
  })
  
  /* Additional results (e.g., surface area for volume) */
  const additionalResults = computed<ComputedAdditionalResult[]>(() => {
    const shape = selectedShape.value
    if (!shape?.additionalResults) return []
    
    return shape.additionalResults.map(r => {
      let baseValue = 0
      try {
        baseValue = r.calculate(getValuesInMeters())
      } catch { /* empty */ }
      
      /* Determine unit type from the unit string suffix */
      const unitType: 'area' | 'volume' | 'length' = 
        r.unit.includes('²') ? 'area' :
        r.unit.includes('³') ? 'volume' : 'length'
      
      const units = unitType === 'area' ? areaUnits : 
                    unitType === 'volume' ? volumeUnits : lengthUnits
      const selUnit = unitType === 'area' ? selectedAreaUnit.value :
                      unitType === 'volume' ? selectedOutputUnit.value : 'meter'
      
      /* Get current unit with fallbacks */
      const fallbackUnit = unitType === 'area' ? fallbackAreaUnit :
                          unitType === 'volume' ? fallbackVolumeUnit : fallbackLengthUnit
      const currUnit = units.find(u => u.id === selUnit) ?? fallbackUnit
      const value = baseValue / currUnit.toBase
      
      return {
        id: r.id,
        label: r.label,
        value,
        formatted: formatNumber(value),
        units,
        selectedUnit: selUnit,
        currentUnit: currUnit,
        unitType,
      }
    })
  })
  
  /* All conversions for table */
  const allConversions = computed<ConversionResult[]>(() => {
    const base = calculatedBase.value
    if (!Number.isFinite(base) || base <= 0) return []
    
    return outputUnits.map(unit => {
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
  const copiedArea = ref(false)
  const copiedId = ref<string | null>(null)
  
  async function copyResult() {
    try {
      await navigator.clipboard.writeText(calculatedResult.value.toString())
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }
  
  async function copyAdditional(resultId: string) {
    const result = additionalResults.value.find(r => r.id === resultId)
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.value.toString())
      if (resultId === 'surface-area') {
        copiedArea.value = true
        setTimeout(() => (copiedArea.value = false), 2000)
      }
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
    selectedShapeId,
    selectedShape,
    inputValues,
    inputUnits,
    selectedOutputUnit,
    currentOutputUnit,
    selectedAreaUnit,
    currentAreaUnit,
    
    /* Computed */
    calculatedBase,
    calculatedResult,
    formattedResult,
    additionalResults,
    allConversions,
    
    /* Units */
    lengthUnits,
    outputUnits,
    areaUnits,
    
    /* Methods */
    getInputUnit,
    onInputValueChange,
    onInputUnitChange,
    
    /* Copy */
    copied,
    copiedArea,
    copiedId,
    copyResult,
    copyAdditional,
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

