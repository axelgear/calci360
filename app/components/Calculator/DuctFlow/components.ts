/**
 * HVAC Component Definitions for Duct Flow Editor
 * Organized by category for easy selection
 */

export interface HvacComponent {
  id: string
  name: string
  icon: string
  category: HvacCategory
  nodeType: 'source' | 'junction' | 'terminal' | 'fitting' | 'accessory'
  description?: string
  hasCfm?: boolean /* Whether this component has CFM input */
  ductShape?: DuctShape /* Applicable duct shape */
}

export type DuctShape = 'round' | 'rectangular' | 'oval' | 'any'

export type HvacCategory = 
  | 'air-handling'
  | 'diffusers'
  | 'boots'
  | 'dampers'
  | 'ducts'
  | 'elbows'
  | 'fittings'
  | 'takeoffs'
  | 'transitions'
  | 'terminals'
  | 'stackheads'
  | 'accessories'

export const categoryLabels: Record<HvacCategory, string> = {
  'air-handling': 'Air Handling Units',
  'ducts': 'Ducts',
  'elbows': 'Elbows',
  'fittings': 'Fittings & Connectors',
  'takeoffs': 'Takeoffs',
  'transitions': 'Transitions',
  'dampers': 'Dampers',
  'boots': 'Register Boots',
  'diffusers': 'Diffusers & Grilles',
  'terminals': 'Terminals',
  'stackheads': 'Stack Heads',
  'accessories': 'Accessories',
}

export const categoryIcons: Record<HvacCategory, string> = {
  'air-handling': 'hvac',
  'ducts': 'view_stream',
  'elbows': 'turn_right',
  'fittings': 'call_split',
  'takeoffs': 'subdirectory_arrow_right',
  'transitions': 'compare_arrows',
  'dampers': 'tune',
  'boots': 'crop_portrait',
  'diffusers': 'grid_4x4',
  'terminals': 'outlet',
  'stackheads': 'layers',
  'accessories': 'build',
}

/* Duct Shape Options */
export const ductShapes: { id: DuctShape; name: string; icon: string }[] = [
  { id: 'round', name: 'Round', icon: 'radio_button_unchecked' },
  { id: 'rectangular', name: 'Rectangular', icon: 'crop_landscape' },
  { id: 'oval', name: 'Oval', icon: 'panorama_horizontal' },
]

