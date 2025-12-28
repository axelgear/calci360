<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useUiTranslator } from '~/composables/useUiTranslator'

// Import common components
import Badge from '@/components/Badge.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import CapsuleSlider from '@/components/CapsuleSlider.vue'
import Checkbox from '@/components/Checkbox.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import CodeTabs from '@/components/CodeTabs.vue'
import ContentSection from '@/components/ContentSection.vue'
import DataTable from '@/components/DataTable.vue'
import DefinitionBox from '@/components/DefinitionBox.vue'
import Dropdown from '@/components/Dropdown.vue'
import InlineCode from '@/components/InlineCode.vue'
import Tabs from '@/components/Tabs.vue'
import TabPanel from '@/components/TabPanel.vue'
import Tag from '@/components/Tag.vue'
import Timeline from '@/components/Timeline.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import Tooltips from '@/components/Tooltips.vue'

const { t } = useUiTranslator()

/* Interactive states */
const showAdvancedContent = ref(false)
const selectedDifficulty = ref('beginner')
const enableAnimations = ref(true)
const symbolFilter = ref('all')
const activeTabId = ref('introduction')

/* History timeline data */
const historyTimeline = [
  {
    date: new Date('1940-01-01'),
    title: 'Early Development',
    description: 'Initial concepts of GD&T emerge in military manufacturing',
    icon: '⚙️'
  },
  {
    date: new Date('1959-01-01'),
    title: 'First Standard',
    description: 'MIL-STD-8 published by US Military',
    icon: '📋'
  },
  {
    date: new Date('1982-01-01'),
    title: 'ASME Y14.5',
    description: 'First ASME standard for GD&T published',
    icon: '📘'
  },
  {
    date: new Date('1994-01-01'),
    title: 'Y14.5M-1994',
    description: 'Major revision with metric support',
    icon: '📏'
  },
  {
    date: new Date('2009-01-01'),
    title: 'Y14.5-2009',
    description: 'Modern standard with new symbols',
    icon: '🔄'
  },
  {
    date: new Date('2018-01-01'),
    title: 'Y14.5-2018',
    description: 'Current standard with latest updates',
    icon: '✨'
  }
]

/* Symbol categories for filtering */
const symbolCategories = [
  { value: 'all', label: 'All Symbols' },
  { value: 'form', label: 'Form' },
  { value: 'orientation', label: 'Orientation' },
  { value: 'location', label: 'Location' },
  { value: 'profile', label: 'Profile' },
  { value: 'runout', label: 'Runout' }
]
</script>

