<script setup lang="ts">
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
}

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()

const getPostUrl = (post: BlogPost) => `/blog/${post.id}/${post.slug}`
</script>

<template>
  <article class="blog-card">
    <NuxtLink :to="getPostUrl(post)" class="card-link">
      <div class="card-content">
        <div class="card-header">
          <div class="card-category">
            <span class="material-icons">{{ $data?.categories?.[post.category]?.icon || 'article' }}</span>
            <span>{{ t(post.category.charAt(0).toUpperCase() + post.category.slice(1)) }}</span>
          </div>
          <span v-if="post.featured" class="featured-badge">
            <span class="material-icons">star</span>
            {{ t('Featured') }}
          </span>
        </div>

        <h3 class="card-title">{{ t(post.title) }}</h3>
        <p class="card-description">{{ t(post.description) }}</p>

        <div class="card-tags">
          <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">
            {{ tag }}
          </span>
          <span v-if="post.tags.length > 3" class="tag more">
            +{{ post.tags.length - 3 }}
          </span>
        </div>

        <div class="card-footer">
          <div class="card-meta">
            <span class="meta-item">
              <span class="material-icons">person</span>
              {{ post.author.name }}
            </span>
            <span class="meta-item">
              <span class="material-icons">schedule</span>
              {{ post.readTime }}
            </span>
            <span class="meta-item">
              <span class="material-icons">calendar_today</span>
              {{ formatBlogDate(post.date) }}
            </span>
          </div>
          <span class="read-more">
            {{ t('Read Article') }}
            <span class="material-icons">arrow_forward</span>
          </span>
        </div>
      </div>

      <div v-if="post.children.length > 0" class="has-children">
        <span class="material-icons">account_tree</span>
        <span>{{ post.children.length }} {{ t('sub-topics') }}</span>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped lang="scss">
.blog-card {
  position: relative;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
    border-color: var(--accent-500);

    .read-more {
      gap: 0.75rem;
      color: var(--accent-500);
    }
  }
}

.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-content {
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-category {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--accent-500);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  .material-icons {
    font-size: 1rem;
  }
}

.featured-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;

  .material-icons {
    font-size: 0.875rem;
  }
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 0.5rem;
  line-height: 1.3;
}

.card-description {
  font-size: 0.95rem;
  color: var(--text);
  opacity: 0.75;
  line-height: 1.6;
  margin: 0 0 1rem;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: rgb(var(--accent-500-rgb) / 10%);
  color: var(--accent-500);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;

  &.more {
    background: rgb(var(--accent-500-rgb) / 5%);
    color: var(--text);
    opacity: 0.6;
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgb(var(--accent-500-rgb) / 10%);
}

.card-meta {
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

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}

.read-more {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--accent-500);
  font-weight: 600;
  font-size: 0.9rem;
  transition: gap 0.2s;

  .material-icons {
    font-size: 1.1rem;
  }
}

.has-children {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgb(var(--accent-500-rgb) / 5%);
  border-top: 1px solid rgb(var(--accent-500-rgb) / 10%);
  font-size: 0.85rem;
  color: var(--accent-500);
  font-weight: 500;

  .material-icons {
    font-size: 1.1rem;
  }
}
</style>
