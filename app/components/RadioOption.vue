<script setup lang="ts">
interface Props {
  modelValue: string | number
  value: string | number
  title: string
  description?: string
  icon?: string
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isSelected = computed(() => props.modelValue === props.value)

const select = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}
</script>

<template>
  <div 
    class="radio-option" 
    :class="{ 
      'radio-option--selected': isSelected,
      'radio-option--disabled': disabled 
    }"
    @click="select"
  >
    <div v-if="icon" class="radio-option__icon">
      <span class="material-icons">{{ icon }}</span>
    </div>
    <div class="radio-option__content">
      <h4 class="radio-option__title">{{ title }}</h4>
      <p v-if="description" class="radio-option__description">{{ description }}</p>
    </div>
    <div class="radio-option__indicator">
      <div class="radio-option__circle">
        <div class="radio-option__dot" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.radio-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--card);
  border: 2px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(&--disabled) {
    border-color: rgb(var(--accent-500-rgb) / 30%);
  }
  
  &--selected {
    border-color: var(--accent-500);
    background: rgb(var(--accent-500-rgb) / 5%);
    
    .radio-option__dot {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.radio-option__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.5rem;
  flex-shrink: 0;
  
  .material-icons {
    font-size: 1.5rem;
    color: var(--accent-500);
  }
}

.radio-option__content {
  flex: 1;
  min-width: 0;
}

.radio-option__title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
}

.radio-option__description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text);
  opacity: 0.7;
  line-height: 1.4;
}

.radio-option__indicator {
  flex-shrink: 0;
}

.radio-option__circle {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  background: var(--card);
  border: 2px solid rgb(var(--accent-500-rgb) / 30%);
  border-radius: 50%;
  
  .radio-option--selected & {
    border-color: var(--accent-500);
  }
}

.radio-option__dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.5rem;
  height: 0.5rem;
  background: var(--accent-500);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: all 0.2s;
}
</style>