<template>
  <div class="blog-post gdt-fundamentals">
    
    <!-- Introduction -->
    <div class="post-intro">
      <div class="intro-card">
        <span class="material-icons intro-icon">straighten</span>
        <p class="intro-text">
          {{ t('Geometric Dimensioning and Tolerancing (GD&T) is a symbolic language used on engineering drawings and computer-generated 3D models to explicitly describe nominal geometry and its allowable variation.') }}
        </p>
      </div>
    </div>

    <!-- Enhanced Controls -->
    <div class="content-controls">
      <CapsuleSlider v-model="selectedDifficulty" :options="[
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' }
        ]" />
      <ToggleSwitch v-model="showAdvancedContent" label="Show Advanced Content" />
      <ToggleSwitch v-model="enableAnimations" label="Enable Animations" />
    </div>

    <!-- Tab Content using Tabs component -->
    <Tabs 
      :tabs="[
        { id: 'introduction', label: 'Introduction', icon: 'info' },
        { id: 'history', label: 'History & Standards', icon: 'history' },
        { id: 'principles', label: 'Basic Principles', icon: 'foundation' },
        { id: 'symbols', label: 'Symbol Overview', icon: 'category' },
        { id: 'benefits', label: 'Benefits', icon: 'trending_up' },
        { id: 'examples', label: 'Examples', icon: 'view_in_ar' }
      ]" 
      v-model="activeTabId" 
      variant="boxed"
    >
      <!-- Introduction Tab -->
      <TabPanel id="introduction">
        <h2 id="what-is-gdt">{{ t('What is GD&T?') }}</h2>
        
        <p>
          {{ t('Geometric Dimensioning and Tolerancing (GD&T) is a system for defining and communicating engineering tolerances via a symbolic language on engineering drawings and computer-generated 3D models that describes a nominal geometry and its allowable variation.') }}
        </p>

        <DefinitionBox
          :title="t('GD&T Definition')"
          :definition="t('A symbolic language used on engineering drawings to explicitly describe nominal geometry and its allowable variation')"
          icon="straighten"
        />

        <div class="component-list-enhanced">
          <Tooltips
            v-for="component in [
              { 
                name: t('Feature Control Frame'),
                desc: t('Contains all tolerance information'),
                icon: 'dashboard' 
              },
              { 
                name: t('Datum Reference Frame'),
                desc: t('Establishes coordinate system'),
                icon: 'grid_on' 
              },
              { 
                name: t('Geometric Characteristics'),
                desc: t('14 symbols defining tolerances'),
                icon: 'category' 
              },
              { 
                name: t('Material Conditions'),
                desc: t('MMC, LMC, RFS modifiers'),
                icon: 'layers' 
              }
            ]"
            :key="component.name"
            :content="component.desc"
          >
            <div class="component-card">
              <span class="material-icons">{{ component.icon }}</span>
              <div>
                <strong>{{ component.name }}</strong>
                <p>{{ component.desc }}</p>
              </div>
            </div>
          </Tooltips>
        </div>

        <h3 id="why-use-gdt">{{ t('Why Use GD&T?') }}</h3>
        
        <p>
          {{ t('Traditional coordinate dimensioning often fails to capture design intent effectively. GD&T provides a clear and concise method to communicate:') }}
        </p>

        <div class="comparison-grid">
          <div class="comparison-card traditional">
            <h4>{{ t('Traditional Dimensioning') }}</h4>
            <ul>
              <li>{{ t('Square tolerance zones') }}</li>
              <li>{{ t('Ambiguous datum structure') }}</li>
              <li>{{ t('Limited functional representation') }}</li>
              <li>{{ t('Often overly restrictive') }}</li>
            </ul>
          </div>
          <div class="comparison-card gdt">
            <h4>{{ t('GD&T') }}</h4>
            <ul>
              <li>{{ t('Cylindrical tolerance zones where appropriate') }}</li>
              <li>{{ t('Clear datum hierarchy') }}</li>
              <li>{{ t('Represents function and fit') }}</li>
              <li>{{ t('Maximizes production tolerances') }}</li>
            </ul>
          </div>
        </div>
        <div class="component-list-enhanced">
          <Tooltips v-for="component in [
                { 
                  name: 'Feature Control Frame',
                  desc: 'The rectangular box containing geometric tolerance information',
                  icon: 'view_in_ar'
                },
                {
                  name: 'Datum Reference Frame',
                  desc: 'A coordinate system used to locate and orient tolerance zones',
                  icon: 'grid_on'
                },
                {
                  name: 'Geometric Characteristics',
                  desc: '14 symbols defining form, orientation, location, and runout',
                  icon: 'category'
                },
                {
                  name: 'Material Condition Modifiers',
                  desc: 'MMC, LMC, and RFS modifiers that affect tolerance zones',
                  icon: 'layers'
                }
              ]" :key="component.name" :content="component.desc">
            <div class="component-item">
              <span class="material-icons">{{ component.icon }}</span>
              <div>
                <strong>{{ t(component.name) }}</strong>
                <p>{{ t(component.desc) }}</p>
                <div class="component-tags">
                  <Tag :label="component.name.split(' ')[0]" size="small" />
                  <Badge v-if="showAdvancedContent" text="Advanced" variant="warning" />
                </div>
              </div>
            </div>
          </Tooltips>
        </div>

        <h3 id="why-use-gdt">{{ t('Why Use GD&T?') }}</h3>

        <p>
          {{ t('Traditional coordinate dimensioning often fails to capture design intent effectively. GD&T provides a clear and concise method to communicate:') }}
        </p>

        <div class="comparison-grid">
          <div class="comparison-card traditional">
            <h4>{{ t('Traditional Dimensioning') }}</h4>
            <ul>
              <li>{{ t('Square tolerance zones') }}</li>
              <li>{{ t('Ambiguous datum structure') }}</li>
              <li>{{ t('Limited functional representation') }}</li>
              <li>{{ t('Often overly restrictive') }}</li>
            </ul>
          </div>
          <div class="comparison-card gdt">
            <h4>{{ t('GD&T') }}</h4>
            <ul>
              <li>{{ t('Cylindrical tolerance zones where appropriate') }}</li>
              <li>{{ t('Clear datum hierarchy') }}</li>
              <li>{{ t('Represents function and fit') }}</li>
              <li>{{ t('Maximizes production tolerances') }}</li>
            </ul>
          </div>
        </div>
      </TabPanel>



      <!-- History & Standards Tab -->
      <TabPanel id="history">
        <h2>History and Standards</h2>
        <p>This is the history tab content.</p>
      </TabPanel>
      <Timeline :items="historyTimeline" :group-by-date="false" orientation="vertical" :show-line="true" />

      <!-- Standards comparison table -->
      <h3>{{ t('Major Standards') }}</h3>
      <DataTable :columns="[
            { key: 'standard', label: 'Standard' },
            { key: 'organization', label: 'Organization' },
            { key: 'region', label: 'Primary Region' },
            { key: 'latest', label: 'Latest Version' }
          ]" :data="[
            { standard: 'Y14.5', organization: 'ASME', region: 'USA', latest: '2018' },
            { standard: 'ISO 1101', organization: 'ISO', region: 'International', latest: '2017' },
            { standard: 'ISO 5459', organization: 'ISO', region: 'International', latest: '2011' },
            { standard: 'DIN ISO 1101', organization: 'DIN', region: 'Germany', latest: '2017' }
          ]">
        <template #standard="{ row }">
          <Badge :text="row.standard" variant="info" />
        </template>
        <template #latest="{ row }">
          <Tag :label="`v${row.latest}`" />
        </template>
      </DataTable>

      <div class="timeline-old-remove">
        <div class="timeline-item">
          <div class="timeline-marker">1940s</div>
          <div class="timeline-content">
            <h4>{{ t('Origins in WWII') }}</h4>
            <p>{{ t('Stanley Parker developed the concept of "True Position" at Royal Torpedo Factory in Scotland to improve torpedo production.') }}</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">1949</div>
          <div class="timeline-content">
            <h4>{{ t('First Military Standard') }}</h4>
            <p>{{ t('U.S. Military Standard MIL-STD-8 published, introducing positional tolerancing.') }}</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">1966</div>
          <div class="timeline-content">
            <h4>{{ t('ANSI Y14.5') }}</h4>
            <p>{{ t('First American National Standard for Dimensioning and Tolerancing published.') }}</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">1982</div>
          <div class="timeline-content">
            <h4>{{ t('International Adoption') }}</h4>
            <p>{{ t('ANSI Y14.5-1982 gains widespread international acceptance.') }}</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">2018</div>
          <div class="timeline-content">
            <h4>{{ t('ASME Y14.5-2018') }}</h4>
            <p>{{ t('Latest revision includes updates for modern manufacturing and digital definition.') }}</p>
          </div>
        </div>
      </div>

      <h3 id="current-standards">{{ t('Current Standards') }}</h3>

      <div class="standards-grid">
        <div class="standard-card">
          <h4>{{ t('ASME Y14.5-2018') }}</h4>
          <p class="standard-region">{{ t('United States') }}</p>
          <p>{{ t('The primary American standard for GD&T, widely used internationally in aerospace and automotive industries.') }}</p>
        </div>

        <div class="standard-card">
          <h4>{{ t('ISO 1101:2017') }}</h4>
          <p class="standard-region">{{ t('International') }}</p>
          <p>{{ t('ISO standard for geometrical tolerancing, used primarily in Europe and Asia.') }}</p>
        </div>

        <div class="standard-card">
          <h4>{{ t('ISO 5458:2018') }}</h4>
          <p class="standard-region">{{ t('International') }}</p>
          <p>{{ t('Positional tolerancing standard complementing ISO 1101.') }}</p>
        </div>
      </div>

      <!-- Basic Principles Tab -->
      <TabPanel id="principles">
        <h2 id="basic-principles">{{ t('Basic Principles of GD&T') }}</h2>

        <div class="principle-card">
          <h3>{{ t('1. Perfect Form at MMC') }}</h3>
          <p>{{ t('When a feature of size is at Maximum Material Condition (MMC), it must have perfect form. This is also known as Rule #1 or the Envelope Principle.') }}</p>
          <div class="example-box">
            <p><strong>{{ t('Example:') }}</strong> {{ t('A shaft at its maximum diameter must be perfectly straight.') }}</p>
          </div>
        </div>

        <div class="principle-card">
          <h3>{{ t('2. Regardless of Feature Size (RFS)') }}</h3>
          <p>{{ t('Unless otherwise specified, all geometric tolerances apply regardless of the actual size of the feature. This is the default condition.') }}</p>
        </div>

        <div class="principle-card">
          <h3>{{ t('3. Material Condition Modifiers') }}</h3>
          <div class="modifier-grid">
            <div class="modifier-item">
              <div class="modifier-symbol">Ⓜ</div>
              <div>
                <h4>{{ t('MMC - Maximum Material Condition') }}</h4>
                <p>{{ t('The condition where a feature contains the maximum amount of material.') }}</p>
              </div>
            </div>
            <div class="modifier-item">
              <div class="modifier-symbol">Ⓛ</div>
              <div>
                <h4>{{ t('LMC - Least Material Condition') }}</h4>
                <p>{{ t('The condition where a feature contains the least amount of material.') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="principle-card">
          <h3>{{ t('4. Datum Hierarchy') }}</h3>
          <p>{{ t('Datums are referenced in order of precedence: Primary, Secondary, and Tertiary. This creates a repeatable coordinate system.') }}</p>

          <div class="datum-example">
            <div class="datum-frame">
              <span class="datum-label primary">{{ t('Primary Datum A') }}</span>
              <span class="datum-arrow">→</span>
              <span class="datum-label secondary">{{ t('Secondary Datum B') }}</span>
              <span class="datum-arrow">→</span>
              <span class="datum-label tertiary">{{ t('Tertiary Datum C') }}</span>
            </div>
            <p class="datum-description">
              {{ t('Primary datum constrains 3 degrees of freedom, secondary constrains 2, tertiary constrains 1.') }}
            </p>
          </div>
        </div>

        <div class="principle-card">
          <h3>{{ t('5. Basic Dimensions') }}</h3>
          <p>{{ t('Theoretically exact dimensions used to define true position, true profile, or angular relationships. Shown in rectangular boxes on drawings.') }}</p>
          <div class="basic-dim-example">
            <span class="basic-dimension">[50.00]</span>
            <p>{{ t('Basic dimensions have no tolerance - the tolerance is defined by the geometric control.') }}</p>
          </div>
        </div>
      </TabPanel>

      <!-- Symbols Overview Tab -->
      <TabPanel id="symbols">
        <h2 id="symbols-overview">{{ t('GD&T Symbols Overview') }}</h2>

        <div class="symbols-controls">
          <Dropdown v-model="symbolFilter" :options="symbolCategories" label="Filter by Category" />
          <Checkbox v-model="showAdvancedContent" label="Show Advanced Details" />
        </div>

        <p>{{ t('GD&T uses 14 geometric characteristic symbols divided into five categories:') }}</p>

        <div class="symbols-categories">
          <!-- Form Tolerances -->
          <div class="symbol-category" v-show="symbolFilter === 'all' || symbolFilter === 'form'">
            <h3>{{ t('Form Tolerances') }}</h3>
            <p class="category-desc">{{ t('Control the shape of individual features') }}</p>
            <div class="symbol-grid">
              <Tooltips v-for="symbol in ['straightness', 'flatness', 'circularity', 'cylindricity']" :key="symbol"
                :content="`${symbol} tolerance controls form without datum reference`">
                <div class="symbol-card enhanced">
                  <GdtSymbol :symbol="symbol" size="56px" />
                  <span>{{ t(symbol.charAt(0).toUpperCase() + symbol.slice(1)) }}</span>
                  <div class="symbol-meta">
                    <Tag label="No Datum" size="small" />
                    <Badge v-if="selectedDifficulty === 'advanced'" text="2D/3D" variant="info" />
                  </div>
                  <ButtonIcon name="code" size="small" variant="ghost" @click="showAdvancedContent = true" />
                </div>
              </Tooltips>
              <div class="symbol-card">
                <GdtSymbol symbol="flatness" size="56px" />
                <span>{{ t('Flatness') }}</span>
              </div>
              <div class="symbol-card">
                <GdtSymbol symbol="circularity" size="56px" />
                <span>{{ t('Circularity') }}</span>
              </div>
              <div class="symbol-card">
                <GdtSymbol symbol="cylindricity" size="56px" />
                <span>{{ t('Cylindricity') }}</span>
              </div>
            </div>
          </div>

          <!-- Orientation Tolerances -->
          <div class="symbol-category">
            <h3>{{ t('Orientation Tolerances') }}</h3>
            <p class="category-desc">{{ t('Control angular relationships between features') }}</p>
            <div class="symbol-grid">
              <div class="symbol-card">
                <GdtSymbol symbol="perpendicularity" size="56px" />
                <span>{{ t('Perpendicularity') }}</span>
              </div>
              <div class="symbol-card">
                <GdtSymbol symbol="angularity" size="56px" />
                <span>{{ t('Angularity') }}</span>
              </div>
              <div class="symbol-card">
                <GdtSymbol symbol="parallelism" size="56px" />
                <span>{{ t('Parallelism') }}</span>
              </div>
            </div>
          </div>

          <!-- Location Tolerances -->
          <div class="symbol-category">
            <h3>{{ t('Location Tolerances') }}</h3>
            <p class="category-desc">{{ t('Control the location of features') }}</p>
            <div class="symbol-grid">
              <div class="symbol-card">
                <GdtSymbol symbol="position" size="56px" />
                <span>{{ t('Position') }}</span>
              </div>
              <div class="symbol-card">
                <GdtSymbol symbol="concentricity" size="56px" />
                <span>{{ t('Concentricity') }}</span>
              </div>
              <div class="symbol-card">
                <GdtSymbol symbol="symmetry" size="56px" />
                <span>{{ t('Symmetry') }}</span>
              </div>
            </div>
          </div>

          <!-- Profile Tolerances -->
          <div class="symbol-category">
            <h3>{{ t('Profile Tolerances') }}</h3>
            <p class="category-desc">{{ t('Control form, orientation, and location simultaneously') }}</p>
            <div class="symbol-grid">
              <div class="symbol-card">
                <GdtSymbol symbol="profileOfALine" size="56px" />
                <span>{{ t('Profile of a Line') }}</span>
              </div>
              <div class="symbol-card">
                <GdtSymbol symbol="profileOfASurface" size="56px" />
                <span>{{ t('Profile of a Surface') }}</span>
              </div>
            </div>
          </div>

          <!-- Runout Tolerances -->
          <div class="symbol-category">
            <h3>{{ t('Runout Tolerances') }}</h3>
            <p class="category-desc">{{ t('Control coaxial features on rotating parts') }}</p>
            <div class="symbol-grid">
              <div class="symbol-card">
                <GdtSymbol symbol="circularRunOut" size="56px" />
                <span>{{ t('Circular Runout') }}</span>
              </div>
              <div class="symbol-card">
                <GdtSymbol symbol="totalRunOut" size="56px" />
                <span>{{ t('Total Runout') }}</span>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>

      <!-- Benefits Tab -->
      <TabPanel id="benefits">
        <h2 id="benefits">{{ t('Benefits of Using GD&T') }}</h2>

        <div class="benefits-grid">
          <div class="benefit-card">
            <span class="material-icons benefit-icon">precision_manufacturing</span>
            <h3>{{ t('Improved Communication') }}</h3>
            <p>{{ t('Provides a clear, unambiguous language that is understood internationally across engineering disciplines.') }}</p>
          </div>

          <div class="benefit-card">
            <span class="material-icons benefit-icon">attach_money</span>
            <h3>{{ t('Cost Reduction') }}</h3>
            <p>{{ t('Increases tolerances where possible while ensuring functionality, reducing manufacturing and inspection costs.') }}</p>
          </div>

          <div class="benefit-card">
            <span class="material-icons benefit-icon">verified</span>
            <h3>{{ t('Quality Improvement') }}</h3>
            <p>{{ t('Ensures parts function properly by controlling features based on their functional requirements.')
              }}</p>
          </div>

          <div class="benefit-card">
            <span class="material-icons benefit-icon">speed</span>
            <h3>{{ t('Faster Production') }}</h3>
            <p>{{ t('Reduces ambiguity and rework, speeding up manufacturing and assembly processes.') }}</p>
          </div>

          <div class="benefit-card">
            <span class="material-icons benefit-icon">engineering</span>
            <h3>{{ t('Design Intent') }}</h3>
            <p>{{ t('Captures and communicates the designer\'s functional intent more effectively than coordinate tolerancing.') }}</p>
          </div>

          <div class="benefit-card">
            <span class="material-icons benefit-icon">public</span>
            <h3>{{ t('Global Standard') }}</h3>
            <p>{{ t('Enables global sourcing and manufacturing with consistent interpretation across suppliers.') }}</p>
          </div>
        </div>

        <div class="case-study">
          <h3>{{ t('Real-World Impact') }}</h3>
          <div class="impact-stats">
            <div class="stat">
              <span class="stat-value">57%</span>
              <span class="stat-label">{{ t('Average tolerance increase') }}</span>
            </div>
            <div class="stat">
              <span class="stat-value">25%</span>
              <span class="stat-label">{{ t('Reduction in scrap rate') }}</span>
            </div>
            <div class="stat">
              <span class="stat-value">40%</span>
              <span class="stat-label">{{ t('Faster inspection time') }}</span>
            </div>
          </div>
          <p class="case-study-note">
            {{ t('Based on industry studies comparing GD&T to traditional coordinate tolerancing in manufacturing environments.') }}
          </p>
        </div>
      </TabPanel>

      <!-- Examples Tab -->
      <TabPanel id="examples">
        <h2 id="examples">{{ t('Practical Examples') }}</h2>

        <CodeTabs :tabs="[
            { id: 'position', label: 'Position Tolerance' },
            { id: 'profile', label: 'Profile Tolerance' },
            { id: 'composite', label: 'Composite FCF' }
          ]">
          <template #position>
            <div class="example-section">
              <h3>{{ t('Example 1: Simple Position Tolerance') }}</h3>
              <div class="example-content">
                <div class="drawing-example">
                  <FeatureControlFrame symbol="position" tolerance="0.5" modifier="M" datums="A|B|C" />
                </div>
                <div class="example-explanation">
                  <h4>{{ t('Interpretation:') }}</h4>
                  <p>{{ t('The axis of the hole must lie within a cylindrical tolerance zone of 0.5mm diameter when the hole is at MMC, positioned relative to datums A, B, and C.') }}</p>
                  <ul>
                    <li>{{ t('Tolerance zone is cylindrical (not square)') }}</li>
                    <li>{{ t('Bonus tolerance available as hole gets larger') }}</li>
                    <li>{{ t('Clear datum reference frame established') }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="example-section">
              <h3>{{ t('Example 2: Flatness Control') }}</h3>
              <div class="example-content">
                <div class="drawing-example">
                  <FeatureControlFrame symbol="flatness" tolerance="0.1" />
                </div>
                <div class="example-explanation">
                  <h4>{{ t('Interpretation:') }}</h4>
                  <p>{{ t('The surface must lie between two parallel planes 0.1mm apart. No datum reference is needed for form controls.') }}</p>
                </div>
              </div>
            </div>
          </template>

          <template #composite>
            <div class="example-section">
              <h3>{{ t('Example 3: Composite Position') }}</h3>
              <div class="example-content">
                <div class="drawing-example">
                  <CompositeFeatureControlFrame upperSymbol="position" upperTolerance="0.5" upperModifier="M"
                    upperDatums="A|B|C" lowerSymbol="position" lowerTolerance="0.2" lowerModifier="M" lowerDatums="A" />
                </div>
                <div class="example-explanation">
                  <h4>{{ t('Interpretation:') }}</h4>
                  <p>{{ t('Upper segment: Controls location of pattern to datums A, B, C within 0.5mm at MMC') }}</p>
                  <p>{{ t('Lower segment: Controls feature-to-feature spacing within pattern, 0.2mm at MMC relative to datum A only') }}</p>
                </div>
              </div>
            </div>
          </template>
        </CodeTabs>
      </TabPanel>
    </Tabs>

    <!-- Next Steps -->
    <div class="next-steps">
      <h2>{{ t('Next Steps in Your GD&T Journey') }}</h2>
      <div class="steps-grid">
        <NuxtLink to="/blog/2/gdt-symbols-overview" class="step-card">
          <span class="material-icons">category</span>
          <h3>{{ t('Learn the Symbols') }}</h3>
          <p>{{ t('Deep dive into all 14 geometric characteristics') }}</p>
        </NuxtLink>
        <NuxtLink to="/blog/3/feature-control-frames" class="step-card">
          <span class="material-icons">view_in_ar</span>
          <h3>{{ t('Master Feature Control Frames') }}</h3>
          <p>{{ t('Understand how to read and create FCFs') }}</p>
        </NuxtLink>
        <NuxtLink to="/blog/4/datum-system" class="step-card">
          <span class="material-icons">anchor</span>
          <h3>{{ t('Understand Datums') }}</h3>
          <p>{{ t('Learn about datum features and reference frames') }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/styles/blog" as *;

/* Enhanced controls */
.content-controls {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--card);
  border-radius: 0.75rem;
  flex-wrap: wrap;
}

/* Symbols controls */
.symbols-controls {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

/* Enhanced component list */
.component-list-enhanced {
  display: grid;
  gap: 1.5rem;
  
  .component-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--background);
    border-radius: 0.5rem;
    transition: all 0.3s;
    
    &:hover {
      background: rgba(var(--accent-500-rgb), 0.05);
      transform: translateX(5px);
    }
    
    .material-icons {
      font-size: 2rem;
      color: var(--accent-500);
      flex-shrink: 0;
    }
    
    .component-tags {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
  }
}

/* Enhanced symbol card */
.symbol-card.enhanced {
  position: relative;
  padding: 1.5rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  .symbol-meta {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  .button-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
}

.blog-post {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text);
}

/* Introduction Card */
.post-intro {
  margin-bottom: 3rem;
}

.intro-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 10%) 0%, rgb(var(--accent-500-rgb) / 5%) 100%);
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 1rem;

  .intro-icon {
    font-size: 3rem;
    color: var(--accent-500);
    flex-shrink: 0;
  }

  .intro-text {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 500;
    color: var(--text);
  }
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid rgb(var(--accent-500-rgb) / 10%);
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgb(var(--accent-500-rgb) / 30%);
    border-radius: 2px;
  }
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: var(--accent-500);
    background: rgb(var(--accent-500-rgb) / 5%);
  }

  &.active {
    color: var(--accent-500);
    border-bottom-color: var(--accent-500);
  }

  .material-icons {
    font-size: 1.25rem;
  }
}

