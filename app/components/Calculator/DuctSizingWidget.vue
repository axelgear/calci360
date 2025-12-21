<script setup lang="ts">
/**
 * DuctSizingWidget - Visual HVAC Duct System Designer
 * Supports tree-based duct network with branches, fittings, and calculations
 */
import useDuctSizingCalculator from '~/composables/useDuctSizingCalculator'
import { paToInWg, m3sToCfm, cfmToM3s } from '~/components/Calculator/calculators/hvac/duct-sizing/calculations'
import { useUiTranslator } from '~/composables/useUiTranslator'
import Dropdown from '~/components/Dropdown.vue'
import DataTable from '~/components/DataTable.vue'
import type { TableColumn, TableRow } from '~/components/DataTable.vue'
import DuctFlowEditor from './DuctFlow/DuctFlowEditor.vue'
import { getComponent } from './DuctFlow/components'
import { insulationMaterials, type InsulationProperties } from './calculators/hvac/duct-sizing/types'

const { t } = useUiTranslator()

const {
  system,
  results,
  selectedNodeId,
  selectedSegmentId,
  selectedNode,
  selectedSegment,
  airCondition,
  totalCFM,
  criticalPathPressure,
  airConditions,
  allFittings,
  getFittingsByCategory,
  addNode,
  updateNode,
  removeNode,
  addSegment,
  updateSegment,
  removeSegment,
  addFitting,
  removeFitting,
  updateFittingQuantity,
  updateSystemSettings,
  recalculate,
  resetSystem,
  cleanupInvalidSegments,
  addBranch,
  addJunction,
  selectNode,
  selectSegment,
  clearSelection,
} = useDuctSizingCalculator()

/* ========== LOCAL STATE ========== */

const activeTab = ref<'design' | 'settings' | 'results'>('design')
const showAddNodeModal = ref(false)
const showAddSegmentModal = ref(false)
const showAddFittingModal = ref(false)

/* New node form */
const newNode = reactive({
  type: 'diffuser' as 'diffuser' | 'junction',
  name: '',
  cfm: 100,
  x: 200,
  y: 200,
})

/* New segment form */
const newSegment = reactive({
  fromNodeId: '',
  toNodeId: '',
  length: 3,
})

/* ========== METHODS ========== */

function handleAddNode() {
  if (!newNode.name) return
  
  addNode(
    newNode.type,
    newNode.name,
    { x: newNode.x, y: newNode.y },
    newNode.type === 'diffuser' ? newNode.cfm : undefined
  )
  
  showAddNodeModal.value = false
  newNode.name = ''
  newNode.cfm = 100
}

function handleAddSegment() {
  if (!newSegment.fromNodeId || !newSegment.toNodeId || newSegment.fromNodeId === newSegment.toNodeId) return
  
  addSegment(newSegment.fromNodeId, newSegment.toNodeId, newSegment.length)
  
  showAddSegmentModal.value = false
  newSegment.fromNodeId = ''
  newSegment.toNodeId = ''
  newSegment.length = 3
}

function handleAddFitting(fittingId: string) {
  if (selectedSegmentId.value) {
    addFitting(selectedSegmentId.value, fittingId)
  }
}

function formatPressure(pa: number): string {
  if (system.value.units === 'imperial') {
    return `${paToInWg(pa).toFixed(3)} in.wg`
  }
  return `${pa.toFixed(1)} Pa`
}

function formatVelocity(ms: number): string {
  if (system.value.units === 'imperial') {
    return `${(ms * 196.85).toFixed(0)} fpm`
  }
  return `${ms.toFixed(1)} m/s`
}

function formatDuctSize(duct: { shape: string; diameter?: number; width?: number; height?: number }): string {
  if (duct.shape === 'round') {
    const d = duct.diameter ?? 0
    if (system.value.units === 'imperial') {
      return `⌀${(d / 25.4).toFixed(0)}"`
    }
    return `⌀${d}mm`
  }
  const w = duct.width ?? 0
  const h = duct.height ?? 0
  if (system.value.units === 'imperial') {
    return `${(w / 25.4).toFixed(0)}" × ${(h / 25.4).toFixed(0)}"`
  }
  return `${w} × ${h}mm`
}

/* Get fitting name by ID */
function getFittingName(fittingId: string): string {
  const fitting = allFittings.find(f => f.id === fittingId)
  return fitting?.name ?? fittingId
}

/* Get node name by ID */
function getNodeName(nodeId: string): string {
  const node = system.value.nodes.find(n => n.id === nodeId)
  return node?.name ?? nodeId
}

/* ========== FLOW EDITOR HANDLERS ========== */

let nodeCounter = ref(1)

function handleFlowAddNode(componentId: string, position: { x: number; y: number }, ductShape: string) {
  const comp = getComponent(componentId)
  if (!comp) return
  
  /* Map component type to node type */
  let nodeType: 'ahu' | 'junction' | 'diffuser' = 'diffuser'
  if (comp.nodeType === 'source') nodeType = 'ahu'
  else if (comp.nodeType === 'junction') nodeType = 'junction'
  else if (comp.nodeType === 'terminal') nodeType = 'diffuser'
  else nodeType = 'junction' /* Default fittings/accessories to junction */
  
  const name = `${comp.name} ${nodeCounter.value}`
  nodeCounter.value++
  
  addNode(nodeType, name, position, comp.hasCfm ? 100 : undefined, componentId)
}

/* Track selected duct shape */
const selectedDuctShape = ref('rectangular')

/* Handle cleanup button - removes invalid connections */
function handleCleanup() {
  const removed = cleanupInvalidSegments()
  if (removed > 0) {
    console.log(`Removed ${removed} invalid connection(s)`)
  }
}

/* ========== SHARE FUNCTIONALITY ========== */
const showShareModal = ref(false)
const shareUrl = ref('')

/* Encode system state to base64 for URL sharing */
function encodeSystemState(): string {
  const state = {
    nodes: system.value.nodes,
    segments: system.value.segments,
    designMethod: system.value.designMethod,
    targetFriction: system.value.targetFriction,
    targetVelocity: system.value.targetVelocity,
    maxVelocity: system.value.maxVelocity,
    supplyAirTemp: system.value.supplyAirTemp,
    ambientTemp: system.value.ambientTemp,
  }
  const json = JSON.stringify(state)
  return btoa(encodeURIComponent(json))
}

