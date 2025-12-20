<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="formula-box">
    <h4 v-if="title">{{ title }}</h4>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.formula-box {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  margin: 1rem 0;
  
  h4 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent-500);
    margin-bottom: 0.75rem;
  }
  
  :deep(p) {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.95rem;
    line-height: 1.8;
    margin: 0;
    color: var(--text);
  }
  
  :deep(code) {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
  }
}
</style>