/* Content Sections */
.content-section {
  animation: fadeIn 0.3s ease-out;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-500);
    margin: 0 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    &::before {
      content: '';
      width: 4px;
      height: 1.5em;
      background: var(--accent-500);
      border-radius: 2px;
    }
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text);
    margin: 2rem 0 1rem;
  }

  h4 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text);
    margin: 1.5rem 0 0.75rem;
  }

  p {
    margin: 0 0 1.25rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Highlight Box */
.highlight-box {
  background: rgb(var(--accent-500-rgb) / 5%);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 2rem 0;

  h3 {
    margin-top: 0;
    color: var(--accent-500);
  }
}

.component-list {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;

    &:last-child {
      margin-bottom: 0;
    }

    .material-icons {
      color: var(--accent-500);
      font-size: 1.5rem;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    strong {
      display: block;
      color: var(--text);
      margin-bottom: 0.25rem;
    }

    p {
      margin: 0;
      font-size: 0.95rem;
      opacity: 0.8;
    }
  }
}

/* Comparison Grid */
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.comparison-card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 2px solid;

  &.traditional {
    background: rgb(239 68 68 / 5%);
    border-color: rgb(239 68 68 / 20%);
  }

  &.gdt {
    background: rgb(34 197 94 / 5%);
    border-color: rgb(34 197 94 / 20%);
  }

  h4 {
    margin-top: 0;
    font-size: 1.1rem;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
    }
  }
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 3rem;
  margin: 2rem 0;

  &::before {
    content: '';
    position: absolute;
    left: 1rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgb(var(--accent-500-rgb) / 20%);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: 2.5rem;

  &::before {
    content: '';
    position: absolute;
    left: -2.125rem;
    top: 0.5rem;
    width: 10px;
    height: 10px;
    background: var(--accent-500);
    border-radius: 50%;
    box-shadow: 0 0 0 4px var(--card);
  }
}

