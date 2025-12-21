/**
 * useDuctSizingCalculator - Composable for HVAC Duct Sizing Calculator
 * Provides reactive state and methods for designing duct systems
 */

import type {
  DuctSystem,
  DuctNode,
  DuctSegment,
  DuctDimensions,
  NodeType,
  SegmentFitting,
  SystemResults,
} from '~/components/Calculator/calculators/hvac/duct-sizing/types'
import { calculateSystem } from '~/components/Calculator/calculators/hvac/duct-sizing/calculations'
import { airConditions, defaultAirCondition } from '~/components/Calculator/calculators/hvac/duct-sizing/air-properties'
import { allFittings, getFittingsByCategory } from '~/components/Calculator/calculators/hvac/duct-sizing/fittings'

/* ========== DEFAULT SYSTEM ========== */

function createDefaultSystem(): DuctSystem {
  return {
    id: 'system-1',
    name: 'New Duct System',
    designMethod: 'equal-friction',
    targetFriction: 1.0, /* Pa/m */
    maxVelocity: 8.0, /* m/s */
    supplyAirTemp: 13, /* °C - typical supply air */
    ambientTemp: 25, /* °C */
    airCondition: defaultAirCondition.id,
    units: 'metric',
    nodes: [
      { id: 'ahu-1', type: 'ahu', name: 'AHU', position: { x: 50, y: 200 } },
    ],
    segments: [],
  }
}

/* ========== COMPOSABLE ========== */

