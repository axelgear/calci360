<script setup lang="ts">
import { calculators } from '~/components/Calculator/calculators/index'
import { isConverterConfig } from '~/components/Calculator/calculators/types'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

definePageMeta({
  hideLogo: true,
})

useSeoMeta({
  title: 'All Calculators & Unit Converters',
  ogTitle: 'All Calculators & Unit Converters',
  description: 'Free online engineering calculators and unit converters. Area, length, volume, mass, pressure, temperature, and more with bidirectional conversion.',
  ogDescription: 'Free online engineering calculators and unit converters.',
  twitterCard: 'summary_large_image',
})

useHead({
  title: 'All Calculators',
})

interface Calculator {
  slug: string
  name: string
  description: string
  icon: string
  isConverter: boolean
}

interface CalculatorCategory {
  id: string
  name: string
  icon: string
  description: string
  calculators: Calculator[]
}

/* Build categories dynamically from calculator configs */
const categories = computed<CalculatorCategory[]>(() => {
  const categoryMap: Record<string, Calculator[]> = {}
  
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
  
  const categoryMeta: Record<string, { icon: string; description: string }> = {
    'Unit Conversion': {
    icon: 'swap_horiz',
      description: 'Convert between different units of measurement with precision and ease',
    },
    'Geometry': {
      icon: 'category',
      description: 'Calculate areas, volumes, perimeters, and other geometric properties',
    },
  }
  
  const result: CalculatorCategory[] = []
  
  for (const [name, calcs] of Object.entries(categoryMap)) {
    const meta = categoryMeta[name] || { icon: 'calculate', description: `${name} calculators` }
    result.push({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon: meta.icon,
      description: meta.description,
      calculators: calcs,
    })
  }
  
  return result
})

const searchQuery = ref('')

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value
  
  const query = searchQuery.value.toLowerCase()
  return categories.value.map(cat => ({
    ...cat,
    calculators: cat.calculators.filter(calc => 
      calc.name.toLowerCase().includes(query) ||
      calc.description.toLowerCase().includes(query)
    )
  })).filter(cat => cat.calculators.length > 0)
})

const totalCalculators = computed(() => 
  categories.value.reduce((sum, cat) => sum + cat.calculators.length, 0)
)
</script>

<template>
  <div class="calculator-page">
    <div class="page-appbar">
      <NuxtLink to="/" class="back">
        <span class="material-icons">arrow_back</span>
      </NuxtLink>
    </div>

    <div class="calculator-content">
      <div class="hero">
        <div class="hero-badge">
          <span class="material-icons">calculate</span>
          <span>{{ totalCalculators }} {{ t('Free Tools') }}</span>
        </div>
        <h1>{{ t('Engineering Calculators') }}</h1>
        <p class="hero-desc">{{ t('Free online calculators for sheet metal fabrication, mechanical design, and manufacturing engineering.') }}</p>
        <div class="search-box">
          <span class="material-icons">search</span>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('Search calculators...')"
          />
        </div>
      </div>

      <div class="categories">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="category"
        >
          <div class="category-header">
            <span class="material-icons">{{ category.icon }}</span>
            <div>
              <h2>{{ t(category.name) }}</h2>
              <p>{{ t(category.description) }}</p>
            </div>
          </div>

          <div class="calculator-grid">
            <NuxtLink
              v-for="calc in category.calculators"
              :key="calc.slug"
              :to="`/calculator/${calc.slug}`"
              class="calculator-card"
            >
              <span class="material-icons calc-icon">{{ calc.icon }}</span>
              <div class="calc-info">
                <h3>{{ t(calc.name) }}</h3>
                <p>{{ t(calc.description) }}</p>
              </div>
              <span class="material-icons arrow">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>

        <div v-if="filteredCategories.length === 0" class="no-results">
          <span class="material-icons">search_off</span>
          <p>{{ t('No calculators found for') }} "{{ searchQuery }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes back-in {
  from {
    transform: translateY(100%);
  }
}

.calculator-page {
  width: 100%;
}

.page-appbar {
  height: 3rem;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 101;
  overflow: hidden;

  @include phone {
    left: 2.75rem;
  }

  > .back {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0 1rem;
    color: var(--neutral);
    animation: back-in 800ms cubic-bezier(0.75, 0, 0, 1) backwards;
    transition: color 0.2s;
    text-decoration: none;

    @include phone {
      padding: 0 0.75rem;
    }

    &:hover {
      color: var(--accent-500);
    }
  }
}

.calculator-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 1rem 2rem;

  @include phone {
    padding: 3rem 0.75rem 1.5rem;
  }
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: color-mix(in srgb, var(--accent-500) 12%, var(--card) 88%);
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
  font-size: 2.5rem;
  color: var(--accent-500);
  margin: 0 0 0.75rem 0;
  font-weight: 800;
}

.hero-desc {
  font-size: 1.1rem;
  color: var(--text);
  opacity: 0.85;
  margin: 0 0 1.5rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 400px;
  margin: 0 auto;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  
  .material-icons {
    color: var(--accent-500);
    font-size: 1.25rem;
  }
  
  input {
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

.categories {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.category-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  > .material-icons {
    font-size: 2.5rem;
    color: var(--accent-500);
    background: color-mix(in srgb, var(--accent-500) 12%, var(--card) 88%);
    padding: 0.75rem;
    border-radius: 0.75rem;
  }
  
  h2 {
    margin: 0 0 0.25rem 0;
    color: var(--accent-500);
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  p {
    margin: 0;
    color: var(--text);
    opacity: 0.75;
    font-size: 0.95rem;
  }
}

.calculator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.calculator-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--card);
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
  
  .calc-icon {
    font-size: 1.75rem;
    color: var(--accent-500);
    flex-shrink: 0;
  }
  
  .calc-info {
    flex: 1;
    min-width: 0;
    
    h3 {
      margin: 0 0 0.25rem 0;
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

.no-results {
  text-align: center;
  padding: 3rem;
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

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .calculator-grid {
    grid-template-columns: 1fr;
  }
  
  .category-header {
    > .material-icons {
      font-size: 2rem;
      padding: 0.5rem;
    }
    
    h2 {
      font-size: 1.25rem;
    }
  }
}
</style>
