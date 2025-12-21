<script setup lang="ts">
import type { UnitDefinition } from './calculators/types'
import type { DropdownOption } from '~/components/Dropdown.vue'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = defineProps<{
  units: UnitDefinition[]
  label?: string
}>()

const modelValue = defineModel<string>({ required: true })

/* Convert units to dropdown options with translation */
const dropdownOptions = computed<DropdownOption[]>(() => 
  props.units.map((unit: UnitDefinition) => ({
    value: unit.id,
    label: t(unit.name),
    sublabel: unit.symbol,
  }))
)
</script>

<template>
  <div class="unit-select">
    <label v-if="label" class="label">{{ label }}</label>
    <Dropdown
      v-model="modelValue"
      :options="dropdownOptions"
      :searchable="units.length > 10"
      :search-placeholder="t('Search units...')"
      max-height="360px"
      full-width
    />
  </div>
</template>

<style scoped lang="scss">
.unit-select {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  opacity: 0.8;
}

:deep(.dropdown-trigger) {
  padding: 0.875rem 1rem;
  
  .trigger-label .sub-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }
}

:deep(.dropdown-option .option-label .sub-label) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
</style>
