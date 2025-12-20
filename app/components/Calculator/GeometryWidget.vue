<script setup lang="ts">
import type { GeometryCalculatorConfig, ShapeDefinition } from './calculators/geometry/types'
import type { DropdownOption } from '~/components/Dropdown.vue'
import type { UnitOption } from './UnitInput.vue'
import ShapeVisual from './shapes/ShapeVisual.vue'
import UnitInput from './UnitInput.vue'
import { length } from './calculators/base/length'
import { deriveArea } from './calculators/base/derived'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = defineProps<{
  config: GeometryCalculatorConfig
}>()

/* ========== Length Units for Input ========== */
const lengthUnits: UnitOption[] = [
  /* Metric */
  { id: 'millimeter', name: 'Millimeter', symbol: 'mm', toBase: length.millimeter },
  { id: 'centimeter', name: 'Centimeter', symbol: 'cm', toBase: length.centimeter },
  { id: 'meter', name: 'Meter', symbol: 'm', toBase: length.meter },
  { id: 'kilometer', name: 'Kilometer', symbol: 'km', toBase: length.kilometer },
  /* Imperial */
  { id: 'inch', name: 'Inch', symbol: 'in', toBase: length.inch },
  { id: 'foot', name: 'Foot', symbol: 'ft', toBase: length.foot },
  { id: 'yard', name: 'Yard', symbol: 'yd', toBase: length.yard },
  { id: 'mile', name: 'Mile', symbol: 'mi', toBase: length.mile },
  /* Other common */
  { id: 'micrometer', name: 'Micrometer', symbol: 'μm', toBase: length.micrometer },
  { id: 'nanometer', name: 'Nanometer', symbol: 'nm', toBase: length.nanometer },
  { id: 'nautical-mile', name: 'Nautical Mile', symbol: 'NM', toBase: length['nautical-mile'] },
]

/* ========== Area Units for Output ========== */
interface AreaUnitOption {
  id: string
  name: string
  symbol: string
  toBase: number /* conversion to m² */
}

const L = length
const areaUnits: AreaUnitOption[] = [
  /* Metric */
  { id: 'square-millimeter', name: 'Square Millimeter', symbol: 'mm²', toBase: deriveArea(L.millimeter) },
  { id: 'square-centimeter', name: 'Square Centimeter', symbol: 'cm²', toBase: deriveArea(L.centimeter) },
  { id: 'square-meter', name: 'Square Meter', symbol: 'm²', toBase: deriveArea(L.meter) },
  { id: 'are', name: 'Are', symbol: 'a', toBase: deriveArea(L.dekameter) },
  { id: 'hectare', name: 'Hectare', symbol: 'ha', toBase: deriveArea(L.hectometer) },
  { id: 'square-kilometer', name: 'Square Kilometer', symbol: 'km²', toBase: deriveArea(L.kilometer) },
  /* Imperial */
  { id: 'square-inch', name: 'Square Inch', symbol: 'in²', toBase: deriveArea(L.inch) },
  { id: 'square-foot', name: 'Square Foot', symbol: 'ft²', toBase: deriveArea(L.foot) },
  { id: 'square-yard', name: 'Square Yard', symbol: 'yd²', toBase: deriveArea(L.yard) },
  { id: 'acre', name: 'Acre', symbol: 'ac', toBase: deriveArea(L.yard) * 4840 },
  { id: 'square-mile', name: 'Square Mile', symbol: 'mi²', toBase: deriveArea(L.mile) },
]

/* Dropdown options for area output */
const areaOptions = computed<DropdownOption[]>(() =>
  areaUnits.map(u => ({
    value: u.id,
    label: t(u.name),
    sublabel: u.symbol,
  }))
)

/* Selected area output unit */
const selectedAreaUnit = ref('square-meter')

/* Default area unit - Square Meter */
const defaultAreaUnit: AreaUnitOption = { id: 'square-meter', name: 'Square Meter', symbol: 'm²', toBase: deriveArea(L.meter) }

