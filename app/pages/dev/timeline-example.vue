<script setup lang="ts">
import Timeline from '~/components/Timeline.vue'
import type { TimelineItem } from '~/components/Timeline.vue'
import { ref } from 'vue'

// Example 1: Project milestones timeline
const projectMilestones = ref<TimelineItem[]>([
  {
    id: 1,
    date: new Date('2024-01-15'),
    title: 'Project Kickoff',
    description: 'Initial planning and team formation',
    icon: 'flag',
    color: '#10b981',
    metadata: {
      team: 'Engineering',
      status: 'Completed'
    }
  },
  {
    id: 2,
    date: new Date('2024-02-20'),
    title: 'Design Phase Complete',
    description: 'All wireframes and mockups approved',
    icon: 'design_services',
    color: '#3b82f6',
    metadata: {
      team: 'Design',
      status: 'Completed'
    }
  },
  {
    id: 3,
    date: new Date('2024-03-10'),
    title: 'Alpha Release',
    description: 'First functional prototype delivered',
    icon: 'rocket_launch',
    color: '#f59e0b',
    metadata: {
      team: 'Development',
      status: 'In Progress'
    }
  },
  {
    id: 4,
    date: new Date('2024-04-01'),
    title: 'Beta Testing',
    description: 'User testing and feedback collection',
    icon: 'bug_report',
    color: '#8b5cf6',
    metadata: {
      team: 'QA',
      status: 'Upcoming'
    }
  }
])

// Example 2: Company history timeline
const companyHistory = ref<TimelineItem[]>([
  {
    id: 'founding',
    date: new Date('2010-06-15'),
    title: 'Company Founded',
    description: 'Started in a garage with 3 founders',
    icon: 'business',
    color: '#059669'
  },
  {
    id: 'series-a',
    date: new Date('2012-03-20'),
    title: 'Series A Funding',
    description: 'Raised $5M to expand operations',
    icon: 'attach_money',
    color: '#0891b2'
  },
  {
    id: 'product-launch',
    date: new Date('2013-09-01'),
    title: 'First Product Launch',
    description: 'Revolutionary product enters the market',
    icon: 'inventory',
    color: '#7c3aed'
  },
  {
    id: 'ipo',
    date: new Date('2018-11-10'),
    title: 'IPO',
    description: 'Company goes public on NASDAQ',
    icon: 'trending_up',
    color: '#dc2626'
  },
  {
    id: 'expansion',
    date: new Date('2020-02-15'),
    title: 'Global Expansion',
    description: 'Opened offices in 10 new countries',
    icon: 'public',
    color: '#0891b2'
  }
])

// Example 3: Learning path timeline
const learningPath = ref<TimelineItem[]>([
  {
    id: 'basics',
    date: 'Week 1',
    title: 'HTML & CSS Fundamentals',
    description: 'Learn the building blocks of web development',
    icon: 'code',
    metadata: {
      duration: '20 hours',
      difficulty: 'Beginner'
    }
  },
  {
    id: 'javascript',
    date: 'Week 2-3',
    title: 'JavaScript Essentials',
    description: 'Master the programming language of the web',
    icon: 'javascript',
    metadata: {
      duration: '40 hours',
      difficulty: 'Intermediate'
    }
  },
  {
    id: 'vue',
    date: 'Week 4-5',
    title: 'Vue.js Framework',
    description: 'Build reactive applications with Vue',
    icon: 'view_in_ar',
    metadata: {
      duration: '30 hours',
      difficulty: 'Intermediate'
    }
  }
])

const activeTab = ref('milestones')

const handleTimelineClick = (item: TimelineItem) => {
  console.log('Clicked timeline item:', item)
  // Handle navigation or actions here
}
</script>

