<script setup lang="ts">
import { ref } from 'vue'
import Tabs from '~/components/Tabs.vue'
import TabPanel from '~/components/TabPanel.vue'
import Timeline from '~/components/Timeline.vue'
import type { TimelineItem } from '~/components/Timeline.vue'

// Component categories
const componentCategories = [
  { id: 'form', label: 'Form Controls', icon: 'edit' },
  { id: 'display', label: 'Display', icon: 'visibility' },
  { id: 'feedback', label: 'Feedback', icon: 'feedback' },
  { id: 'navigation', label: 'Navigation', icon: 'navigation' },
  { id: 'layout', label: 'Layout', icon: 'dashboard' }
]

// Active component
const activeCategory = ref('form')

// Demo states
const toggleState = ref(false)
const checkboxState = ref(false)
const radioValue = ref('option1')
const sliderValue = ref(50)
const dropdownValue = ref('')
const dateValue = ref(new Date())
const currentPage = ref(1)
const tabValue = ref('tab1')
const capsuleValue = ref('medium')
const tagStates = ref({
  tag1: false,
  tag2: true,
  tag3: false
})
const editableTagValue = ref('Edit me')

// Timeline demo data
const timelineItems: TimelineItem[] = [
  {
    id: 1,
    date: new Date('2024-01-15'),
    title: 'Component Created',
    description: 'Initial component implementation',
    icon: 'code',
    color: '#10b981'
  },
  {
    id: 2,
    date: new Date('2024-02-01'),
    title: 'Tests Added',
    description: 'Unit tests and documentation',
    icon: 'check_circle',
    color: '#3b82f6'
  },
  {
    id: 3,
    date: new Date('2024-02-15'),
    title: 'Released',
    description: 'Component available in v1.0',
    icon: 'rocket_launch',
    color: '#f59e0b'
  }
]

// Tab demo data
const demoTabs = [
  { id: 'tab1', label: 'Overview', icon: 'info' },
  { id: 'tab2', label: 'Examples', icon: 'code', badge: 3 },
  { id: 'tab3', label: 'API', icon: 'api' },
  { id: 'tab4', label: 'Disabled', icon: 'block', disabled: true }
]

// Toast demo
const showToast = (type: string) => {
  // This would typically use a toast composable
  console.log(`Show ${type} toast`)
}

// Code examples
const codeExamples = {
  toggleSwitch: `<ToggleSwitch v-model="enabled" label="Enable feature" />`,
  checkbox: `<Checkbox v-model="checked" label="I agree to terms" />`,
  radioButton: `<RadioButton v-model="selected" name="options" value="option1" label="Option 1" />
<RadioButton v-model="selected" name="options" value="option2" label="Option 2" />`,
  slider: `<Slider v-model="value" :min="0" :max="100" :step="5" label="Volume" />`,
  dropdown: `<Dropdown v-model="selected" :options="options" placeholder="Select an option" />`,
  tabs: `<Tabs :tabs="tabs" v-model="activeTab">
  <TabPanel id="tab1">Content 1</TabPanel>
  <TabPanel id="tab2">Content 2</TabPanel>
</Tabs>`,
  timeline: `<!-- Default Timeline -->
<Timeline 
  :items="events" 
  date-format="relative"
  line-position="left"
  @item-click="handleClick"
/>

<!-- Minimal/Sticky Timeline -->
<Timeline 
  :items="events"
  variant="minimal"
  :sticky-dates="true"
>
  <template #item="{ item }">
    <div class="custom-card">
      {{ item.title }}
    </div>
  </template>
</Timeline>`,
  tag: `<!-- Basic -->
<Tag>Default</Tag>
<Tag variant="primary">Primary</Tag>

<!-- Interactive -->
<Tag v-model="selected" checkable>Toggle me</Tag>
<Tag removable @remove="handleRemove">Remove me</Tag>

<!-- With features -->
<Tag icon="star" href="/link">Link with icon</Tag>
<Tag editable @change="handleEdit">Editable</Tag>`,
  badge: `<Badge variant="success" size="lg">New</Badge>
<Badge variant="danger" dot>Notifications</Badge>`,
  tooltip: `<Tooltips content="Helpful information">
  <button>Hover me</button>
</Tooltips>`,
  toast: `// Using toast composable
const { showToast } = useToast()
showToast({
  title: 'Success!',
  message: 'Operation completed',
  type: 'success'
})`,
  pagination: `<Pagination 
  v-model="currentPage" 
  :total-pages="10" 
  :max-visible="5" 
/>`,
  dataTable: `<DataTable 
  :columns="columns" 
  :data="items" 
  sortable 
  searchable 
/>`,
  definitionBox: `<DefinitionBox 
  term="GD&T" 
  definition="Geometric Dimensioning and Tolerancing"
  icon="straighten"
/>`
}
</script>

