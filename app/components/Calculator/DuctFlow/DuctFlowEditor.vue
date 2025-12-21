<script setup lang="ts">
import { VueFlow, useVueFlow, MarkerType } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import type { Node, Edge, Connection, NodeMouseEvent, EdgeMouseEvent } from '@vue-flow/core'
import AhuNode from './nodes/AhuNode.vue'
import JunctionNode from './nodes/JunctionNode.vue'
import DiffuserNode from './nodes/DiffuserNode.vue'
import HvacNode from './nodes/HvacNode.vue'
import { getCategoriesWithComponents, getComponent, quickAccessComponents, ductShapes, type HvacComponent, type HvacCategory, type DuctShape } from './components'
import { useUiTranslator } from '~/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = defineProps<{
  nodes: Array<{
    id: string
    type: string
    name: string
    cfm?: number
    position: { x: number; y: number }
    componentId?: string
  }>
  segments: Array<{
    id: string
    fromNodeId: string
    toNodeId: string
    sourceHandle?: string | null
    targetHandle?: string | null
    length: number
    insulated?: boolean
    fittings?: Array<{ fittingId: string; quantity: number }>
    calculated?: { cfm?: number; velocity?: number }
  }>
  selectedNodeId: string | null
  selectedSegmentId: string | null
  warnings?: string[]
  maxVelocity?: number
}>()

const emit = defineEmits<{
  (e: 'selectNode', nodeId: string | null): void
  (e: 'selectSegment', segmentId: string | null): void
  (e: 'addNode', componentId: string, position: { x: number; y: number }, ductShape: DuctShape): void
  (e: 'updateNodePosition', nodeId: string, position: { x: number; y: number }): void
  (e: 'connect', fromNodeId: string, toNodeId: string, sourceHandle?: string | null, targetHandle?: string | null): void
  (e: 'removeEdge', segmentId: string): void
  (e: 'updateSegmentLength', segmentId: string, length: number): void
  (e: 'update:ductShape', shape: DuctShape): void
}>()

/* Duct shape selection */
const selectedDuctShape = ref<DuctShape>('rectangular')

/* Component categories */
const categories = getCategoriesWithComponents()
const expandedCategory = ref<HvacCategory | null>(null)
const showComponentPicker = ref(false)

/* Quick access components */
const quickComponents = computed(() => 
  quickAccessComponents.map(id => getComponent(id)).filter(Boolean) as HvacComponent[]
)

/* Minimap container ref for proper sizing */
const flowContainerRef = ref<HTMLElement | null>(null)

/* Toggle category */
function toggleCategory(cat: HvacCategory) {
  expandedCategory.value = expandedCategory.value === cat ? null : cat
}

/* Map node types to Vue Flow node types */
function getNodeType(type: string, componentId?: string): string {
  if (componentId) {
    const comp = getComponent(componentId)
    if (comp) {
      if (comp.nodeType === 'source') return 'ahu'
      if (comp.nodeType === 'terminal') return 'diffuser'
      if (comp.nodeType === 'junction') return 'junction'
      return 'hvac'
    }
  }
  if (type === 'ahu') return 'ahu'
  if (type === 'junction') return 'junction'
  return 'diffuser'
}

/* Get node color for minimap */
function getNodeColor(node: Node): string {
  const comp = node.data?.componentId ? getComponent(node.data.componentId) : null
  if (comp) {
    switch (comp.nodeType) {
      case 'source': return 'var(--accent-500)'
      case 'terminal': return 'rgb(var(--accent-500-rgb) / 60%)'
      case 'junction': return 'rgb(var(--accent-500-rgb) / 80%)'
      default: return 'rgb(var(--accent-500-rgb) / 40%)'
    }
  }
  if (node.type === 'ahu') return 'var(--accent-500)'
  if (node.type === 'diffuser') return 'rgb(var(--accent-500-rgb) / 60%)'
  return 'rgb(var(--accent-500-rgb) / 50%)'
}

/* Convert system nodes to Vue Flow nodes */
const flowNodes = computed<Node[]>(() => 
  props.nodes.map(node => ({
    id: node.id,
    type: getNodeType(node.type, node.componentId),
    position: node.position,
    data: {
      label: node.name,
      cfm: node.cfm,
      componentId: node.componentId ?? node.type,
      selected: props.selectedNodeId === node.id,
    },
    draggable: node.type !== 'ahu',
  }))
)

/* Check if segment has warning (velocity exceeds max) */
function hasWarning(seg: typeof props.segments[0]): boolean {
  if (!seg.calculated?.velocity || !props.maxVelocity) return false
  return seg.calculated.velocity > props.maxVelocity
}