const currentAreaUnit = computed((): AreaUnitOption => {
  const found = areaUnits.find((u: AreaUnitOption) => u.id === selectedAreaUnit.value)
  return found ?? defaultAreaUnit
})

/* Selected shape */
const selectedShapeId = ref(props.config.defaultShape)

const selectedShape = computed<ShapeDefinition | undefined>(() =>
  props.config.shapes.find((s: ShapeDefinition) => s.id === selectedShapeId.value)
)

/* Input values - reactive object keyed by input id */
const inputValues = reactive<Record<string, number>>({})

/* Per-input unit selection - each input can have a different unit */
const inputUnits = reactive<Record<string, string>>({})

/* Initialize default values when shape changes */
watch(selectedShapeId, () => {
  if (selectedShape.value) {
    selectedShape.value.inputs.forEach(input => {
      inputValues[input.id] = input.default ?? 1
      /* Default to meter if not already set */
      if (!inputUnits[input.id]) {
        inputUnits[input.id] = 'meter'
      }
    })
  }
}, { immediate: true })

/* Get unit object for an input */
function getInputUnit(inputId: string): UnitOption {
  const unitId = inputUnits[inputId] || 'meter'
  const found = lengthUnits.find((u: UnitOption) => u.id === unitId)
  /* lengthUnits[2] is always defined (meter) */
  return found ?? lengthUnits[2] as UnitOption
}

/* Calculate area in base unit (m²) */
const calculatedAreaBase = computed(() => {
  if (!selectedShape.value) return 0
  try {
    /* Convert input values from their respective units to meters */
    const valuesInMeters: Record<string, number> = {}
    for (const key in inputValues) {
      const val = inputValues[key]
      if (typeof val === 'number') {
        const unit = getInputUnit(key)
        valuesInMeters[key] = val * unit.toBase
      }
    }
    /* Calculate area - result is in m² since inputs are in meters */
    return selectedShape.value.calculate(valuesInMeters)
  } catch {
    return 0
  }
})

/* Convert area to selected output unit */
const calculatedArea = computed(() => {
  if (!currentAreaUnit.value) return calculatedAreaBase.value
  /* Convert from m² to selected unit */
  return calculatedAreaBase.value / currentAreaUnit.value.toBase
})

/* Format area for display */
const formattedArea = computed(() => {
  const val = calculatedArea.value
  if (!Number.isFinite(val) || val < 0) return '—'
  if (val === 0) return '0'
  if (val < 0.0001 || val >= 1e9) return val.toExponential(4)
  return val.toLocaleString('en-US', { maximumFractionDigits: 4 })
})

/* All conversions for the results table */
const allConversions = computed(() => {
  const baseArea = calculatedAreaBase.value
  if (!Number.isFinite(baseArea) || baseArea <= 0) return []
  
  return areaUnits.map(unit => {
    const converted = baseArea / unit.toBase
    let formatted: string
    if (!Number.isFinite(converted)) {
      formatted = '—'
    } else if (converted === 0) {
      formatted = '0'
    } else if (converted < 0.0001 || converted >= 1e9) {
      formatted = converted.toExponential(4)
    } else {
      formatted = converted.toLocaleString('en-US', { maximumFractionDigits: 6 })
    }
    return {
      id: unit.id,
      name: unit.name,
      symbol: unit.symbol,
      value: converted,
      formatted,
    }
  })
})