/* Decode system state from base64 */
function decodeSystemState(encoded: string): void {
  try {
    const json = decodeURIComponent(atob(encoded))
    const state = JSON.parse(json)
    
    if (state.nodes) system.value.nodes = state.nodes
    if (state.segments) system.value.segments = state.segments
    if (state.designMethod) system.value.designMethod = state.designMethod
    if (state.targetFriction) system.value.targetFriction = state.targetFriction
    if (state.targetVelocity) system.value.targetVelocity = state.targetVelocity
    if (state.maxVelocity) system.value.maxVelocity = state.maxVelocity
    if (state.supplyAirTemp) system.value.supplyAirTemp = state.supplyAirTemp
    if (state.ambientTemp) system.value.ambientTemp = state.ambientTemp
    
    recalculate()
  } catch (e) {
    console.error('Failed to decode system state:', e)
  }
}

/* Generate shareable URL */
function handleShare() {
  const encoded = encodeSystemState()
  const url = new URL(window.location.href)
  url.searchParams.set('state', encoded)
  shareUrl.value = url.toString()
  showShareModal.value = true
}

/* Copy share URL to clipboard */
async function copyShareUrl() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    /* Show brief success feedback */
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}

/* SSR-safe route access */
const route = useRoute()

/* Load state from URL on mount - client-side only */
onMounted(() => {
  /* Use Nuxt's route which is SSR-safe */
  const stateParam = route.query.state as string | undefined
  if (stateParam) {
    /* Use nextTick to ensure Vue Flow is fully initialized */
    nextTick(() => {
      decodeSystemState(stateParam)
    })
  }
})

function handleFlowUpdatePosition(nodeId: string, position: { x: number; y: number }) {
  updateNode(nodeId, { position })
}

function handleFlowConnect(fromNodeId: string, toNodeId: string, sourceHandle?: string | null, targetHandle?: string | null) {
  addSegment(fromNodeId, toNodeId, 3, [], false, sourceHandle, targetHandle) /* Default 3m length */
}

function handleFlowRemoveEdge(segmentId: string) {
  removeSegment(segmentId)
}

function handleUpdateSegmentLength(segmentId: string, length: number) {
  updateSegment(segmentId, { length })
}

/* ========== DROPDOWN OPTIONS ========== */

const designMethodOptions = computed(() => [
  { value: 'equal-friction', label: t('Equal Friction Method') },
  { value: 'velocity-reduction', label: t('Velocity Reduction Method') },
  { value: 'static-regain', label: t('Static Regain Method') },
])

const selectedDesignMethod = computed({
  get: () => system.value.designMethod,
  set: (val) => updateSystemSettings({ designMethod: val as any }),
})

const airConditionOptions = computed(() => 
  airConditions.map(ac => ({
    value: ac.id,
    label: ac.name,
    sublabel: `ρ=${ac.density.toFixed(3)} kg/m³`,
  }))
)

const selectedAirCondition = computed({
  get: () => system.value.airCondition,
  set: (val) => updateSystemSettings({ airCondition: val }),
})

const unitOptions = computed(() => [
  { value: 'metric', label: t('Metric'), sublabel: 'm, Pa, m/s' },
  { value: 'imperial', label: t('Imperial'), sublabel: 'ft, in.wg, fpm' },
])

const selectedUnits = computed({
  get: () => system.value.units,
  set: (val) => updateSystemSettings({ units: val as any }),
})

const nodeTypeOptions = computed(() => [
  { value: 'diffuser', label: t('Diffuser'), icon: 'grid_4x4' },
  { value: 'junction', label: t('Junction'), icon: 'call_split' },
])

/* Insulation material options */
const insulationMaterialOptions = computed(() =>
  insulationMaterials.map(m => ({
    value: m.id,
    label: t(m.name),
    sublabel: `k = ${m.kValue} W/m·K`,
  }))
)

/* Calculate R-Value from insulation properties */
function calculateRValue(insulation: InsulationProperties): number {
  /* R = thickness / k-value */
  const thicknessInMeters = insulation.thickness / 1000
  return thicknessInMeters / insulation.kValue
}

/* Handle insulation toggle */
function handleInsulationToggle(checked: boolean) {
  if (!selectedSegment.value) return
  
  if (checked) {
    /* Set default insulation properties */
    const defaultMaterial = insulationMaterials[0]
    updateSegment(selectedSegment.value.id, {
      insulated: true,
      insulation: {
        material: defaultMaterial.id,
        thickness: 25,
        kValue: defaultMaterial.kValue,
      }
    })
  } else {
    updateSegment(selectedSegment.value.id, {
      insulated: false,
      insulation: undefined,
    })
  }
}

/* Handle insulation material change */
function handleInsulationMaterialChange(materialId: string) {
  if (!selectedSegment.value) return
  
  const material = insulationMaterials.find(m => m.id === materialId)
  if (!material) return
  
  const currentInsulation = selectedSegment.value.insulation || { thickness: 25 }
  
  updateSegment(selectedSegment.value.id, {
    insulation: {
      material: materialId,
      thickness: currentInsulation.thickness,
      kValue: materialId === 'custom' 
        ? (currentInsulation as InsulationProperties).kValue || 0.04 
        : material.kValue,
    }
  })
}

/* Handle insulation thickness change */
function handleInsulationThicknessChange(thickness: number) {
  if (!selectedSegment.value || !selectedSegment.value.insulation) return
  
  updateSegment(selectedSegment.value.id, {
    insulation: {
      ...selectedSegment.value.insulation,
      thickness,
    }
  })
}

/* Handle insulation k-value change */
function handleInsulationKValueChange(kValue: number) {
  if (!selectedSegment.value || !selectedSegment.value.insulation) return
  
  updateSegment(selectedSegment.value.id, {
    insulation: {
      ...selectedSegment.value.insulation,
      kValue,
    }
  })
}

const fromNodeOptions = computed(() => 
  system.value.nodes.map(n => ({
    value: n.id,
    label: n.name,
    sublabel: n.type === 'diffuser' ? `${n.cfm} CFM` : n.type,
  }))
)

