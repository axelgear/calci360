<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useHead, useSeoMeta, createError } from '#app'
import { definePageMeta } from '#imports'
import blogData from '~/data/blog-posts.json'
import { formatBlogDate } from '~/composables/useBlog'
import { useUiTranslator } from '~/composables/useUiTranslator'

const { t } = useUiTranslator()
const route = useRoute()

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

/* Get post by ID and slug */
const postId = route.params.number as string
const postSlug = route.params.slug as string

const currentPost = ref<BlogPost | null>(null)
const posts = ref<BlogPost[]>(blogData.posts)

/* Find the post */
currentPost.value = posts.value.find(p => p.id === postId && p.slug === postSlug) || null

if (!currentPost.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Blog post not found: ${postId}/${postSlug}`,
  })
}

/* SEO */
useHead({
  title: () => currentPost.value?.title || 'Blog Post'
})

useSeoMeta({
  title: () => currentPost.value?.title || 'Blog Post',
  ogTitle: () => currentPost.value?.title || 'Blog Post',
  description: () => currentPost.value?.description || 'Engineering blog post',
  ogDescription: () => currentPost.value?.description || 'Engineering blog post',
  twitterCard: 'summary_large_image',
})

/* Get related posts */
const relatedPosts = computed(() => {
  if (!currentPost.value) return []
  
  /* Get children posts */
  const childPosts = currentPost.value.children
    .map(childId => posts.value.find(p => p.id === childId))
    .filter(Boolean) as BlogPost[]
  
  /* Get sibling posts (same parent) */
  const siblingPosts = currentPost.value.parent
    ? posts.value.filter(p => 
        p.parent === currentPost.value!.parent && 
        p.id !== currentPost.value!.id
      )
    : []
  
  /* Get posts from same category */
  const categoryPosts = posts.value
    .filter(p => 
      p.category === currentPost.value!.category && 
      p.id !== currentPost.value!.id &&
      !childPosts.find(c => c.id === p.id) &&
      !siblingPosts.find(s => s.id === p.id)
    )
    .slice(0, 3)
  
  return {
    children: childPosts,
    siblings: siblingPosts,
    category: categoryPosts
  }
})

/* Navigation */
const parentPost = computed(() => {
  if (!currentPost.value?.parent) return null
  return posts.value.find(p => p.id === currentPost.value!.parent)
})

/* Social sharing */
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
})

const shareTitle = computed(() => currentPost.value?.title || '')

const socialLinks = computed(() => [
  {
    name: 'Twitter',
    icon: 'fa-brands fa-twitter',
    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle.value)}&url=${encodeURIComponent(shareUrl.value)}`,
    color: '#1DA1F2'
  },
  {
    name: 'LinkedIn',
    icon: 'fa-brands fa-linkedin',
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`,
    color: '#0077B5'
  },
  {
    name: 'Facebook',
    icon: 'fa-brands fa-facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`,
    color: '#1877F2'
  },
  {
    name: 'Reddit',
    icon: 'fa-brands fa-reddit',
    url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl.value)}&title=${encodeURIComponent(shareTitle.value)}`,
    color: '#FF4500'
  }
])

/* Copy link */
const linkCopied = ref(false)
const copyLink = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareUrl.value)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  }
}

definePageMeta({
  hideLogo: true,
})
</script>

<template>
  <div class="blog-post-page" v-if="currentPost">
    <!-- Header with Breadcrumbs -->
    <header class="post-header">
      <div class="container">
        <!-- Back Button -->
        <NuxtLink to="/blog" class="back-button">
          <span class="material-icons">arrow_back</span>
          {{ t('Back to Blog') }}
        </NuxtLink>

        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <NuxtLink to="/blog">{{ t('Blog') }}</NuxtLink>
            </li>
            <li v-for="(crumb, index) in currentPost.breadcrumbs" :key="index" class="breadcrumb-item">
              <span class="breadcrumb-separator">/</span>
              <NuxtLink :to="crumb.path">{{ t(crumb.label) }}</NuxtLink>
            </li>
            <li class="breadcrumb-item current">
              <span class="breadcrumb-separator">/</span>
              <span>{{ t(currentPost.title) }}</span>
            </li>
          </ol>
        </nav>

        <!-- Post Meta -->
        <div class="post-meta">
          <div class="meta-primary">
            <h1 class="post-title">{{ t(currentPost.title) }}</h1>
            <p class="post-description">{{ t(currentPost.description) }}</p>
          </div>
          
          <div class="meta-info">
            <div class="author-info">
              <div class="author-avatar">
                <span class="material-icons">person</span>
              </div>
              <div>
                <div class="author-name">{{ currentPost.author.name }}</div>
                <div v-if="currentPost.author.role" class="author-role">{{ currentPost.author.role }}</div>
              </div>
            </div>
            
            <div class="post-stats">
              <span class="stat-item">
                <span class="material-icons">calendar_today</span>
                {{ formatBlogDate(currentPost.date) }}
              </span>
              <span class="stat-item">
                <span class="material-icons">schedule</span>
                {{ currentPost.readTime }}
              </span>
              <span class="stat-item">
                <span class="material-icons">category</span>
                {{ t(currentPost.category.charAt(0).toUpperCase() + currentPost.category.slice(1)) }}
              </span>
            </div>
          </div>

          <!-- Tags -->
          <div class="post-tags">
            <span v-for="tag in currentPost.tags" :key="tag" class="tag">
              <span class="material-icons">tag</span>
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="post-content">
      <div class="container">
        <!-- Article Content -->
        <article class="article-content">
          <!-- Dynamic component based on post ID -->
          <BlogPostContent :postId="currentPost.id" />
        </article>

        <!-- Bottom Section: Share and Navigation -->
        <div class="bottom-section">
          <!-- Social Share -->
          <div class="share-section">
            <h3 class="section-title">{{ t('Share Article') }}</h3>
            <div class="social-buttons">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener"
                class="social-button"
                :style="`--social-color: ${social.color}`"
                :title="`Share on ${social.name}`"
              >
                <i :class="social.icon"></i>
              </a>
              <button
                @click="copyLink"
                class="social-button copy-button"
                :class="{ copied: linkCopied }"
                title="Copy link"
              >
                <span class="material-icons">{{ linkCopied ? 'check' : 'link' }}</span>
              </button>
            </div>
          </div>

          <!-- Quick Navigation -->
          <div v-if="parentPost || relatedPosts.children.length > 0" class="nav-section">
            <h3 class="section-title">{{ t('Quick Navigation') }}</h3>
            <div class="nav-links">
              <NuxtLink v-if="parentPost" :to="`/blog/${parentPost.id}/${parentPost.slug}`" class="nav-link parent">
                <span class="material-icons">arrow_upward</span>
                <span>{{ t('Parent Topic') }}: {{ t(parentPost.title) }}</span>
              </NuxtLink>
              <div v-if="relatedPosts.children.length > 0" class="nav-group">
                <h4 class="nav-group-title">{{ t('Sub-topics') }}</h4>
                <NuxtLink
                  v-for="child in relatedPosts.children"
                  :key="child.id"
                  :to="`/blog/${child.id}/${child.slug}`"
                  class="nav-link child"
                >
                  <span class="material-icons">subdirectory_arrow_right</span>
                  <span>{{ t(child.title) }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Related Posts -->
    <section class="related-posts">
      <div class="container">
        <!-- Sibling Posts -->
        <div v-if="relatedPosts.siblings.length > 0" class="related-section">
          <h2 class="related-title">
            <span class="material-icons">compare_arrows</span>
            {{ t('Related Topics') }}
          </h2>
          <div class="related-grid">
            <BlogCard
              v-for="post in relatedPosts.siblings"
              :key="post.id"
              :post="post"
            />
          </div>
        </div>

        <!-- More from Category -->
        <div v-if="relatedPosts.category.length > 0" class="related-section">
          <h2 class="related-title">
            <span class="material-icons">category</span>
            {{ t('More in') }} {{ t(currentPost.category.charAt(0).toUpperCase() + currentPost.category.slice(1)) }}
          </h2>
          <div class="related-grid">
            <BlogCard
              v-for="post in relatedPosts.category"
              :key="post.id"
              :post="post"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/styles/blog" as *;

.blog-post-page {
  min-height: 100vh;
  background: var(--main-bg);
}

/* Using global .container class from global.scss */

/* Header */
.post-header {
  background: linear-gradient(180deg, rgb(var(--accent-500-rgb) / 5%) 0%, transparent 100%);
  border-bottom: 1px solid rgb(var(--accent-500-rgb) / 10%);
  padding: 2rem 0 3rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-500);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: gap 0.2s;

  &:hover {
    gap: 0.75rem;
  }
}

/* Breadcrumbs */
.breadcrumbs {
  margin-bottom: 2rem;
}

.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;

  a {
    color: var(--accent-500);
    text-decoration: none;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  &.current {
    color: var(--text);
    opacity: 0.7;
    
    span:last-child {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--text);
  opacity: 0.3;
}

/* Post Meta */
.post-meta {
  .post-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text);
    margin: 0 0 1rem;
    line-height: 1.2;
  }

  .post-description {
    font-size: 1.25rem;
    color: var(--text);
    opacity: 0.8;
    margin: 0 0 2rem;
    line-height: 1.6;
  }
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgb(var(--accent-500-rgb) / 10%);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;

  .author-avatar {
    width: 48px;
    height: 48px;
    background: var(--accent-500);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    .material-icons {
      font-size: 1.5rem;
    }
  }

  .author-name {
    font-weight: 600;
    color: var(--text);
  }

  .author-role {
    font-size: 0.9rem;
    color: var(--text);
    opacity: 0.6;
  }
}

.post-stats {
  display: flex;
  gap: 1.5rem;
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.9rem;
    color: var(--text);
    opacity: 0.7;

    .material-icons {
      font-size: 1.1rem;
      color: var(--accent-500);
    }
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  background: rgb(var(--accent-500-rgb) / 10%);
  color: var(--accent-500);
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;

  .material-icons {
    font-size: 1rem;
  }
}

/* Content Grid */
.post-content {
  padding: 3rem 0 4rem;
}

.article-content {
  margin: 0 auto 3rem;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background: var(--card);
  border-radius: 0.75rem;
  border: 1px solid rgba(var(--accent-500-rgb), 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text);
  }
}

.share-section {
  .social-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
}

.nav-section {
  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(var(--accent-500-rgb), 0.05);
    border: 1px solid rgba(var(--accent-500-rgb), 0.1);
    border-radius: 0.5rem;
    color: var(--text);
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
      background: rgba(var(--accent-500-rgb), 0.1);
      border-color: var(--accent-500);
      transform: translateX(5px);
    }

    &.parent {
      border-color: rgba(var(--accent-500-rgb), 0.3);
    }

    .material-icons {
      font-size: 1.25rem;
      color: var(--accent-500);
    }
  }

  .nav-group {
    margin-top: 1rem;

    .nav-group-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text);
      opacity: 0.7;
      margin-bottom: 0.5rem;
    }
  }
}

.article-content {
  min-width: 0;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  padding: 2rem;
}

/* Sidebar */
.post-sidebar {
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
}

/* Social Buttons */
.social-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgb(var(--accent-500-rgb) / 10%);
  color: var(--social-color, var(--accent-500));
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: var(--social-color, var(--accent-500));
    color: white;
    transform: translateY(-2px);
  }

  &.copy-button {
    --social-color: #10b981;
    
    &.copied {
      background: #10b981;
      color: white;
    }
  }
}

/* Navigation Links */
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--text);
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: rgb(var(--accent-500-rgb) / 10%);
    border-color: var(--accent-500);
  }

  &.parent {
    background: rgb(var(--accent-500-rgb) / 10%);
    color: var(--accent-500);
    font-weight: 600;
  }

  .material-icons {
    font-size: 1.1rem;
    color: var(--accent-500);
  }
}

.nav-group {
  margin-top: 0.5rem;
}

.nav-group-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  opacity: 0.7;
  margin: 0 0 0.5rem;
}

/* Related Posts */
.related-posts {
  background: rgb(var(--accent-500-rgb) / 3%);
  border-top: 1px solid rgb(var(--accent-500-rgb) / 10%);
  padding: 3rem 0 4rem;
}

.related-section {
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.related-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-500);
  margin: 0 0 1.5rem;

  .material-icons {
    font-size: 1.75rem;
  }
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .post-header {
    padding: 1.5rem 0 2rem;
  }

  .post-meta {
    .post-title {
      font-size: 1.75rem;
    }

    .post-description {
      font-size: 1.1rem;
    }
  }

  .article-content {
    padding: 1.5rem;
  }
}
</style>
