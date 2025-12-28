<script setup lang="ts">
import { ref } from 'vue'

export interface Toast {
  id: string
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
}

interface Props {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  maxToasts?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom-right',
  maxToasts: 5
})

const toasts = ref<Toast[]>([])

/* Add a new toast */
const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Date.now().toString()
  const newToast: Toast = {
    id,
    type: 'info',
    duration: 5000,
    ...toast
  }
  
  toasts.value.push(newToast)
  
  /* Limit number of toasts */
  if (toasts.value.length > props.maxToasts) {
    toasts.value.shift()
  }

  /* Auto remove after duration */
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }

  return id
}

/* Remove a toast */
const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

/* Toast icons */
const getToastIcon = (type?: string) => {
  switch (type) {
    case 'success': return 'check_circle'
    case 'error': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'info'
  }
}

/* Expose methods for external use */
defineExpose({
  addToast,
  removeToast
})
</script>

<template>
  <Teleport to="body">
    <div 
      class="toasts-container"
      :class="`toasts-container--${position}`"
    >
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type || 'info'}`"
        >
          <span class="toast-icon material-icons">
            {{ getToastIcon(toast.type) }}
          </span>
          
          <div class="toast-content">
            <h4 v-if="toast.title" class="toast-title">{{ toast.title }}</h4>
            <p class="toast-message">{{ toast.message }}</p>
          </div>

          <button
            v-if="toast.action"
            class="toast-action"
            @click="toast.action.handler"
          >
            {{ toast.action.label }}
          </button>

          <button
            class="toast-close"
            @click="removeToast(toast.id)"
            aria-label="Close notification"
          >
            <span class="material-icons">close</span>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.toasts-container {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  padding: 1rem;

  &--top-left {
    top: 0;
    left: 0;
  }

  &--top-center {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  &--top-right {
    top: 0;
    right: 0;
  }

  &--bottom-left {
    bottom: 0;
    left: 0;
  }

  &--bottom-center {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  &--bottom-right {
    bottom: 0;
    right: 0;
  }
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 20rem;
  max-width: 30rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: var(--card);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  pointer-events: auto;
  
  &--success {
    border-left: 4px solid #10b981;
    
    .toast-icon {
      color: #10b981;
    }
  }
  
  &--error {
    border-left: 4px solid #ef4444;
    
    .toast-icon {
      color: #ef4444;
    }
  }
  
  &--warning {
    border-left: 4px solid #f59e0b;
    
    .toast-icon {
      color: #f59e0b;
    }
  }
  
  &--info {
    border-left: 4px solid #3b82f6;
    
    .toast-icon {
      color: #3b82f6;
    }
  }
}

.toast-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.25rem;
}

.toast-message {
  font-size: 0.875rem;
  color: rgba(var(--text-rgb), 0.8);
  margin: 0;
  line-height: 1.5;
}

.toast-action {
  flex-shrink: 0;
  padding: 0.25rem 0.75rem;
  background: none;
  border: 1px solid rgba(var(--text-rgb), 0.2);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--accent-500);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(var(--accent-500-rgb), 0.1);
    border-color: var(--accent-500);
  }
}

.toast-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;

  .material-icons {
    font-size: 1rem;
    color: rgba(var(--text-rgb), 0.5);
  }
  
  &:hover {
    background: rgba(var(--text-rgb), 0.1);
  
  .material-icons {
      color: var(--text);
    }
  }
}

/* Transitions */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Adjust for left-side positions */
.toasts-container--top-left,
.toasts-container--bottom-left {
  .toast-enter-from,
  .toast-leave-to {
    transform: translateX(-100%);
  }
}

/* Adjust for center positions */
.toasts-container--top-center,
.toasts-container--bottom-center {
  .toast-enter-from {
    transform: translateY(-100%);
    opacity: 0;
  }

  .toast-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .toast {
    min-width: 0;
    max-width: calc(100vw - 2rem);
  }
}
</style>