<script setup lang="ts">
/**
 * ShapeVisual - Unified SVG visualization component
 * Supports four modes:
 * - 'area': 2D geometric shapes (rectangle, circle, triangle, etc.)
 * - 'volume': 3D isometric shapes (cube, sphere, cylinder, etc.)
 * - 'profile': Metal profile cross-sections (round bar, tube, I-beam, etc.)
 * - 'hvac': HVAC duct 3D visualizations (round/rectangular ducts)
 */
import {
  useShapeVisual,
  type ShapeMode,
  type ShapeRenderData,
  type Shape3DRenderData,
  type ShapeLabel,
  SIZE_2D,
} from '@/composables/useShapeVisual'
import { getShape2DData } from '@/composables/shape/2d'
import { getShape3DData } from '@/composables/shape/3d'
import { getProfileData } from '@/composables/shape/profile'
import { getHvacData } from '@/composables/shape/hvac'
import type { ShapeContext, HvacRenderData } from '@/composables/shape/types'

interface UnitOption {
  id: string
  name: string
  symbol: string
  toBase: number
}

const props = withDefaults(defineProps<{
  mode: ShapeMode
  shapeId: string
  values: Record<string, number>
  inputUnits?: Record<string, string>
  lengthUnits?: UnitOption[]
  /* Result display */
  result: number
  resultUnit?: string
  resultLabel?: string
  /* Profile mode only */
  material?: string
  /* HVAC mode only */
  hvacData?: {
    inletTemp: number
    inletTempUnit: string
    ambientTemp: number
    ambientTempUnit: string
    isCooling: boolean
    insulation?: string
  }
}>(), {
  resultUnit: '',
  resultLabel: '',
  material: '',
})

/* Use shared composable */
const {
  getUnitSymbol,
  fmt,
  get,
  formatResult,
  isoProject,
  facePath,
  ellipsePoints,
} = useShapeVisual(
  toRef(props, 'inputUnits'),
  toRef(props, 'lengthUnits'),
  toRef(props, 'values')
)

/* Create shape context for shape renderers */
const shapeContext = computed<ShapeContext>(() => ({
  get,
  fmt,
  getUnitSymbol,
  isoProject,
  facePath,
  ellipsePoints,
  cx: SIZE_2D / 2,
  cy: SIZE_2D / 2,
}))

/* ============================================================
   2D AREA SHAPES - Using extracted shape renderers
   ============================================================ */
const shape2DData = computed<ShapeRenderData>(() => {
  if (props.mode !== 'area') return { type: 'unknown', attrs: {}, labels: [] }
  return getShape2DData(props.shapeId, shapeContext.value)
})

/* ============================================================
   3D VOLUME SHAPES - Using extracted shape renderers
   ============================================================ */
const shape3DData = computed<Shape3DRenderData>(() => {
  if (props.mode !== 'volume') return { paths: [], labels: [] }
  return getShape3DData(props.shapeId, shapeContext.value)
})

/* ============================================================
   PROFILE SHAPES - Using extracted shape renderers
   ============================================================ */
const profileData = computed<ShapeRenderData>(() => {
  if (props.mode !== 'profile') return { type: 'unknown', attrs: {}, labels: [] }
  return getProfileData(props.shapeId, shapeContext.value)
})

/* ============================================================
   HVAC DUCT SHAPES - Using extracted shape renderers
   ============================================================ */
const hvacData = computed<HvacRenderData>(() => {
  if (props.mode !== 'hvac') return { type: 'round', labels: [] }
  return getHvacData(props.shapeId, shapeContext.value)
})

/* Get temperature symbol from unit id */
function getTempSymbol(unitId: string): string {
  const symbols: Record<string, string> = { celsius: '°C', fahrenheit: '°F', kelvin: 'K' }
  return symbols[unitId] || '°C'
}

/* Formatted result display */
const resultDisplay = computed(() => formatResult(props.result, 3))
</script>

