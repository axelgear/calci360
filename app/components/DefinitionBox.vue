<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="definition-box">
    <h4 v-if="title">{{ title }}</h4>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.definition-box {
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 10%) 0%, rgb(var(--accent-500-rgb) / 5%) 100%);
  border-left: 4px solid var(--accent-500);
  border-radius: 0 1rem 1rem 0;
  padding: 1.5rem;
  margin: 1.5rem 0;
  
  h4 {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent-500);
    margin-bottom: 0.75rem;
  }
  
  :deep(p) {
    margin: 0;
    line-height: 1.7;
    color: var(--text);
    
    &:not(:last-child) {
      margin-bottom: 0.75rem;
    }
  }
}
</style>