/* Build edge label with length, CFM, fittings count and insulation */
function buildEdgeLabel(seg: typeof props.segments[0]): string {
  const parts: string[] = []
  /* Always show length */
  parts.push(`${seg.length}m`)
  if (seg.calculated?.cfm) {
    parts.push(`${seg.calculated.cfm} CFM`)
  }
  const fittingCount = seg.fittings?.reduce((sum, f) => sum + f.quantity, 0) ?? 0
  if (fittingCount > 0) {
    parts.push(`🔧${fittingCount}`)
  }
  /* Show shield icon if insulated */
  if (seg.insulated) {
    parts.push(`🛡️`)
  }
  return parts.join(' | ')
}

/* Convert system segments to Vue Flow edges */
const flowEdges = computed<Edge[]>(() =>
  props.segments.map(seg => {
    const isWarning = hasWarning(seg)
    const isSelected = props.selectedSegmentId === seg.id
    
    /* Warning = yellow/orange, Selected = accent, Normal = accent/50% */
    let strokeColor = 'rgb(var(--accent-500-rgb) / 50%)'
    if (isWarning) {
      strokeColor = '#f59e0b' /* amber-500 */
    } else if (isSelected) {
      strokeColor = 'var(--accent-500)'
    }
    
    return {
      id: seg.id,
      source: seg.fromNodeId,
      target: seg.toNodeId,
      sourceHandle: seg.sourceHandle ?? undefined,
      targetHandle: seg.targetHandle ?? undefined,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: strokeColor,
        strokeWidth: isSelected ? 3 : isWarning ? 3 : 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: strokeColor,
      },
      label: buildEdgeLabel(seg),
      labelStyle: {
        fill: isWarning ? '#f59e0b' : 'var(--text)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        fontWeight: 600,
      },
      labelBgStyle: {
        fill: isWarning ? 'rgb(245 158 11 / 15%)' : 'var(--card)',
        fillOpacity: 0.95,
        stroke: isWarning ? '#f59e0b' : undefined,
        strokeWidth: isWarning ? 1 : 0,
      },
      labelBgPadding: [4, 2] as [number, number],
      labelBgBorderRadius: 4,
    }
  })
)

/* Vue Flow instance */
const { onConnect, onNodeDragStop, project, getNode } = useVueFlow()

/* Check if a node can have output connections */
function canHaveOutput(nodeId: string): boolean {
  const node = getNode.value(nodeId)
  if (!node) return false
  
  const componentId = node.data?.componentId
  if (componentId) {
    const comp = getComponent(componentId)
    /* Terminal nodes (diffusers, grilles) cannot have outputs */
    if (comp?.nodeType === 'terminal') return false
  }
  
  /* Also check the Vue Flow node type */
  if (node.type === 'diffuser') return false
  
  return true
}

/* Check if a node can have input connections */
function canHaveInput(nodeId: string): boolean {
  const node = getNode.value(nodeId)
  if (!node) return false
  
  const componentId = node.data?.componentId
  if (componentId) {
    const comp = getComponent(componentId)
    /* Source nodes (AHU) cannot have inputs */
    if (comp?.nodeType === 'source') return false
  }
  
  /* Also check the Vue Flow node type */
  if (node.type === 'ahu') return false
  
  return true
}

/* Validate connection before creating */
function isValidConnection(connection: Connection): boolean {
  if (!connection.source || !connection.target) return false
  
  /* Can't connect to self */
  if (connection.source === connection.target) return false
  
  /* Source node must be able to have outputs */
  if (!canHaveOutput(connection.source)) return false
  
  /* Target node must be able to have inputs */
  if (!canHaveInput(connection.target)) return false
  
  return true
}

/* Handle connections - with validation */
onConnect((connection: Connection) => {
  if (isValidConnection(connection)) {
    emit('connect', connection.source!, connection.target!, connection.sourceHandle, connection.targetHandle)
  }
})

/* Handle node drag */
onNodeDragStop(({ node }) => {
  emit('updateNodePosition', node.id, node.position)
})

/* Handle node click */
function onNodeClick({ node }: NodeMouseEvent) {
  emit('selectNode', node.id)
}

/* Handle edge click */
function onEdgeClick({ edge }: EdgeMouseEvent) {
  emit('selectSegment', edge.id)
}

/* Handle edge double-click for inline length editing */
const editingSegmentId = ref<string | null>(null)
const editingLength = ref<number>(0)
const editPopupPosition = ref({ x: 0, y: 0 })

