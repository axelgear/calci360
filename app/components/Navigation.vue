<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, useRoute } from '#imports'
import { useResizeObserver } from '@vueuse/core'
import { useUiTranslator } from '@/composables/useUiTranslator'
import { useUiTranslateStore } from '@/stores/ui-translate'

const scrolled = ref(false)
const uiStore = useUiTranslateStore()

function checkScroll() {
  scrolled.value = window.scrollY > 10
}

const route = useRoute()
const navigationBgStyle = ref('acrylic')
const navigationFgColor = ref('pink')
const hideLogo = ref(false)
const menuOpen = ref(false)

const routeNavigationBgStyle = computed(() => route.meta.navigationBgStyle as string | undefined)
const routeNavigationFgColor = computed(() => route.meta.navigationFgColor as string | undefined)
const routeHideLogo = computed(() => route.meta.hideLogo as boolean | undefined)
const { t, language, availableLanguages, setLanguage } = useUiTranslator()
const hydrated = ref(false)
const langOpen = ref(false)
const themeOpen = ref(false)
const currentLanguageLabel = computed(
  () => availableLanguages.value.find((item) => item.code === language.value)?.label || t('Language'),
)
const navRef = ref<HTMLElement | null>(null)
const rightRef = ref<HTMLElement | null>(null)
const compactMode = ref(false)

navigationBgStyle.value = routeNavigationBgStyle.value ?? 'acrylic'
navigationFgColor.value = routeNavigationFgColor.value ?? 'pink'
hideLogo.value = routeHideLogo.value ?? false

watch(routeNavigationBgStyle, (value) => {
  navigationBgStyle.value = value ?? 'acrylic'
})

watch(routeNavigationFgColor, (value) => {
  navigationFgColor.value = value ?? 'pink'
})

watch(routeHideLogo, (value) => {
  hideLogo.value = value ?? false
})

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function handleLanguageChange(code: string) {
  setLanguage(code)
  langOpen.value = false
}

function toggleLangDropdown() {
  langOpen.value = !langOpen.value
}

const onClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.lang-switcher')) langOpen.value = false
  if (!target.closest('.theme-switcher-trigger')) themeOpen.value = false
}

const toggleThemeDropdown = () => {
  themeOpen.value = !themeOpen.value
}

const onScroll = () => {
  checkScroll()
}

const recomputeLayout = () => {
  if (!navRef.value || !rightRef.value) return
  const navRect = navRef.value.getBoundingClientRect()
  const rightRect = rightRef.value.getBoundingClientRect()
  compactMode.value = rightRect.right + 8 > navRect.right
}

useResizeObserver(navRef, () => requestAnimationFrame(recomputeLayout))
useResizeObserver(rightRef, () => requestAnimationFrame(recomputeLayout))

const onResize = () => requestAnimationFrame(recomputeLayout)

onMounted(() => {
  hydrated.value = true
  checkScroll()
  document.addEventListener('click', onClickOutside)
  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', onResize)
  requestAnimationFrame(recomputeLayout)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})

watch(language, () => requestAnimationFrame(recomputeLayout))
watch(
  () => route.fullPath,
  () => requestAnimationFrame(recomputeLayout),
)
</script>

