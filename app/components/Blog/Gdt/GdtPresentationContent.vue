<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import CommonPresentation from '../CommonPresentation.vue'
import GdtSymbol from './GdtSymbol.vue'
import FeatureControlFrame from './FeatureControlFrame.vue'
import { useUiTranslator } from '@/composables/useUiTranslator'

// Import common components
import Badge from '@/components/Badge.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import CapsuleSlider from '@/components/CapsuleSlider.vue'
import Checkbox from '@/components/Checkbox.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import DataTable from '@/components/DataTable.vue'
import Dropdown from '@/components/Dropdown.vue'
import Tabs from '@/components/Tabs.vue'
import TabPanel from '@/components/TabPanel.vue'
import Tag from '@/components/Tag.vue'
import Timeline from '@/components/Timeline.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import Tooltips from '@/components/Tooltips.vue'
import Modal from '@/components/Modal.vue'

const { t } = useUiTranslator()

const emit = defineEmits(['close'])

/* Interactive states */
const activeSymbol = ref<string | null>(null)
const activeFcfPart = ref<string | null>(null)
const selectedCategory = ref<string | null>(null)

/* Quiz state */
const currentQuestion = ref(0)
const selectedAnswer = ref<number | null>(null)
const showResult = ref(false)
const score = ref(0)

/* Additional interactive states */
const showSymbolDetails = ref(false)
const selectedSymbolDetail = ref<any>(null)
const viewMode = ref<'grid' | 'list'>('grid')
const showTooltips = ref(true)
const showCodeExamples = ref(false)
const filterOptions = reactive({
  category: 'all',
  difficulty: 'all',
  showAdvanced: false
})

/* Timeline data for learning progression */
const learningTimeline = ref([
  {
    date: new Date('2024-01-01'),
    title: 'Introduction to GD&T',
    description: 'Understanding the basics',
    icon: '📚',
    status: 'completed'
  },
  {
    date: new Date('2024-01-15'),
    title: 'Geometric Symbols',
    description: 'Learning 14 characteristics',
    icon: '🔷',
    status: 'completed'
  },
  {
    date: new Date('2024-02-01'),
    title: 'Feature Control Frames',
    description: 'Understanding FCF structure',
    icon: '📋',
    status: 'in-progress'
  },
  {
    date: new Date('2024-02-15'),
    title: 'Datums & References',
    description: 'Mastering datum systems',
    icon: '📍',
    status: 'upcoming'
  }
])

/* FCF Parts */
const fcfParts = [
  { id: 'symbol', label: 'Geometric Characteristic', description: 'Defines the type of control' },
  { id: 'tolerance', label: 'Tolerance Value', description: 'Allowable variation' },
  { id: 'modifier', label: 'Material Condition', description: 'MMC, LMC, or RFS' },
  { id: 'primary', label: 'Primary Datum', description: 'First reference' },
  { id: 'secondary', label: 'Secondary Datum', description: 'Second reference' },
  { id: 'tertiary', label: 'Tertiary Datum', description: 'Third reference' }
]

/* Quiz Questions */
const quizQuestions = [
  {
    question: 'What does GD&T stand for?',
    options: [
      'General Design & Testing',
      'Geometric Dimensioning & Tolerancing',
      'Global Drawing & Technology',
      'Graphical Design & Tolerance'
    ],
    correct: 1
  },
  {
    question: 'How many geometric characteristics are there in GD&T?',
    options: ['10', '12', '14', '16'],
    correct: 2
  },
  {
    question: 'Which tolerance type controls the shape of individual features?',
    options: ['Form', 'Orientation', 'Location', 'Profile'],
    correct: 0
  }
]

const currentQuizQuestion = computed(() => quizQuestions[currentQuestion.value])

const checkAnswer = () => {
  if (selectedAnswer.value === currentQuizQuestion.value?.correct) {
    score.value++
  }
  showResult.value = true
}

const nextQuestion = () => {
  if (currentQuestion.value < quizQuestions.length - 1) {
    currentQuestion.value++
    selectedAnswer.value = null
    showResult.value = false
  }
}

