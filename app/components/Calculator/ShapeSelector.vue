<script setup lang="ts">
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

interface ShapeOption {
  id: string
  name: string
  icon: string
}

defineProps<{
  shapes: ShapeOption[]
  label?: string
}>()

const selectedId = defineModel<string>({ required: true })
</script>

<template>
  <div class="shape-selector">
    <label v-if="label" class="section-label">{{ t(label) }}</label>
    <div class="shape-grid">
      <button
        v-for="shape in shapes"
        :key="shape.id"
        class="shape-btn"
        :class="{ active: shape.id === selectedId }"
        @click="selectedId = shape.id"
        :title="t(shape.name)"
      >
        <span class="material-icons">{{ shape.icon }}</span>
        <span class="shape-name">{{ t(shape.name) }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/styles/mixins" as *;


.section-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.75rem;
  opacity: 0.8;
}

.shape-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.5rem;
  
  @include phone {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}

.shape-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.75rem 0.5rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border: 2px solid transparent;
  border-radius: 0.75rem;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  
  .material-icons {
    font-size: 1.5rem;
    color: var(--neutral);
    transition: color 0.2s;
  }
  
  .shape-name {
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    opacity: 0.8;
  }
  
  &:hover {
    background: rgb(var(--accent-500-rgb) / 12%);
    border-color: rgb(var(--accent-500-rgb) / 30%);
    
    .material-icons {
      color: var(--accent-500);
    }
  }
  
  &.active {
    background: rgb(var(--accent-500-rgb) / 18%);
    border-color: var(--accent-500);
    
    .material-icons {
      color: var(--accent-500);
    }
    
    .shape-name {
      color: var(--accent-500);
      font-weight: 600;
      opacity: 1;
    }
  }
}
</style>

