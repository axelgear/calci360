<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  delay: 500,
  disabled: false,
})

const isVisible = ref(false)
const triggerRef = ref<HTMLElement>()
const tooltipRef = ref<HTMLElement>()
const position = ref({ top: 0, left: 0 })

let showTimeout: NodeJS.Timeout | null = null
let hideTimeout: NodeJS.Timeout | null = null

const calculatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const spacing = 8

  let top = 0
  let left = 0

  switch (props.placement) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - spacing
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'bottom':
      top = triggerRect.bottom + spacing
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - spacing
      break
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + spacing
      break
  }

  // Keep tooltip within viewport
  const padding = 10
  top = Math.max(padding, Math.min(window.innerHeight - tooltipRect.height - padding, top))
  left = Math.max(padding, Math.min(window.innerWidth - tooltipRect.width - padding, left))

  position.value = { top, left }
}

const show = () => {
  if (props.disabled) return
  
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  
  showTimeout = setTimeout(() => {
    isVisible.value = true
    requestAnimationFrame(calculatePosition)
  }, props.delay)
}

const hide = () => {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  
  hideTimeout = setTimeout(() => {
    isVisible.value = false
  }, 100)
}

const tooltipStyles = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
}))
</script>

<template>
  <div class="tooltip-wrapper">
    <div
      ref="triggerRef"
      class="tooltip-trigger"
      @mouseenter="show"
      @mouseleave="hide"
      @focus="show"
      @blur="hide"
    >
      <slot />
    </div>
    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="isVisible"
          ref="tooltipRef"
          class="tooltip"
          :class="`tooltip--${placement}`"
          :style="tooltipStyles"
          @mouseenter="show"
          @mouseleave="hide"
        >
          {{ content }}
          <div class="tooltip__arrow" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.tooltip-wrapper {
  display: inline-block;
}

.tooltip-trigger {
  display: inline-block;
}

.tooltip {
  position: fixed;
  z-index: 9999;
  padding: 0.5rem 0.75rem;
  background: var(--text);
  color: var(--main-bg);
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  pointer-events: auto;
  white-space: nowrap;
  max-width: 300px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
}

.tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  
  .tooltip--top & {
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: var(--text);
  }
  
  .tooltip--bottom & {
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: var(--text);
  }
  
  .tooltip--left & {
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    border-left-color: var(--text);
  }
  
  .tooltip--right & {
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: var(--text);
  }
}

/* Transitions */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  
  &.tooltip--top {
    transform: translateY(4px);
  }
  
  &.tooltip--bottom {
    transform: translateY(-4px);
  }
  
  &.tooltip--left {
    transform: translateX(4px);
  }
  
  &.tooltip--right {
    transform: translateX(-4px);
  }
}
</style>
