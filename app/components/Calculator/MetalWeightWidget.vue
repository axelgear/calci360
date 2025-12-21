<script setup lang="ts">
import type { MetalWeightCalculatorConfig } from './calculators/metal-weight/types'
import { metalProfiles, profileCategories, materialGroups, type ProfileDefinition } from './calculators/metal-weight/types'
import UnitInput from './UnitInput.vue'
import FormulaCard from './FormulaCard.vue'
import ResultCard from './ResultCard.vue'
import ConversionsCard from './ConversionsCard.vue'
import Dropdown from '~/components/Dropdown.vue'
import ShapeVisual from '~/components/Calculator/shapes/ShapeVisual.vue'
import { useMetalWeightCalculator } from '@/composables/useMetalWeightCalculator'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = defineProps<{
  config: MetalWeightCalculatorConfig
}>()

/* Use the composable for all calculation logic */
const {
  selectedProfileId,
  selectedProfile,
  selectedMaterialId,
  selectedMaterial,
  customDensity,
  densityUnitId,
  effectiveDensity,
  isDensityCustom,
  unitLength,
  unitLengthUnit,
  quantity,
  inputValues,
  inputUnits,
  selectedOutputUnit,
  currentOutputUnit,
  formattedWeight,
  formattedVolume,
  formattedCrossSection,
  allConversions,
  purchaseCalc,
  lengthUnits,
  massUnits,
  densityUnits,
  onInputValueChange,
  onInputUnitChange,
  copied,
  copiedId,
  copyResult,
  copyConversion,
  calculatedWeight,
} = useMetalWeightCalculator(toRef(props, 'config'))

/* Profile options grouped by category */
const profileOptions = computed(() => {
  return profileCategories.map(cat => ({
    label: cat.name,
    options: metalProfiles
      .filter(p => p.category === cat.id)
      .map(p => ({
        value: p.id,
        label: t(p.name),
        icon: p.icon,
      })),
  }))
})

/* Flat profile options for dropdown */
const flatProfileOptions = computed(() => {
  return metalProfiles.map(p => ({
    value: p.id,
    label: t(p.name),
    sublabel: profileCategories.find(c => c.id === p.category)?.name,
  }))
})

/* Material options grouped by category */
const materialOptions = computed(() => {
  return materialGroups.map(group => ({
    label: group.name,
    options: group.materials.map(m => ({
      value: m.id,
      label: m.name,
      sublabel: `${m.density.toLocaleString()} kg/m³`,
    })),
  }))
})

/* Flat material options for dropdown */
const flatMaterialOptions = computed(() => {
  const options: { value: string; label: string; sublabel: string }[] = []
  materialGroups.forEach(group => {
    group.materials.forEach(m => {
      options.push({
        value: m.id,
        label: m.name,
        sublabel: `${m.density.toLocaleString()} kg/m³`,
      })
    })
  })
  return options
})

/* Get material density display */
const materialDensityDisplay = computed(() => {
  if (!selectedMaterial.value) return ''
  return `${selectedMaterial.value.density.toLocaleString()} kg/m³`
})

/* Check if selected profile is a sheet (no unit length needed) */
const isSheetProfile = computed(() => {
  return selectedProfile.value?.category === 'sheet'
})

/* Get unit object by id */
function getLengthUnit(unitId: string) {
  return lengthUnits.find(u => u.id === unitId)
}

/* Format length for display */
function formatLength(meters: number, toUnitId: string): string {
  const unit = getLengthUnit(toUnitId)
  if (!unit) return `${meters.toFixed(3)} m`
  const converted = meters / unit.toBase
  return `${converted.toLocaleString('en-US', { maximumFractionDigits: 3 })} ${unit.symbol}`
}

/* Format weight for display */
function formatWeight(kg: number): string {
  const unit = massUnits.find(u => u.id === selectedOutputUnit.value)
  if (!unit) return `${kg.toFixed(3)} kg`
  const converted = kg / unit.toBase
  return `${converted.toLocaleString('en-US', { maximumFractionDigits: 3 })} ${unit.symbol}`
}
</script>

