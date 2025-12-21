<script setup lang="ts">
/**
 * MaterialProperties - Display mechanical properties of selected material
 * Shows: Young's Modulus, Yield Strength, Tensile Strength, etc.
 * Based on Hooke's Law: stress = E × strain (where E is Young's Modulus)
 */
import type { MechanicalProperties } from './calculators/metal-weight/materials'

const props = defineProps<{
  material: string
  density: number
  mechanical?: MechanicalProperties
}>()

/* Format property value */
function formatValue(key: string, value: unknown): string {
  if (value === undefined || value === null) return '—'
  if (typeof value === 'string') return value
  if (typeof value === 'number') {
    if (key === 'poissonsRatio') return value.toFixed(2)
    if (key === 'youngsModulus' && value < 10) return value.toFixed(1)
    return value.toLocaleString()
  }
  return String(value)
}

/* Get behavior display */
const behaviorDisplay = computed(() => {
  if (!props.mechanical) return null
  const behaviors = {
    ductile: { label: 'Ductile', description: 'Can undergo significant plastic deformation' },
    brittle: { label: 'Brittle', description: 'Fractures with little plastic deformation' },
    plastic: { label: 'Highly Plastic', description: 'Very large plastic deformation range' }
  }
  return behaviors[props.mechanical.behavior]
})
</script>

<template>
  <div class="material-properties">
    <div class="properties-header">
      <span class="material-icons">science</span>
      <span class="header-title">Material Properties</span>
    </div>
    
    <!-- No mechanical data -->
    <div v-if="!mechanical" class="no-data">
      <span class="material-icons">info_outline</span>
      <span>Mechanical properties not available for {{ material }}</span>
    </div>
    
    <!-- Properties grid -->
    <div v-else class="properties-grid">
      <!-- Young's Modulus (highlighted) -->
      <div class="property-card highlight">
        <div class="property-icon">
          <span class="material-icons">straighten</span>
        </div>
        <div class="property-content">
          <span class="property-label">Young's Modulus (E)</span>
          <div class="property-value-row">
            <span class="property-value large">{{ formatValue('youngsModulus', mechanical.youngsModulus) }}</span>
            <span class="property-unit">GPa</span>
          </div>
          <span class="property-description">Modulus of Elasticity</span>
        </div>
      </div>
      
      <!-- Yield Strength -->
      <div class="property-card">
        <div class="property-icon">
          <span class="material-icons">compress</span>
        </div>
        <div class="property-content">
          <span class="property-label">Yield Strength (σᵧ)</span>
          <div class="property-value-row">
            <span class="property-value">{{ formatValue('yieldStrength', mechanical.yieldStrength) }}</span>
            <span class="property-unit">MPa</span>
          </div>
        </div>
      </div>
      
      <!-- Ultimate Tensile Strength -->
      <div class="property-card">
        <div class="property-icon">
          <span class="material-icons">fitness_center</span>
        </div>
        <div class="property-content">
          <span class="property-label">Tensile Strength (σᵤ)</span>
          <div class="property-value-row">
            <span class="property-value">{{ formatValue('tensileStrength', mechanical.tensileStrength) }}</span>
            <span class="property-unit">MPa</span>
          </div>
        </div>
      </div>
      
      <!-- Elongation -->
      <div class="property-card">
        <div class="property-icon">
          <span class="material-icons">expand</span>
        </div>
        <div class="property-content">
          <span class="property-label">Elongation</span>
          <div class="property-value-row">
            <span class="property-value">{{ formatValue('elongation', mechanical.elongation) }}</span>
            <span class="property-unit">%</span>
          </div>
        </div>
      </div>
      
      <!-- Poisson's Ratio -->
      <div class="property-card">
        <div class="property-icon">
          <span class="material-icons">aspect_ratio</span>
        </div>
        <div class="property-content">
          <span class="property-label">Poisson's Ratio (ν)</span>
          <div class="property-value-row">
            <span class="property-value">{{ formatValue('poissonsRatio', mechanical.poissonsRatio) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Hardness -->
      <div class="property-card">
        <div class="property-icon">
          <span class="material-icons">diamond</span>
        </div>
        <div class="property-content">
          <span class="property-label">Hardness</span>
          <div class="property-value-row">
            <span class="property-value">{{ formatValue('hardness', mechanical.hardness) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Material Behavior Badge -->
    <div v-if="behaviorDisplay" class="behavior-badge">
      <span class="behavior-label">{{ behaviorDisplay.label }}</span>
      <span class="behavior-description">{{ behaviorDisplay.description }}</span>
    </div>
    
    <!-- Hooke's Law Formula -->
    <div v-if="mechanical" class="hookes-law">
      <div class="formula-title">
        <span class="material-icons">functions</span>
        Hooke's Law
      </div>
      <div class="formula-content">
        <span class="formula">σ = E × ε</span>
        <span class="formula-explanation">Stress equals Young's Modulus times Strain (in elastic region)</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.material-properties {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.properties-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .material-icons {
    font-size: 1.1rem;
    color: var(--accent-500);
  }
  
  .header-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text);
  }
}

.no-data {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-radius: 0.75rem;
  color: var(--neutral);
  font-size: 0.85rem;
  
  .material-icons {
    font-size: 1.1rem;
  }
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.property-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-radius: 0.75rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  
  &.highlight {
    grid-column: span 2;
    background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 10%) 0%, rgb(var(--accent-500-rgb) / 5%) 100%);
    border-color: rgb(var(--accent-500-rgb) / 20%);
  }
}

.property-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.5rem;
  flex-shrink: 0;
  
  .material-icons {
    font-size: 1rem;
    color: var(--accent-500);
  }
}

.property-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.property-label {
  font-size: 0.7rem;
  color: var(--neutral);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.property-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.property-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  
  &.large {
    font-size: 1.5rem;
    color: var(--accent-500);
  }
}

.property-unit {
  font-size: 0.75rem;
  color: var(--neutral);
  font-weight: 500;
}

.property-description {
  font-size: 0.7rem;
  color: var(--neutral);
  opacity: 0.8;
}

.behavior-badge {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  border-left: 3px solid var(--accent-500);
}

.behavior-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-500);
}

.behavior-description {
  font-size: 0.75rem;
  color: var(--text);
  opacity: 0.8;
}

.hookes-law {
  padding: 0.75rem 1rem;
  background: rgb(var(--accent-500-rgb) / 8%);
  border-radius: 0.75rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
}

.formula-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent-500);
  margin-bottom: 0.5rem;
  
  .material-icons {
    font-size: 1rem;
  }
}

.formula-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.formula {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent-500);
}

.formula-explanation {
  font-size: 0.7rem;
  color: var(--text);
  opacity: 0.7;
}
</style>

