<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { BeamSupport, SupportType } from '~/components/Calculator/calculators/bending-stress/types'

const props = defineProps<{
  id: string
  data: BeamSupport & {
    selected?: boolean
    beamLength: number
    positionMeters: string
    onDelete?: () => void
    onPositionEdit?: (newPos: number) => void
  }
}>()

/* Support type configuration */
const supportConfig: Record<SupportType, { label: string; color: string }> = {
  fixed: { label: 'FIXED', color: '#8b5cf6' },
  pinned: { label: 'PINNED', color: '#22c55e' },
  roller: { label: 'ROLLER', color: '#f59e0b' },
  free: { label: 'FREE', color: '#6b7280' },
}

const config = computed(() => supportConfig[props.data.type] ?? supportConfig.pinned)
</script>

<template>
  <div 
    class="support-node" 
    :class="[`support-${data.type}`]"
    :style="{ '--support-color': config.color }"
  >
    <!-- Support visualization (centered under node position) -->
    <div class="support-visual">
      <!-- Fixed support: filled block with hatching -->
      <template v-if="data.type === 'fixed'">
        <div class="fixed-support">
          <div class="fixed-block"></div>
          <div class="fixed-hatching"></div>
        </div>
      </template>
      
      <!-- Pinned support: triangle -->
      <template v-else-if="data.type === 'pinned'">
        <div class="pinned-support">
          <div class="triangle"></div>
          <div class="base-line"></div>
        </div>
      </template>
      
      <!-- Roller support: triangle with circles -->
      <template v-else-if="data.type === 'roller'">
        <div class="roller-support">
          <div class="triangle"></div>
          <div class="rollers">
            <div class="roller-circle"></div>
            <div class="roller-circle"></div>
          </div>
          <div class="base-line"></div>
        </div>
      </template>
      
      <!-- Free end -->
      <template v-else>
        <div class="free-support">
          <span class="material-icons">radio_button_checked</span>
        </div>
      </template>
    </div>
    
    <!-- Support info (clean, no background) -->
    <div class="support-info">
      <span class="support-label" :style="{ color: config.color }">{{ config.label }}</span>
      <span class="support-position">{{ data.positionMeters }}m</span>
    </div>
    
    <!-- Handle for connecting (hidden) -->
    <Handle type="source" :position="Position.Top" class="handle-hidden" />
  </div>
</template>

<style scoped lang="scss">
.support-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  cursor: default;
  transform: translateX(-50%); /* Center the node on its position */
}

.support-visual {
  width: 44px;
  height: 36px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* Fixed Support */
.fixed-support {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fixed-block {
  width: 10px;
  height: 20px;
  background: #8b5cf6;
  border-radius: 2px 2px 0 0;
}

.fixed-hatching {
  width: 30px;
  height: 10px;
  background: repeating-linear-gradient(
    -45deg,
    #8b5cf6,
    #8b5cf6 2px,
    transparent 2px,
    transparent 4px
  );
}

/* Pinned Support */
.pinned-support {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-bottom: 20px solid #22c55e;
}

.base-line {
  width: 36px;
  height: 4px;
  background: var(--neutral);
  margin-top: 2px;
}

/* Roller Support */
.roller-support {
  display: flex;
  flex-direction: column;
  align-items: center;

  .triangle {
    border-bottom-color: #f59e0b;
  }
}

.rollers {
  display: flex;
  gap: 8px;
  margin-top: 2px;
}

.roller-circle {
  width: 8px;
  height: 8px;
  background: #f59e0b;
  border-radius: 50%;
}

/* Free end */
.free-support {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .material-icons {
    font-size: 28px;
    color: #6b7280;
  }
}

/* Support Info - clean design, no background */
.support-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.support-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.support-position {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  font-weight: 500;
  color: var(--neutral);
}

.handle-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