export function useDuctSizingCalculator() {
  /* System state */
  const system = ref<DuctSystem>(createDefaultSystem())
  
  /* Selected items for editing */
  const selectedNodeId = ref<string | null>(null)
  const selectedSegmentId = ref<string | null>(null)
  
  /* Calculation results */
  const results = ref<SystemResults | null>(null)
  
  /* UI state */
  const isAddingNode = ref(false)
  const addingNodeType = ref<NodeType>('diffuser')
  const isAddingSegment = ref(false)
  const segmentStartNodeId = ref<string | null>(null)
  
  /* ========== COMPUTED ========== */
  
  const selectedNode = computed(() => 
    system.value.nodes.find(n => n.id === selectedNodeId.value)
  )
  
  const selectedSegment = computed(() =>
    system.value.segments.find(s => s.id === selectedSegmentId.value)
  )
  
  const airCondition = computed(() =>
    airConditions.find(a => a.id === system.value.airCondition) ?? defaultAirCondition
  )
  
  const totalCFM = computed(() => results.value?.totalCFM ?? 0)
  
  const criticalPathPressure = computed(() => results.value?.criticalPathPressure ?? 0)
  
  /* ========== NODE METHODS ========== */
  
  function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  function addNode(type: NodeType, name: string, position: { x: number; y: number }, cfm?: number, componentId?: string): DuctNode {
    const node: DuctNode = {
      id: generateId(type),
      type,
      name,
      position,
      cfm,
      componentId,
    }
    system.value.nodes.push(node)
    recalculate()
    return node
  }
  
  function updateNode(nodeId: string, updates: Partial<DuctNode>): void {
    const node = system.value.nodes.find(n => n.id === nodeId)
    if (node) {
      Object.assign(node, updates)
      recalculate()
    }
  }
  
  function removeNode(nodeId: string): void {
    /* Remove connected segments first */
    system.value.segments = system.value.segments.filter(
      s => s.fromNodeId !== nodeId && s.toNodeId !== nodeId
    )
    /* Remove node */
    system.value.nodes = system.value.nodes.filter(n => n.id !== nodeId)
    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null
    }
    recalculate()
  }
  
  /* ========== SEGMENT METHODS ========== */
  
  function addSegment(
    fromNodeId: string,
    toNodeId: string,
    length: number,
    fittings: SegmentFitting[] = [],
    insulated: boolean = false,
    sourceHandle?: string | null,
    targetHandle?: string | null
  ): DuctSegment {
    const segment: DuctSegment = {
      id: generateId('seg'),
      fromNodeId,
      toNodeId,
      sourceHandle,
      targetHandle,
      length,
      fittings,
      insulated,
    }
    system.value.segments.push(segment)
    recalculate()
    return segment
  }
  
  function updateSegment(segmentId: string, updates: Partial<DuctSegment>): void {
    const segment = system.value.segments.find(s => s.id === segmentId)
    if (segment) {
      Object.assign(segment, updates)
      recalculate()
    }
  }
  
  function removeSegment(segmentId: string): void {
    system.value.segments = system.value.segments.filter(s => s.id !== segmentId)
    if (selectedSegmentId.value === segmentId) {
      selectedSegmentId.value = null
    }
    recalculate()
  }
  
  function setSegmentSize(segmentId: string, size: DuctDimensions | null): void {
    const segment = system.value.segments.find(s => s.id === segmentId)
    if (segment) {
      segment.manualSize = size ?? undefined
      recalculate()
    }
  }
  
  /* ========== FITTING METHODS ========== */
  
  function addFitting(segmentId: string, fittingId: string, quantity = 1): void {
    const segment = system.value.segments.find(s => s.id === segmentId)
    if (segment) {
      const existing = segment.fittings.find(f => f.fittingId === fittingId)
      if (existing) {
        existing.quantity += quantity
      } else {
        segment.fittings.push({ fittingId, quantity })
      }
      recalculate()
    }
  }
  
  function removeFitting(segmentId: string, fittingId: string): void {
    const segment = system.value.segments.find(s => s.id === segmentId)
    if (segment) {
      segment.fittings = segment.fittings.filter(f => f.fittingId !== fittingId)
      recalculate()
    }
  }
  
  function updateFittingQuantity(segmentId: string, fittingId: string, quantity: number): void {
    const segment = system.value.segments.find(s => s.id === segmentId)
    if (segment) {
      const fitting = segment.fittings.find(f => f.fittingId === fittingId)
      if (fitting) {
        fitting.quantity = Math.max(0, quantity)
        if (fitting.quantity === 0) {
          removeFitting(segmentId, fittingId)
        } else {
          recalculate()
        }
      }
    }
  }
  
  /* ========== SYSTEM METHODS ========== */
  
  function updateSystemSettings(updates: Partial<DuctSystem>): void {
    Object.assign(system.value, updates)
    recalculate()
  }
  
  function recalculate(): void {
    if (system.value.nodes.length > 0 && system.value.segments.length > 0) {
      results.value = calculateSystem(system.value)
    } else {
      results.value = null
    }
  }
  
  function resetSystem(): void {
    system.value = createDefaultSystem()
    selectedNodeId.value = null
    selectedSegmentId.value = null
    results.value = null
  }
  
  /** Clean up invalid segments (e.g., connections from terminals or to sources) */
  function cleanupInvalidSegments(): number {
    const initialCount = system.value.segments.length
    
    system.value.segments = system.value.segments.filter(segment => {
      const fromNode = system.value.nodes.find(n => n.id === segment.fromNodeId)
      const toNode = system.value.nodes.find(n => n.id === segment.toNodeId)
      
      /* Remove if source node is a terminal (diffuser can't send air) */
      if (fromNode?.type === 'diffuser') return false
      
      /* Remove if target node is a source (AHU can't receive air) */
      if (toNode?.type === 'ahu') return false
      
      /* Remove self-connections */
      if (segment.fromNodeId === segment.toNodeId) return false
      
      /* Remove if either node doesn't exist */
      if (!fromNode || !toNode) return false
      
      return true
    })
    
    const removedCount = initialCount - system.value.segments.length
    if (removedCount > 0) {
      recalculate()
    }
    return removedCount
  }
  
  /* ========== QUICK ADD HELPERS ========== */
  
  /** Add a branch with diffuser from a junction/AHU */
  function addBranch(
    fromNodeId: string,
    diffuserName: string,
    cfm: number,
    length: number,
    fittings: SegmentFitting[] = []
  ): { node: DuctNode; segment: DuctSegment } {
    const fromNode = system.value.nodes.find(n => n.id === fromNodeId)
    if (!fromNode) throw new Error('Source node not found')
    
    /* Position the new diffuser below/right of the source */
    const newPosition = {
      x: fromNode.position.x + 150,
      y: fromNode.position.y + 100,
    }
    
    const node = addNode('diffuser', diffuserName, newPosition, cfm)
    const segment: DuctSegment = {
      id: generateId('seg'),
      fromNodeId,
      toNodeId: node.id,
      length,
      fittings,
      insulated: false,
    }
    system.value.segments.push(segment)
    recalculate()
    
    return { node, segment }
  }
  
  /** Add a junction node */
  function addJunction(
    name: string,
    position: { x: number; y: number }
  ): DuctNode {
    return addNode('junction', name, position)
  }
  
  /* ========== IMPORT/EXPORT ========== */
  
  function exportSystem(): string {
    return JSON.stringify(system.value, null, 2)
  }
  
  function importSystem(json: string): void {
    try {
      const imported = JSON.parse(json) as DuctSystem
      system.value = imported
      recalculate()
    } catch {
      console.error('Failed to import system')
    }
  }
  
  /* ========== SELECTION ========== */
  
  function selectNode(nodeId: string | null): void {
    selectedNodeId.value = nodeId
    selectedSegmentId.value = null
  }
  
  function selectSegment(segmentId: string | null): void {
    selectedSegmentId.value = segmentId
    selectedNodeId.value = null
  }
  
  function clearSelection(): void {
    selectedNodeId.value = null
    selectedSegmentId.value = null
  }
  
  /* ========== INITIAL CALCULATION ========== */
  
  onMounted(() => {
    /* Clean up any invalid segments first */
    cleanupInvalidSegments()
    recalculate()
  })
  
  /* ========== RETURN ========== */
  
  return {
    /* State */
    system,
    results,
    selectedNodeId,
    selectedSegmentId,
    selectedNode,
    selectedSegment,
    
    /* UI state */
    isAddingNode,
    addingNodeType,
    isAddingSegment,
    segmentStartNodeId,
    
    /* Computed */
    airCondition,
    totalCFM,
    criticalPathPressure,
    
    /* Data */
    airConditions,
    allFittings,
    getFittingsByCategory,
    
    /* Node methods */
    addNode,
    updateNode,
    removeNode,
    
    /* Segment methods */
    addSegment,
    updateSegment,
    removeSegment,
    setSegmentSize,
    
    /* Fitting methods */
    addFitting,
    removeFitting,
    updateFittingQuantity,
    
    /* System methods */
    updateSystemSettings,
    recalculate,
    resetSystem,
    cleanupInvalidSegments,
    
    /* Quick helpers */
    addBranch,
    addJunction,
    
    /* Selection */
    selectNode,
    selectSegment,
    clearSelection,
    
    /* Import/Export */
    exportSystem,
    importSystem,
  }
}

export default useDuctSizingCalculator

