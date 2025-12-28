<script setup lang="ts">
interface Props {
  code?: string
  lang?: string
  filename?: string
  highlightLines?: number[]
  wrapLines?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  lang: 'text',
  wrapLines: false
})
</script>

<template>
  <div class="code-block">
    <div v-if="filename" class="code-header">
      <span class="filename">{{ filename }}</span>
    </div>
    <pre class="code-content" :class="{ 'wrap-lines': wrapLines }"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped lang="scss">
.code-block {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 1rem 0;
  font-family: var(--font-mono);
}

.code-header {
  background: var(--bg-dark);
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.875rem;
  color: var(--text-light);
}

.code-content {
  padding: 1rem;
  margin: 0;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.6;
  
  &.wrap-lines {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  
  code {
    background: none;
    padding: 0;
    font-family: inherit;
    color: var(--text);
  }
}
</style>