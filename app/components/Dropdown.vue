<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface DropdownOption {
  value: any
  label: string
  sublabel?: string
  disabled?: boolean
  icon?: string
}

interface Props {
  modelValue: any
  options: DropdownOption[]
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
  clearable?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  disabled: false,
  searchable: false,
  clearable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [value: any]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref<HTMLDivElement>()

const selectedOption = computed(() => 
  props.options.find(opt => opt.value === props.modelValue)
)

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(query) ||
    (opt.sublabel && opt.sublabel.toLowerCase().includes(query))
  )
})

const selectOption = (option: DropdownOption) => {
  if (option.disabled || props.disabled) return
  
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
  searchQuery.value = ''
}

const clearSelection = () => {
  emit('update:modelValue', null)
  emit('change', null)
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
    if (isOpen.value && props.searchable) {
      /* Focus search input when opening */
      setTimeout(() => {
        const searchInput = dropdownRef.value?.querySelector('input')
        searchInput?.focus()
      }, 50)
    }
  }
}

/* Close dropdown when clicking outside */
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

/* Keyboard navigation */
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.disabled) return
  
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      toggleDropdown()
      break
    case 'Escape':
      isOpen.value = false
      searchQuery.value = ''
      break
  }
}
</script>

<template>
  <div 
    ref="dropdownRef"
    class="dropdown"
    :class="{ 
      'dropdown--open': isOpen,
      'dropdown--disabled': disabled 
    }"
  >
    <label v-if="label" class="dropdown-label">{{ label }}</label>
    
    <div 
      class="dropdown-trigger"
      @click="toggleDropdown"
      @keydown="handleKeyDown"
      tabindex="0"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="listbox"
      :aria-label="label || 'Select option'"
    >
      <span class="dropdown-value">
        <span v-if="selectedOption?.icon" class="material-icons dropdown-icon">
          {{ selectedOption.icon }}
        </span>
        <span class="dropdown-text">
          <span v-if="selectedOption">{{ selectedOption.label }}</span>
          <span v-else class="dropdown-placeholder">{{ placeholder }}</span>
        </span>
      </span>
      
      <div class="dropdown-actions">
        <button
          v-if="clearable && modelValue !== null && modelValue !== undefined"
          type="button"
          class="dropdown-clear"
          @click.stop="clearSelection"
          aria-label="Clear selection"
        >
          <span class="material-icons">close</span>
    </button>
        <span class="dropdown-caret material-icons">
          expand_more
        </span>
      </div>
    </div>

    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu" role="listbox">
        <div v-if="searchable" class="dropdown-search">
          <span class="material-icons">search</span>
          <input 
            v-model="searchQuery"
            type="text"
            class="dropdown-search-input"
            placeholder="Search..."
            @click.stop
          />
        </div>

        <div class="dropdown-options">
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            class="dropdown-option"
            :class="{ 
              'dropdown-option--selected': option.value === modelValue,
              'dropdown-option--disabled': option.disabled 
            }"
            @click="selectOption(option)"
            :disabled="option.disabled"
            role="option"
            :aria-selected="option.value === modelValue"
          >
            <span v-if="option.icon" class="material-icons dropdown-option-icon">
              {{ option.icon }}
            </span>
            <div class="dropdown-option-content">
              <span class="dropdown-option-label">{{ option.label }}</span>
              <span v-if="option.sublabel" class="dropdown-option-sublabel">{{ option.sublabel }}</span>
            </div>
            <span v-if="option.value === modelValue" class="material-icons dropdown-check">
              check
            </span>
          </button>

          <div v-if="filteredOptions.length === 0" class="dropdown-empty">
            No options found
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.dropdown {
  position: relative;
    width: 100%;

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
    }

.dropdown-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 3rem;
  padding: 0.75rem 1rem;
  background: var(--card);
  border: 2px solid rgba(var(--accent-500-rgb), 0.15);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(.dropdown--disabled &) {
    border-color: rgba(var(--accent-500-rgb), 0.3);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--accent-500);
    box-shadow: 0 0 0 4px rgba(var(--accent-500-rgb), 0.12);
  }

  .dropdown--open & {
    border-color: var(--accent-500);
    box-shadow: 0 0 0 4px rgba(var(--accent-500-rgb), 0.12);
  }
}

.dropdown-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.dropdown-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
}

.dropdown-icon {
    font-size: 1.25rem;
    color: var(--accent-500);
  }

.dropdown-placeholder {
  color: rgba(var(--text-rgb), 0.5);
  font-weight: 400;
}

.dropdown-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
}

.dropdown-clear {
    display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;

  .material-icons {
    font-size: 1.125rem;
    color: rgba(var(--text-rgb), 0.5);
  }

  &:hover {
    background: rgba(var(--text-rgb), 0.1);
    
    .material-icons {
      color: var(--text);
    }
    }
  }

.dropdown-caret {
    font-size: 1.25rem;
  color: rgba(0, 162, 211, 0.6);
    transition: transform 0.2s;

  .dropdown--open & {
  transform: rotate(180deg);
    color: rgba(0, 162, 211, 0.8);
  }
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  min-width: 200px;
  background: var(--main-bg);
  border: 1px solid rgba(var(--accent-500-rgb), 0.2);
  border-radius: 0.75rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  z-index: 100;
  overflow: hidden;
}

.dropdown-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(var(--accent-500-rgb), 0.1);

  .material-icons {
    font-size: 1.1rem;
    color: rgba(var(--text-rgb), 0.5);
  }
  }

.dropdown-search-input {
    flex: 1;
  background: transparent;
    border: none;
    color: var(--text);
    font-size: 0.9rem;
    outline: none;

    &::placeholder {
    color: rgba(var(--text-rgb), 0.5);
  }
}

.dropdown-options {
  max-height: 240px;
  overflow-y: auto;
  padding: 0.25rem;
  
  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--accent-500-rgb), 0.4) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(var(--accent-500-rgb), 0.35);
    border-radius: 999px;

    &:hover {
      background: rgba(var(--accent-500-rgb), 0.5);
    }
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(&--disabled) {
    background: rgba(var(--accent-500-rgb), 0.12);
  }

  &--selected {
    background: rgba(var(--accent-500-rgb), 0.18);
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    }
  }

.dropdown-option-icon {
  font-size: 1.25rem;
    color: var(--accent-500);
  flex-shrink: 0;
  }

.dropdown-option-content {
    flex: 1;
    min-width: 0;
}

.dropdown-option-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text);

  .dropdown-option--selected & {
    color: var(--accent-500);
    font-weight: 600;
  }
}

.dropdown-option-sublabel {
  display: block;
  font-size: 0.75rem;
  color: rgba(var(--text-rgb), 0.6);
  margin-top: 0.125rem;
}

.dropdown-check {
  font-size: 1rem;
  color: var(--accent-500);
  flex-shrink: 0;
  margin-left: auto;
}

.dropdown-empty {
  padding: 1.5rem 1rem;
  text-align: center;
  color: rgba(var(--text-rgb), 0.5);
  font-size: 0.875rem;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Mobile styles */
@media (max-width: 640px) {
  .dropdown-menu {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 1rem 1rem 0 0;
    max-height: 60vh;
  }

  .dropdown-options {
    max-height: 50vh;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }

  .dropdown-option {
    padding: 0.85rem 1rem;
  }
}
</style>