<script setup lang="ts">
import type { GeometryCalculatorConfig } from './calculators/geometry/types'
import ShapeVisual from './shapes/ShapeVisual.vue'
import ShapeSelector from './ShapeSelector.vue'
import UnitInput from './UnitInput.vue'
import FormulaCard from './FormulaCard.vue'
import ResultCard from './ResultCard.vue'
import ConversionsCard from './ConversionsCard.vue'
import { useGeometryCalculator, type CalculatorMode } from '@/composables/useGeometryCalculator'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = defineProps<{
  config: GeometryCalculatorConfig
  mode: CalculatorMode
}>()

/* Use the composable for all calculation logic */
const {
  selectedShapeId,
  selectedShape,
  inputValues,
  inputUnits,
  selectedOutputUnit,
  currentOutputUnit,
  selectedAreaUnit,
  currentAreaUnit,
  formattedResult,
  additionalResults,
  allConversions,
  lengthUnits,
  outputUnits,
  areaUnits,
  onInputValueChange,
  onInputUnitChange,
  copied,
  copiedArea,
  copiedId,
  copyResult,
  copyAdditional,
  copyConversion,
  calculatedResult,
} = useGeometryCalculator(toRef(props, 'config'), props.mode)

/* Conversion table title */
const conversionsTitle = computed(() => 
  props.mode === 'area' ? 'All Area Conversions' : 'All Volume Conversions'
)

/* Check if we have surface area result */
const surfaceAreaResult = computed(() => 
  additionalResults.value.find(r => r.id === 'surface-area')
)
</script>

<template>
  <div class="geometry-widget">
    <!-- Shape Selector -->
    <ShapeSelector
      v-model="selectedShapeId"
      :shapes="config.shapes"
      label="Select Shape"
    />

    <div class="calculator-body">
      <!-- Visual Preview -->
      <div class="visual-section">
        <ShapeVisual
          v-if="selectedShape"
          :mode="mode"
          :shape-id="selectedShapeId"
          :values="inputValues"
          :input-units="inputUnits"
          :length-units="lengthUnits"
          :result="calculatedResult"
          :result-unit="currentOutputUnit.symbol"
        />
      </div>

      <!-- Inputs & Result -->
      <div class="input-section">
        <!-- Dynamic Inputs with Unit Selectors -->
        <div v-if="selectedShape" class="inputs-grid">
          <UnitInput
            v-for="input in selectedShape.inputs"
            :key="input.id"
            :model-value="inputValues[input.id] ?? input.default ?? 1"
            :unit="inputUnits[input.id] ?? 'meter'"
            :label="input.label"
            :symbol="input.symbol"
            :units="lengthUnits"
            :min="input.min ?? 0.1"
            :max="input.max"
            :step="input.step ?? 0.1"
            @update:model-value="onInputValueChange(input.id, $event)"
            @update:unit="onInputUnitChange(input.id, $event)"
          />
        </div>

        <!-- Formula Display -->
        <FormulaCard
          v-if="selectedShape"
          :formula="selectedShape.formula"
          :explanation="selectedShape.formulaExplanation"
        />

        <!-- Result with Output Unit Selector -->
        <div class="result-section">
          <ResultCard
            :label="config.resultLabel"
            :value="formattedResult"
            icon="calculate"
            :units="outputUnits"
            :selected-unit="selectedOutputUnit"
            :copied="copied"
            @update:selected-unit="selectedOutputUnit = $event"
            @copy="copyResult"
          />

          <!-- Surface Area card (for volume mode) -->
          <ResultCard
            v-if="surfaceAreaResult"
            :label="surfaceAreaResult.label"
            :value="surfaceAreaResult.formatted"
            icon="grid_on"
            :units="areaUnits"
            :selected-unit="selectedAreaUnit"
            :copied="copiedArea"
            @update:selected-unit="selectedAreaUnit = $event"
            @copy="copyAdditional('surface-area')"
          />
        </div>
      </div>
    </div>

    <!-- All Conversions Table -->
    <ConversionsCard
      :title="conversionsTitle"
      :conversions="allConversions"
      :selected-unit="selectedOutputUnit"
      :copied-id="copiedId"
      @copy="copyConversion"
    />
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/styles/mixins" as *;

.geometry-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
.inputs-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Result Section */
.result-section {
  position: relative;
  z-index: 20;
}
</style>

