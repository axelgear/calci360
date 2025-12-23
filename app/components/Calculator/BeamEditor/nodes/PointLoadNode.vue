<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { PointLoad } from '~/components/Calculator/calculators/bending-stress/types'

const props = defineProps<{
  id: string
  data: PointLoad & {
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
    return `${(mag / 1000).toFixed(1)} kN`
  }
  return `${mag.toFixed(0)} N`
})

/* Direction icon */
const directionIcon = computed(() => 
  props.data.direction === 'down' ? 'south' : 'north'
)

/* Handle delete click */
function handleDelete(event: MouseEvent) {
  event.stopPropagation()
  props.data.onDelete?.()
}
</script>

<template>
  <div class="point-load-node" :class="{ selected: data.selected, up: data.direction === 'up' }">
    <!-- Delete button -->
    <button 
      v-if="data.selected" 
      class="delete-btn" 
      @click="handleDelete"
      title="Delete load"
    >
      <span class="material-icons">close</span>
    </button>
    
    <!-- Label above arrow -->
    <div class="load-label">
      <span class="load-magnitude">{{ displayMagnitude }}</span>
      <span class="load-position">@ {{ data.positionMeters }}m</span>
    </div>
    
    <!-- Arrow only -->
    <div class="load-arrow" :class="{ up: data.direction === 'up' }">
      <span class="material-icons">{{ directionIcon }}</span>
    </div>
    
    <!-- Handle for connecting (not used but Vue Flow expects it) -->
    <Handle type="target" :position="Position.Bottom" class="handle-hidden" />
  </div>
</template>

<style scoped lang="scss">
.point-load-node {
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
    .load-arrow {
      transform: scale(1.1);
    }
  }

  &.selected {
    background: rgb(var(--accent-500-rgb) / 8%);
    
    .load-arrow {
      transform: scale(1.1);
    }
  }

  &:active {
    cursor: grabbing;
  }

  &.up {
    flex-direction: column-reverse;
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
  color: #ef4444;
}

.load-position {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  font-weight: 500;
  color: var(--neutral);
}

.load-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  .material-icons {
    font-size: 32px;
    color: #ef4444;
  }

  &.up .material-icons {
    color: #22c55e;
  }
}

.handle-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
