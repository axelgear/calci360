<script setup lang="ts">
import type { ConverterConfig, ConversionResult, UnitDefinition } from './calculators/types'
import type { UnitOption } from './UnitInput.vue'
import { convertUnit, getAllConversions } from './calculators/types'
import { useUiTranslator } from '@/composables/useUiTranslator'
import UnitInput from './UnitInput.vue'

const { t } = useUiTranslator()

const props = defineProps<{
  config: ConverterConfig
}>()

/* Convert UnitDefinition[] to UnitOption[] for UnitInput component */
const unitOptions = computed<UnitOption[]>(() =>
  props.config.units.map((u: UnitDefinition) => ({
    id: u.id,
    name: u.name,
    symbol: u.symbol,
    toBase: u.toBase ?? 1,
  }))
)

/* State */
const fromValue = ref<number>(1)
const toValue = ref<number>(1)
const fromUnitId = ref(props.config.defaultFromUnit)
const toUnitId = ref(props.config.defaultToUnit)
const activeInput = ref<'from' | 'to'>('from')

/* Computed units */
const fromUnit = computed<UnitDefinition | undefined>(() => 
  props.config.units.find((u: UnitDefinition) => u.id === fromUnitId.value)
)

const toUnit = computed<UnitDefinition | undefined>(() => 
  props.config.units.find((u: UnitDefinition) => u.id === toUnitId.value)
)

/* Computed display values based on active input and conversion */
const fromDisplayValue = computed(() => {
  if (activeInput.value === 'from') {
    return fromValue.value
  }
  /* Convert toValue to fromValue */
  if (!fromUnit.value || !toUnit.value) return 0
  return convertUnit(toValue.value, toUnit.value, fromUnit.value)
})

const toDisplayValue = computed(() => {
  if (activeInput.value === 'to') {
    return toValue.value
  }
  /* Convert fromValue to toValue */
  if (!fromUnit.value || !toUnit.value) return 0
  return convertUnit(fromValue.value, fromUnit.value, toUnit.value)
})

/* All conversions for table */
const allConversions = computed<ConversionResult[]>(() => {
  const value = activeInput.value === 'from' ? fromValue.value : toValue.value
  const sourceUnit = activeInput.value === 'from' ? fromUnit.value : toUnit.value
  
  if (isNaN(value) || !sourceUnit) {
    return props.config.units.map((u: UnitDefinition) => ({
      unitId: u.id,
      unitName: u.name,
      symbol: u.symbol,
      value: 0,
      formatted: '0',
    }))
  }
  
  return getAllConversions(value, sourceUnit, props.config.units, props.config.precision)
})

/* Helper to format display values */
function formatDisplayValue(value: number): string {
  if (!Number.isFinite(value)) return '0'
  
  const precision = props.config.precision ?? 6
  
  if (Math.abs(value) > 0 && (Math.abs(value) < 0.0001 || Math.abs(value) >= 1e9)) {
    return value.toExponential(precision)
  }
  
  const factor = Math.pow(10, precision)
  const rounded = Math.round(value * factor) / factor
  
  return rounded.toLocaleString('en-US', {
    maximumFractionDigits: precision,
    useGrouping: false,
  })
}

/* Handle from input changes */
function onFromValueChange(value: number) {
  activeInput.value = 'from'
  fromValue.value = value
}

/* Handle to input changes */
function onToValueChange(value: number) {
  activeInput.value = 'to'
  toValue.value = value
}

/* Swap units */
function swapUnits() {
  const tempUnit = fromUnitId.value
  fromUnitId.value = toUnitId.value
  toUnitId.value = tempUnit
}

/* Handle unit selection from table */
function handleSelectUnit(unitId: string) {
  if (activeInput.value === 'from') {
    fromUnitId.value = unitId
  } else {
    toUnitId.value = unitId
  }
}

/* Reset to defaults */
function reset() {
  fromValue.value = 1
  toValue.value = 1
  fromUnitId.value = props.config.defaultFromUnit
  toUnitId.value = props.config.defaultToUnit
  activeInput.value = 'from'
}
</script>

