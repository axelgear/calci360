<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { AppliedMoment } from '~/components/Calculator/calculators/bending-stress/types'

const props = defineProps<{
  id: string
  data: AppliedMoment & {
    selected?: boolean
    beamLength: number
    positionMeters: string
    onDelete?: () => void
    onPositionEdit?: (newPos: number) => void
  }
}>()

/* Format magnitude for display */
const displayMagnitude = computed(() => {
  const mag = props.data.magnitude
  if (mag >= 1000) {
    return `${(mag / 1000).toFixed(1)} kN·m`
  }
  return `${mag.toFixed(0)} N·m`
})

/* Direction icon and label */
const directionIcon = computed(() => 
  props.data.direction === 'clockwise' ? 'rotate_right' : 'rotate_left'
)

const directionLabel = computed(() =>
  props.data.direction === 'clockwise' ? 'CW' : 'CCW'
)

/* Handle delete click */
function handleDelete(event: MouseEvent) {
  event.stopPropagation()
  props.data.onDelete?.()
}
</script>

<template>
  <div class="moment-node" :class="{ selected: data.selected }">
    <!-- Delete button -->
    <button 
      v-if="data.selected" 
      class="delete-btn" 
      @click="handleDelete"
      title="Delete moment"
    >
      <span class="material-icons">close</span>
    </button>
    
    <!-- Label above icon -->
    <div class="load-label">
      <span class="load-magnitude">{{ displayMagnitude }}</span>
      <span class="load-position">@ {{ data.positionMeters }}m</span>
    </div>
    
    <!-- Moment visualization - rotating arrow -->
    <div class="moment-visual" :class="{ ccw: data.direction === 'counterclockwise' }">
      <span class="material-icons">{{ directionIcon }}</span>
    </div>
    
    <!-- Direction label -->
    <span class="direction-label">{{ directionLabel }}</span>
    
    <!-- Handle for connecting (hidden) -->
    <Handle type="target" :position="Position.Bottom" class="handle-hidden" />
  </div>
</template>

<style scoped lang="scss">
.moment-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.15s;
  transform: translateX(-50%);
  border-radius: 4px;
  pointer-events: all;

  &:hover {
    .moment-visual {
      transform: scale(1.1);
    }
  }

  &.selected {
    background: rgb(var(--accent-500-rgb) / 8%);
    
    .moment-visual {
      transform: scale(1.1);
    }
  }

  &:active {
    cursor: grabbing;
  }
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ef4444;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s;
  z-index: 10;

  .material-icons {
    font-size: 10px;
    color: white;
  }

  &:hover {
    background: #dc2626;
    transform: scale(1.15);
  }
}

.load-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.load-magnitude {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  color: #3b82f6;
}

.load-position {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  font-weight: 500;
  color: var(--neutral);
}

.moment-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  .material-icons {
    font-size: 36px;
    color: #3b82f6;
    animation: rotate-cw 3s linear infinite;
  }

  &.ccw .material-icons {
    animation: rotate-ccw 3s linear infinite;
  }
}

@keyframes rotate-cw {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate-ccw {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

.direction-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  font-weight: 600;
  color: #3b82f6;
}

.handle-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
