<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  /** Whether the tag is selected/checked */
  modelValue?: boolean
  /** Tag can be checked (toggleable) */
  checkable?: boolean
  /** Tag is disabled */
  disabled?: boolean
  /** Tag variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Tag size */
  size?: 'sm' | 'md' | 'lg'
  /** Removable tag */
  removable?: boolean
  /** Icon to show */
  icon?: string
  /** Make it a link */
  href?: string
  /** Editable tag */
  editable?: boolean
  /** Placeholder for editable tags */
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  checkable: false,
  removable: false,
  editable: false,
  placeholder: 'Enter tag...'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'remove': []
  'change': [value: string]
  'click': [event: MouseEvent]
}>()

// Local state for editable content
const editableContent = ref('')
const isEditing = ref(false)

// Computed states
const isChecked = computed({
  get: () => props.modelValue ?? false,
  set: (value: boolean) => emit('update:modelValue', value)
})

const tagClasses = computed(() => [
  'tag',
  `tag--${props.variant}`,
  `tag--${props.size}`,
  {
    'tag--checked': isChecked.value,
    'tag--checkable': props.checkable,
    'tag--disabled': props.disabled,
    'tag--removable': props.removable,
    'tag--editable': props.editable,
    'tag--link': !!props.href
  }
])

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.editable) return
  
  if (props.checkable && !props.href) {
    isChecked.value = !isChecked.value
  }
  
  emit('click', event)
}

const handleRemove = (event: MouseEvent) => {
  event.stopPropagation()
  emit('remove')
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLDivElement
  editableContent.value = target.textContent || ''
}

const handleEditComplete = () => {
  isEditing.value = false
  emit('change', editableContent.value)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleEditComplete()
  }
}

const startEdit = () => {
  if (props.editable && !props.disabled) {
    isEditing.value = true
  }
}
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    :href="href"
    :class="tagClasses"
    @click="handleClick"
    :tabindex="checkable || href || editable ? 0 : undefined"
    :role="checkable ? 'checkbox' : undefined"
    :aria-checked="checkable ? isChecked : undefined"
    :aria-disabled="disabled"
  >
    <span v-if="icon || (checkable && isChecked)" class="tag-icon">
      <span v-if="checkable && isChecked && !icon" class="material-icons">check</span>
      <span v-else-if="icon" class="material-icons">{{ icon }}</span>
    </span>
    
    <span 
      v-if="editable"
      class="tag-content"
      :contenteditable="!disabled"
      :data-placeholder="placeholder"
      @input="handleInput"
      @blur="handleEditComplete"
      @keydown="handleKeydown"
      @click.stop="startEdit"
    ><slot>{{ editableContent }}</slot></span>
    <span v-else class="tag-content">
      <slot />
    </span>
    
    <button
      v-if="removable && !disabled"
      class="tag-remove"
      @click="handleRemove"
      type="button"
      :aria-label="`Remove ${$slots.default?.()[0]?.children || 'tag'}`"
    >
      <span class="material-icons">close</span>
    </button>
  </component>
</template>

<style scoped lang="scss">
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25;
  text-decoration: none;
  color: var(--text);
  background-color: rgba(var(--text-rgb), 0.1);
  border: 1px solid transparent;
  transition: all 0.2s;
  cursor: default;
  position: relative;
  overflow: hidden;
  
  // Interactive states
  &--checkable,
  &--link {
    cursor: pointer;
    
    &:hover:not(.tag--disabled) {
      background-color: rgba(var(--text-rgb), 0.15);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    &:focus-visible {
      outline: 2px solid var(--accent-500);
      outline-offset: 2px;
    }
  }
  
  &--editable {
    cursor: text;
    
    .tag-content {
      min-width: 50px;
      outline: none;
      
      &:empty::before {
        content: attr(data-placeholder);
        color: rgba(var(--text-rgb), 0.5);
      }
    }
  }
  
  // Checked state
  &--checked {
    background-color: var(--accent-500);
    color: white;
    
    &:hover:not(.tag--disabled) {
      background-color: var(--accent-600);
    }
  }
  
  // Disabled state
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  // Size variants
  &--sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    gap: 0.25rem;
    
    .tag-icon .material-icons {
      font-size: 0.875rem;
    }
  }
  
  &--lg {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    gap: 0.5rem;
    
    .tag-icon .material-icons {
      font-size: 1.25rem;
    }
  }
  
  // Color variants
  &--primary {
    background-color: rgba(var(--accent-500-rgb), 0.15);
    color: var(--accent-500);
    
    &:hover:not(.tag--disabled) {
      background-color: rgba(var(--accent-500-rgb), 0.25);
    }
    
    &.tag--checked {
      background-color: var(--accent-500);
      color: white;
    }
  }
  
  &--success {
    background-color: rgba(16, 185, 129, 0.15);
    color: #10b981;
    
    &:hover:not(.tag--disabled) {
      background-color: rgba(16, 185, 129, 0.25);
    }
    
    &.tag--checked {
      background-color: #10b981;
      color: white;
    }
  }
  
  &--warning {
    background-color: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    
    &:hover:not(.tag--disabled) {
      background-color: rgba(245, 158, 11, 0.25);
    }
    
    &.tag--checked {
      background-color: #f59e0b;
      color: white;
    }
  }
  
  &--danger {
    background-color: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    
    &:hover:not(.tag--disabled) {
      background-color: rgba(239, 68, 68, 0.25);
    }
    
    &.tag--checked {
      background-color: #ef4444;
      color: white;
    }
  }
  
  &--info {
    background-color: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
    
    &:hover:not(.tag--disabled) {
      background-color: rgba(59, 130, 246, 0.25);
    }
    
    &.tag--checked {
      background-color: #3b82f6;
      color: white;
    }
  }
}

.tag-icon {
  display: flex;
  align-items: center;
  
  .material-icons {
    font-size: 1rem;
  }
}

.tag-content {
  flex: 1;
}

.tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  margin: -0.125rem -0.25rem -0.125rem 0.25rem;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  color: currentColor;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
  }
  
  .material-icons {
    font-size: 0.875rem;
  }
  
  .tag--checked & {
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

// Animation for check icon
.tag-icon {
  .material-icons {
    animation: scaleIn 0.2s ease-out;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
