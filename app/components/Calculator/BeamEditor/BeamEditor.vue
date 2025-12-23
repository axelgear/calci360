<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import type { Node, Edge, NodeMouseEvent, NodeDragEvent } from '@vue-flow/core'
import PointLoadNode from '~/components/Calculator/BeamEditor/nodes/PointLoadNode.vue'
import UdlNode from '~/components/Calculator/BeamEditor/nodes/UdlNode.vue'
import MomentNode from '~/components/Calculator/BeamEditor/nodes/MomentNode.vue'
import SupportNode from '~/components/Calculator/BeamEditor/nodes/SupportNode.vue'
import BeamNode from '~/components/Calculator/BeamEditor/nodes/BeamNode.vue'
import type { BeamLoad, BeamSupport, LoadType, SupportType, PointLoad, UniformDistributedLoad, TriangularLoad, AppliedMoment } from '~/components/Calculator/calculators/bending-stress/types'
import { loadPresets } from '~/components/Calculator/calculators/bending-stress/types'
import { useUiTranslator } from '~/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = defineProps<{
  beamLength: number
  loads: BeamLoad[]
  supports: BeamSupport[]
  selectedLoadId: string | null
  selectedSupportId: string | null
}>()

const emit = defineEmits<{
  (e: 'selectLoad', loadId: string | null): void
  (e: 'selectSupport', supportId: string | null): void
  (e: 'addLoad', type: LoadType, position: number): void
  (e: 'updateLoadPosition', loadId: string, position: number): void
  (e: 'updateLoad', loadId: string, updates: Partial<BeamLoad>): void
  (e: 'addSupport', type: SupportType, position: number): void
  (e: 'updateSupportPosition', supportId: string, position: number): void
  (e: 'removeLoad', loadId: string): void
  (e: 'removeSupport', supportId: string): void
}>()

/* Canvas dimensions */
const BEAM_START_X = 50
const BEAM_WIDTH = 600
const BEAM_Y = 150
const LOAD_Y_OFFSET = -90
const SUPPORT_Y_OFFSET = 25

function positionToX(position: number): number {
  return BEAM_START_X + position * BEAM_WIDTH
}

function xToPosition(x: number): number {
  return Math.max(0, Math.min(1, (x - BEAM_START_X) / BEAM_WIDTH))
}

function getLoadNodeType(type: string): string {
  switch (type) {
    case 'point': return 'pointLoad'
    case 'udl': return 'udlLoad'
    case 'triangular': return 'triangularLoad'
    case 'moment': return 'momentLoad'
    default: return 'pointLoad'
  }
}

/* Beam node */
const beamNode = computed<Node>(() => ({
  id: 'beam',
  type: 'beam',
  position: { x: BEAM_START_X, y: BEAM_Y },
  data: { beamLength: props.beamLength, beamWidth: BEAM_WIDTH },
  draggable: false,
  selectable: false,
}))

/* Handle load deletion */
function handleDeleteLoad(loadId: string) {
  emit('removeLoad', loadId)
  emit('selectLoad', null)
  closeEditPopup()
}

/* Convert loads to nodes */
const loadNodes = computed<Node[]>(() =>
  props.loads.map(load => {
    const x = positionToX(load.position)
    const y = BEAM_Y + (load.type === 'moment' ? LOAD_Y_OFFSET + 40 : LOAD_Y_OFFSET)
    
    return {
      id: load.id,
      type: getLoadNodeType(load.type),
      position: { x, y },
      data: {
        ...load,
        selected: props.selectedLoadId === load.id,
        beamLength: props.beamLength,
        positionMeters: (load.position * props.beamLength).toFixed(2),
        onDelete: () => handleDeleteLoad(load.id),
      },
      draggable: true,
      selectable: true,
    }
  })
)

/* Convert supports to nodes */
const supportNodes = computed<Node[]>(() =>
  props.supports.map(support => ({
    id: support.id,
    type: 'support',
    position: { x: positionToX(support.position), y: BEAM_Y + SUPPORT_Y_OFFSET },
    data: {
      ...support,
      selected: false,
      beamLength: props.beamLength,
      positionMeters: (support.position * props.beamLength).toFixed(2),
    },
    draggable: false,
    selectable: false,
  }))
)

