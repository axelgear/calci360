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
  <div class="junction-node" :class="{ selected: data.selected }">
    <!-- Input handle on left -->
    <Handle type="target" :position="Position.Left" class="handle-target" />
    
    <div class="node-icon">
      <span class="material-icons">call_split</span>
    </div>
    <div class="node-content">
      <div class="node-label">{{ data.label }}</div>
      <div v-if="data.cfm" class="node-cfm">{{ data.cfm }} CFM</div>
    </div>
    
    <!-- Output handles: straight-through (right) and branch (bottom) -->
    <Handle id="out-main" type="source" :position="Position.Right" class="handle-source" title="Main trunk" />
    <Handle id="out-branch" type="source" :position="Position.Bottom" class="handle-source handle-branch" title="Branch to diffuser" />
  </div>
</template>

<style scoped lang="scss">
.junction-node {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  padding-bottom: 1.25rem; /* Extra space for bottom handle */
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 20%) 0%, rgb(var(--accent-500-rgb) / 10%) 100%);
  border: 2px solid rgb(var(--accent-500-rgb) / 60%);
  border-radius: 0.5rem;
  min-width: 100px;
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
  width: 32px;
  height: 32px;
  background: rgb(var(--accent-500-rgb) / 30%);
  border-radius: 0.375rem;

  .material-icons {
    font-size: 20px;
    color: var(--accent-500);
  }
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.node-label {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--text);
}

.node-cfm {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--accent-500);
  font-weight: 600;
}

.handle-target, .handle-source {
  width: 12px;
  height: 12px;
  background: var(--accent-500);
  border: 2px solid white;
  border-radius: 50%;
  z-index: 10;
}

/* Branch handle at bottom - make it more visible */
.handle-branch {
  background: var(--accent-500);
  width: 14px;
  height: 14px;
}
</style>

