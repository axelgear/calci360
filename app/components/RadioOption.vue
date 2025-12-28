<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: any
  value: any
  label?: string
  description?: string
  disabled?: boolean
  icon?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const isChecked = computed(() => props.modelValue === props.value)

const handleSelect = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}
</script>

<template>
  <label 
    class="radio-option" 
    :class="{ 
      'radio-option--checked': isChecked,
      'radio-option--disabled': disabled 
    }"
    @click="handleSelect"
  >
    <div class="radio-option-header">
      <span class="radio-control">
        <span class="radio-dot"></span>
      </span>
      
      <div class="radio-content">
        <div class="radio-main">
          <span v-if="icon" class="radio-icon material-icons">{{ icon }}</span>
          <span v-if="label" class="radio-label">{{ label }}</span>
          <slot v-else />
    </div>
        <p v-if="description || $slots.description" class="radio-description">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
    </div>
  </label>
</template>

<style scoped lang="scss">
.radio-option {
  display: block;
  padding: 1rem;
  background: var(--card);
  border: 2px solid rgba(var(--text-rgb), 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  
  &:hover:not(.radio-option--disabled) {
    border-color: rgba(var(--accent-500-rgb), 0.3);
    background: rgba(var(--accent-500-rgb), 0.02);
  }
  
  &--checked {
    border-color: var(--accent-500);
    background: rgba(var(--accent-500-rgb), 0.05);
  }
  
  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.radio-option-header {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.radio-control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(var(--text-rgb), 0.3);
  border-radius: 50%;
  background: var(--card);
  flex-shrink: 0;
  margin-top: 2px;
  transition: border-color 0.2s, background-color 0.2s;

  .radio-option:hover:not(.radio-option--disabled) & {
    border-color: rgba(var(--text-rgb), 0.4);
  }

  .radio-option--checked & {
    border-color: var(--accent-500);
    background: var(--accent-500);
  }
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  transform: scale(0);
  opacity: 0;
  transition: transform 0.15s ease-out, opacity 0.15s ease-out;

  .radio-option--checked & {
    transform: scale(1);
    opacity: 1;
  }
}

.radio-content {
  flex: 1;
  min-width: 0;
}

.radio-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-icon {
  font-size: 1.25rem;
  color: var(--accent-500);
}

.radio-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text);
  line-height: 1.5;
}

.radio-description {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: rgba(var(--text-rgb), 0.7);
  line-height: 1.5;
}
</style>