const flowNodes = computed<Node[]>(() => [beamNode.value, ...loadNodes.value, ...supportNodes.value])
const flowEdges = computed<Edge[]>(() => [])

const { onNodeDragStop, onNodeDrag, project, updateNode } = useVueFlow()

/* ============ DOUBLE-CLICK EDIT POPUP ============ */
const editingLoadId = ref<string | null>(null)
const editPopupPosition = ref({ x: 0, y: 0 })

/* Edit fields */
const editMagnitude = ref(0)
const editPosition = ref(0)
const editStartPosition = ref(0)
const editEndPosition = ref(0)
const editDirection = ref<'up' | 'down' | 'clockwise' | 'counterclockwise'>('down')

/* Get current editing load */
const editingLoad = computed(() => 
  editingLoadId.value ? props.loads.find(l => l.id === editingLoadId.value) : null
)

/* Open edit popup on double-click */
function onNodeDoubleClick({ node, event }: NodeMouseEvent) {
  if (node.type === 'support' || node.id === 'beam') return
  
  const load = props.loads.find(l => l.id === node.id)
  if (!load) return
  
  const mouseEvent = event as MouseEvent
  editingLoadId.value = node.id
  editPopupPosition.value = { x: mouseEvent.clientX, y: mouseEvent.clientY }
  
  /* Populate edit fields */
  editPosition.value = load.position * props.beamLength
  
  if (load.type === 'point') {
    const pl = load as PointLoad
    editMagnitude.value = pl.magnitude
    editDirection.value = pl.direction
  } else if (load.type === 'udl') {
    const udl = load as UniformDistributedLoad
    editMagnitude.value = udl.magnitude
    editDirection.value = udl.direction
    editStartPosition.value = udl.startPosition * props.beamLength
    editEndPosition.value = udl.endPosition * props.beamLength
  } else if (load.type === 'triangular') {
    const tri = load as TriangularLoad
    editMagnitude.value = tri.magnitudeEnd
    editDirection.value = tri.direction
    editStartPosition.value = tri.startPosition * props.beamLength
    editEndPosition.value = tri.endPosition * props.beamLength
  } else if (load.type === 'moment') {
    const mom = load as AppliedMoment
    editMagnitude.value = mom.magnitude
    editDirection.value = mom.direction
  }
  
  /* Select the load */
  emit('selectLoad', node.id)
}

/* Save edits */
function saveEdit() {
  if (!editingLoad.value) return
  
  const load = editingLoad.value
  const updates: Record<string, any> = {}
  
  if (load.type === 'point') {
    updates.magnitude = editMagnitude.value
    updates.direction = editDirection.value
    updates.position = Math.max(0, Math.min(props.beamLength, editPosition.value)) / props.beamLength
  } else if (load.type === 'udl') {
    updates.magnitude = editMagnitude.value
    updates.direction = editDirection.value
    const newStart = Math.max(0, Math.min(props.beamLength, editStartPosition.value)) / props.beamLength
    const newEnd = Math.max(0, Math.min(props.beamLength, editEndPosition.value)) / props.beamLength
    updates.startPosition = newStart
    updates.endPosition = newEnd
    updates.position = (newStart + newEnd) / 2
  } else if (load.type === 'triangular') {
    updates.magnitudeEnd = editMagnitude.value
    updates.direction = editDirection.value
    const newStart = Math.max(0, Math.min(props.beamLength, editStartPosition.value)) / props.beamLength
    const newEnd = Math.max(0, Math.min(props.beamLength, editEndPosition.value)) / props.beamLength
    updates.startPosition = newStart
    updates.endPosition = newEnd
    updates.position = (newStart + newEnd) / 2
  } else if (load.type === 'moment') {
    updates.magnitude = editMagnitude.value
    updates.direction = editDirection.value
    updates.position = Math.max(0, Math.min(props.beamLength, editPosition.value)) / props.beamLength
  }
  
  emit('updateLoad', load.id, updates)
  closeEditPopup()
}

function closeEditPopup() {
  editingLoadId.value = null
}

function deleteEditingLoad() {
  if (editingLoadId.value) {
    emit('removeLoad', editingLoadId.value)
    emit('selectLoad', null)
    closeEditPopup()
  }
}

/* ============ NODE EVENTS ============ */

