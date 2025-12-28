<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'

interface Props {
  postId: string
}

const props = defineProps<Props>()

/* Component mapping for blog posts */
const componentMap: Record<string, any> = {
  '1': defineAsyncComponent(() => import('./Gdt/GdtFundamentals.vue')),
  '1-presentation': defineAsyncComponent(() => import('./Gdt/GdtPresentationContent.vue')),
  /* These components will be created as content is developed */
  // '2': defineAsyncComponent(() => import('./Gdt/GdtSymbolsOverview.vue')),
  // '3': defineAsyncComponent(() => import('./Gdt/FeatureControlFrames.vue')),
  // '4': defineAsyncComponent(() => import('./Gdt/DatumSystem.vue')),
  // '5': defineAsyncComponent(() => import('./Gdt/FormTolerances.vue')),
  // '6': defineAsyncComponent(() => import('./Gdt/OrientationTolerances.vue')),
  // '7': defineAsyncComponent(() => import('./Gdt/LocationTolerances.vue')),
  // '8': defineAsyncComponent(() => import('./Gdt/ProfileTolerances.vue')),
  // '9': defineAsyncComponent(() => import('./Gdt/RunoutTolerances.vue')),
  // '10': defineAsyncComponent(() => import('./Gdt/MaterialConditionModifiers.vue')),
}

const PostComponent = computed(() => componentMap[props.postId])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(() => {
  if (!PostComponent.value) {
    error.value = `Content not found for post ID: ${props.postId}`
    loading.value = false
  } else {
    loading.value = false
  }
})
</script>

<template>
  <div class="post-content-wrapper">
    <div v-if="loading" class="content-loading">
      <div class="spinner"></div>
      <p>Loading content...</p>
    </div>
    
    <div v-else-if="error" class="content-error">
      <span class="material-icons">error_outline</span>
      <p>{{ error }}</p>
      <p style="font-size: 0.9em; opacity: 0.7; margin-top: 0.5rem;">
        Post ID received: "{{ postId }}"<br>
        Type: {{ typeof postId }}
      </p>
    </div>
    
    <component v-else-if="PostComponent" :is="PostComponent" />
    
    <div v-else class="content-placeholder">
      <span class="material-icons">construction</span>
      <h3>Content Coming Soon</h3>
      <p>We're working on creating comprehensive content for this topic. Check back soon!</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post-content-wrapper {
  min-height: 400px;
}

.content-loading,
.content-error,
.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text);
  
  .material-icons {
    font-size: 3rem;
    color: var(--accent-500);
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
  }
  
  p {
    margin: 0;
    opacity: 0.7;
  }
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgb(var(--accent-500-rgb) / 20%);
  border-top-color: var(--accent-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.content-error {
  .material-icons {
    color: #ef4444;
  }
}
</style>
