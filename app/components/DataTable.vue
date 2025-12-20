<script setup lang="ts">
export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
  mono?: boolean
}

export interface TableRow {
  [key: string]: string | number | boolean | undefined
  _highlight?: boolean
}

const props = defineProps<{
  columns: TableColumn[]
  rows: TableRow[]
  striped?: boolean
  hoverable?: boolean
  compact?: boolean
}>()
</script>

<template>
  <div class="table-wrapper" :class="{ compact }">
    <table :class="{ striped, hoverable }">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align || 'left', width: col.width }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows" :key="idx" :class="{ highlight: row._highlight }">
          <td
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align || 'left' }"
            :class="{ mono: col.mono, exact: row[col.key] === 'Exact' }"
            v-html="row[col.key]"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.table-wrapper {
  overflow-x: auto;
  margin: 1.5rem 0;
  border-radius: 1rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  
  &.compact {
    table {
      font-size: 0.85rem;
      
      th, td {
        padding: 0.625rem 0.875rem;
      }
    }
  }
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  
  th, td {
    padding: 0.875rem 1rem;
    text-align: left;
    border-bottom: 1px solid rgb(var(--accent-500-rgb) / 10%);
  }
  
  th {
    background: rgb(var(--accent-500-rgb) / 8%);
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
  }
  
  td {
    color: var(--text);
    
    &.exact {
      color: #10b981;
      font-weight: 600;
    }
    
    &.mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
    }
  }
  
  &.hoverable tbody tr {
    transition: background 0.2s;
    
    &:hover {
      background: rgb(var(--accent-500-rgb) / 5%);
    }
  }
  
  tbody tr {
    &:last-child td {
      border-bottom: none;
    }
    
    &.highlight td {
      background: rgb(var(--accent-500-rgb) / 8%);
    }
  }
}
</style>

