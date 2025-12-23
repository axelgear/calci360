<script setup lang="ts">
import type { BendingStressCalculatorConfig } from './calculators/bending-stress/types'
import { profileCategories, materialGroups } from './calculators/metal-weight/types'
import UnitInput from './UnitInput.vue'
import ResultCard from './ResultCard.vue'
import Dropdown from '~/components/Dropdown.vue'
import BeamEditor from './BeamEditor/BeamEditor.vue'
import ShearMomentDiagram from './BeamEditor/ShearMomentDiagram.vue'
import ShapeVisual from './shapes/ShapeVisual.vue'
import { useBendingStressCalculator, beamPresets, loadPresets } from '@/composables/useBendingStressCalculator'
import { useUiTranslator } from '@/composables/useUiTranslator'
import type { BeamType } from './calculators/bending-stress/types'

const { t } = useUiTranslator()

const props = defineProps<{
  config: BendingStressCalculatorConfig
}>()

/* Use the composable for all calculation logic */
const {
  beamType,
  beamLength,
  supports,
  loads,
  selectedProfileId,
  selectedProfile,
  profileDimensions,
  beamProfile,
  selectedMaterialId,
  selectedMaterial,
  beamMaterial,
  metalProfiles,
  allMaterials,
  setBeamType,
  addLoad,
  removeLoad,
  updateLoad,
  clearLoads,
  calculationResults,
  formattedMaxBendingStress,
  formattedMaxShearStress,
  formattedMaxMoment,
  formattedMaxShear,
  formattedMaxDeflection,
  formattedSafetyFactor,
  formattedMomentOfInertia,
  formattedSectionModulus,
  formattedArea,
} = useBendingStressCalculator(toRef(props, 'config'))

/* Selection state */
const selectedLoadId = ref<string | null>(null)
const selectedSupportId = ref<string | null>(null)

/* Profile options grouped by category */
const profileOptions = computed(() => {
  return profileCategories
    .filter(cat => cat.id === 'structural' || cat.id === 'bar')
    .map(cat => ({
      label: cat.name,
      options: metalProfiles
        .filter(p => p.category === cat.id)
        .map(p => ({
          value: p.id,
          label: t(p.name),
        })),
    }))
})

/* Flat profile options for dropdown */
const flatProfileOptions = computed(() => {
  return metalProfiles
    .filter(p => p.category === 'structural' || p.category === 'bar')
    .map(p => ({
      value: p.id,
      label: t(p.name),
      sublabel: profileCategories.find(c => c.id === p.category)?.name,
    }))
})

/* Material options grouped by category */
const flatMaterialOptions = computed(() => {
  const options: { value: string; label: string; sublabel: string }[] = []
  materialGroups.forEach(group => {
    group.materials.forEach(m => {
      if (m.mechanical) {
        options.push({
          value: m.id,
          label: m.name,
          sublabel: `E = ${(m.mechanical.youngsModulus / 1e9).toFixed(0)} GPa`,
        })
      }
    })
  })
  return options
})

/* Beam type options */
const beamTypeOptions = computed(() => 
  beamPresets.map(preset => ({
    value: preset.beamType,
    label: t(preset.name),
    sublabel: t(preset.description),
  }))
)

