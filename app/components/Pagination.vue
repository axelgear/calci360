<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
  totalPages: number
  maxVisible?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 7,
  showFirstLast: true,
  showPrevNext: true,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const currentPage = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value)
})

/* Calculate visible page numbers */
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = currentPage.value
  const maxVisible = props.maxVisible

  if (total <= maxVisible) {
    /* Show all pages */
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    /* Calculate start and end of visible range */
    const halfVisible = Math.floor(maxVisible / 2)
    let start = Math.max(1, current - halfVisible)
    let end = Math.min(total, current + halfVisible)

    /* Adjust if at the beginning or end */
    if (current <= halfVisible) {
      end = maxVisible - 2
    } else if (current >= total - halfVisible) {
      start = total - maxVisible + 3
    }

    /* Always show first page */
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    /* Show visible range */
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    /* Always show last page */
    if (end < total) {
      if (end < total - 1) pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const goToPage = (page: number) => {
  if (!props.disabled && page >= 1 && page <= props.totalPages) {
    currentPage.value = page
  }
}

const prevPage = () => goToPage(currentPage.value - 1)
const nextPage = () => goToPage(currentPage.value + 1)
const firstPage = () => goToPage(1)
const lastPage = () => goToPage(props.totalPages)
</script>

<template>
  <nav 
    class="pagination"
    :class="{ 'pagination--disabled': disabled }"
    role="navigation"
    aria-label="Pagination"
  >
    <!-- First button -->
    <button
      v-if="showFirstLast"
      class="pagination-button pagination-button--nav"
      :disabled="disabled || currentPage === 1"
      @click="firstPage"
      aria-label="Go to first page"
    >
      <span class="material-icons">first_page</span>
    </button>

    <!-- Previous button -->
    <button
      v-if="showPrevNext"
      class="pagination-button pagination-button--nav"
      :disabled="disabled || currentPage === 1"
      @click="prevPage"
      aria-label="Go to previous page"
    >
      <span class="material-icons">chevron_left</span>
    </button>

    <!-- Page numbers -->
    <template v-for="(page, index) in visiblePages" :key="index">
        <button
        v-if="typeof page === 'number'"
        class="pagination-button"
        :class="{ 'pagination-button--active': page === currentPage }"
          :disabled="disabled"
        @click="goToPage(page)"
        :aria-label="`Go to page ${page}`"
        :aria-current="page === currentPage ? 'page' : undefined"
        >
          {{ page }}
        </button>
      <span v-else class="pagination-ellipsis">{{ page }}</span>
      </template>

    <!-- Next button -->
    <button
      v-if="showPrevNext"
      class="pagination-button pagination-button--nav"
      :disabled="disabled || currentPage === totalPages"
      @click="nextPage"
      aria-label="Go to next page"
    >
      <span class="material-icons">chevron_right</span>
    </button>

    <!-- Last button -->
    <button
      v-if="showFirstLast"
      class="pagination-button pagination-button--nav"
      :disabled="disabled || currentPage === totalPages"
      @click="lastPage"
      aria-label="Go to last page"
    >
      <span class="material-icons">last_page</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  user-select: none;
  
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  background: var(--card);
  border: 1px solid rgba(var(--text-rgb), 0.2);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: rgba(var(--accent-500-rgb), 0.1);
    border-color: var(--accent-500);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-500);
    outline-offset: 2px;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  &--active {
    background: var(--accent-500);
    border-color: var(--accent-500);
    color: white;

    &:hover {
      background: var(--accent-600);
      border-color: var(--accent-600);
    }
  }

  &--nav {
    padding: 0;
    
    .material-icons {
      font-size: 1.25rem;
    }
  }
}

.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2.25rem;
  color: rgba(var(--text-rgb), 0.5);
  font-size: 0.875rem;
  user-select: none;
}

/* Responsive */
@media (max-width: 640px) {
  .pagination {
    gap: 0.125rem;
  }

  .pagination-button {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.75rem;

    &--nav .material-icons {
      font-size: 1.125rem;
    }
  }
}
</style>