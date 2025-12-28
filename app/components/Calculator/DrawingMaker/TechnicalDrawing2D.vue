<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as THREE from 'three'
import occtimportjs from 'occt-import-js'
import { GDTSymbols, MaterialConditions, WeldingSymbols, SurfaceTexture, type FeatureControlFrame } from './GDTSymbols'

const props = defineProps<{
  file?: File | null
}>()

const emit = defineEmits<{
  (e: 'drawing-ready', data: any): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isProcessing = ref(false)
const errorMessage = ref<string | null>(null)
const viewMode = ref<'wireframe' | 'shaded' | 'shaded-edges'>('wireframe')

// Drawing configuration
const SCALE = 10 // px per mm
const MARGIN = 50
const DRAWING_WIDTH = 1200
const DRAWING_HEIGHT = 800

interface View {
  name: string
  position: { x: number, y: number }
  width: number
  height: number
  projection: 'front' | 'top' | 'side' | 'iso'
  scale: number
  renderMode?: 'wireframe' | 'shaded' | 'shaded-edges'
}

interface Dimension {
  start: { x: number, y: number }
  end: { x: number, y: number }
  value: number
  text: string
  offset: number
  type?: 'horizontal' | 'vertical' | 'aligned' | 'radius' | 'diameter'
}

interface Annotation {
  position: { x: number, y: number }
  text: string
  type: 'datum' | 'tolerance' | 'note' | 'welding' | 'surface'
  symbol?: string
  featureControlFrame?: FeatureControlFrame
}

interface Feature {
  type: 'hole' | 'slot' | 'pocket' | 'boss' | 'thread'
  position: { x: number, y: number, z: number }
  dimensions: { [key: string]: number }
}

let meshData: any = null
let ctx: CanvasRenderingContext2D | null = null
let detectedFeatures: Feature[] = []
let edgeData: Map<string, { points: any[], normals: any[], isSharp: boolean, isOutline: boolean }> = new Map()

watch(() => props.file, (newFile) => {
  if (newFile) {
    processFile(newFile)
  }
})

async function processFile(file: File) {
  isProcessing.value = true
  errorMessage.value = null

  try {
    const buffer = await file.arrayBuffer()
    
    // Initialize OCCT
    const occt = await occtimportjs({
      locateFile: (name: string) => `/${name}`
    })
    
    // Process STEP file
    const result = occt.ReadStepFile(new Uint8Array(buffer), null)
    
    if (!result || !result.meshes || result.meshes.length === 0) {
      throw new Error('No mesh data found in STEP file')
    }

    meshData = result
    generateDrawing()

  } catch (err: any) {
    console.error('Error processing file:', err)
    errorMessage.value = err?.message || 'Failed to process file'
  } finally {
    isProcessing.value = false
  }
}

function generateDrawing() {
  if (!canvasRef.value || !meshData) return
  
  const canvas = canvasRef.value
  canvas.width = DRAWING_WIDTH
  canvas.height = DRAWING_HEIGHT
  
  ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas with white background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, DRAWING_WIDTH, DRAWING_HEIGHT)

  // Calculate bounding box from mesh data
  const bounds = calculateBounds(meshData)
  
  // Detect features (holes, slots, etc.)
  detectedFeatures = detectFeatures(meshData, bounds)
  
  // Define views layout
  const views: View[] = [
    {
      name: 'FRONT VIEW',
      position: { x: MARGIN, y: MARGIN },
      width: 400,
      height: 300,
      projection: 'front',
      scale: calculateScale(bounds, 400, 300)
    },
    {
      name: 'TOP VIEW',
      position: { x: MARGIN, y: 400 },
      width: 400,
      height: 300,
      projection: 'top',
      scale: calculateScale(bounds, 400, 300)
    },
    {
      name: 'SIDE VIEW',
      position: { x: 500, y: MARGIN },
      width: 300,
      height: 300,
      projection: 'side',
      scale: calculateScale(bounds, 300, 300)
    },
    {
      name: 'SECTION A-A',
      position: { x: 850, y: 400 },
      width: 300,
      height: 300,
      projection: 'front', // Section view based on front
      scale: calculateScale(bounds, 300, 300) * 0.8
    }
  ]

  // Draw each view
  views.forEach((view, index) => {
    drawView(view, bounds, index === 3) // Last view is section
  })

  // Add title block
  drawTitleBlock()

  // Auto-generate dimensions and annotations
  let generatedDimensions: Dimension[] = []
  let generatedAnnotations: Annotation[] = []
  
  const firstView = views[0]
  if (firstView) {
    generatedDimensions = generateDimensions(bounds, firstView, detectedFeatures)
    generatedDimensions.forEach(dim => drawDimension(dim))

    // Add GD&T annotations based on detected features
    generatedAnnotations = generateGDTAnnotations(firstView, detectedFeatures, bounds)
    generatedAnnotations.forEach(ann => drawAnnotation(ann))
    
    // Add section line on front view
    drawSectionLine(firstView)
  }

  // Emit the drawing data
  emit('drawing-ready', {
    canvas: canvas.toDataURL(),
    bounds,
    views,
    dimensions: generatedDimensions,
    features: detectedFeatures,
    annotations: generatedAnnotations
  })
}

function calculateBounds(meshData: any) {
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

  meshData.meshes.forEach((mesh: any) => {
    const positions = mesh.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      minX = Math.min(minX, positions[i])
      maxX = Math.max(maxX, positions[i])
      minY = Math.min(minY, positions[i + 1])
      maxY = Math.max(maxY, positions[i + 1])
      minZ = Math.min(minZ, positions[i + 2])
      maxZ = Math.max(maxZ, positions[i + 2])
    }
  })

  return {
    min: { x: minX, y: minY, z: minZ },
    max: { x: maxX, y: maxY, z: maxZ },
    size: {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ
    }
  }
}

