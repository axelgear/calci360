<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  showValue: true,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const sliderRef = ref<HTMLDivElement>()
const isDragging = ref(false)

const percentage = computed(() => {
  const range = props.max - props.min
  const value = props.modelValue - props.min
  return (value / range) * 100
})

const updateValue = (event: MouseEvent | TouchEvent) => {
  if (!sliderRef.value || props.disabled) return

  const rect = sliderRef.value.getBoundingClientRect()
  const clientX = 'touches' in event ? event.touches[0]?.clientX || 0 : event.clientX
  const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
  const percentage = x / rect.width
  const range = props.max - props.min
  const rawValue = props.min + percentage * range
  const steppedValue = Math.round(rawValue / props.step) * props.step
  const clampedValue = Math.max(props.min, Math.min(props.max, steppedValue))

  emit('update:modelValue', clampedValue)
}

const startDrag = (event: MouseEvent | TouchEvent) => {
  if (props.disabled) return
  isDragging.value = true
  updateValue(event)
  
  const moveHandler = (e: MouseEvent | TouchEvent) => {
    if (isDragging.value) {
      updateValue(e)
    }
  }
  
  const endHandler = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', moveHandler)
    document.removeEventListener('mouseup', endHandler)
    document.removeEventListener('touchmove', moveHandler)
    document.removeEventListener('touchend', endHandler)
  }
  
  document.addEventListener('mousemove', moveHandler)
  document.addEventListener('mouseup', endHandler)
  document.addEventListener('touchmove', moveHandler)
  document.addEventListener('touchend', endHandler)
}
</script>

<template>
  <div class="slider-wrapper" :class="{ 'slider-wrapper--disabled': disabled }">
    <div v-if="label || showValue" class="slider-header">
      <label v-if="label" class="slider-label">{{ label }}</label>
      <span v-if="showValue" class="slider-value">{{ modelValue }}</span>
    </div>
    <div 
      ref="sliderRef"
      class="slider"
      :class="{ 'slider--dragging': isDragging }"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <div class="slider__track" />
      <div 
        class="slider__fill" 
        :style="{ width: `${percentage}%` }"
      />
      <div 
        class="slider__thumb"
        :style="{ left: `${percentage}%` }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider-wrapper {
  width: 100%;
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    .slider {
      cursor: not-allowed;
    }
  }
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.slider-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

.slider-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent-500);
  background: var(--card);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
}

.slider {
  position: relative;
  height: 2rem;
  cursor: pointer;
  
  &--dragging {
    .slider__thumb {
      transform: translate(-50%, -50%) scale(1.2);
    }
  }
}

.slider__track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 0.375rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 999px;
  transform: translateY(-50%);
}

.slider__fill {
  position: absolute;
  top: 50%;
  left: 0;
  height: 0.375rem;
  background: var(--accent-500);
  border-radius: 999px;
  transform: translateY(-50%);
  transition: width 0.1s ease-out;
}

.slider__thumb {
  position: absolute;
  top: 50%;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border: 2px solid var(--accent-500);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease-out;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
}
</style>
