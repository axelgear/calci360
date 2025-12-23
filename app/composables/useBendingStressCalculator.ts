/**
 * useBendingStressCalculator - Composable for beam bending stress analysis
 * Integrates with metal weight profiles and materials
 */

import type {
  BendingStressCalculatorConfig,
  BeamConfiguration,
  BeamLoad,
  BeamSupport,
  BeamProfile,
  BeamMaterial,
  BeamType,
  CalculationResults,
  PointLoad,
  UniformDistributedLoad,
  TriangularLoad,
  AppliedMoment,
  LoadType,
  SupportType,
} from '~/components/Calculator/calculators/bending-stress/types'
import { beamPresets, loadPresets } from '~/components/Calculator/calculators/bending-stress/types'
import { analyzeBeam, calculateSectionModulus } from '~/components/Calculator/calculators/bending-stress/formulas'
import {
  metalProfiles,
  getProfile,
  allMaterials,
  getMaterial,
  type ProfileDefinition,
  type Material,
} from '~/components/Calculator/calculators/metal-weight/types'

/* Re-export for consumers */
export { beamPresets, loadPresets }

/* ============ DEFAULT VALUES ============ */

const defaultBeamLength = 4 /* meters */
const defaultProfile = 'i-beam'
const defaultMaterial = 'steel-a36'

/* ============ COMPOSABLE ============ */

