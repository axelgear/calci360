<script setup lang="ts">
interface OrbitIcon {
  icon: string
  color?: string
}

const props = withDefaults(defineProps<{
  icons: OrbitIcon[] | string[]
  size?: number
  duration?: number
}>(), {
  size: 200,
  duration: 90,
})

/* Normalize icons to always be OrbitIcon[] */
const normalizedIcons = computed(() => {
  return props.icons.map(icon => 
    typeof icon === 'string' ? { icon } : icon
  )
})

/* Calculate position for each icon around the circle */
function getIconTransform(index: number, total: number): string {
  const angle = (index * 360) / total
  const radian = (angle * Math.PI) / 180
  const radius = props.size / 2
  const x = Math.round(Math.sin(radian) * radius)
  const y = Math.round(-Math.cos(radian) * radius)
  return `translate(${x}px, ${y}px)`
}
</script>

<template>
  <div 
    class="orbit-visual" 
    :style="{ 
      width: `${size}px`, 
      height: `${size}px`,
      '--duration': `${duration}s`
    }"
  >
    <div class="orbit">
      <span 
        v-for="(item, index) in normalizedIcons" 
        :key="index"
        class="material-icons orbit-icon"
        :style="{ 
          transform: getIconTransform(index, normalizedIcons.length),
          color: item.color 
        }"
      >
        {{ item.icon }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.orbit-visual {
  position: relative;
  
  @include phone {
    width: 150px !important;
    height: 150px !important;
    margin: 0 auto;
  }
}

.orbit {
  width: 100%;
  height: 100%;
  border: 2px dashed rgb(var(--accent-500-rgb) / 30%);
  border-radius: 50%;
  position: relative;
  animation: spin var(--duration, 90s) linear infinite;
  
  .orbit-icon {
    --size: 36px;
    position: absolute;
    font-size: 1.1rem;
    color: var(--accent-500);
    background: var(--main-bg);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgb(var(--accent-500-rgb) / 25%);
    width: var(--size);
    height: var(--size);
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    left: 50%;
    margin-left: calc(var(--size) / -2);
    margin-top: calc(var(--size) / -2);
    
    @include phone {
      --size: 30px;
      font-size: 1rem;
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