function calculateScale(bounds: any, viewWidth: number, viewHeight: number): number {
  const padding = 0.8 // 80% of view area
  const scaleX = (viewWidth * padding) / bounds.size.x
  const scaleY = (viewHeight * padding) / bounds.size.y
  return Math.min(scaleX, scaleY)
}

function drawView(view: View, bounds: any, isSection: boolean = false) {
  if (!ctx) return

  // Draw view border
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2
      ctx.strokeRect(view.position.x, view.position.y, view.width, view.height)

  // Draw view title
      ctx.font = 'bold 14px Arial'
      ctx.fillStyle = 'black'
      ctx.textAlign = 'center'
      ctx.fillText(view.name, view.position.x + view.width / 2, view.position.y - 10)

  // Set up clipping region
      ctx.save()
      ctx.beginPath()
      ctx.rect(view.position.x, view.position.y, view.width, view.height)
      ctx.clip()

  // Draw projected geometry
  if (isSection) {
    drawSectionGeometry(view, bounds)
  } else {
    drawProjectedGeometry(view, bounds)
  }

  // Draw centerlines for holes
  drawCenterlines(view, bounds)

      ctx.restore()
}

function drawProjectedGeometry(view: View, bounds: any) {
  if (!ctx || !meshData) return

  const context = ctx // Capture ctx to avoid null checks
  const centerX = view.position.x + view.width / 2
  const centerY = view.position.y + view.height / 2
  const renderMode = view.renderMode || viewMode.value

  // Clear previous edge data
  edgeData.clear()
  
  // Pre-process edges for better curve detection
  preprocessEdges(meshData, view, bounds, centerX, centerY)

  meshData.meshes.forEach((mesh: any) => {
    const positions = mesh.attributes.position.array
    const normals = mesh.attributes.normal?.array
    const indices = mesh.index?.array || []

    if (renderMode === 'shaded' || renderMode === 'shaded-edges') {
      // Draw filled triangles for shaded mode
      if (indices.length > 0) {
        const triangles: any[] = []
        
        // Collect and sort triangles by depth
        for (let i = 0; i < indices.length; i += 3) {
          const points = [
            projectPoint(positions, indices[i], view, bounds, centerX, centerY),
            projectPoint(positions, indices[i + 1], view, bounds, centerX, centerY),
            projectPoint(positions, indices[i + 2], view, bounds, centerX, centerY)
          ]

          if (points[0] && points[1] && points[2]) {
            // Calculate average Z for depth sorting
            let avgZ = 0
            if (view.projection === 'front') {
              avgZ = (positions[indices[i] * 3 + 2] + positions[indices[i + 1] * 3 + 2] + positions[indices[i + 2] * 3 + 2]) / 3
            } else if (view.projection === 'top') {
              avgZ = (positions[indices[i] * 3 + 1] + positions[indices[i + 1] * 3 + 1] + positions[indices[i + 2] * 3 + 1]) / 3
            } else if (view.projection === 'side') {
              avgZ = (positions[indices[i] * 3] + positions[indices[i + 1] * 3] + positions[indices[i + 2] * 3]) / 3
            }

            triangles.push({
              points,
              indices: [indices[i], indices[i + 1], indices[i + 2]],
              depth: avgZ
            })
          }
        }

        // Sort triangles by depth (painter's algorithm)
        triangles.sort((a, b) => b.depth - a.depth)

        // Draw triangles
        triangles.forEach(triangle => {
          // Calculate face normal for shading
          let brightness = 0.7
          if (normals) {
            const n1 = triangle.indices[0] * 3
            const avgNormal = {
              x: (normals[n1] + normals[triangle.indices[1] * 3] + normals[triangle.indices[2] * 3]) / 3,
              y: (normals[n1 + 1] + normals[triangle.indices[1] * 3 + 1] + normals[triangle.indices[2] * 3 + 1]) / 3,
              z: (normals[n1 + 2] + normals[triangle.indices[1] * 3 + 2] + normals[triangle.indices[2] * 3 + 2]) / 3
            }
            
            // Lighting based on view direction
            if (view.projection === 'front') {
              brightness = Math.max(0.3, Math.min(1, 0.5 + avgNormal.z * 0.5))
            } else if (view.projection === 'top') {
              brightness = Math.max(0.3, Math.min(1, 0.5 - avgNormal.y * 0.5))
            } else if (view.projection === 'side') {
              brightness = Math.max(0.3, Math.min(1, 0.5 + avgNormal.x * 0.5))
            }
          }

          // Draw filled triangle
          const gray = Math.floor(220 * brightness)
          context.fillStyle = `rgb(${gray}, ${gray}, ${gray})`
          context.beginPath()
          context.moveTo(triangle.points[0].x, triangle.points[0].y)
          context.lineTo(triangle.points[1].x, triangle.points[1].y)
          context.lineTo(triangle.points[2].x, triangle.points[2].y)
          context.closePath()
          context.fill()
        })
      }
    }

    if (renderMode === 'wireframe' || renderMode === 'shaded-edges') {
      // Sort edges by type for proper layering
      const outlineEdges: any[] = []
      const sharpEdges: any[] = []
      const softEdges: any[] = []
      
      edgeData.forEach((edge, key) => {
        if (edge.points.length >= 2) {
          if (edge.isOutline) outlineEdges.push(edge)
          else if (edge.isSharp) sharpEdges.push(edge)
          else softEdges.push(edge)
        }
      })
      
      // Draw soft edges first (if in wireframe mode)
      if (renderMode === 'wireframe') {
        context.strokeStyle = '#cccccc'
        context.lineWidth = 0.5
        softEdges.forEach(edge => {
          context.beginPath()
          context.moveTo(edge.points[0].x, edge.points[0].y)
          context.lineTo(edge.points[1].x, edge.points[1].y)
          context.stroke()
        })
      }
      
      // Draw sharp edges
      context.strokeStyle = '#000000'
      context.lineWidth = 1
      sharpEdges.forEach(edge => {
        context.beginPath()
        context.moveTo(edge.points[0].x, edge.points[0].y)
        context.lineTo(edge.points[1].x, edge.points[1].y)
        context.stroke()
      })
      
      // Draw outline edges last (on top)
      context.strokeStyle = '#000000'
      context.lineWidth = 2
      outlineEdges.forEach(edge => {
        context.beginPath()
        context.moveTo(edge.points[0].x, edge.points[0].y)
        context.lineTo(edge.points[1].x, edge.points[1].y)
        context.stroke()
      })
      
      // Draw hidden lines
      context.setLineDash([5, 5])
      context.strokeStyle = '#999999'
      context.lineWidth = 0.5
      // TODO: Implement proper hidden line removal
      context.setLineDash([])
    }
  })
}

