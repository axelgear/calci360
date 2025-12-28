<script setup lang="ts">
import { computed } from 'vue'

export interface TimelineItem {
  id: string | number
  date: Date | string
  title?: string
  description?: string
  icon?: string
  color?: string
  metadata?: Record<string, any>
  content?: any
}

interface Props {
  items: TimelineItem[]
  groupByDate?: boolean
  dateFormat?: 'full' | 'short' | 'relative' | ((date: Date) => string)
  linePosition?: 'left' | 'center'
  lineColor?: string
  ballSize?: string
  lineWidth?: string
  showLine?: boolean
  orientation?: 'vertical' | 'horizontal'
  stickyDates?: boolean
  variant?: 'default' | 'minimal'
}

const props = withDefaults(defineProps<Props>(), {
  groupByDate: true,
  dateFormat: 'short',
  linePosition: 'left',
  lineColor: 'var(--accent-500)',
  ballSize: '24px',
  lineWidth: '4px',
  showLine: true,
  orientation: 'vertical',
  stickyDates: true,
  variant: 'default'
})

const emit = defineEmits<{
  'item-click': [item: TimelineItem]
}>()

// Format date based on the dateFormat prop
const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (typeof props.dateFormat === 'function') {
    return props.dateFormat(dateObj)
  }
  
  switch (props.dateFormat) {
    case 'full':
      return dateObj.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    case 'short':
      return dateObj.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    case 'relative':
      const now = new Date()
      const diff = now.getTime() - dateObj.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return 'Today'
      if (days === 1) return 'Yesterday'
      if (days < 7) return `${days} days ago`
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`
      if (days < 365) return `${Math.floor(days / 30)} months ago`
      return `${Math.floor(days / 365)} years ago`
    default:
      return dateObj.toLocaleDateString()
  }
}

// Group items by date if enabled
const groupedItems = computed(() => {
  if (!props.groupByDate) {
    return { '': props.items }
  }
  
  return props.items.reduce((acc, item) => {
    const dateKey = formatDate(item.date)
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(item)
    return acc
  }, {} as Record<string, TimelineItem[]>)
})

// CSS variables for dynamic styling
const cssVars = computed(() => ({
  '--timeline-line-color': props.lineColor,
  '--timeline-ball-size': props.ballSize,
  '--timeline-line-width': props.lineWidth,
}))

const handleItemClick = (item: TimelineItem) => {
  emit('item-click', item)
}
</script>

<template>
  <div 
    class="timeline" 
    :class="[
      `timeline--${orientation}`,
      `timeline--line-${linePosition}`,
      `timeline--${variant}`,
      { 'timeline--no-line': !showLine }
    ]"
    :style="cssVars"
  >
    <!-- Timeline Line -->
    <div v-if="showLine" class="timeline-line"></div>
    
    <!-- Timeline Content -->
    <div class="timeline-content">
      <section 
        v-for="(items, dateKey) in groupedItems" 
        :key="dateKey"
        class="timeline-section"
      >
        <!-- Date Header -->
        <div 
          v-if="groupByDate && dateKey" 
          class="timeline-date"
          :class="{ 'timeline-date--sticky': stickyDates }"
        >
          <div class="timeline-ball" :style="{ backgroundColor: items[0]?.color }">
            <span v-if="items[0]?.icon" class="material-icons">{{ items[0].icon }}</span>
          </div>
          <span class="timeline-date-text">{{ dateKey }}</span>
        </div>
        
        <!-- Items -->
        <div class="timeline-items">
          <div
            v-for="item in items"
            :key="item.id"
            class="timeline-item"
            @click="handleItemClick(item)"
          >
            <!-- Default slot for custom item content -->
            <slot name="item" :item="item">
              <component v-if="item.content" :is="item.content" />
              <div v-else class="timeline-item-default">
                <h3 v-if="item.title" class="timeline-item-title">{{ item.title }}</h3>
                <p v-if="item.description" class="timeline-item-description">{{ item.description }}</p>
                <div v-if="item.metadata" class="timeline-item-metadata">
                  <slot name="metadata" :metadata="item.metadata">
                    <span 
                      v-for="(value, key) in item.metadata" 
                      :key="key"
                      class="metadata-item"
                    >
                      {{ key }}: {{ value }}
                    </span>
                  </slot>
                </div>
              </div>
            </slot>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.timeline {
  position: relative;
  width: 100%;
  
  &--vertical {
    .timeline-line {
      position: absolute;
      top: 20px;
      bottom: 20px;
      width: var(--timeline-line-width);
      background-color: var(--timeline-line-color);
      border-radius: calc(var(--timeline-line-width) / 2);
    }
    
    &.timeline--line-left {
      .timeline-line {
        left: calc(var(--timeline-ball-size) / 2 - var(--timeline-line-width) / 2);
      }
      
      .timeline-content {
        padding-left: calc(var(--timeline-ball-size) + 2rem);
      }
    }
    
    &.timeline--line-center {
      .timeline-line {
        left: 50%;
        transform: translateX(-50%);
      }
      
      .timeline-section {
        &:nth-child(odd) {
          .timeline-items {
            margin-right: 50%;
            padding-right: 2rem;
            text-align: right;
          }
        }
        
        &:nth-child(even) {
          .timeline-items {
            margin-left: 50%;
            padding-left: 2rem;
          }
          
          .timeline-date {
            justify-content: flex-start;
            margin-left: 50%;
            padding-left: 2rem;
          }
        }
      }
    }
  }
  
  &--horizontal {
    .timeline-line {
      position: absolute;
      left: 20px;
      right: 20px;
      height: var(--timeline-line-width);
      background-color: var(--timeline-line-color);
      border-radius: calc(var(--timeline-line-width) / 2);
      top: calc(var(--timeline-ball-size) / 2 - var(--timeline-line-width) / 2);
    }
    
    .timeline-content {
      display: flex;
      gap: 2rem;
      padding-top: calc(var(--timeline-ball-size) + 2rem);
      overflow-x: auto;
      
      &::-webkit-scrollbar {
        height: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(var(--text-rgb), 0.1);
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(var(--text-rgb), 0.3);
        border-radius: 4px;
        
        &:hover {
          background: rgba(var(--text-rgb), 0.4);
        }
      }
    }
    
    .timeline-section {
      flex-shrink: 0;
      min-width: 200px;
    }
  }
}

.timeline-section {
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-date {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  
  &--sticky {
    position: sticky;
    top: 1rem;
    z-index: 10;
    padding: 0.5rem 0;
  }
}

.timeline-ball {
  width: var(--timeline-ball-size);
  height: var(--timeline-ball-size);
  border-radius: 50%;
  background-color: var(--accent-500);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  
  .material-icons {
    font-size: calc(var(--timeline-ball-size) * 0.6);
    color: white;
  }
}

.timeline-date-text {
  font-weight: 600;
  color: var(--accent-500);
  font-size: 0.9rem;
  white-space: nowrap;
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateX(5px);
  }
}

.timeline-item-default {
  background: var(--card);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(var(--accent-500-rgb), 0.1);
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--accent-500);
    box-shadow: 0 4px 12px rgba(var(--accent-500-rgb), 0.1);
  }
}

.timeline-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--text);
}

.timeline-item-description {
  font-size: 0.9rem;
  color: var(--text);
  opacity: 0.8;
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

.timeline-item-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text);
  opacity: 0.6;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Minimal variant styles */
.timeline--minimal {
  &.timeline--vertical {
    .timeline-line {
      top: 38px;
      bottom: 0;
      width: 6px;
      left: calc(#{var(--timeline-ball-size)} / 2 - 6px / 2);
      border-radius: 3px;
    }
    
    .timeline-section {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
      margin-bottom: 2rem;
      
      @media (min-width: 769px) {
        margin-left: calc(-#{var(--timeline-ball-size)} / 2 + 6px / 2);
      }
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
      }
    }
    
    .timeline-date {
      gap: 2rem;
      margin-bottom: 0;
      flex-shrink: 0;
      
      @media (max-width: 768px) {
        gap: 1rem;
      }
    }
    
    .timeline-date-text {
      flex-shrink: 0;
      min-width: 80px;
      font-size: 0.875rem;
    }
    
    .timeline-ball {
      background-color: var(--main-bg);
      
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        height: 50%;
        border-radius: 50%;
        background-color: var(--accent-500);
      }
    }
    
    .timeline-items {
      width: 100%;
    }
    
    .timeline-item {
      width: 100%;
      
      &:hover {
        transform: none;
      }
    }
    
    .timeline-content {
      padding-left: 0;
    }
  }
}

/* Responsive */
@media (max-width: 768px) {
  .timeline {
    &--vertical {
      &.timeline--line-center {
        .timeline-line {
          display: none;
        }
        
        .timeline-section {
          &:nth-child(odd),
          &:nth-child(even) {
            .timeline-items {
              margin: 0;
              padding: 0;
              text-align: left;
            }
            
            .timeline-date {
              justify-content: flex-start;
              margin-left: 0;
              padding-left: 0;
            }
          }
        }
      }
    }
  }
  
  .timeline-ball {
    display: none;
  }
  
  .timeline-content {
    padding-left: 0 !important;
  }
}
</style>