/* Copy result to clipboard */
const copied = ref(false)
async function copyResult() {
  try {
    await navigator.clipboard.writeText(calculatedArea.value.toString())
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}

/* Copy specific conversion */
const copiedId = ref<string | null>(null)
async function copyConversion(id: string, value: number) {
  try {
    await navigator.clipboard.writeText(value.toString())
    copiedId.value = id
    setTimeout(() => (copiedId.value = null), 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}

/* Output unit dropdown state */
const outputDropdownOpen = ref(false)
const outputSearch = ref('')
const outputDropdownRef = ref<HTMLElement | null>(null)

/* Filtered area units based on search */
const filteredAreaUnits = computed(() => {
  if (!outputSearch.value.trim()) return areaUnits
  const query = outputSearch.value.toLowerCase()
  return areaUnits.filter(u => 
    u.name.toLowerCase().includes(query) ||
    u.symbol.toLowerCase().includes(query)
  )
})

/* Select output unit */
function selectOutputUnit(unitId: string) {
  selectedAreaUnit.value = unitId
  outputDropdownOpen.value = false
  outputSearch.value = ''
}

/* Close output dropdown on click outside */
onClickOutside(outputDropdownRef, () => {
  outputDropdownOpen.value = false
  outputSearch.value = ''
})
</script>

<template>
  <div class="geometry-widget">
    <!-- Shape Selector -->
    <div class="shape-selector">
      <label class="section-label">{{ t('Select Shape') }}</label>
      <div class="shape-grid">
        <button
          v-for="shape in config.shapes"
          :key="shape.id"
          class="shape-btn"
          :class="{ active: shape.id === selectedShapeId }"
          @click="selectedShapeId = shape.id"
          :title="t(shape.name)"
        >
          <span class="material-icons">{{ shape.icon }}</span>
          <span class="shape-name">{{ t(shape.name) }}</span>
        </button>
      </div>
    </div>

    <div class="calculator-body">
      <!-- Visual Preview -->
      <div class="visual-section">
        <ShapeVisual
          v-if="selectedShape"
          :shape-id="selectedShapeId"
          :values="inputValues"
          :input-units="inputUnits"
          :length-units="lengthUnits"
          :area="calculatedArea"
          :area-unit="currentAreaUnit.symbol"
        />
      </div>

      <!-- Inputs & Result -->
      <div class="input-section">
        <!-- Dynamic Inputs with Unit Selectors -->
        <div v-if="selectedShape" class="inputs-grid">
          <UnitInput
            v-for="input in selectedShape.inputs"
            :key="input.id"
            :model-value="inputValues[input.id] ?? input.default ?? 1"
            :unit="inputUnits[input.id] ?? 'meter'"
            :label="input.label"
            :symbol="input.symbol"
            :units="lengthUnits"
            :min="input.min ?? 0.1"
            :max="input.max"
            :step="input.step ?? 0.1"
            @update:model-value="inputValues[input.id] = $event"
            @update:unit="inputUnits[input.id] = $event"
          />
        </div>

        <!-- Formula Display -->
        <div v-if="selectedShape" class="formula-box">
          <div class="formula-header">
            <span class="material-icons">functions</span>
            <span>{{ t('Formula') }}</span>
          </div>
          <div class="formula-content">
            <span class="formula-math">{{ selectedShape.formula }}</span>
            <span class="formula-explain">{{ t(selectedShape.formulaExplanation) }}</span>
          </div>
        </div>

        <!-- Result with Output Unit Selector -->
        <div class="result-section">
          <div class="result-box">
            <div class="result-label">
              <span class="material-icons">calculate</span>
              <span>{{ t(config.resultLabel) }}</span>
            </div>
            <div class="result-value">
              <span class="value">{{ formattedArea }}</span>
              <!-- Clickable unit selector -->
              <div class="output-unit-selector" ref="outputDropdownRef">
                <button
                  type="button"
                  class="unit-btn"
                  :class="{ open: outputDropdownOpen }"
                  @click="outputDropdownOpen = !outputDropdownOpen"
                >
                  <span class="unit-symbol">{{ currentAreaUnit.symbol }}</span>
                  <span class="material-icons caret">expand_more</span>
                </button>
                
                <Transition name="dropdown-slide">
                  <div v-if="outputDropdownOpen" class="output-dropdown">
                    <div class="dropdown-search">
                      <span class="material-icons">search</span>
                      <input
                        v-model="outputSearch"
                        type="text"
                        :placeholder="t('Search units...')"
                        @click.stop
                      />
                    </div>
                    <div class="dropdown-options">
                      <button
                        v-for="unit in filteredAreaUnits"
                        :key="unit.id"
                        type="button"
                        class="dropdown-option"
                        :class="{ active: unit.id === selectedAreaUnit }"
                        @click="selectOutputUnit(unit.id)"
                      >
                        <span class="option-name">{{ t(unit.name) }}</span>
                        <span class="option-symbol">{{ unit.symbol }}</span>
                        <span v-if="unit.id === selectedAreaUnit" class="material-icons check">check</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
            <button class="copy-btn" @click="copyResult" :title="t('Copy value')">
              <span class="material-icons">{{ copied ? 'check' : 'content_copy' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- All Conversions Table -->
    <div class="conversions-section">
      <div class="conversions-header">
        <h3>
          <span class="material-icons">swap_horiz</span>
          {{ t('All Area Conversions') }}
        </h3>
      </div>
      <div class="conversions-grid">
        <div
          v-for="conv in allConversions"
          :key="conv.id"
          class="conversion-card"
          :class="{ active: conv.id === selectedAreaUnit, copied: copiedId === conv.id }"
          @click="copyConversion(conv.id, conv.value)"
        >
          <div class="conv-info">
            <span class="conv-name">{{ t(conv.name) }}</span>
            <span class="conv-symbol">{{ conv.symbol }}</span>
          </div>
          <div class="conv-value">
            <span>{{ conv.formatted }}</span>
            <span class="material-icons copy-icon">{{ copiedId === conv.id ? 'check' : 'content_copy' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.geometry-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Shape Selector */
.section-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.75rem;
  opacity: 0.8;
}

.shape-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.5rem;
  
  @include phone {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}

.shape-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.75rem 0.5rem;
  background: var(--card);
  border: 2px solid transparent;
  border-radius: 0.75rem;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  
  .material-icons {
    font-size: 1.5rem;
    color: var(--neutral);
    transition: color 0.2s;
  }
  
  .shape-name {
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    opacity: 0.8;
  }
  
  &:hover {
    background: rgb(var(--accent-500-rgb) / 8%);
    border-color: rgb(var(--accent-500-rgb) / 30%);
    
    .material-icons {
      color: var(--accent-500);
    }
  }
  
  &.active {
    background: rgb(var(--accent-500-rgb) / 15%);
    border-color: var(--accent-500);
    
    .material-icons {
      color: var(--accent-500);
    }
    
    .shape-name {
      color: var(--accent-500);
      font-weight: 600;
      opacity: 1;
    }
  }
}

/* Calculator Body */
.calculator-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @include tablet {
    grid-template-columns: 1fr;
  }
}

.visual-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Input Groups */
.inputs-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Formula Box */
.formula-box {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 1rem;
  
  .formula-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    
    .material-icons {
      font-size: 1.1rem;
      color: var(--accent-500);
    }
    
    span {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text);
      opacity: 0.8;
    }
  }
  
  .formula-content {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    
    .formula-math {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--accent-500);
    }
    
    .formula-explain {
      font-size: 0.85rem;
      color: var(--neutral);
    }
  }
}

/* Result Section */
.result-section {
  position: relative;
  z-index: 20;
}

.result-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 12%) 0%, rgb(var(--accent-500-rgb) / 6%) 100%);
  border: 2px solid rgb(var(--accent-500-rgb) / 25%);
  border-radius: 1rem;
  
  .result-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .material-icons {
      font-size: 1.25rem;
      color: var(--accent-500);
    }
    
    span {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text);
    }
  }
  
  .result-value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    
    .value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text);
    }
  }
  
  .copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: rgb(var(--accent-500-rgb) / 15%);
    border: none;
    border-radius: 0.5rem;
    color: var(--accent-500);
    cursor: pointer;
    transition: all 0.2s;
    
    .material-icons {
      font-size: 1.1rem;
    }
    
    &:hover {
      background: var(--accent-500);
      color: white;
    }
  }
}

