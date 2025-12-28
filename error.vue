<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    message?: string
  }
}>()

const handleError = () => {
  clearError({ redirect: '/' })
}

// Set appropriate meta tags for error page
useHead({
  title: `Error ${props.error.statusCode}`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})
</script>

<template>
  <div class="error-page">
    <div class="error-container">
      <h1 class="error-code">{{ error.statusCode }}</h1>
      <h2 class="error-message">{{ error.statusMessage || 'An error occurred' }}</h2>
      <p v-if="error.message" class="error-details">{{ error.message }}</p>
      
      <div class="error-actions">
        <button class="btn-primary" @click="handleError">
          <span class="material-icons">home</span>
          Go to Homepage
        </button>
        <button class="btn-secondary" @click="$router.back()">
          <span class="material-icons">arrow_back</span>
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 5%) 0%, transparent 100%);
}

.error-container {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.error-code {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: var(--accent-500);
  margin: 0 0 1rem;
  font-family: 'Montserrat', sans-serif;
  line-height: 1;
  text-shadow: 0 4px 16px rgb(var(--accent-500-rgb) / 20%);
}

.error-message {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--text);
  margin: 0 0 1rem;
  font-weight: 600;
}

.error-details {
  color: var(--neutral);
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0 0 3rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  
  @include phone {
    flex-direction: column;
    align-items: stretch;
  }
}

button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  
  .material-icons {
    font-size: 1.25rem;
  }
  
  &.btn-primary {
    background: var(--accent-500);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgb(var(--accent-500-rgb) / 30%);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &.btn-secondary {
    background: var(--card);
    color: var(--text);
    border: 1px solid rgb(var(--accent-500-rgb) / 20%);
    
    &:hover {
      border-color: var(--accent-500);
      background: rgb(var(--accent-500-rgb) / 10%);
    }
  }
}
</style>
