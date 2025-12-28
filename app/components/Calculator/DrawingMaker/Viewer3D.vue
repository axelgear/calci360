<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { useResizeObserver } from '@vueuse/core'
import occtimportjs from 'occt-import-js'

const props = defineProps<{
  file?: File | null
  activeTool?: string | null
}>()

const emit = defineEmits<{
  (e: 'add-annotation', type: string, position: { x: number, y: number, z: number }): void
}>()

// Expose setView method to parent
defineExpose({
  setView: (view: 'front' | 'top' | 'side' | 'iso') => setCameraView(view),
  exportImage: () => exportCanvasImage()
})

const containerRef = ref<HTMLElement | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let labelRenderer: CSS2DRenderer
let controls: OrbitControls
let animationId: number
let currentMesh: THREE.Object3D | null = null
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2

function setCameraView(view: 'front' | 'top' | 'side' | 'iso') {
  if (!currentMesh || !controls) return

  const box = new THREE.Box3().setFromObject(currentMesh)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  
  // Base distance
  const fov = camera.fov * (Math.PI / 180)
  let distance = Math.abs(maxDim / 2 * Math.tan(fov / 2)) * 2.5
  distance = Math.max(distance, 1)

  const newPos = new THREE.Vector3().copy(center)

  switch (view) {
    case 'front':
      newPos.z += distance
      break
    case 'top':
      newPos.y += distance
      break
    case 'side':
      newPos.x += distance
      break
    case 'iso':
      newPos.x += distance
      newPos.y += distance
      newPos.z += distance
      break
  }

  // Animate camera to new position (simple lerp simulation via controls)
  camera.position.copy(newPos)
  camera.lookAt(center)
  controls.target.copy(center)
  controls.update()
}

function exportCanvasImage(): string {
  if (!renderer) return ''
  renderer.render(scene, camera)
  return renderer.domElement.toDataURL('image/png')
}

// Initialize Three.js scene
function init() {
  if (!containerRef.value) return

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5f5f5)
  
  // Grid
  const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc)
  scene.add(gridHelper)
  
  // Axes
  const axesHelper = new THREE.AxesHelper(1)
  scene.add(axesHelper)

  // Camera
  camera = new THREE.PerspectiveCamera(
    45,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(5, 5, 5)
  camera.lookAt(0, 0, 0)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(5, 10, 7)
  scene.add(dirLight)

  // WebGL Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)

  // CSS2D Renderer (for labels)
  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0px'
  labelRenderer.domElement.style.pointerEvents = 'none' // Allow clicks to pass through to canvas
  containerRef.value.appendChild(labelRenderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement) // Bind to canvas
  controls.enableDamping = true
  
  // Raycaster
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Event listeners
  renderer.domElement.addEventListener('click', onClick)

  animate()
}

function onClick(event: MouseEvent) {
  const container = containerRef.value
  if (!props.activeTool || !container) return
  
  const rect = container.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  
  if (scene) {
    const intersects = raycaster.intersectObjects(scene.children, true)
    
    if (intersects && intersects.length > 0 && intersects[0]) {
      const p = intersects[0].point
      if (props.activeTool) {
        addLabel(p, props.activeTool)
        emit('add-annotation', props.activeTool, p)
      }
    }
  }
}

function addLabel(position: THREE.Vector3, text: string) {
  const div = document.createElement('div')
  div.className = 'annotation-label'
  div.textContent = text
  div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  div.style.color = 'white'
  div.style.padding = '4px 8px'
  div.style.borderRadius = '4px'
  div.style.fontSize = '12px'
  div.style.fontFamily = 'sans-serif'
  
  const label = new CSS2DObject(div)
  label.position.copy(position)
  scene.add(label)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
}

function handleResize() {
  if (!containerRef.value || !camera || !renderer) return
  
  camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  labelRenderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
}

// Watch for file changes
watch(() => props.file, (newFile: File | null | undefined) => {
  if (newFile) {
    loadFile(newFile)
  }
})

async function loadFile(file: File) {
  if (currentMesh) {
    scene.remove(currentMesh)
    currentMesh = null
  }
  
  isLoading.value = true
  errorMessage.value = null

  try {
    const buffer = await file.arrayBuffer()
    
    // Initialize OCCT with custom locator for WASM
    const occt = await occtimportjs({
      locateFile: (name: string) => {
        return `/${name}`
      }
    })
    
    // Process STEP file
    const result = occt.ReadStepFile(new Uint8Array(buffer), null)

    if (!result || !result.meshes || result.meshes.length === 0) {
      throw new Error('No mesh data found in STEP file')
    }

    // Create geometry from result
    const group = new THREE.Group()
    
    // Common material
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x4a90e2,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide
    })

    for (const meshData of result.meshes) {
      // occt-import-js returns specific structure: { attributes, index, loc, name, normals, position, uv }
      const geometry = new THREE.BufferGeometry()
      
      if (meshData.attributes.position) {
          geometry.setAttribute('position', new THREE.Float32BufferAttribute(meshData.attributes.position.array, 3))
      }
      if (meshData.attributes.normal) {
          geometry.setAttribute('normal', new THREE.Float32BufferAttribute(meshData.attributes.normal.array, 3))
      }
      if (meshData.index) {
          geometry.setIndex(new THREE.Uint32BufferAttribute(meshData.index.array, 1))
      }

      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)
    }

    // Add to scene
    currentMesh = group
    scene.add(currentMesh)
    
    // Fit to view
    const box = new THREE.Box3().setFromObject(group)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    
    // Ensure we have a valid bounding box
    if (box.isEmpty()) {
       throw new Error('Geometry is empty or invalid')
    }

    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.fov * (Math.PI / 180)
    
    // Calculate distance to fit object
    let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov / 2)) 
    cameraZ *= 2.5 // Add some padding
    
    // Ensure minimum distance
    cameraZ = Math.max(cameraZ, 1)

    // Position camera
    camera.position.set(center.x + cameraZ, center.y + cameraZ, center.z + cameraZ)
    camera.lookAt(center)
    
    // Update controls target to center of object
    controls.target.copy(center)
    controls.update()
    
    // Force a render
    renderer.render(scene, camera)

  } catch (err: any) {
    console.error('Error loading STEP file:', err)
    errorMessage.value = err?.message || 'Failed to load STEP file'
    
    // Fallback to placeholder if error, so user sees SOMETHING
    // createPlaceholder()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  init()
  useResizeObserver(containerRef, handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div ref="containerRef" class="viewer-3d">
    <div v-if="!file" class="placeholder">
      <p>Upload a STEP file to view</p>
    </div>
    <div v-if="isLoading" class="loader">
      <div class="spinner"></div>
      <p>Parsing STEP file...</p>
    </div>
    <div v-if="errorMessage" class="error-msg">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.viewer-3d {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #888;
  pointer-events: none;
}

.loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: var(--accent-500);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--accent-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-msg {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fee2e2;
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #fecaca;
  z-index: 20;
}
</style>