const resetQuiz = () => {
  currentQuestion.value = 0
  selectedAnswer.value = null
  showResult.value = false
  score.value = 0
}

/* Slides configuration */
const slides = [
  {
    id: 'intro',
    title: 'GD&T Fundamentals',
    subtitle: 'Geometric Dimensioning and Tolerancing',
    type: 'hero',
    content: {
      tag: 'Engineering Standards Series',
      icon: 'straighten',
      meta: [
        { icon: 'calendar_today', label: '2025 Edition' },
        { icon: 'layers', label: 'ASME Y14.5' }
      ]
    }
  },
  {
    id: 'what-is-gdt',
    title: 'What is GD&T?',
    type: 'content'
  },
  {
    id: 'why-gdt',
    title: 'Traditional vs GD&T',
    type: 'comparison',
    content: [
      {
        type: 'negative',
        icon: 'close',
        title: 'Traditional Dimensioning',
        points: [
          'Square tolerance zones',
          'Ambiguous datum structure',
          'Limited functional representation',
          'Often overly restrictive'
        ]
      },
      {
        type: 'positive',
        icon: 'check',
        title: 'GD&T',
        points: [
          'Cylindrical tolerance zones where appropriate',
          'Clear datum hierarchy',
          'Represents function and fit',
          'Maximizes production tolerances'
        ]
      }
    ]
  },
  {
    id: 'symbols-overview',
    title: 'The 14 Geometric Characteristics',
    type: 'grid',
    content: {
      columns: 5,
      items: [
        { title: 'Form', description: '4 symbols', icon: 'category' },
        { title: 'Orientation', description: '3 symbols', icon: 'explore' },
        { title: 'Location', description: '3 symbols', icon: 'place' },
        { title: 'Profile', description: '2 symbols', icon: 'timeline' },
        { title: 'Runout', description: '2 symbols', icon: 'loop' }
      ]
    }
  },
  {
    id: 'fcf-anatomy',
    title: 'Feature Control Frame Anatomy',
    type: 'interactive'
  },
  {
    id: 'form-tolerances',
    title: 'Form Tolerances',
    type: 'grid',
    content: {
      columns: 4
    }
  },
  {
    id: 'orientation-tolerances',
    title: 'Orientation Tolerances',
    type: 'grid',
    content: {
      columns: 3
    }
  },
  {
    id: 'location-tolerances',
    title: 'Location Tolerances',
    type: 'grid',
    content: {
      columns: 3
    }
  },
  {
    id: 'quiz',
    title: 'Knowledge Check',
    type: 'quiz'
  },
  {
    id: 'summary',
    title: 'Key Takeaways',
    type: 'summary',
    content: [
      {
        icon: 'check_circle',
        title: 'Clear Communication',
        description: 'GD&T provides precise and unambiguous design intent'
      },
      {
        icon: 'precision_manufacturing',
        title: 'Improved Quality',
        description: 'Ensures parts fit and function correctly'
      },
      {
        icon: 'savings',
        title: 'Cost Reduction',
        description: 'Maximizes tolerances while maintaining function'
      },
      {
        icon: 'public',
        title: 'Global Standard',
        description: 'Based on ASME Y14.5 and ISO standards'
      }
    ]
  }
]

const handleSlideChange = (slideIndex: number) => {
  // Reset interactive states when changing slides
  if (slides[slideIndex]?.id === 'quiz') {
    resetQuiz()
  }
  activeSymbol.value = null
  activeFcfPart.value = null
  selectedCategory.value = null
}
</script>

