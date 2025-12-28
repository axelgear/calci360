<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  labelOn?: string
  labelOff?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  labelOn: 'On',
  labelOff: 'Off',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <label class="toggle-switch" :class="{ 'toggle-switch--disabled': disabled }">
    <span v-if="label" class="toggle-switch__label">{{ label }}</span>
    <div class="toggle-switch__wrapper">
      <span class="toggle-switch__text toggle-switch__text--off">{{ labelOff }}</span>
      <button
        type="button"
        role="switch"
        :aria-checked="modelValue"
        :disabled="disabled"
        class="toggle-switch__track"
        :class="[
          `toggle-switch__track--${size}`,
          { 'toggle-switch__track--on': modelValue }
        ]"
        @click="toggle"
      >
        <span class="toggle-switch__thumb" />
      </button>
      <span class="toggle-switch__text toggle-switch__text--on">{{ labelOn }}</span>
    </div>
  </label>
</template>

<style scoped lang="scss">
.toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  user-select: none;
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.toggle-switch__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

.toggle-switch__wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-switch__text {
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
  
  &--off {
    color: var(--text);
    opacity: 0.6;
    
    .toggle-switch__track--on ~ & {
      opacity: 0.4;
    }
  }
  
  &--on {
    color: var(--accent-500);
    opacity: 0.4;
    
    .toggle-switch__track--on ~ & {
      opacity: 1;
    }
  }
}

.toggle-switch__track {
  position: relative;
  background: var(--card);
  border: 2px solid rgb(var(--accent-500-rgb) / 30%);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
  
  &:focus-visible {
    outline: 2px solid var(--accent-500);
    outline-offset: 2px;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  /* Sizes */
  &--small {
    width: 2.5rem;
    height: 1.5rem;
    
    .toggle-switch__thumb {
      width: 1rem;
      height: 1rem;
    }
  }
  
  &--medium {
    width: 3rem;
    height: 1.75rem;
    
    .toggle-switch__thumb {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
  
  &--large {
    width: 3.5rem;
    height: 2rem;
    
    .toggle-switch__thumb {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  
  /* On state */
  &--on {
    background: var(--accent-500);
    border-color: var(--accent-500);
    
    .toggle-switch__thumb {
      transform: translateX(100%);
      background: white;
    }
  }
}

.toggle-switch__thumb {
  position: absolute;
  top: 50%;
  left: 0.125rem;
  background: rgb(var(--accent-500-rgb) / 40%);
  border-radius: 50%;
  transform: translateY(-50%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgb(0 0 0 / 15%);
}
</style>
