<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from '#imports'

const isLoading = ref(false)
const progress = ref(0)

let interval: NodeJS.Timeout | null = null

const start = () => {
  isLoading.value = true
  progress.value = 0
  
  // Simulate progress
  interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 10
    }
  }, 200)
}

const finish = () => {
  progress.value = 100
  setTimeout(() => {
    isLoading.value = false
    progress.value = 0
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }, 300)
}

// Listen to route changes
const router = useRouter()

onMounted(() => {
  router.beforeEach(() => {
    start()
  })

  router.afterEach(() => {
    finish()
  })
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isLoading" class="page-loading-indicator">
      <div 
        class="page-loading-indicator__bar" 
        :style="{ width: `${progress}%` }"
      />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.page-loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgb(var(--accent-500-rgb) / 10%);
  z-index: 9999;
  overflow: hidden;
}

.page-loading-indicator__bar {
  height: 100%;
  background: var(--accent-500);
  transition: width 0.2s ease-out;
  box-shadow: 0 0 10px var(--accent-500);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
