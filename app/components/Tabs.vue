<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { TabsContextKey } from '~/composables/useTabs'

export interface Tab {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  badge?: string | number
}

interface Props {
  tabs: Tab[]
  modelValue?: string
  variant?: 'default' | 'pills' | 'underline' | 'boxed'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  fullWidth: false,
  vertical: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

// Active tab management
const localActiveTab = ref(props.modelValue || props.tabs[0]?.id || '')
const activeTab = computed({
  get: () => props.modelValue ?? localActiveTab.value,
  set: (value: string) => {
    localActiveTab.value = value
    emit('update:modelValue', value)
    emit('change', value)
  }
})

// Provide active tab context for child components
provide(TabsContextKey, {
  activeTab,
  setActiveTab: (id: string) => {
    activeTab.value = id
  }
})

// Tab selection
const selectTab = (tab: Tab) => {
  if (!tab.disabled) {
    activeTab.value = tab.id
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent, currentIndex: number) => {
  if (currentIndex < 0 || currentIndex >= props.tabs.length) return
  
  const enabledTabs = props.tabs.filter(tab => !tab.disabled)
  const currentTab = props.tabs[currentIndex]
  if (!currentTab) return
  
  const currentEnabledIndex = enabledTabs.findIndex(tab => tab.id === currentTab.id)
  
  let nextIndex = -1
  
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      nextIndex = currentEnabledIndex - 1
      if (nextIndex < 0) nextIndex = enabledTabs.length - 1
      break
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      nextIndex = currentEnabledIndex + 1
      if (nextIndex >= enabledTabs.length) nextIndex = 0
      break
    case 'Home':
      event.preventDefault()
      nextIndex = 0
      break
    case 'End':
      event.preventDefault()
      nextIndex = enabledTabs.length - 1
      break
  }
  
  if (nextIndex !== -1) {
    const nextTab = enabledTabs[nextIndex]
    if (nextTab) {
      activeTab.value = nextTab.id
    }
  }
}
</script>

<template>
  <div
    class="tabs"
    :class="[
      `tabs--${variant}`,
      `tabs--${size}`,
      {
        'tabs--full-width': fullWidth,
        'tabs--vertical': vertical
      }
    ]"
  >
    <div class="tabs-list" role="tablist" :aria-orientation="vertical ? 'vertical' : 'horizontal'">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :id="`tab-${tab.id}`"
        class="tab"
        :class="{
          'tab--active': activeTab === tab.id,
          'tab--disabled': tab.disabled
        }"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`panel-${tab.id}`"
        :aria-disabled="tab.disabled"
        :tabindex="activeTab === tab.id ? 0 : -1"
        @click="selectTab(tab)"
        @keydown="handleKeydown($event, index)"
      >
        <span v-if="tab.icon" class="tab-icon material-icons">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
      <div v-if="variant === 'underline'" class="tabs-indicator" :style="{ transform: `translateX(${tabs.findIndex((t: Tab) => t.id === activeTab) * 100}%)` }"></div>
    </div>
    
    <div class="tabs-content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  
  &--vertical {
    flex-direction: row;
    
    .tabs-list {
      flex-direction: column;
      border-bottom: none;
      border-right: 1px solid rgba(var(--text-rgb), 0.1);
      padding-right: 1rem;
      margin-right: 1rem;
    }
    
    .tabs-indicator {
      display: none;
    }
  }
}

.tabs-list {
  display: flex;
  position: relative;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(var(--text-rgb), 0.1);
  margin-bottom: 1.5rem;
  
  .tabs--full-width & {
    .tab {
      flex: 1;
    }
  }
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover:not(.tab--disabled) {
    color: var(--accent-500);
    background: rgba(var(--accent-500-rgb), 0.05);
  }
  
  &:focus-visible {
    outline: 2px solid var(--accent-500);
    outline-offset: -2px;
    border-radius: 0.25rem;
  }
  
  &--active {
    color: var(--accent-500);
    
    .tabs--underline & {
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--accent-500);
      }
    }
  }
  
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  // Size variants
  .tabs--sm & {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .tabs--lg & {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
}

// Variant styles
.tabs--pills {
  .tabs-list {
    gap: 0.75rem;
    border-bottom: none;
    background: rgba(var(--text-rgb), 0.05);
    padding: 0.25rem;
    border-radius: 0.5rem;
  }
  
  .tab {
    border-radius: 0.375rem;
    
    &--active {
      background: var(--card);
      box-shadow: var(--shadow-sm);
    }
  }
}

.tabs--boxed {
  .tabs-list {
    border-bottom: none;
  }
  
  .tab {
    border: 1px solid transparent;
    border-bottom: none;
    border-radius: 0.375rem 0.375rem 0 0;
    margin-bottom: -1px;
    
    &--active {
      background: var(--card);
      border-color: rgba(var(--text-rgb), 0.1);
      border-bottom-color: var(--card);
    }
  }
  
  .tabs-content {
    background: var(--card);
    border: 1px solid rgba(var(--text-rgb), 0.1);
    border-radius: 0.5rem;
    padding: 1.5rem;
  }
}

.tabs--underline {
  .tabs-list {
    gap: 0;
    overflow: hidden;
  }
  
  .tabs-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: calc(100% / var(--tabs-count, 1));
    background: var(--accent-500);
    transition: transform 0.3s;
  }
}

.tab-icon {
  font-size: 1.25rem;
  
  .tabs--sm & {
    font-size: 1rem;
  }
  
  .tabs--lg & {
    font-size: 1.5rem;
  }
}

.tab-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background: var(--accent-500);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
  margin-left: 0.25rem;
  
  .tabs--sm & {
    min-width: 1rem;
    height: 1rem;
    font-size: 0.625rem;
  }
  
  .tabs--lg & {
    min-width: 1.5rem;
    height: 1.5rem;
    font-size: 0.875rem;
  }
}

.tabs-content {
  flex: 1;
}
</style>
