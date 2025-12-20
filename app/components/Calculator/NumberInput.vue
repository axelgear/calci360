<script setup lang="ts">
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = withDefaults(defineProps<{
  label?: string
  placeholder?: string
  symbol?: string
  disabled?: boolean
  focused?: boolean
}>(), {
  placeholder: 'Enter value',
})

const modelValue = defineModel<number | string>({ required: true })
const inputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{
  focus: []
  blur: []
}>()

/* Translated placeholder */
const translatedPlaceholder = computed(() => t(props.placeholder))

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const value = target.value
  
  /* Allow empty, negative, and decimal values */
  if (value === '' || value === '-' || value === '.') {
    modelValue.value = value
    return
  }
  
  const num = parseFloat(value)
  if (!isNaN(num)) {
    modelValue.value = num
  }
}

function handleFocus() {
  emit('focus')
}

function handleBlur() {
  emit('blur')
}

/* Select all text on focus */
function selectAll() {
  inputRef.value?.select()
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  selectAll,
})
</script>

<template>
  <div class="number-input" :class="{ focused, disabled }">
    <label v-if="label" class="label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        ref="inputRef"
        type="text"
        inputmode="decimal"
        :value="modelValue"
        :placeholder="translatedPlaceholder"
        :disabled="disabled"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <span v-if="symbol" class="symbol">{{ symbol }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.number-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  opacity: 0.8;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  
  input {
    width: 100%;
    padding: 1rem 1.25rem;
    padding-right: 3.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
    color: var(--text);
    background: var(--card);
    border: 2px solid rgb(var(--accent-500-rgb) / 15%);
    border-radius: 0.75rem;
    transition: all 0.2s;
    
    &::placeholder {
      color: var(--text);
      opacity: 0.3;
      font-weight: 400;
    }
    
    &:hover {
      border-color: rgb(var(--accent-500-rgb) / 30%);
    }
    
    &:focus {
      outline: none;
      border-color: var(--accent-500);
      box-shadow: 0 0 0 4px rgb(var(--accent-500-rgb) / 15%);
    }
    
    @include phone {
      font-size: 1.25rem;
      padding: 0.85rem 1rem;
      padding-right: 3rem;
    }
  }
  
  .symbol {
    position: absolute;
    right: 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent-500);
    pointer-events: none;
  }
}

.focused .input-wrapper input {
  border-color: var(--accent-500);
  box-shadow: 0 0 0 4px rgb(var(--accent-500-rgb) / 15%);
}
</style>
