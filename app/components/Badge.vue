<script setup lang="ts">
interface Props {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'medium' | 'large'
  rounded?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  rounded: true,
})
</script>

<template>
  <span 
    class="badge" 
    :class="[
      `badge--${type}`,
      `badge--${size}`,
      { 'badge--rounded': rounded }
    ]"
  >
    <slot />
  </span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s;
  
  /* Sizes */
  &--small {
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
  }
  
  &--medium {
    padding: 0.35rem 0.75rem;
    font-size: 0.85rem;
  }
  
  &--large {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }
  
  /* Rounded */
  &--rounded {
    border-radius: 999px;
  }
  
  /* Types */
  &--default {
    background: var(--card);
    color: var(--text);
    border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  }
  
  &--primary {
    background: var(--accent-500);
    color: white;
  }
  
  &--success {
    background: #10b981;
    color: white;
  }
  
  &--warning {
    background: #f59e0b;
    color: white;
  }
  
  &--danger {
    background: #ef4444;
    color: white;
  }
  
  &--info {
    background: #3b82f6;
    color: white;
  }
}
</style>
