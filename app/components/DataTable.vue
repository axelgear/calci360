<script setup lang="ts">
import { ref, computed } from 'vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
  formatter?: (value: any) => string
}

interface Props {
  columns: Column[]
  data: Record<string, any>[]
  sortable?: boolean
  searchable?: boolean
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  loading?: boolean
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  sortable: true,
  searchable: false,
  striped: true,
  hoverable: true,
  bordered: true,
  loading: false,
  emptyText: 'No data available'
})

const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')
const searchQuery = ref('')

/* Filtered and sorted data */
const processedData = computed(() => {
  let result = [...props.data]

  /* Filter by search query */
  if (props.searchable && searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(query)
      )
    )
  }

  /* Sort data */
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = a[sortKey.value!]
      const bVal = b[sortKey.value!]
      
      let comparison = 0
      if (aVal < bVal) comparison = -1
      if (aVal > bVal) comparison = 1
      
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  }

  return result
})

/* Handle sorting */
const handleSort = (column: Column) => {
  if (!column.sortable || !props.sortable) return

  if (sortKey.value === column.key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    sortOrder.value = 'asc'
  }
}

/* Get cell value with optional formatter */
const getCellValue = (row: Record<string, any>, column: Column) => {
  const value = row[column.key]
  return column.formatter ? column.formatter(value) : value
}
</script>

<template>
  <div class="data-table-wrapper">
    <!-- Search -->
    <div v-if="searchable" class="data-table-search">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Search..."
      />
      <span class="material-icons search-icon">search</span>
    </div>

    <!-- Table -->
    <div class="data-table-container">
      <table 
        class="data-table"
        :class="{
          'data-table--striped': striped,
          'data-table--hoverable': hoverable,
          'data-table--bordered': bordered
        }"
      >
      <thead>
        <tr>
          <th
              v-for="column in columns"
              :key="column.key"
              class="table-header"
              :class="[
                `text-${column.align || 'left'}`,
                { 'table-header--sortable': column.sortable && sortable }
              ]"
              :style="{ width: column.width }"
              @click="handleSort(column)"
            >
              <div class="header-content">
                <span>{{ column.label }}</span>
                <span
                  v-if="column.sortable && sortable"
                  class="sort-icon material-icons"
                  :class="{
                    'sort-icon--active': sortKey === column.key,
                    'sort-icon--desc': sortKey === column.key && sortOrder === 'desc'
                  }"
                >
                  arrow_upward
                </span>
              </div>
          </th>
        </tr>
      </thead>
      <tbody>
          <tr v-if="loading" class="loading-row">
            <td :colspan="columns.length" class="loading-cell">
              <div class="loading-spinner"></div>
              <span>Loading...</span>
            </td>
          </tr>
          <tr v-else-if="processedData.length === 0" class="empty-row">
            <td :colspan="columns.length" class="empty-cell">
              {{ emptyText }}
            </td>
          </tr>
          <tr v-else v-for="(row, index) in processedData" :key="index">
          <td
              v-for="column in columns"
              :key="column.key"
              class="table-cell"
              :class="`text-${column.align || 'left'}`"
            >
              {{ getCellValue(row, column) }}
            </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-table-wrapper {
  width: 100%;
}

.data-table-search {
  position: relative;
  margin-bottom: 1rem;

  .search-input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    background: var(--card);
    border: 1px solid rgba(var(--text-rgb), 0.2);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--accent-500);
    }
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.25rem;
    color: rgba(var(--text-rgb), 0.5);
  }
}

.data-table-container {
  width: 100%;
  overflow-x: auto;
  background: var(--card);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  &--bordered {
    border: 1px solid rgba(var(--text-rgb), 0.1);

    th,
    td {
      border: 1px solid rgba(var(--text-rgb), 0.1);
    }
  }

  &--striped tbody tr:nth-child(even) {
    background: rgba(var(--text-rgb), 0.02);
  }

  &--hoverable tbody tr:hover {
    background: rgba(var(--accent-500-rgb), 0.05);
  }
}

.table-header {
  padding: 0.75rem 1rem;
  background: rgba(var(--text-rgb), 0.05);
    font-weight: 600;
    color: var(--text);
  text-align: left;
    white-space: nowrap;

  &--sortable {
    cursor: pointer;
    user-select: none;

    &:hover {
      background: rgba(var(--text-rgb), 0.08);
    }
  }

  &.text-center {
    text-align: center;
  }

  &.text-right {
    text-align: right;
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-icon {
  font-size: 1rem;
  color: rgba(var(--text-rgb), 0.3);
  transition: all 0.2s;

  &--active {
    color: var(--accent-500);
  }

  &--desc {
    transform: rotate(180deg);
  }
}

.table-cell {
  padding: 0.75rem 1rem;
    color: var(--text);
    
  &.text-center {
    text-align: center;
  }

  &.text-right {
    text-align: right;
    }
}

.loading-row,
.empty-row {
  td {
    padding: 2rem;
    text-align: center;
    color: rgba(var(--text-rgb), 0.5);
    }
  }
  
.loading-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(var(--accent-500-rgb), 0.2);
  border-top-color: var(--accent-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
    }
    
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .data-table {
    font-size: 0.75rem;
  }

  .table-header,
  .table-cell {
    padding: 0.5rem 0.75rem;
  }
}
</style>