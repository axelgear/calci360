<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { getComponent } from '../components'

const props = defineProps<{
  id: string
  data: {
    label: string
    componentId: string
    cfm?: number
    selected?: boolean
  }
}>()

const component = computed(() => getComponent(props.data.componentId))

/* Determine node style based on type */
const nodeClass = computed(() => {
  const type = component.value?.nodeType ?? 'fitting'
  return `hvac-node node-${type}`
})

/* Show input handle (not for sources) */
const showInput = computed(() => component.value?.nodeType !== 'source')

/* Show output handle (not for terminals) */
const showOutput = computed(() => component.value?.nodeType !== 'terminal')

/* Show multiple outputs for junctions */
const isJunction = computed(() => component.value?.nodeType === 'junction')
</script>

<template>
  <div :class="[nodeClass, { selected: data.selected }]">
    <!-- Input handle -->
    <Handle v-if="showInput" type="target" :position="Position.Left" class="handle-target" />
    
    <div class="node-icon">
      <span class="material-icons">{{ component?.icon ?? 'circle' }}</span>
    </div>
    <div class="node-content">
      <div class="node-label">{{ data.label }}</div>
      <div v-if="data.cfm" class="node-cfm">{{ data.cfm }} CFM</div>
      <div v-else class="node-type">{{ component?.name }}</div>
    </div>
    
    <!-- Output handles -->
    <template v-if="showOutput">
      <!-- Junctions have main (right) and branch (bottom) outputs -->
      <Handle v-if="isJunction" id="out-main" type="source" :position="Position.Right" class="handle-source" title="Main trunk" />
      <Handle v-if="isJunction" id="out-branch" type="source" :position="Position.Bottom" class="handle-source" title="Branch" />
      <!-- Other nodes have single output -->
      <Handle v-if="!isJunction" type="source" :position="Position.Right" class="handle-source" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.hvac-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--card);
  border: 2px solid rgb(var(--accent-500-rgb) / 40%);
  border-radius: 0.5rem;
  min-width: 80px;
  max-width: 140px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  transition: all 0.2s;
  font-size: 0.75rem;

  &:hover, &.selected {
    border-color: var(--accent-500);
    box-shadow: 0 0 0 2px rgb(var(--accent-500-rgb) / 25%), 0 4px 12px rgb(0 0 0 / 20%);
    transform: scale(1.02);
  }

  /* Source nodes (AHU, RTU) */
  &.node-source {
    background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 25%) 0%, rgb(var(--accent-500-rgb) / 15%) 100%);
    border-color: var(--accent-500);
    border-radius: 0.5rem;
    
    .node-icon {
      background: var(--accent-500);
      .material-icons { color: white; }
    }
  }

  /* Junction nodes (Tee, Wye, Plenum) */
  &.node-junction {
    border-radius: 0.375rem;
    background: rgb(var(--accent-500-rgb) / 10%);
    padding-bottom: 1.25rem; /* Extra space for bottom handle */
    
    .node-icon {
      background: rgb(var(--accent-500-rgb) / 25%);
    }
  }

  /* Terminal nodes (Diffusers, Grilles) */
  &.node-terminal {
    border-radius: 50rem;
    padding: 0.5rem 0.875rem;
    
    .node-icon {
      background: rgb(var(--accent-500-rgb) / 15%);
      border-radius: 50%;
    }
  }

  /* Fitting nodes (Elbows, Reducers) */
  &.node-fitting {
    border-style: dashed;
    background: rgb(var(--accent-500-rgb) / 5%);
    
    .node-icon {
      background: transparent;
    }
  }

  /* Accessory nodes */
  &.node-accessory {
    border-color: rgb(var(--accent-500-rgb) / 30%);
    opacity: 0.85;
    
    .node-icon {
      background: transparent;
      opacity: 0.7;
    }
  }
}

.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgb(var(--accent-500-rgb) / 20%);
  border-radius: 0.25rem;
  flex-shrink: 0;

  .material-icons {
    font-size: 16px;
    color: var(--accent-500);
  }
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  overflow: hidden;
  min-width: 0;
}

.node-label {
  font-weight: 600;
  font-size: 0.7rem;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-cfm {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--accent-500);
  font-weight: 700;
}

.node-type {
  font-size: 0.6rem;
  color: var(--neutral);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.handle-target, .handle-source {
  width: 12px;
  height: 12px;
  background: var(--accent-500);
  border: 2px solid white;
  border-radius: 50%;
  z-index: 10;
}
</style>

