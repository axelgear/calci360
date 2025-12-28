<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from '#app'
import blogData from '~/data/blog-posts.json'
import { useUiTranslator } from '~/composables/useUiTranslator'

const { t } = useUiTranslator()
const route = useRoute()
const router = useRouter()

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  parent: string | null
  children: string[]
}

interface Props {
  postId?: string
  autoPlay?: boolean
  interval?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: false,
  interval: 10000 /* 10 seconds */
})

const posts = ref<BlogPost[]>(blogData.posts)
const currentPostId = ref(props.postId || route.params.number as string || '1')
const isFullscreen = ref(false)
const isPaused = ref(!props.autoPlay)
const showControls = ref(true)
const controlsTimeout = ref<NodeJS.Timeout>()

/* Get current post and navigation */
const currentPost = computed(() => 
  posts.value.find(p => p.id === currentPostId.value)
)

const navigationTree = computed(() => {
  if (!currentPost.value) return []
  
  /* Build navigation tree from current post */
  const tree: BlogPost[] = []
  
  /* Add parent posts */
  let parent = currentPost.value
  while (parent.parent) {
    const parentPost = posts.value.find(p => p.id === parent.parent)
    if (parentPost) {
      tree.unshift(parentPost)
      parent = parentPost
    } else {
      break
    }
  }
  
  /* Add current post */
  tree.push(currentPost.value)
  
  /* Add children */
  if (currentPost.value.children.length > 0) {
    const children = currentPost.value.children
      .map(id => posts.value.find(p => p.id === id))
      .filter(Boolean) as BlogPost[]
    tree.push(...children)
  }
  
  return tree
})

const currentIndex = computed(() => 
  navigationTree.value.findIndex(p => p.id === currentPostId.value)
)

const hasNext = computed(() => currentIndex.value < navigationTree.value.length - 1)
const hasPrev = computed(() => currentIndex.value > 0)

/* Navigation */
const navigateToPost = (postId: string) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    currentPostId.value = postId
    router.push(`/blog/${post.id}/${post.slug}`)
  }
}

const nextSlide = () => {
  if (hasNext.value && currentIndex.value >= 0) {
    const nextPost = navigationTree.value[currentIndex.value + 1]
    if (nextPost) {
      navigateToPost(nextPost.id)
    }
  }
}

const prevSlide = () => {
  if (hasPrev.value && currentIndex.value > 0) {
    const prevPost = navigationTree.value[currentIndex.value - 1]
    if (prevPost) {
      navigateToPost(prevPost.id)
    }
  }
}

/* Fullscreen */
const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

/* Auto-play */
let autoPlayInterval: NodeJS.Timeout | null = null

const startAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
  
  autoPlayInterval = setInterval(() => {
    if (!isPaused.value) {
      if (hasNext.value) {
        nextSlide()
      } else {
        /* Loop back to start of navigation tree */
        if (navigationTree.value.length > 0 && navigationTree.value[0]) {
          navigateToPost(navigationTree.value[0].id)
        }
      }
    }
  }, props.interval)
}

const togglePause = () => {
  isPaused.value = !isPaused.value
  if (!isPaused.value && props.autoPlay) {
    startAutoPlay()
  }
}

/* Controls visibility */
const showControlsTemporarily = () => {
  showControls.value = true
  if (controlsTimeout.value) clearTimeout(controlsTimeout.value)
  
  controlsTimeout.value = setTimeout(() => {
    if (!isPaused.value) {
      showControls.value = false
    }
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
    case 'f':
    case 'F':
      e.preventDefault()
      toggleFullscreen()
      break
    case 'p':
    case 'P':
      e.preventDefault()
      togglePause()
      break
    case 'Escape':
      if (isFullscreen.value) {
        e.preventDefault()
        toggleFullscreen()
      }
      break
  }
}

/* Touch/swipe navigation */
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e: TouchEvent) => {
  if (e.changedTouches.length > 0 && e.changedTouches[0]) {
    touchStartX = e.changedTouches[0].screenX
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (e.changedTouches.length > 0 && e.changedTouches[0]) {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  }
}

const handleSwipe = () => {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      /* Swiped left */
      nextSlide()
    } else {
      /* Swiped right */
      prevSlide()
    }
  }
}

/* Lifecycle */
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousemove', showControlsTemporarily)
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
  
  if (props.autoPlay) {
    startAutoPlay()
  }
  
  showControlsTemporarily()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousemove', showControlsTemporarily)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
  
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
  
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
})
</script>

