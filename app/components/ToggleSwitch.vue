<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOn = computed(() => props.modelValue)

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

/* Size configurations */
const sizeConfig = {
  sm: { width: '34px', height: '20px', thumbSize: '14px' },
  md: { width: '44px', height: '24px', thumbSize: '18px' },
  lg: { width: '56px', height: '30px', thumbSize: '24px' }
}

const currentSize = computed(() => sizeConfig[props.size])
</script>

<template>
  <label 
    class="toggle-switch"
    :class="[
      `toggle-switch--${size}`,
      { 
        'toggle-switch--on': isOn,
        'toggle-switch--disabled': disabled 
      }
    ]"
  >
    <span v-if="label" class="toggle-label">{{ label }}</span>
      <button
        type="button"
        role="switch"
      :aria-checked="isOn"
        :disabled="disabled"
      class="toggle-control"
      @click.prevent="toggle"
      @keydown.space.prevent
      @keyup.space.prevent="toggle"
      @keyup.enter.prevent="toggle"
      >
      <span class="toggle-track"></span>
      <span class="toggle-thumb"></span>
      </button>
  </label>
</template>

<style scoped lang="scss">
/* Size variables */
$width-sm: 34px;
$height-sm: 20px;
$thumb-sm: 14px;

$width-md: 44px;
$height-md: 24px;
$thumb-md: 18px;

$width-lg: 56px;
$height-lg: 30px;
$thumb-lg: 24px;

.toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  
  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.toggle-label {
  font-size: 0.875rem;
  font-weight: 500;
    color: var(--text);
}

.toggle-control {
  position: relative;
  display: inline-block;
  background: none;
  border: none;
  padding: 0;
  cursor: inherit;
  touch-action: pan-y;
  
  &:focus-visible {
    outline: 2px solid var(--accent-500);
    outline-offset: 2px;
    border-radius: 999px;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
}

.toggle-track {
  display: block;
  background: rgba(var(--text-rgb), 0.2);
  border-radius: 999px;
  transition: background-color 0.2s;
    
  .toggle-switch--sm & {
    width: $width-sm;
    height: $height-sm;
  }
    
  .toggle-switch--md & {
    width: $width-md;
    height: $height-md;
  }
    
  .toggle-switch--lg & {
    width: $width-lg;
    height: $height-lg;
    }

  .toggle-switch--on & {
    background: var(--accent-500);
  }
    
  .toggle-switch--disabled & {
    background: rgba(var(--text-rgb), 0.1);
    }

  .toggle-switch--on.toggle-switch--disabled & {
    background: rgba(var(--accent-500-rgb), 0.4);
  }
}

.toggle-thumb {
  position: absolute;
  top: 50%;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(-50%);

  .toggle-switch--sm & {
    width: $thumb-sm;
    height: $thumb-sm;
    left: 3px;
  }

  .toggle-switch--md & {
    width: $thumb-md;
    height: $thumb-md;
    left: 3px;
  }

  .toggle-switch--lg & {
    width: $thumb-lg;
    height: $thumb-lg;
    left: 3px;
  }

  .toggle-switch--on.toggle-switch--sm & {
    transform: translateY(-50%) translateX(calc($width-sm - $thumb-sm - 6px));
  }

  .toggle-switch--on.toggle-switch--md & {
    transform: translateY(-50%) translateX(calc($width-md - $thumb-md - 6px));
  }

  .toggle-switch--on.toggle-switch--lg & {
    transform: translateY(-50%) translateX(calc($width-lg - $thumb-lg - 6px));
  }

  .toggle-switch:hover:not(.toggle-switch--disabled) & {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .toggle-switch:active:not(.toggle-switch--disabled) & {
    transform: translateY(-50%) scale(0.95);
  }

  .toggle-switch--on:active:not(.toggle-switch--disabled).toggle-switch--sm & {
    transform: translateY(-50%) translateX(calc($width-sm - $thumb-sm - 6px)) scale(0.95);
  }

  .toggle-switch--on:active:not(.toggle-switch--disabled).toggle-switch--md & {
    transform: translateY(-50%) translateX(calc($width-md - $thumb-md - 6px)) scale(0.95);
  }

  .toggle-switch--on:active:not(.toggle-switch--disabled).toggle-switch--lg & {
    transform: translateY(-50%) translateX(calc($width-lg - $thumb-lg - 6px)) scale(0.95);
  }

  .toggle-switch--disabled & {
    background: rgba(var(--text-rgb), 0.5);
    box-shadow: none;
  }
}
</style>