<template>
  <div class="converter-widget">
    <!-- Main Conversion Area -->
    <div class="conversion-area">
      <div class="input-group" :class="{ active: activeInput === 'from' }">
        <UnitInput
          :model-value="fromDisplayValue"
          v-model:unit="fromUnitId"
          :units="unitOptions"
          :label="t('From')"
          @update:model-value="onFromValueChange"
          @focus="activeInput = 'from'"
        />
      </div>
      
      <button class="swap-btn" @click="swapUnits" :title="t('Swap units')">
        <span class="material-icons">swap_horiz</span>
      </button>
      
      <div class="input-group" :class="{ active: activeInput === 'to' }">
        <UnitInput
          :model-value="toDisplayValue"
          v-model:unit="toUnitId"
          :units="unitOptions"
          :label="t('To')"
          @update:model-value="onToValueChange"
          @focus="activeInput = 'to'"
        />
      </div>
    </div>
    
    <!-- Result Display -->
    <div class="result-display">
      <div class="result-value">
        <span class="from-value">{{ formatDisplayValue(fromDisplayValue) }}</span>
        <span class="unit">{{ fromUnit?.symbol }}</span>
      </div>
      <span class="material-icons equals">=</span>
      <div class="result-value highlight">
        <span class="to-value">{{ formatDisplayValue(toDisplayValue) }}</span>
        <span class="unit">{{ toUnit?.symbol }}</span>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="quick-actions">
      <button class="action-btn" @click="reset">
        <span class="material-icons">refresh</span>
        {{ t('Reset') }}
      </button>
    </div>
    
    <!-- All Conversions Table -->
    <CalculatorConversionTable
      v-if="config.showAllConversions"
      :conversions="allConversions"
      :current-unit-id="activeInput === 'from' ? fromUnitId : toUnitId"
      @select-unit="handleSelectUnit"
    />
  </div>
</template>

<style scoped lang="scss">
.converter-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.conversion-area {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: end;
  
  @include phone {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 10;
  
  &:first-child {
    z-index: 11;
  }
  
  &.active :deep(.input-container) {
    border-color: var(--accent-500);
    box-shadow: 0 0 0 4px rgb(var(--accent-500-rgb) / 12%);
  }
}

.swap-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
  border: 2px solid rgb(var(--accent-500-rgb) / 20%);
  background: var(--card);
  color: var(--accent-500);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  
  .material-icons {
    font-size: 1.5rem;
  }
  
  &:hover {
    background: var(--accent-500);
    color: white;
    border-color: var(--accent-500);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @include phone {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    
    .material-icons {
      font-size: 1.25rem;
      transform: rotate(90deg);
    }
  }
}

.result-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 8%) 0%, rgb(var(--accent-500-rgb) / 3%) 100%);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 1rem;
  flex-wrap: wrap;
  
  @include phone {
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .result-value {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    
    .from-value,
    .to-value {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text);
      
      @include phone {
        font-size: 1.25rem;
      }
    }
    
    .unit {
      font-size: 1rem;
      font-weight: 500;
      color: var(--neutral);
      
      @include phone {
        font-size: 0.85rem;
      }
    }
    
    &.highlight {
      .to-value {
        color: var(--accent-500);
      }
      
      .unit {
        color: var(--accent-500);
        opacity: 0.8;
      }
    }
  }
  
  .equals {
    font-size: 1.5rem;
    color: var(--neutral);
    opacity: 0.5;
    
    @include phone {
      font-size: 1.25rem;
    }
  }
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  
  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--neutral);
    background: transparent;
    border: 1px solid rgb(var(--accent-500-rgb) / 15%);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    
    .material-icons {
      font-size: 1.1rem;
    }
    
    &:hover {
      color: var(--accent-500);
      border-color: var(--accent-500);
      background: rgb(var(--accent-500-rgb) / 5%);
    }
  }
}
</style>