<template>
  <div class="presentation-view" :class="{ fullscreen: isFullscreen }">
    <!-- Main Content -->
    <div class="presentation-content">
      <BlogPostContent v-if="currentPost" :postId="currentPost.id" />
    </div>

    <!-- Controls -->
    <div class="presentation-controls" :class="{ visible: showControls }">
      <!-- Top Bar -->
      <div class="controls-top">
          <div class="presentation-title">
          <span class="material-icons">slideshow</span>
          <span>{{ currentPost ? t(currentPost.title) : t('Presentation') }}</span>
        </div>
        
        <div class="controls-actions">
          <button @click="togglePause" class="control-button" :title="isPaused ? 'Play' : 'Pause'">
            <span class="material-icons">{{ isPaused ? 'play_arrow' : 'pause' }}</span>
          </button>
          <button @click="toggleFullscreen" class="control-button" title="Toggle fullscreen">
            <span class="material-icons">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
          </button>
          <NuxtLink :to="currentPost ? `/blog/${currentPost.id}/${currentPost.slug}` : '/blog'" class="control-button" title="Exit presentation">
            <span class="material-icons">close</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="controls-bottom">
        <!-- Navigation -->
        <div class="slide-navigation">
          <button 
            @click="prevSlide" 
            :disabled="!hasPrev"
            class="nav-button prev"
            title="Previous slide (←)"
          >
            <span class="material-icons">navigate_before</span>
          </button>
          
          <div class="slide-info">
            <span class="slide-number">{{ currentIndex + 1 }} / {{ navigationTree.length }}</span>
            <div class="slide-progress">
              <div 
                class="progress-bar" 
                :style="{ width: `${((currentIndex + 1) / navigationTree.length) * 100}%` }"
              ></div>
            </div>
          </div>
          
          <button 
            @click="nextSlide" 
            :disabled="!hasNext"
            class="nav-button next"
            title="Next slide (→)"
          >
            <span class="material-icons">navigate_next</span>
          </button>
        </div>

        <!-- Slide Thumbnails -->
        <div class="slide-thumbnails">
          <button
            v-for="(post, index) in navigationTree"
            :key="post.id"
            @click="navigateToPost(post.id)"
            :class="['thumbnail', { active: post.id === currentPostId }]"
            :title="post.title"
          >
            <span class="thumbnail-number">{{ index + 1 }}</span>
            <span class="thumbnail-title">{{ post?.title || '' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Keyboard shortcuts help -->
    <div v-if="showControls" class="shortcuts-help">
      <span><kbd>←</kbd> / <kbd>→</kbd> Navigate</span>
      <span><kbd>Space</kbd> Next</span>
      <span><kbd>F</kbd> Fullscreen</span>
      <span><kbd>P</kbd> Play/Pause</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.presentation-view {
  position: fixed;
  inset: 0;
  background: var(--main-bg);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  
  &.fullscreen {
    background: #000;
    
    .presentation-content {
      padding: 2rem;
    }
  }
}

.presentation-content {
  flex: 1;
  overflow-y: auto;
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Override blog post styles for presentation */
  :deep(.article-content) {
    max-width: 1200px;
    width: 100%;
    font-size: 1.1rem;
    line-height: 1.8;
    
    h1 { font-size: 3rem; }
    h2 { font-size: 2.5rem; }
    h3 { font-size: 2rem; }
    h4 { font-size: 1.5rem; }
    
    pre {
      font-size: 1rem;
    }
  }
}

.presentation-controls {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
  
  &.visible {
    opacity: 1;
    pointer-events: auto;
  }
}

.controls-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
}

.presentation-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  
  .material-icons {
    font-size: 1.25rem;
  }
}

.controls-actions {
  display: flex;
  gap: 0.5rem;
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .material-icons {
    font-size: 1.25rem;
  }
}

.controls-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
}

.slide-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .material-icons {
    font-size: 1.5rem;
  }
}

.slide-info {
  text-align: center;
  color: white;
  
  .slide-number {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .slide-progress {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
    
    .progress-bar {
      height: 100%;
      background: var(--accent-500);
      transition: width 0.3s;
    }
  }
}

.slide-thumbnails {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  overflow-x: auto;
  padding: 0.5rem 0;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
}

.thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &.active {
    background: var(--accent-500);
    border-color: var(--accent-500);
  }
  
  .thumbnail-number {
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .thumbnail-title {
    font-size: 0.65rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
}

.shortcuts-help {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: white;
  opacity: 0.7;
  
  kbd {
    padding: 0.25rem 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 0.25rem;
    font-family: monospace;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .controls-top,
  .controls-bottom {
    padding: 1rem;
  }
  
  .slide-thumbnails {
    display: none;
  }
  
  .shortcuts-help {
    display: none;
  }
}
</style>