const toNodeOptions = computed(() => 
  system.value.nodes
    .filter(n => n.id !== newSegment.fromNodeId)
    .map(n => ({
      value: n.id,
      label: n.name,
      sublabel: n.type === 'diffuser' ? `${n.cfm} CFM` : n.type,
    }))
)

/* ========== TABLE DATA ========== */

const bomColumns = computed<TableColumn[]>(() => [
  { key: 'description', label: t('Description') },
  { key: 'size', label: t('Size'), mono: true },
  { key: 'quantity', label: t('Qty'), align: 'right', mono: true },
  { key: 'unit', label: t('Unit') },
])

const bomRows = computed<TableRow[]>(() => 
  results.value?.bom?.map(item => ({
    description: item.description,
    size: item.size,
    quantity: item.quantity,
    unit: item.unit,
  })) ?? []
)

const segmentColumns = computed<TableColumn[]>(() => [
  { key: 'route', label: t('Route') },
  { key: 'cfm', label: 'CFM', align: 'right', mono: true },
  { key: 'size', label: t('Size'), mono: true },
  { key: 'length', label: t('Length'), align: 'right', mono: true },
  { key: 'fittings', label: t('Fittings'), align: 'right', mono: true },
  { key: 'velocity', label: t('Velocity'), align: 'right', mono: true },
  { key: 'pressure', label: 'ΔP', align: 'right', mono: true },
])

const segmentRows = computed<TableRow[]>(() => 
  system.value.segments.map(seg => {
    /* Count total fittings */
    const fittingCount = seg.fittings.reduce((sum, f) => sum + f.quantity, 0)
    return {
      route: `${getNodeName(seg.fromNodeId)} → ${getNodeName(seg.toNodeId)}`,
      cfm: seg.calculated?.cfm ?? '—',
      size: seg.calculated ? formatDuctSize(seg.calculated.ductSize) : '—',
      length: `${seg.length}m`,
      fittings: fittingCount > 0 ? fittingCount : '—',
      velocity: seg.calculated ? formatVelocity(seg.calculated.velocity) : '—',
      pressure: seg.calculated ? formatPressure(seg.calculated.totalPressureDrop) : '—',
    }
  })
)

</script>

