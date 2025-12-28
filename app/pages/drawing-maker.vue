<script setup lang="ts">
import DrawingMaker from '@/components/Calculator/DrawingMaker/DrawingMaker.vue'
import { useHead } from '#imports'

useHead({
  title: 'Automatic Drawing Maker Bot',
  meta: [
    { name: 'description', content: 'Generate 2D/3D drawings with GD&T and annotations from STEP files.' }
  ]
})
</script>

<template>
  <div class="page-container">
    <div class="header">
      <h1>Drawing Maker Bot</h1>
      <p>Upload a STEP file to generate annotations and drawings.</p>
    </div>
    
    <ClientOnly>
      <DrawingMaker />
    </ClientOnly>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--text);
}

p {
  color: var(--neutral);
}
</style>

