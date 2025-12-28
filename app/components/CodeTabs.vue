<script setup lang="ts">
import { ref, provide } from 'vue'
import Tabs from './Tabs.vue'
import type { Tab } from './Tabs.vue'

interface CodeTab extends Tab {
  code?: string
}

interface Props {
  tabs: CodeTab[]
  defaultTab?: string
}

const props = defineProps<Props>()

const activeTab = ref(props.defaultTab || props.tabs[0]?.id)

// Provide code content for child components
provide('codeTabsContent', {
  getCode: (id: string) => props.tabs.find(tab => tab.id === id)?.code || ''
})
</script>

<template>
  <div class="code-tabs">
    <Tabs 
      :tabs="tabs" 
      v-model="activeTab"
      variant="underline"
      size="sm"
    >
      <slot />
    </Tabs>
  </div>
</template>

<style scoped lang="scss">
.code-tabs {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 1rem 0;
  
  :deep(.tabs) {
    background: var(--bg-dark);
    padding: 0 1rem;
    
    .tabs-list {
      border-bottom-color: var(--border);
      margin-bottom: 0;
    }
    
    .tab {
      color: var(--text-light);
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      
      &--active {
        color: var(--accent-500);
      }
    }
    
    .tabs-content {
      background: transparent;
      border: none;
      padding: 0;
    }
  }
}</style>