<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { UniformDistributedLoad, TriangularLoad } from '~/components/Calculator/calculators/bending-stress/types'

type UdlData = (UniformDistributedLoad | TriangularLoad) & {
  selected?: boolean
  beamLength: number
  positionMeters: string
  onDelete?: () => void
  onPositionEdit?: (newPos: number) => void
}

const props = defineProps<{
  id: string
  data: UdlData
  isTriangular?: boolean
}>()

/* Format magnitude for display */
const displayMagnitude = computed(() => {
  /* Handle both UDL (magnitude) and Triangular (magnitudeEnd) */
  const mag = props.isTriangular 
    ? (props.data as TriangularLoad).magnitudeEnd 
    : (props.data as UniformDistributedLoad).magnitude
  if (mag >= 1000) {
    return `${(mag / 1000).toFixed(1)} kN/m`
  }
  return `${mag.toFixed(0)} N/m`
})

/* Calculate load span positions in meters */
const startMeters = computed(() => {
  const start = props.data.startPosition ?? props.data.position
  return (start * props.data.beamLength).toFixed(2)
})

const endMeters = computed(() => {
  const end = props.data.endPosition ?? (props.data.position + 0.2)
  return (end * props.data.beamLength).toFixed(2)
})

/* Calculate span length */
const spanLengthMeters = computed(() => {
  const start = props.data.startPosition ?? props.data.position
  const end = props.data.endPosition ?? (props.data.position + 0.2)
  return ((end - start) * props.data.beamLength).toFixed(2)
})

/* Calculate width based on span */
const spanWidth = computed(() => {
  const start = props.data.startPosition ?? props.data.position
  const end = props.data.endPosition ?? (props.data.position + 0.2)
  const span = end - start
  return Math.max(80, span * 300) /* Scale to pixels, min 80px */
})

/* Color based on type */
const loadColor = computed(() => props.isTriangular ? '#a855f7' : '#f59e0b')

/* Handle delete click */
function handleDelete(event: MouseEvent) {
  event.stopPropagation()
  props.data.onDelete?.()
}
</script>

<template>
  <div class="udl-node" :class="{ selected: data.selected, triangular: isTriangular }">
    <!-- Delete button -->
    <button 
      v-if="data.selected" 
      class="delete-btn" 
      @click="handleDelete"
      title="Delete load"
    >
      <span class="material-icons">close</span>
    </button>
    
    <!-- Label above arrows -->
    <div class="load-label">
      <span class="load-magnitude" :style="{ color: loadColor }">{{ displayMagnitude }}</span>
      <div class="load-span-info">
        <span class="span-from">{{ startMeters }}m</span>
        <span class="span-arrow">→</span>
        <span class="span-to">{{ endMeters }}m</span>
      </div>
      <span class="span-length">({{ spanLengthMeters }}m)</span>
    </div>
    
    <!-- Arrow visualization showing distributed load -->
    <div class="load-arrows" :style="{ width: spanWidth + 'px' }">
      <template v-if="isTriangular">
        <!-- Triangular: varying arrow sizes -->
        <span class="material-icons arrow arrow-sm" :style="{ color: loadColor }">south</span>
        <span class="material-icons arrow arrow-md" :style="{ color: loadColor }">south</span>
        <span class="material-icons arrow arrow-lg" :style="{ color: loadColor }">south</span>
        <span class="material-icons arrow arrow-xl" :style="{ color: loadColor }">south</span>
      </template>
      <template v-else>
        <!-- UDL: uniform arrows -->
        <span class="material-icons arrow" :style="{ color: loadColor }">south</span>
        <span class="material-icons arrow" :style="{ color: loadColor }">south</span>
        <span class="material-icons arrow" :style="{ color: loadColor }">south</span>
        <span class="material-icons arrow" :style="{ color: loadColor }">south</span>
      </template>
    </div>
    
    <!-- Span line showing extent of load -->
    <div class="span-line" :style="{ width: spanWidth + 'px', backgroundColor: loadColor }"></div>
    
    <!-- Handle for connecting (hidden) -->
    <Handle type="target" :position="Position.Bottom" class="handle-hidden" />
  </div>
</template>

<style scoped lang="scss">
.udl-node {
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
    .load-arrows {
      transform: scale(1.05);
    }
  }

  &.selected {
    background: rgb(var(--accent-500-rgb) / 8%);
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
}

.load-span-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  font-weight: 600;
  color: var(--text);
}

.span-from, .span-to {
  color: var(--text);
}

.span-arrow {
  color: var(--neutral);
}

.span-length {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  font-weight: 500;
  color: var(--neutral);
}

.load-arrows {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  min-width: 80px;
  transition: all 0.15s;

  .arrow {
    font-size: 20px;
  }

  /* Triangular load - varying sizes */
  .arrow-sm { font-size: 12px; }
  .arrow-md { font-size: 16px; }
  .arrow-lg { font-size: 20px; }
  .arrow-xl { font-size: 24px; }
}

.span-line {
  height: 3px;
  border-radius: 2px;
  min-width: 80px;
}

.handle-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
