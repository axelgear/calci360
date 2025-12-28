<script setup lang="ts">
import { ref } from 'vue'
import CodeBlock from '~/components/CodeBlock.vue'
import InlineCode from '~/components/InlineCode.vue'
import CodeTabs from '~/components/CodeTabs.vue'
import type { CodeTab } from '~/components/CodeTabs.vue'

/* Example code snippets */
const vueExample = `<template>
  <div class="hello-world">
    <h1>{{ message }}</h1>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<${'script'} setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello World!')
const count = ref(0)

const increment = () => {
  count.value++
}
</${'script'}>

<style scoped>
.hello-world {
  text-align: center;
  padding: 2rem;
}
</style>`

const jsExample = `// Calculate factorial recursively
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Calculate factorial iteratively
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

console.log(factorial(5)); // 120
console.log(factorialIterative(5)); // 120`

const pythonExample = `# Calculate factorial using different methods
import math

def factorial_recursive(n):
    """Calculate factorial recursively"""
    if n <= 1:
        return 1
    return n * factorial_recursive(n - 1)

def factorial_iterative(n):
    """Calculate factorial iteratively"""
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# Using built-in math.factorial
print(f"Built-in: {math.factorial(5)}")
print(f"Recursive: {factorial_recursive(5)}")
print(f"Iterative: {factorial_iterative(5)}")`

const cssExample = `:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --text-color: #1f2937;
  --bg-color: #ffffff;
}

.button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.button:active {
  transform: translateY(0);
}`

/* Code tabs example */
const codeTabs = ref<CodeTab[]>([
  {
    id: 'vue',
    label: 'Component',
    language: 'vue',
    code: vueExample,
    filename: 'HelloWorld.vue'
  },
  {
    id: 'js',
    label: 'JavaScript',
    language: 'javascript',
    code: jsExample,
    filename: 'factorial.js'
  },
  {
    id: 'python',
    label: 'Python',
    language: 'python',
    code: pythonExample,
    filename: 'factorial.py'
  },
  {
    id: 'css',
    label: 'Styles',
    language: 'css',
    code: cssExample,
    filename: 'styles.css'
  }
])

const highlightedLines = [3, 4, 5, 16, 17, 18]

// Usage examples
const codeBlockUsage = `<CodeBlock 
  :code="yourCode" 
  language="javascript"
  filename="example.js"
  :show-line-numbers="true"
  :highlight-lines="[1, 2, 3]"
  :copyable="true"
  :collapsible="true"
  :start-collapsed="false"
  max-height="500px"
/>`

const codeTabsUsage = `<${'script'} setup>
const tabs = [
  {
    id: 'tab1',
    label: 'JavaScript',
    language: 'javascript',
    code: 'console.log("Hello")',
    filename: 'example.js'
  },
  // ... more tabs
]
</${'script'}>

<template>
  <CodeTabs :tabs="tabs" default-tab="tab1" />
</template>`

const inlineCodeUsage = `<!-- Basic inline code -->
<InlineCode>const x = 42</InlineCode>

<!-- Copyable inline code -->
<InlineCode :copyable="true">npm install package</InlineCode>`
</script>

