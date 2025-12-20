<script setup lang="ts">
defineProps<{
  id?: string
  icon?: string
  title: string
}>()
</script>

<template>
  <section :id="id" class="content-section">
    <h2>
      <span v-if="icon" class="material-icons">{{ icon }}</span>
      {{ title }}
    </h2>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.content-section {
  margin-bottom: 4rem;
  scroll-margin-top: 4rem;
  
  h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid rgb(var(--accent-500-rgb) / 20%);
    color: var(--text);
    
    .material-icons {
      color: var(--accent-500);
      font-size: 1.5rem;
    }
  }
  
  :deep(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 2rem 0 1rem;
    color: var(--text);
  }
  
  :deep(p) {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--text);
    margin-bottom: 1rem;
    
    strong {
      color: var(--accent-500);
    }
    
    em {
      font-style: italic;
    }
  }
  
  :deep(ul), :deep(ol) {
    color: var(--text);
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }
  }
}
</style>