/* Output Unit Dropdown */
.output-unit-selector {
  position: relative;
}

.unit-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.5rem;
  background: rgb(var(--accent-500-rgb) / 15%);
  border: 1px solid rgb(var(--accent-500-rgb) / 30%);
  border-radius: 0.5rem;
  color: var(--accent-500);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgb(var(--accent-500-rgb) / 25%);
  }
  
  &.open {
    background: rgb(var(--accent-500-rgb) / 30%);
    
    .caret {
      transform: rotate(180deg);
    }
  }
  
  .unit-symbol {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
    font-weight: 700;
    min-width: 2rem;
    text-align: center;
  }
  
  .caret {
    font-size: 1.1rem;
    transition: transform 0.2s;
  }
}

.output-dropdown {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  right: 0;
  z-index: 100;
  min-width: 220px;
  max-width: 280px;
  background: #1a1f2e;
  background: var(--main-bg);
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 0.75rem;
  box-shadow: 0 -8px 32px rgb(0 0 0 / 40%);
  overflow: hidden;
  
  @media (max-width: 640px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    min-width: unset;
    max-width: unset;
    border-radius: 1rem 1rem 0 0;
    max-height: 60vh;
  }
  
  .dropdown-search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgb(0 0 0 / 20%);
    border-bottom: 1px solid rgb(var(--accent-500-rgb) / 10%);
    
    .material-icons {
      font-size: 1.1rem;
      color: var(--neutral);
    }
    
    input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--text);
      font-size: 0.9rem;
      outline: none;
      
      &::placeholder {
        color: var(--text);
        opacity: 0.5;
      }
    }
  }
  
  .dropdown-options {
    max-height: 240px;
    overflow-y: auto;
    padding: 0.25rem;
    
    /* Custom scrollbar */
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--accent-500-rgb) / 40%) transparent;
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgb(var(--accent-500-rgb) / 35%);
      border-radius: 999px;
    }
    
    @media (max-width: 640px) {
      max-height: 50vh;
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
  }
  
  .dropdown-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.65rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    color: var(--text);
    text-align: left;
    cursor: pointer;
    transition: background 0.15s;
    
    &:hover {
      background: rgb(var(--accent-500-rgb) / 12%);
    }
    
    &.active {
      background: rgb(var(--accent-500-rgb) / 18%);
      
      .option-name {
        color: var(--accent-500);
        font-weight: 600;
      }
    }
    
    .option-name {
      flex: 1;
      font-size: 0.9rem;
    }
    
    .option-symbol {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--accent-500);
      min-width: 2.5rem;
      text-align: right;
    }
    
    .check {
      font-size: 1rem;
      color: var(--accent-500);
    }
  }
}

/* Dropdown animation */
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.2s ease;
}

.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Conversions Section */
.conversions-section {
  background: var(--card);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
}

.conversions-header {
  margin-bottom: 1.25rem;
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text);
    
    .material-icons {
      font-size: 1.25rem;
      color: var(--accent-500);
    }
  }
}

.conversions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.conversion-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  background: var(--input-bg);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--accent-500);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
    
    .copy-icon {
      opacity: 1;
    }
  }
  
  &.active {
    background: rgb(var(--accent-500-rgb) / 10%);
    border-color: var(--accent-500);
  }
  
  &.copied {
    .copy-icon {
      opacity: 1;
      color: var(--success, #22c55e);
    }
  }
  
  .conv-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    
    .conv-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text);
    }
    
    .conv-symbol {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--accent-500);
    }
  }
  
  .conv-value {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text);
    
    .copy-icon {
      font-size: 0.9rem;
      color: var(--accent-500);
      opacity: 0;
      transition: opacity 0.2s;
    }
  }
}
</style>