<template>
  <div class="duct-sizing-widget">
    <!-- Development Warning Banner -->
    <div class="dev-warning-banner">
      <span class="material-icons">construction</span>
      <div class="warning-content">
        <strong>{{ t('Under Development') }}</strong>
        <span>{{ t('This module is currently in beta. Some features may not work as expected.') }}</span>
      </div>
      <span class="material-icons beta-badge">science</span>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <div class="tabs">
        <button 
          :class="['tab', { active: activeTab === 'design' }]"
          @click="activeTab = 'design'"
        >
          <span class="material-icons">edit</span>
          {{ t('Design') }}
        </button>
        <button 
          :class="['tab', { active: activeTab === 'settings' }]"
          @click="activeTab = 'settings'"
        >
          <span class="material-icons">settings</span>
          {{ t('Settings') }}
        </button>
        <button 
          :class="['tab', { active: activeTab === 'results' }]"
          @click="activeTab = 'results'"
        >
          <span class="material-icons">analytics</span>
          {{ t('Results') }}
        </button>
      </div>
    </div>

    <!-- Design Tab -->
    <div v-if="activeTab === 'design'" class="tab-content design-tab">
      <!-- Toolbar -->
      <div class="toolbar">
        <button class="tool-btn" @click="showAddNodeModal = true">
          <span class="material-icons">add_circle</span>
          {{ t('Add Node') }}
        </button>
        <button class="tool-btn" @click="showAddSegmentModal = true" :disabled="system.nodes.length < 2">
          <span class="material-icons">timeline</span>
          {{ t('Add Duct') }}
        </button>
        <button class="tool-btn" @click="handleCleanup" title="Remove invalid connections">
          <span class="material-icons">build</span>
          {{ t('Fix') }}
        </button>
        <button class="tool-btn accent" @click="handleShare" :title="t('Share Layout')">
          <span class="material-icons">share</span>
          {{ t('Share') }}
        </button>
        <button class="tool-btn danger" @click="resetSystem">
          <span class="material-icons">restart_alt</span>
          {{ t('Reset') }}
        </button>
      </div>

      <!-- Vue Flow Visual Editor - Client Only (requires browser APIs) -->
      <ClientOnly>
        <DuctFlowEditor
          :nodes="system.nodes"
          :segments="system.segments"
          :selected-node-id="selectedNodeId"
          :selected-segment-id="selectedSegmentId"
          :warnings="results?.warnings"
          :max-velocity="system.maxVelocity"
          v-model:duct-shape="selectedDuctShape"
          @select-node="selectNode"
          @select-segment="selectSegment"
          @add-node="handleFlowAddNode"
          @update-node-position="handleFlowUpdatePosition"
          @connect="handleFlowConnect"
          @remove-edge="handleFlowRemoveEdge"
          @update-segment-length="handleUpdateSegmentLength"
        />
        <template #fallback>
          <div class="flow-loading">
            <span class="material-icons spinning">sync</span>
            {{ t('Loading editor...') }}
          </div>
        </template>
      </ClientOnly>

      <!-- Main content: Tree view + Properties -->
      <div class="design-content">
        <!-- Tree/List View of System -->
        <div class="system-tree">
          <h3>{{ t('System Structure') }}</h3>
          
          <!-- Nodes -->
          <div class="tree-section">
            <h4>{{ t('Nodes') }} ({{ system.nodes.length }})</h4>
            <div 
              v-for="node in system.nodes" 
              :key="node.id"
              :class="['tree-item', { selected: selectedNodeId === node.id }]"
              @click="selectNode(node.id)"
            >
              <span class="material-icons">
                {{ node.type === 'ahu' ? 'hvac' : node.type === 'junction' ? 'call_split' : 'grid_4x4' }}
              </span>
              <span class="item-name">{{ node.name }}</span>
              <span v-if="node.cfm" class="item-cfm">{{ node.cfm }} CFM</span>
            </div>
          </div>

          <!-- Segments -->
          <div class="tree-section">
            <h4>{{ t('Duct Segments') }} ({{ system.segments.length }})</h4>
            <div 
              v-for="segment in system.segments" 
              :key="segment.id"
              :class="['tree-item', { selected: selectedSegmentId === segment.id }]"
              @click="selectSegment(segment.id)"
            >
              <span class="material-icons">straighten</span>
              <span class="item-name">
                {{ getNodeName(segment.fromNodeId) }} → {{ getNodeName(segment.toNodeId) }}
              </span>
              <span v-if="segment.calculated" class="item-cfm">
                {{ segment.calculated.cfm }} CFM
              </span>
            </div>
          </div>
        </div>

        <!-- Properties Panel -->
        <div class="properties-panel">
          <h3>{{ t('Properties') }}</h3>
          
          <!-- Node Properties -->
          <div v-if="selectedNode" class="property-section">
            <div class="section-header">
              <span class="material-icons">
                {{ selectedNode.type === 'ahu' ? 'hvac' : selectedNode.type === 'junction' ? 'call_split' : 'grid_4x4' }}
              </span>
              <span>{{ selectedNode.name }}</span>
            </div>
            
            <div class="property-row">
              <label>{{ t('Name') }}</label>
              <input 
                type="text" 
                :value="selectedNode.name"
                @input="updateNode(selectedNode.id, { name: ($event.target as HTMLInputElement).value })"
              />
            </div>
            
            <div v-if="selectedNode.type === 'diffuser'" class="property-row">
              <label>{{ t('CFM') }}</label>
              <input 
                type="number" 
                :value="selectedNode.cfm"
                @input="updateNode(selectedNode.id, { cfm: Number(($event.target as HTMLInputElement).value) })"
              />
            </div>
            
            <button 
              v-if="selectedNode.type !== 'ahu'"
              class="delete-btn"
              @click="removeNode(selectedNode.id)"
            >
              <span class="material-icons">delete</span>
              {{ t('Delete Node') }}
            </button>
          </div>

          <!-- Segment Properties -->
          <div v-else-if="selectedSegment" class="property-section">
            <div class="section-header">
              <span class="material-icons">straighten</span>
              <span>{{ getNodeName(selectedSegment.fromNodeId) }} → {{ getNodeName(selectedSegment.toNodeId) }}</span>
            </div>
            
            <div class="property-row">
              <label>{{ t('Length') }} (m)</label>
              <input 
                type="number" 
                :value="selectedSegment.length"
                step="0.5"
                @input="updateSegment(selectedSegment.id, { length: Number(($event.target as HTMLInputElement).value) })"
              />
            </div>
            
            <div class="property-row checkbox">
              <label>
                <input 
                  type="checkbox" 
                  :checked="selectedSegment.insulated"
                  @change="handleInsulationToggle(($event.target as HTMLInputElement).checked)"
                />
                {{ t('Insulated') }}
              </label>
            </div>
            
            <!-- Insulation Details (shown when insulated) -->
            <div v-if="selectedSegment.insulated" class="insulation-details">
              <h4>{{ t('Insulation Properties') }}</h4>
              
              <div class="property-row">
                <label>{{ t('Material') }}</label>
                <Dropdown
                  :model-value="selectedSegment.insulation?.material || 'fiberglass'"
                  :options="insulationMaterialOptions"
                  :full-width="true"
                  @update:model-value="handleInsulationMaterialChange"
                />
              </div>
              
              <div class="property-row">
                <label>{{ t('Thickness') }} (mm)</label>
                <input 
                  type="number" 
                  :value="selectedSegment.insulation?.thickness || 25"
                  min="10"
                  step="5"
                  @input="handleInsulationThicknessChange(Number(($event.target as HTMLInputElement).value))"
                />
              </div>
              
              <div class="property-row">
                <label>{{ t('K-Value') }} (W/m·K)</label>
                <input 
                  type="number" 
                  :value="selectedSegment.insulation?.kValue || 0.04"
                  min="0.01"
                  step="0.001"
                  @input="handleInsulationKValueChange(Number(($event.target as HTMLInputElement).value))"
                />
                <span class="input-hint">{{ t('Lower = better insulation') }}</span>
              </div>
              
              <div v-if="selectedSegment.insulation" class="insulation-summary">
                <span>R-Value: </span>
                <strong>{{ calculateRValue(selectedSegment.insulation).toFixed(2) }} m²·K/W</strong>
              </div>
            </div>
            
            <!-- Calculated values -->
            <div v-if="selectedSegment.calculated" class="calculated-values">
              <h4>{{ t('Calculated') }}</h4>
              <div class="calc-row">
                <span>{{ t('Size') }}:</span>
                <strong>{{ formatDuctSize(selectedSegment.calculated.ductSize) }}</strong>
              </div>
              <div class="calc-row">
                <span>{{ t('Velocity') }}:</span>
                <strong>{{ formatVelocity(selectedSegment.calculated.velocity) }}</strong>
              </div>
              <div class="calc-row">
                <span>{{ t('Friction') }}:</span>
                <strong>{{ selectedSegment.calculated.frictionLoss.toFixed(2) }} Pa/m</strong>
              </div>
              <div class="calc-row">
                <span>{{ t('Pressure Drop') }}:</span>
                <strong>{{ formatPressure(selectedSegment.calculated.totalPressureDrop) }}</strong>
              </div>
              <div class="calc-row">
                <span>{{ t('Temp Drop') }}:</span>
                <strong>{{ selectedSegment.calculated.tempDrop.toFixed(2) }}°C</strong>
              </div>
            </div>
            
            <!-- Fittings -->
            <div class="fittings-section">
              <h4>
                {{ t('Fittings') }}
                <button class="add-fitting-btn" @click="showAddFittingModal = true">
                  <span class="material-icons">add</span>
                </button>
              </h4>
              <div v-if="selectedSegment.fittings.length === 0" class="no-fittings">
                {{ t('No fittings - click + to add elbows, transitions, etc.') }}
              </div>
              <div 
                v-for="fitting in selectedSegment.fittings" 
                :key="fitting.fittingId"
                class="fitting-item"
              >
                <span class="fitting-name">{{ getFittingName(fitting.fittingId) }}</span>
                <div class="fitting-qty">
                  <button @click="updateFittingQuantity(selectedSegment.id, fitting.fittingId, fitting.quantity - 1)">−</button>
                  <span>{{ fitting.quantity }}</span>
                  <button @click="updateFittingQuantity(selectedSegment.id, fitting.fittingId, fitting.quantity + 1)">+</button>
                </div>
                <button class="remove-fitting" @click="removeFitting(selectedSegment.id, fitting.fittingId)">
                  <span class="material-icons">close</span>
                </button>
              </div>
            </div>
            
            <button class="delete-btn" @click="removeSegment(selectedSegment.id)">
              <span class="material-icons">delete</span>
              {{ t('Delete Segment') }}
            </button>
          </div>

          <!-- No selection -->
          <div v-else class="no-selection">
            <span class="material-icons">touch_app</span>
            <p>{{ t('Select a node or segment to edit') }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat">
          <span class="label">{{ t('Total CFM') }}</span>
          <span class="value">{{ totalCFM.toLocaleString() }}</span>
        </div>
        <div class="stat">
          <span class="label">{{ t('Critical Path Pressure') }}</span>
          <span class="value">{{ formatPressure(criticalPathPressure) }}</span>
        </div>
        <div class="stat">
          <span class="label">{{ t('Segments') }}</span>
          <span class="value">{{ system.segments.length }}</span>
        </div>
        <div class="stat">
          <span class="label">{{ t('Diffusers') }}</span>
          <span class="value">{{ system.nodes.filter(n => n.type === 'diffuser').length }}</span>
        </div>
      </div>
    </div>

    <!-- Settings Tab -->
    <div v-if="activeTab === 'settings'" class="tab-content settings-tab">
      <div class="settings-grid">
        <div class="setting-group">
          <h3>{{ t('Design Method') }}</h3>
          <Dropdown
            v-model="selectedDesignMethod"
            :options="designMethodOptions"
            :full-width="true"
          />
          
          <div v-if="system.designMethod === 'equal-friction'" class="sub-setting">
            <label>{{ t('Target Friction') }} (Pa/m)</label>
            <input 
              type="number" 
              :value="system.targetFriction"
              step="0.1"
              @input="updateSystemSettings({ targetFriction: Number(($event.target as HTMLInputElement).value) })"
            />
          </div>
          
          <div v-if="system.designMethod === 'velocity-reduction'" class="sub-setting">
            <label>{{ t('Target Velocity') }} (m/s)</label>
            <input 
              type="number" 
              :value="system.targetVelocity"
              step="0.5"
              @input="updateSystemSettings({ targetVelocity: Number(($event.target as HTMLInputElement).value) })"
            />
          </div>
        </div>

        <div class="setting-group">
          <h3>{{ t('Velocity Limits') }}</h3>
          <div class="sub-setting">
            <label>{{ t('Max Velocity') }} (m/s)</label>
            <input 
              type="number" 
              :value="system.maxVelocity"
              step="0.5"
              @input="updateSystemSettings({ maxVelocity: Number(($event.target as HTMLInputElement).value) })"
            />
          </div>
        </div>

        <div class="setting-group">
          <h3>{{ t('Temperatures') }}</h3>
          <div class="sub-setting">
            <label>{{ t('Supply Air') }} (°C)</label>
            <input 
              type="number" 
              :value="system.supplyAirTemp"
              @input="updateSystemSettings({ supplyAirTemp: Number(($event.target as HTMLInputElement).value) })"
            />
          </div>
          <div class="sub-setting">
            <label>{{ t('Ambient') }} (°C)</label>
            <input 
              type="number" 
              :value="system.ambientTemp"
              @input="updateSystemSettings({ ambientTemp: Number(($event.target as HTMLInputElement).value) })"
            />
          </div>
        </div>

        <div class="setting-group">
          <h3>{{ t('Air Properties') }}</h3>
          <Dropdown
            v-model="selectedAirCondition"
            :options="airConditionOptions"
            :full-width="true"
          />
          <div class="air-props">
            <div class="prop"><span>ρ:</span> {{ airCondition.density.toFixed(4) }} kg/m³</div>
            <div class="prop"><span>μ:</span> {{ airCondition.viscosity.toFixed(4) }} kg/(m·h)</div>
            <div class="prop"><span>Cp:</span> {{ airCondition.specificHeat.toFixed(4) }} kJ/(kg·°C)</div>
          </div>
        </div>

        <div class="setting-group">
          <h3>{{ t('Units') }}</h3>
          <Dropdown
            v-model="selectedUnits"
            :options="unitOptions"
            :full-width="true"
          />
        </div>
      </div>
    </div>

    <!-- Results Tab -->
    <div v-if="activeTab === 'results'" class="tab-content results-tab">
      <div v-if="results" class="results-content">
        <!-- Summary -->
        <div class="results-summary">
          <div class="summary-card">
            <span class="material-icons">air</span>
            <div class="card-content">
              <span class="label">{{ t('Total Airflow') }}</span>
              <span class="value">{{ results.totalCFM.toLocaleString() }} CFM</span>
            </div>
          </div>
          <div class="summary-card">
            <span class="material-icons">speed</span>
            <div class="card-content">
              <span class="label">{{ t('Critical Path Pressure') }}</span>
              <span class="value">{{ formatPressure(results.criticalPathPressure) }}</span>
            </div>
          </div>
        </div>

        <!-- Warnings -->
        <div v-if="results.warnings.length > 0" class="warnings-section">
          <h3><span class="material-icons">warning</span> {{ t('Warnings') }}</h3>
          <ul>
            <li v-for="(warning, i) in results.warnings" :key="i">{{ warning }}</li>
          </ul>
        </div>

        <!-- Bill of Materials -->
        <div class="bom-section">
          <h3><span class="material-icons">receipt_long</span> {{ t('Bill of Materials') }}</h3>
          <DataTable
            :columns="bomColumns"
            :rows="bomRows"
            :striped="true"
            :hoverable="true"
            :compact="true"
          />
        </div>

        <!-- Segment Details -->
        <div class="segments-detail">
          <h3><span class="material-icons">list</span> {{ t('Segment Details') }}</h3>
          <DataTable
            :columns="segmentColumns"
            :rows="segmentRows"
            :striped="true"
            :hoverable="true"
            :compact="true"
          />
        </div>
      </div>
      
      <div v-else class="no-results">
        <span class="material-icons">calculate</span>
        <p>{{ t('Add nodes and segments to see results') }}</p>
      </div>
    </div>

    <!-- Add Node Modal -->
    <Modal v-model:show="showAddNodeModal" :title="t('Add Node')" size="sm">
      <div class="form-row">
        <label>{{ t('Type') }}</label>
        <Dropdown
          v-model="newNode.type"
          :options="nodeTypeOptions"
          :full-width="true"
        />
      </div>
      <div class="form-row">
        <label>{{ t('Name') }}</label>
        <input v-model="newNode.name" type="text" :placeholder="t('e.g., Living Room')" />
      </div>
      <div v-if="newNode.type === 'diffuser'" class="form-row">
        <label>{{ t('CFM') }}</label>
        <input v-model.number="newNode.cfm" type="number" min="0" />
      </div>
      <template #footer>
        <button class="btn-cancel" @click="showAddNodeModal = false">{{ t('Cancel') }}</button>
        <button class="btn-primary" @click="handleAddNode">{{ t('Add') }}</button>
      </template>
    </Modal>

    <!-- Add Segment Modal -->
    <Modal v-model:show="showAddSegmentModal" :title="t('Add Duct Segment')" size="sm">
      <div class="form-row">
        <label>{{ t('From') }}</label>
        <Dropdown
          v-model="newSegment.fromNodeId"
          :options="fromNodeOptions"
          :placeholder="t('Select...')"
          :full-width="true"
        />
      </div>
      <div class="form-row">
        <label>{{ t('To') }}</label>
        <Dropdown
          v-model="newSegment.toNodeId"
          :options="toNodeOptions"
          :placeholder="t('Select...')"
          :full-width="true"
        />
      </div>
      <div class="form-row">
        <label>{{ t('Length') }} (m)</label>
        <input v-model.number="newSegment.length" type="number" min="0.1" step="0.5" />
      </div>
      <template #footer>
        <button class="btn-cancel" @click="showAddSegmentModal = false">{{ t('Cancel') }}</button>
        <button class="btn-primary" @click="handleAddSegment">{{ t('Add') }}</button>
      </template>
    </Modal>

    <!-- Add Fitting Modal -->
    <Modal v-model:show="showAddFittingModal" :title="t('Add Fitting')" size="lg">
      <div class="fitting-grid">
        <div 
          v-for="fitting in allFittings" 
          :key="fitting.id"
          class="fitting-option"
          @click="handleAddFitting(fitting.id); showAddFittingModal = false"
        >
          <span class="material-icons">{{ fitting.icon }}</span>
          <span class="fitting-name">{{ fitting.name }}</span>
        </div>
      </div>
      <template #footer>
        <button class="btn-cancel" @click="showAddFittingModal = false">{{ t('Cancel') }}</button>
      </template>
    </Modal>

    <!-- Share Modal -->
    <Modal v-model:show="showShareModal" :title="t('Share Layout')" size="md">
      <div class="share-content">
        <p class="share-description">
          {{ t('Copy this URL to share your duct layout. Anyone with the link can view and edit the layout.') }}
        </p>
        <div class="share-url-container">
          <input 
            type="text" 
            :value="shareUrl" 
            readonly 
            class="share-url-input"
            @focus="($event.target as HTMLInputElement).select()"
          />
          <button class="copy-btn" @click="copyShareUrl">
            <span class="material-icons">content_copy</span>
          </button>
        </div>
        <div class="share-note">
          <span class="material-icons">info</span>
          
        </div>
      </div>
      <template #footer>
        <button class="btn-cancel" @click="showShareModal = false">{{ t('Close') }}</button>
      </template>
    </Modal>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/styles/mixins" as *;

.duct-sizing-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Development Warning Banner */
.dev-warning-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, rgb(245 158 11 / 15%) 0%, rgb(251 191 36 / 10%) 100%);
  border: 1px solid rgb(245 158 11 / 30%);
  border-radius: 0.75rem;
  color: #fbbf24;

  > .material-icons {
    font-size: 24px;
    color: #f59e0b;
  }

  .warning-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;

    strong {
      font-size: 0.875rem;
      font-weight: 700;
      color: #fbbf24;
    }

    span {
      font-size: 0.8rem;
      color: rgb(251 191 36 / 80%);
    }
  }

  .beta-badge {
    font-size: 20px;
    padding: 0.375rem;
    background: rgb(245 158 11 / 20%);
    border-radius: 0.375rem;
    color: #f59e0b;
  }
}

