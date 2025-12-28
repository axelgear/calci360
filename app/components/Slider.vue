<script setup lang="ts">
import { computed, ref } from 'vue'

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
  showValue: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [value: number]
}>()

const trackRef = ref<HTMLDivElement>()
const isDragging = ref(false)

/* Computed values */
const percentage = computed(() => {
  const range = props.max - props.min
  return ((props.modelValue - props.min) / range) * 100
})

const displayValue = computed(() => {
  return props.step % 1 === 0 
    ? Math.round(props.modelValue)
    : props.modelValue.toFixed(1)
})

/* Update value based on position */
const updateValue = (clientX: number) => {
  if (!trackRef.value || props.disabled) return

  const rect = trackRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const range = props.max - props.min
  let value = props.min + (range * percent)
  
  /* Snap to step */
  if (props.step > 0) {
    value = Math.round(value / props.step) * props.step
  }
  
  value = Math.max(props.min, Math.min(props.max, value))

  emit('update:modelValue', value)
}

/* Mouse events */
const handleMouseDown = (event: MouseEvent) => {
  if (props.disabled) return
  isDragging.value = true
  updateValue(event.clientX)
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.value) {
      updateValue(e.clientX)
    }
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    emit('change', props.modelValue)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  }
  
/* Touch events */
const handleTouchStart = (event: TouchEvent) => {
  if (props.disabled || !event.touches[0]) return
  const touch = event.touches[0]
  updateValue(touch.clientX)
}

const handleTouchMove = (event: TouchEvent) => {
  if (props.disabled || !event.touches[0]) return
  const touch = event.touches[0]
  updateValue(touch.clientX)
}

/* Keyboard events */
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.disabled) return
  
  let newValue = props.modelValue
  const step = props.step || 1
  
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      newValue -= step
      break
    case 'ArrowRight':
    case 'ArrowUp':
      newValue += step
      break
    case 'Home':
      newValue = props.min
      break
    case 'End':
      newValue = props.max
      break
    default:
      return
  }
  
  event.preventDefault()
  newValue = Math.max(props.min, Math.min(props.max, newValue))
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<template>
    <div 
      class="slider"
    :class="{ 'slider--disabled': disabled }"
  >
    <label v-if="label" class="slider-label">{{ label }}</label>
    <div class="slider-wrapper">
      <div 
        ref="trackRef"
        class="slider-track"
        @mousedown="handleMouseDown"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
      >
      <div 
          class="slider-fill" 
        :style="{ width: `${percentage}%` }"
      />
        <button
          type="button"
          class="slider-thumb"
        :style="{ left: `${percentage}%` }"
          :class="{ 'slider-thumb--dragging': isDragging }"
          tabindex="0"
          role="slider"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="modelValue"
          :aria-label="label"
          @keydown="handleKeyDown"
        />
      </div>
      <span v-if="showValue" class="slider-value">{{ displayValue }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Size variables */
$track-height: 4px;
$thumb-size: 16px;
$thumb-hover-size: 18px;
$thumb-active-size: 20px;

.slider {
  width: 100%;
  
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    .slider-track,
    .slider-thumb {
      cursor: not-allowed;
    }
  }
}

.slider-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.slider-track {
  position: relative;
  flex: 1;
  height: $track-height;
  background: rgba(var(--text-rgb), 0.15);
  border-radius: calc($track-height / 2);
  cursor: pointer;
  
  /* Add padding to make clicking easier */
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    bottom: -8px;
    left: 0;
    right: 0;
  }
}

.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--accent-500);
  border-radius: calc($track-height / 2);
  pointer-events: none;
  transition: width 0.1s ease-out;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  width: $thumb-size;
  height: $thumb-size;
  padding: 0;
  background: var(--accent-500);
  border: none;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.15s ease-out;
  
  /* Remove default button styles */
  -webkit-appearance: none;
  appearance: none;

  &:hover:not(:disabled) {
    width: $thumb-hover-size;
    height: $thumb-hover-size;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--accent-500-rgb), 0.3);
  }

  &--dragging,
  &:active:not(:disabled) {
    cursor: grabbing;
    width: $thumb-active-size;
    height: $thumb-active-size;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
}

.slider-value {
  min-width: 3ch;
  text-align: right;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

/* Touch device adjustments */
@media (hover: none) {
  .slider-thumb {
    width: $thumb-active-size;
    height: $thumb-active-size;
  }
  
  .slider-track {
    height: 6px;
  }
}

/* Dark mode adjustments */
.dark {
  .slider-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .slider-thumb {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    
    &:hover:not(:disabled) {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
    }
    
    &--dragging,
    &:active:not(:disabled) {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
    }
  }
}
</style>