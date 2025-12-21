<script setup lang="ts">
import type { HvacDuctCalculatorConfig } from './calculators/hvac/types'
import UnitInput from './UnitInput.vue'
import FormulaCard from './FormulaCard.vue'
import ResultCard from './ResultCard.vue'
import Dropdown from '~/components/Dropdown.vue'
import ShapeVisual from './shapes/ShapeVisual.vue'
import { useHvacDuctCalculator } from '@/composables/useHvacDuctCalculator'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = defineProps<{
  config: HvacDuctCalculatorConfig
}>()

const {
  selectedDuctType,
  selectedDuct,
  selectedInsulationId,
  selectedInsulation,
  inputValues,
  inputUnits,
  inletTemp,
  inletTempUnit,
  ambientTemp,
  ambientTempUnit,
  hInside,
  hInsideUnit,
  hOutside,
  hOutsideUnit,
  insulationThickness,
  insulationThicknessUnit,
  airflowMode,
  volumeFlow,
  volumeFlowUnit,
  airVelocity,
  airVelocityUnit,
  outputTempUnit,
  /* Thermal conductivity (k-value) - editable */
  customThermalConductivity,
  thermalConductivityUnit,
  isKValueCustom,
  /* Heat transfer coefficients */
  isHOutsideCustom,
  /* Exterior conditions */
  selectedExteriorConditionId,
  selectedExteriorCondition,
  /* Results */
  exitTemp,
  tempDrop,
  heatLossRate,
  thermalEfficiency,
  rValueImperial,
  formattedExitTemp,
  formattedTempDrop,
  formattedHeatLoss,
  formattedEfficiency,
  lengthUnits,
  temperatureUnits,
  airflowUnits,
  velocityUnits,
  thicknessUnits,
  thermalConductivityUnits,
  heatTransferUnits,
  insulationMaterials,
  ductDefinitions,
  exteriorConditions,
  onInputValueChange,
  onInputUnitChange,
  copied,
  copyResult,
} = useHvacDuctCalculator(toRef(props, 'config'))

/* Duct type options */
const ductOptions = computed(() => 
  ductDefinitions.map(d => ({
    value: d.id,
    label: t(d.name),
  }))
)

/* Insulation options */
const insulationOptions = computed(() =>
  insulationMaterials.map(m => ({
    value: m.id,
    label: m.name,
    sublabel: m.id === 'none' ? '' : `k = ${m.thermalConductivity} W/(m·K)`,
  }))
)

/* Exterior condition options */
const exteriorOptions = computed(() =>
  exteriorConditions.map(c => ({
    value: c.id,
    label: c.name,
    sublabel: `h = ${c.hOutsideImperial} BTU/(hr·ft²·°F)`,
  }))
)

/* Is cooling mode (inlet < ambient) */
const isCooling = computed(() => inletTemp.value < ambientTemp.value)

/* Temperature units for ResultCard */
const tempUnitsForResult = computed(() => 
  temperatureUnits.map(u => ({ id: u.id, name: u.name, symbol: u.symbol }))
)

/* Additional results for display */
const additionalResults = computed(() => [
  { id: 'temp-drop', label: 'Temperature Drop', value: formattedTempDrop.value, icon: 'trending_down' },
  { id: 'heat-loss', label: 'Heat Loss Rate', value: formattedHeatLoss.value, icon: 'bolt' },
  { id: 'efficiency', label: 'Thermal Efficiency', value: formattedEfficiency.value, icon: 'speed' },
])
</script>

