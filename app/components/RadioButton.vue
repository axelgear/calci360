<script setup lang="ts">
interface Props {
  modelValue: string | number | boolean
  value: string | number | boolean
  label?: string
  disabled?: boolean
  name?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
}>()

const isChecked = computed(() => props.modelValue === props.value)

const handleChange = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}
</script>

<template>
  <label class="radio-button" :class="{ 'radio-button--disabled': disabled }">
    <div class="radio-button__input-wrapper">
      <input
        type="radio"
        :name="name"
        :value="value"
        :checked="isChecked"
        :disabled="disabled"
        @change="handleChange"
        class="radio-button__input"
      />
      <div class="radio-button__custom" :class="{ 'radio-button__custom--checked': isChecked }">
        <div class="radio-button__dot" />
      </div>
    </div>
    <span v-if="label" class="radio-button__label">{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
.radio-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.radio-button__input-wrapper {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
}

.radio-button__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-button__custom {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--card);
  border: 2px solid rgb(var(--accent-500-rgb) / 30%);
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--accent-500);
  }
  
  &--checked {
    border-color: var(--accent-500);
    
    .radio-button__dot {
      transform: scale(1);
      opacity: 1;
    }
  }
}

.radio-button__dot {
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

.radio-button__label {
  color: var(--text);
  font-size: 0.9rem;
}
</style>