.tabs-container {
  display: flex;
  justify-content: center;
}

.tabs {
  display: flex;
  gap: 0.25rem;
  background: rgb(var(--accent-500-rgb) / 10%);
  padding: 0.25rem;
  border-radius: 0.5rem;

  .tab {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    color: var(--neutral);
    border-radius: 0.35rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:hover {
      background: rgb(var(--accent-500-rgb) / 15%);
    }

    &.active {
      background: var(--accent-500);
      color: white;
    }

    .material-icons {
      font-size: 18px;
    }
  }
}

/* Design Tab */
.design-tab {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toolbar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  .tool-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 1rem;
    border: 1px solid rgb(var(--accent-500-rgb) / 30%);
    background: transparent;
    color: var(--text);
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: rgb(var(--accent-500-rgb) / 15%);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.danger {
      border-color: rgb(220 38 38 / 30%);
      color: rgb(220 38 38);

      &:hover {
        background: rgb(220 38 38 / 10%);
      }
    }

    &.accent {
      border-color: var(--accent-500);
      background: rgb(var(--accent-500-rgb) / 15%);
      color: var(--accent-500);

      &:hover {
        background: var(--accent-500);
        color: white;
      }
    }

    .material-icons {
      font-size: 18px;
    }
  }
}

/* Loading state for ClientOnly fallback */
.flow-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  height: 500px;
  background: rgb(var(--accent-500-rgb) / 5%);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  color: var(--neutral);
  font-size: 0.9rem;

  .spinning {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.design-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @include tablet {
    grid-template-columns: 1fr;
  }
}

