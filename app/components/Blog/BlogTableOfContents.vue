<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUiTranslator } from '~/composables/useUiTranslator'

const { t } = useUiTranslator()

interface TocItem {
  id: string
  text: string
  level: number
  element: HTMLElement
}

const tocItems = ref<TocItem[]>([])
const activeId = ref<string>('')

onMounted(() => {
  /* Extract headings from article content */
  const article = document.querySelector('.article-content')
  if (!article) return

  const headings = article.querySelectorAll('h2, h3, h4')
  const items: TocItem[] = []

  headings.forEach((heading, index) => {
    const id = heading.id || `heading-${index}`
    if (!heading.id) {
      heading.id = id
    }

    const text = heading.textContent
    if (text) {
      items.push({
        id,
        text,
        level: parseInt(heading.tagName.charAt(1)),
        element: heading as HTMLElement
      })
    }
  })

  tocItems.value = items

  /* Set up intersection observer for active section */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    {
      rootMargin: '-20% 0px -70% 0px'
    }
  )

  headings.forEach((heading) => {
    observer.observe(heading)
  })

  /* Cleanup */
  onUnmounted(() => {
    headings.forEach((heading) => {
      observer.unobserve(heading)
    })
  })
})

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80 /* Header height */
    const top = element.offsetTop - offset
    window.scrollTo({
      top,
      behavior: 'smooth'
    })
  }
}
</script>

<template>
  <div v-if="tocItems.length > 0" class="toc-container">
    <h3 class="toc-title">
      <span class="material-icons">format_list_bulleted</span>
      {{ t('Table of Contents') }}
    </h3>
    <nav class="toc-nav">
      <ul class="toc-list">
        <li
          v-for="item in tocItems"
          :key="item.id"
          :class="[
            'toc-item',
            `level-${item.level}`,
            { active: activeId === item.id }
          ]"
        >
          <a
            :href="`#${item.id}`"
            @click.prevent="scrollToHeading(item.id)"
            class="toc-link"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.toc-container {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.toc-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent-500);
  margin: 0 0 1rem;

  .material-icons {
    font-size: 1.25rem;
  }
}

.toc-nav {
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgb(var(--accent-500-rgb) / 5%);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgb(var(--accent-500-rgb) / 20%);
    border-radius: 2px;
    
    &:hover {
      background: rgb(var(--accent-500-rgb) / 30%);
    }
  }
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  position: relative;
  
  &.level-3 {
    padding-left: 1.5rem;
  }
  
  &.level-4 {
    padding-left: 3rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    background: rgb(var(--accent-500-rgb) / 30%);
    border-radius: 50%;
  }
  
  &.level-3::before {
    left: 1rem;
  }
  
  &.level-4::before {
    left: 2.5rem;
  }
  
  &.active {
    .toc-link {
      color: var(--accent-500);
      font-weight: 600;
    }
    
    &::before {
      width: 6px;
      height: 6px;
      background: var(--accent-500);
    }
  }
}

.toc-link {
  display: block;
  padding: 0.5rem 0.75rem;
  color: var(--text);
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.4;
  transition: all 0.2s;
  border-radius: 0.375rem;
  
  &:hover {
    background: rgb(var(--accent-500-rgb) / 5%);
    color: var(--accent-500);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .toc-container {
    display: none; /* Hide on mobile, could be made into a floating button instead */
  }
}
</style>
