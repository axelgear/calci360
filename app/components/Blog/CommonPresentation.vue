<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

interface Slide {
  id: string
  title: string
  subtitle?: string
  type: 'hero' | 'content' | 'comparison' | 'grid' | 'interactive' | 'quiz' | 'summary'
  content?: any
}

interface Props {
  slides: Slide[]
  title: string
  subtitle?: string
  accentColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: 'var(--accent-500)'
})

const emit = defineEmits(['close', 'slideChange'])

/* Slide management */
const currentSlide = ref(0)
const isAnimating = ref(false)
const showControls = ref(true)
const isFullscreen = ref(false)
let controlsTimeout: NodeJS.Timeout

const totalSlides = computed(() => props.slides.length)
const currentSlideData = computed(() => props.slides[currentSlide.value])
const progress = computed(() => ((currentSlide.value + 1) / totalSlides.value) * 100)

/* Navigation */
const nextSlide = () => {
  if (currentSlide.value < totalSlides.value - 1 && !isAnimating.value) {
    isAnimating.value = true
    currentSlide.value++
    emit('slideChange', currentSlide.value)
    setTimeout(() => isAnimating.value = false, 300)
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0 && !isAnimating.value) {
    isAnimating.value = true
    currentSlide.value--
    emit('slideChange', currentSlide.value)
    setTimeout(() => isAnimating.value = false, 300)
  }
}

const goToSlide = (index: number) => {
  if (index >= 0 && index < totalSlides.value && index !== currentSlide.value && !isAnimating.value) {
    isAnimating.value = true
    currentSlide.value = index
    emit('slideChange', currentSlide.value)
    setTimeout(() => isAnimating.value = false, 300)
  }
}

/* Fullscreen handling */
const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

/* Controls visibility */
const showControlsTemporarily = () => {
  showControls.value = true
  clearTimeout(controlsTimeout)
  controlsTimeout = setTimeout(() => {
    showControls.value = false
  }, 3000)
}

/* Keyboard navigation */
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
    case ' ':
      e.preventDefault()
      nextSlide()
      break
    case 'ArrowLeft':
      e.preventDefault()
      prevSlide()
      break
    case 'Escape':
      if (isFullscreen.value) {
        toggleFullscreen()
      } else {
        emit('close')
      }
      break
    case 'f':
    case 'F':
      e.preventDefault()
      toggleFullscreen()
      break
  }
}

/* Touch support */
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  if (touchEndX < touchStartX - swipeThreshold) {
    nextSlide()
  } else if (touchEndX > touchStartX + swipeThreshold) {
    prevSlide()
  }
}

/* Mouse movement for controls */
const handleMouseMove = () => {
  showControlsTemporarily()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('touchstart', handleTouchStart, false)
  document.addEventListener('touchend', handleTouchEnd, false)
  document.addEventListener('mousemove', handleMouseMove)
  showControlsTemporarily()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('touchstart', handleTouchStart, false)
  document.removeEventListener('touchend', handleTouchEnd, false)
  document.removeEventListener('mousemove', handleMouseMove)
  clearTimeout(controlsTimeout)
  if (isFullscreen.value) {
    document.exitFullscreen()
  }
})
</script>