.system-tree, .properties-panel {
  background: rgb(var(--accent-500-rgb) / 5%);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  padding: 1.25rem;
  min-height: 300px;
  max-height: 550px;
  overflow-y: auto;
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--accent-500-rgb) / 40%) transparent;

  /* Webkit scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(var(--accent-500-rgb) / 35%);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--accent-500-rgb) / 55%);
    background-clip: padding-box;
  }

  h3 {
    font-size: 0.8rem;
    font-weight: 700;
    margin: 0 0 1rem;
    color: var(--text);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgb(var(--accent-500-rgb) / 15%);
    position: sticky;
    top: -1.25rem;
    background: inherit;
    padding-top: 0;
    margin-top: 0;
    z-index: 1;
  }
}

.tree-section {
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--neutral);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin: 0 0 0.625rem;
    padding-left: 0.25rem;
  }
}

.tree-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.375rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
  background: rgb(var(--accent-500-rgb) / 3%);

  &:hover {
    background: rgb(var(--accent-500-rgb) / 12%);
    border-color: rgb(var(--accent-500-rgb) / 20%);
  }

  &.selected {
    background: rgb(var(--accent-500-rgb) / 20%);
    border-color: var(--accent-500);
  }

  .material-icons {
    font-size: 18px;
    color: var(--accent-500);
    flex-shrink: 0;
  }

  .item-name {
    flex: 1;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-cfm {
    font-size: 0.7rem;
    color: var(--accent-500);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    flex-shrink: 0;
    padding: 0.125rem 0.375rem;
    background: rgb(var(--accent-500-rgb) / 10%);
    border-radius: 0.25rem;
  }
}

.property-section {
  .section-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgb(var(--accent-500-rgb) / 15%);
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text);

    .material-icons {
      color: var(--accent-500);
      font-size: 20px;
    }
  }
}

.property-row {
  margin-bottom: 1rem;

  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--neutral);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid rgb(var(--accent-500-rgb) / 20%);
    border-radius: 0.5rem;
    background: rgb(var(--accent-500-rgb) / 5%);
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 500;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;

    &:focus {
      outline: none;
      border-color: var(--accent-500);
      background: var(--card);
      box-shadow: 0 0 0 3px rgb(var(--accent-500-rgb) / 15%);
    }

    &:hover:not(:focus) {
      border-color: rgb(var(--accent-500-rgb) / 35%);
      background: rgb(var(--accent-500-rgb) / 8%);
    }
  }

  &.checkbox {
    margin-top: 1rem;
    
    label {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text);
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      
      input[type="checkbox"] {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid rgb(var(--accent-500-rgb) / 40%);
        border-radius: 4px;
        background: var(--card);
        cursor: pointer;
        transition: all 0.15s;
        position: relative;
        
        &:checked {
          background: var(--accent-500);
          border-color: var(--accent-500);
          
          &::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: 700;
          }
        }
        
        &:hover:not(:checked) {
          border-color: var(--accent-500);
        }
      }
    }
  }
}

/* Insulation Details */
.insulation-details {
  background: rgb(var(--accent-500-rgb) / 5%);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;

  h4 {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--accent-500);
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgb(var(--accent-500-rgb) / 15%);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .property-row {
    margin-bottom: 0.75rem;

    &:last-of-type {
      margin-bottom: 0;
    }

    .input-hint {
      display: block;
      font-size: 0.7rem;
      color: var(--neutral);
      margin-top: 0.25rem;
    }
  }

  .insulation-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    margin-top: 1rem;
    background: rgb(var(--accent-500-rgb) / 10%);
    border-radius: 0.375rem;
    font-size: 0.85rem;
    color: var(--text);

    strong {
      font-family: 'JetBrains Mono', monospace;
      color: var(--accent-500);
    }
  }
}