<template>
  <div class="metal-weight-widget">
    <!-- Selectors Row -->
    <div class="selectors-row">
      <!-- Profile Selector -->
      <div class="selector-group">
        <label class="selector-label">
          <span class="material-icons">category</span>
          {{ t('Profile Shape') }}
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
        <span class="density-hint">{{ materialDensityDisplay }}</span>
      </div>
    </div>

    <div class="calculator-body">
      <!-- Visual Preview -->
      <div class="visual-section">
        <ShapeVisual
          v-if="selectedProfile"
          mode="profile"
          :shape-id="selectedProfileId"
          :values="inputValues"
          :input-units="inputUnits"
          :length-units="lengthUnits"
          :material="selectedMaterial?.name ?? 'Steel'"
          :result="calculatedWeight"
          :result-unit="currentOutputUnit.symbol"
        />
      </div>

      <!-- Inputs & Result -->
      <div class="input-section">
        <!-- Dynamic Dimension Inputs -->
        <div v-if="selectedProfile" class="inputs-grid">
          <UnitInput
            v-for="input in selectedProfile.inputs"
            :key="input.id"
            :model-value="inputValues[input.id] ?? input.default ?? 1"
            :unit="inputUnits[input.id] ?? 'meter'"
            :label="t(input.label)"
            :symbol="input.symbol"
            :units="lengthUnits"
            :min="input.min ?? 0.001"
            :max="input.max"
            :step="input.step ?? 0.001"
            :help-text="input.helpText ? t(input.helpText) : undefined"
            @update:model-value="onInputValueChange(input.id, $event)"
            @update:unit="onInputUnitChange(input.id, $event)"
          />

          <!-- Density Input -->
          <UnitInput
            v-model:model-value="customDensity"
            v-model:unit="densityUnitId"
            :label="t('Density')"
            symbol="ρ"
            :units="densityUnits"
            :min="0.01"
            :step="0.1"
          />

          <!-- Unit Length (Purchasable Length) - Only for bars, tubes, structural -->
          <UnitInput
            v-if="!isSheetProfile"
            v-model:model-value="unitLength"
            v-model:unit="unitLengthUnit"
            :label="t('Purchasable Unit Length')"
            symbol="Lᵤ"
            :units="lengthUnits"
            :min="0.01"
            :step="0.1"
          />

          <!-- Quantity Input -->
          <div class="quantity-input">
            <label class="qty-label">{{ t('Quantity') }}</label>
            <div class="qty-control">
              <button class="qty-btn" @click="quantity = Math.max(1, quantity - 1)">
                <span class="material-icons">remove</span>
              </button>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                step="1"
                class="qty-value"
              >
              <button class="qty-btn" @click="quantity++">
                <span class="material-icons">add</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Formula Display -->
        <FormulaCard
          v-if="selectedProfile"
          :formula="selectedProfile.formulaDisplay"
          :explanation="selectedProfile.formulaExplanation"
        />

        <!-- Additional Info -->
        <div v-if="selectedProfile" class="info-row">
          <div class="info-item">
            <span class="info-label">{{ t('Volume') }}</span>
            <span class="info-value">{{ formattedVolume }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('Cross Section') }}</span>
            <span class="info-value">{{ formattedCrossSection }}</span>
          </div>
        </div>

        <!-- Result -->
        <div class="result-section">
          <ResultCard
            :label="config.resultLabel"
            :value="formattedWeight"
            icon="scale"
            :units="massUnits"
            :selected-unit="selectedOutputUnit"
            :copied="copied"
            @update:selected-unit="selectedOutputUnit = $event"
            @copy="copyResult"
          />
        </div>
      </div>
    </div>

    <!-- Purchase Summary - Only for profiles with unit length (not sheets) -->
    <div v-if="!isSheetProfile && purchaseCalc.unitsNeeded > 0" class="purchase-summary">
      <h3 class="purchase-title">
        <span class="material-icons">shopping_cart</span>
        {{ t('Purchase Summary') }}
      </h3>
      <div class="purchase-grid">
        <div class="purchase-item primary">
          <span class="purchase-label">{{ t('Units to Purchase') }}</span>
          <span class="purchase-value">{{ purchaseCalc.unitsNeeded }}</span>
          <span class="purchase-detail">× {{ unitLength }} {{ getLengthUnit(unitLengthUnit)?.symbol }}</span>
        </div>
        <div class="purchase-item">
          <span class="purchase-label">{{ t('Total Purchase Length') }}</span>
          <span class="purchase-value">{{ formatLength(purchaseCalc.totalPurchaseLength, unitLengthUnit) }}</span>
        </div>
        <div class="purchase-item">
          <span class="purchase-label">{{ t('Total Purchase Weight') }}</span>
          <span class="purchase-value">{{ formatWeight(purchaseCalc.totalPurchaseWeight) }}</span>
        </div>
        <div class="purchase-item surplus" :class="{ 'has-surplus': purchaseCalc.surplusLength > 0 }">
          <span class="purchase-label">{{ t('Surplus Length') }}</span>
          <span class="purchase-value">{{ formatLength(purchaseCalc.surplusLength, unitLengthUnit) }}</span>
        </div>
        <div class="purchase-item surplus" :class="{ 'has-surplus': purchaseCalc.surplusWeight > 0 }">
          <span class="purchase-label">{{ t('Surplus Weight') }}</span>
          <span class="purchase-value">{{ formatWeight(purchaseCalc.surplusWeight) }}</span>
        </div>
      </div>
    </div>

    <!-- All Conversions Table -->
    <ConversionsCard
      title="All Weight Conversions"
      :conversions="allConversions"
      :selected-unit="selectedOutputUnit"
      :copied-id="copiedId"
      @copy="copyConversion"
    />
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/styles/mixins" as *;

