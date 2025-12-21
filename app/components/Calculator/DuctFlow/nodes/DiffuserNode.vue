<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  id: string
  data: {
    label: string
    cfm: number
    selected?: boolean
  }
}>()
</script>

<template>
  <div class="diffuser-node" :class="{ selected: data.selected }">
    <!-- Input handle on left -->
    <Handle type="target" :position="Position.Left" class="handle-target" />
    
    <div class="node-icon">
      <span class="material-icons">grid_4x4</span>
    </div>
    <div class="node-content">
      <div class="node-label">{{ data.label }}</div>
      <div class="node-cfm">{{ data.cfm }} CFM</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.diffuser-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: var(--card);
  border: 2px solid rgb(var(--accent-500-rgb) / 40%);
  border-radius: 50rem;
  min-width: 90px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  transition: all 0.2s;

  &:hover, &.selected {
    border-color: var(--accent-500);
    box-shadow: 0 0 0 3px rgb(var(--accent-500-rgb) / 30%), 0 4px 12px rgb(0 0 0 / 25%);
    transform: scale(1.02);
  }
}

.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgb(var(--accent-500-rgb) / 15%);
  border-radius: 50%;

  .material-icons {
    font-size: 16px;
    color: var(--accent-500);
  }
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.node-label {
  font-weight: 500;
  font-size: 0.75rem;
  color: var(--text);
}

.node-cfm {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--accent-500);
  font-weight: 700;
}

.handle-target {
  width: 10px;
  height: 10px;
  background: var(--accent-500);
  border: 2px solid white;
  border-radius: 50%;
}
</style>

