<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  date: string | Date
  format?: 'full' | 'long' | 'medium' | 'short' | 'relative'
  showTime?: boolean
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  format: 'medium',
  showTime: false,
  locale: 'en-US',
})

const dateObject = computed(() => 
  typeof props.date === 'string' ? new Date(props.date) : props.date
)

const formattedDate = computed(() => {
  if (props.format === 'relative') {
    return getRelativeTime(dateObject.value)
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: props.format === 'short' ? 'short' : 'long',
    day: 'numeric',
  }

  if (props.format === 'full' || props.format === 'long') {
    options.weekday = 'long'
  }

  if (props.showTime) {
    options.hour = 'numeric'
    options.minute = 'numeric'
  }

  return new Intl.DateTimeFormat(props.locale, options).format(dateObject.value)
})

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  return `${years} year${years > 1 ? 's' : ''} ago`
}

const isoString = computed(() => dateObject.value.toISOString())
</script>

<template>
  <time :datetime="isoString" class="datetime">
    <span v-if="showTime" class="material-icons datetime__icon">schedule</span>
    <span v-else class="material-icons datetime__icon">calendar_today</span>
    <span class="datetime__text">{{ formattedDate }}</span>
  </time>
</template>

<style scoped lang="scss">
.datetime {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--text);
  font-size: 0.9rem;
}

.datetime__icon {
  font-size: 1.1rem;
  color: var(--accent-500);
  opacity: 0.8;
}

.datetime__text {
  opacity: 0.85;
}
</style>