<!-- NOTE: Shape data now computed via composables/shape/ - see composables/shape/2d/, 3d/, profile/, hvac/ -->


<template>
  <!-- ============================================================
       2D AREA MODE
       ============================================================ -->
  <svg
    v-if="mode === 'area'"
    class="shape-visual mode-area"
    :viewBox="`0 0 ${SIZE_2D} ${SIZE_2D}`"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="shape-fill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb) / 25%)" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb) / 40%)" />
      </linearGradient>
      <filter id="shape-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Background grid -->
    <g class="grid" opacity="0.15">
      <line v-for="i in 9" :key="`h${i}`" :x1="0" :y1="i * 20" :x2="SIZE_2D" :y2="i * 20" />
      <line v-for="i in 9" :key="`v${i}`" :x1="i * 20" :y1="0" :x2="i * 20" :y2="SIZE_2D" />
    </g>

    <!-- Extra elements -->
    <template v-if="shape2DData.extras">
      <component
        v-for="(extra, i) in shape2DData.extras"
        :key="`extra-${i}`"
        :is="extra.type"
        v-bind="extra.attrs"
      />
    </template>

    <!-- Main shape -->
    <template v-if="shape2DData.type === 'ring'">
      <circle
        :cx="Number(shape2DData.attrs.cx)"
        :cy="Number(shape2DData.attrs.cy)"
        :r="Number(shape2DData.attrs.R)"
        class="shape-main outer-ring"
      />
      <circle
        :cx="Number(shape2DData.attrs.cx)"
        :cy="Number(shape2DData.attrs.cy)"
        :r="Number(shape2DData.attrs.r)"
        class="shape-inner"
      />
    </template>
    <component
      v-else
      :is="shape2DData.type"
      v-bind="shape2DData.attrs"
      class="shape-main"
    />

    <!-- Dimension labels -->
    <text
      v-for="(label, i) in shape2DData.labels"
      :key="`label-${i}`"
      :x="label.x"
      :y="label.y"
      :transform="label.rotate ? `rotate(${label.rotate}, ${label.x}, ${label.y})` : undefined"
      :class="['dimension-label', label.class]"
    >
      {{ label.text }}
    </text>

    <!-- Result display -->
    <g class="result-display" :transform="`translate(${SIZE_2D / 2}, ${SIZE_2D - 12})`">
      <text class="result-value">{{ resultDisplay }} {{ resultUnit }}</text>
    </g>
  </svg>

  <!-- ============================================================
       3D VOLUME MODE
       ============================================================ -->
  <svg
    v-else-if="mode === 'volume'"
    class="shape-visual mode-volume"
    :viewBox="`0 0 ${SIZE_2D} ${SIZE_2D}`"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="shape-fill-3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb) / 25%)" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb) / 40%)" />
      </linearGradient>
      <linearGradient id="cylinderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
        <stop offset="50%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.25" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
      </linearGradient>
      <radialGradient id="sphereGradient" cx="35%" cy="35%" r="60%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.7" />
        <stop offset="60%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.3" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
      </radialGradient>
      <linearGradient id="hemisphereGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.4" />
        <stop offset="50%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.6" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.3" />
      </linearGradient>
      <linearGradient id="coneGradient" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.2" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
      </linearGradient>
      <linearGradient id="torusGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.3" />
      </linearGradient>
    </defs>

    <!-- Background grid (same as 2D) -->
    <g class="grid" opacity="0.15">
      <line v-for="i in 9" :key="`h${i}`" :x1="0" :y1="i * 20" :x2="SIZE_2D" :y2="i * 20" />
      <line v-for="i in 9" :key="`v${i}`" :x1="i * 20" :y1="0" :x2="i * 20" :y2="SIZE_2D" />
    </g>

    <!-- Shape paths -->
    <path
      v-for="(path, i) in shape3DData.paths"
      :key="i"
      :d="path.d"
      :fill="path.fill"
      :stroke="path.noStroke ? 'none' : (path.strokeColor ?? (path.stroke === false ? 'none' : 'var(--accent-500)'))"
      :stroke-width="path.strokeWidth ?? (path.stroke ? 1.5 : 2)"
      :stroke-dasharray="path.strokeDasharray"
      stroke-linejoin="round"
    />

    <!-- Outline -->
    <path
      v-if="shape3DData.outline"
      :d="shape3DData.outline"
      fill="none"
      stroke="var(--accent-500)"
      stroke-width="2"
      stroke-linejoin="round"
    />

    <!-- Dimension labels -->
    <g class="labels-3d">
      <g v-for="(label, i) in shape3DData.labels" :key="'label-' + i" :class="label.class">
        <rect
          v-if="!label.class?.includes('diagonal-label')"
          :x="label.x - 30"
          :y="label.y - 9"
          width="60"
          height="18"
          rx="4"
          class="label-bg"
        />
        <text :x="label.x" :y="label.y + 4" text-anchor="middle" :class="['label-text', label.class]">
          {{ label.text }}
        </text>
      </g>
    </g>

    <!-- Result display (same position as 2D) -->
    <g class="result-display" :transform="`translate(${SIZE_2D / 2}, ${SIZE_2D - 12})`">
      <text class="result-value">{{ resultDisplay }} {{ resultUnit }}</text>
    </g>
  </svg>

  <!-- ============================================================
       METAL PROFILE MODE
       ============================================================ -->
  <svg
    v-else-if="mode === 'profile'"
    class="shape-visual mode-profile"
    :viewBox="`0 0 ${SIZE_2D} ${SIZE_2D}`"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="profile-fill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb) / 25%)" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb) / 40%)" />
      </linearGradient>
      <filter id="profile-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Background grid (same as 2D) -->
    <g class="grid" opacity="0.15">
      <line v-for="i in 9" :key="`h${i}`" :x1="0" :y1="i * 20" :x2="SIZE_2D" :y2="i * 20" />
      <line v-for="i in 9" :key="`v${i}`" :x1="i * 20" :y1="0" :x2="i * 20" :y2="SIZE_2D" />
    </g>

    <!-- Profile shape -->
    <component :is="profileData.type" v-bind="profileData.attrs" class="shape-main" />

    <!-- Dimension labels -->
    <text
      v-for="(label, i) in profileData.labels"
      :key="i"
      :x="label.x"
      :y="label.y"
      :transform="label.rotate ? `rotate(${label.rotate} ${label.x} ${label.y})` : undefined"
      class="dimension-label"
    >
      {{ label.text }}
    </text>

    <!-- Material badge -->
    <g v-if="material" class="material-badge-svg" transform="translate(10, 20)">
      <rect x="0" y="-12" :width="material.length * 6 + 12" height="18" rx="4" class="badge-bg" />
      <text x="6" y="2" class="badge-text">{{ material.toUpperCase() }}</text>
    </g>

    <!-- Result display (same position as 2D) -->
    <g class="result-display" :transform="`translate(${SIZE_2D / 2}, ${SIZE_2D - 12})`">
      <text class="result-value">{{ resultDisplay }} {{ resultUnit }}</text>
    </g>
  </svg>

  <!-- ============================================================
       HVAC DUCT MODE
       ============================================================ -->
  <svg
    v-else-if="mode === 'hvac'"
    class="shape-visual mode-hvac"
    :viewBox="`0 0 ${SIZE_2D} ${SIZE_2D}`"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="hvac-body" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.4" />
        <stop offset="50%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.2" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.4" />
      </linearGradient>
      <linearGradient id="hvac-front" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.45" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.25" />
      </linearGradient>
      <linearGradient id="hvac-top" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.35" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.5" />
      </linearGradient>
      <linearGradient id="hvac-side" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.25" />
        <stop offset="100%" stop-color="rgb(var(--accent-500-rgb))" stop-opacity="0.15" />
      </linearGradient>
      <filter id="hvac-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Background grid -->
    <g class="grid" opacity="0.15">
      <line v-for="i in 9" :key="`h${i}`" :x1="0" :y1="i * 20" :x2="SIZE_2D" :y2="i * 20" />
      <line v-for="i in 9" :key="`v${i}`" :x1="i * 20" :y1="0" :x2="i * 20" :y2="SIZE_2D" />
    </g>

    <!-- Round Duct (Cylinder) -->
    <g v-if="hvacData.type === 'round'" class="duct-round">
      <!-- Front ellipse (entry) -->
      <ellipse cx="45" cy="90" rx="35" ry="45" fill="url(#hvac-front)" stroke="var(--accent-500)" stroke-width="2" filter="url(#hvac-glow)" />
      <!-- Inner opening (dashed) -->
      <ellipse cx="45" cy="90" rx="28" ry="36" fill="none" stroke="var(--accent-500)" stroke-width="1" stroke-dasharray="4 2" opacity="0.6" />
      <!-- Cylinder body -->
      <rect x="45" y="45" width="110" height="90" fill="url(#hvac-body)" />
      <!-- Top line -->
      <line x1="45" y1="45" x2="155" y2="45" stroke="var(--accent-500)" stroke-width="2" />
      <!-- Bottom line -->
      <line x1="45" y1="135" x2="155" y2="135" stroke="var(--accent-500)" stroke-width="2" />
      <!-- Back ellipse (exit) -->
      <ellipse cx="155" cy="90" rx="35" ry="45" fill="url(#hvac-side)" stroke="var(--accent-500)" stroke-width="2" />
      <!-- Airflow arrow -->
      <g transform="translate(165, 90)">
        <path d="M 0 0 L 22 0 M 16 -6 L 22 0 L 16 6" stroke="var(--accent-500)" stroke-width="2.5" fill="none" />
      </g>
    </g>

    <!-- Rectangular Duct (Box - 3D isometric) -->
    <g v-else class="duct-rectangular">
      <!-- Front face (entry) - rectangle at front -->
      <path d="M 25 50 L 75 50 L 75 130 L 25 130 Z" fill="url(#hvac-front)" stroke="var(--accent-500)" stroke-width="2" filter="url(#hvac-glow)" />
      <!-- Inner opening (dashed) -->
      <path d="M 32 58 L 68 58 L 68 122 L 32 122 Z" fill="none" stroke="var(--accent-500)" stroke-width="1" stroke-dasharray="4 2" opacity="0.5" />
      <!-- Top face (connects front top edge to back) -->
      <path d="M 25 50 L 75 50 L 165 35 L 115 35 Z" fill="url(#hvac-top)" stroke="var(--accent-500)" stroke-width="2" />
      <!-- Right side face (duct length) -->
      <path d="M 75 50 L 165 35 L 165 115 L 75 130 Z" fill="url(#hvac-body)" stroke="var(--accent-500)" stroke-width="2" />
      <!-- Back face edges (dashed) -->
      <line x1="115" y1="35" x2="165" y2="35" stroke="var(--accent-500)" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4" />
      <line x1="165" y1="35" x2="165" y2="115" stroke="var(--accent-500)" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4" />
      <line x1="115" y1="35" x2="115" y2="115" stroke="var(--accent-500)" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.3" />
      <line x1="115" y1="115" x2="165" y2="115" stroke="var(--accent-500)" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.3" />
      <!-- Airflow arrow -->
      <g transform="translate(173, 75)">
        <path d="M 0 0 L 18 0 M 12 -5 L 18 0 L 12 5" stroke="var(--accent-500)" stroke-width="2.5" fill="none" />
      </g>
    </g>

    <!-- Dimension labels -->
    <text
      v-for="(label, i) in hvacData.labels"
      :key="`label-${i}`"
      :x="label.x"
      :y="label.y"
      class="dimension-label"
    >
      {{ label.text }}
    </text>

    <!-- Insulation badge (top left) - like material badge -->
    <g v-if="props.hvacData?.insulation" class="insulation-badge" transform="translate(10, 20)">
      <rect x="0" y="-12" :width="props.hvacData.insulation.length * 5.5 + 14" height="18" rx="4" class="badge-bg" />
      <text x="7" y="2" class="badge-text">{{ props.hvacData.insulation.toUpperCase() }}</text>
    </g>

    <!-- Result display (like other modes) -->
    <g class="result-display" :transform="`translate(${SIZE_2D / 2}, ${SIZE_2D - 12})`">
      <text class="result-value">{{ resultDisplay }} {{ resultUnit }}</text>
    </g>
  </svg>
