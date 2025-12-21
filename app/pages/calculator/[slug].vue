<script setup lang="ts">
import { getCalculator, calculators } from '~/components/Calculator/calculators/index'
import { isConverterConfig, isGeometryCalculatorConfig, isMetalWeightCalculatorConfig, isHvacDuctCalculatorConfig, isDuctSizingCalculatorConfig } from '~/components/Calculator/calculators/types'
import type { GeometryCalculatorConfig, ConverterConfig, MetalWeightCalculatorConfig, HvacDuctCalculatorConfig, DuctSizingCalculatorConfig } from '~/components/Calculator/calculators/types'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

const route = useRoute()
const slug = computed(() => route.params.slug as string)

/* Get calculator config */
const config = computed(() => getCalculator(slug.value))

/* 404 if calculator not found */
if (!config.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Calculator "${slug.value}" not found`,
  })
}

/* Check calculator type */
const isConverter = computed(() => config.value && isConverterConfig(config.value))
const isGeometry = computed(() => config.value && isGeometryCalculatorConfig(config.value))
const isMetalWeight = computed(() => config.value && isMetalWeightCalculatorConfig(config.value))
const isHvacDuct = computed(() => config.value && isHvacDuctCalculatorConfig(config.value))
const isDuctSizing = computed(() => config.value && isDuctSizingCalculatorConfig(config.value))

/* Get typed configs */
const converterConfig = computed(() => 
  isConverter.value ? (config.value as ConverterConfig) : null
)

const geometryConfig = computed(() => 
  isGeometry.value ? (config.value as GeometryCalculatorConfig) : null
)

const metalWeightConfig = computed(() => 
  isMetalWeight.value ? (config.value as MetalWeightCalculatorConfig) : null
)

const hvacDuctConfig = computed(() => 
  isHvacDuct.value ? (config.value as HvacDuctCalculatorConfig) : null
)

const ductSizingConfig = computed(() => 
  isDuctSizing.value ? (config.value as DuctSizingCalculatorConfig) : null
)

/* Check if it's a volume calculator (3D) vs area calculator (2D) */
const isVolumeCalculator = computed(() => 
  geometryConfig.value?.resultLabel === 'Volume' || 
  geometryConfig.value?.resultUnit?.includes('³')
)

/* Geometry mode for unified widget */
const geometryMode = computed(() => isVolumeCalculator.value ? 'volume' : 'area')

/* SEO */
useSeoMeta({
  title: () => config.value?.name ?? 'Calculator',
  ogTitle: () => config.value?.name ?? 'Calculator',
  description: () => config.value?.description ?? 'Free online calculator',
  ogDescription: () => config.value?.description ?? 'Free online calculator',
  twitterCard: 'summary_large_image',
})

useHead({
  title: () => config.value?.name ?? 'Calculator',
})

/* Related calculators (same category) */
const relatedCalculators = computed(() => {
  if (!config.value) return []
  
  return Object.entries(calculators)
    .filter(([s, c]) => c.category === config.value!.category && s !== slug.value)
    .slice(0, 6)
    .map(([s, c]) => ({
      slug: s,
      name: c.name,
      icon: c.icon,
    }))
})

definePageMeta({
  hideLogo: true,
})
</script>

<template>
  <div class="calculator-page">
    <!-- App Bar -->
    <div class="page-appbar">
      <NuxtLink to="/calculator" class="back">
        <span class="material-icons">arrow_back</span>
      </NuxtLink>
    </div>
    
    <div class="calculator-content" v-if="config">
      <!-- Header -->
      <header class="calculator-header">
        <div class="icon-wrapper">
          <span class="material-icons">{{ config.icon }}</span>
        </div>
        <div class="header-text">
          <span class="category-badge">{{ t(config.category) }}</span>
          <h1>{{ t(config.name) }}</h1>
          <p class="description">{{ t(config.description) }}</p>
        </div>
      </header>
      
      <!-- Calculator Widget -->
      <main class="calculator-main">
        <!-- Unit Converter -->
        <CalculatorConverterWidget v-if="isConverter && converterConfig" :config="converterConfig" />
        
        <!-- Geometry Calculator (Area/Volume - unified) -->
        <CalculatorGeometryWidget 
          v-else-if="isGeometry && geometryConfig" 
          :config="geometryConfig" 
          :mode="geometryMode" 
        />
        
        <!-- Metal Weight Calculator -->
        <CalculatorMetalWeightWidget 
          v-else-if="isMetalWeight && metalWeightConfig" 
          :config="metalWeightConfig" 
        />
        
        <!-- HVAC Duct Calculator -->
        <CalculatorHvacDuctWidget 
          v-else-if="isHvacDuct && hvacDuctConfig" 
          :config="hvacDuctConfig" 
        />
        
        <!-- Duct Sizing Calculator -->
        <CalculatorDuctSizingWidget 
          v-else-if="isDuctSizing && ductSizingConfig" 
          :config="ductSizingConfig" 
        />
        
        <!-- Placeholder for other calculators -->
        <div v-else class="coming-soon">
          <span class="material-icons">construction</span>
          <p>{{ t('This calculator is coming soon!') }}</p>
        </div>
      </main>
      
      <!-- Related Calculators -->
      <section v-if="relatedCalculators.length > 0" class="related-section">
        <h2>
          <span class="material-icons">apps</span>
          {{ t('Related Calculators') }}
        </h2>
        <div class="related-grid">
          <NuxtLink
            v-for="calc in relatedCalculators"
            :key="calc.slug"
            :to="`/calculator/${calc.slug}`"
            class="related-card"
          >
            <span class="material-icons">{{ calc.icon }}</span>
            <span class="name">{{ t(calc.name) }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes back-in {
  from {
    transform: translateY(100%);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.calculator-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, rgb(var(--accent-500-rgb) / 3%) 0%, transparent 300px);
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
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 1.5rem 3rem;
  
  @include phone {
    padding: 3.5rem 1rem 2rem;
  }
}

.calculator-header {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
  animation: fade-in-up 0.6s cubic-bezier(0.1, 0.9, 0.2, 1) both;
  
  @include phone {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--accent-500) 0%, rgb(var(--accent-500-rgb) / 70%) 100%);
    border-radius: 1rem;
    box-shadow: 0 8px 24px rgb(var(--accent-500-rgb) / 25%);
    flex-shrink: 0;
    
    .material-icons {
      font-size: 2rem;
      color: white;
    }
    
    @include phone {
      width: 56px;
      height: 56px;
      
      .material-icons {
        font-size: 1.75rem;
      }
    }
  }
  
  .header-text {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  
  .category-badge {
    display: inline-block;
    width: fit-content;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent-500);
    background: rgb(var(--accent-500-rgb) / 10%);
    border-radius: 999px;
    
    @include phone {
      margin: 0 auto;
    }
  }
  
  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--text);
    
    @include phone {
      font-size: 1.5rem;
    }
  }
  
  .description {
    margin: 0;
    font-size: 1rem;
    color: var(--text);
    opacity: 0.75;
    line-height: 1.5;
  }
}

.calculator-main {
  animation: fade-in-up 0.6s cubic-bezier(0.1, 0.9, 0.2, 1) 0.1s both;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 2rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  text-align: center;
  
  .material-icons {
    font-size: 3rem;
    color: var(--accent-500);
  }
  
  p {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text);
    opacity: 0.75;
  }
}

.related-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgb(var(--accent-500-rgb) / 10%);
  animation: fade-in-up 0.6s cubic-bezier(0.1, 0.9, 0.2, 1) 0.2s both;
  
  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1.25rem;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--accent-500);
    
    .material-icons {
      font-size: 1.25rem;
    }
  }
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  
  @include phone {
    grid-template-columns: 1fr;
  }
}

.related-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--text);
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--accent-500);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
  }
  
  .material-icons {
    font-size: 1.25rem;
    color: var(--accent-500);
  }
  
  .name {
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
