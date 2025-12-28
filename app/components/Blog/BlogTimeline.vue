<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from '#app'
import Timeline from '../Timeline.vue'
import type { TimelineItem } from '../Timeline.vue'

// Import the actual blog data type
interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  readTime: string
  author: {
    name: string
    role?: string
  }
  featured?: boolean
  parent: string | null
  children: string[]
  breadcrumbs: Array<{ label: string; path: string }>
}

interface BlogData {
  posts: BlogPost[]
}

const blogData: BlogData = require('~/data/blog-posts.json')

interface Props {
  category?: string
  limit?: number
  showThumbnails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showThumbnails: true
})

// Convert blog posts to timeline items
const timelineItems = computed<TimelineItem[]>(() => {
  let posts = blogData.posts
  
  // Filter by category if specified
  if (props.category) {
    posts = posts.filter(post => post.category === props.category)
  }
  
  // Sort by date (newest first)
  posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Limit if specified
  if (props.limit) {
    posts = posts.slice(0, props.limit)
  }
  
  // Convert to timeline items
  return posts.map(post => ({
    id: post.id,
    date: post.date,
    title: post.title,
    description: post.description,
    icon: getCategoryIcon(post.category),
    color: getCategoryColor(post.category),
    metadata: {
      readTime: post.readTime,
      author: post.author.name,
      tags: post.tags.join(', ')
    }
  }))
})

// Get icon for category
const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    gdt: 'straighten',
    engineering: 'engineering',
    tutorial: 'school',
    news: 'newspaper'
  }
  return icons[category] || 'article'
}

// Get color for category
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    gdt: '#3b82f6',
    engineering: '#10b981',
    tutorial: '#f59e0b',
    news: '#ef4444'
  }
  return colors[category] || 'var(--accent-500)'
}

// Handle timeline item click
const router = useRouter()
const handleItemClick = (item: TimelineItem) => {
  // Find the original post
  const post = blogData.posts.find(p => p.id === item.id)
  if (post) {
    router.push(`/blog/${post.id}/${post.slug}`)
  }
}
</script>

<template>
  <div class="blog-timeline">
    <Timeline
      :items="timelineItems"
      :group-by-date="true"
      date-format="relative"
      line-position="left"
      :sticky-dates="true"
      @item-click="handleItemClick"
    >
      <!-- Custom item template -->
      <template #item="{ item }">
        <article class="blog-timeline-item">
          <div v-if="showThumbnails && item.metadata?.thumbnail" class="item-thumbnail">
            <img :src="item.metadata.thumbnail" :alt="item.title" />
          </div>
          <div class="item-content">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-meta">
              <span class="meta-item">
                <span class="material-icons">schedule</span>
                {{ item.metadata?.readTime }}
              </span>
              <span class="meta-item">
                <span class="material-icons">person</span>
                {{ item.metadata?.author }}
              </span>
              <span v-if="item.metadata?.tags" class="meta-item tags">
                <span class="material-icons">tag</span>
                {{ item.metadata.tags }}
              </span>
            </div>
          </div>
        </article>
      </template>
    </Timeline>
  </div>
</template>

<style scoped lang="scss">
.blog-timeline {
  width: 100%;
}

.blog-timeline-item {
  background: var(--card);
  border: 1px solid rgba(var(--accent-500-rgb), 0.1);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-500);
  }
}

.item-thumbnail {
  width: 100%;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  .blog-timeline-item:hover & img {
    transform: scale(1.05);
  }
}

.item-content {
  padding: 1.5rem;
}

.item-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: var(--text);
  line-height: 1.4;
}

.item-description {
  font-size: 0.95rem;
  color: var(--text);
  opacity: 0.8;
  margin: 0 0 1rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* autoprefixer: off */
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: var(--text);
  opacity: 0.7;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  .material-icons {
    font-size: 1rem;
  }
  
  &.tags {
    flex: 1;
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .item-thumbnail {
    height: 150px;
  }
  
  .item-content {
    padding: 1rem;
  }
  
  .item-title {
    font-size: 1.1rem;
  }
  
  .item-meta {
    gap: 1rem;
  }
}
</style>
