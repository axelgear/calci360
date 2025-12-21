<script setup lang="ts">
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

defineProps<{
  formula: string
  explanation?: string
}>()
</script>

<template>
  <div class="formula-card">
    <div class="formula-header">
      <span class="material-icons">functions</span>
      <span>{{ t('Formula') }}</span>
    </div>
    <div class="formula-content">
      <span class="formula-math">{{ formula }}</span>
      <span v-if="explanation" class="formula-explain">{{ t(explanation) }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.formula-card {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 1rem;
  
  .formula-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    
    .material-icons {
      font-size: 1.1rem;
      color: var(--accent-500);
    }
    
    span {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text);
      opacity: 0.8;
    }
  }
  
  .formula-content {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    
    .formula-math {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--accent-500);
    }
    
    .formula-explain {
      font-size: 0.85rem;
      color: var(--neutral);
    }
  }
}
</style>

