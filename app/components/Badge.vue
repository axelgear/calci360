<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  count?: number | string
  maxCount?: number
  showZero?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  dot: false,
  maxCount: 99,
  showZero: false
})

const displayCount = computed(() => {
  if (props.dot) return ''
  if (typeof props.count === 'string') return props.count
  if (typeof props.count === 'number') {
    return props.count > props.maxCount ? `${props.maxCount}+` : props.count.toString()
  }
  return ''
})

const slots = useSlots()

const showBadge = computed(() => {
  if (props.dot) return true
  if (props.count === 0 && !props.showZero) return false
  return props.count !== undefined || slots.default
})
</script>

<template>
  <span v-if="showBadge" 
    class="badge" 
    :class="[
      `badge--${variant}`,
      `badge--${size}`,
      { 
        'badge--dot': dot,
        'badge--count': !dot && count !== undefined
      }
    ]"
  >
    <slot>{{ displayCount }}</slot>
  </span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  text-align: center;
  border-radius: 999px;
  transition: all 0.2s;
  
  /* Size variants */
  &--sm {
    padding: 0.125rem 0.375rem;
    font-size: 0.625rem;
    min-width: 1rem;
    height: 1rem;
  }

  &--md {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    min-width: 1.25rem;
    height: 1.25rem;
  }
  
  &--lg {
    padding: 0.375rem 0.625rem;
    font-size: 0.875rem;
    min-width: 1.5rem;
    height: 1.5rem;
  }
  
  /* Dot variant */
  &--dot {
    padding: 0;
    min-width: 0;
    
    &.badge--sm {
      width: 0.375rem;
      height: 0.375rem;
    }
    
    &.badge--md {
      width: 0.5rem;
      height: 0.5rem;
    }
    
    &.badge--lg {
      width: 0.625rem;
      height: 0.625rem;
    }
  }
  
  /* Count badge specific */
  &--count {
    &.badge--sm {
      min-width: 1rem;
    }
    
    &.badge--md {
      min-width: 1.25rem;
    }
    
    &.badge--lg {
      min-width: 1.5rem;
    }
  }
  
  /* Color variants */
  &--default {
    background: rgba(var(--text-rgb), 0.1);
    color: var(--text);
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

/* Animation for appearing */
@keyframes badge-zoom-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.badge {
  animation: badge-zoom-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>