</template>

<style scoped lang="scss">
/* ============================================================
   SHARED STYLES - All modes use the same base styling
   ============================================================ */
.shape-visual {
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 5%) 0%, transparent 100%);
  border-radius: 1rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);

  /* CSS variables for 3D faces */
  --face-light: rgb(var(--accent-500-rgb) / 55%);
  --face-medium: rgb(var(--accent-500-rgb) / 40%);
  --face-dark: rgb(var(--accent-500-rgb) / 28%);
  --face-base: rgb(var(--accent-500-rgb) / 20%);
  --cube-top: #2d8b9e;
  --cube-right: #1e6a7a;
  --cube-left: #154d5a;
}

/* Grid - shared across all modes */
.grid line {
  stroke: var(--accent-500);
  stroke-width: 0.5;
}

/* Dimension labels - shared across all modes */
.dimension-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  fill: var(--text);
  text-anchor: middle;
  dominant-baseline: middle;
}

/* Shape main - shared across 2D and profile modes */
.shape-main {
  fill: url(#shape-fill);
  stroke: var(--accent-500);
  stroke-width: 2;
  filter: url(#shape-glow);
  transition: all 0.3s ease;
}

/* Result display - shared across all modes */
.result-display {
  .result-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    fill: var(--accent-500);
    text-anchor: middle;
  }
}

/* ============================================================
   2D AREA MODE
   ============================================================ */
.mode-area {
  .outer-ring {
    fill: url(#shape-fill);
  }

  .shape-inner {
    fill: var(--main-bg);
    stroke: var(--accent-500);
    stroke-width: 2;
  }

  .dimension-line {
    stroke: var(--accent-500);
    stroke-width: 1.5;
    opacity: 0.7;

    &.dashed {
      stroke-dasharray: 4 3;
    }
  }

  .angle-arc {
    fill: none;
    stroke: var(--accent-500);
    stroke-width: 1.5;
    opacity: 0.7;
  }

  .center-dot {
    fill: var(--accent-500);
  }

  .center-label {
    font-size: 14px;
    fill: var(--accent-500);
  }
}

/* ============================================================
   3D VOLUME MODE
   ============================================================ */
.mode-volume {
  .labels-3d {
    .label-bg {
      fill: rgb(var(--accent-500-rgb) / 15%);
    }

    .label-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      fill: var(--text);

      &.diagonal-label {
        font-size: 12px;
        font-weight: 700;
        font-style: italic;

        &.space {
          fill: #0066cc;
        }

        &.face {
          fill: #cc5500;
        }
      }
    }
  }
}

/* ============================================================
   METAL PROFILE MODE
   ============================================================ */
.mode-profile {
  .shape-main {
    fill: url(#profile-fill);
    filter: url(#profile-glow);
  }

  .material-badge-svg {
    .badge-bg {
      fill: rgb(var(--accent-500-rgb) / 15%);
      width: auto;
    }

    .badge-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      fill: var(--accent-500);
      letter-spacing: 0.05em;
    }
  }
}

/* ============================================================
   HVAC DUCT MODE
   ============================================================ */
.mode-hvac {
  .insulation-badge {
    .badge-bg {
      fill: rgb(var(--accent-500-rgb) / 15%);
    }

    .badge-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      font-weight: 700;
      fill: var(--accent-500);
      letter-spacing: 0.05em;
    }
  }
}
</style>
