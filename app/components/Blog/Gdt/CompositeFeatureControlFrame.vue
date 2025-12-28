<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  upperSymbol: string
  upperTolerance: string
  upperModifier?: string
  upperDatums?: string
  lowerSymbol: string
  lowerTolerance: string
  lowerModifier?: string
  lowerDatums?: string
}

const props = defineProps<Props>()

/* Parse datums */
const upperDatumArray = computed(() => 
  props.upperDatums ? props.upperDatums.split('|') : []
)

const lowerDatumArray = computed(() => 
  props.lowerDatums ? props.lowerDatums.split('|') : []
)
</script>

<template>
  <div class="composite-fcf">
    <!-- Upper Segment -->
    <div class="fcf-row">
      <div class="fcf-section symbol-section">
        <GdtSymbol :type="upperSymbol" :size="30" />
      </div>
      
      <div class="fcf-section tolerance-section">
        <span class="diameter-symbol" v-if="upperSymbol === 'position'">⌀</span>
        <span class="tolerance-value">{{ upperTolerance }}</span>
        <span class="modifier" v-if="upperModifier">{{ upperModifier }}</span>
      </div>
      
      <div v-for="(datum, index) in upperDatumArray" :key="`upper-${index}`" class="fcf-section datum-section">
        <span class="datum-letter">{{ datum }}</span>
      </div>
    </div>
    
    <!-- Lower Segment -->
    <div class="fcf-row">
      <div class="fcf-section symbol-section">
        <GdtSymbol :type="lowerSymbol" :size="30" />
      </div>
      
      <div class="fcf-section tolerance-section">
        <span class="diameter-symbol" v-if="lowerSymbol === 'position'">⌀</span>
        <span class="tolerance-value">{{ lowerTolerance }}</span>
        <span class="modifier" v-if="lowerModifier">{{ lowerModifier }}</span>
      </div>
      
      <div v-for="(datum, index) in lowerDatumArray" :key="`lower-${index}`" class="fcf-section datum-section">
        <span class="datum-letter">{{ datum }}</span>
      </div>
      
      <!-- Empty cells to match upper row -->
      <div v-for="i in (upperDatumArray.length - lowerDatumArray.length)" :key="`empty-${i}`" class="fcf-section datum-section empty">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.composite-fcf {
  display: inline-block;
  border: 2px solid var(--text);
  background: var(--card);
  font-family: monospace;
  font-size: 1rem;
  font-weight: 600;
}

.fcf-row {
  display: flex;
  
  &:not(:last-child) {
    border-bottom: 2px solid var(--text);
  }
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
  
  &.empty {
    background: rgb(var(--text-rgb) / 5%);
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
