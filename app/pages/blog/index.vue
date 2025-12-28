<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead, useSeoMeta } from '#app'
import blogData from '~/data/blog-posts.json'
import { formatBlogDate } from '~/composables/useBlog'
import { useUiTranslator } from '~/composables/useUiTranslator'

const { t } = useUiTranslator()

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

useHead({
  title: 'Engineering Blog - GD&T, Metrology & Manufacturing'
})

useSeoMeta({
  title: 'Engineering Blog - GD&T, Metrology & Manufacturing',
  ogTitle: 'Engineering Blog - Technical Articles & Guides',
  description: 'Technical articles covering GD&T, metrology, manufacturing processes, and engineering calculations.',
  ogDescription: 'Explore our technical articles on engineering topics.',
})

const posts = ref<BlogPost[]>(blogData.posts)
const categories = ref(blogData.categories)

const selectedCategory = ref('all')
const searchQuery = ref('')
const sortBy = ref<'date' | 'title'>('date')

/* Filter and sort posts */
const filteredPosts = computed(() => {
  let filtered = posts.value

  /* Category filter */
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(post => post.category === selectedCategory.value)
  }

  /* Search filter */
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  /* Sort */
  filtered = [...filtered].sort((a, b) => {
    if (sortBy.value === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  return filtered
})

/* Featured posts */
const featuredPosts = computed(() => 
  posts.value.filter(post => post.featured).slice(0, 3)
)

/* Post count by category */
const categoryCount = computed(() => {
  const counts: Record<string, number> = { all: posts.value.length }
  posts.value.forEach(post => {
    counts[post.category] = (counts[post.category] || 0) + 1
  })
  return counts
})

/* Get post URL */
const getPostUrl = (post: BlogPost) => `/blog/${post.id}/${post.slug}`
</script>

<template>
  <div class="blog-page">
    <!-- Hero Section -->
    <section class="blog-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">{{ t('Engineering Knowledge Base') }}</h1>
          <p class="hero-subtitle">
            {{ t('Technical articles covering GD&T, metrology, manufacturing processes, and engineering calculations') }}
          </p>
          
          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-box">
              <span class="material-icons search-icon">search</span>
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('Search articles...')"
                class="search-input"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="blog-content">
      <div class="container">
        <div class="content-grid">
          <!-- Sidebar -->
          <aside class="sidebar">
            <!-- Categories -->
            <div class="sidebar-section">
              <h3 class="sidebar-title">{{ t('Categories') }}</h3>
              <div class="category-list">
                <button
                  @click="selectedCategory = 'all'"
                  :class="['category-item', { active: selectedCategory === 'all' }]"
                >
                  <span class="material-icons">apps</span>
                  <span class="category-name">{{ t('All Posts') }}</span>
                  <span class="category-count">{{ categoryCount.all }}</span>
                </button>
                
                <button
                  v-for="(cat, key) in categories"
                  :key="key"
                  @click="selectedCategory = key"
                  :class="['category-item', { active: selectedCategory === key }]"
                >
                  <span class="material-icons">{{ cat.icon }}</span>
                  <span class="category-name">{{ t(cat.name) }}</span>
                  <span class="category-count">{{ categoryCount[key] || 0 }}</span>
                </button>
              </div>
            </div>

            <!-- Sort Options -->
            <div class="sidebar-section">
              <h3 class="sidebar-title">{{ t('Sort By') }}</h3>
              <div class="sort-options">
                <button
                  @click="sortBy = 'date'"
                  :class="['sort-option', { active: sortBy === 'date' }]"
                >
                  <span class="material-icons">calendar_today</span>
                  {{ t('Latest First') }}
                </button>
                <button
                  @click="sortBy = 'title'"
                  :class="['sort-option', { active: sortBy === 'title' }]"
                >
                  <span class="material-icons">sort_by_alpha</span>
                  {{ t('Alphabetical') }}
                </button>
              </div>
            </div>
          </aside>

          <!-- Posts Grid -->
          <main class="posts-section">
            <!-- Featured Posts (only show when no filters) -->
            <div v-if="selectedCategory === 'all' && !searchQuery && featuredPosts.length > 0" class="featured-section">
              <h2 class="section-title">
                <span class="material-icons">star</span>
                {{ t('Featured Articles') }}
              </h2>
              <div class="featured-grid">
                <NuxtLink
                  v-for="post in featuredPosts"
                  :key="post.id"
                  :to="getPostUrl(post)"
                  class="featured-card"
                >
                  <div class="featured-badge">{{ t('Featured') }}</div>
                  <div class="featured-content">
                    <h3 class="featured-title">{{ t(post.title) }}</h3>
                    <p class="featured-desc">{{ t(post.description) }}</p>
                    <div class="featured-meta">
                      <span class="meta-item">
                        <span class="material-icons">schedule</span>
                        {{ post.readTime }}
                      </span>
                      <span class="meta-item">
                        <span class="material-icons">calendar_today</span>
                        {{ formatBlogDate(post.date) }}
                      </span>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- All Posts -->
            <div class="all-posts">
              <h2 class="section-title">
                <span class="material-icons">article</span>
                {{ selectedCategory === 'all' ? t('All Articles') : t(categories[selectedCategory].name) }}
                <span class="post-count">({{ filteredPosts.length }})</span>
              </h2>

              <div v-if="filteredPosts.length > 0" class="posts-grid">
                <BlogCard
                  v-for="post in filteredPosts"
                  :key="post.id"
                  :post="post"
                />
              </div>

              <div v-else class="no-results">
                <span class="material-icons">search_off</span>
                <p>{{ t('No articles found matching your criteria') }}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/styles/blog" as *;

/* Using global .container class from global.scss */

.blog-page {
  min-height: 100vh;
  background: var(--main-bg);
}

/* Hero Section */
.blog-hero {
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 8%) 0%, transparent 100%);
  border-bottom: 1px solid rgb(var(--accent-500-rgb) / 10%);
  padding: 4rem 0 3rem;

  .hero-content {
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--accent-500);
    margin: 0 0 1rem;
  }

  .hero-subtitle {
    font-size: 1.15rem;
    color: var(--text);
    opacity: 0.8;
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }
}