function onEdgeDoubleClick({ edge, event }: EdgeMouseEvent) {
  const segment = props.segments.find(s => s.id === edge.id)
  if (!segment) return
  
  const mouseEvent = event as MouseEvent
  editingSegmentId.value = edge.id
  editingLength.value = segment.length
  editPopupPosition.value = { x: mouseEvent.clientX, y: mouseEvent.clientY }
}

function saveSegmentLength() {
  if (editingSegmentId.value && editingLength.value > 0) {
    emit('updateSegmentLength', editingSegmentId.value, editingLength.value)
  }
  editingSegmentId.value = null
}

function cancelLengthEdit() {
  editingSegmentId.value = null
}

/* Handle pane click (deselect) */
function onPaneClick() {
  emit('selectNode', null)
  emit('selectSegment', null)
  showComponentPicker.value = false
  editingSegmentId.value = null
}

/* Drag & drop */
const draggedComponent = ref<string | null>(null)

function onDragStart(event: DragEvent, componentId: string) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', componentId)
    event.dataTransfer.effectAllowed = 'move'
  }
  draggedComponent.value = componentId
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onDrop(event: DragEvent) {
  const componentId = event.dataTransfer?.getData('application/vueflow')
  if (!componentId) return

  const flowContainer = (event.target as HTMLElement).closest('.vue-flow')
  if (!flowContainer) return

  const rect = flowContainer.getBoundingClientRect()
  const position = project({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  })

  emit('addNode', componentId, position, selectedDuctShape.value)
  draggedComponent.value = null
  showComponentPicker.value = false
}

/* Watch duct shape changes and emit */
watch(selectedDuctShape, (shape) => {
  emit('update:ductShape', shape)
})
</script>

