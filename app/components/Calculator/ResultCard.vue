<script setup lang="ts">
import { computed } from 'vue'
import Dropdown from '~/components/Dropdown.vue'
import type { DropdownOption } from '~/components/Dropdown.vue'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

interface UnitOption {
  id: string
  name: string
  symbol: string
}

const props = defineProps<{
  label: string
  value: string
  icon?: string
  units: UnitOption[]
  selectedUnit: string
  copied?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:selectedUnit', value: string): void
  (e: 'copy'): void
}>()

/* Convert units to dropdown options */
const dropdownOptions = computed<DropdownOption[]>(() =>
  props.units.map(u => ({
    value: u.id,
    label: t(u.name),
    sublabel: u.symbol,
  }))
)

/* Current selected unit */
const currentUnit = computed(() => 
  props.units.find(u => u.id === props.selectedUnit) ?? props.units[0]
)

/* Handle unit selection */
function onUnitChange(value: string) {
  emit('update:selectedUnit', value)
}
</script>

<template>
  <div class="result-card">
    <div class="result-label">
      <span class="material-icons">{{ icon ?? 'calculate' }}</span>
      <span>{{ t(label) }}</span>
    </div>
    <div class="result-value">
      <span class="value">{{ value }}</span>
      <!-- Unit selector using Dropdown component -->
      <div class="output-unit-selector">
        <Dropdown
          :model-value="selectedUnit"
          :options="dropdownOptions"
          :searchable="units.length > 6"
          :search-placeholder="t('Search units...')"
          max-height="280px"
          align="right"
          @update:model-value="onUnitChange"
        />
      </div>
    </div>
    <button class="copy-btn" @click="emit('copy')" :title="t('Copy value')">
      <span class="material-icons">{{ copied ? 'check' : 'content_copy' }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.result-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 12%) 0%, rgb(var(--accent-500-rgb) / 6%) 100%);
  border: 2px solid rgb(var(--accent-500-rgb) / 25%);
  border-radius: 1rem;
  
  & + & {
    margin-top: 0.75rem;
  }
  
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

/* Output Unit Selector - Compact styling for Dropdown */
.output-unit-selector {
  :deep(.dropdown-trigger) {
    padding: 0.35rem 0.5rem;
    background: rgb(var(--accent-500-rgb) / 15%);
    border: 1px solid rgb(var(--accent-500-rgb) / 30%);
    border-radius: 0.5rem;
    color: var(--accent-500);
    min-width: auto;
    gap: 0.25rem;
    
    &:hover {
      background: rgb(var(--accent-500-rgb) / 25%);
    }
    
    .trigger-label {
      flex-direction: row;
      gap: 0;
      
      .main-label {
        display: none;
      }
      
      .sub-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1rem;
        font-weight: 700;
        color: var(--accent-500);
        min-width: 2rem;
        text-align: center;
      }
    }
    
    .caret {
      font-size: 1.1rem;
      color: var(--accent-500);
    }
  }
  
  :deep(.dropdown-panel) {
    bottom: calc(100% + 0.5rem);
    top: auto;
    min-width: 220px;
    max-width: 280px;
    box-shadow: 0 -8px 32px rgb(0 0 0 / 40%);
    
    @media (max-width: 640px) {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      min-width: unset;
      max-width: unset;
      border-radius: 1rem 1rem 0 0;
      max-height: 60vh !important;
    }
  }
  
  :deep(.dropdown-option) {
    .option-label {
      flex-direction: row;
      justify-content: space-between;
      flex: 1;
      gap: 0.75rem;
      
      .main-label {
        flex: 1;
      }
      
      .sub-label {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
        color: var(--accent-500);
        min-width: 3rem;
        text-align: right;
      }
    }
  }
}
</style>