function drawSectionGeometry(view: View, bounds: any) {
  if (!ctx || !meshData) return
  
  const context = ctx // Capture ctx to avoid null checks
  const centerX = view.position.x + view.width / 2
  const centerY = view.position.y + view.height / 2
  
  // Define section plane (through middle of object where section line A-A is)
  const sectionY = bounds.min.y + bounds.size.y / 2
  const tolerance = bounds.size.y * 0.01 // Small tolerance for section plane
  
  // Collect cross-section polygons
  const sectionPolygons: Array<Array<{x: number, y: number}>> = []
  const holePolygons: Array<Array<{x: number, y: number}>> = []
  
  // Process mesh to find intersections with section plane
  meshData.meshes.forEach((mesh: any) => {
    const positions = mesh.attributes.position.array
    const indices = mesh.index?.array || []
    
    // Group connected edges to form polygons
    const edgeMap = new Map<string, Array<{x: number, z: number}>>()
    
    for (let i = 0; i < indices.length; i += 3) {
      const v1 = {
        x: positions[indices[i] * 3],
        y: positions[indices[i] * 3 + 1],
        z: positions[indices[i] * 3 + 2]
      }
      const v2 = {
        x: positions[indices[i + 1] * 3],
        y: positions[indices[i + 1] * 3 + 1],
        z: positions[indices[i + 1] * 3 + 2]
      }
      const v3 = {
        x: positions[indices[i + 2] * 3],
        y: positions[indices[i + 2] * 3 + 1],
        z: positions[indices[i + 2] * 3 + 2]
      }
      
      // Check if triangle intersects section plane
      const vertices = [v1, v2, v3]
      const edges = [[0, 1], [1, 2], [2, 0]]
      
      edges.forEach(([a, b]) => {
        const va = vertices[a]
        const vb = vertices[b]
        
        // Check if edge crosses section plane
        if ((va.y - sectionY) * (vb.y - sectionY) < 0) {
          const t = (sectionY - va.y) / (vb.y - va.y)
          const intersectionX = va.x + t * (vb.x - va.x)
          const intersectionZ = va.z + t * (vb.z - va.z)
          
          // Store intersection point
          const key = `${intersectionX.toFixed(2)},${intersectionZ.toFixed(2)}`
          if (!edgeMap.has(key)) {
            edgeMap.set(key, [])
          }
          edgeMap.get(key)!.push({ x: intersectionX, z: intersectionZ })
        }
      })
    }
  })
  
  // Draw section view with proper geometry
  context.strokeStyle = '#000000'
  context.lineWidth = 2
  
  // For now, draw a simplified section based on bounds
  // In a real implementation, we'd trace the actual section contours
  const scale = view.scale
  const sectionWidth = bounds.size.x * scale
  const sectionHeight = bounds.size.z * scale
  
  // Draw outer boundary
  context.beginPath()
  context.rect(centerX - sectionWidth/2, centerY - sectionHeight/2, sectionWidth, sectionHeight)
  context.stroke()
  
  // Draw holes (simplified - assuming circular holes)
  // In real implementation, detect actual hole geometry
  const holeRadius = sectionWidth * 0.15
  const holeSpacing = sectionWidth * 0.3
  
  // Left hole
  context.beginPath()
  context.arc(centerX - holeSpacing, centerY, holeRadius, 0, Math.PI * 2)
  context.stroke()
  
  // Right hole
  context.beginPath()
  context.arc(centerX + holeSpacing, centerY, holeRadius, 0, Math.PI * 2)
  context.stroke()
  
  // Draw hatching only in solid areas (not in holes)
  context.save()
  
  // Create clipping path for hatching (exclude holes)
  context.beginPath()
  context.rect(centerX - sectionWidth/2, centerY - sectionHeight/2, sectionWidth, sectionHeight)
  context.arc(centerX - holeSpacing, centerY, holeRadius, 0, Math.PI * 2, true) // Counterclockwise for hole
  context.arc(centerX + holeSpacing, centerY, holeRadius, 0, Math.PI * 2, true) // Counterclockwise for hole
  context.clip()
  
  // Draw 45-degree hatching
  context.strokeStyle = '#000000'
  context.lineWidth = 0.5
  const spacing = 4
  
  for (let i = -sectionWidth; i < sectionHeight + sectionWidth; i += spacing) {
    context.beginPath()
    context.moveTo(centerX - sectionWidth/2 - 50, centerY - sectionHeight/2 + i)
    context.lineTo(centerX + sectionWidth/2 + 50, centerY - sectionHeight/2 + i - sectionWidth)
    context.stroke()
  }
  
  context.restore()
}