<template>
  <div class="components-guide">
    <div class="container">
      <header class="guide-header">
        <h1>Component Library Guide</h1>
        <p>Comprehensive guide for all common UI components in the calculator app</p>
      </header>

      <!-- Main Tabs -->
      <Tabs :tabs="componentCategories" v-model="activeCategory" variant="pills" size="lg">
        <!-- Form Controls -->
        <TabPanel id="form">
          <div class="component-grid">
            <!-- Toggle Switch -->
            <div class="component-card">
              <h3>Toggle Switch</h3>
              <div class="component-demo">
                <ToggleSwitch v-model="toggleState" label="Enable notifications" />
                <div class="demo-state">State: {{ toggleState ? 'ON' : 'OFF' }}</div>
              </div>
              <div class="component-code">
                <CodeBlock 
                  :code="codeExamples.toggleSwitch" 
                  language="vue"
                  filename="ToggleSwitch.vue"
                  :wrap-lines="true"
                />
              </div>
            </div>

            <!-- Checkbox -->
            <div class="component-card">
              <h3>Checkbox</h3>
              <div class="component-demo">
                <Checkbox v-model="checkboxState" label="I agree to the terms" />
                <div class="demo-state">Checked: {{ checkboxState }}</div>
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.checkbox }}</code></pre>
              </div>
            </div>

            <!-- Radio Buttons -->
            <div class="component-card">
              <h3>Radio Buttons</h3>
              <div class="component-demo">
                <div class="radio-group">
                  <RadioButton v-model="radioValue" name="demo" value="option1" label="Option 1" />
                  <RadioButton v-model="radioValue" name="demo" value="option2" label="Option 2" />
                  <RadioButton v-model="radioValue" name="demo" value="option3" label="Option 3" />
                </div>
                <div class="demo-state">Selected: {{ radioValue }}</div>
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.radioButton }}</code></pre>
              </div>
            </div>

            <!-- Slider -->
            <div class="component-card">
              <h3>Slider</h3>
              <div class="component-demo">
                <Slider v-model="sliderValue" :min="0" :max="100" :step="5" label="Volume" show-value />
                <div class="demo-state">Value: {{ sliderValue }}</div>
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.slider }}</code></pre>
              </div>
            </div>

            <!-- Dropdown -->
            <div class="component-card">
              <h3>Dropdown</h3>
              <div class="component-demo">
                <Dropdown 
                  v-model="dropdownValue" 
                  :options="[
                    { value: 'opt1', label: 'Option 1' },
                    { value: 'opt2', label: 'Option 2' },
                    { value: 'opt3', label: 'Option 3' },
                    { value: 'opt4', label: 'Option 4' },
                    { value: 'opt5', label: 'Option 5' },
                    { value: 'opt6', label: 'Option 6' },
                    { value: 'opt7', label: 'Option 7' },
                    { value: 'opt8', label: 'Option 8' },
                    { value: 'opt9', label: 'Option 9' },
                    { value: 'opt10', label: 'Option 10' },
                  ]" 
                  placeholder="Select an option"
                />
                <div class="demo-state">Selected: {{ dropdownValue || 'None' }}</div>
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.dropdown }}</code></pre>
              </div>
            </div>

            <!-- DateTime -->
            <div class="component-card">
              <h3>DateTime Display</h3>
              <div class="component-demo">
                <div class="datetime-examples">
                  <DateTime :date="dateValue" format="full" />
                  <DateTime :date="dateValue" format="medium" show-time />
                  <DateTime :date="new Date()" format="relative" />
                  <DateTime :date="'2024-01-15'" format="short" />
                </div>
                <div class="demo-state">Current date: {{ dateValue.toLocaleString() }}</div>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Display Components -->
        <TabPanel id="display">
          <div class="component-grid">
            <!-- Tabs -->
            <div class="component-card full-width">
              <h3>Tabs</h3>
              <div class="component-demo">
                <div class="demo-section">
                  <h4>Default Tabs</h4>
                  <Tabs :tabs="demoTabs" v-model="tabValue">
                    <TabPanel id="tab1">
                      <p>This is the overview content. Tabs help organize content into logical sections.</p>
                    </TabPanel>
                    <TabPanel id="tab2">
                      <p>Examples section with badge showing count of 3 items.</p>
                    </TabPanel>
                    <TabPanel id="tab3">
                      <p>API documentation would go here.</p>
                    </TabPanel>
                  </Tabs>
                </div>

                <div class="demo-section">
                  <h4>Tab Variants</h4>
                  <div class="variants-grid">
                    <div>
                      <h5>Pills</h5>
                      <Tabs :tabs="demoTabs.slice(0, 3)" variant="pills" />
                    </div>
                    <div>
                      <h5>Underline</h5>
                      <Tabs :tabs="demoTabs.slice(0, 3)" variant="underline" />
                    </div>
                    <div>
                      <h5>Boxed</h5>
                      <Tabs :tabs="demoTabs.slice(0, 3)" variant="boxed" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.tabs }}</code></pre>
              </div>
            </div>

            <!-- Timeline -->
            <div class="component-card full-width">
              <h3>Timeline</h3>
              <div class="component-demo">
                <div class="demo-section">
                  <h4>Standard Timeline</h4>
                  <Timeline 
                    :items="timelineItems"
                    date-format="short"
                    line-position="left"
                  />
                </div>
                
                <div class="demo-section">
                  <h4>Minimal Timeline (Sticky Date Style)</h4>
                  <Timeline 
                    :items="timelineItems"
                    :date-format="(date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })"
                    variant="minimal"
                    :sticky-dates="true"
                  >
                    <template #item="{ item }">
                      <div class="timeline-card">
                        <div class="timeline-card-header">
                          <span class="material-icons" :style="{ color: item.color }">{{ item.icon }}</span>
                          <h5>{{ item.title }}</h5>
                        </div>
                        <p>{{ item.description }}</p>
                      </div>
                    </template>
                  </Timeline>
                </div>
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.timeline }}</code></pre>
              </div>
            </div>

            <!-- Tags -->
            <div class="component-card full-width">
              <h3>Tags</h3>
              <div class="component-demo">
                <div class="demo-section">
                  <h4>Basic Tags</h4>
                  <div class="tags-grid">
                    <Tag>Default Tag</Tag>
                    <Tag variant="primary">Primary</Tag>
                    <Tag variant="success">Success</Tag>
                    <Tag variant="warning">Warning</Tag>
                    <Tag variant="danger">Danger</Tag>
                    <Tag variant="info">Info</Tag>
                  </div>
                </div>
                
                <div class="demo-section">
                  <h4>Interactive Tags</h4>
                  <div class="tags-grid">
                    <Tag v-model="tagStates.tag1" checkable>Checkable</Tag>
                    <Tag v-model="tagStates.tag2" checkable variant="primary">Selected</Tag>
                    <Tag removable @remove="console.log('Removed')">Removable</Tag>
                    <Tag icon="star" variant="warning">With Icon</Tag>
                    <Tag href="#" variant="info">Link Tag</Tag>
                    <Tag disabled>Disabled</Tag>
                  </div>
                </div>
                
                <div class="demo-section">
                  <h4>Editable Tag</h4>
                  <Tag 
                    editable 
                    v-model:content="editableTagValue"
                    @change="console.log('Changed:', $event)"
                    placeholder="Type here..."
                  >{{ editableTagValue }}</Tag>
                </div>
                
                <div class="demo-section">
                  <h4>Tag Sizes</h4>
                  <div class="tags-grid">
                    <Tag size="sm" variant="primary">Small</Tag>
                    <Tag size="md" variant="primary">Medium</Tag>
                    <Tag size="lg" variant="primary">Large</Tag>
                  </div>
                </div>
              </div>
            </div>

            <!-- Badge -->
            <div class="component-card">
              <h3>Badge</h3>
              <div class="component-demo">
                <div class="badge-grid">
                  <Badge>Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info" size="lg">Large</Badge>
                  <Badge variant="primary" dot>With Dot</Badge>
                </div>
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.badge }}</code></pre>
              </div>
            </div>

            <!-- Definition Box -->
            <div class="component-card">
              <h3>Definition Box</h3>
              <div class="component-demo">
                <DefinitionBox 
                  term="Component" 
                  definition="A reusable piece of UI with its own logic and styling"
                  icon="widgets"
                />
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.definitionBox }}</code></pre>
              </div>
            </div>

            <!-- Content Section -->
            <div class="component-card">
              <h3>Content Section</h3>
              <div class="component-demo">
                <ContentSection title="Section Title" icon="article">
                  <p>This is a content section that helps organize page content with consistent styling.</p>
                </ContentSection>
              </div>
            </div>

            <!-- Data Table -->
            <div class="component-card full-width">
              <h3>Data Table</h3>
              <div class="component-demo">
                <DataTable 
                  :columns="[
                    { key: 'name', label: 'Name', sortable: true },
                    { key: 'type', label: 'Type' },
                    { key: 'size', label: 'Size', align: 'right' }
                  ]"
                  :data="[
                    { name: 'Button.vue', type: 'Component', size: '2.4 KB' },
                    { name: 'utils.ts', type: 'Utility', size: '5.1 KB' },
                    { name: 'index.css', type: 'Styles', size: '12.3 KB' }
                  ]"
                />
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Feedback Components -->
        <TabPanel id="feedback">
          <div class="component-grid">
            <!-- Tooltips -->
            <div class="component-card">
              <h3>Tooltips</h3>
              <div class="component-demo">
                <div class="tooltip-demo">
                  <Tooltips content="This is a helpful tooltip">
                    <button class="demo-button">Hover for tooltip</button>
                  </Tooltips>
                  <Tooltips content="Top positioned" position="top">
                    <button class="demo-button">Top</button>
                  </Tooltips>
                  <Tooltips content="Right positioned" position="right">
                    <button class="demo-button">Right</button>
                  </Tooltips>
                  <Tooltips content="Bottom positioned" position="bottom">
                    <button class="demo-button">Bottom</button>
                  </Tooltips>
                </div>
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.tooltip }}</code></pre>
              </div>
            </div>

            <!-- Toasts -->
            <div class="component-card">
              <h3>Toasts</h3>
              <div class="component-demo">
                <div class="toast-demo">
                  <button @click="showToast('success')" class="demo-button success">Success Toast</button>
                  <button @click="showToast('error')" class="demo-button danger">Error Toast</button>
                  <button @click="showToast('warning')" class="demo-button warning">Warning Toast</button>
                  <button @click="showToast('info')" class="demo-button info">Info Toast</button>
                </div>
                <div class="toast-preview">
                  <Toasts />
                </div>
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.toast }}</code></pre>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Navigation Components -->
        <TabPanel id="navigation">
          <div class="component-grid">
            <!-- Pagination -->
            <div class="component-card">
              <h3>Pagination</h3>
              <div class="component-demo">
                <Pagination 
                  v-model="currentPage" 
                  :total-pages="10" 
                  :max-visible="5"
                />
                <div class="demo-state">Current Page: {{ currentPage }}</div>
              </div>
              <div class="component-code">
                <pre><code>{{ codeExamples.pagination }}</code></pre>
              </div>
            </div>

            <!-- Button Icon -->
            <div class="component-card">
              <h3>Icon Buttons</h3>
              <div class="component-demo">
                <div class="button-grid">
                  <ButtonIcon name="edit" />
                  <ButtonIcon name="delete" />
                  <ButtonIcon name="save" />
                  <ButtonIcon name="share" />
                  <ButtonIcon name="settings" />
                </div>
              </div>
            </div>

            <!-- Capsule Slider -->
            <div class="component-card">
              <h3>Capsule Slider</h3>
              <div class="component-demo">
                <CapsuleSlider 
                  :options="[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' }
                  ]" 
                  v-model="capsuleValue"
                />
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Layout Components -->
        <TabPanel id="layout">
          <div class="component-grid">
            <div class="component-card full-width">
              <h3>Layout Helpers</h3>
              <p>Layout components help structure your application's UI consistently.</p>
              <ul>
                <li><strong>ContentSection</strong> - Organize content with headers and consistent spacing</li>
                <li><strong>Container</strong> - Responsive max-width container</li>
                <li><strong>Grid</strong> - Flexible grid system</li>
                <li><strong>Stack</strong> - Vertical or horizontal stacking with gaps</li>
              </ul>
            </div>
          </div>
        </TabPanel>
      </Tabs>

      <!-- Component Guidelines -->
      <section class="guidelines">
        <h2>Component Guidelines</h2>
        <div class="guideline-cards">
          <div class="guideline-card">
            <h3>Consistency</h3>
            <p>All components follow the same design patterns and use consistent props naming conventions.</p>
          </div>
          <div class="guideline-card">
            <h3>Accessibility</h3>
            <p>Components include proper ARIA attributes, keyboard navigation, and screen reader support.</p>
          </div>
          <div class="guideline-card">
            <h3>Theming</h3>
            <p>Components adapt to the current theme using CSS variables for colors and spacing.</p>
          </div>
          <div class="guideline-card">
            <h3>Responsiveness</h3>
            <p>All components are mobile-first and adapt gracefully to different screen sizes.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.components-guide {
  min-height: 100vh;
  padding: 2rem 0;
  background: var(--main-bg);
}

