<script setup lang="ts">
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

export interface ConversionItem {
  id: string
  name: string
  symbol: string
  value: number
  formatted: string
}

defineProps<{
  title: string
  conversions: ConversionItem[]
  selectedUnit: string
  copiedId: string | null
}>()

const emit = defineEmits<{
  (e: 'copy', id: string, value: number): void
}>()
</script>

<template>
  <div class="conversions-card">
    <div class="conversions-header">
      <h3>
        <span class="material-icons">swap_horiz</span>
        {{ t(title) }}
      </h3>
    </div>
    <div class="conversions-grid">
      <div
        v-for="conv in conversions"
        :key="conv.id"
        class="conversion-item"
        :class="{ active: conv.id === selectedUnit, copied: copiedId === conv.id }"
        @click="emit('copy', conv.id, conv.value)"
      >
        <div class="conv-info">
          <span class="conv-name">{{ t(conv.name) }}</span>
          <span class="conv-symbol">{{ conv.symbol }}</span>
        </div>
        <div class="conv-value">
          <span>{{ conv.formatted }}</span>
          <span class="material-icons copy-icon">{{ copiedId === conv.id ? 'check' : 'content_copy' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.conversions-card {
  background: var(--card);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
}

.conversions-header {
  margin-bottom: 1.25rem;
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text);
    
    .material-icons {
      font-size: 1.25rem;
      color: var(--accent-500);
    }
  }
}

.conversions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.conversion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  background: var(--input-bg);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--accent-500);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
    
    .copy-icon {
      opacity: 1;
    }
  }
  
  &.active {
    background: rgb(var(--accent-500-rgb) / 10%);
    border-color: var(--accent-500);
  }
  
  &.copied {
    .copy-icon {
      opacity: 1;
      color: var(--success, #22c55e);
    }
  }
  
  .conv-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    
    .conv-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text);
    }
    
    .conv-symbol {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--accent-500);
    }
  }
  
  .conv-value {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text);
    
    .copy-icon {
      font-size: 0.9rem;
      color: var(--accent-500);
      opacity: 0;
      transition: opacity 0.2s;
    }
  }
}
</style>

