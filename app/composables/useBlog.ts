import { ref, computed, readonly } from 'vue'

export interface BlogPost {
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
  content?: any
  componentPath?: string
}

export interface BlogCategory {
  value: string
  label: string
  icon: string
  count?: number
}

export const blogCategories: BlogCategory[] = [
  { value: 'all', label: 'All Posts', icon: 'apps' },
  { value: 'gdt', label: 'GD&T', icon: 'straighten' },
  { value: 'metrology', label: 'Metrology', icon: 'science' },
  { value: 'manufacturing', label: 'Manufacturing', icon: 'precision_manufacturing' },
  { value: 'calculations', label: 'Calculations', icon: 'calculate' },
  { value: 'materials', label: 'Materials', icon: 'inventory_2' },
]

// GD&T blog posts - Currently only one example post exists
// Add more posts by copying _Template.vue and creating new components
const createGDTPosts = (): BlogPost[] => {
  const gdtTopics = [
  {
    id: '1',
    slug: 'gdt-anatomy',
    title: 'Anatomy of GD&T Annotation',
    description: 'A comprehensive guide to interpreting Feature Control Frames, Datums, and Geometric Tolerancing symbols in modern engineering.',
      tags: ['GD&T', 'ASME Y14.5', 'Feature Control Frame'],
    readTime: '15 min',
      componentPath: 'GdtAnatomy',
      featured: true
  },
  ]

  return gdtTopics.map(topic => ({
    ...topic,
    category: 'gdt',
    date: `2025-01-${String(11 - parseInt(topic.id)).padStart(2, '0')}`,
    author: {
      name: 'Engineering Team',
      role: 'Technical Writers'
    }
  }))
}

// You can add posts without components - they'll show "Content coming soon..."
// Or create the component first, then add the post here
const additionalPosts: BlogPost[] = [
  // Example of a post without a component (will show "coming soon"):
  // {
  //   id: '2',
  //   slug: 'gdt-definitive-guide',
  //   title: 'The Definitive GD&T Guide',
  //   description: 'Coming soon...',
  //   date: '2025-01-09',
  //   category: 'gdt',
  //   tags: ['GD&T', 'Guide'],
  //   readTime: '30 min',
  //   author: { name: 'Engineering Team' }
  // }
]

// Combine all posts
const allPosts: BlogPost[] = [...createGDTPosts(), ...additionalPosts]

// Scalable blog system with caching and lazy loading
class BlogCache {
  private cache: Map<string, BlogPost> = new Map()
  private categoryCache: Map<string, BlogPost[]> = new Map()
  private searchCache: Map<string, BlogPost[]> = new Map()
  private maxCacheSize = 1000 // Prevent memory issues with large datasets
  
  set(key: string, value: BlogPost) {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry (first in map)
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, value)
  }
  
  get(key: string): BlogPost | undefined {
    return this.cache.get(key)
  }
  
  setCategoryCache(category: string, posts: BlogPost[]) {
    this.categoryCache.set(category, posts)
  }
  
  getCategoryCache(category: string): BlogPost[] | undefined {
    return this.categoryCache.get(category)
  }
  
  setSearchCache(query: string, posts: BlogPost[]) {
    if (this.searchCache.size >= 100) {
      const firstKey = this.searchCache.keys().next().value
      if (firstKey) {
        this.searchCache.delete(firstKey)
      }
    }
    this.searchCache.set(query, posts)
  }
  
  getSearchCache(query: string): BlogPost[] | undefined {
    return this.searchCache.get(query)
  }
  
  clear() {
    this.cache.clear()
    this.categoryCache.clear()
    this.searchCache.clear()
  }
}

const blogCache = new BlogCache()

