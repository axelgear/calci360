<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: any
  value: any
  name: string
  label?: string
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const isChecked = computed(() => props.modelValue === props.value)

const handleChange = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}
</script>

<template>
  <label 
    class="radio-button"
    :class="{ 
      'radio-button--checked': isChecked,
      'radio-button--disabled': disabled 
    }"
  >
      <input
        type="radio"
        :name="name"
        :value="value"
        :checked="isChecked"
        :disabled="disabled"
      class="radio-input"
        @change="handleChange"
      />
    <span class="radio-control">
      <span class="radio-dot"></span>
    </span>
    <span v-if="label || $slots.default" class="radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped lang="scss">
/* Size variables */
$radio-size: 18px;
$dot-size: 8px;
$border-width: 2px;
$animation-duration: 0.2s;

.radio-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  position: relative;
  
  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;

  &:focus-visible + .radio-control {
    outline: 2px solid var(--accent-500);
    outline-offset: 2px;
  }
}

.radio-control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $radio-size;
  height: $radio-size;
  border: $border-width solid rgba(var(--text-rgb), 0.3);
  border-radius: 50%;
  background: var(--card);
  transition: border-color $animation-duration, background-color $animation-duration;
  flex-shrink: 0;
  
  .radio-button:hover:not(.radio-button--disabled) & {
    border-color: rgba(var(--text-rgb), 0.4);
  }
  
  .radio-button--checked & {
    border-color: var(--accent-500);
    background: var(--accent-500);
  }
    
  .radio-button:active:not(.radio-button--disabled) & {
    transform: scale(0.95);
  }
}

.radio-dot {
  width: $dot-size;
  height: $dot-size;
  border-radius: 50%;
  background: white;
  transform: scale(0);
  opacity: 0;
  transition: transform 0.15s ease-out, opacity 0.15s ease-out;

  .radio-button--checked & {
    transform: scale(1);
    opacity: 1;
  }
}

.radio-label {
  font-size: 0.875rem;
  color: var(--text);
  line-height: 1.5;

  .radio-button--disabled & {
    color: rgba(var(--text-rgb), 0.6);
}
}

/* Removed keyframe animation to prevent delays - using transitions instead */
</style>