<template>
  <div class="duct-flow-editor">
    <!-- Top Bar: Duct Shape + Component Access -->
    <div class="editor-toolbar">
      <!-- Duct Shape Selector -->
      <div class="shape-selector">
        <span class="selector-label">{{ t('Duct Type') }}:</span>
        <div class="shape-options">
          <button
            v-for="shape in ductShapes"
            :key="shape.id"
            :class="['shape-btn', { active: selectedDuctShape === shape.id }]"
            :title="shape.name"
            @click="selectedDuctShape = shape.id"
          >
            <span class="material-icons">{{ shape.icon }}</span>
            <span class="shape-name">{{ shape.name }}</span>
          </button>
        </div>
      </div>
      
      <!-- Component Picker Toggle -->
      <button class="palette-expand-btn" @click="showComponentPicker = !showComponentPicker">
        <span class="material-icons">{{ showComponentPicker ? 'expand_less' : 'apps' }}</span>
        {{ showComponentPicker ? t('Less') : t('All Parts') }}
      </button>
    </div>

    <!-- Quick Access Components -->
    <div class="quick-palette">
      <div 
        v-for="comp in quickComponents" 
        :key="comp.id"
        class="palette-item"
        :title="comp.description ?? comp.name"
        draggable="true"
        @dragstart="onDragStart($event, comp.id)"
      >
        <span class="material-icons">{{ comp.icon }}</span>
        <span class="item-label">{{ comp.name }}</span>
      </div>
    </div>

    <!-- Expanded Component Picker -->
    <div v-if="showComponentPicker" class="component-picker">
      <div 
        v-for="cat in categories" 
        :key="cat.category" 
        class="category"
      >
        <button class="category-header" @click="toggleCategory(cat.category)">
          <span class="material-icons cat-icon">{{ cat.icon }}</span>
          <span class="cat-label">{{ cat.label }}</span>
          <span class="cat-count">{{ cat.components.length }}</span>
          <span class="material-icons expand-icon">
            {{ expandedCategory === cat.category ? 'expand_less' : 'expand_more' }}
          </span>
        </button>
        <div v-if="expandedCategory === cat.category" class="category-items">
          <div 
            v-for="comp in cat.components" 
            :key="comp.id"
            class="picker-item"
            :title="comp.description"
            draggable="true"
            @dragstart="onDragStart($event, comp.id)"
          >
            <span class="material-icons">{{ comp.icon }}</span>
            <span>{{ comp.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue Flow Canvas -->
    <div 
      ref="flowContainerRef"
      class="flow-container"
      @drop="onDrop"
      @dragover="onDragOver"
    >
      <VueFlow
        :nodes="flowNodes"
        :edges="flowEdges"
        :default-viewport="{ x: 80, y: 80, zoom: 0.9 }"
        :min-zoom="0.2"
        :max-zoom="2.5"
        :snap-to-grid="true"
        :snap-grid="[20, 20]"
        :is-valid-connection="isValidConnection"
        fit-view-on-init
        @node-click="onNodeClick"
        @edge-click="onEdgeClick"
        @edge-double-click="onEdgeDoubleClick"
        @pane-click="onPaneClick"
      >
        <!-- Custom Node Templates -->
        <template #node-ahu="nodeProps">
          <AhuNode v-bind="nodeProps" />
        </template>
        <template #node-junction="nodeProps">
          <JunctionNode v-bind="nodeProps" />
        </template>
        <template #node-diffuser="nodeProps">
          <DiffuserNode v-bind="nodeProps" />
        </template>
        <template #node-hvac="nodeProps">
          <HvacNode v-bind="nodeProps" />
        </template>
        
        <Background pattern-color="rgb(var(--accent-500-rgb) / 8%)" :gap="20" :size="1" />
        <Controls position="bottom-right" />
        <MiniMap 
          position="top-right"
          :pannable="true"
          :zoomable="true"
          :node-stroke-width="0"
          :node-border-radius="3"
          :node-color="getNodeColor"
          mask-color="rgba(0, 200, 255, 0.1)"
          class="custom-minimap"
        />
      </VueFlow>
      
      <!-- Inline Length Edit Popup -->
      <Teleport to="body">
        <div 
          v-if="editingSegmentId" 
          class="length-edit-popup"
          :style="{ left: editPopupPosition.x + 'px', top: editPopupPosition.y + 'px' }"
        >
          <label>Length (m)</label>
          <input 
            v-model.number="editingLength" 
            type="number" 
            min="0.1" 
            step="0.5"
            @keyup.enter="saveSegmentLength"
            @keyup.escape="cancelLengthEdit"
            autofocus
          />
          <div class="popup-actions">
            <button class="save-btn" @click="saveSegmentLength">
              <span class="material-icons">check</span>
            </button>
            <button class="cancel-btn" @click="cancelLengthEdit">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
      </Teleport>
      
      <!-- Duct Shape Indicator -->
      <div class="duct-shape-badge">
        <span class="material-icons">{{ ductShapes.find(s => s.id === selectedDuctShape)?.icon }}</span>
        {{ ductShapes.find(s => s.id === selectedDuctShape)?.name }}
      </div>
    </div>

    <!-- Instructions -->
    <div class="flow-hint">
      <span class="material-icons">lightbulb</span>
      {{ t('Drag components to canvas • Connect via handles • Click to select • Scroll to zoom') }}
    </div>
  </div>
</template>

<style>
/* Vue Flow base styles */
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';
</style>

<style scoped lang="scss">
.duct-flow-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 1rem;
  padding: 0.75rem;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.shape-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selector-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--neutral);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.shape-options {
  display: flex;
  gap: 0.25rem;
}

.shape-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.5rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 25%);
  border-radius: 0.25rem;
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--accent-500);
    background: rgb(var(--accent-500-rgb) / 10%);
  }

  &.active {
    background: var(--accent-500);
    border-color: var(--accent-500);
    color: white;

    .material-icons {
      color: white;
    }
  }

  .material-icons {
    font-size: 14px;
    color: var(--accent-500);
  }

  .shape-name {
    display: none;
    
    @media (min-width: 480px) {
      display: inline;
    }
  }
}

.palette-expand-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.6rem;
  background: rgb(var(--accent-500-rgb) / 10%);
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--accent-500);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgb(var(--accent-500-rgb) / 20%);
    border-color: var(--accent-500);
  }

  .material-icons {
    font-size: 16px;
  }
}

.quick-palette {
  display: flex;
  gap: 0.375rem;
  padding: 0.375rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-radius: 0.5rem;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgb(var(--accent-500-rgb) / 30%);
    border-radius: 2px;
  }
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.5rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 25%);
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text);
  cursor: grab;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    border-color: var(--accent-500);
    background: rgb(var(--accent-500-rgb) / 10%);
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }

  .material-icons {
    font-size: 14px;
    color: var(--accent-500);
  }

  .item-label {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.component-picker {
  display: grid;
  gap: 0.25rem;
  padding: 0.5rem;
  background: rgb(var(--accent-500-rgb) / 3%);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.5rem;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgb(var(--accent-500-rgb) / 25%);
    border-radius: 3px;
  }
}