/* Length units for input */
const lengthUnits = [
  { id: 'meter', name: 'Meter', symbol: 'm', toBase: 1 },
  { id: 'centimeter', name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
  { id: 'millimeter', name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
  { id: 'foot', name: 'Foot', symbol: 'ft', toBase: 0.3048 },
  { id: 'inch', name: 'Inch', symbol: 'in', toBase: 0.0254 },
]

/* Handle beam editor events */
function handleSelectLoad(loadId: string | null) {
  selectedLoadId.value = loadId
  selectedSupportId.value = null
}

function handleSelectSupport(supportId: string | null) {
  selectedSupportId.value = supportId
  selectedLoadId.value = null
}

function handleAddLoad(type: string, position: number) {
  addLoad(type as any, position)
}

function handleUpdateLoadPosition(loadId: string, position: number) {
  updateLoad(loadId, { position })
}

function handleUpdateLoad(loadId: string, updates: Record<string, any>) {
  updateLoad(loadId, updates)
}

function handleRemoveLoad(loadId: string) {
  removeLoad(loadId)
  if (selectedLoadId.value === loadId) {
    selectedLoadId.value = null
  }
}

/* Selected load details for editing */
const selectedLoad = computed(() => {
  if (!selectedLoadId.value) return null
  return loads.value.find(l => l.id === selectedLoadId.value)
})

/* Force units for input */
const forceUnits = [
  { id: 'newton', name: 'Newton', symbol: 'N', toBase: 1 },
  { id: 'kilonewton', name: 'Kilonewton', symbol: 'kN', toBase: 1000 },
  { id: 'pound', name: 'Pound-force', symbol: 'lbf', toBase: 4.44822 },
  { id: 'kip', name: 'Kip', symbol: 'kip', toBase: 4448.22 },
]

const forcePerLengthUnits = [
  { id: 'npm', name: 'N/m', symbol: 'N/m', toBase: 1 },
  { id: 'knpm', name: 'kN/m', symbol: 'kN/m', toBase: 1000 },
  { id: 'lbpft', name: 'lb/ft', symbol: 'lb/ft', toBase: 14.5939 },
]

/* Density units for display */
const densityUnits = [
  { id: 'kg_per_m3', name: 'kg/m³', symbol: 'kg/m³', toBase: 1 },
  { id: 'g_per_cm3', name: 'g/cm³', symbol: 'g/cm³', toBase: 1000 },
  { id: 'lb_per_ft3', name: 'lb/ft³', symbol: 'lb/ft³', toBase: 16.0185 },
]

/* Input values and units for ShapeVisual */
const inputUnits = reactive<Record<string, string>>({})

/* Initialize input units when profile changes */
watch(selectedProfileId, () => {
  if (selectedProfile.value) {
    selectedProfile.value.inputs.forEach(input => {
      if (!inputUnits[input.id]) {
        inputUnits[input.id] = input.id === 'length' ? 'meter' : 'millimeter'
      }
    })
  }
}, { immediate: true })

/* Custom density for display */
const customDensity = computed(() => selectedMaterial.value?.density ?? 7860)
const densityUnitId = ref('kg_per_m3')

/* Material density display */
const materialDensityDisplay = computed(() => {
  if (!selectedMaterial.value) return ''
  return `${selectedMaterial.value.density.toLocaleString()} kg/m³`
})
</script>

<template>
  <div class="bending-stress-widget">
    <!-- Selectors Row -->
    <div class="selectors-row">
      <!-- Beam Type Selector -->
      <div class="selector-group">
        <label class="selector-label">
          <span class="material-icons">straighten</span>
          {{ t('Beam Type') }}
        </label>
        <Dropdown
          :model-value="beamType"
          :options="beamTypeOptions"
          :full-width="true"
          @update:model-value="setBeamType($event as BeamType)"
        />
      </div>

      <!-- Profile Selector -->
      <div class="selector-group">
        <label class="selector-label">
          <span class="material-icons">category</span>
          {{ t('Cross Section') }}
        </label>
        <Dropdown
          v-model="selectedProfileId"
          :options="flatProfileOptions"
          :searchable="true"
          :search-placeholder="t('Search profiles...')"
          max-height="400px"
          :full-width="true"
        />
      </div>

      <!-- Material Selector -->
      <div class="selector-group">
        <label class="selector-label">
          <span class="material-icons">layers</span>
          {{ t('Material') }}
        </label>
        <Dropdown
          v-model="selectedMaterialId"
          :options="flatMaterialOptions"
          :searchable="true"
          :search-placeholder="t('Search materials...')"
          max-height="400px"
          :full-width="true"
        />
        <span v-if="selectedMaterial?.mechanical" class="material-hint">
          E = {{ (selectedMaterial.mechanical.youngsModulus / 1e9).toFixed(0) }} GPa, 
          σy = {{ (selectedMaterial.mechanical.yieldStrength / 1e6).toFixed(0) }} MPa
        </span>
      </div>
    </div>

    <!-- Beam Length Input -->
    <div class="beam-length-row">
      <UnitInput
        v-model:model-value="beamLength"
        :label="t('Beam Length')"
        symbol="L"
        :units="lengthUnits"
        unit="meter"
        :min="0.1"
        :step="0.1"
      />
    </div>

    <!-- Calculator Body with Visual and Inputs -->
    <div v-if="selectedProfile" class="calculator-body">
      <!-- Visual Preview -->
      <div class="visual-section">
        <ShapeVisual
          mode="profile"
          :shape-id="selectedProfileId"
          :values="profileDimensions"
          :input-units="inputUnits"
          :length-units="lengthUnits"
          :material="selectedMaterial?.name ?? 'Steel'"
          :result="beamProfile?.area ?? 0"
          result-unit="mm²"
          :result-label="t('Section Area')"
        />
      </div>

      <!-- Inputs Section -->
      <div class="input-section">
        <h4 class="section-title">
          <span class="material-icons">straighten</span>
          {{ t('Section Dimensions') }}
        </h4>
        
        <!-- Dynamic Dimension Inputs -->
        <div class="inputs-grid">
          <UnitInput
            v-for="input in selectedProfile.inputs.filter(i => i.id !== 'length')"
            :key="input.id"
            :model-value="profileDimensions[input.id] ?? input.default ?? 0.05"
            :unit="inputUnits[input.id] ?? 'millimeter'"
            :label="t(input.label)"
            :symbol="input.symbol"
            :units="lengthUnits"
            :min="input.min ?? 0.001"
            :step="input.step ?? 0.001"
            :help-text="input.helpText ? t(input.helpText) : undefined"
            @update:model-value="profileDimensions[input.id] = $event"
            @update:unit="inputUnits[input.id] = $event"
          />

          <!-- Density Input (display only) -->
          <UnitInput
            :model-value="customDensity"
            :label="t('Density')"
            symbol="ρ"
            :units="densityUnits"
            :unit="densityUnitId"
            :min="0.01"
            :step="0.1"
            :disabled="true"
          />
        </div>
        
        <!-- Section Properties -->
        <div class="section-properties">
          <div class="property-item">
            <span class="property-label">{{ t('Area (A)') }}</span>
            <span class="property-value">{{ formattedArea }}</span>
          </div>
          <div class="property-item">
            <span class="property-label">{{ t('Moment of Inertia (I)') }}</span>
            <span class="property-value">{{ formattedMomentOfInertia }}</span>
          </div>
          <div class="property-item">
            <span class="property-label">{{ t('Section Modulus (S)') }}</span>
            <span class="property-value">{{ formattedSectionModulus }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Beam Editor Canvas -->
    <BeamEditor
      :beam-length="beamLength"
      :loads="loads"
      :supports="supports"
      :selected-load-id="selectedLoadId"
      :selected-support-id="selectedSupportId"
      @select-load="handleSelectLoad"
      @select-support="handleSelectSupport"
      @add-load="handleAddLoad"
      @update-load-position="handleUpdateLoadPosition"
      @update-load="handleUpdateLoad"
      @remove-load="handleRemoveLoad"
    />

    <!-- Selected Load Editor -->
    <div v-if="selectedLoad" class="load-editor">
      <h4 class="section-title">
        <span class="material-icons">edit</span>
        {{ t('Edit Load') }}
      </h4>
      <div class="load-editor-grid">
        <template v-if="selectedLoad.type === 'point'">
          <UnitInput
            :model-value="selectedLoad.magnitude"
            :label="t('Force')"
            symbol="P"
            :units="forceUnits"
            unit="kilonewton"
            :min="0"
            :step="1"
            @update:model-value="updateLoad(selectedLoad.id, { magnitude: $event })"
          />
          <div class="direction-toggle">
            <label>{{ t('Direction') }}</label>
            <div class="toggle-buttons">
              <button
                :class="{ active: selectedLoad.direction === 'down' }"
                @click="updateLoad(selectedLoad.id, { direction: 'down' })"
              >
                <span class="material-icons">arrow_downward</span>
                {{ t('Down') }}
              </button>
              <button
                :class="{ active: selectedLoad.direction === 'up' }"
                @click="updateLoad(selectedLoad.id, { direction: 'up' })"
              >
                <span class="material-icons">arrow_upward</span>
                {{ t('Up') }}
              </button>
            </div>
          </div>
        </template>
        
        <template v-else-if="selectedLoad.type === 'udl'">
          <UnitInput
            :model-value="selectedLoad.magnitude"
            :label="t('Load Intensity')"
            symbol="w"
            :units="forcePerLengthUnits"
            unit="knpm"
            :min="0"
            :step="0.1"
            @update:model-value="updateLoad(selectedLoad.id, { magnitude: $event })"
          />
          <UnitInput
            :model-value="selectedLoad.startPosition * beamLength"
            :label="t('Start Position')"
            symbol="a"
            :units="lengthUnits"
            unit="meter"
            :min="0"
            :max="beamLength"
            :step="0.1"
            @update:model-value="updateLoad(selectedLoad.id, { startPosition: $event / beamLength })"
          />
          <UnitInput
            :model-value="selectedLoad.endPosition * beamLength"
            :label="t('End Position')"
            symbol="b"
            :units="lengthUnits"
            unit="meter"
            :min="0"
            :max="beamLength"
            :step="0.1"
            @update:model-value="updateLoad(selectedLoad.id, { endPosition: $event / beamLength })"
          />
        </template>
        
        <template v-else-if="selectedLoad.type === 'moment'">
          <UnitInput
            :model-value="selectedLoad.magnitude"
            :label="t('Moment')"
            symbol="M"
            :units="[
              { id: 'nm', name: 'N·m', symbol: 'N·m', toBase: 1 },
              { id: 'knm', name: 'kN·m', symbol: 'kN·m', toBase: 1000 },
            ]"
            unit="knm"
            :min="0"
            :step="1"
            @update:model-value="updateLoad(selectedLoad.id, { magnitude: $event })"
          />
          <div class="direction-toggle">
            <label>{{ t('Direction') }}</label>
            <div class="toggle-buttons">
              <button
                :class="{ active: selectedLoad.direction === 'clockwise' }"
                @click="updateLoad(selectedLoad.id, { direction: 'clockwise' })"
              >
                <span class="material-icons">rotate_right</span>
                {{ t('CW') }}
              </button>
              <button
                :class="{ active: selectedLoad.direction === 'counterclockwise' }"
                @click="updateLoad(selectedLoad.id, { direction: 'counterclockwise' })"
              >
                <span class="material-icons">rotate_left</span>
                {{ t('CCW') }}
              </button>
            </div>
          </div>
        </template>
        
        <button class="delete-load-btn" @click="handleRemoveLoad(selectedLoad.id)">
          <span class="material-icons">delete</span>
          {{ t('Remove Load') }}
        </button>
      </div>
    </div>

    <!-- Shear & Moment Diagrams -->
    <div v-if="calculationResults" class="diagrams-section">
      <ShearMomentDiagram
        :beam-length="beamLength"
        :shear-diagram="calculationResults.shearDiagram"
        :moment-diagram="calculationResults.momentDiagram"
        :deflection-curve="calculationResults.deflectionCurve"
        :reactions="calculationResults.reactions"
        :max-shear="calculationResults.maxShear"
        :min-shear="calculationResults.minShear"
        :max-moment="calculationResults.maxMoment"
        :min-moment="calculationResults.minMoment"
        :max-deflection="calculationResults.maxDeflection"
      />
    </div>

    <!-- Results Section -->
    <div v-if="calculationResults" class="results-section">
      <h4 class="section-title">
        <span class="material-icons">analytics</span>
        {{ t('Analysis Results') }}
      </h4>
      
      <div class="results-grid">
        <!-- Max Bending Stress -->
        <div class="result-card" :class="{ warning: !calculationResults.bendingStressSafe }">
          <div class="result-icon">
            <span class="material-icons">compress</span>
          </div>
          <div class="result-content">
            <span class="result-label">{{ t('Max Bending Stress') }}</span>
            <span class="result-value">{{ formattedMaxBendingStress }}</span>
            <span class="result-status" :class="{ safe: calculationResults.bendingStressSafe, unsafe: !calculationResults.bendingStressSafe }">
              {{ calculationResults.bendingStressSafe ? t('Safe') : t('Exceeds Allowable') }}
            </span>
          </div>
        </div>
        
        <!-- Max Shear Stress -->
        <div class="result-card" :class="{ warning: !calculationResults.shearStressSafe }">
          <div class="result-icon">
            <span class="material-icons">swap_vert</span>
          </div>
          <div class="result-content">
            <span class="result-label">{{ t('Max Shear Stress') }}</span>
            <span class="result-value">{{ formattedMaxShearStress }}</span>
            <span class="result-status" :class="{ safe: calculationResults.shearStressSafe, unsafe: !calculationResults.shearStressSafe }">
              {{ calculationResults.shearStressSafe ? t('Safe') : t('Exceeds Allowable') }}
            </span>
          </div>
        </div>
        
        <!-- Max Moment -->
        <div class="result-card">
          <div class="result-icon">
            <span class="material-icons">sync_alt</span>
          </div>
          <div class="result-content">
            <span class="result-label">{{ t('Max Bending Moment') }}</span>
            <span class="result-value">{{ formattedMaxMoment }}</span>
          </div>
        </div>
        
        <!-- Max Shear -->
        <div class="result-card">
          <div class="result-icon">
            <span class="material-icons">height</span>
          </div>
          <div class="result-content">
            <span class="result-label">{{ t('Max Shear Force') }}</span>
            <span class="result-value">{{ formattedMaxShear }}</span>
          </div>
        </div>
        
        <!-- Max Deflection -->
        <div class="result-card" :class="{ warning: !calculationResults.deflectionSafe }">
          <div class="result-icon">
            <span class="material-icons">trending_down</span>
          </div>
          <div class="result-content">
            <span class="result-label">{{ t('Max Deflection') }}</span>
            <span class="result-value">{{ formattedMaxDeflection }}</span>
            <span class="result-status" :class="{ safe: calculationResults.deflectionSafe, unsafe: !calculationResults.deflectionSafe }">
              {{ calculationResults.deflectionSafe ? t('Within L/360') : t('Exceeds L/360') }}
            </span>
          </div>
        </div>
        
        <!-- Safety Factor -->
        <div class="result-card primary">
          <div class="result-icon">
            <span class="material-icons">verified_user</span>
          </div>
          <div class="result-content">
            <span class="result-label">{{ t('Safety Factor') }}</span>
            <span class="result-value">{{ formattedSafetyFactor }}</span>
            <span class="result-status" :class="{ safe: calculationResults.safetyFactor >= 1, unsafe: calculationResults.safetyFactor < 1 }">
              {{ calculationResults.safetyFactor >= 1 ? t('Adequate') : t('Insufficient') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulas Reference -->
    <div class="formulas-section">
      <h4 class="section-title">
        <span class="material-icons">functions</span>
        {{ t('Key Formulas') }}
      </h4>
      <div class="formulas-grid">
        <div class="formula-item">
          <span class="formula">σ = Mc/I = M/S</span>
          <span class="formula-desc">{{ t('Bending Stress') }}</span>
        </div>
        <div class="formula-item">
          <span class="formula">τ = VQ/(Ib)</span>
          <span class="formula-desc">{{ t('Shear Stress') }}</span>
        </div>
        <div class="formula-item">
          <span class="formula">S = I/c</span>
          <span class="formula-desc">{{ t('Section Modulus') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/styles/mixins" as *;

.bending-stress-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Selectors Row */
.selectors-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @include tablet {
    grid-template-columns: 1fr;
  }
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selector-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);

  .material-icons {
    font-size: 1rem;
    color: var(--accent-500);
  }
}

.material-hint {
  font-size: 0.7rem;
  color: var(--neutral);
  font-family: 'JetBrains Mono', monospace;
}

/* Beam Length Row */
.beam-length-row {
  max-width: 300px;
}

/* Calculator Body */
.calculator-body {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) 2fr;
  gap: 1.5rem;
  align-items: start;

  @include tablet {
    grid-template-columns: 1fr;
  }
}

.visual-section {
  position: sticky;
  top: 1rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);

  .material-icons {
    font-size: 1.1rem;
    color: var(--accent-500);
  }
}

.inputs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.section-properties {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgb(var(--accent-500-rgb) / 10%);
  flex-wrap: wrap;
}

.property-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.5rem 0.75rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-radius: 0.5rem;
}

.property-label {
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--neutral);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.property-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

/* Load Editor */
.load-editor {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 1rem;
}

.load-editor-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.direction-toggle {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text);
  }
}

