<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp } from '#app'

const progress = ref(0)
const isLoading = ref(false)
let progressInterval: NodeJS.Timeout | null = null

const startLoading = () => {
  isLoading.value = true
  progress.value = 0
  
  /* Simulate progress */
  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 20
      if (progress.value > 90) progress.value = 90
    }
  }, 200)
}

const finishLoading = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  
  progress.value = 100
  
  setTimeout(() => {
    isLoading.value = false
    progress.value = 0
  }, 300)
}

onMounted(() => {
  const nuxtApp = useNuxtApp()
  
  nuxtApp.hook('page:start', startLoading)
  nuxtApp.hook('page:finish', finishLoading)
})

onBeforeUnmount(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

<template>
  <Transition name="loading">
    <div v-if="isLoading" class="page-loading-indicator">
      <div 
        class="loading-bar"
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
  background: rgba(var(--accent-500-rgb), 0.1);
  z-index: 9999;
  pointer-events: none;
}

.loading-bar {
  height: 100%;
  background: var(--accent-500);
  transition: width 0.2s ease-out;
  box-shadow: 0 0 10px rgba(var(--accent-500-rgb), 0.5);
  
  /* Pulse animation */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: pulse 1.5s ease-in-out infinite;
  }
}

/* Animations */
.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.3s;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

@keyframes pulse {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(100px);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .loading-bar {
    transition: none;
    
    &::after {
      animation: none;
    }
  }
}
</style>