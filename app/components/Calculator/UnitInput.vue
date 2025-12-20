<script setup lang="ts">
/**
 * UnitInput - Combined number input with unit dropdown selector
 * Displays the selected unit on the right side of the input
 * Click the unit to open dropdown for changing it
 */
import type { DropdownOption } from '~/components/Dropdown.vue'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

export interface UnitOption {
  id: string
  name: string
  symbol: string
  toBase: number
}

const props = withDefaults(defineProps<{
  label?: string
  symbol?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  units: UnitOption[]
  disabled?: boolean
}>(), {
  placeholder: 'Enter value',
  min: 0.1,
  step: 0.1,
})

const modelValue = defineModel<number>('modelValue', { required: true })
const selectedUnit = defineModel<string>('unit', { required: true })

const inputRef = ref<HTMLInputElement | null>(null)
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

/* Current unit object */
const currentUnit = computed(() =>
  props.units.find((u: UnitOption) => u.id === selectedUnit.value) ?? props.units[0]
)

/* Dropdown options */
const dropdownOptions = computed<DropdownOption[]>(() =>
  props.units.map((u: UnitOption) => ({
    value: u.id,
    label: t(u.name),
    sublabel: u.symbol,
  }))
)

/* Handle number input */
function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (!isNaN(value)) {
    modelValue.value = value
  }
}

/* Toggle dropdown */
function toggleDropdown() {
  if (props.disabled) return
  isDropdownOpen.value = !isDropdownOpen.value
}

/* Select unit */
function selectUnit(unitId: string) {
  selectedUnit.value = unitId
  isDropdownOpen.value = false
}

/* Close dropdown on click outside */
onClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false
})

/* Focus input */
function focus() {
  inputRef.value?.focus()
}

/* Increment value */
function increment() {
  if (props.disabled) return
  const step = props.step ?? 0.1
  const newVal = (modelValue.value ?? 0) + step
  if (props.max === undefined || newVal <= props.max) {
    modelValue.value = Math.round(newVal * 1e10) / 1e10 /* Avoid floating point issues */
  }
}

/* Decrement value */
function decrement() {
  if (props.disabled) return
  const step = props.step ?? 0.1
  const newVal = (modelValue.value ?? 0) - step
  if (props.min === undefined || newVal >= props.min) {
    modelValue.value = Math.round(newVal * 1e10) / 1e10
  }
}

defineExpose({ focus })
</script>

<template>
  <div class="unit-input" :class="{ disabled }">
    <label v-if="label" class="input-label">
      <span class="label-text">{{ t(label) }}</span>
      <span v-if="symbol" class="label-symbol">({{ symbol }})</span>
    </label>
    
    <div class="input-container" ref="dropdownRef">
      <!-- Decrement button -->
      <button
        type="button"
        class="stepper-btn decrement"
        @click="decrement"
        :disabled="disabled || (min !== undefined && (modelValue ?? 0) <= min)"
        tabindex="-1"
      >
        <span class="material-icons">remove</span>
      </button>
      
      <input
        ref="inputRef"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        :placeholder="t(placeholder)"
        :disabled="disabled"
        @input="handleInput"
      />
      
      <!-- Increment button -->
      <button
        type="button"
        class="stepper-btn increment"
        @click="increment"
        :disabled="disabled || (max !== undefined && (modelValue ?? 0) >= max)"
        tabindex="-1"
      >
        <span class="material-icons">add</span>
      </button>
      
      <!-- Unit selector button -->
      <button
        type="button"
        class="unit-selector-btn"
        :class="{ open: isDropdownOpen }"
        @click="toggleDropdown"
        :disabled="disabled"
      >
        <span class="unit-symbol">{{ currentUnit?.symbol }}</span>
        <span class="material-icons caret">expand_more</span>
      </button>
      
      <!-- Dropdown panel -->
      <Transition name="dropdown-slide">
        <div v-if="isDropdownOpen" class="unit-dropdown">
          <div class="dropdown-search">
            <span class="material-icons">search</span>
            <input
              type="text"
              :placeholder="t('Search units...')"
              @click.stop
            />
          </div>
          <div class="dropdown-options">
            <button
              v-for="unit in units"
              :key="unit.id"
              type="button"
              class="dropdown-option"
              :class="{ active: unit.id === selectedUnit }"
              @click="selectUnit(unit.id)"
            >
              <span class="option-name">{{ t(unit.name) }}</span>
              <span class="option-symbol">{{ unit.symbol }}</span>
              <span v-if="unit.id === selectedUnit" class="material-icons check">check</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.unit-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.input-label {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  
  .label-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
  }
  
  .label-symbol {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: var(--accent-500);
  }
}

.input-container {
  position: relative;
  display: flex;
  align-items: stretch;
  background: var(--card);
  border: 2px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    border-color: rgb(var(--accent-500-rgb) / 30%);
  }
  
  &:focus-within {
    border-color: var(--accent-500);
    box-shadow: 0 0 0 4px rgb(var(--accent-500-rgb) / 12%);
  }
  
  input {
    flex: 1;
    min-width: 0;
    padding: 0.875rem 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    color: var(--text);
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
    
    &::placeholder {
      color: var(--text);
      opacity: 0.4;
      font-weight: 400;
    }
    
    /* Hide number input spinners */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }
    &[type=number] {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  }
}

/* Stepper buttons */
.stepper-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--neutral);
  cursor: pointer;
  transition: all 0.15s;
  
  .material-icons {
    font-size: 1.25rem;
  }
  
  &:hover:not(:disabled) {
    color: var(--accent-500);
    background: rgb(var(--accent-500-rgb) / 8%);
  }
  
  &:active:not(:disabled) {
    background: rgb(var(--accent-500-rgb) / 15%);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  &.decrement {
    border-right: 1px solid rgb(var(--accent-500-rgb) / 10%);
    border-radius: 0.6rem 0 0 0.6rem;
  }
  
  &.increment {
    border-left: 1px solid rgb(var(--accent-500-rgb) / 10%);
  }
}

.unit-selector-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.75rem;
  background: rgb(var(--accent-500-rgb) / 8%);
  border: none;
  border-left: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0 0.6rem 0.6rem 0;
  color: var(--accent-500);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgb(var(--accent-500-rgb) / 15%);
  }
  
  &.open {
    background: rgb(var(--accent-500-rgb) / 20%);
    
    .caret {
      transform: rotate(180deg);
    }
  }
  
  .unit-symbol {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.95rem;
    font-weight: 700;
    min-width: 2rem;
    text-align: center;
  }
  
  .caret {
    font-size: 1.1rem;
    transition: transform 0.2s;
  }
}

/* Dropdown */
.unit-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 100;
  min-width: 200px;
  max-width: 280px;
  background: #1a1f2e;
  background: var(--main-bg);
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 0.75rem;
  box-shadow: 0 12px 32px rgb(0 0 0 / 40%);
  overflow: hidden;
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

/* Dropdown animation */
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.2s ease;
}

.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Mobile styles */
@media (max-width: 640px) {
  .unit-dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    min-width: unset;
    max-width: unset;
    border-radius: 1rem 1rem 0 0;
    max-height: 60vh;
  }
  
  .dropdown-options {
    max-height: 50vh;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
  
  .dropdown-option {
    padding: 0.85rem 1rem;
  }
}
</style>