.calculated-values {
  background: rgb(var(--accent-500-rgb) / 8%);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1.25rem 0;

  h4 {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--accent-500);
    margin: 0 0 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgb(var(--accent-500-rgb) / 15%);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .calc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    padding: 0.375rem 0;
    border-bottom: 1px solid rgb(var(--accent-500-rgb) / 8%);

    &:last-child {
      border-bottom: none;
    }

    span {
      color: var(--neutral);
      font-weight: 500;
    }

    strong {
      font-family: 'JetBrains Mono', monospace;
      color: var(--text);
      font-size: 0.85rem;
    }
  }
}

.fittings-section {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgb(var(--accent-500-rgb) / 12%);

  h4 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0 0 0.75rem;

    .add-fitting-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      border: none;
      background: rgb(var(--accent-500-rgb) / 15%);
      color: var(--accent-500);
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.15s;

      .material-icons {
        font-size: 18px;
      }

      &:hover {
        background: var(--accent-500);
        color: white;
      }
    }
  }

  .no-fittings {
    font-size: 0.85rem;
    color: var(--neutral);
    font-style: italic;
    padding: 0.75rem 0;
  }

  .fitting-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.5rem;
    margin: 0 -0.5rem;
    border-radius: 0.375rem;
    border-bottom: none;
    transition: background 0.15s;

    &:hover {
      background: rgb(var(--accent-500-rgb) / 8%);
    }

    .fitting-name {
      flex: 1;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text);
    }

    .fitting-qty {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border: none;
        background: var(--accent-500);
        color: white;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.15s;

        &:hover {
          filter: brightness(1.15);
          transform: scale(1.05);
        }
      }

      span {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text);
        min-width: 24px;
        text-align: center;
      }
    }

    .remove-fitting {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      background: rgb(220 38 38 / 15%);
      color: rgb(248 113 113);
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.15s;

      .material-icons {
        font-size: 16px;
      }

      &:hover {
        background: rgb(220 38 38 / 25%);
        color: rgb(252 165 165);
      }
    }
  }
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 1.5rem;
  border: 1px solid rgb(220 38 38 / 25%);
  background: rgb(220 38 38 / 8%);
  color: rgb(248 113 113);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: rgb(220 38 38 / 15%);
    border-color: rgb(220 38 38 / 40%);
  }

  .material-icons {
    font-size: 18px;
  }
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--neutral);

  .material-icons {
    font-size: 48px;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }

  p {
    font-size: 0.875rem;
    margin: 0;
  }
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat {
    background: rgb(var(--accent-500-rgb) / 10%);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    text-align: center;

    .label {
      display: block;
      font-size: 0.7rem;
      color: var(--neutral);
      text-transform: uppercase;
      margin-bottom: 0.25rem;
    }

    .value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1rem;
      font-weight: 600;
      color: var(--accent-500);
    }
  }
}