export function useBendingStressCalculator(config: Ref<BendingStressCalculatorConfig>) {
  /* ============ BEAM CONFIGURATION ============ */
  
  const beamType = ref<BeamType>('simply-supported')
  const beamLength = ref(defaultBeamLength)
  
  /* Supports */
  const supports = ref<BeamSupport[]>([
    { id: 'support-1', type: 'pinned', position: 0 },
    { id: 'support-2', type: 'roller', position: 1 },
  ])
  
  /* Loads */
  const loads = ref<BeamLoad[]>([])
  
  /* ============ PROFILE SELECTION ============ */
  
  const selectedProfileId = ref(defaultProfile)
  const selectedProfile = computed<ProfileDefinition | undefined>(() =>
    getProfile(selectedProfileId.value)
  )
  
  /* Profile dimensions (from metal weight inputs) */
  const profileDimensions = reactive<Record<string, number>>({})
  
  /* Initialize dimensions when profile changes */
  watch(selectedProfileId, () => {
    if (selectedProfile.value) {
      selectedProfile.value.inputs.forEach(input => {
        if (input.id !== 'length') {
          profileDimensions[input.id] = input.default ?? 0.05
        }
      })
    }
  }, { immediate: true })
  
  /* Calculated beam profile properties */
  const beamProfile = computed<BeamProfile>(() => {
    const { I, S, c, A } = calculateSectionModulus(selectedProfileId.value, profileDimensions)
    return {
      id: selectedProfileId.value,
      name: selectedProfile.value?.name ?? 'Unknown',
      area: A,
      momentOfInertia: I,
      sectionModulus: S,
      centroidY: c,
    }
  })
  
  /* ============ MATERIAL SELECTION ============ */
  
  const selectedMaterialId = ref(defaultMaterial)
  const selectedMaterial = computed<Material | undefined>(() =>
    getMaterial(selectedMaterialId.value)
  )
  
  /* Beam material properties */
  const beamMaterial = computed<BeamMaterial>(() => {
    const mat = selectedMaterial.value
    return {
      id: mat?.id ?? 'steel-a36',
      name: mat?.name ?? 'Steel A36',
      youngsModulus: mat?.mechanical?.youngsModulus ?? 200e9, /* 200 GPa for steel */
      yieldStrength: mat?.mechanical?.yieldStrength ?? 250e6, /* 250 MPa for A36 */
      density: mat?.density ?? 7850,
      allowableBendingStress: mat?.mechanical?.yieldStrength ? mat.mechanical.yieldStrength * 0.66 : 165e6,
      allowableShearStress: mat?.mechanical?.yieldStrength ? mat.mechanical.yieldStrength * 0.4 : 100e6,
    }
  })
  
  /* ============ BEAM TYPE PRESETS ============ */
  
  function setBeamType(type: BeamType) {
    beamType.value = type
    const preset = beamPresets.find(p => p.beamType === type)
    if (preset) {
      supports.value = preset.supports.map((s, i) => ({
        id: `support-${i + 1}`,
        ...s,
      }))
    }
  }
  
  /* ============ LOAD MANAGEMENT ============ */
  
  let loadIdCounter = 0
  
  function addLoad(type: LoadType, position = 0.5): string {
    const id = `load-${++loadIdCounter}`
    
    switch (type) {
      case 'point':
        loads.value.push({
          id,
          type: 'point',
          position,
          magnitude: 10000, /* 10 kN */
          direction: 'down',
        } as PointLoad)
        break
        
      case 'udl':
        loads.value.push({
          id,
          type: 'udl',
          position,
          magnitude: 5000, /* 5 kN/m */
          startPosition: 0.2,
          endPosition: 0.8,
          direction: 'down',
        } as UniformDistributedLoad)
        break
        
      case 'triangular':
        loads.value.push({
          id,
          type: 'triangular',
          position,
          magnitudeStart: 0,
          magnitudeEnd: 10000, /* 10 kN/m at max */
          startPosition: 0,
          endPosition: 1,
          direction: 'down',
        } as TriangularLoad)
        break
        
      case 'moment':
        loads.value.push({
          id,
          type: 'moment',
          position,
          magnitude: 5000, /* 5 kN·m */
          direction: 'clockwise',
        } as AppliedMoment)
        break
    }
    
    return id
  }
  
  function removeLoad(loadId: string) {
    const index = loads.value.findIndex(l => l.id === loadId)
    if (index !== -1) {
      loads.value.splice(index, 1)
    }
  }
  
  function updateLoad(loadId: string, updates: Partial<BeamLoad>) {
    const load = loads.value.find(l => l.id === loadId)
    if (load) {
      Object.assign(load, updates)
    }
  }
  
  function clearLoads() {
    loads.value = []
  }
  
  /* ============ SUPPORT MANAGEMENT ============ */
  
  let supportIdCounter = 2 /* Start after initial supports */
  
  function addSupport(type: SupportType, position = 0.5): string {
    const id = `support-${++supportIdCounter}`
    supports.value.push({ id, type, position })
    return id
  }
  
  function removeSupport(supportId: string) {
    const index = supports.value.findIndex(s => s.id === supportId)
    if (index !== -1) {
      supports.value.splice(index, 1)
    }
  }
  
  function updateSupport(supportId: string, updates: Partial<BeamSupport>) {
    const support = supports.value.find(s => s.id === supportId)
    if (support) {
      Object.assign(support, updates)
    }
  }
  
  /* ============ BEAM CONFIGURATION ============ */
  
  const beamConfig = computed<BeamConfiguration>(() => ({
    type: beamType.value,
    length: beamLength.value,
    supports: supports.value,
    loads: loads.value,
  }))
  
  /* ============ CALCULATION RESULTS ============ */
  
  const calculationResults = computed<CalculationResults | null>(() => {
    try {
      if (supports.value.length === 0) return null
      
      return analyzeBeam(
        beamConfig.value,
        beamProfile.value,
        beamMaterial.value
      )
    } catch (error) {
      console.error('Beam analysis error:', error)
      return null
    }
  })
  
  /* ============ FORMATTED RESULTS ============ */
  
  const formattedMaxBendingStress = computed(() => {
    if (!calculationResults.value) return '—'
    const stress = calculationResults.value.maxBendingStress / 1e6 /* Convert to MPa */
    return `${stress.toFixed(2)} MPa`
  })
  
  const formattedMaxShearStress = computed(() => {
    if (!calculationResults.value) return '—'
    const stress = calculationResults.value.maxShearStress / 1e6 /* Convert to MPa */
    return `${stress.toFixed(2)} MPa`
  })
  
  const formattedMaxMoment = computed(() => {
    if (!calculationResults.value) return '—'
    const moment = calculationResults.value.maxMoment / 1000 /* Convert to kN·m */
    return `${moment.toFixed(2)} kN·m`
  })
  
  const formattedMaxShear = computed(() => {
    if (!calculationResults.value) return '—'
    const shear = calculationResults.value.maxShear / 1000 /* Convert to kN */
    return `${shear.toFixed(2)} kN`
  })
  
  const formattedMaxDeflection = computed(() => {
    if (!calculationResults.value) return '—'
    const deflection = calculationResults.value.maxDeflection * 1000 /* Convert to mm */
    return `${deflection.toFixed(2)} mm`
  })
  
  const formattedSafetyFactor = computed(() => {
    if (!calculationResults.value) return '—'
    return calculationResults.value.safetyFactor.toFixed(2)
  })
  
  /* Section properties */
  const formattedMomentOfInertia = computed(() => {
    const I = beamProfile.value.momentOfInertia * 1e8 /* Convert m⁴ to cm⁴ */
    return `${I.toFixed(2)} cm⁴`
  })
  
  const formattedSectionModulus = computed(() => {
    const S = beamProfile.value.sectionModulus * 1e6 /* Convert m³ to cm³ */
    return `${S.toFixed(2)} cm³`
  })
  
  const formattedArea = computed(() => {
    const A = beamProfile.value.area * 1e4 /* Convert m² to cm² */
    return `${A.toFixed(2)} cm²`
  })
  
  /* ============ RETURN ============ */
  
  return {
    /* Configuration */
    beamType,
    beamLength,
    supports,
    loads,
    beamConfig,
    
    /* Profile & Material */
    selectedProfileId,
    selectedProfile,
    profileDimensions,
    beamProfile,
    selectedMaterialId,
    selectedMaterial,
    beamMaterial,
    
    /* Profile & Material lists */
    metalProfiles,
    allMaterials,
    
    /* Presets */
    beamPresets,
    loadPresets,
    
    /* Actions */
    setBeamType,
    addLoad,
    removeLoad,
    updateLoad,
    clearLoads,
    addSupport,
    removeSupport,
    updateSupport,
    
    /* Results */
    calculationResults,
    formattedMaxBendingStress,
    formattedMaxShearStress,
    formattedMaxMoment,
    formattedMaxShear,
    formattedMaxDeflection,
    formattedSafetyFactor,
    formattedMomentOfInertia,
    formattedSectionModulus,
    formattedArea,
  }
}

