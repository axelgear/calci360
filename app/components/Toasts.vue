<script setup lang="ts">
import { ref } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const toasts = ref<Toast[]>([])

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Date.now().toString()
  const newToast: Toast = {
    ...toast,
    id,
    duration: toast.duration || 5000,
  }
  
  toasts.value.push(newToast)
  
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expose methods for external use
defineExpose({
  addToast,
  removeToast,
})

const getIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success': return 'check_circle'
    case 'error': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="toasts-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
        >
          <div class="toast__icon">
            <span class="material-icons">{{ getIcon(toast.type) }}</span>
          </div>
          <div class="toast__content">
            <h4 class="toast__title">{{ toast.title }}</h4>
            <p v-if="toast.message" class="toast__message">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            class="toast__close"
            @click="removeToast(toast.id)"
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
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  
  @include phone {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 0.75rem;
  box-shadow: 0 4px 16px rgb(0 0 0 / 15%);
  
  &--success {
    border-color: rgb(16 185 129 / 30%);
    
    .toast__icon {
      background: rgb(16 185 129 / 15%);
      color: #10b981;
    }
  }
  
  &--error {
    border-color: rgb(239 68 68 / 30%);
    
    .toast__icon {
      background: rgb(239 68 68 / 15%);
      color: #ef4444;
    }
  }
  
  &--warning {
    border-color: rgb(245 158 11 / 30%);
    
    .toast__icon {
      background: rgb(245 158 11 / 15%);
      color: #f59e0b;
    }
  }
  
  &--info {
    border-color: rgb(59 130 246 / 30%);
    
    .toast__icon {
      background: rgb(59 130 246 / 15%);
      color: #3b82f6;
    }
  }
}

.toast__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
  
  .material-icons {
    font-size: 1.25rem;
  }
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
}

.toast__message {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text);
  opacity: 0.75;
  line-height: 1.4;
}

.toast__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  background: transparent;
  border: none;
  color: var(--text);
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.2s;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
  }
  
  .material-icons {
    font-size: 1.1rem;
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

.toast-move {
  transition: transform 0.3s ease;
}
</style>