<template>
  <div class="timeline-examples">
    <div class="container">
      <h1>Timeline Component Examples</h1>
      
      <!-- Tab Navigation -->
      <div class="tabs">
        <button 
          v-for="tab in ['milestones', 'history', 'learning', 'horizontal']" 
          :key="tab"
          @click="activeTab = tab"
          :class="{ active: activeTab === tab }"
          class="tab-button"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
        </button>
      </div>

      <!-- Example 1: Project Milestones -->
      <section v-show="activeTab === 'milestones'" class="example-section">
        <h2>Project Milestones Timeline</h2>
        <p>Track project progress with a visual timeline</p>
        
        <Timeline
          :items="projectMilestones"
          :group-by-date="false"
          line-position="left"
          :sticky-dates="false"
          @item-click="handleTimelineClick"
        >
          <template #item="{ item }">
            <div class="milestone-card" :style="{ borderColor: item.color }">
              <div class="milestone-header">
                <div class="milestone-icon" :style="{ backgroundColor: item.color }">
                  <span class="material-icons">{{ item.icon }}</span>
                </div>
                <div>
                  <h3>{{ item.title }}</h3>
                  <span class="date">{{ new Date(item.date).toLocaleDateString() }}</span>
                </div>
              </div>
              <p>{{ item.description }}</p>
              <div class="milestone-meta">
                <span class="badge" :style="{ backgroundColor: item.color + '20', color: item.color }">
                  {{ item.metadata?.team }}
                </span>
                <span class="status">{{ item.metadata?.status }}</span>
              </div>
            </div>
          </template>
        </Timeline>
      </section>

      <!-- Example 2: Company History -->
      <section v-show="activeTab === 'history'" class="example-section">
        <h2>Company History Timeline</h2>
        <p>Centered timeline showing company milestones</p>
        
        <Timeline
          :items="companyHistory"
          date-format="full"
          line-position="center"
          ball-size="32px"
          line-width="2px"
          @item-click="handleTimelineClick"
        />
      </section>

      <!-- Example 3: Learning Path -->
      <section v-show="activeTab === 'learning'" class="example-section">
        <h2>Learning Path Timeline</h2>
        <p>Educational journey with custom date format</p>
        
        <Timeline
          :items="learningPath"
          :group-by-date="false"
          line-color="#10b981"
          @item-click="handleTimelineClick"
        >
          <template #item="{ item }">
            <div class="learning-card">
              <div class="learning-header">
                <span class="material-icons">{{ item.icon }}</span>
                <span class="week">{{ item.date }}</span>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="learning-meta">
                <span>
                  <span class="material-icons">schedule</span>
                  {{ item.metadata?.duration }}
                </span>
                <span>
                  <span class="material-icons">signal_cellular_alt</span>
                  {{ item.metadata?.difficulty }}
                </span>
              </div>
            </div>
          </template>
        </Timeline>
      </section>

      <!-- Example 4: Horizontal Timeline -->
      <section v-show="activeTab === 'horizontal'" class="example-section">
        <h2>Horizontal Timeline</h2>
        <p>Scrollable horizontal timeline for space-efficient display</p>
        
        <Timeline
          :items="companyHistory"
          orientation="horizontal"
          date-format="short"
          :sticky-dates="false"
          @item-click="handleTimelineClick"
        />
      </section>

      <!-- Usage Code Example -->
      <section class="code-example">
        <h2>How to Use</h2>
        <pre><code>&lt;script setup lang="ts"&gt;
import Timeline from '~/components/Timeline.vue'

const timelineItems = [
  {
    id: 1,
    date: new Date('2024-01-15'),
    title: 'Event Title',
    description: 'Event description',
    icon: 'flag',
    color: '#3b82f6',
    metadata: {
      custom: 'data'
    }
  }
]
&lt;/script&gt;

&lt;template&gt;
  &lt;Timeline
    :items="timelineItems"
    date-format="relative"
    line-position="left"
    @item-click="handleClick"
  /&gt;
&lt;/template&gt;</code></pre>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.timeline-examples {
  min-height: 100vh;
  padding: 2rem 0;
}

/* Using global .container class from global.scss */

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text);
}

h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text);
}

p {
  color: var(--text);
  opacity: 0.8;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  border-bottom: 2px solid rgba(var(--text-rgb), 0.1);
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text);
  opacity: 0.7;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;

  &:hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
    color: var(--accent-500);

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent-500);
    }
  }
}

.example-section {
  margin-bottom: 4rem;
}

/* Milestone Card Styles */
.milestone-card {
  background: var(--card);
  border-left: 4px solid;
  padding: 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s;

  &:hover {
    transform: translateX(5px);
    box-shadow: var(--shadow-lg);
  }
}

.milestone-header {
  display: flex;
  gap: 1rem;
  align-items: start;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--text);
  }

  .date {
    font-size: 0.85rem;
    color: var(--text);
    opacity: 0.6;
  }
}

.milestone-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .material-icons {
    color: white;
    font-size: 24px;
  }
}

.milestone-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status {
  font-size: 0.85rem;
  color: var(--text);
  opacity: 0.7;
}

/* Learning Card Styles */
.learning-card {
  background: var(--card);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(var(--accent-500-rgb), 0.1);
  transition: all 0.3s;

  &:hover {
    border-color: #10b981;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1rem 0 0.5rem;
    color: var(--text);
  }

  p {
    margin: 0 0 1rem;
    font-size: 0.95rem;
  }
}

.learning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .material-icons {
    font-size: 2rem;
    color: #10b981;
  }

  .week {
    font-size: 0.85rem;
    font-weight: 600;
    color: #10b981;
  }
}

.learning-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: var(--text);
  opacity: 0.7;

  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .material-icons {
    font-size: 1rem;
  }
}

/* Code Example */
.code-example {
  background: var(--card);
  padding: 2rem;
  border-radius: 0.75rem;
  margin-top: 4rem;

  pre {
    background: rgba(var(--text-rgb), 0.05);
    padding: 1.5rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    
    code {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.9rem;
      color: var(--text);
    }
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .tabs {
    overflow-x: auto;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
  }

  .tab-button {
    padding: 0.75rem 1rem;
    white-space: nowrap;
  }
}
</style>