export const hvacComponents: HvacComponent[] = [
  /* ========== AIR HANDLING UNITS ========== */
  { id: 'ahu', name: 'AHU (Air Handler)', icon: 'hvac', category: 'air-handling', nodeType: 'source', description: 'Air Handling Unit' },
  { id: 'central-air-unit', name: 'Central Air Unit', icon: 'hvac', category: 'air-handling', nodeType: 'source', description: 'Central HVAC unit' },
  { id: 'rtu', name: 'RTU (Rooftop Unit)', icon: 'roofing', category: 'air-handling', nodeType: 'source', description: 'Rooftop packaged unit' },
  { id: 'fan-coil', name: 'Fan Coil Unit', icon: 'air', category: 'air-handling', nodeType: 'source' },
  { id: 'furnace', name: 'Furnace', icon: 'whatshot', category: 'air-handling', nodeType: 'source' },
  
  /* ========== DUCTS ========== */
  { id: 'round-duct', name: 'Round Duct', icon: 'radio_button_unchecked', category: 'ducts', nodeType: 'junction', ductShape: 'round' },
  { id: 'rect-duct', name: 'Rectangular Duct', icon: 'crop_landscape', category: 'ducts', nodeType: 'junction', ductShape: 'rectangular' },
  { id: 'oval-duct', name: 'Oval Duct', icon: 'panorama_horizontal', category: 'ducts', nodeType: 'junction', ductShape: 'oval' },
  { id: 'trunk-duct', name: 'Trunk Duct', icon: 'view_stream', category: 'ducts', nodeType: 'junction', ductShape: 'rectangular', description: 'Main supply trunk' },
  { id: 'wall-stack', name: 'Wall Stack', icon: 'layers', category: 'ducts', nodeType: 'junction', ductShape: 'rectangular', description: 'Vertical wall duct' },
  { id: 'flex-duct', name: 'Flexible Duct', icon: 'gesture', category: 'ducts', nodeType: 'junction', ductShape: 'round' },
  { id: 'insulated-duct', name: 'Insulated Duct', icon: 'ac_unit', category: 'ducts', nodeType: 'junction' },
  
  /* ========== ELBOWS ========== */
  { id: 'elbow-90', name: 'Elbow 90°', icon: 'turn_right', category: 'elbows', nodeType: 'fitting' },
  { id: 'elbow-45', name: 'Elbow 45°', icon: 'north_east', category: 'elbows', nodeType: 'fitting' },
  { id: 'flat-elbow', name: 'Flat Elbow', icon: 'turn_right', category: 'elbows', nodeType: 'fitting', ductShape: 'rectangular', description: 'Horizontal flat elbow' },
  { id: 'vertical-elbow', name: 'Vertical Elbow', icon: 'turn_right', category: 'elbows', nodeType: 'fitting', description: 'Vertical plane elbow' },
  { id: 'right-reverse-elbow', name: 'Right Reverse Elbow', icon: 'undo', category: 'elbows', nodeType: 'fitting', description: 'Reverse direction elbow' },
  { id: 'adjustable-elbow', name: 'Adjustable Elbow', icon: 'redo', category: 'elbows', nodeType: 'fitting' },
  { id: 'square-elbow', name: 'Square Elbow', icon: 'crop_square', category: 'elbows', nodeType: 'fitting', ductShape: 'rectangular' },
  { id: 'round-elbow', name: 'Round Elbow', icon: 'radio_button_unchecked', category: 'elbows', nodeType: 'fitting', ductShape: 'round' },
  
  /* ========== FITTINGS & CONNECTORS ========== */
  { id: 'tee', name: 'Tee', icon: 'call_split', category: 'fittings', nodeType: 'junction', description: 'T-junction' },
  { id: 'register-tee', name: 'Register Tee', icon: 'call_split', category: 'fittings', nodeType: 'junction', description: 'Tee with register' },
  { id: 'wye', name: 'Wye', icon: 'call_merge', category: 'fittings', nodeType: 'junction', description: 'Y-branch' },
  { id: 'cross', name: 'Cross', icon: 'add', category: 'fittings', nodeType: 'junction' },
  { id: 'reducer', name: 'Reducer', icon: 'unfold_less', category: 'fittings', nodeType: 'fitting', description: 'Duct size reducer' },
  { id: 'increaser', name: 'Increaser', icon: 'unfold_more', category: 'fittings', nodeType: 'fitting' },
  { id: 'offset', name: 'Offset', icon: 'view_timeline', category: 'fittings', nodeType: 'fitting' },
  { id: 'offset-collar', name: 'Offset Collar', icon: 'view_timeline', category: 'fittings', nodeType: 'fitting', description: 'Offset connection collar' },
  { id: 'start-collar', name: 'Start Collar', icon: 'radio_button_checked', category: 'fittings', nodeType: 'fitting' },
  { id: 'draw-bands', name: 'Draw Bands', icon: 'link', category: 'fittings', nodeType: 'fitting', ductShape: 'round', description: 'Duct connection bands' },
  { id: 'coupling', name: 'Coupling', icon: 'link', category: 'fittings', nodeType: 'fitting' },
  { id: 'end-cap', name: 'End Cap', icon: 'stop', category: 'fittings', nodeType: 'terminal' },
  { id: 'tee-cap', name: 'Tee Cap', icon: 'vertical_align_top', category: 'fittings', nodeType: 'fitting' },
  { id: 'plenum', name: 'Plenum', icon: 'inventory_2', category: 'fittings', nodeType: 'junction', description: 'Supply/return plenum' },
  { id: 'plenum-chamber', name: 'Plenum Chamber', icon: 'inventory_2', category: 'fittings', nodeType: 'junction', description: 'Large plenum box' },
  
  /* ========== TAKEOFFS ========== */
  { id: 'takeoff', name: 'Takeoff', icon: 'subdirectory_arrow_right', category: 'takeoffs', nodeType: 'fitting', description: 'Branch takeoff' },
  { id: 'stack-side-takeoff', name: 'Stack Side Takeoff', icon: 'subdirectory_arrow_right', category: 'takeoffs', nodeType: 'fitting', description: 'Side connection to stack' },
  { id: 'stack-top-takeoff', name: 'Stack Top Takeoff', icon: 'vertical_align_top', category: 'takeoffs', nodeType: 'fitting', description: 'Top connection to stack' },
  { id: 'round-side-takeoff', name: 'Round Side Takeoff', icon: 'subdirectory_arrow_right', category: 'takeoffs', nodeType: 'fitting', ductShape: 'round', description: 'Side takeoff for round duct' },
  { id: 'round-top-takeoff', name: 'Round Top Takeoff', icon: 'vertical_align_top', category: 'takeoffs', nodeType: 'fitting', ductShape: 'round', description: 'Top takeoff for round duct' },
  { id: 'saddle-tap', name: 'Saddle Tap', icon: 'commit', category: 'takeoffs', nodeType: 'fitting', description: 'Saddle-mounted tap' },
  { id: 'conical-takeoff', name: 'Conical Takeoff', icon: 'filter_alt', category: 'takeoffs', nodeType: 'fitting', ductShape: 'round' },
  
  /* ========== TRANSITIONS ========== */
  { id: 'trunk-transition', name: 'Trunk Transition', icon: 'compare_arrows', category: 'transitions', nodeType: 'fitting', description: 'Trunk duct transition' },
  { id: 'round-to-rect', name: 'Round to Rectangular', icon: 'compare_arrows', category: 'transitions', nodeType: 'fitting', description: 'Shape transition' },
  { id: 'rect-to-round', name: 'Rectangular to Round', icon: 'compare_arrows', category: 'transitions', nodeType: 'fitting' },
  { id: 'round-to-oval', name: 'Round to Oval', icon: 'compare_arrows', category: 'transitions', nodeType: 'fitting' },
  { id: 'angle-round-to-oval', name: 'Angle Round to Oval Boot', icon: 'compare_arrows', category: 'transitions', nodeType: 'fitting', description: 'Angled shape transition' },
  { id: 'square-to-round', name: 'Square to Round', icon: 'compare_arrows', category: 'transitions', nodeType: 'fitting' },
  { id: 'flexible-connector', name: 'Flexible Connector', icon: 'sync_alt', category: 'transitions', nodeType: 'fitting' },
  
  /* ========== DAMPERS ========== */
  { id: 'damper', name: 'Damper', icon: 'tune', category: 'dampers', nodeType: 'fitting', description: 'Inline damper' },
  { id: 'damper-section', name: 'Damper Section', icon: 'tune', category: 'dampers', nodeType: 'fitting', description: 'Duct section with damper' },
  { id: 'manual-damper', name: 'Manual Damper', icon: 'tune', category: 'dampers', nodeType: 'fitting', description: 'Manual balancing damper' },
  { id: 'butterfly-damper', name: 'Butterfly Damper', icon: 'adjust', category: 'dampers', nodeType: 'fitting', ductShape: 'round' },
  { id: 'auto-damper', name: 'Automatic Damper', icon: 'smart_toy', category: 'dampers', nodeType: 'fitting', description: 'Motorized damper' },
  { id: 'bypass-damper', name: 'By-Pass Damper', icon: 'alt_route', category: 'dampers', nodeType: 'fitting' },
  { id: 'fire-damper', name: 'Fire Damper', icon: 'local_fire_department', category: 'dampers', nodeType: 'fitting', description: 'Fire-rated damper' },
  { id: 'smoke-damper', name: 'Smoke Damper', icon: 'blur_on', category: 'dampers', nodeType: 'fitting' },
  { id: 'backdraft-damper', name: 'Backdraft Damper', icon: 'flip', category: 'dampers', nodeType: 'fitting' },
  { id: 'zone-damper', name: 'Zone Damper', icon: 'view_module', category: 'dampers', nodeType: 'fitting' },
  
  /* ========== REGISTER BOOTS ========== */
  { id: 'register-boot', name: 'Register Boot', icon: 'crop_portrait', category: 'boots', nodeType: 'fitting', description: 'Standard register boot' },
  { id: 'angle-boot-90', name: '90° Angle Register Boot', icon: 'turn_right', category: 'boots', nodeType: 'fitting', description: '90° transition boot' },
  { id: 'angle-boot-45', name: '45° Angle Boot', icon: 'north_east', category: 'boots', nodeType: 'fitting' },
  { id: 'ceiling-boot', name: 'Ceiling Boot', icon: 'crop_square', category: 'boots', nodeType: 'fitting' },
  { id: 'floor-boot', name: 'Floor Boot', icon: 'crop_portrait', category: 'boots', nodeType: 'fitting' },
  { id: 'wall-boot', name: 'Wall Boot', icon: 'crop_portrait', category: 'boots', nodeType: 'fitting' },
  { id: 'stack-boot', name: 'Stack Boot', icon: 'layers', category: 'boots', nodeType: 'fitting', description: 'Boot for stack connection' },
  { id: 'center-end-register-boot', name: 'Center End Register Boot', icon: 'crop_portrait', category: 'boots', nodeType: 'fitting' },
  { id: 'universal-boot', name: 'Universal Boot', icon: 'extension', category: 'boots', nodeType: 'fitting' },
  
  /* ========== DIFFUSERS & GRILLES ========== */
  { id: 'air-diffuser', name: 'Air Diffuser', icon: 'blur_circular', category: 'diffusers', nodeType: 'terminal', hasCfm: true },
  { id: 'ceiling-diffuser', name: 'Ceiling Diffuser', icon: 'grid_4x4', category: 'diffusers', nodeType: 'terminal', hasCfm: true },
  { id: 'linear-diffuser', name: 'Linear Diffuser', icon: 'view_week', category: 'diffusers', nodeType: 'terminal', hasCfm: true },
  { id: 'floor-diffuser', name: 'Floor Diffuser', icon: 'view_module', category: 'diffusers', nodeType: 'terminal', hasCfm: true },
  { id: 'return-grille', name: 'Return Air Grille', icon: 'grid_on', category: 'diffusers', nodeType: 'terminal', hasCfm: true },
  { id: 'return-filter-grille', name: 'Return Air Filter Grille', icon: 'filter_alt', category: 'diffusers', nodeType: 'terminal', hasCfm: true },
  { id: 'supply-register', name: 'Supply Register', icon: 'grid_4x4', category: 'diffusers', nodeType: 'terminal', hasCfm: true },
  { id: 'return-register', name: 'Return Register', icon: 'grid_on', category: 'diffusers', nodeType: 'terminal', hasCfm: true },
  
  /* ========== TERMINALS ========== */
  { id: 'register-box', name: 'Register Box', icon: 'check_box_outline_blank', category: 'terminals', nodeType: 'terminal', hasCfm: true },
  { id: 'return-box', name: 'Return Air Box', icon: 'inbox', category: 'terminals', nodeType: 'terminal', hasCfm: true },
  { id: 'return-air-floor-inlet', name: 'Return Air Floor Inlet', icon: 'keyboard', category: 'terminals', nodeType: 'terminal', hasCfm: true },
  { id: 'vav-box', name: 'VAV Box', icon: 'settings_suggest', category: 'terminals', nodeType: 'junction', hasCfm: true, description: 'Variable Air Volume box' },
  { id: 'outlet', name: 'Outlet', icon: 'outlet', category: 'terminals', nodeType: 'terminal', hasCfm: true },
  { id: 'vent-cap', name: 'Vent Cap', icon: 'lens', category: 'terminals', nodeType: 'terminal' },
  { id: 'rain-cap', name: 'Rain Cap', icon: 'umbrella', category: 'terminals', nodeType: 'terminal' },
  { id: 'dryer-hood', name: 'Dryer Hood', icon: 'roofing', category: 'terminals', nodeType: 'terminal' },
  { id: 'draft-hood', name: 'Draft Hood', icon: 'whatshot', category: 'terminals', nodeType: 'terminal' },
  
  /* ========== STACK HEADS ========== */
  { id: 'regular-stackhead', name: 'Regular Stackhead', icon: 'layers', category: 'stackheads', nodeType: 'terminal' },
  { id: 'oval-stackhead', name: 'Oval Stackhead', icon: 'panorama_horizontal', category: 'stackheads', nodeType: 'terminal', ductShape: 'oval' },
  { id: 'out-of-wall-stackhead', name: 'Out of Wall Stackhead', icon: 'layers', category: 'stackheads', nodeType: 'terminal' },
  { id: 'horizontal-stack-head', name: 'Horizontal Stack Head', icon: 'view_stream', category: 'stackheads', nodeType: 'terminal' },
  { id: 'roof-flashing', name: 'Roof Flashing', icon: 'home', category: 'stackheads', nodeType: 'terminal' },
  
  /* ========== ACCESSORIES ========== */
  { id: 'turning-vanes', name: 'Turning Vanes', icon: 'view_carousel', category: 'accessories', nodeType: 'fitting', description: 'Vanes & Rails' },
  { id: 'baffle', name: 'Baffle', icon: 'view_column', category: 'accessories', nodeType: 'fitting' },
  { id: 'silencer', name: 'Silencer', icon: 'volume_off', category: 'accessories', nodeType: 'fitting' },
  { id: 'access-panel', name: 'Access Panel', icon: 'door_sliding', category: 'accessories', nodeType: 'accessory' },
  { id: 'insulated-sleeve', name: 'Insulated Pipe Sleeve', icon: 'circle', category: 'accessories', nodeType: 'fitting' },
  { id: 'drain-pan', name: 'Drain Pan', icon: 'water_drop', category: 'accessories', nodeType: 'accessory' },
  { id: 'dryer-box', name: 'Dryer Box', icon: 'dry_cleaning', category: 'accessories', nodeType: 'accessory' },
  { id: 'hanger', name: 'Duct Hanger', icon: 'vertical_align_top', category: 'accessories', nodeType: 'accessory' },
  { id: 'damper-motor', name: 'Damper Motor', icon: 'precision_manufacturing', category: 'accessories', nodeType: 'accessory' },
]

