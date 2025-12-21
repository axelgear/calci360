<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  id: string
  data: {
    label: string
    cfm?: number
    selected?: boolean
  }
}>()
</script>

<template>
  <div class="ahu-node" :class="{ selected: data.selected }">
    <div class="node-icon">
      <span class="material-icons">hvac</span>
    </div>
    <div class="node-content">
      <div class="node-label">{{ data.label }}</div>
      <div v-if="data.cfm" class="node-cfm">{{ data.cfm }} CFM</div>
    </div>
    <!-- Output handle on right -->
    <Handle type="source" :position="Position.Right" class="handle-source" />
  </div>
</template>

<style scoped lang="scss">
.ahu-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 25%) 0%, rgb(var(--accent-500-rgb) / 15%) 100%);
  border: 2px solid var(--accent-500);
  border-radius: 0.5rem;
  min-width: 120px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
  transition: all 0.2s;

  &:hover, &.selected {
    border-color: var(--accent-500);
    box-shadow: 0 0 0 3px rgb(var(--accent-500-rgb) / 30%), 0 4px 12px rgb(0 0 0 / 30%);
    transform: scale(1.02);
  }
}

.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--accent-500);
  border-radius: 0.375rem;

  .material-icons {
    font-size: 22px;
    color: white;
  }
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.node-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text);
}

.node-cfm {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent-500);
  font-weight: 600;
}

.handle-source {
  width: 12px;
  height: 12px;
  background: var(--accent-500);
  border: 2px solid white;
  border-radius: 50%;
}
</style>

