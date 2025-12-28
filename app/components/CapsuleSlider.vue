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
}

const props = defineProps<Props>()
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
  <div class="capsule-slider" :class="{ 'capsule-slider--disabled': disabled }">
    <div 
      class="capsule-slider__indicator"
      :style="{ 
        transform: `translateX(${selectedIndex * 100}%)`,
        width: `${100 / options.length}%`
      }"
    />
    <button
      v-for="(option, index) in options"
      :key="option.value"
      type="button"
      class="capsule-slider__option"
      :class="{ 'capsule-slider__option--active': modelValue === option.value }"
      :disabled="disabled"
      @click="selectOption(option.value)"
    >
      <span v-if="option.icon" class="material-icons">{{ option.icon }}</span>
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.capsule-slider {
  display: inline-flex;
  position: relative;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 999px;
  padding: 0.25rem;
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.capsule-slider__indicator {
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  left: 0.25rem;
  background: var(--accent-500);
  border-radius: 999px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}

.capsule-slider__option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: 999px;
  color: var(--text);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1;
  
  &:disabled {
    cursor: not-allowed;
  }
  
  &--active {
    color: white;
  }
  
  .material-icons {
    font-size: 1.1rem;
  }
}
</style>