<template>
  <div class="code-examples-page">
    <div class="container">
      <header class="page-header">
        <h1>Code Display Components</h1>
        <p>Beautiful code blocks with syntax highlighting, copy functionality, and more</p>
      </header>

      <!-- Basic CodeBlock -->
      <section class="example-section">
        <h2>Basic Code Block</h2>
        <p>Simple code display with syntax highlighting and copy button</p>
        
        <CodeBlock 
          :code="jsExample" 
          language="javascript"
          filename="example.js"
        />
      </section>

      <!-- CodeBlock with highlighted lines -->
      <section class="example-section">
        <h2>Code Block with Line Highlighting</h2>
        <p>Highlight specific lines to draw attention to important code</p>
        
        <CodeBlock 
          :code="vueExample" 
          language="vue"
          filename="HelloWorld.vue"
          :highlight-lines="highlightedLines"
        />
      </section>

      <!-- Collapsible CodeBlock -->
      <section class="example-section">
        <h2>Collapsible Code Block</h2>
        <p>Save space with collapsible code blocks</p>
        
        <CodeBlock 
          :code="pythonExample" 
          language="python"
          filename="factorial.py"
          :collapsible="true"
          :start-collapsed="true"
          max-height="300px"
        />
      </section>

      <!-- Code Tabs -->
      <section class="example-section">
        <h2>Code Tabs</h2>
        <p>Show multiple code examples in a tabbed interface</p>
        
        <CodeTabs 
          :tabs="codeTabs"
          default-tab="vue"
        />
      </section>

      <!-- Inline Code -->
      <section class="example-section">
        <h2>Inline Code</h2>
        <p>
          Use <InlineCode>npm install vue</InlineCode> to install Vue.js in your project.
          You can also make inline code copyable: <InlineCode :copyable="true">const PI = 3.14159</InlineCode>
        </p>
        
        <div class="inline-examples">
          <h3>Examples:</h3>
          <ul>
            <li>Import statement: <InlineCode :copyable="true">import { ref } from 'vue'</InlineCode></li>
            <li>Function call: <InlineCode>console.log('Hello World')</InlineCode></li>
            <li>CSS property: <InlineCode>display: flex</InlineCode></li>
            <li>Terminal command: <InlineCode :copyable="true">npm run dev</InlineCode></li>
          </ul>
        </div>
      </section>

      <!-- Usage Guide -->
      <section class="example-section">
        <h2>Usage Guide</h2>
        
        <h3>CodeBlock Component</h3>
        <CodeBlock 
          :code="codeBlockUsage" 
          language="vue"
        />

        <h3>CodeTabs Component</h3>
        <CodeBlock 
          :code="codeTabsUsage" 
          language="vue"
        />

        <h3>InlineCode Component</h3>
        <CodeBlock 
          :code="inlineCodeUsage" 
          language="vue"
        />
      </section>

      <!-- Features -->
      <section class="features-section">
        <h2>Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <span class="material-icons feature-icon">highlight</span>
            <h3>Syntax Highlighting</h3>
            <p>Beautiful syntax highlighting for multiple languages</p>
          </div>
          
          <div class="feature-card">
            <span class="material-icons feature-icon">content_copy</span>
            <h3>Copy to Clipboard</h3>
            <p>One-click copy functionality with visual feedback</p>
          </div>
          
          <div class="feature-card">
            <span class="material-icons feature-icon">format_list_numbered</span>
            <h3>Line Numbers</h3>
            <p>Optional line numbers for better code reference</p>
          </div>
          
          <div class="feature-card">
            <span class="material-icons feature-icon">unfold_less</span>
            <h3>Collapsible</h3>
            <p>Save space with collapsible code blocks</p>
          </div>
          
          <div class="feature-card">
            <span class="material-icons feature-icon">tab</span>
            <h3>Tabbed Interface</h3>
            <p>Show multiple examples in a clean tabbed layout</p>
          </div>
          
          <div class="feature-card">
            <span class="material-icons feature-icon">dark_mode</span>
            <h3>Dark Mode</h3>
            <p>Automatic dark mode support for better readability</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.code-examples-page {
  min-height: 100vh;
  padding: 2rem 0 4rem;
  background: var(--main-bg);
}

.example-section {
  margin-bottom: 4rem;

  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 2rem 0 1rem;
    color: var(--text);
  }

  > p {
    font-size: 1.125rem;
    color: rgba(var(--text-rgb), 0.8);
    margin-bottom: 2rem;
  }
}

.inline-examples {
  margin-top: 2rem;
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      padding: 0.75rem 0;
      font-size: 1rem;
      color: var(--text);
    }
  }
}

.features-section {
  margin-top: 6rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--text);
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--card);
  border: 1px solid rgba(var(--text-rgb), 0.1);
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: var(--accent-500);
  }

  .feature-icon {
    font-size: 3rem;
    color: var(--accent-500);
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  p {
    font-size: 0.875rem;
    color: rgba(var(--text-rgb), 0.7);
    line-height: 1.5;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }

  .example-section {
    h2 {
      font-size: 1.5rem;
    }

    > p {
      font-size: 1rem;
    }
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