<template>
  <CommonPresentation
    :slides="slides"
    title="GD&T Fundamentals"
    subtitle="A comprehensive guide to Geometric Dimensioning and Tolerancing"
    @close="$emit('close')"
    @slide-change="handleSlideChange"
  >
    <!-- Slide 1: What is GD&T (Enhanced with components) -->
    <template #slide-1>
      <div class="enhanced-slide">
        <!-- View mode toggle -->
        <div class="slide-controls">
          <CapsuleSlider
            v-model="viewMode"
            :options="[
              { value: 'grid', label: 'Grid View' },
              { value: 'list', label: 'List View' }
            ]"
            class="view-toggle"
          />
          <ToggleSwitch
            v-model="showTooltips"
            label="Show Tooltips"
          />
        </div>

        <div class="definition-card">
          <Badge text="ASME Y14.5" variant="primary" />
          <p class="definition-text">
            {{ t('Geometric Dimensioning and Tolerancing (GD&T) is a symbolic language used on engineering drawings to explicitly describe nominal geometry and its allowable variation.') }}
          </p>
          <div class="tags-container">
            <Tag v-for="tag in ['Precision', 'Standards', 'Manufacturing', 'Quality']" :key="tag" :label="tag" />
          </div>
        </div>

        <!-- Interactive Timeline -->
        <Timeline
          :items="learningTimeline"
          orientation="horizontal"
          :show-line="true"
          class="learning-progress"
        />

        <div :class="['key-components', viewMode]">
          <Tooltips
            v-for="(component, index) in [
              { name: 'Feature Control Frame', desc: 'Contains all tolerance information', icon: 'dashboard' },
              { name: 'Datum Reference Frame', desc: 'Establishes coordinate system', icon: 'grid_on' },
              { name: 'Geometric Characteristics', desc: '14 symbols defining tolerances', icon: 'category' },
              { name: 'Material Conditions', desc: 'MMC, LMC, RFS modifiers', icon: 'layers' }
            ]"
            :key="component.name"
            :content="component.desc"
            :disabled="!showTooltips"
          >
            <div 
              class="component-card"
              @click="selectedSymbolDetail = component"
            >
              <span class="material-icons">{{ component.icon }}</span>
              <h3>{{ t(component.name) }}</h3>
              <ButtonIcon
                name="info"
                size="small"
                variant="ghost"
                @click.stop="showSymbolDetails = true; selectedSymbolDetail = component"
              />
            </div>
          </Tooltips>
        </div>

        <!-- Modal for symbol details -->
        <Modal
          v-model:visible="showSymbolDetails"
          :title="selectedSymbolDetail?.name"
          max-width="600px"
        >
          <div v-if="selectedSymbolDetail" class="symbol-detail-content">
            <span class="detail-icon material-icons">{{ selectedSymbolDetail.icon }}</span>
            <p>{{ selectedSymbolDetail.desc }}</p>
            <CodeBlock
              v-if="showCodeExamples"
              :code="`// Example usage of ${selectedSymbolDetail.name}