.toggle-buttons {
  display: flex;
  gap: 0.25rem;

  button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    background: var(--card);
    border: 1px solid rgb(var(--accent-500-rgb) / 25%);
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    transition: all 0.15s;

    .material-icons {
      font-size: 16px;
    }

    &:hover {
      border-color: var(--accent-500);
    }

    &.active {
      background: var(--accent-500);
      border-color: var(--accent-500);
      color: white;
    }
  }
}

.delete-load-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  background: rgb(239 68 68 / 10%);
  border: 1px solid rgb(239 68 68 / 30%);
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.15s;

  .material-icons {
    font-size: 16px;
  }

  &:hover {
    background: rgb(239 68 68 / 20%);
    border-color: #ef4444;
  }
}

/* Diagrams Section - Styles are in ShearMomentDiagram component */

/* Results Section */
.results-section {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.result-card {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.5rem;
  transition: all 0.2s;

  &.warning {
    background: rgb(239 68 68 / 10%);
    border-color: rgb(239 68 68 / 30%);
  }

  &.primary {
    background: rgb(var(--accent-500-rgb) / 15%);
    border-color: rgb(var(--accent-500-rgb) / 30%);

    .result-value {
      color: var(--accent-500);
      font-size: 1.25rem;
    }
  }
}

.result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.375rem;
  flex-shrink: 0;

  .material-icons {
    font-size: 20px;
    color: var(--accent-500);
  }

  .warning & {
    background: rgb(239 68 68 / 15%);
    
    .material-icons {
      color: #ef4444;
    }
  }
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.result-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--neutral);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.result-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.result-status {
  font-size: 0.65rem;
  font-weight: 600;

  &.safe {
    color: #22c55e;
  }

  &.unsafe {
    color: #ef4444;
  }
}

/* Formulas Section */
.formulas-section {
  background: rgb(var(--accent-500-rgb) / 5%);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 1rem;
}

.formulas-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.formula-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.formula {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-500);
}

.formula-desc {
  font-size: 0.7rem;
  color: var(--neutral);
}
</style>