/* Using global .container class from global.scss */

.guide-header {
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

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.component-card {
  background: var(--card);
  border: 1px solid rgba(var(--text-rgb), 0.1);
  border-radius: 0.75rem;
  padding: 2rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--text);
  }
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text);
    opacity: 0.9;
  }
  
  h5 {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: var(--text);
    opacity: 0.8;
  }
}

.component-demo {
  margin-bottom: 2rem;
  
  .demo-state {
    margin-top: 1rem;
    padding: 0.75rem;
    background: rgba(var(--accent-500-rgb), 0.1);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-family: monospace;
    color: var(--accent-500);
  }
}

.component-code {
  pre {
    background: rgba(var(--text-rgb), 0.05);
    border: 1px solid rgba(var(--text-rgb), 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    overflow-x: auto;
    
    code {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.875rem;
      color: var(--text);
    }
  }
}

.demo-button {
  padding: 0.5rem 1rem;
  background: var(--accent-500);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--accent-500-rgb), 0.3);
  }
  
  &.success {
    background: #10b981;
  }
  
  &.danger {
    background: #ef4444;
  }
  
  &.warning {
    background: #f59e0b;
  }
  
  &.info {
    background: #3b82f6;
  }
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.datetime-examples {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.timeline-card {
  background: var(--card);
  border: 1px solid rgba(var(--text-rgb), 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  
  .timeline-card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
    
    .material-icons {
      font-size: 1.5rem;
    }
    
    h5 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text);
    opacity: 0.8;
  }
}

.tooltip-demo {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.toast-demo {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.button-grid {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.demo-section {
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.variants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.guidelines {
  margin-top: 4rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 2rem;
    text-align: center;
    color: var(--text);
  }
}

.guideline-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.guideline-card {
  background: var(--card);
  border: 1px solid rgba(var(--text-rgb), 0.1);
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--accent-500);
  }
  
  p {
    font-size: 0.875rem;
    color: var(--text);
    opacity: 0.8;
    line-height: 1.6;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .guide-header {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  .component-card {
    padding: 1.5rem;
  }
}
</style>
