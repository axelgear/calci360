<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  copyable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  copyable: false
})

const isCopied = ref(false)

const copyCode = async (event: MouseEvent) => {
  if (!props.copyable) return
  
  const target = event.currentTarget as HTMLElement
  const code = target.textContent || ''
  
  try {
    await navigator.clipboard.writeText(code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 1500)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <code 
    class="inline-code"
    :class="{ 
      'inline-code--copyable': copyable,
      'inline-code--copied': isCopied 
    }"
    @click="copyCode"
    :title="copyable ? (isCopied ? 'Copied!' : 'Click to copy') : undefined"
  >
    <slot />
  </code>
</template>

<style scoped lang="scss">
.inline-code {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  background: rgba(var(--accent-500-rgb), 0.1);
  border: 1px solid rgba(var(--accent-500-rgb), 0.2);
  border-radius: 0.25rem;
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
  font-size: 0.85em;
  color: var(--accent-500);
  white-space: nowrap;
  transition: all 0.2s;

  &--copyable {
    cursor: pointer;

    &:hover {
      background: rgba(var(--accent-500-rgb), 0.15);
      border-color: rgba(var(--accent-500-rgb), 0.3);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &--copied {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
    color: #10b981;
  }
}

/* Dark mode */
.dark {
  .inline-code {
    background: rgba(var(--accent-500-rgb), 0.15);
    border-color: rgba(var(--accent-500-rgb), 0.3);
  }
}
</style>
