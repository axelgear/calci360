<script setup lang="ts">
import { ref } from 'vue'

// GD&T Symbols data
const symbols = [
  { icon: '⊥', name: 'Perpendicularity', description: 'Controls how perpendicular a surface or axis is to a datum' },
  { icon: '∥', name: 'Parallelism', description: 'Controls how parallel a surface or axis is to a datum' },
  { icon: '⊕', name: 'Position', description: 'Controls location of a feature relative to datums' },
  { icon: '◎', name: 'Concentricity', description: 'Controls how well centered a feature is to a datum axis' },
  { icon: '⌒', name: 'Profile of Surface', description: 'Controls the form of a surface' },
  { icon: '⌓', name: 'Circular Runout', description: 'Controls variation of a surface during rotation' },
]

const selectedSymbol = ref(symbols[2] || symbols[0]) // Default to Position or first available

// Modifiers
const modifiers = [
  { symbol: 'M', name: 'Maximum Material Condition', description: 'Tolerance applies at MMC' },
  { symbol: 'L', name: 'Least Material Condition', description: 'Tolerance applies at LMC' },
  { symbol: 'S', name: 'Regardless of Feature Size', description: 'Tolerance applies regardless of size' },
]

const toleranceValue = ref('0.25')
const primaryDatum = ref('A')
const secondaryDatum = ref('B')
const tertiaryDatum = ref('C')
const selectedModifier = ref('M')
</script>

<template>
  <div class="fcf-demo">
    <h3>Interactive Feature Control Frame Builder</h3>
    <p>Build your own feature control frame by selecting different components:</p>
    
    <!-- Controls -->
    <div class="fcf-controls">
      <!-- Symbol Selection -->
      <div class="control-group">
        <label>Geometric Characteristic</label>
        <div class="symbol-grid">
          <button
            v-for="symbol in symbols"
            :key="symbol.name"
            class="symbol-btn"
            :class="{ active: selectedSymbol?.name === symbol.name }"
            @click="selectedSymbol = symbol"
            :title="symbol.description"
          >
            <span class="symbol-icon">{{ symbol.icon }}</span>
            <span class="symbol-name">{{ symbol.name }}</span>
          </button>
        </div>
      </div>
      
      <!-- Tolerance Input -->
      <div class="control-group">
        <label>Tolerance Value</label>
        <div class="tolerance-input">
          <span class="diameter">⌀</span>
          <input
            v-model="toleranceValue"
            type="number"
            step="0.01"
            min="0"
            max="10"
          />
          <select v-model="selectedModifier" class="modifier-select">
            <option v-for="mod in modifiers" :key="mod.symbol" :value="mod.symbol">
              {{ mod.symbol }} - {{ mod.name }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Datum References -->
      <div class="control-group">
        <label>Datum References</label>
        <div class="datum-inputs">
          <div class="datum-input">
            <span class="datum-label">Primary:</span>
            <input v-model="primaryDatum" type="text" maxlength="1" />
          </div>
          <div class="datum-input">
            <span class="datum-label">Secondary:</span>
            <input v-model="secondaryDatum" type="text" maxlength="1" />
            <span class="modifier-mini">{{ selectedModifier }}</span>
          </div>
          <div class="datum-input">
            <span class="datum-label">Tertiary:</span>
            <input v-model="tertiaryDatum" type="text" maxlength="1" />
            <span class="modifier-mini">{{ selectedModifier }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Result Display -->
    <div class="fcf-result">
      <h4>Generated Feature Control Frame:</h4>
      <div class="fcf-display">
        <div class="fcf-cell symbol">
          <span class="symbol-large">{{ selectedSymbol?.icon }}</span>
        </div>
        <div class="fcf-cell tolerance">
          <span class="diameter">⌀</span> {{ toleranceValue }} <span class="modifier">{{ selectedModifier }}</span>
        </div>
        <div class="fcf-cell datum" v-if="primaryDatum">{{ primaryDatum }}</div>
        <div class="fcf-cell datum" v-if="secondaryDatum">
          {{ secondaryDatum }} <span class="modifier">{{ selectedModifier }}</span>
        </div>
        <div class="fcf-cell datum" v-if="tertiaryDatum">
          {{ tertiaryDatum }} <span class="modifier">{{ selectedModifier }}</span>
        </div>
      </div>
      
      <!-- Interpretation -->
      <div class="interpretation">
        <h5>Interpretation:</h5>
        <p>
          This feature control frame specifies that the feature must have 
          <strong>{{ selectedSymbol?.name?.toLowerCase() || 'position' }}</strong> 
          within a cylindrical tolerance zone of 
          <strong>{{ toleranceValue }}mm diameter</strong> 
          at <strong>{{ modifiers.find(m => m.symbol === selectedModifier)?.name }}</strong>
          <span v-if="primaryDatum">, relative to datum {{ primaryDatum }}</span>
          <span v-if="secondaryDatum">, datum {{ secondaryDatum }}</span>
          <span v-if="tertiaryDatum">, and datum {{ tertiaryDatum }}</span>.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fcf-demo {
  padding: 2rem;
  background: var(--card);
  border-radius: 1rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  
  h3 {
    font-size: 1.5rem;
    color: var(--text);
    margin: 0 0 0.5rem;
  }
  
  > p {
    color: var(--text);
    opacity: 0.75;
    margin: 0 0 2rem;
  }
}

/* Controls */
.fcf-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.control-group {
  label {
    display: block;
    font-weight: 600;
    color: var(--accent-500);
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

/* Symbol Grid */
.symbol-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.symbol-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--main-bg);
  border: 2px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--accent-500);
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: var(--accent-500);
    background: rgb(var(--accent-500-rgb) / 10%);
  }
  
  .symbol-icon {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-500);
  }
  
  .symbol-name {
    font-size: 0.75rem;
    color: var(--text);
    text-align: center;
  }
}