.timeline-marker {
  position: absolute;
  left: -6rem;
  top: 0;
  width: 3rem;
  text-align: right;
  font-weight: 700;
  color: var(--accent-500);
  font-size: 0.9rem;
}

.timeline-content {
  h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  p {
    margin: 0;
    opacity: 0.8;
  }
}

/* Standards Grid */
.standards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.standard-card {
  padding: 1.5rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;

  h4 {
    margin-top: 0;
    color: var(--accent-500);
  }

  .standard-region {
    font-size: 0.9rem;
    color: var(--accent-500);
    font-weight: 600;
    margin: -0.5rem 0 1rem;
  }

  p:last-child {
    margin-bottom: 0;
  }
}

/* Principle Cards */
.principle-card {
  background: rgb(var(--accent-500-rgb) / 3%);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  h3 {
    margin-top: 0;
    color: var(--accent-500);
  }
}

.example-box {
  background: var(--card);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;

  p {
    margin: 0;
  }
}

.modifier-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.modifier-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  .modifier-symbol {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-500);
    line-height: 1;
  }

  h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    opacity: 0.8;
  }
}

/* Datum Example */
.datum-example {
  background: var(--card);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.datum-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.datum-label {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.9rem;

  &.primary {
    background: rgb(var(--accent-500-rgb) / 20%);
    color: var(--accent-500);
  }

  &.secondary {
    background: rgb(var(--accent-500-rgb) / 15%);
    color: var(--accent-500);
  }

  &.tertiary {
    background: rgb(var(--accent-500-rgb) / 10%);
    color: var(--accent-500);
  }
}

.datum-arrow {
  color: var(--text);
  opacity: 0.5;
}

.datum-description {
  text-align: center;
  font-size: 0.95rem;
  opacity: 0.8;
  margin: 0;
}

/* Basic Dimension Example */
.basic-dim-example {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  .basic-dimension {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: 2px solid var(--accent-500);
    font-family: monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--accent-500);
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    opacity: 0.8;
  }
}

