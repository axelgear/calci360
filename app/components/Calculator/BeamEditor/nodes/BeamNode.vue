<script setup lang="ts">
/**
 * BeamNode - The beam visualization as a Vue Flow node
 * This allows it to zoom/pan together with loads and supports
 */
const props = defineProps<{
  id: string
  data: {
    beamLength: number
    beamWidth: number
  }
}>()

/* Tick marks for dimension labels */
const tickCount = 5
const ticks = computed(() => {
  const result = []
  for (let i = 0; i <= tickCount; i++) {
    const ratio = i / tickCount
    const meters = (ratio * props.data.beamLength).toFixed(1)
    const xPos = ratio * props.data.beamWidth
    result.push({ ratio, meters, xPos })
  }
  return result
})
</script>

<template>
  <div class="beam-node" :style="{ width: `${data.beamWidth}px` }">
    <!-- Main beam bar -->
    <div class="beam-bar"></div>
    
    <!-- Dimension ticks and labels -->
    <div class="dimension-line">
      <div 
        v-for="tick in ticks" 
        :key="tick.ratio"
        class="tick-mark"
        :style="{ left: `${tick.xPos}px` }"
      >
        <div class="tick"></div>
        <span class="tick-label">{{ tick.meters }}m</span>
      </div>
    </div>
    
    <!-- Total length label -->
    <div class="total-length">
      L = {{ data.beamLength.toFixed(2) }} m
    </div>
  </div>
</template>

<style scoped lang="scss">
.beam-node {
  position: relative;
  display: flex;
  flex-direction: column;
  pointer-events: none; /* Allow clicking through to loads/supports */
}

.beam-bar {
  height: 20px;
  background: linear-gradient(
    180deg,
    rgb(var(--accent-500-rgb) / 35%) 0%,
    rgb(var(--accent-500-rgb) / 20%) 50%,
    rgb(var(--accent-500-rgb) / 35%) 100%
  );
  border: 2px solid var(--accent-500);
  border-radius: 3px;
  box-shadow: 
    inset 0 2px 4px rgb(255 255 255 / 15%),
    0 2px 8px rgb(0 0 0 / 20%);
}

.dimension-line {
  position: relative;
  height: 30px;
  margin-top: 8px;
  border-top: 1px dashed rgb(var(--accent-500-rgb) / 40%);
}

.tick-mark {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tick {
  width: 1px;
  height: 8px;
  background: var(--neutral);
}

.tick-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  color: var(--neutral);
  margin-top: 2px;
  white-space: nowrap;
}

.total-length {
  text-align: center;
  margin-top: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  color: var(--accent-500);
}
</style>

