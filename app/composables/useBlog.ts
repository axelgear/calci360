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

// Mock data for now - will be replaced with actual content fetching
const mockPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'gdt-anatomy',
    title: 'Anatomy of GD&T Annotation',
    description: 'A comprehensive guide to interpreting Feature Control Frames, Datums, and Geometric Tolerancing symbols in modern engineering.',
    date: '2025-01-05',
    category: 'gdt',
    tags: ['GD&T', 'ASME Y14.5', 'Engineering Standards'],
    readTime: '15 min',
    author: {
      name: 'Engineering Team',
      role: 'Technical Writers'
    },
    featured: true,
  },
  {
    id: '2',
    slug: 'si-units-metrology',
    title: 'Understanding SI Units and Metrology',
    description: 'Deep dive into the International System of Units, fundamental constants, and their applications in precision measurement.',
    date: '2025-01-04',
    category: 'metrology',
    tags: ['SI Units', 'Measurement', 'Standards'],
    readTime: '20 min',
    author: {
      name: 'Engineering Team',
      role: 'Technical Writers'
    },
    featured: true,
  },
  {
    id: '3',
    slug: 'tolerance-stackup',
    title: 'Tolerance Stack-Up Analysis',
    description: 'Learn how to calculate cumulative tolerances in assemblies and ensure proper fit and function.',
    date: '2025-01-03',
    category: 'calculations',
    tags: ['Tolerances', 'Assembly', 'Analysis'],
    readTime: '12 min',
    author: {
      name: 'Engineering Team',
      role: 'Technical Writers'
    },
  },
  {
    id: '4',
    slug: 'sheet-metal-design',
    title: 'Sheet Metal Design Guidelines',
    description: 'Best practices for designing sheet metal parts including bend radius, K-factor, and manufacturability.',
    date: '2025-01-02',
    category: 'manufacturing',
    tags: ['Sheet Metal', 'Design', 'Manufacturing'],
    readTime: '18 min',
    author: {
      name: 'Engineering Team',
      role: 'Technical Writers'
    },
  },
  {
    id: '5',
    slug: 'material-selection',
    title: 'Material Selection for Engineers',
    description: 'Guide to selecting the right materials based on mechanical properties, cost, and application requirements.',
    date: '2025-01-01',
    category: 'materials',
    tags: ['Materials', 'Properties', 'Selection'],
    readTime: '25 min',
    author: {
      name: 'Engineering Team',
      role: 'Technical Writers'
    },
  },
]

export function useBlog() {
  const posts = ref<BlogPost[]>(mockPosts)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Get all posts
  const getAllPosts = async () => {
    loading.value = true
    error.value = null
    
    try {
      // In production, this would fetch from Nuxt Content
      // const { data } = await queryContent('blog').find()
      posts.value = mockPosts
      return posts.value
    } catch (e) {
      error.value = e as Error
      return []
    } finally {
      loading.value = false
    }
  }

  // Get single post by ID and slug
  const getPost = async (id: string, slug?: string) => {
    loading.value = true
    error.value = null
    
    try {
      // In production, this would fetch from Nuxt Content
      // const { data } = await queryContent('blog', id).findOne()
      const post = mockPosts.find(p => p.id === id)
      
      if (!post) {
        throw new Error(`Post with ID ${id} not found`)
      }
      
      return post
    } catch (e) {
      error.value = e as Error
      return null
    } finally {
      loading.value = false
    }
  }

  // Get posts by category
  const getPostsByCategory = (category: string) => {
    if (category === 'all') {
      return posts.value
    }
    return posts.value.filter((post: BlogPost) => post.category === category)
  }

  // Get featured posts
  const getFeaturedPosts = (limit = 3) => {
    return posts.value
      .filter((post: BlogPost) => post.featured)
      .slice(0, limit)
  }

  // Get related posts
  const getRelatedPosts = (currentPost: BlogPost, limit = 3) => {
    return posts.value
      .filter((post: BlogPost) => 
        post.id !== currentPost.id && 
        (post.category === currentPost.category ||
         post.tags.some((tag: string) => currentPost.tags.includes(tag)))
      )
      .slice(0, limit)
  }

  // Search posts
  const searchPosts = (query: string) => {
    const searchTerm = query.toLowerCase()
    return posts.value.filter((post: BlogPost) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    )
  }

  // Get post count by category
  const getPostCountByCategory = () => {
    const counts: Record<string, number> = {
      all: posts.value.length
    }
    
    posts.value.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1
    })
    
    return counts
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
      if (fileMatch) {
        number = fileMatch[1]
      }
    } else if (post._stem) {
      const stemMatch = post._stem.match(/^(\d+)\./)
      if (stemMatch) {
        number = stemMatch[1]
      }
    }
    
    return `/blog/${number}/${slug}`
  }
  // Fallback for old format
  return `/blog/${post.id || '1'}/${post.slug || 'post'}`
}
