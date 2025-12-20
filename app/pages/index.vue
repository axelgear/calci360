<script setup lang="ts">
import { calculators } from '~/components/Calculator/calculators/index'
import { isConverterConfig } from '~/components/Calculator/calculators/types'

useHead({ title: 'Home' })

useSeoMeta({
  title: 'Free Online Calculators & Unit Converters',
  ogTitle: 'Free Online Calculators & Unit Converters',
  description: 'Free online engineering calculators and unit converters. Area, length, volume, mass, pressure, temperature converters with bidirectional conversion.',
  ogDescription: 'Free online engineering calculators and unit converters with instant results.',
})

interface CalculatorItem {
  slug: string
  name: string
  description: string
  icon: string
  isConverter: boolean
}

interface Category {
  id: string
  name: string
  icon: string
  items: CalculatorItem[]
}

/* Get all calculators organized by category */
const categories = computed<Category[]>(() => {
  const categoryMap: Record<string, CalculatorItem[]> = {}

  for (const [slug, config] of Object.entries(calculators)) {
    const category = config.category
    if (!categoryMap[category]) {
      categoryMap[category] = []
    }
    categoryMap[category].push({
      slug,
      name: config.name,
      description: config.description,
      icon: config.icon,
      isConverter: isConverterConfig(config),
    })
  }

  const result: Category[] = []
  const categoryIcons: Record<string, string> = {
    'Unit Conversion': 'swap_horiz',
    'Press Brake': 'precision_manufacturing',
    'Cutting': 'content_cut',
    'Material': 'scale',
    'Mechanical': 'settings',
    'Hydraulic': 'water_drop',
  }

  for (const [name, items] of Object.entries(categoryMap)) {
    result.push({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon: categoryIcons[name] || 'calculate',
      items,
    })
  }

  return result
})

const totalCalculators = computed(() => Object.keys(calculators).length)
const converterCount = computed(() => {
  return Object.values(calculators).filter(c => isConverterConfig(c)).length
})
</script>

<template>
  <div class="page-container">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="material-icons">calculate</span>
          <span>{{ totalCalculators }} Free Tools</span>
        </div>
        <h1>Engineering Calculators</h1>
        <p class="hero-desc">
          Free online calculators and unit converters for engineering, manufacturing, and everyday use.
          <strong>{{ converterCount }} bidirectional converters</strong> with instant results.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/calculator" class="cta-btn primary">
            <span class="material-icons">explore</span>
            Explore All Tools
          </NuxtLink>
        </div>
      </div>

      <!-- Featured Converters -->
      <div class="featured-converters">
        <h2 class="section-title">
          <span class="material-icons">swap_horiz</span>
          Popular Unit Converters
        </h2>
        <div class="converter-grid">
          <NuxtLink
            v-for="converter in categories.find((c: Category) => c.name === 'Unit Conversion')?.items.slice(0, 6)"
            :key="converter.slug"
            :to="`/calculator/${converter.slug}`"
            class="converter-card"
          >
            <span class="material-icons">{{ converter.icon }}</span>
            <div class="converter-info">
              <h3>{{ converter.name }}</h3>
              <p>{{ converter.description }}</p>
            </div>
            <span class="material-icons arrow">arrow_forward</span>
          </NuxtLink>
        </div>
        <NuxtLink to="/calculator" class="see-all">
          See all {{ totalCalculators }} calculators
          <span class="material-icons">arrow_forward</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Quick Access Categories -->
    <section class="categories-section">
      <h2 class="section-title">
        <span class="material-icons">category</span>
        Calculator Categories
      </h2>
      <div class="category-cards">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          to="/calculator"
          class="category-card"
        >
          <span class="material-icons category-icon">{{ category.icon }}</span>
          <h3>{{ category.name }}</h3>
          <p>{{ category.items.length }} tools</p>
        </NuxtLink>
      </div>
    </section>

    <!-- Features -->
    <section class="features-section">
      <h2 class="section-title">
        <span class="material-icons">star</span>
        Features
      </h2>
      <div class="features-grid">
        <div class="feature">
          <span class="material-icons">sync</span>
          <h3>Bidirectional Conversion</h3>
          <p>Enter values in any field and get instant results. Swap between units with one click.</p>
        </div>
        <div class="feature">
          <span class="material-icons">table_chart</span>
          <h3>All Conversions at Once</h3>
          <p>See conversions to all available units simultaneously. Click any to use it.</p>
        </div>
        <div class="feature">
          <span class="material-icons">devices</span>
          <h3>Works Everywhere</h3>
          <p>Fully responsive design. Use on desktop, tablet, or mobile.</p>
        </div>
        <div class="feature">
          <span class="material-icons">bolt</span>
          <h3>Instant Results</h3>
          <p>No page reloads. Results update as you type for maximum efficiency.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  position: relative;
  overflow-x: hidden;
  padding-top: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 4rem;

  @include phone {
    padding-top: 3rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}