const tolerance = {
  type: '${selectedSymbolDetail.name.toLowerCase().replace(/ /g, '_')}',
  value: 0.005,
  datums: ['A', 'B', 'C']
};`"
              language="javascript"
            />
          </div>
        </Modal>
      </div>
    </template>

    <!-- Slide 4: FCF Anatomy (Enhanced) -->
    <template #slide-4>
      <div class="fcf-demo-container">
        <!-- Interactive controls -->
        <div class="fcf-controls">
          <Dropdown
            v-model="filterOptions.category"
            :options="[
              { value: 'all', label: 'All Categories' },
              { value: 'form', label: 'Form' },
              { value: 'orientation', label: 'Orientation' },
              { value: 'location', label: 'Location' }
            ]"
            label="Filter by Category"
          />
          <Checkbox
            v-model="filterOptions.showAdvanced"
            label="Show Advanced Options"
          />
        </div>

        <div class="fcf-large">
          <div 
            v-for="(part, index) in fcfParts"
            :key="part.id"
            class="fcf-part"
            :class="{ active: activeFcfPart === part.id }"
            @click="activeFcfPart = part.id"
          >
            <div v-if="index === 0" class="fcf-content">
              <GdtSymbol symbol="position" size="40px" />
            </div>
            <div v-else-if="index === 1" class="fcf-content">
              <span>⌀</span> 0.25 <span class="circle-m">M</span>
            </div>
            <div v-else class="fcf-content">
              {{ index === 3 ? 'A' : index === 4 ? 'B' : 'C' }}
              <span v-if="index > 3" class="circle-m">M</span>
            </div>
          </div>
        </div>
        <transition name="slide-fade">
          <div v-if="activeFcfPart" class="fcf-explanation">
            <h3>{{ fcfParts.find((p: any) => p.id === activeFcfPart)?.label }}</h3>
            <p>{{ fcfParts.find((p: any) => p.id === activeFcfPart)?.description }}</p>
          </div>
        </transition>
      </div>
    </template>

    <!-- Slide 5: Form Tolerances (Enhanced with Tabs) -->
    <template #slide-5>
      <Tabs default-active="overview" variant="pills">
        <TabPanel id="overview" label="Overview">
          <div class="symbols-grid">
            <div 
              v-for="symbol in ['straightness', 'flatness', 'circularity', 'cylindricity']"
              :key="symbol"
              class="symbol-card"
              @click="activeSymbol = symbol"
              :class="{ active: activeSymbol === symbol }"
            >
              <GdtSymbol :symbol="symbol" size="64px" />
              <h3>{{ t(symbol.charAt(0).toUpperCase() + symbol.slice(1)) }}</h3>
              <div class="symbol-tags">
                <Tag label="Form" size="small" />
                <Badge :text="symbol === 'straightness' ? '2D/3D' : symbol === 'flatness' ? 'Surface' : '3D'" variant="info" />
              </div>
            </div>
          </div>
          <transition name="fade">
            <div v-if="activeSymbol" class="symbol-description">
              <p>{{ t(`${activeSymbol} controls the form of a feature without regard to its orientation or location.`) }}</p>
            </div>
          </transition>
        </TabPanel>
        
        <TabPanel id="details" label="Detailed Specifications">
          <DataTable
            :columns="[
              { key: 'symbol', label: 'Symbol', width: '100px' },
              { key: 'name', label: 'Name' },
              { key: 'application', label: 'Application' },
              { key: 'datum', label: 'Datum Required' }
            ]"
            :data="[
              { 
                symbol: 'straightness',
                name: 'Straightness',
                application: 'Lines, axes, and median planes',
                datum: 'No'
              },
              {
                symbol: 'flatness',
                name: 'Flatness',
                application: 'Surfaces',
                datum: 'No'
              },
              {
                symbol: 'circularity',
                name: 'Circularity (Roundness)',
                application: 'Circular elements',
                datum: 'No'
              },
              {
                symbol: 'cylindricity',
                name: 'Cylindricity',
                application: 'Cylindrical surfaces',
                datum: 'No'
              }
            ]"
          >
            <template #symbol="{ row }">
              <GdtSymbol :symbol="row.symbol" size="32px" />
            </template>
          </DataTable>
        </TabPanel>

        <TabPanel id="examples" label="Code Examples">
          <CodeBlock
            :code="`// Form Tolerance Example
const formTolerance = {
  type: 'flatness',
  value: 0.05,
  units: 'mm',
  appliedTo: 'surface',
  datumRequired: false
};

