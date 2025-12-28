<script setup lang="ts">
import { ref } from 'vue'
import Viewer3D from './Viewer3D.vue'
import TechnicalDrawing2D from './TechnicalDrawing2D.vue'
import { useUiTranslator } from '@/composables/useUiTranslator'
import jsPDF from 'jspdf'

const { t } = useUiTranslator()
const viewerRef = ref<InstanceType<typeof Viewer3D> | null>(null)

const currentFile = ref<File | null>(null)
const annotations = ref<string[]>([])
const selectedTool = ref<string | null>(null)
const viewMode = ref<'3d' | '2d'>('3d')
const drawingData = ref<any>(null)

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    currentFile.value = input.files[0] || null
  }
}

function addAnnotation(type: string) {
  // In a real app, this would enable an interactive mode in Viewer3D
  // For now, we just log it
  console.log(`Adding annotation: ${type}`)
  if (type === 'dimension') {
     // Mocking dimension logic
     selectedTool.value = type
     return
  }
  annotations.value.push(type)
  selectedTool.value = type
}

function setView(view: 'front' | 'top' | 'side' | 'iso') {
  viewerRef.value?.setView(view)
}

function exportPdf() {
  if (!drawingData.value) return

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a3'
  })
  
  // Add the 2D drawing
  const imgData = drawingData.value.canvas
  doc.addImage(imgData, 'PNG', 10, 10, 400, 267) // Scale to fit A3
  
  doc.save('technical_drawing.pdf')
}

function onDrawingReady(data: any) {
  drawingData.value = data
}

const tools = [
  { id: 'dimension', icon: 'straighten', label: 'Dimension' },
  { id: 'datum', icon: 'flag', label: 'Datum' },
  { id: 'tolerance', icon: 'tune', label: 'Tolerance' },
  { id: 'welding', icon: 'local_fire_department', label: 'Welding' },
  { id: 'surface', icon: 'texture', label: 'Surface' },
]

const views = [
  { id: 'front', label: 'Front' },
  { id: 'top', label: 'Top' },
  { id: 'side', label: 'Side' },
  { id: 'iso', label: 'ISO' },
]
</script>

<template>
  <div class="drawing-maker">
    <div class="toolbar">
      <div class="file-controls">
        <label class="btn-upload">
          <input type="file" accept=".step,.stp" @change="onFileChange" hidden />
          <span class="material-icons">upload_file</span>
          {{ t('Upload STEP') }}
        </label>
        <span v-if="currentFile" class="file-name">{{ currentFile.name }}</span>
      </div>

      <div class="tools-group">
        <button
          class="tool-btn"
          :class="{ active: viewMode === '3d' }"
          @click="viewMode = '3d'"
          title="3D View"
        >
          <span class="material-icons">view_in_ar</span>
          3D
        </button>
        <button
          class="tool-btn"
          :class="{ active: viewMode === '2d' }"
          @click="viewMode = '2d'"
          title="2D Drawing"
        >
          <span class="material-icons">square_foot</span>
          2D
        </button>
        <div class="divider"></div>
        <button
          v-if="viewMode === '3d'"
          v-for="view in views"
          :key="view.id"
          class="tool-btn"
          @click="setView(view.id as any)"
          :title="view.label"
        >
          {{ view.label }}
        </button>
        <div v-if="viewMode === '3d'" class="divider"></div>
        <button
          v-if="viewMode === '3d'"
          v-for="tool in tools"
          :key="tool.id"
          class="tool-btn"
          :class="{ active: selectedTool === tool.id }"
          @click="addAnnotation(tool.id)"
          :title="tool.label"
        >
          <span class="material-icons">{{ tool.icon }}</span>
        </button>
        <div class="divider"></div>
        <button class="tool-btn export-btn" @click="exportPdf" title="Export PDF">
          <span class="material-icons">picture_as_pdf</span>
          Export
        </button>
      </div>
    </div>

    <div class="workspace">
      <div class="viewport">
        <Viewer3D 
          v-if="viewMode === '3d'"
          ref="viewerRef"
          :file="currentFile" 
          :active-tool="selectedTool"
          @add-annotation="(type: string, pos: { x: number, y: number }) => annotations.push(`${type} at (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`)"
        />
        <TechnicalDrawing2D
          v-else
          :file="currentFile"
          @drawing-ready="onDrawingReady"
        />
      </div>
      
      <div class="sidebar">
        <h3>{{ t('Annotations') }}</h3>
        <div v-if="annotations.length === 0" class="empty-state">
          {{ t('No annotations added') }}
        </div>
        <ul v-else class="annotation-list">
          <li v-for="(ann, idx) in annotations" :key="idx" class="annotation-item">
            <span class="material-icons">label</span>
            {{ ann }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.drawing-maker {
  display: flex;
  flex-direction: column;
  height: 600px;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 1rem;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid rgb(var(--accent-500-rgb) / 15%);
  background: rgb(var(--accent-500-rgb) / 2%);
}

.file-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-upload {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--accent-500);
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.1);
  }

  .material-icons {
    font-size: 18px;
  }
}

.file-name {
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.8;
}

.tools-group {
  display: flex;
  gap: 0.5rem;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  background: var(--card);
  color: var(--text);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgb(var(--accent-500-rgb) / 10%);
    border-color: var(--accent-500);
  }

  &.active {
    background: var(--accent-500);
    color: white;
    border-color: var(--accent-500);
  }

  .material-icons {
    font-size: 20px;
  }
}

.divider {
  width: 1px;
  height: 24px;
  background: rgb(var(--accent-500-rgb) / 20%);
  margin: 0 0.5rem;
}

.export-btn {
  width: auto;
  padding: 0 0.75rem;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  
  .material-icons {
    font-size: 16px;
  }
}

.workspace {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.viewport {
  flex: 1;
  background: #f0f0f0;
  position: relative;
}

.sidebar {
  width: 250px;
  padding: 1rem;
  border-left: 1px solid rgb(var(--accent-500-rgb) / 15%);
  background: var(--card);
  overflow-y: auto;

  h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text);
  }
}

.empty-state {
  font-size: 0.8rem;
  color: var(--neutral);
  text-align: center;
  padding: 2rem 0;
}

.annotation-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.annotation-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-radius: 0.25rem;
  font-size: 0.8rem;
  color: var(--text);

  .material-icons {
    font-size: 16px;
    color: var(--accent-500);
  }
}
</style>