function onNodeClick({ node }: NodeMouseEvent) {
  if (node.type === 'support' || node.id === 'beam') {
    emit('selectLoad', null)
    emit('selectSupport', null)
  } else {
    emit('selectLoad', node.id)
    emit('selectSupport', null)
  }
}

onNodeDrag(({ node }: NodeDragEvent) => {
  if (node.id === 'beam' || node.type === 'support') return
  
  const targetY = BEAM_Y + (node.type === 'momentLoad' ? LOAD_Y_OFFSET + 40 : LOAD_Y_OFFSET)
  const constrainedX = Math.max(BEAM_START_X, Math.min(BEAM_START_X + BEAM_WIDTH, node.position.x))
  
  if (node.position.y !== targetY || node.position.x !== constrainedX) {
    updateNode(node.id, { position: { x: constrainedX, y: targetY } })
  }
})

onNodeDragStop(({ node }: NodeDragEvent) => {
  if (node.id === 'beam' || node.type === 'support') return
  
  const constrainedX = Math.max(BEAM_START_X, Math.min(BEAM_START_X + BEAM_WIDTH, node.position.x))
  emit('updateLoadPosition', node.id, xToPosition(constrainedX))
})

function onPaneClick() {
  emit('selectLoad', null)
  emit('selectSupport', null)
  closeEditPopup()
}

/* ============ DRAG & DROP ============ */
const draggedItem = ref<{ type: 'load' | 'support'; subType: LoadType | SupportType } | null>(null)

function onDragStart(event: DragEvent, itemType: 'load' | 'support', subType: LoadType | SupportType) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/beam-item', JSON.stringify({ type: itemType, subType }))
    event.dataTransfer.effectAllowed = 'copy'
  }
  draggedItem.value = { type: itemType, subType }
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}

function onDrop(event: DragEvent) {
  const data = event.dataTransfer?.getData('application/beam-item')
  if (!data) return
  
  try {
    const { type, subType } = JSON.parse(data)
    const flowContainer = (event.target as HTMLElement).closest('.vue-flow')
    if (!flowContainer) return
    
    const rect = flowContainer.getBoundingClientRect()
    const pos = project({ x: event.clientX - rect.left, y: event.clientY - rect.top })
    const position = xToPosition(Math.max(BEAM_START_X, Math.min(BEAM_START_X + BEAM_WIDTH, pos.x)))
    
    if (type === 'load') emit('addLoad', subType as LoadType, position)
    else emit('addSupport', subType as SupportType, position)
  } catch (e) {
    console.error('Drop error:', e)
  }
  draggedItem.value = null
}

/* Support icons */
const supportIcons: Record<SupportType, string> = {
  fixed: 'lock',
  pinned: 'push_pin',
  roller: 'radio_button_unchecked',
  free: 'radio_button_checked',
}

