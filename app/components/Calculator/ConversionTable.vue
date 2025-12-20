<script setup lang="ts">
import type { ConversionResult } from './calculators/types'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = defineProps<{
  conversions: ConversionResult[]
  currentUnitId?: string
}>()

const emit = defineEmits<{
  selectUnit: [unitId: string]
}>()

const searchQuery = ref('')

const filteredConversions = computed(() => {
  if (!searchQuery.value.trim()) return props.conversions
  
  const query = searchQuery.value.toLowerCase()
  return props.conversions.filter(c => 
    c.unitName.toLowerCase().includes(query) ||
    c.symbol.toLowerCase().includes(query)
  )
})

function copyValue(value: string) {
  navigator.clipboard.writeText(value)
}
</script>

<template>
  <div class="conversion-table">
    <div class="table-header">
      <h3>
        <span class="material-icons">table_chart</span>
        {{ t('All Conversions') }}
      </h3>
      <div class="search-box">
        <span class="material-icons">search</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="t('Filter units...')"
        />
      </div>
    </div>
    
    <div class="table-content">
      <div 
        v-for="conv in filteredConversions" 
        :key="conv.unitId"
        class="conversion-row"
        :class="{ current: conv.unitId === currentUnitId }"
        @click="emit('selectUnit', conv.unitId)"
      >
        <div class="unit-info">
          <span class="unit-name">{{ t(conv.unitName) }}</span>
          <span class="unit-symbol">{{ conv.symbol }}</span>
        </div>
        <div class="value-container">
          <span class="value">{{ conv.formatted }}</span>
          <button 
            class="copy-btn" 
            @click.stop="copyValue(conv.value.toString())"
            :title="t('Copy value')"
          >
            <span class="material-icons">content_copy</span>
          </button>
        </div>
      </div>
      
      <div v-if="filteredConversions.length === 0" class="no-results">
        <span class="material-icons">search_off</span>
        <p>{{ t('No units found') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.conversion-table {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgb(var(--accent-500-rgb) / 10%);
  flex-wrap: wrap;
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent-500);
    
    .material-icons {
      font-size: 1.25rem;
    }
  }
  
  .search-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--main-bg);
    border: 1px solid rgb(var(--accent-500-rgb) / 15%);
    border-radius: 0.5rem;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus-within {
      border-color: var(--accent-500);
      box-shadow: 0 0 0 3px rgb(var(--accent-500-rgb) / 15%);
    }
    
    .material-icons {
      font-size: 1.1rem;
      color: var(--neutral);
    }
    
    input {
      border: none;
      background: transparent;
      color: var(--text);
      font-size: 0.9rem;
      outline: none;
      width: 120px;
      
      &::placeholder {
        color: var(--text);
        opacity: 0.5;
      }
    }
  }
}

.table-content {
  max-height: 400px;
  overflow-y: auto;
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--accent-500-rgb) / 40%) transparent;

  /* Webkit scrollbar */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(var(--accent-500-rgb) / 35%);
    border-radius: 999px;
    border: 2px solid var(--card);
    transition: background 0.2s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--accent-500-rgb) / 60%);
  }

  /* Corner piece when both scrollbars are visible */
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}

.conversion-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid rgb(var(--accent-500-rgb) / 5%);
  cursor: pointer;
  transition: all 0.15s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: var(--hover-overlay);
  }
  
  &.current {
    background: rgb(var(--accent-500-rgb) / 8%);
    
    .unit-name {
      color: var(--accent-500);
      font-weight: 600;
    }
  }
  
  .unit-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
    
    .unit-name {
      font-size: 0.95rem;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .unit-symbol {
      font-size: 0.8rem;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      color: var(--neutral);
    }
  }
  
  .value-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .value {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text);
    }
    
    .copy-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      color: var(--neutral);
      border-radius: 0.25rem;
      cursor: pointer;
      opacity: 0;
      transition: all 0.15s;
      
      .material-icons {
        font-size: 1rem;
      }
      
      &:hover {
        background: var(--hover-overlay);
        color: var(--accent-500);
      }
    }
  }
  
  &:hover .copy-btn {
    opacity: 1;
  }
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--neutral);
  
  .material-icons {
    font-size: 2rem;
    opacity: 0.5;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
}
</style>