/* Get components by category */
export function getComponentsByCategory(category: HvacCategory): HvacComponent[] {
  return hvacComponents.filter(c => c.category === category)
}

/* Get components by duct shape */
export function getComponentsByShape(shape: DuctShape): HvacComponent[] {
  return hvacComponents.filter(c => !c.ductShape || c.ductShape === shape || c.ductShape === 'any')
}

/* Get component by ID */
export function getComponent(id: string): HvacComponent | undefined {
  return hvacComponents.find(c => c.id === id)
}

/* Get all categories with components */
export function getCategoriesWithComponents(): { category: HvacCategory; label: string; icon: string; components: HvacComponent[] }[] {
  const categories: HvacCategory[] = [
    'air-handling',
    'ducts',
    'elbows',
    'fittings',
    'takeoffs',
    'transitions',
    'dampers',
    'boots',
    'diffusers',
    'terminals',
    'stackheads',
    'accessories',
  ]
  
  return categories.map(cat => ({
    category: cat,
    label: categoryLabels[cat],
    icon: categoryIcons[cat],
    components: getComponentsByCategory(cat),
  }))
}

/* Common draggable components for quick access */
export const quickAccessComponents = [
  'ceiling-diffuser',
  'tee',
  'wye',
  'elbow-90',
  'reducer',
  'takeoff',
  'damper',
  'register-boot',
]