/* Symbol Categories */
.symbols-categories {
  margin: 2rem 0;
}

.symbol-category {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: rgb(var(--accent-500-rgb) / 3%);
  border-radius: 0.75rem;

  h3 {
    margin-top: 0;
    color: var(--accent-500);
  }

  .category-desc {
    font-size: 0.95rem;
    opacity: 0.8;
    margin-bottom: 1.5rem;
  }
}

.symbol-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.symbol-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.5rem;
  text-align: center;
  min-height: 140px;
  justify-content: center;

  span {
    font-size: 0.9rem;
    font-weight: 500;
  }
}

/* Benefits Grid */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.benefit-card {
  padding: 1.5rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  text-align: center;

  .benefit-icon {
    font-size: 3rem;
    color: var(--accent-500);
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 0.75rem;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    opacity: 0.8;
  }
}

/* Case Study */
.case-study {
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 10%) 0%, rgb(var(--accent-500-rgb) / 5%) 100%);
  border: 1px solid rgb(var(--accent-500-rgb) / 20%);
  border-radius: 1rem;
  padding: 2rem;
  margin: 2rem 0;

  h3 {
    margin-top: 0;
    text-align: center;
    color: var(--accent-500);
  }
}

.impact-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem 0;
  text-align: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.stat {
  .stat-value {
    display: block;
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--accent-500);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    display: block;
    font-size: 0.95rem;
    opacity: 0.8;
  }
}

.case-study-note {
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0;
}

/* Examples */
.example-section {
  background: rgb(var(--accent-500-rgb) / 3%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h3 {
    margin-top: 0;
    color: var(--accent-500);
  }
}

.example-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.drawing-example {
  background: var(--card);
  padding: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
}

.example-explanation {
  h4 {
    margin-top: 0;
  }

  ul {
    margin: 1rem 0 0;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
    }
  }
}

/* Next Steps */
.next-steps {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid rgb(var(--accent-500-rgb) / 10%);

  h2 {
    text-align: center;
    margin-bottom: 2rem;
  }
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.step-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: var(--card);
  border: 2px solid rgb(var(--accent-500-rgb) / 10%);
  border-radius: 0.75rem;
  text-decoration: none;
  color: var(--text);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent-500);
    box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
  }

  .material-icons {
    font-size: 3rem;
    color: var(--accent-500);
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 0.75rem;
    font-size: 1.2rem;
    color: var(--text);
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    opacity: 0.8;
  }
}
</style>