/* Search Bar */
.search-container {
  display: flex;
  justify-content: center;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  width: 100%;
  max-width: 500px;
  transition: all 0.2s;

  &:focus-within {
    border-color: var(--accent-500);
    box-shadow: 0 0 0 3px rgb(var(--accent-500-rgb) / 10%);
  }

  .search-icon {
    color: var(--accent-500);
    font-size: 1.25rem;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--text);
    font-size: 1rem;
    outline: none;

    &::placeholder {
      color: var(--text);
      opacity: 0.5;
    }
  }
}

/* Content Grid */
.blog-content {
  padding: 3rem 0 4rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 1rem;

  @media (max-width: 1024px) {
    position: static;
  }
}

.sidebar-section {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent-500);
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  color: var(--text);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;

  &:hover {
    background: rgb(var(--accent-500-rgb) / 5%);
  }

  &.active {
    background: rgb(var(--accent-500-rgb) / 10%);
    border-color: var(--accent-500);
    color: var(--accent-500);
  }

  .material-icons {
    font-size: 1.25rem;
    opacity: 0.8;
  }

  .category-name {
    flex: 1;
    font-weight: 500;
  }

  .category-count {
    font-size: 0.85rem;
    opacity: 0.6;
    font-weight: 600;
  }
}

/* Sort Options */
.sort-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sort-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 0.375rem;
  color: var(--text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgb(var(--accent-500-rgb) / 5%);
  }

  &.active {
    background: var(--accent-500);
    border-color: var(--accent-500);
    color: white;
  }

  .material-icons {
    font-size: 1.1rem;
  }
}

/* Posts Section */
.posts-section {
  min-width: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-500);
  margin: 0 0 1.5rem;

  .material-icons {
    font-size: 1.5rem;
  }

  .post-count {
    font-size: 1rem;
    opacity: 0.6;
    font-weight: 400;
  }
}

/* Featured Posts */
.featured-section {
  margin-bottom: 3rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.featured-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.75rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  text-decoration: none;
  color: var(--text);
  transition: all 0.3s;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgb(0 0 0 / 15%);
    border-color: var(--accent-500);
  }

  .featured-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--accent-500);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .featured-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.75rem;
    color: var(--text);
  }

  .featured-desc {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text);
    opacity: 0.75;
    margin: 0 0 1rem;
  }

  .featured-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--text);
    opacity: 0.6;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;

      .material-icons {
        font-size: 1rem;
      }
    }
  }
}

/* Posts Grid */
.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text);
  opacity: 0.6;

  .material-icons {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .blog-hero {
    padding: 3rem 0 2rem;

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }
  }

  .featured-grid {
    grid-template-columns: 1fr;
  }
}
</style>
