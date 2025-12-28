<script setup lang="ts">
import { ref, computed, watch } from '#imports'
import { useUiTranslateStore, type ThemeType } from '@/stores/ui-translate'

const uiStore = useUiTranslateStore()

const themes: { value: ThemeType; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'system', label: 'System', icon: 'brightness_auto' }
]

const currentTheme = computed({
  get: () => uiStore.theme,
  set: (value: ThemeType) => uiStore.setTheme(value)
})

const accentColors = [
  { name: 'Calculator Blue', value: '#00a2d3' },
  { name: 'Pink', value: '#f06e8e' },
  { name: 'Purple', value: '#b044b0' },
  { name: 'Green', value: '#46a12f' },
  { name: 'Orange', value: '#f98d00' },
  { name: 'Cyan', value: '#199bb6' },
  { name: 'Red', value: '#dd1818' },
]

const customColor = ref(uiStore.accentColor)
const showColorPicker = ref(false)

watch(customColor, (color) => {
  uiStore.setAccentColor(color)
})

const selectAccentColor = (color: string) => {
  customColor.value = color
  uiStore.setAccentColor(color)
}
</script>

<template>
  <div class="theme-switcher">
    <div class="theme-section">
      <h3>
        <span class="material-icons">brightness_medium</span>
        Theme
      </h3>
      <div class="theme-options">
        <button
          v-for="theme in themes"
          :key="theme.value"
          class="theme-option"
          :class="{ active: currentTheme === theme.value }"
          @click="currentTheme = theme.value"
        >
          <span class="material-icons">{{ theme.icon }}</span>
          <span class="label">{{ theme.label }}</span>
        </button>
      </div>
    </div>

    <div class="color-section">
      <h3>
        <span class="material-icons">palette</span>
        Accent Color
      </h3>
      <div class="color-options">
        <button
          v-for="color in accentColors"
          :key="color.value"
          class="color-option"
          :class="{ active: customColor === color.value }"
          :style="{ backgroundColor: color.value }"
          :title="color.name"
          @click="selectAccentColor(color.value)"
        >
          <span v-if="customColor === color.value" class="material-icons">check</span>
        </button>
        <button
          class="color-option custom"
          :class="{ active: showColorPicker }"
          @click="showColorPicker = !showColorPicker"
        >
          <span class="material-icons">colorize</span>
        </button>
      </div>
      
      <div v-if="showColorPicker" class="color-picker-wrapper">
        <input
          v-model="customColor"
          type="color"
          class="color-picker"
        >
        <input
          v-model="customColor"
          type="text"
          class="color-input"
          placeholder="#00a2d3"
          pattern="^#[0-9A-Fa-f]{6}$"
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.theme-switcher {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

.theme-section,
.color-section {
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text);
    
    .material-icons {
      font-size: 1.25rem;
      color: var(--accent-500);
    }
  }
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--card);
  border: 2px solid transparent;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--hover-overlay);
  }
  
  &.active {
    border-color: var(--accent-500);
    background: rgba(var(--accent-500-rgb), 0.1);
  }
  
  .material-icons {
    font-size: 2rem;
    color: var(--accent-500);
  }
  
  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text);
  }
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-option {
  position: relative;
  width: 3rem;
  height: 3rem;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.active {
    border-color: var(--text);
    box-shadow: 0 0 0 3px rgba(var(--text-rgb), 0.2);
  }
  
  &.custom {
    background: var(--card);
    border: 2px solid rgba(var(--text-rgb), 0.2);
    
    &:hover {
      background: var(--hover-overlay);
    }
    
    .material-icons {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--text);
    }
  }
  
  .material-icons {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 1.25rem;
  }
}

.color-picker-wrapper {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: var(--card);
  border-radius: 0.5rem;
  
  .color-picker {
    width: 3rem;
    height: 3rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  
  .color-input {
    flex: 1;
    padding: 0.5rem 1rem;
    background: var(--main-bg);
    border: 1px solid rgba(var(--text-rgb), 0.2);
    border-radius: 0.25rem;
    color: var(--text);
    font-family: monospace;
    
    &:focus {
      outline: none;
      border-color: var(--accent-500);
    }
  }
}
</style>