// Apply to feature
feature.addTolerance(formTolerance);`"
            language="javascript"
          />
        </TabPanel>
      </Tabs>
    </template>

    <!-- Slide 6: Orientation Tolerances -->
    <template #slide-6>
      <div class="symbols-grid cols-3">
        <div 
          v-for="symbol in ['perpendicularity', 'angularity', 'parallelism']"
          :key="symbol"
          class="symbol-card"
          @click="activeSymbol = symbol"
          :class="{ active: activeSymbol === symbol }"
        >
          <GdtSymbol :symbol="symbol" size="64px" />
          <h3>{{ t(symbol.charAt(0).toUpperCase() + symbol.slice(1)) }}</h3>
        </div>
      </div>
    </template>

    <!-- Slide 7: Location Tolerances -->
    <template #slide-7>
      <div class="symbols-grid cols-3">
        <div 
          v-for="symbol in ['position', 'concentricity', 'symmetry']"
          :key="symbol"
          class="symbol-card"
          @click="activeSymbol = symbol"
          :class="{ active: activeSymbol === symbol }"
        >
          <GdtSymbol :symbol="symbol" size="64px" />
          <h3>{{ t(symbol.charAt(0).toUpperCase() + symbol.slice(1)) }}</h3>
        </div>
      </div>
    </template>

    <!-- Slide 8: Quiz -->
    <template #slide-8>
      <div class="quiz-container">
        <div class="question-progress">
          <span>{{ t('Question') }} {{ currentQuestion + 1 }}/{{ quizQuestions.length }}</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }"></div>
          </div>
        </div>
        
        <div class="question-card">
          <h3>{{ t(currentQuizQuestion.question) }}</h3>
          <div class="options">
            <button
              v-for="(option, index) in currentQuizQuestion.options"
              :key="index"
              @click="selectedAnswer = index"
              :class="{ 
                selected: selectedAnswer === index,
                correct: showResult && index === currentQuizQuestion.correct,
                incorrect: showResult && selectedAnswer === index && index !== currentQuizQuestion.correct
              }"
              :disabled="showResult"
              class="option-button"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
              {{ t(option) }}
            </button>
          </div>
          
          <div class="quiz-actions">
            <button v-if="!showResult && selectedAnswer !== null" @click="checkAnswer" class="action-button primary">
              {{ t('Check Answer') }}
            </button>
            <button v-if="showResult && currentQuestion < quizQuestions.length - 1" @click="nextQuestion" class="action-button">
              {{ t('Next Question') }}
            </button>
            <div v-if="showResult && currentQuestion === quizQuestions.length - 1" class="quiz-score">
              <h3>{{ t('Quiz Complete!') }}</h3>
              <p class="score">{{ t('Your Score') }}: {{ score }}/{{ quizQuestions.length }}</p>
              <button @click="resetQuiz" class="action-button">{{ t('Try Again') }}</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CommonPresentation>
</template>

<style scoped lang="scss">
/* Enhanced slide styles */
.enhanced-slide {
  .slide-controls {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    
    .view-toggle {
      min-width: 200px;
    }
  }
  
  .tags-container {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .learning-progress {
    margin: 2rem 0;
  }
}

/* FCF Controls */
.fcf-controls {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

/* Symbol tags */
.symbol-tags {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.5rem;
}

/* Modal content */
.symbol-detail-content {
  text-align: center;
  
  .detail-icon {
    font-size: 4rem;
    color: var(--accent-500);
    margin-bottom: 1rem;
    display: block;
  }
  
  p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }
}

/* Grid view modes */
.key-components {
  &.list {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
    
    .component-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
      
      .material-icons {
        margin: 0;
      }
    }
  }
}
/* Definition Card */
.definition-card {
  background: var(--card);
  border: 1px solid rgba(var(--accent-500-rgb), 0.2);
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);

  .definition-text {
    font-size: 1.25rem;
    line-height: 1.8;
    text-align: center;
    color: var(--text);
  }
}

/* Key Components */
.key-components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;

  .component-card {
    background: var(--card);
    border: 1px solid rgba(var(--accent-500-rgb), 0.1);
    border-radius: 0.75rem;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover,
    &.active {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--accent-500);
      background: rgba(var(--accent-500-rgb), 0.05);
    }

    .material-icons {
      font-size: 2.5rem;
      color: var(--accent-500);
      margin-bottom: 0.75rem;
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text);
    }

    p {
      font-size: 0.85rem;
      color: var(--text);
      opacity: 0.7;
    }
  }
}

/* FCF Demo */
.fcf-demo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .fcf-large {
    display: flex;
    border: 2px solid var(--accent-500);
    background: var(--card);
    box-shadow: var(--shadow-xl);
    font-size: 2rem;
    font-family: 'Roboto Mono', monospace;
    border-radius: 0.5rem;
    overflow: hidden;

    .fcf-part {
      padding: 1.5rem 2rem;
      border-right: 2px solid var(--accent-500);
      cursor: pointer;
      transition: all 0.3s;
      position: relative;

      &:last-child {
        border-right: none;
      }

      &:hover,
      &.active {
        background: rgba(var(--accent-500-rgb), 0.1);
      }

      &.active::after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid var(--accent-500);
      }

      .fcf-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .circle-m {
        display: inline-block;
        border: 2px solid var(--text);
        border-radius: 50%;
        width: 1.2em;
        height: 1.2em;
        line-height: 1.1em;
        text-align: center;
        font-size: 0.6em;
        margin-left: 0.2em;
        vertical-align: middle;
      }
    }
  }

  .fcf-explanation {
    background: var(--card);
    border: 1px solid rgba(var(--accent-500-rgb), 0.2);
    border-radius: 0.75rem;
    padding: 1.5rem;
    text-align: center;
    max-width: 400px;

    h3 {
      color: var(--accent-500);
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
    }

    p {
      color: var(--text);
      opacity: 0.8;
    }
  }
}

/* Symbols Grid */
.symbols-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  &.cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .symbol-card {
    background: var(--card);
    border: 1px solid rgba(var(--accent-500-rgb), 0.1);
    border-radius: 0.75rem;
    padding: 2rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover,
    &.active {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--accent-500);
      background: rgba(var(--accent-500-rgb), 0.05);
    }

    h3 {
      font-size: 1rem;
      margin-top: 1rem;
      color: var(--text);
    }
  }
}

.symbol-description {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background: var(--card);
  border: 1px solid rgba(var(--accent-500-rgb), 0.2);
  border-radius: 0.5rem;

  p {
    margin: 0;
    color: var(--text);
    opacity: 0.8;
  }
}

/* Quiz Styles */
.quiz-container {
  max-width: 700px;
  margin: 0 auto;

  .question-progress {
    margin-bottom: 2rem;
    text-align: center;

    span {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text);
      opacity: 0.8;
    }

    .progress-bar {
      height: 8px;
      background: rgba(var(--accent-500-rgb), 0.2);
      border-radius: 4px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: var(--accent-500);
        transition: width 0.3s;
      }
    }
  }

  .question-card {
    background: var(--card);
    border: 1px solid rgba(var(--accent-500-rgb), 0.2);
    border-radius: 0.75rem;
    padding: 2rem;

    h3 {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      text-align: center;
      color: var(--text);
    }

    .options {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .option-button {
      background: var(--card);
      border: 2px solid rgba(var(--accent-500-rgb), 0.2);
      border-radius: 0.5rem;
      padding: 1rem 1.5rem;
      text-align: left;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--text);

      .option-letter {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        background: rgba(var(--accent-500-rgb), 0.1);
        border-radius: 50%;
        font-weight: 600;
        color: var(--accent-500);
      }

      &:hover:not(:disabled) {
        background: rgba(var(--accent-500-rgb), 0.05);
        border-color: var(--accent-500);
      }

      &.selected {
        background: rgba(var(--accent-500-rgb), 0.1);
        border-color: var(--accent-500);
      }

      &.correct {
        background: rgba(16, 185, 129, 0.1);
        border-color: #10b981;

        .option-letter {
          background: #10b981;
          color: white;
        }
      }

      &.incorrect {
        background: rgba(239, 68, 68, 0.1);
        border-color: #ef4444;

        .option-letter {
          background: #ef4444;
          color: white;
        }
      }

      &:disabled {
        cursor: default;
      }
    }

    .quiz-actions {
      text-align: center;

      .action-button {
        background: var(--accent-500);
        color: white;
        border: none;
        border-radius: 0.5rem;
        padding: 0.75rem 2rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        &.primary {
          background: var(--accent-500);
        }
      }

      .quiz-score {
        text-align: center;

        h3 {
          color: var(--accent-500);
          margin-bottom: 1rem;
        }

        .score {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 1.5rem;
        }
      }
    }
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .key-components {
    grid-template-columns: 1fr;
  }

  .symbols-grid {
    grid-template-columns: repeat(2, 1fr);

    &.cols-3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .fcf-large {
    font-size: 1rem !important;

    .fcf-part {
      padding: 0.75rem 1rem !important;
    }
  }
}
</style>