<template>
  <div class="hvac-duct-widget">
    <!-- Selectors Row -->
    <div class="selectors-row">
      <!-- Duct Type Selector -->
      <div class="selector-group">
        <label class="selector-label">
          <span class="material-icons">{{ selectedDuct?.icon ?? 'trip_origin' }}</span>
          {{ t('Duct Type') }}
        </label>
        <Dropdown
          v-model="selectedDuctType"
          :options="ductOptions"
          :full-width="true"
        />
      </div>

      <!-- Insulation Selector -->
      <div class="selector-group">
        <label class="selector-label">
          <span class="material-icons">layers</span>
          {{ t('Insulation') }}
        </label>
        <Dropdown
          v-model="selectedInsulationId"
          :options="insulationOptions"
          :searchable="true"
          :search-placeholder="t('Search insulation...')"
          :full-width="true"
        />
        <span v-if="selectedInsulation && selectedInsulation.id !== 'none'" class="density-hint" :class="{ custom: isKValueCustom }">
          k = {{ customThermalConductivity }} W/(m·K)
          <span v-if="isKValueCustom" class="custom-tag">(custom)</span>
        </span>
      </div>

      <!-- Exterior Condition Selector -->
      <div class="selector-group">
        <label class="selector-label">
          <span class="material-icons">air</span>
          {{ t('Exterior Conditions') }}
        </label>
        <Dropdown
          v-model="selectedExteriorConditionId"
          :options="exteriorOptions"
          :full-width="true"
        />
        <span class="density-hint" :class="{ custom: isHOutsideCustom }">
          h = {{ hOutside.toFixed(2) }} W/(m²·K)
          <span v-if="isHOutsideCustom" class="custom-tag">(custom)</span>
        </span>
      </div>
    </div>

    <div class="calculator-body">
      <!-- Visual Preview -->
      <div class="visual-section">
        <ShapeVisual
          mode="hvac"
          :shape-id="selectedDuctType"
          :values="inputValues"
          :input-units="inputUnits"
          :length-units="lengthUnits"
          :result="exitTemp"
          :result-unit="temperatureUnits.find(u => u.id === outputTempUnit)?.symbol || '°C'"
          :hvac-data="{
            inletTemp,
            inletTempUnit,
            ambientTemp,
            ambientTempUnit,
            isCooling,
            insulation: selectedInsulation?.id !== 'none' ? selectedInsulation?.name : undefined,
          }"
        />
      </div>

      <!-- Inputs & Result -->
      <div class="input-section">
        <!-- Duct Dimensions -->
        <div v-if="selectedDuct" class="inputs-grid">
          <UnitInput
            v-for="input in selectedDuct.inputs"
            :key="input.id"
            :model-value="inputValues[input.id] ?? input.default"
            :unit="inputUnits[input.id] ?? 'meter'"
            :label="t(input.label)"
            :symbol="input.symbol"
            :units="lengthUnits"
            :min="input.min ?? 0.001"
            :step="input.step ?? 0.01"
            :help-text="input.helpText ? t(input.helpText) : undefined"
            @update:model-value="onInputValueChange(input.id, $event)"
            @update:unit="onInputUnitChange(input.id, $event)"
          />
        </div>

        <!-- Temperature Inputs -->
        <div class="input-group">
          <h4 class="group-title">
            <span class="material-icons">thermostat</span>
            {{ t('Temperatures') }}
          </h4>
          <div class="inputs-grid">
            <UnitInput
              v-model:model-value="inletTemp"
              v-model:unit="inletTempUnit"
              :label="t('Inlet Air Temperature')"
              symbol="T_in"
              :units="temperatureUnits"
              :min="-100"
              :max="200"
              :step="1"
            />
            <UnitInput
              v-model:model-value="ambientTemp"
              v-model:unit="ambientTempUnit"
              :label="t('Ambient Temperature')"
              symbol="T_amb"
              :units="temperatureUnits"
              :min="-50"
              :max="60"
              :step="1"
            />
          </div>
        </div>

        <!-- Airflow -->
        <div class="input-group">
          <h4 class="group-title">
            <span class="material-icons">air</span>
            {{ t('Airflow') }}
            <div class="airflow-toggle">
              <button
                :class="['toggle-btn', { active: airflowMode === 'volume' }]"
                @click="airflowMode = 'volume'"
              >
                {{ t('Volume') }}
              </button>
              <button
                :class="['toggle-btn', { active: airflowMode === 'velocity' }]"
                @click="airflowMode = 'velocity'"
              >
                {{ t('Velocity') }}
              </button>
            </div>
          </h4>
          <div class="inputs-grid">
            <UnitInput
              v-if="airflowMode === 'volume'"
              v-model:model-value="volumeFlow"
              v-model:unit="volumeFlowUnit"
              :label="t('Volume Flow Rate')"
              symbol="Q"
              :units="airflowUnits"
              :min="0.001"
              :step="0.01"
            />
            <UnitInput
              v-else
              v-model:model-value="airVelocity"
              v-model:unit="airVelocityUnit"
              :label="t('Air Velocity')"
              symbol="v"
              :units="velocityUnits"
              :min="0.1"
              :step="0.5"
            />
          </div>
        </div>

        <!-- Insulation Thickness & K-value (if insulated) -->
        <div v-if="selectedInsulationId !== 'none'" class="input-group">
          <h4 class="group-title">
            <span class="material-icons">layers</span>
            {{ t('Insulation') }}
          </h4>
          <div class="inputs-grid">
            <UnitInput
              v-model:model-value="insulationThickness"
              v-model:unit="insulationThicknessUnit"
              :label="t('Insulation Thickness')"
              symbol="t_ins"
              :units="thicknessUnits"
              :min="1"
              :max="200"
              :step="1"
            />
            <!-- Thermal Conductivity (k-value) - editable -->
            <UnitInput
              v-model:model-value="customThermalConductivity"
              v-model:unit="thermalConductivityUnit"
              :label="isKValueCustom ? t('Thermal Conductivity') + ' (custom)' : t('Thermal Conductivity')"
              symbol="k"
              :units="thermalConductivityUnits"
              :min="0.001"
              :max="100"
              :step="0.001"
            />
          </div>

          <div v-if="rValueImperial > 0" class="r-value-display">
            <span class="material-icons">info</span>
            R-value: {{ rValueImperial.toFixed(1) }} (ft²·°F·h)/BTU
          </div>
        </div>

        <!-- Formula Card -->
        <FormulaCard
          formula="T_exit = T_amb + (T_in − T_amb) × e^(−NTU)"
          explanation="NTU = U × A / (ṁ × c_p) — Number of Transfer Units method"
        />

        <!-- Primary Result -->
        <div class="result-section">
          <ResultCard
            :label="config.resultLabel"
            :value="formattedExitTemp"
            :icon="isCooling ? 'ac_unit' : 'whatshot'"
            :units="tempUnitsForResult"
            :selected-unit="outputTempUnit"
            :copied="copied"
            @update:selected-unit="outputTempUnit = $event"
            @copy="copyResult(exitTemp.toFixed(2))"
          />
        </div>
      </div>
    </div>

    <!-- Additional Results -->
    <div class="additional-results">
      <div
        v-for="result in additionalResults"
        :key="result.id"
        class="result-item"
      >
        <div class="result-icon">
          <span class="material-icons">{{ result.icon }}</span>
        </div>
        <div class="result-content">
          <span class="result-label">{{ t(result.label) }}</span>
          <span class="result-value" :class="{ warning: result.id === 'efficiency' && thermalEfficiency < 70 }">
            {{ result.value }}
          </span>
        </div>
      </div>
    </div>

    <!-- Advanced Settings -->
    <details class="advanced-section">
      <summary>
        <span class="material-icons">tune</span>
        {{ t('Advanced Settings (Heat Transfer Coefficients)') }}
      </summary>
      <div class="advanced-grid">
        <UnitInput
          v-model:model-value="hInside"
          v-model:unit="hInsideUnit"
          :label="t('Inside h (forced convection)')"
          symbol="h_i"
          :units="heatTransferUnits"
          :min="1"
          :max="200"
          :step="1"
        />
        <UnitInput
          v-model:model-value="hOutside"
          v-model:unit="hOutsideUnit"
          :label="isHOutsideCustom ? t('Outside h (exterior)') + ' (custom)' : t('Outside h (exterior)')"
          symbol="h_o"
          :units="heatTransferUnits"
          :min="1"
          :max="100"
          :step="0.1"
        />
      </div>
    </details>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/styles/mixins" as *;

