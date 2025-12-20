<script setup lang="ts">
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

export interface DropdownOption {
  value: string
  label: string
  sublabel?: string
  icon?: string
}

const props = withDefaults(defineProps<{
  options: DropdownOption[]
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
  maxHeight?: string
  align?: 'left' | 'right'
  fullWidth?: boolean
}>(), {
  placeholder: 'Select...',
  searchable: false,
  searchPlaceholder: 'Search...',
  maxHeight: '320px',
  align: 'left',
  fullWidth: false,
})

const modelValue = defineModel<string>({ required: true })

const isOpen = ref(false)
const searchQuery = ref('')
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() => 
  props.options.find(opt => opt.value === modelValue.value)
)

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(query) ||
    opt.sublabel?.toLowerCase().includes(query)
  )
})

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
    nextTick(() => {
      const searchInput = dropdownRef.value?.querySelector('input')
      searchInput?.focus()
    })
  }
}

function select(value: string) {
  modelValue.value = value
  isOpen.value = false
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!triggerRef.value?.contains(target) && !dropdownRef.value?.contains(target)) {
    isOpen.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="dropdown" :class="{ open: isOpen, 'full-width': fullWidth }">
    <button 
      ref="triggerRef"
      type="button" 
      class="dropdown-trigger"
      @click="toggle"
    >
      <span v-if="selectedOption?.icon" class="material-icons trigger-icon">{{ selectedOption.icon }}</span>
      <span class="trigger-label">
        <span class="main-label">{{ selectedOption?.label || placeholder }}</span>
        <span v-if="selectedOption?.sublabel" class="sub-label">{{ selectedOption.sublabel }}</span>
      </span>
      <span class="material-icons caret">{{ isOpen ? 'expand_less' : 'expand_more' }}</span>
    </button>

    <Transition name="dropdown">
      <div 
        v-if="isOpen" 
        ref="dropdownRef"
        class="dropdown-panel"
        :class="[`align-${align}`]"
        :style="{ maxHeight }"
      >
        <div v-if="searchable" class="dropdown-search">
          <span class="material-icons">search</span>
          <input 
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            @click.stop
          />
        </div>

        <div class="dropdown-options">
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            type="button"
            class="dropdown-option"
            :class="{ active: option.value === modelValue }"
            @click="select(option.value)"
          >
            <span v-if="option.icon" class="material-icons option-icon">{{ option.icon }}</span>
            <span class="option-label">
              <span class="main-label">{{ option.label }}</span>
              <span v-if="option.sublabel" class="sub-label">{{ option.sublabel }}</span>
            </span>
            <span v-if="option.value === modelValue" class="material-icons check">check</span>
          </button>

          <div v-if="filteredOptions.length === 0" class="no-results">
            <span class="material-icons">search_off</span>
            <span>{{ t('No results found') }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-flex;

  &.full-width {
    width: 100%;

    .dropdown-trigger {
      width: 100%;
    }

    .dropdown-panel {
      width: 100%;
    }
  }

  &.open .dropdown-trigger {
    border-color: var(--accent-500);
    box-shadow: 0 0 0 3px rgb(var(--accent-500-rgb) / 15%);
  }
}

.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 0.5rem;
  color: var(--text);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    border-color: var(--accent-500);
  }

  .trigger-icon {
    font-size: 1.25rem;
    color: var(--accent-500);
  }

  .trigger-label {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;

    .main-label {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub-label {
      font-size: 0.8rem;
      color: var(--accent-500);
      font-weight: 600;
    }
  }

  .caret {
    font-size: 1.25rem;
    color: var(--neutral);
    transition: transform 0.2s;
  }
}

.dropdown.open .caret {
  transform: rotate(180deg);
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 0.35rem);
  z-index: 200;
  min-width: 100%;
  border: 1px solid rgb(var(--accent-500-rgb) / 25%);
  border-radius: 0.65rem;
  background: var(--main-bg);
  box-shadow:
    0 12px 32px rgb(0 0 0 / 20%),
    0 0 0 1px rgb(var(--accent-500-rgb) / 8%);
  backdrop-filter: blur(12px);
  overflow: hidden;

  &.align-left {
    left: 0;
  }

  &.align-right {
    right: 0;
  }
}

.dropdown-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid rgb(var(--accent-500-rgb) / 12%);
  background: var(--main-bg);

  .material-icons {
    font-size: 1.1rem;
    color: var(--neutral);
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--text);
    font-size: 0.9rem;
    outline: none;

    &::placeholder {
      color: var(--text);
      opacity: 0.5;
    }
  }
}

.dropdown-options {
  display: flex;
  flex-direction: column;
  max-height: inherit;
  overflow-y: auto;
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--accent-500-rgb) / 40%) transparent;

  /* Webkit scrollbar */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(var(--accent-500-rgb) / 35%);
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, var(--card) 92%, var(--main-bg) 8%);
    transition: background 0.2s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--accent-500-rgb) / 60%);
  }
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem;
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background: var(--hover-overlay);
  }

  &.active {
    background: rgb(var(--accent-500-rgb) / 10%);
    color: var(--accent-500);

    .main-label {
      font-weight: 600;
    }
  }

  .option-icon {
    font-size: 1.2rem;
    color: var(--neutral);
  }

  &.active .option-icon {
    color: var(--accent-500);
  }

  .option-label {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;

    .main-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub-label {
      font-size: 0.8rem;
      color: var(--neutral);
    }
  }

  &.active .option-label .sub-label {
    color: rgb(var(--accent-500-rgb) / 70%);
  }

  .check {
    font-size: 1.1rem;
    color: var(--accent-500);
  }
}

.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  color: var(--neutral);
  font-size: 0.9rem;

  .material-icons {
    font-size: 1.25rem;
    opacity: 0.6;
  }
}

/* Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>