/* Settings Tab */
.settings-tab {
  padding: 1rem 0;

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;

    @include tablet {
      grid-template-columns: repeat(2, 1fr);
    }

    @include phone {
      grid-template-columns: 1fr;
    }
  }

  .setting-group {
    background: rgb(var(--accent-500-rgb) / 5%);
    border: 1px solid rgb(var(--accent-500-rgb) / 10%);
    padding: 1.25rem;
    border-radius: 0.75rem;

    h3 {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text);
      margin: 0 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgb(var(--accent-500-rgb) / 15%);
    }

    select, input[type="number"], input[type="text"] {
      width: 100%;
      padding: 0.625rem 0.75rem;
      border: 1px solid rgb(var(--accent-500-rgb) / 25%);
      border-radius: 0.375rem;
      background: var(--card);
      color: var(--text);
      font-size: 0.875rem;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus {
        outline: none;
        border-color: var(--accent-500);
        box-shadow: 0 0 0 2px rgb(var(--accent-500-rgb) / 15%);
      }

      &:hover:not(:focus) {
        border-color: rgb(var(--accent-500-rgb) / 40%);
      }
    }

    .sub-setting {
      margin-top: 1rem;

      label {
        display: block;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--neutral);
        margin-bottom: 0.375rem;
      }

      &:first-child {
        margin-top: 0;
      }
    }

    .air-props {
      margin-top: 1rem;
      padding: 0.75rem;
      background: rgb(var(--accent-500-rgb) / 8%);
      border: 1px solid rgb(var(--accent-500-rgb) / 15%);
      border-radius: 0.375rem;

      .prop {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8rem;
        font-family: 'JetBrains Mono', monospace;
        padding: 0.25rem 0;
        color: var(--accent-500);

        span {
          color: var(--neutral);
          font-weight: 600;
          min-width: 2rem;
        }
      }
    }
  }
}

/* Results Tab */
.results-tab {
  .results-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .results-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;

    .summary-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgb(var(--accent-500-rgb) / 10%);
      padding: 1rem 1.25rem;
      border-radius: 0.75rem;

      .material-icons {
        font-size: 32px;
        color: var(--accent-500);
      }

      .card-content {
        .label {
          display: block;
          font-size: 0.75rem;
          color: var(--neutral);
        }

        .value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text);
        }
      }
    }
  }

  .warnings-section {
    background: rgb(234 179 8 / 10%);
    border: 1px solid rgb(234 179 8 / 30%);
    padding: 1rem;
    border-radius: 0.75rem;

    h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: rgb(234 179 8);
      margin: 0 0 0.5rem;

      .material-icons {
        font-size: 20px;
      }
    }

    ul {
      margin: 0;
      padding-left: 1.5rem;

      li {
        font-size: 0.85rem;
        color: var(--text);
        margin-bottom: 0.25rem;
      }
    }
  }

  .bom-section, .segments-detail {
    h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0;
      color: var(--text);

      .material-icons {
        font-size: 20px;
        color: var(--accent-500);
      }
    }
  }

  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: var(--neutral);

    .material-icons {
      font-size: 64px;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    p {
      font-size: 1rem;
      margin: 0;
    }
  }
}

/* Modal Form Styles */
.form-row {
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--neutral);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  input, select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid rgb(var(--accent-500-rgb) / 25%);
    border-radius: 0.5rem;
    background: var(--card);
    color: var(--text);
    font-size: 0.9rem;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      outline: none;
      border-color: var(--accent-500);
      box-shadow: 0 0 0 3px rgb(var(--accent-500-rgb) / 15%);
    }

    &:hover:not(:focus) {
      border-color: rgb(var(--accent-500-rgb) / 40%);
    }

    &::placeholder {
      color: var(--neutral);
      opacity: 0.6;
    }
  }
}

/* Modal Buttons */
.btn-cancel {
  padding: 0.625rem 1.25rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 30%);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgb(var(--accent-500-rgb) / 10%);
    border-color: rgb(var(--accent-500-rgb) / 50%);
  }
}

.btn-primary {
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--accent-500);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    filter: brightness(1.1);
    box-shadow: 0 4px 12px rgb(var(--accent-500-rgb) / 40%);
  }

  &:active {
    transform: scale(0.98);
  }
}

/* Fitting Grid */
.fitting-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  max-height: 450px;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--accent-500-rgb) / 40%) transparent;

  /* Webkit scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(var(--accent-500-rgb) / 35%);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--accent-500-rgb) / 55%);
  }
}

.fitting-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.625rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgb(var(--accent-500-rgb) / 15%);
    border-color: var(--accent-500);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
  }

  .material-icons {
    font-size: 28px;
    color: var(--accent-500);
  }

  .fitting-name {
    font-size: 0.7rem;
    font-weight: 500;
    text-align: center;
    color: var(--text);
    line-height: 1.3;
  }
}

/* Share Modal */
.share-content {
  .share-description {
    margin: 0 0 1.25rem;
    font-size: 0.9rem;
    color: var(--text);
    line-height: 1.5;
  }

  .share-url-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .share-url-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid rgb(var(--accent-500-rgb) / 25%);
      border-radius: 0.5rem;
      background: rgb(var(--accent-500-rgb) / 5%);
      color: var(--text);
      font-size: 0.8rem;
      font-family: 'JetBrains Mono', monospace;

      &:focus {
        outline: none;
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px rgb(var(--accent-500-rgb) / 15%);
      }
    }

    .copy-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 1rem;
      border: none;
      background: var(--accent-500);
      color: white;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        filter: brightness(1.15);
      }

      .material-icons {
        font-size: 20px;
      }
    }
  }

  .share-note {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    background: rgb(var(--accent-500-rgb) / 8%);
    border: 1px solid rgb(var(--accent-500-rgb) / 15%);
    border-radius: 0.5rem;
    font-size: 0.8rem;
    color: var(--neutral);

    .material-icons {
      font-size: 18px;
      color: var(--accent-500);
    }
  }
}
</style>

