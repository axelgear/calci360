<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  label?: string
  disabled?: boolean
  indeterminate?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const checkboxClass = computed(() => ({
  'checkbox--checked': props.modelValue,
  'checkbox--indeterminate': props.indeterminate && !props.modelValue,
  'checkbox--disabled': props.disabled,
}))
</script>

<template>
  <label class="checkbox-wrapper" :class="{ 'checkbox-wrapper--disabled': disabled }">
    <div class="checkbox" :class="checkboxClass" @click="toggle">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        @change="toggle"
        class="checkbox__input"
      />
      <span class="checkbox__icon material-icons">
        {{ indeterminate && !modelValue ? 'remove' : 'check' }}
      </span>
    </div>
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  
  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.checkbox {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  background: var(--card);
  border: 2px solid rgb(var(--accent-500-rgb) / 30%);
  border-radius: 0.25rem;
  transition: all 0.2s;
  
  &:hover:not(.checkbox--disabled) {
    border-color: var(--accent-500);
  }
  
  &--checked {
    background: var(--accent-500);
    border-color: var(--accent-500);
    
    .checkbox__icon {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  &--indeterminate {
    background: var(--accent-500);
    border-color: var(--accent-500);
    
    .checkbox__icon {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  &--disabled {
    cursor: not-allowed;
  }
}

.checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox__icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.5);
  color: white;
  font-size: 1rem;
  opacity: 0;
  transition: all 0.2s;
}

.checkbox-label {
  color: var(--text);
  font-size: 0.9rem;
}
</style>