.metal-weight-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Selectors Row */
.selectors-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;

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
.inputs-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Quantity Input */
.quantity-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.qty-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.5rem;
  padding: 0.25rem;
  width: fit-content;
}

.qty-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgb(var(--accent-500-rgb) / 10%);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  .material-icons {
    font-size: 1rem;
    color: var(--accent-500);
  }

  &:hover {
    background: rgb(var(--accent-500-rgb) / 20%);
  }

  &:active {
    transform: scale(0.95);
  }
}

.qty-value {
  width: 4rem;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  background: transparent;
  border: none;
  outline: none;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
  appearance: textfield;
}

/* Info Row */
.info-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-radius: 0.5rem;
  flex: 1;
  min-width: 120px;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--neutral);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
}

/* Result Section */
.result-section {
  position: relative;
  z-index: 20;
}

/* Purchase Summary */
.purchase-summary {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 1rem;
  padding: 1.25rem;
}

.purchase-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 1rem;

  .material-icons {
    font-size: 1.25rem;
    color: var(--accent-500);
  }
}

.purchase-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
}

.purchase-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-radius: 0.5rem;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &.primary {
    background: rgb(var(--accent-500-rgb) / 15%);
    border-color: rgb(var(--accent-500-rgb) / 30%);

    .purchase-value {
      color: var(--accent-500);
      font-size: 1.5rem;
    }
  }

  &.surplus.has-surplus {
    background: rgb(var(--warning-rgb, 245 158 11) / 10%);
    border-color: rgb(var(--warning-rgb, 245 158 11) / 20%);

    .purchase-value {
      color: var(--warning, #f59e0b);
    }
  }
}

.purchase-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--neutral);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.purchase-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
}

.purchase-detail {
  font-size: 0.8rem;
  color: var(--neutral);
}
</style>

