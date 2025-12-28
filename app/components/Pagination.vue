<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  maxVisible?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 7,
  disabled: false,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const pages = computed(() => {
  const pages: (number | string)[] = []
  const { currentPage, totalPages, maxVisible } = props

  if (totalPages <= maxVisible) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Show first page
    pages.push(1)

    // Calculate start and end
    let start = Math.max(2, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages - 1, start + maxVisible - 3)

    // Adjust start if end is at max
    if (end === totalPages - 1) {
      start = Math.max(2, end - maxVisible + 3)
    }

    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...')
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('...')
    }

    // Show last page
    pages.push(totalPages)
  }

  return pages
})

const goToPage = (page: number) => {
  if (!props.disabled && page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}

const goToPrevious = () => goToPage(props.currentPage - 1)
const goToNext = () => goToPage(props.currentPage + 1)
</script>

<template>
  <nav class="pagination" :class="{ 'pagination--disabled': disabled }">
    <button
      type="button"
      class="pagination__btn pagination__btn--prev"
      :disabled="disabled || currentPage === 1"
      @click="goToPrevious"
    >
      <span class="material-icons">chevron_left</span>
    </button>

    <div class="pagination__pages">
      <template v-for="(page, index) in pages" :key="index">
        <span v-if="page === '...'" class="pagination__ellipsis">...</span>
        <button
          v-else
          type="button"
          class="pagination__page"
          :class="{ 'pagination__page--active': page === currentPage }"
          :disabled="disabled"
          @click="goToPage(page as number)"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <button
      type="button"
      class="pagination__btn pagination__btn--next"
      :disabled="disabled || currentPage === totalPages"
      @click="goToNext"
    >
      <span class="material-icons">chevron_right</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.5rem;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    border-color: var(--accent-500);
    color: var(--accent-500);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  .material-icons {
    font-size: 1.25rem;
  }
}

.pagination__pages {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.pagination__page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.5rem;
  color: var(--text);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    border-color: var(--accent-500);
    color: var(--accent-500);
  }
  
  &--active {
    background: var(--accent-500);
    color: white;
    border-color: var(--accent-500);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
}

.pagination__ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  color: var(--neutral);
  font-weight: 600;
}
</style>
