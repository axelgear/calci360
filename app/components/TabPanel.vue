<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue'
import { TabsContextKey } from '~/composables/useTabs'

interface Props {
  id: string
  lazy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  lazy: false
})

const tabsContext = inject(TabsContextKey)

const isActive = computed(() => {
  if (!tabsContext) {
    console.warn(`TabPanel ${props.id}: No tabs context found`)
    return true // Show all panels if no context (for debugging)
  }
  return tabsContext.activeTab.value === props.id
})
const hasBeenActive = ref(false)

// Track if this panel has ever been active (for lazy loading)
watchEffect(() => {
  if (isActive.value) {
    hasBeenActive.value = true
  }
})

// Determine if content should be rendered
const shouldRender = computed(() => {
  if (!props.lazy) return true
  return hasBeenActive.value
})
</script>

<template>
  <div
    v-if="isActive"
    :id="`panel-${id}`"
    class="tab-panel"
    :class="{ 'tab-panel--inactive': !isActive }"
    role="tabpanel"
    :aria-labelledby="`tab-${id}`"
    :aria-hidden="!isActive"
  >
    <!-- Debug info -->
    <div v-if="!tabsContext" style="background: red; color: white; padding: 10px;">
      TabPanel {{ id }}: No context found!
    </div>
    <div v-if="shouldRender" class="tab-panel-content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab-panel {
  width: 100%;
}

.tab-panel-content {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