export function useBlog() {
  const posts = ref<BlogPost[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Get all posts with pagination support for scalability
  const getAllPosts = async (page = 1, limit = 100) => {
    loading.value = true
    error.value = null
    
    try {
      // In production, this would fetch from Nuxt Content, API, or Database
      // For 100k+ posts, implement server-side pagination
      // const { data } = await $fetch('/api/blog', { 
      //   params: { page, limit } 
      // })
      
      const start = (page - 1) * limit
      const end = start + limit
      posts.value = allPosts.slice(start, end)
      
      return posts.value
    } catch (e) {
      error.value = e as Error
      return []
    } finally {
      loading.value = false
    }
  }

  // Get single post by ID with caching
  const getPost = async (id: string, slug?: string) => {
    loading.value = true
    error.value = null
    
    try {
      // Check cache first
      const cachedPost = blogCache.get(id)
      if (cachedPost) {
        loading.value = false
        return cachedPost
      }
      
      // In production, fetch from API/Database
      // const post = await $fetch(`/api/blog/${id}`)
      const post = allPosts.find(p => p.id === id || (slug && p.slug === slug))
      
      if (!post) {
        throw new Error(`Post with ID ${id} not found`)
      }
      
      // Cache the result
      blogCache.set(id, post)
      
      return post
    } catch (e) {
      error.value = e as Error
      return null
    } finally {
      loading.value = false
    }
  }

  // Get posts by category with caching
  const getPostsByCategory = (category: string) => {
    // Check cache
    const cached = blogCache.getCategoryCache(category)
    if (cached) return cached
    
    const filtered = category === 'all' 
      ? allPosts 
      : allPosts.filter((post: BlogPost) => post.category === category)
    
    // Cache result
    blogCache.setCategoryCache(category, filtered)
    return filtered
  }

  // Get featured posts
  const getFeaturedPosts = (limit = 3) => {
    return allPosts
      .filter((post: BlogPost) => post.featured)
      .slice(0, limit)
  }

  // Get related posts using tag similarity
  const getRelatedPosts = (currentPost: BlogPost, limit = 3) => {
    const scoredPosts = allPosts
      .filter((post: BlogPost) => post.id !== currentPost.id)
      .map(post => {
        let score = 0
        // Category match
        if (post.category === currentPost.category) score += 10
        // Tag matches
        const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag))
        score += commonTags.length * 5
        return { post, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ post }) => post)
    
    return scoredPosts
  }

  // Optimized search with caching and fuzzy matching
  const searchPosts = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim()
    
    // Check cache
    const cached = blogCache.getSearchCache(normalizedQuery)
    if (cached) return cached
    
    const results = allPosts.filter((post: BlogPost) => {
      const searchableText = [
        post.title,
        post.description,
        ...post.tags,
        post.category
      ].join(' ').toLowerCase()
      
      // Split query into terms for better matching
      const terms = normalizedQuery.split(' ')
      return terms.every(term => searchableText.includes(term))
    })
    
    // Cache results
    blogCache.setSearchCache(normalizedQuery, results)
    return results
  }

  // Get post count by category
  const getPostCountByCategory = () => {
    const counts: Record<string, number> = {
      all: allPosts.length
    }
    
    allPosts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1
    })
    
    return counts
  }
  
  // Get posts by tag
  const getPostsByTag = (tag: string) => {
    return allPosts.filter(post => 
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    )
  }
  
  // Get all tags with counts
  const getAllTags = () => {
    const tagCounts: Record<string, number> = {}
    allPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    return tagCounts
  }

  return {
    posts: readonly(posts),
    loading: readonly(loading),
    error: readonly(error),
    getAllPosts,
    getPost,
    getPostsByCategory,
    getFeaturedPosts,
    getRelatedPosts,
    searchPosts,
    getPostCountByCategory,
    getPostsByTag,
    getAllTags,
  }
}

// Format date helper
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Generate blog post URL
export function getBlogPostUrl(post: any): string {
  // For Nuxt Content posts, we need to extract from the filename
  if (post._path) {
    // Get the slug from the path (e.g., /blog/gdt-anatomy)
    const slug = post._path.replace('/blog/', '')
    
    // Try to extract number from _file or _stem if available
    let number = '1' // default
    if (post._file) {
      const fileMatch = post._file.match(/(\d+)\./)
      if (fileMatch && fileMatch[1]) {
        number = fileMatch[1]
      }
    } else if (post._stem) {
      const stemMatch = post._stem.match(/^(\d+)\./)
      if (stemMatch && stemMatch[1]) {
        number = stemMatch[1]
      }
    }
    
    return `/blog/${number}/${slug}`
  }
  // Fallback for standard format
  return `/blog/${post.id || '1'}/${post.slug || 'post'}`
}