.hvac-duct-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Selectors Row */
.selectors-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;

  @include tablet {
    grid-template-columns: 1fr 1fr;
  }

  @include phone {
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

.density-hint {
  font-size: 0.75rem;
  color: var(--neutral);
  margin-top: 0.125rem;
  opacity: 0.8;
}

/* Calculator Body */
.calculator-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @include tablet {
    grid-template-columns: 1fr;
  }
}

.visual-section {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Input Groups */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;

  .material-icons {
    font-size: 1rem;
    color: var(--accent-500);
  }
}

.inputs-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Airflow Toggle */
.airflow-toggle {
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
}

.toggle-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  background: transparent;
  color: var(--neutral);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgb(var(--accent-500-rgb) / 5%);
  }

  &.active {
    background: rgb(var(--accent-500-rgb) / 15%);
    border-color: var(--accent-500);
    color: var(--accent-500);
  }
}

/* R-value Display */
.r-value-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--neutral);
  padding: 0.5rem 0.75rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-radius: 0.5rem;

  .material-icons {
    font-size: 1rem;
    color: var(--accent-500);
  }
}

/* Result Section */
.result-section {
  position: relative;
  z-index: 20;
}

/* Additional Results */
.additional-results {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @include tablet {
    grid-template-columns: 1fr;
  }
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
}

.result-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.5rem;

  .material-icons {
    font-size: 1.25rem;
    color: var(--accent-500);
  }
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.result-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--neutral);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);

  &.warning {
    color: var(--warning, #f59e0b);
  }
}

/* Advanced Section */
.advanced-section {
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;

  summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--neutral);

    .material-icons {
      font-size: 1rem;
    }

    &:hover {
      color: var(--text);
    }
  }
}

.advanced-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;

  @include tablet {
    grid-template-columns: 1fr;
  }
}

/* Custom value indicator */
.custom {
  color: var(--accent-500) !important;
}

.custom-tag {
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--accent-500);
  margin-left: 0.25rem;
}
</style>
