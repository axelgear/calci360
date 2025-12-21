<script setup lang="ts">
const props = defineProps<{
  title: string
  show: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlay?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:show', value: boolean): void
}>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'modal-sm'
    case 'lg': return 'modal-lg'
    case 'xl': return 'modal-xl'
    default: return 'modal-md'
  }
})

function handleOverlayClick() {
  if (props.closeOnOverlay !== false) {
    close()
  }
}

function close() {
  emit('close')
  emit('update:show', false)
}

/* Handle escape key */
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

/* Prevent body scroll when modal is open */
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="handleOverlayClick">
        <div :class="['modal-container', sizeClass]" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="modal-close" @click="close" aria-label="Close modal">
              <span class="material-icons">close</span>
            </button>
          </div>
          
          <!-- Content -->
          <div class="modal-content">
            <slot />
          </div>
          
          <!-- Footer (optional) -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgb(0 0 0 / 70%);
  backdrop-filter: blur(4px);
}

.modal-container {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 2rem);
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 1rem;
  box-shadow: 
    0 25px 50px -12px rgb(0 0 0 / 50%),
    0 0 0 1px rgb(var(--accent-500-rgb) / 10%);
  overflow: hidden;

  &.modal-sm {
    width: 100%;
    max-width: 380px;
  }

  &.modal-md {
    width: 100%;
    max-width: 500px;
  }

  &.modal-lg {
    width: 100%;
    max-width: 700px;
  }

  &.modal-xl {
    width: 100%;
    max-width: 900px;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgb(var(--accent-500-rgb) / 15%);
  background: rgb(var(--accent-500-rgb) / 5%);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.5rem;
  color: var(--neutral);
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgb(var(--accent-500-rgb) / 20%);
    color: var(--text);
  }

  .material-icons {
    font-size: 20px;
  }
}

.modal-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--accent-500-rgb) / 40%) transparent;

  /* Webkit scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(var(--accent-500-rgb) / 35%);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--accent-500-rgb) / 55%);
    background-clip: padding-box;
  }
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgb(var(--accent-500-rgb) / 15%);
  background: rgb(var(--accent-500-rgb) / 3%);
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.95) translateY(-10px);
    opacity: 0;
  }
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

