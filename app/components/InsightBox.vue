<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  icon?: string
  variant?: 'warning' | 'info' | 'success'
}>(), {
  title: 'Key Insight',
  icon: 'lightbulb',
  variant: 'warning',
})

const variantColors = {
  warning: { bg: 'rgb(255 193 7 / 10%)', border: 'rgb(255 193 7 / 30%)', text: '#f59e0b' },
  info: { bg: 'rgb(var(--accent-500-rgb) / 10%)', border: 'rgb(var(--accent-500-rgb) / 30%)', text: 'var(--accent-500)' },
  success: { bg: 'rgb(16 185 129 / 10%)', border: 'rgb(16 185 129 / 30%)', text: '#10b981' },
}
</script>

<template>
  <div 
    class="insight-box"
    :style="{
      '--box-bg': variantColors[variant].bg,
      '--box-border': variantColors[variant].border,
      '--box-color': variantColors[variant].text,
    }"
  >
    <h4>
      <span class="material-icons">{{ icon }}</span>
      {{ title }}
    </h4>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.insight-box {
  background: var(--box-bg);
  border: 1px solid var(--box-border);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 1.5rem 0;
  
  h4 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    color: var(--box-color);
    margin-bottom: 0.75rem;
    
    .material-icons {
      font-size: 1.25rem;
    }
  }
  
  :deep(p) {
    margin: 0;
    color: var(--text);
    opacity: 0.9;
    line-height: 1.6;
    
    &:not(:last-child) {
      margin-bottom: 0.75rem;
    }
  }
}
</style>