<template>
  <div class="common-presentation" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
    </div>

    <!-- Header Controls -->
    <transition name="fade">
      <div v-if="showControls" class="controls-header">
        <button @click="$emit('close')" class="btn-icon close-btn">
          <span class="material-icons">close</span>
        </button>
        <div class="slide-info">
          <span class="slide-number">{{ currentSlide + 1 }} / {{ totalSlides }}</span>
          <span class="slide-title">{{ currentSlideData.title }}</span>
        </div>
        <button @click="toggleFullscreen" class="btn-icon fullscreen-btn">
          <span class="material-icons">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
        </button>
      </div>
    </transition>

    <!-- Slide Container -->
    <div class="slides-wrapper">
      <transition :name="isAnimating ? 'slide' : ''" mode="out-in">
        <div :key="currentSlide" class="slide" :class="`slide-${currentSlideData.type}`">
          <!-- Hero Slide -->
          <div v-if="currentSlideData.type === 'hero'" class="hero-slide">
            <div class="hero-content">
              <div v-if="currentSlideData.content?.tag" class="hero-tag">
                <span v-if="currentSlideData.content.icon" class="material-icons">{{ currentSlideData.content.icon }}</span>
                {{ t(currentSlideData.content.tag) }}
              </div>
              <h1 class="hero-title">{{ t(currentSlideData.title) }}</h1>
              <p v-if="currentSlideData.subtitle" class="hero-subtitle">{{ t(currentSlideData.subtitle) }}</p>
              <div v-if="currentSlideData.content?.meta" class="hero-meta">
                <span v-for="item in currentSlideData.content.meta" :key="item.label">
                  <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
                  {{ t(item.label) }}
                </span>
              </div>
            </div>
            <div v-if="currentSlideData.content?.visual" class="hero-visual">
              <component :is="currentSlideData.content.visual" />
            </div>
          </div>

          <!-- Content Slide -->
          <div v-else-if="currentSlideData.type === 'content'" class="content-slide">
            <h2 class="slide-heading">{{ t(currentSlideData.title) }}</h2>
            <div class="slide-content">
              <slot :name="`slide-${currentSlide}`" :slide="currentSlideData">
                <component v-if="currentSlideData.content" :is="currentSlideData.content" />
                <div v-else class="default-content">
                  <p>{{ t(currentSlideData.subtitle || 'Content coming soon') }}</p>
                </div>
              </slot>
            </div>
          </div>

          <!-- Comparison Slide -->
          <div v-else-if="currentSlideData.type === 'comparison'" class="comparison-slide">
            <h2 class="slide-heading">{{ t(currentSlideData.title) }}</h2>
            <div class="comparison-grid">
              <div 
                v-for="(item, index) in currentSlideData.content" 
                :key="index"
                class="comparison-card"
                :class="item.type"
              >
                <h3>
                  <span class="material-icons">{{ item.icon }}</span>
                  {{ t(item.title) }}
                </h3>
                <ul>
                  <li v-for="point in item.points" :key="point">{{ t(point) }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Grid Slide -->
          <div v-else-if="currentSlideData.type === 'grid'" class="grid-slide">
            <h2 class="slide-heading">{{ t(currentSlideData.title) }}</h2>
            <div class="grid-container" :class="`cols-${currentSlideData.content?.columns || 3}`">
              <slot :name="`slide-${currentSlide}`" :slide="currentSlideData">
                <div
                  v-for="(item, index) in currentSlideData.content?.items"
                  :key="index"
                  class="grid-item"
                >
                  <component v-if="item.component" :is="item.component" v-bind="item.props" />
                  <div v-else class="grid-item-content">
                    <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
                    <h3>{{ t(item.title) }}</h3>
                    <p>{{ t(item.description) }}</p>
                  </div>
                </div>
              </slot>
            </div>
          </div>

          <!-- Interactive Slide -->
          <div v-else-if="currentSlideData.type === 'interactive'" class="interactive-slide">
            <h2 class="slide-heading">{{ t(currentSlideData.title) }}</h2>
            <div class="interactive-content">
              <slot :name="`slide-${currentSlide}`" :slide="currentSlideData">
                <component v-if="currentSlideData.content" :is="currentSlideData.content" />
              </slot>
            </div>
          </div>

          <!-- Quiz Slide -->
          <div v-else-if="currentSlideData.type === 'quiz'" class="quiz-slide">
            <h2 class="slide-heading">{{ t(currentSlideData.title) }}</h2>
            <div class="quiz-content">
              <slot :name="`slide-${currentSlide}`" :slide="currentSlideData">
                <component v-if="currentSlideData.content" :is="currentSlideData.content" />
              </slot>
            </div>
          </div>

          <!-- Summary Slide -->
          <div v-else-if="currentSlideData.type === 'summary'" class="summary-slide">
            <h2 class="slide-heading">{{ t(currentSlideData.title) }}</h2>
            <div class="summary-grid">
              <div
                v-for="(item, index) in currentSlideData.content"
                :key="index"
                class="summary-card"
              >
                <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
                <h3>{{ t(item.title) }}</h3>
                <p>{{ t(item.description) }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Navigation Controls -->
    <transition name="fade">
      <div v-if="showControls" class="controls-footer">
        <button 
          @click="prevSlide" 
          :disabled="currentSlide === 0"
          class="nav-btn prev"
        >
          <span class="material-icons">arrow_back</span>
        </button>

        <div class="slide-dots">
          <button
            v-for="(slide, index) in slides"
            :key="slide.id"
            @click="goToSlide(index)"
            :class="{ active: currentSlide === index }"
            class="dot"
            :title="slide.title"
          ></button>
        </div>

        <button 
          @click="nextSlide" 
          :disabled="currentSlide === totalSlides - 1"
          class="nav-btn next"
        >
          <span class="material-icons">arrow_forward</span>
        </button>
      </div>
    </transition>

    <!-- Keyboard Shortcuts Help -->
    <div v-if="showControls" class="shortcuts-help">
      <span><kbd>←</kbd> Previous</span>
      <span><kbd>→</kbd> Next</span>
      <span><kbd>F</kbd> Fullscreen</span>
      <span><kbd>ESC</kbd> Exit</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.common-presentation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--main-bg);
  color: var(--text);
  z-index: 9999;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.is-fullscreen {
    .controls-header,
    .controls-footer {
      background: rgba(var(--card-rgb), 0.95);
    }
  }
}

