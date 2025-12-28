<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string | number
  label: string
  icon?: string
}

interface Props {
  modelValue: string | number
  options: Option[]
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectedIndex = computed(() => 
  props.options.findIndex(opt => opt.value === props.modelValue)
)

const selectOption = (value: string | number) => {
  if (!props.disabled) {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <div 
    class="capsule-slider" 
    :class="[
      `capsule-slider--${size}`,
      { 'capsule-slider--disabled': disabled }
    ]"
    role="radiogroup"
  >
    <div 
      class="capsule-indicator"
      :style="{ 
        transform: `translateX(${selectedIndex * 100}%)`,
        width: `${100 / options.length}%`
      }"
    />
    <button
      v-for="(option, index) in options"
      :key="option.value"
      type="button"
      class="capsule-option"
      :class="{ 'capsule-option--active': modelValue === option.value }"
      :disabled="disabled"
      role="radio"
      :aria-checked="modelValue === option.value"
      @click="selectOption(option.value)"
    >
      <span v-if="option.icon" class="material-icons capsule-icon">{{ option.icon }}</span>
      <span class="capsule-label">{{ option.label }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
/* Size configurations */
$height-sm: 32px;
$height-md: 40px;
$height-lg: 48px;

$padding-sm: 0.5rem 1rem;
$padding-md: 0.625rem 1.25rem;
$padding-lg: 0.75rem 1.5rem;

$font-sm: 0.75rem;
$font-md: 0.875rem;
$font-lg: 1rem;

.capsule-slider {
  position: relative;
  display: inline-flex;
  background: rgba(var(--text-rgb), 0.1);
  border-radius: 999px;
  padding: 3px;

  &--sm {
    height: $height-sm;
    
    .capsule-option {
      padding: $padding-sm;
      font-size: $font-sm;
    }
  }

  &--md {
    height: $height-md;
    
    .capsule-option {
      padding: $padding-md;
      font-size: $font-md;
    }
  }

  &--lg {
    height: $height-lg;
    
    .capsule-option {
      padding: $padding-lg;
      font-size: $font-lg;
    }
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.capsule-indicator {
  position: absolute;
  top: 3px;
  bottom: 3px;
  background: var(--accent-500);
  border-radius: 999px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.capsule-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  border-radius: 999px;
  font-weight: 500;
  color: rgba(var(--text-rgb), 0.7);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  z-index: 1;
  flex: 1;

  &:hover:not(:disabled) {
    color: var(--text);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-500);
    outline-offset: 2px;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  &--active {
    color: white;

    &:hover {
      color: white;
    }
  }
  }
  
.capsule-icon {
  font-size: 1.125rem;
}

.capsule-label {
  position: relative;
}

/* Smooth transitions */
@media (prefers-reduced-motion: no-preference) {
  .capsule-indicator {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .capsule-slider {
    border: 1px solid;
  }

  .capsule-indicator {
    border: 1px solid;
  }
}
</style>