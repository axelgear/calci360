<script setup lang="ts">
interface OrbitIcon {
  icon: string
  color?: string
}

const props = withDefaults(defineProps<{
  icons: OrbitIcon[] | string[]
  size?: number
}>(), {
  size: 200,
})

/* Normalize icons to always be OrbitIcon[] */
const normalizedIcons = computed(() => {
  return props.icons.map(icon => 
    typeof icon === 'string' ? { icon } : icon
  )
})

/* 
 * Classic atom orbits - 3 main ellipses at 60° to each other
 * Like the ⚛️ symbol, viewed at an angle
 */
const orbitConfigs = [
  { tiltX: 70, tiltZ: 0, duration: 5, startAngle: 0 },
  { tiltX: 70, tiltZ: 60, duration: 6.5, startAngle: 180 },
  { tiltX: 70, tiltZ: 120, duration: 5.5, startAngle: 90 },
  { tiltX: 70, tiltZ: 180, duration: 7, startAngle: 270 },
  { tiltX: 70, tiltZ: 240, duration: 6, startAngle: 45 },
  { tiltX: 70, tiltZ: 300, duration: 5.8, startAngle: 135 },
 // { tiltX: 20, tiltZ: 90, duration: 8, startAngle: 225 },
]

/* 
 * 3D projection: orbit in XY plane, tilted around X, then rotated around Z
 * This creates the classic atom symbol appearance
 */
function project3Dto2D(angle: number, tiltXDeg: number, tiltZDeg: number, radius: number, center: number) {
  const tiltX = tiltXDeg * Math.PI / 180
  const tiltZ = tiltZDeg * Math.PI / 180
  
  /* Circle in XY plane */
  let x = Math.cos(angle) * radius
  let y = Math.sin(angle) * radius
  let z = 0
  
  /* Tilt around X axis - makes the circle appear as an ellipse */
  const y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX)
  const z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX)
  y = y1
  z = z1
  
  /* Rotate around Z axis - spreads the orbits around */
  const x2 = x * Math.cos(tiltZ) - y * Math.sin(tiltZ)
  const y2 = x * Math.sin(tiltZ) + y * Math.cos(tiltZ)
  x = x2
  y = y2
  
  return { x: x + center, y: y + center, z }
}

/* Generate SVG paths for orbits */
const orbitPaths = computed(() => {
  const radius = props.size * 0.4
  const center = props.size / 2
  const segments = 64
  
  return orbitConfigs.map(config => {
    const points: string[] = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const pos = project3Dto2D(angle, config.tiltX, config.tiltZ, radius, center)
      points.push(i === 0 ? `M ${pos.x.toFixed(1)} ${pos.y.toFixed(1)}` : `L ${pos.x.toFixed(1)} ${pos.y.toFixed(1)}`)
    }
    return points.join(' ') + ' Z'
  })
})

/* Animation */
const time = ref(0)
let animationFrame: number | null = null

onMounted(() => {
  const animate = () => {
    time.value += 0.016
    animationFrame = requestAnimationFrame(animate)
  }
  animate()
})

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
})

/* Electron positions */
const electrons = computed(() => {
  const radius = props.size * 0.4
  const center = props.size / 2
  
  return normalizedIcons.value.map((item, index) => {
    const config = orbitConfigs[index % orbitConfigs.length]!
    const angle = (time.value / config.duration) * Math.PI * 2 + (config.startAngle * Math.PI / 180)
    const pos = project3Dto2D(angle, config.tiltX, config.tiltZ, radius, center)
    
    const depth = (pos.z / radius + 1) / 2
    
    return {
      ...pos,
      scale: 0.7 + depth * 0.5,
      opacity: 0.5 + depth * 0.5,
      zIndex: Math.round(pos.z + 100),
      icon: item.icon,
      color: item.color,
    }
  })
})
</script>

<template>
  <div class="atom" :style="{ width: `${size}px`, height: `${size}px` }">
    <!-- Orbits -->
    <svg class="orbits" :viewBox="`0 0 ${size} ${size}`">
      <path v-for="(d, i) in orbitPaths" :key="i" :d="d" class="orbit" />
    </svg>
    
    <!-- Nucleus -->
    <div class="nucleus" />
    
    <!-- Electrons -->
    <div
      v-for="(e, i) in electrons"
      :key="i"
      class="electron"
      :style="{
        left: `${e.x}px`,
        top: `${e.y}px`,
        transform: `translate(-50%, -50%) scale(${e.scale})`,
        opacity: e.opacity,
        zIndex: e.zIndex,
      }"
    >
      <span class="material-icons" :style="{ color: e.color }">{{ e.icon }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.atom {
  position: relative;
  
  @include phone {
    transform: scale(0.75);
  }
}

.orbits {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orbit {
  fill: none;
  stroke: rgb(var(--accent-500-rgb) / 25%);
  stroke-width: 1;
}

.nucleus {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: radial-gradient(circle at 30% 30%, 
    hsl(var(--accent-500-hsl) / 100%) 0%,
    var(--accent-500) 60%,
    hsl(var(--accent-500-hsl) / 70%) 100%
  );
  border-radius: 50%;
  z-index: 50;
  box-shadow: 
    0 0 30px rgb(var(--accent-500-rgb) / 70%),
    0 0 60px rgb(var(--accent-500-rgb) / 40%),
    inset -2px -2px 8px rgb(0 0 0 / 30%),
    inset 2px 2px 8px rgb(255 255 255 / 20%);
  
  &::after {
    content: '';
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgb(var(--accent-500-rgb) / 30%) 0%, transparent 70%);
    animation: glow 2s ease-in-out infinite;
  }
}

@keyframes glow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
}

.electron {
  position: absolute;
  width: 28px;
  height: 28px;
  background: var(--main-bg);
  border: 2px solid rgb(var(--accent-500-rgb) / 60%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 12px rgb(var(--accent-500-rgb) / 50%),
    inset 0 0 8px rgb(var(--accent-500-rgb) / 20%);
  
  .material-icons {
    font-size: 0.85rem;
    color: var(--accent-500);
  }
}
</style>