function drawCenterlines(view: View, bounds: any) {
  if (!ctx || !detectedFeatures) return
  
  const context = ctx // Capture ctx to avoid null checks
      ctx.save()
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 0.5
      ctx.setLineDash([10, 5, 2, 5]) // Center line pattern
  
  const centerX = view.position.x + view.width / 2
  const centerY = view.position.y + view.height / 2
  
  detectedFeatures.forEach(feature => {
    if (feature.type === 'hole') {
      const pos = projectPoint(
        new Float32Array([feature.position.x, feature.position.y, feature.position.z]),
        0, view, bounds, centerX, centerY
      )
      
      if (pos) {
        // Draw cross centerlines
        const length = 20
        context.beginPath()
        context.moveTo(pos.x - length, pos.y)
        context.lineTo(pos.x + length, pos.y)
        context.stroke()
        
        context.beginPath()
        context.moveTo(pos.x, pos.y - length)
        context.lineTo(pos.x, pos.y + length)
        context.stroke()
      }
    }
  })
  
      ctx.restore()
}

function drawSectionLine(view: View) {
  if (!ctx) return
  
  const context = ctx
  context.save()
  
  // Draw section line A-A through the center where holes would be
  const y = view.position.y + view.height / 2
  
  // Section line segments (broken at edges, not through the middle)
  context.strokeStyle = '#000000'
  context.lineWidth = 2.5
  context.setLineDash([15, 5])
  
  // Left segment
  context.beginPath()
  context.moveTo(view.position.x - 20, y)
  context.lineTo(view.position.x + 60, y)
  context.stroke()
  
  // Right segment
  context.beginPath()
  context.moveTo(view.position.x + view.width - 60, y)
  context.lineTo(view.position.x + view.width + 20, y)
  context.stroke()
  
  context.setLineDash([])
  
  // Section arrows (pointing outward)
  context.lineWidth = 2
  
  // Left arrow pointing left
  context.beginPath()
  context.moveTo(view.position.x - 10, y - 10)
  context.lineTo(view.position.x - 20, y)
  context.lineTo(view.position.x - 10, y + 10)
  context.closePath()
  context.fill()
  
  // Right arrow pointing right
  context.beginPath()
  context.moveTo(view.position.x + view.width + 10, y - 10)
  context.lineTo(view.position.x + view.width + 20, y)
  context.lineTo(view.position.x + view.width + 10, y + 10)
  context.closePath()
  context.fill()
  
  // Section labels
  context.font = 'bold 16px Arial'
  context.fillStyle = 'black'
  context.textAlign = 'center'
  
  // Draw A labels in circles
  const labelRadius = 12
  
  // Left A
  context.beginPath()
  context.arc(view.position.x - 20, y - 25, labelRadius, 0, Math.PI * 2)
  context.strokeStyle = 'black'
  context.lineWidth = 1.5
  context.stroke()
  context.fillText('A', view.position.x - 20, y - 20)
  
  // Right A
  context.beginPath()
  context.arc(view.position.x + view.width + 20, y - 25, labelRadius, 0, Math.PI * 2)
  context.stroke()
  context.fillText('A', view.position.x + view.width + 20, y - 20)
  
  context.restore()
}

function projectPoint(positions: Float32Array, index: number, view: View, bounds: any, centerX: number, centerY: number) {
  if (index * 3 + 2 >= positions.length) return null
  
  const xVal = positions[index * 3]
  const yVal = positions[index * 3 + 1]
  const zVal = positions[index * 3 + 2]
  
  if (xVal === undefined || yVal === undefined || zVal === undefined) return null
  
  const x = xVal - (bounds.min.x + bounds.size.x / 2)
  const y = yVal - (bounds.min.y + bounds.size.y / 2)
  const z = zVal - (bounds.min.z + bounds.size.z / 2)

  let projX = 0, projY = 0

  switch (view.projection) {
    case 'front':
      projX = x * view.scale
      projY = -y * view.scale
      break
    case 'top':
      projX = x * view.scale
      projY = z * view.scale
      break
    case 'side':
      projX = -z * view.scale
      projY = -y * view.scale
      break
    case 'iso':
      // Simple isometric projection
      const angle = Math.PI / 6
      projX = (x * Math.cos(angle) - z * Math.sin(angle)) * view.scale
      projY = (-y + (x * Math.sin(angle) + z * Math.cos(angle)) * 0.5) * view.scale
      break
  }

  return {
    x: centerX + projX,
    y: centerY + projY
  }
}

function isEdgeVisible(points: any[], projection: string): boolean {
  // Simplified visibility check - in real implementation would use proper algorithm
  return true
}

