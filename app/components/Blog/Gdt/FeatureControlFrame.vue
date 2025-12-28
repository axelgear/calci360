<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  symbol: string
  tolerance: string
  modifier?: string
  datums?: string
  materialModifier?: string
}

const props = defineProps<Props>()

/* Parse datums string (e.g., "A|B|C") */
const datumArray = computed(() => 
  props.datums ? props.datums.split('|') : []
)
</script>

<template>
  <div class="feature-control-frame">
    <div class="fcf-section symbol-section">
      <GdtSymbol :type="symbol" :size="30" />
    </div>
    
    <div class="fcf-section tolerance-section">
      <span class="diameter-symbol" v-if="symbol === 'position' || symbol === 'concentricity'">⌀</span>
      <span class="tolerance-value">{{ tolerance }}</span>
      <span class="modifier" v-if="modifier">{{ modifier }}</span>
    </div>
    
    <div v-for="(datum, index) in datumArray" :key="index" class="fcf-section datum-section">
      <span class="datum-letter">{{ datum }}</span>
      <span class="modifier" v-if="materialModifier && index === 0">{{ materialModifier }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.feature-control-frame {
  display: inline-flex;
  border: 2px solid var(--text);
  background: var(--card);
  font-family: monospace;
  font-size: 1rem;
  font-weight: 600;
}

.fcf-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  height: 50px;
  padding: 0 0.75rem;
  border-right: 2px solid var(--text);
  
  &:last-child {
    border-right: none;
  }
}

.symbol-section {
  padding: 0.5rem;
}

.tolerance-section {
  gap: 0.25rem;
}

.diameter-symbol {
  font-size: 1.2rem;
}

.tolerance-value {
  font-size: 1.1rem;
}

.datum-section {
  gap: 0.35rem;
}

.datum-letter {
  font-size: 1.1rem;
}

.modifier {
  font-size: 1.3rem;
  font-weight: 700;
}
</style>