.category {
  border-radius: 0.375rem;
  overflow: hidden;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
  padding: 0.35rem 0.5rem;
  background: var(--card);
  border: none;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgb(var(--accent-500-rgb) / 10%);
  }

  .cat-icon {
    font-size: 14px;
    color: var(--accent-500);
  }

  .cat-label {
    flex: 1;
    text-align: left;
  }

  .cat-count {
    font-size: 0.6rem;
    padding: 0.125rem 0.35rem;
    background: rgb(var(--accent-500-rgb) / 15%);
    border-radius: 0.25rem;
    color: var(--accent-500);
  }

  .expand-icon {
    font-size: 16px;
    color: var(--neutral);
  }
}

.category-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.25rem;
  padding: 0.35rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-radius: 0 0 0.25rem 0.25rem;
}

.picker-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3rem 0.4rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 0.25rem;
  font-size: 0.65rem;
  color: var(--text);
  cursor: grab;
  transition: all 0.15s;

  &:hover {
    border-color: var(--accent-500);
    background: rgb(var(--accent-500-rgb) / 10%);
  }

  &:active {
    cursor: grabbing;
  }

  .material-icons {
    font-size: 12px;
    color: var(--accent-500);
  }
}

.flow-container {
  position: relative;
  height: 380px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgb(var(--accent-500-rgb) / 12%);
}

.duct-shape-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 25%);
  border-radius: 0.25rem;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--accent-500);
  z-index: 5;

  .material-icons {
    font-size: 14px;
  }
}

:deep(.vue-flow) {
  background: rgb(var(--accent-500-rgb) / 2%);
}

/* Minimap Styling */
:deep(.custom-minimap) {
  background: var(--card) !important;
  border: 2px solid var(--accent-500) !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 16px rgb(0 0 0 / 40%) !important;
  overflow: hidden !important;
}

:deep(.vue-flow__minimap) {
  width: 160px !important;
  height: 110px !important;
}

/* Minimap viewport mask (shows current visible area) */
:deep(.vue-flow__minimap-mask) {
  fill: rgb(var(--accent-500-rgb) / 12%) !important;
  stroke: var(--accent-500) !important;
  stroke-width: 2px !important;
}

/* Minimap nodes */
:deep(.vue-flow__minimap-node) {
  fill: var(--accent-500) !important;
  stroke: white !important;
  stroke-width: 1px !important;
}

:deep(.vue-flow__controls) {
  background: var(--card) !important;
  border: 1px solid rgb(var(--accent-500-rgb) / 20%) !important;
  border-radius: 0.375rem !important;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%) !important;
  gap: 2px;
  padding: 4px;

  button {
    background: transparent !important;
    border: none !important;
    border-radius: 0.25rem !important;
    width: 26px !important;
    height: 26px !important;
    color: var(--text) !important;
    transition: background 0.15s !important;

    &:hover {
      background: rgb(var(--accent-500-rgb) / 15%) !important;
    }

    svg {
      fill: var(--text) !important;
      width: 14px !important;
      height: 14px !important;
    }
  }
}

:deep(.vue-flow__edge-path) {
  stroke-linecap: round;
}

.flow-hint {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.5rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-radius: 0.25rem;
  font-size: 0.65rem;
  color: var(--neutral);

  .material-icons {
    font-size: 14px;
    color: var(--accent-500);
  }
}

/* Length Edit Popup */
.length-edit-popup {
  position: fixed;
  z-index: 9999;
  transform: translate(-50%, -100%) translateY(-10px);
  background: var(--card);
  border: 1px solid var(--accent-500);
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 8px 24px rgb(0 0 0 / 40%);
  min-width: 120px;

  label {
    display: block;
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--neutral);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 0.35rem;
  }

  input {
    width: 100%;
    padding: 0.5rem 0.625rem;
    border: 1px solid rgb(var(--accent-500-rgb) / 30%);
    border-radius: 0.375rem;
    background: rgb(var(--accent-500-rgb) / 5%);
    color: var(--text);
    font-size: 0.9rem;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    text-align: center;

    &:focus {
      outline: none;
      border-color: var(--accent-500);
      box-shadow: 0 0 0 2px rgb(var(--accent-500-rgb) / 20%);
    }
  }

  .popup-actions {
    display: flex;
    gap: 0.35rem;
    margin-top: 0.5rem;

    button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.35rem;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.15s;

      .material-icons {
        font-size: 18px;
      }
    }

    .save-btn {
      background: var(--accent-500);
      color: white;

      &:hover {
        filter: brightness(1.15);
      }
    }

    .cancel-btn {
      background: rgb(var(--accent-500-rgb) / 15%);
      color: var(--text);

      &:hover {
        background: rgb(var(--accent-500-rgb) / 25%);
      }
    }
  }
}
</style>