function preprocessEdges(meshData: any, view: View, bounds: any, centerX: number, centerY: number) {
  edgeData.clear()

  // View direction vector for visibility testing
  let viewDir = { x: 0, y: 0, z: 1 }
  if (view.projection === 'front') viewDir = { x: 0, y: 0, z: 1 }
  else if (view.projection === 'top') viewDir = { x: 0, y: -1, z: 0 }
  else if (view.projection === 'side') viewDir = { x: 1, y: 0, z: 0 }

  meshData.meshes.forEach((mesh: any) => {
    const positions = mesh.attributes.position.array
    const normals = mesh.attributes.normal?.array
    const indices = mesh.index?.array || []

    // Build edge-to-face mapping
    const edgeToFaces = new Map<string, { faceIndices: number[], normals: any[], visible: boolean[] }>()

    if (indices.length > 0) {
      for (let faceIdx = 0; faceIdx < indices.length; faceIdx += 3) {
        const i1 = indices[faceIdx]
        const i2 = indices[faceIdx + 1]
        const i3 = indices[faceIdx + 2]

        // Calculate face normal and check visibility
        let faceNormal = null
        let isVisible = true
        
        if (normals) {
          faceNormal = {
            x: (normals[i1 * 3] + normals[i2 * 3] + normals[i3 * 3]) / 3,
            y: (normals[i1 * 3 + 1] + normals[i2 * 3 + 1] + normals[i3 * 3 + 1]) / 3,
            z: (normals[i1 * 3 + 2] + normals[i2 * 3 + 2] + normals[i3 * 3 + 2]) / 3
          }
          
          // Normalize face normal
          const len = Math.sqrt(faceNormal.x * faceNormal.x + faceNormal.y * faceNormal.y + faceNormal.z * faceNormal.z)
          if (len > 0) {
            faceNormal.x /= len
            faceNormal.y /= len
            faceNormal.z /= len
          }
          
          // Check if face is visible (facing towards viewer)
          const dot = faceNormal.x * viewDir.x + faceNormal.y * viewDir.y + faceNormal.z * viewDir.z
          isVisible = dot > -0.1 // Small tolerance for near-perpendicular faces
        }

        // Process each edge of the triangle
        const edgePairs = [
          [i1, i2],
          [i2, i3],
          [i3, i1]
        ]

        edgePairs.forEach(([a, b]) => {
          const key = a < b ? `${a}-${b}` : `${b}-${a}`
          if (!edgeToFaces.has(key)) {
            edgeToFaces.set(key, { faceIndices: [], normals: [], visible: [] })
          }
          const edge = edgeToFaces.get(key)!
          edge.faceIndices.push(faceIdx)
          if (faceNormal) edge.normals.push(faceNormal)
          edge.visible.push(isVisible)
        })
      }
    }

    // Process edges and detect curves
    edgeToFaces.forEach((faceInfo, key) => {
      const indices = key.split('-').map(Number)
      if (indices.length !== 2 || indices[0] === undefined || indices[1] === undefined) return
      
      const [i1, i2] = indices
      const p1 = projectPoint(positions, i1, view, bounds, centerX, centerY)
      const p2 = projectPoint(positions, i2, view, bounds, centerX, centerY)

      if (!p1 || !p2) return

      let isSharp = false
      let isOutline = false
      let isSilhouette = false
      let shouldDraw = false

      // Check visibility of adjacent faces
      const visibleCount = faceInfo.visible.filter(v => v).length
      const hiddenCount = faceInfo.visible.filter(v => !v).length

      // Determine edge type
      if (faceInfo.faceIndices.length === 1) {
        // Boundary edge - always draw
        isOutline = true
        shouldDraw = true
      } else if (visibleCount > 0 && hiddenCount > 0) {
        // Silhouette edge (between visible and hidden face)
        isSilhouette = true
        shouldDraw = true
      } else if (faceInfo.normals.length >= 2 && visibleCount === faceInfo.visible.length) {
        // Interior edge - only draw if sharp
        const n1 = faceInfo.normals[0]
        const n2 = faceInfo.normals[1]
        
        const dot = n1.x * n2.x + n1.y * n2.y + n1.z * n2.z
        const angle = Math.acos(Math.max(-1, Math.min(1, dot)))
        
        isSharp = angle > Math.PI / 4 // 45 degrees for clearer drawings
        shouldDraw = isSharp
      }

      if (!shouldDraw) return

      // Store edge data
      const edgeKey = `${p1.x.toFixed(1)},${p1.y.toFixed(1)}-${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
      
      // Avoid duplicate edges
      if (!edgeData.has(edgeKey)) {
        edgeData.set(edgeKey, {
          points: [p1, p2],
          normals: faceInfo.normals,
          isSharp: isSharp || isSilhouette,
          isOutline
        })
      }
    })
  })
}

function projectPointFromCoords(x: number, y: number, z: number, view: View, bounds: any, centerX: number, centerY: number) {
  const relX = x - (bounds.min.x + bounds.size.x / 2)
  const relY = y - (bounds.min.y + bounds.size.y / 2)
  const relZ = z - (bounds.min.z + bounds.size.z / 2)

  let projX = 0, projY = 0

  switch (view.projection) {
    case 'front':
      projX = relX * view.scale
      projY = -relY * view.scale
      break
    case 'top':
      projX = relX * view.scale
      projY = relZ * view.scale
      break
    case 'side':
      projX = -relZ * view.scale
      projY = -relY * view.scale
      break
    case 'iso':
      const angle = Math.PI / 6
      projX = (relX * Math.cos(angle) - relZ * Math.sin(angle)) * view.scale
      projY = (-relY + (relX * Math.sin(angle) + relZ * Math.cos(angle)) * 0.5) * view.scale
      break
  }

  return {
    x: centerX + projX,
    y: centerY + projY
  }
}

function detectFeatures(meshData: any, bounds: any): Feature[] {
  const features: Feature[] = []
  
  // For now, return empty array to reduce clutter
  // In a real implementation, this would use advanced feature recognition
  // algorithms to detect holes, slots, pockets, etc.
  
  return features
}

function generateDimensions(bounds: any, view: View, features: Feature[]): Dimension[] {
  const dimensions: Dimension[] = []

  // Overall dimensions
  const startH = { x: view.position.x + 50, y: view.position.y + view.height + 30 }
  const endH = { x: view.position.x + view.width - 50, y: view.position.y + view.height + 30 }
  dimensions.push({
    start: startH,
    end: endH,
    value: bounds.size.x,
    text: `${bounds.size.x.toFixed(1)}`,
    offset: 30,
    type: 'horizontal'
  })

  const startV = { x: view.position.x - 30, y: view.position.y + 50 }
  const endV = { x: view.position.x - 30, y: view.position.y + view.height - 50 }
  dimensions.push({
    start: startV,
    end: endV,
    value: bounds.size.y,
    text: `${bounds.size.y.toFixed(1)}`,
    offset: -30,
    type: 'vertical'
  })

  // Add dimensions for detected holes
  features.forEach((feature, index) => {
    if (feature.type === 'hole' && index < 3) { // Limit to first 3 holes
      const projectedPos = projectPoint(
        new Float32Array([feature.position.x, feature.position.y, feature.position.z]),
        0, view, bounds,
        view.position.x + view.width / 2,
        view.position.y + view.height / 2
      )
      
      if (projectedPos) {
        dimensions.push({
          start: projectedPos,
          end: projectedPos,
          value: feature.dimensions.diameter || 10,
          text: `Ø${(feature.dimensions.diameter || 10).toFixed(1)}`,
          offset: 20,
          type: 'diameter'
        })
      }
    }
  })

  return dimensions
}

function generateGDTAnnotations(view: View, features: Feature[], bounds: any): Annotation[] {
  const annotations: Annotation[] = []
  
  // Add datum references - position them outside the drawing area
  // Datum A - bottom left, outside the view
  annotations.push({
    position: { x: view.position.x - 40, y: view.position.y + view.height - 30 },
    text: 'A',
    type: 'datum'
  })
  
  // Datum B - top right, outside the view
  annotations.push({
    position: { x: view.position.x + view.width + 20, y: view.position.y + 30 },
    text: 'B',
    type: 'datum'
  })
  
  // Add tolerances based on features
  features.forEach((feature, index) => {
    if (feature.type === 'hole' && index < 2) {
      const projectedPos = projectPoint(
        new Float32Array([feature.position.x, feature.position.y, feature.position.z]),
        0, view, bounds,
        view.position.x + view.width / 2,
        view.position.y + view.height / 2
      )
      
      if (projectedPos) {
        annotations.push({
          position: { 
            x: projectedPos.x + 40, 
            y: projectedPos.y - 40 
          },
        text: 'Position',
        type: 'tolerance',
        featureControlFrame: {
          characteristic: 'position',
          tolerance: '0.1',
          materialCondition: 'MMC',
          datumReferences: [
            { label: 'A' },
            { label: 'B', modifier: 'MMC' }
          ]
        }
      })
      }
    }
  })
  
  // Add surface finish
  annotations.push({
    position: { x: view.position.x + 200, y: view.position.y + 150 },
    text: 'Ra 1.6',
    type: 'surface',
    symbol: 'machined'
  })
  
  return annotations
}

function drawDimension(dim: Dimension) {
  if (!ctx) return

      ctx.save()
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 0.7
      ctx.fillStyle = 'black'
      ctx.font = '11px Arial'

  if (dim.type === 'diameter') {
    // Draw diameter dimension
    const x = dim.start.x
    const y = dim.start.y
    
    // Leader line
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 30, y - 30)
    ctx.lineTo(x + 60, y - 30)
    ctx.stroke()
    
    // Text with diameter symbol
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.fillText(dim.text, x + 65, y - 25)
    
  } else {
    // Extension lines
    const extensionLength = 15
    const gap = 3
    
    if (dim.type === 'horizontal') {
      // Extension lines
      ctx.beginPath()
      ctx.moveTo(dim.start.x, dim.start.y - gap)
      ctx.lineTo(dim.start.x, dim.start.y + extensionLength)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(dim.end.x, dim.end.y - gap)
      ctx.lineTo(dim.end.x, dim.end.y + extensionLength)
      ctx.stroke()
    } else {
      // Extension lines for vertical
      ctx.beginPath()
      ctx.moveTo(dim.start.x + gap, dim.start.y)
      ctx.lineTo(dim.start.x - extensionLength, dim.start.y)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(dim.end.x + gap, dim.end.y)
      ctx.lineTo(dim.end.x - extensionLength, dim.end.y)
      ctx.stroke()
    }

    // Dimension line
    ctx.beginPath()
    ctx.moveTo(dim.start.x, dim.start.y)
    ctx.lineTo(dim.end.x, dim.end.y)
    ctx.stroke()

    // Arrows
    const angle = Math.atan2(dim.end.y - dim.start.y, dim.end.x - dim.start.x)
    const arrowLength = 8
    const arrowAngle = Math.PI / 6

    // Start arrow
    ctx.beginPath()
    ctx.moveTo(dim.start.x, dim.start.y)
    ctx.lineTo(
      dim.start.x + arrowLength * Math.cos(angle + Math.PI - arrowAngle),
      dim.start.y + arrowLength * Math.sin(angle + Math.PI - arrowAngle)
    )
    ctx.moveTo(dim.start.x, dim.start.y)
    ctx.lineTo(
      dim.start.x + arrowLength * Math.cos(angle + Math.PI + arrowAngle),
      dim.start.y + arrowLength * Math.sin(angle + Math.PI + arrowAngle)
    )
    ctx.stroke()

    // End arrow
    ctx.beginPath()
    ctx.moveTo(dim.end.x, dim.end.y)
    ctx.lineTo(
      dim.end.x + arrowLength * Math.cos(angle - arrowAngle),
      dim.end.y + arrowLength * Math.sin(angle - arrowAngle)
    )
    ctx.moveTo(dim.end.x, dim.end.y)
    ctx.lineTo(
      dim.end.x + arrowLength * Math.cos(angle + arrowAngle),
      dim.end.y + arrowLength * Math.sin(angle + arrowAngle)
    )
    ctx.stroke()

    // Dimension text
    const midX = (dim.start.x + dim.end.x) / 2
    const midY = (dim.start.y + dim.end.y) / 2
    
    // Background for text
    const textWidth = ctx.measureText(dim.text).width
    ctx.fillStyle = 'white'
    ctx.fillRect(midX - textWidth/2 - 3, midY - 8, textWidth + 6, 16)
    
    // Text
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(dim.text, midX, midY)
  }
  
      ctx.restore()
}

function drawAnnotation(annotation: Annotation) {
  if (!ctx) return
  
  const context = ctx // Capture ctx to avoid null checks
      ctx.save()
  
  if (annotation.type === 'datum') {
    // Draw datum symbol
    const size = 20
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1.5
    ctx.fillStyle = 'black'
    
    // Triangle
    ctx.beginPath()
    ctx.moveTo(annotation.position.x - size/2, annotation.position.y + size/2)
    ctx.lineTo(annotation.position.x + size/2, annotation.position.y + size/2)
    ctx.lineTo(annotation.position.x, annotation.position.y - size/2)
    ctx.closePath()
    ctx.stroke()
    
    // Letter
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(annotation.text, annotation.position.x, annotation.position.y + 2)
    
  } else if (annotation.type === 'tolerance' && annotation.featureControlFrame) {
    // Draw feature control frame
    const fcf = annotation.featureControlFrame
    const frameHeight = 20
    const compartmentWidth = 25
    const numCompartments = 2 + (fcf.datumReferences?.length || 0)
    const frameWidth = compartmentWidth * numCompartments
    
    // Frame border
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1
    ctx.strokeRect(annotation.position.x, annotation.position.y, frameWidth, frameHeight)
    
    // Compartment lines
    for (let i = 1; i < numCompartments; i++) {
      ctx.beginPath()
      ctx.moveTo(annotation.position.x + i * compartmentWidth, annotation.position.y)
      ctx.lineTo(annotation.position.x + i * compartmentWidth, annotation.position.y + frameHeight)
      ctx.stroke()
    }
    
    // Content
    ctx.font = '11px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'black'
    
    // Symbol
    const symbol = GDTSymbols[fcf.characteristic]
    if (symbol) {
      ctx.font = '14px Arial'
      ctx.fillText(symbol.symbol, annotation.position.x + compartmentWidth/2, annotation.position.y + frameHeight/2)
    }
    
    // Tolerance
    ctx.font = '10px Arial'
    let toleranceText = fcf.tolerance
    if (fcf.materialCondition) {
      toleranceText += ` ${MaterialConditions[fcf.materialCondition]}`
    }
    ctx.fillText(toleranceText, annotation.position.x + compartmentWidth * 1.5, annotation.position.y + frameHeight/2)
    
    // Datum references
    fcf.datumReferences?.forEach((datum, index) => {
      let datumText = datum.label
      if (datum.modifier) {
        datumText += ` ${MaterialConditions[datum.modifier]}`
      }
      context.fillText(
        datumText, 
        annotation.position.x + compartmentWidth * (2.5 + index), 
        annotation.position.y + frameHeight/2
      )
    })
    
    // Leader line
    ctx.beginPath()
    ctx.moveTo(annotation.position.x + frameWidth/2, annotation.position.y + frameHeight)
    ctx.lineTo(annotation.position.x + frameWidth/2 - 20, annotation.position.y + frameHeight + 20)
    ctx.stroke()
    
    // Arrow
    ctx.beginPath()
    ctx.arc(annotation.position.x + frameWidth/2 - 20, annotation.position.y + frameHeight + 20, 3, 0, 2 * Math.PI)
    ctx.fill()
    
  } else if (annotation.type === 'surface') {
    // Draw surface texture symbol
    const size = 30
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1.5
    
    // Basic surface symbol (triangle)
    ctx.beginPath()
    ctx.moveTo(annotation.position.x, annotation.position.y)
    ctx.lineTo(annotation.position.x - size/2, annotation.position.y + size)
    ctx.lineTo(annotation.position.x + size/2, annotation.position.y + size)
    ctx.stroke()
    
    // Surface value
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(annotation.text, annotation.position.x, annotation.position.y - 5)
  }
  
      ctx.restore()
}

function drawGDTFrame(x: number, y: number, symbol: string, tolerance: string, datum: string) {
  // Legacy function - replaced by drawAnnotation
}

function drawTitleBlock() {
  if (!ctx) return

  const context = ctx // Capture ctx to avoid null checks
  const blockX = DRAWING_WIDTH - 400
  const blockY = DRAWING_HEIGHT - 180
  const blockWidth = 350
  const blockHeight = 130

  // Main border
  context.strokeStyle = 'black'
  context.lineWidth = 2
  context.strokeRect(blockX, blockY, blockWidth, blockHeight)

  // Internal divisions
  context.lineWidth = 1
  
  // Horizontal lines
  const rows = [30, 60, 90]
  rows.forEach(y => {
    context.beginPath()
    context.moveTo(blockX, blockY + y)
    context.lineTo(blockX + blockWidth, blockY + y)
    context.stroke()
  })
  
  // Vertical lines
  const cols = [150, 250]
  cols.forEach(x => {
    context.beginPath()
    context.moveTo(blockX + x, blockY)
    context.lineTo(blockX + x, blockY + blockHeight)
    context.stroke()
  })

  // Content
  context.font = 'bold 14px Arial'
  context.fillStyle = 'black'
  context.textAlign = 'left'
  
  // Title
  context.fillText('TECHNICAL DRAWING', blockX + 10, blockY + 20)
  
  // Details
  context.font = '11px Arial'
  const details = [
    { label: 'Part Name:', value: 'COMPONENT-001', x: 10, y: 45 },
    { label: 'Material:', value: 'STEEL AISI 304', x: 10, y: 75 },
    { label: 'Finish:', value: 'MACHINED', x: 10, y: 105 },
    { label: 'Scale:', value: '1:1', x: 160, y: 45 },
    { label: 'Units:', value: 'mm', x: 160, y: 75 },
    { label: 'Tolerance:', value: 'ISO 2768-mK', x: 160, y: 105 },
    { label: 'Dwg No:', value: 'DWG-001-A', x: 260, y: 45 },
    { label: 'Date:', value: new Date().toLocaleDateString(), x: 260, y: 75 },
    { label: 'Drawn:', value: 'AI System', x: 260, y: 105 },
  ]
  
  details.forEach(detail => {
    context.font = '10px Arial'
    context.fillText(detail.label, blockX + detail.x, blockY + detail.y)
    context.font = 'bold 10px Arial'
    context.fillText(detail.value, blockX + detail.x + 50, blockY + detail.y)
  })
  
  // Tolerance table
  const tolX = 20
  const tolY = DRAWING_HEIGHT - 250
  
  context.font = 'bold 11px Arial'
  context.fillText('GENERAL TOLERANCES ISO 2768-mK', tolX, tolY)
  
  context.font = '9px Arial'
  context.strokeStyle = 'black'
  context.lineWidth = 0.5
  
  // Table headers
  const headers = ['Linear', '0.5-3', '3-6', '6-30', '30-120', '120-400']
  const values = ['±0.1', '±0.1', '±0.2', '±0.3', '±0.5']
  
  headers.forEach((header, i) => {
    const x = tolX + i * 50
    context.fillText(header, x, tolY + 20)
    if (i > 0 && values[i-1]) {
      context.fillText(values[i-1] || '', x, tolY + 35)
    }
  })
  
  // Table lines
  context.beginPath()
  context.moveTo(tolX, tolY + 10)
  context.lineTo(tolX + 300, tolY + 10)
  context.moveTo(tolX, tolY + 25)
  context.lineTo(tolX + 300, tolY + 25)
  context.stroke()
}

onMounted(() => {
  // Initialize canvas if needed
})

function setViewMode(mode: 'wireframe' | 'shaded' | 'shaded-edges') {
  viewMode.value = mode
  if (meshData) {
    generateDrawing()
  }
}

async function exportDrawing(): Promise<Blob> {
  if (!canvasRef.value) {
    throw new Error('Canvas not ready')
  }

  // Convert canvas to blob
  const canvas = canvasRef.value
  const dataUrl = canvas.toDataURL('image/png')
  const parts = dataUrl.split(',')
  const base64 = parts[1] || ''
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const blob = new Blob([bytes], { type: 'image/png' })
  
  // For PDF export, would use jsPDF here
  // const pdf = new jsPDF()
  // pdf.addImage(dataUrl, 'PNG', 10, 10, 190, 140)
  // return pdf.output('blob')
  
  return blob
}

defineExpose({
  exportDrawing
})
</script>

<template>
  <div class="technical-drawing-2d">
    <div class="view-controls">
      <button 
        class="view-btn" 
        :class="{ active: viewMode === 'wireframe' }"
        @click="setViewMode('wireframe')"
        title="Wireframe View"
      >
        <span class="material-icons">grid_on</span>
      </button>
      <button 
        class="view-btn" 
        :class="{ active: viewMode === 'shaded' }"
        @click="setViewMode('shaded')"
        title="Shaded View"
      >
        <span class="material-icons">view_in_ar</span>
      </button>
      <button 
        class="view-btn" 
        :class="{ active: viewMode === 'shaded-edges' }"
        @click="setViewMode('shaded-edges')"
        title="Shaded with Edges"
      >
        <span class="material-icons">layers</span>
      </button>
    </div>
    <canvas ref="canvasRef" class="drawing-canvas"></canvas>
    <div v-if="isProcessing" class="processing">
      <div class="spinner"></div>
      <p>Generating technical drawing...</p>
    </div>
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.technical-drawing-2d {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawing-canvas {
  max-width: 100%;
  max-height: 100%;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.processing {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--accent-500);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--accent-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fee2e2;
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.view-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  background: white;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.view-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #f5f5f5;
}

.view-btn.active {
  background: var(--accent-500);
  color: white;
  border-color: var(--accent-600);
}

.view-btn .material-icons {
  font-size: 20px;
}
</style>