/* Progress Bar */
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(var(--accent-500-rgb), 0.2);
  z-index: 100;

  .progress-fill {
    height: 100%;
    background: var(--accent-500);
    transition: width 0.3s ease;
  }
}

/* Header Controls */
.controls-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: linear-gradient(to bottom, rgba(var(--card-rgb), 0.9), transparent);
  z-index: 50;

  .btn-icon {
    background: var(--card);
    border: 1px solid rgba(var(--accent-500-rgb), 0.2);
    color: var(--text);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(var(--accent-500-rgb), 0.1);
      border-color: var(--accent-500);
      transform: scale(1.05);
    }
  }

  .slide-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--text);
    opacity: 0.8;

    .slide-number {
      font-weight: 600;
      color: var(--accent-500);
    }
  }
}

/* Slides Wrapper */
.slides-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  overflow: hidden;
}

/* Base Slide Styles */
.slide {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.slide-heading {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent-500);
  text-align: center;
  margin-bottom: 3rem;
}

/* Hero Slide */
.hero-slide {
  text-align: center;

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(var(--accent-500-rgb), 0.1);
    border: 1px solid rgba(var(--accent-500-rgb), 0.3);
    padding: 0.5rem 1.5rem;
    border-radius: 999px;
    font-size: 0.9rem;
    color: var(--accent-500);
    margin-bottom: 2rem;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--text);
    opacity: 0.8;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .hero-meta {
    display: flex;
    justify-content: center;
    gap: 2rem;
    font-size: 0.9rem;
    color: var(--text);
    opacity: 0.7;

    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .material-icons {
        font-size: 1.1rem;
      }
    }
  }

  .hero-visual {
    margin-top: 3rem;
  }
}

/* Content Slide */
.content-slide {
  width: 100%;

  .slide-content {
    max-width: 800px;
    margin: 0 auto;
  }
}

/* Comparison Slide */
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1000px;

  .comparison-card {
    background: var(--card);
    border: 2px solid transparent;
    border-radius: 0.75rem;
    padding: 2rem;

    &.negative {
      border-color: rgba(239, 68, 68, 0.5);

      h3 {
        color: #ef4444;
      }
    }

    &.positive {
      border-color: rgba(16, 185, 129, 0.5);

      h3 {
        color: #10b981;
      }
    }

    h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(var(--text-rgb), 0.1);

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

/* Grid Slide */
.grid-container {
  display: grid;
  gap: 1.5rem;
  width: 100%;

  &.cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  &.cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  &.cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  .grid-item {
    background: var(--card);
    border: 1px solid rgba(var(--accent-500-rgb), 0.1);
    border-radius: 0.75rem;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--accent-500);
    }

    .material-icons {
      font-size: 3rem;
      color: var(--accent-500);
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.9rem;
      color: var(--text);
      opacity: 0.8;
    }
  }
}

/* Summary Slide */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;

  .summary-card {
    background: var(--card);
    border: 1px solid rgba(var(--accent-500-rgb), 0.2);
    border-radius: 0.75rem;
    padding: 2rem;
    text-align: center;

    .material-icons {
      font-size: 2.5rem;
      color: var(--accent-500);
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: var(--text);
    }

    p {
      font-size: 0.85rem;
      color: var(--text);
      opacity: 0.7;
    }
  }
}

/* Footer Controls */
.controls-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(var(--card-rgb), 0.9), transparent);
  z-index: 50;

  .nav-btn {
    background: var(--card);
    border: 1px solid rgba(var(--accent-500-rgb), 0.2);
    color: var(--accent-500);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: rgba(var(--accent-500-rgb), 0.1);
      border-color: var(--accent-500);
      transform: scale(1.1);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  .slide-dots {
    display: flex;
    gap: 0.5rem;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(var(--text-rgb), 0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: rgba(var(--accent-500-rgb), 0.5);
      }

      &.active {
        width: 24px;
        border-radius: 4px;
        background: var(--accent-500);
      }
    }
  }
}

/* Keyboard Shortcuts */
.shortcuts-help {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text);
  opacity: 0.5;

  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  kbd {
    padding: 0.2rem 0.4rem;
    background: var(--card);
    border: 1px solid rgba(var(--text-rgb), 0.2);
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.7rem;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(50px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .slides-wrapper {
    padding: 2rem 1rem;
  }

  .slide-heading {
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }

  .hero-slide {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }
  }

  .grid-container {
    &.cols-3,
    &.cols-4 {
      grid-template-columns: 1fr;
    }
  }

  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .shortcuts-help {
    display: none;
  }
}
</style>