/* Keyboard shortcuts */
function handleKeydown(event: KeyboardEvent) {
  if ((event.target as HTMLElement).tagName === 'INPUT') return
  
  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (props.selectedLoadId) {
      emit('removeLoad', props.selectedLoadId)
      emit('selectLoad', null)
    }
  }
  if (event.key === 'Escape') {
    emit('selectLoad', null)
    closeEditPopup()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="beam-editor">
    <!-- Toolbar -->
    <div class="editor-toolbar">
      <div class="palette-section">
        <span class="section-label">{{ t('LOADS') }}</span>
        <div class="palette-items">
          <div
            v-for="preset in loadPresets"
            :key="preset.id"
            class="palette-item"
            :title="preset.description"
            draggable="true"
            @dragstart="onDragStart($event, 'load', preset.type)"
          >
            <span class="material-icons">{{ preset.icon }}</span>
            <span class="item-name">{{ preset.name }}</span>
          </div>
        </div>
      </div>
      
      <div class="palette-section">
        <span class="section-label">{{ t('SUPPORTS') }}</span>
        <div class="palette-items">
          <div
            class="palette-item"
            title="Fixed support"
            draggable="true"
            @dragstart="onDragStart($event, 'support', 'fixed')"
          >
            <span class="material-icons">{{ supportIcons.fixed }}</span>
            <span class="item-name">{{ t('Fixed') }}</span>
          </div>
          <div
            class="palette-item"
            title="Pinned support"
            draggable="true"
            @dragstart="onDragStart($event, 'support', 'pinned')"
          >
            <span class="material-icons">{{ supportIcons.pinned }}</span>
            <span class="item-name">{{ t('Pinned') }}</span>
          </div>
          <div
            class="palette-item"
            title="Roller support"
            draggable="true"
            @dragstart="onDragStart($event, 'support', 'roller')"
          >
            <span class="material-icons">{{ supportIcons.roller }}</span>
            <span class="item-name">{{ t('Roller') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue Flow Canvas -->
    <div class="flow-container" @drop="onDrop" @dragover="onDragOver">
      <VueFlow
        :nodes="flowNodes"
        :edges="flowEdges"
        :default-viewport="{ x: 0, y: 0, zoom: 1 }"
        :min-zoom="0.5"
        :max-zoom="2"
        :snap-to-grid="true"
        :snap-grid="[10, 10]"
        :nodes-draggable="true"
        :nodes-connectable="false"
        fit-view-on-init
        @node-click="onNodeClick"
        @node-double-click="onNodeDoubleClick"
        @pane-click="onPaneClick"
      >
        <template #node-pointLoad="nodeProps">
          <PointLoadNode v-bind="nodeProps" />
        </template>
        <template #node-udlLoad="nodeProps">
          <UdlNode v-bind="nodeProps" />
        </template>
        <template #node-triangularLoad="nodeProps">
          <UdlNode v-bind="nodeProps" :is-triangular="true" />
        </template>
        <template #node-momentLoad="nodeProps">
          <MomentNode v-bind="nodeProps" />
        </template>
        <template #node-support="nodeProps">
          <SupportNode v-bind="nodeProps" />
        </template>
        <template #node-beam="nodeProps">
          <BeamNode v-bind="nodeProps" />
        </template>
        
        <Background pattern-color="rgb(var(--accent-500-rgb) / 8%)" :gap="20" :size="1" />
        <Controls position="bottom-right" />
      </VueFlow>
      
      <!-- Double-Click Edit Popup -->
      <Teleport to="body">
        <div 
          v-if="editingLoad" 
          class="load-edit-popup"
          :style="{ left: editPopupPosition.x + 'px', top: editPopupPosition.y + 'px' }"
        >
          <div class="popup-header">
            <span class="popup-title">{{ editingLoad.type.toUpperCase() }}</span>
            <button class="popup-close" @click="closeEditPopup">
              <span class="material-icons">close</span>
            </button>
          </div>
          
          <div class="popup-body">
            <!-- Magnitude -->
            <div class="popup-field">
              <label>{{ editingLoad.type === 'moment' ? 'Moment' : 'Load' }} 
                <span class="unit">{{ editingLoad.type === 'moment' ? 'N·m' : (editingLoad.type === 'point' ? 'N' : 'N/m') }}</span>
              </label>
              <input v-model.number="editMagnitude" type="number" min="0" step="100" />
            </div>
            
            <!-- Direction -->
            <div class="popup-field">
              <label>Direction</label>
              <div class="direction-btns">
                <template v-if="editingLoad.type === 'moment'">
                  <button :class="{ active: editDirection === 'clockwise' }" @click="editDirection = 'clockwise'">
                    <span class="material-icons">rotate_right</span> CW
                  </button>
                  <button :class="{ active: editDirection === 'counterclockwise' }" @click="editDirection = 'counterclockwise'">
                    <span class="material-icons">rotate_left</span> CCW
                  </button>
                </template>
                <template v-else>
                  <button :class="{ active: editDirection === 'down' }" @click="editDirection = 'down'">
                    <span class="material-icons">south</span> Down
                  </button>
                  <button :class="{ active: editDirection === 'up' }" @click="editDirection = 'up'">
                    <span class="material-icons">north</span> Up
                  </button>
                </template>
              </div>
            </div>
            
            <!-- Position (for point/moment) -->
            <template v-if="editingLoad.type === 'point' || editingLoad.type === 'moment'">
              <div class="popup-field">
                <label>Position <span class="unit">m</span></label>
                <input v-model.number="editPosition" type="number" :min="0" :max="beamLength" step="0.1" />
                <span class="field-hint">0 – {{ beamLength }}m</span>
              </div>
            </template>
            
            <!-- From/To (for UDL/triangular) -->
            <template v-if="editingLoad.type === 'udl' || editingLoad.type === 'triangular'">
              <div class="popup-field">
                <label>From <span class="unit">m</span></label>
                <input v-model.number="editStartPosition" type="number" :min="0" :max="beamLength" step="0.1" />
              </div>
              <div class="popup-field">
                <label>To <span class="unit">m</span></label>
                <input v-model.number="editEndPosition" type="number" :min="0" :max="beamLength" step="0.1" />
                <span class="field-hint">Span: {{ (editEndPosition - editStartPosition).toFixed(2) }}m</span>
              </div>
            </template>
          </div>
          
          <div class="popup-actions">
            <button class="save-btn" @click="saveEdit">
              <span class="material-icons">check</span> Save
            </button>
            <button class="delete-btn" @click="deleteEditingLoad">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>
      </Teleport>
    </div>

    <!-- Instructions -->
    <div class="editor-hint">
      <span class="material-icons">lightbulb</span>
      {{ t('Drag loads onto beam • Double-click to edit • Del to delete') }}
    </div>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
</style>

<style scoped lang="scss">
.beam-editor {
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
  gap: 1rem;
  flex-wrap: wrap;
}

.palette-section {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.section-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--neutral);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.palette-items {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
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
}

.flow-container {
  position: relative;
  height: 280px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgb(var(--accent-500-rgb) / 12%);
}

:deep(.vue-flow) {
  background: rgb(var(--accent-500-rgb) / 2%);
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

.editor-hint {
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

/* Double-Click Edit Popup - Clean theme */
.load-edit-popup {
  position: fixed;
  z-index: 9999;
  transform: translate(-50%, -100%) translateY(-15px);
  background: #000;
  border: 1px solid rgb(var(--accent-500-rgb) / 25%);
  border-radius: 0.5rem;
  box-shadow: 0 8px 32px rgb(0 0 0 / 60%);
  min-width: 200px;
  max-width: 260px;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgb(var(--accent-500-rgb) / 10%);
}

.popup-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--accent-500);
  letter-spacing: 0.03em;
}

.popup-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.15s;

  .material-icons {
    font-size: 16px;
    color: var(--neutral);
  }

  &:hover {
    background: rgb(var(--accent-500-rgb) / 10%);
    
    .material-icons {
      color: var(--text);
    }
  }
}

.popup-body {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.popup-field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  label {
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--neutral);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    
    .unit {
      font-weight: 400;
      color: var(--neutral);
      text-transform: none;
      opacity: 0.7;
    }
  }

  input {
    width: 100%;
    padding: 0.45rem 0.5rem;
    border: 1px solid rgb(var(--accent-500-rgb) / 25%);
    border-radius: 0.25rem;
    background: rgb(255 255 255 / 5%);
    color: var(--text);
    font-size: 0.85rem;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    text-align: center;

    &:focus {
      outline: none;
      border-color: var(--accent-500);
    }
  }
}

.field-hint {
  font-size: 0.55rem;
  color: var(--neutral);
  text-align: center;
  opacity: 0.7;
}

.direction-btns {
  display: flex;
  gap: 0.25rem;

  button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    padding: 0.35rem;
    background: transparent;
    border: 1px solid rgb(var(--accent-500-rgb) / 20%);
    border-radius: 0.25rem;
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--neutral);
    cursor: pointer;
    transition: all 0.15s;

    .material-icons { font-size: 12px; }

    &:hover {
      border-color: rgb(var(--accent-500-rgb) / 40%);
      color: var(--text);
    }

    &.active {
      background: rgb(var(--accent-500-rgb) / 15%);
      border-color: var(--accent-500);
      color: var(--accent-500);
    }
  }
}

.popup-actions {
  display: flex;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem 0.75rem;
}

.save-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.4rem;
  background: rgb(var(--accent-500-rgb) / 15%);
  border: 1px solid rgb(var(--accent-500-rgb) / 30%);
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--accent-500);
  cursor: pointer;
  transition: all 0.15s;

  .material-icons { font-size: 14px; }

  &:hover {
    background: rgb(var(--accent-500-rgb) / 25%);
    border-color: var(--accent-500);
  }
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.5rem;
  background: transparent;
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.15s;

  .material-icons {
    font-size: 14px;
    color: var(--neutral);
  }

  &:hover {
    border-color: rgb(239 68 68 / 50%);
    
    .material-icons {
      color: #ef4444;
    }
  }
}
</style>