<template>
  <div ref="navRef" class="navigation" :class="{
      'progressive': navigationBgStyle === 'progressive',
      'font-white': navigationFgColor === 'white',
      'scrolled': scrolled,
      'compact': compactMode,
    }">
    <div class="bg" />

    <button class="menu-btn" type="button" aria-label="Toggle menu" @click="toggleMenu">
      <span class="material-icons">{{ menuOpen ? 'close' : 'menu' }}</span>
    </button>
    
    <div class="left">
      <Transition name="logo">
        <NuxtLink v-if="!hideLogo" to="/">
          <span class="material-icons">calculate</span>
          <span class="site-name">{{ t('Calculator') }}</span>
        </NuxtLink>
      </Transition>
    </div>



    <div ref="rightRef" class="right" :class="{ open: menuOpen }">
      <NuxtLink to="/">
        <span class="material-icons">home</span>
        {{ hydrated ? t('Home') : 'Home' }}
      </NuxtLink>
      <NuxtLink to="/calculator">
        <span class="material-icons">calculate</span>
        {{ hydrated ? t('Calculators') : 'Calculators' }}
      </NuxtLink>
      <NuxtLink to="/blog">
        <span class="material-icons">auto_stories</span>
        {{ hydrated ? t('Blog') : 'Blog' }}
      </NuxtLink>
      <NuxtLink to="/metrology">
        <span class="material-icons">menu_book</span>
        {{ hydrated ? t('SI Reference') : 'SI Reference' }}
      </NuxtLink>

      <div class="theme-switcher-trigger">
        <button class="theme-button" type="button" @click.stop="toggleThemeDropdown">
          <span class="material-icons">
            {{ uiStore.theme === 'light' ? 'light_mode' : uiStore.theme === 'dark' ? 'dark_mode' : 'brightness_auto' }}
          </span>
        </button>
        <Transition name="fade">
          <div v-if="themeOpen" class="theme-dropdown">
            <ThemeSwitcher />
          </div>
        </Transition>
      </div>

      <div class="lang-switcher">
        <button class="lang-trigger" type="button" @click.stop="toggleLangDropdown">
          <span class="material-icons">translate</span>
          <span class="lang-label">{{ currentLanguageLabel }}</span>
          <span class="material-icons caret">{{ langOpen ? 'expand_less' : 'expand_more' }}</span>
        </button>
        <Transition name="fade">
          <div v-if="langOpen" class="lang-dropdown">
            <div class="lang-options">
              <button
                v-for="lang in availableLanguages"
                :key="lang.code"
                type="button"
                class="lang-option"
                :class="{ active: lang.code === language }"
                @click="handleLanguageChange(lang.code)"
              >
                {{ lang.label }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$lr-padding: 1rem;

.logo-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.logo-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.logo-enter-active,
.logo-leave-active {
  transition: all 800ms cubic-bezier(0.75, 0, 0, 1);
}

.navigation {
  --nav-left-color: var(--accent-500);
  --nav-right-color: var(--neutral);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  width: 100%;
  height: 3rem;
  transition: box-shadow 200ms;

  &.font-white {
    --nav-left-color: white;
    --nav-right-color: white;
  }

  &.transparent {
    .bg {
      display: none;
    }
  }

  &.scrolled {
    box-shadow: 0 0 24px rgb(var(--accent-500-rgb) / 30%);
    background-color: var(--main-bg);
  }

  &.progressive .bg {
    mask-image: linear-gradient(black 60%, transparent);
    position: absolute;
    right: 0;
    left: 0;
    z-index: -1;
    height: 5rem;
    backdrop-filter: blur(20px);
  }

  .site-name {
    @include title-font;
    font-weight: 600;
    font-size: 1.5rem;

    @include phone {
      display: inline;
      font-size: 1.1rem;
    }
  }

  .left {
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    a {
      display: flex;
      flex-shrink: 0;
      gap: 0.25rem;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 $lr-padding;
      color: var(--nav-left-color);

      @include phone {
        gap: 0.4rem;
        padding: 0 0.75rem;
      }
    }
  }

  .menu-btn {
    display: none;
    align-items: center;
    justify-content: center;
    margin-right: 0.25rem;
    padding: 0.35rem;
    border: 1px solid transparent;
    border-radius: 0.5rem;
    background: transparent;
    color: var(--nav-left-color);
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s;

    &:hover {
      border-color: rgb(var(--accent-500-rgb) / 30%);
      background: var(--hover-overlay);
    }

    @media screen and (width <= 820px) {
      display: inline-flex;
    }

    .navigation.compact & {
      display: inline-flex;
    }
  }

  .right {
    @include title-font;
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 0.25rem;
    background: transparent;

    a {
      position: relative;
      display: flex;
      gap: 0.25rem;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 0.75rem;
      overflow: hidden;
      color: var(--nav-right-color);
      font-weight: 600;
      text-decoration: none;
      transition: color 0.6s;

      &::before {
        position: absolute;
        top: 0;
        z-index: -1;
        display: block;
        width: 0;
        height: 0.1875rem;
        background-color: var(--accent-500);
        border-radius: 0 0 9999rem 9999rem;
        transition: width 0.6s;
        content: '';
      }

      &.router-link-active {
        color: var(--accent-500);

        &::before {
          width: 1.5rem;
        }
      }
    }

    @media screen and (width <= 820px) {
      position: fixed;
      top: 3rem;
      right: 0;
      left: 0;
      flex-direction: column;
      align-items: stretch;
      gap: 0.25rem;
      padding: 0.75rem 1rem 1rem;
      background: var(--main-bg);
      box-shadow: 0 0.75rem 1.5rem rgb(0 0 0 / 15%);
      border-bottom: 1px solid rgb(var(--accent-500-rgb) / 20%);
      display: none;
      z-index: 99;

      a {
        justify-content: flex-start;
        height: auto;
        padding: 0.65rem 0.75rem;
        border-radius: 0.5rem;

        &::before {
          display: none;
        }

        &.router-link-active {
          background: var(--hover-overlay);
          color: var(--accent-500);
        }
      }

      &.open {
        display: flex;
      }
    }

    .navigation.compact & {
      position: fixed;
      top: 3rem;
      right: 0;
      left: 0;
      flex-direction: column;
      align-items: stretch;
      gap: 0.25rem;
      padding: 0.75rem 1rem 1rem;
      background: var(--main-bg);
      box-shadow: 0 0.75rem 1.5rem rgb(0 0 0 / 15%);
      border-bottom: 1px solid rgb(var(--accent-500-rgb) / 20%);
      display: none;
      z-index: 99;

      a {
        justify-content: flex-start;
        height: auto;
        padding: 0.65rem 0.75rem;
        border-radius: 0.5rem;

        &::before {
          display: none;
        }

        &.router-link-active {
          background: var(--hover-overlay);
          color: var(--accent-500);
        }
      }

      &.open {
        display: flex;
      }
    }
  }

  .theme-switcher-trigger {
    position: relative;
    height: 100%;
    
    .theme-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 0.75rem;
      border: none;
      background: transparent;
      color: var(--nav-right-color);
      cursor: pointer;
      transition: color 0.2s;
      
      &:hover {
        color: var(--accent-500);
      }
      
      &:focus-visible {
        outline: 2px solid var(--accent-500);
        outline-offset: 2px;
      }
    }
    
    .theme-dropdown {
      position: absolute;
      right: 0;
      top: calc(100% + 0.35rem);
      min-width: 320px;
      border: 1px solid rgb(var(--accent-500-rgb) / 30%);
      border-radius: 0.65rem;
      background: color-mix(in srgb, var(--card) 85%, var(--main-bg) 15%);
      box-shadow:
        0 12px 24px rgb(0 0 0 / 25%),
        0 0 0 1px rgb(var(--accent-500-rgb) / 12%);
      backdrop-filter: blur(10px);
      overflow: hidden;
      z-index: 110;
    }
    
    @media screen and (width <= 820px) {
      width: 100%;
      
      .theme-dropdown {
        right: auto;
        left: 0;
        width: calc(100% - 1.5rem);
      }
    }
    
    .navigation.compact & {
      width: 100%;
      
      .theme-dropdown {
        right: auto;
        left: 0;
        width: calc(100% - 1.5rem);
      }
    }
  }

  .lang-switcher {
    position: relative;
    height: 100%;

    .lang-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      height: 100%;
      padding: 0 0.75rem;
      border: none;
      border-radius: 0;
      background: transparent;
      color: var(--nav-right-color);
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: var(--accent-500);
      }

      &:focus-visible {
        outline: 2px solid var(--accent-500);
        outline-offset: 2px;
      }

      .caret {
        font-size: 1rem;
      }
    }

    .lang-dropdown {
      position: absolute;
      right: 0;
      top: calc(100% + 0.35rem);
      min-width: 11rem;
      max-height: 320px;
      border: 1px solid rgb(var(--accent-500-rgb) / 30%);
      border-radius: 0.65rem;
      background: color-mix(in srgb, var(--card) 85%, var(--main-bg) 15%);
      box-shadow:
        0 12px 24px rgb(0 0 0 / 25%),
        0 0 0 1px rgb(var(--accent-500-rgb) / 12%);
      backdrop-filter: blur(10px);
      overflow: hidden;
      z-index: 110;
    }

    .lang-options {
      display: flex;
      flex-direction: column;
      max-height: 320px;
      overflow: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--accent-500) transparent;
    }

    .lang-options::-webkit-scrollbar { width: 10px; }
    .lang-options::-webkit-scrollbar-thumb {
      background: rgb(var(--accent-500-rgb) / 45%);
      border-radius: 999px;
      border: 2px solid color-mix(in srgb, var(--card) 85%, var(--main-bg) 15%);
    }
    .lang-options::-webkit-scrollbar-thumb:hover {
      background: rgb(var(--accent-500-rgb) / 70%);
    }

    .lang-option {
      text-align: left;
      padding: 0.55rem 0.75rem;
      background: transparent;
      border: none;
      color: var(--text);
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.15s, color 0.15s;

      &.active {
        color: var(--accent-500);
        background: rgb(var(--accent-500-rgb) / 10%);
      }

      &:hover {
        background: var(--hover-overlay);
      }
    }

    @media screen and (width <= 820px) {
      width: 100%;
      padding: 0.2rem 0.75rem 0.6rem;

      .lang-dropdown {
        right: auto;
        left: 0;
        width: calc(100% - 1.5rem);
      }
    }

    .navigation.compact & {
      width: 100%;
      padding: 0.2rem 0.75rem 0.6rem;

      .lang-dropdown {
        right: auto;
        left: 0;
        width: calc(100% - 1.5rem);
      }
    }
  }
}
</style>
