<script setup lang="ts">
import { useHead, useSeoMeta } from '#app'

useHead({
  title: 'Developer Tools'
})

useSeoMeta({
  title: 'Developer Tools',
  description: 'Developer tools and component guides for the calculator app'
})

const devPages = [
  {
    title: 'Component Library Guide',
    description: 'Comprehensive guide for all UI components with interactive demos',
    path: '/dev/components-guide',
    icon: 'widgets'
  },
  {
    title: 'Timeline Examples',
    description: 'Various timeline component implementations and use cases',
    path: '/dev/timeline-example',
    icon: 'timeline'
  },
  {
    title: 'Code Display Components',
    description: 'Beautiful code blocks with syntax highlighting and copy functionality',
    path: '/dev/code-examples',
    icon: 'code'
  }
]
</script>

<template>
  <div class="dev-index">
    <div class="container">
      <header class="page-header">
        <h1>Developer Tools</h1>
        <p>Resources and guides for developers working with the calculator app</p>
      </header>

      <div class="dev-cards">
        <NuxtLink
          v-for="page in devPages"
          :key="page.path"
          :to="page.path"
          class="dev-card"
        >
          <div class="card-icon">
            <span class="material-icons">{{ page.icon }}</span>
          </div>
          <div class="card-content">
            <h3>{{ page.title }}</h3>
            <p>{{ page.description }}</p>
          </div>
          <span class="card-arrow material-icons">arrow_forward</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dev-index {
  min-height: 100vh;
  padding: 2rem 0;
  background: var(--main-bg);
}

/* Using global .container class from global.scss */

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text);
  }
  
  p {
    font-size: 1.25rem;
    color: var(--text);
    opacity: 0.8;
  }
}

.dev-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.dev-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: var(--card);
  border: 1px solid rgba(var(--text-rgb), 0.1);
  border-radius: 0.75rem;
  text-decoration: none;
  color: var(--text);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(var(--accent-500-rgb), 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--accent-500);
    
    &::before {
      opacity: 1;
    }
    
    .card-icon {
      transform: scale(1.1);
      background: var(--accent-500);
      color: white;
    }
    
    .card-arrow {
      transform: translateX(4px);
    }
  }
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(var(--accent-500-rgb), 0.1);
  border-radius: 0.75rem;
  flex-shrink: 0;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
  
  .material-icons {
    font-size: 2rem;
    color: var(--accent-500);
  }
}

.card-content {
  flex: 1;
  position: relative;
  z-index: 1;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text);
  }
  
  p {
    font-size: 0.875rem;
    color: var(--text);
    opacity: 0.7;
    line-height: 1.5;
    margin: 0;
  }
}

.card-arrow {
  font-size: 1.5rem;
  color: var(--accent-500);
  transition: transform 0.3s;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .page-header {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  .dev-cards {
    grid-template-columns: 1fr;
  }
  
  .dev-card {
    padding: 1.5rem;
  }
}
</style>
