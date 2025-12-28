<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

interface Props {
  modelValue?: boolean
  indeterminate?: boolean
  label?: string
  disabled?: boolean
  value?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  indeterminate: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}>()

const checkbox = ref<HTMLInputElement>()
const isChecked = computed(() => props.modelValue)

const toggle = () => {
  if (!props.disabled) {
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}

/* Handle indeterminate state */
watchEffect(() => {
  if (checkbox.value) {
    checkbox.value.indeterminate = props.indeterminate
  }
})
</script>

<template>
  <label 
    class="checkbox"
    :class="{ 
      'checkbox--checked': isChecked,
      'checkbox--indeterminate': indeterminate,
      'checkbox--disabled': disabled 
    }"
  >
      <input
      ref="checkbox"
        type="checkbox"
      :checked="isChecked"
        :disabled="disabled"
      :value="value"
      class="checkbox-input"
        @change="toggle"
    />
    <span class="checkbox-control">
      <span class="checkbox-check">
        <svg v-if="!indeterminate" class="checkbox-icon" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else class="checkbox-icon checkbox-icon--indeterminate" viewBox="0 0 10 2">
          <line x1="0" y1="1" x2="10" y2="1" stroke-linecap="round" />
        </svg>
      </span>
    </span>
    <span v-if="label || $slots.default" class="checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped lang="scss">
/* Size variables */
$checkbox-size: 18px;
$border-radius: 3px;
$border-width: 2px;
$check-thickness: 2px;
$animation-duration: 0.2s;

.checkbox {
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

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;

  &:focus-visible + .checkbox-control {
    outline: 2px solid var(--accent-500);
    outline-offset: 2px;
  }
}

.checkbox-control {
  display: inline-block;
  position: relative;
  width: $checkbox-size;
  height: $checkbox-size;
  flex-shrink: 0;
}

.checkbox-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: $border-width solid rgba(var(--text-rgb), 0.3);
  border-radius: $border-radius;
  background: var(--card);
  transition: all $animation-duration;
  
  .checkbox:hover:not(.checkbox--disabled) & {
    border-color: rgba(var(--text-rgb), 0.4);
  }
  
  .checkbox--checked & {
    background: var(--accent-500);
    border-color: var(--accent-500);
  }
  
  .checkbox--indeterminate & {
    background: var(--accent-500);
    border-color: var(--accent-500);
  }
    
  .checkbox:active:not(.checkbox--disabled) & {
    transform: scale(0.9);
  }
}

.checkbox-icon {
  width: 12px;
  height: 10px;
  fill: none;
  stroke: white;
  stroke-width: $check-thickness;
  opacity: 0;
  transform: scale(0.5);
  transition: all $animation-duration;

  .checkbox--checked &,
  .checkbox--indeterminate & {
    opacity: 1;
    transform: scale(1);
  }

  &--indeterminate {
    width: 10px;
    height: 2px;
  }
}

.checkbox-label {
  font-size: 0.875rem;
  color: var(--text);
  line-height: 1.5;

  .checkbox--disabled & {
    color: rgba(var(--text-rgb), 0.6);
  }
}

/* Animation keyframes */
@keyframes check-in {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(-45deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

.checkbox--checked .checkbox-icon {
  animation: check-in $animation-duration cubic-bezier(0.4, 0, 0.2, 1);
}
</style>