/* Hero Section */
.hero {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 4rem;
}

.hero-content {
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgb(var(--accent-500-rgb) / 12%);
  color: var(--accent-500);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;

  .material-icons {
    font-size: 1.1rem;
  }
}

h1 {
  font-size: 2.75rem;
  color: var(--accent-500);
  margin: 0 0 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;

  @include phone {
    font-size: 2rem;
  }
}

.hero-desc {
  font-size: 1.15rem;
  color: var(--text);
  opacity: 0.85;
  margin: 0 auto 1.5rem;
  max-width: 600px;
  line-height: 1.6;

  strong {
    color: var(--accent-500);
  }
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;

  &.primary {
    background: var(--accent-500);
    color: #fff;
    box-shadow: 0 4px 16px rgb(var(--accent-500-rgb) / 30%);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgb(var(--accent-500-rgb) / 40%);
    }
  }
}

/* Featured Converters */
.featured-converters {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 1rem;
  padding: 2rem;

  @include phone {
    padding: 1.5rem;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  color: var(--accent-500);
  margin: 0 0 1.5rem;
  font-weight: 700;

  .material-icons {
    font-size: 1.5rem;
  }
}

.converter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @include phone {
    grid-template-columns: 1fr;
  }
}

.converter-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--main-bg);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  text-decoration: none;
  color: var(--text);
  transition: all 0.2s;

  &:hover {
    border-color: var(--accent-500);
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 10%);

    .arrow {
      opacity: 1;
      transform: translateX(4px);
    }
  }

  > .material-icons:first-child {
    font-size: 1.75rem;
    color: var(--accent-500);
    flex-shrink: 0;
  }

  .converter-info {
    flex: 1;
    min-width: 0;

    h3 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
    }

    p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text);
      opacity: 0.7;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .arrow {
    font-size: 1.25rem;
    color: var(--accent-500);
    opacity: 0;
    transition: all 0.2s;
    flex-shrink: 0;
  }
}

.see-all {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--accent-500);
  font-weight: 600;
  text-decoration: none;
  transition: gap 0.2s;

  &:hover {
    gap: 0.6rem;
  }

  .material-icons {
    font-size: 1.1rem;
  }
}

/* Categories Section */
.categories-section {
  margin-bottom: 4rem;
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 1rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    border-color: var(--accent-500);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
  }

  .category-icon {
    font-size: 2.5rem;
    color: var(--accent-500);
    margin-bottom: 0.75rem;
  }

  h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    color: var(--text);
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--accent-500);
    font-weight: 500;
  }
}

/* Features Section */
.features-section {
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature {
  padding: 1.5rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;

  > .material-icons {
    font-size: 2rem;
    color: var(--accent-500);
    margin-bottom: 0.75rem;
  }

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.05rem;
    color: var(--text);
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text);
    opacity: 0.75;
    line-height: 1.5;
  }
}
</style>