/* Tolerance Input */
.tolerance-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .diameter {
    font-size: 1.25rem;
    color: var(--accent-500);
  }
  
  input {
    width: 100px;
    padding: 0.5rem;
    background: var(--main-bg);
    border: 1px solid rgb(var(--accent-500-rgb) / 20%);
    border-radius: 0.25rem;
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    
    &:focus {
      outline: none;
      border-color: var(--accent-500);
    }
  }
  
  .modifier-select {
    flex: 1;
    max-width: 300px;
    padding: 0.5rem;
    background: var(--main-bg);
    border: 1px solid rgb(var(--accent-500-rgb) / 20%);
    border-radius: 0.25rem;
    color: var(--text);
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: var(--accent-500);
    }
  }
}

/* Datum Inputs */
.datum-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.datum-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .datum-label {
    font-size: 0.875rem;
    color: var(--neutral);
  }
  
  input {
    width: 50px;
    padding: 0.5rem;
    background: var(--main-bg);
    border: 1px solid rgb(var(--accent-500-rgb) / 20%);
    border-radius: 0.25rem;
    color: var(--text);
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    text-transform: uppercase;
    
    &:focus {
      outline: none;
      border-color: var(--accent-500);
    }
  }
  
  .modifier-mini {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid currentColor;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--accent-500);
  }
}

/* Result Display */
.fcf-result {
  padding: 2rem;
  background: var(--main-bg);
  border-radius: 0.75rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  
  h4 {
    font-size: 1.1rem;
    color: var(--text);
    margin: 0 0 1rem;
  }
}

.fcf-display {
  display: inline-flex;
  border: 3px solid var(--accent-500);
  background: var(--card);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 16px rgb(var(--accent-500-rgb) / 20%);
}

.fcf-cell {
  padding: 1rem 1.25rem;
  border-right: 3px solid var(--accent-500);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  color: var(--text);
  
  &:last-child {
    border-right: none;
  }
  
  &.symbol {
    background: rgb(var(--accent-500-rgb) / 10%);
    
    .symbol-large {
      font-size: 1.5rem;
      color: var(--accent-500);
    }
  }
}

.modifier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4em;
  height: 1.4em;
  border: 2px solid currentColor;
  border-radius: 50%;
  font-size: 0.7em;
  margin-left: 0.25em;
}

/* Interpretation */
.interpretation {
  h5 {
    font-size: 0.875rem;
    color: var(--accent-500);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.5rem;
  }
  
  p {
    color: var(--text);
    line-height: 1.6;
    margin: 0;
    
    strong {
      color: var(--accent-500);
    }
  }
}
</style>
