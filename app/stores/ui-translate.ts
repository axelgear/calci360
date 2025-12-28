import { defineStore } from 'pinia'
import { LANGUAGE_OPTIONS } from '@/utils/language-options'
import { translateWithGoogle } from '@/utils/translator'
import { useCookie } from '#app'

type TranslationMap = Record<string, Record<string, string>>
type InFlightMap = Record<string, Record<string, Promise<void>>>

export type ThemeType = 'light' | 'dark' | 'system'

export const useUiTranslateStore = defineStore('ui-translate', {
  state: () => ({
    language: 'en',
    translations: {} as TranslationMap,
    inFlight: {} as InFlightMap,
    loading: false,
    loadingCount: 0,
    hydrated: false,
    availableLanguages: LANGUAGE_OPTIONS,
    // Theme settings
    theme: 'system' as ThemeType,
    accentColor: '#00a2d3',
  }),
  actions: {
    ensureLanguageBuckets(lang: string) {
      if (!this.translations[lang]) this.translations[lang] = {}
      if (!this.inFlight[lang]) this.inFlight[lang] = {}
    },
    initFromCookie() {
      if (this.hydrated) return
      
      // Language cookie
      const langCookie = useCookie<string>('ui-lang', {
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      if (langCookie.value) this.language = langCookie.value
      
      // Theme cookie
      const themeCookie = useCookie<ThemeType>('ui-theme', {
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      if (themeCookie.value) this.theme = themeCookie.value
      
      // Accent color cookie
      const accentCookie = useCookie<string>('ui-accent', {
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      if (accentCookie.value) this.accentColor = accentCookie.value
      
      this.syncDocumentLang()
      this.applyTheme()
      this.hydrated = true
    },
    initLanguageFromCookie() {
      if (this.hydrated) return
      
      // Language cookie
      const langCookie = useCookie<string>('ui-lang', {
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      if (langCookie.value) this.language = langCookie.value
      
      // Theme is already initialized from cookies by plugins
      const themeCookie = useCookie<ThemeType>('ui-theme')
      if (themeCookie.value) this.theme = themeCookie.value
      
      const accentCookie = useCookie<string>('ui-accent')
      if (accentCookie.value) this.accentColor = accentCookie.value
      
      this.syncDocumentLang()
      this.hydrated = true
    },
    setLanguage(code: string) {
      this.language = code
      const langCookie = useCookie<string>('ui-lang', {
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      langCookie.value = code
      this.syncDocumentLang()
    },
    syncDocumentLang() {
      if (import.meta.client) document.documentElement.lang = this.language || 'en'
    },
    setTheme(theme: ThemeType) {
      this.theme = theme
      const themeCookie = useCookie<ThemeType>('ui-theme', {
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      themeCookie.value = theme
      this.applyTheme()
    },
    setAccentColor(color: string) {
      this.accentColor = color
      const accentCookie = useCookie<string>('ui-accent', {
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      accentCookie.value = color
      this.applyAccentColor()
    },
    applyTheme() {
      if (!import.meta.client || typeof document === 'undefined') return
      
      const html = document.documentElement
      let effectiveTheme: 'light' | 'dark' = 'light'
      
      if (this.theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
        // Use system preference
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        effectiveTheme = this.theme as 'light' | 'dark'
      }
      
      // Apply theme class
      html.classList.remove('light', 'dark')
      html.classList.add(effectiveTheme)
      
      // Listen for system theme changes if using system theme
      if (this.theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', (e) => {
          if (this.theme === 'system' && document.documentElement) {
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(e.matches ? 'dark' : 'light')
          }
        })
      }
    },
    applyAccentColor() {
      if (!import.meta.client || typeof document === 'undefined') return
      
      const root = document.documentElement
      if (!root) return
      
      // Set the main accent color
      root.style.setProperty('--accent-500', this.accentColor)
      
      // Convert hex to RGB for opacity usage
      const hex = this.accentColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      root.style.setProperty('--accent-500-rgb', `${r}, ${g}, ${b}`)
      
      // Also set legacy variables for compatibility
      root.style.setProperty('--accent-primary', this.accentColor)
      root.style.setProperty('--accent-primary-rgb', `${r}, ${g}, ${b}`)
    },
    t(text: string) {
      if (!text) return ''
      if (this.language === 'en') return text
      this.queueTranslation(text)
      return this.translations[this.language]?.[text] ?? text
    },
    async queueTranslation(text: string) {
      if (import.meta.server || this.language === 'en' || !text.trim()) return
      const lang = this.language
      this.ensureLanguageBuckets(lang)

      if (this.translations[lang]?.[text]) return
      if (this.inFlight[lang]?.[text]) {
        await this.inFlight[lang][text]
        return
      }

      const controller = new AbortController()
      const promise = this.translateAndStore(text, lang, controller.signal)
      if (this.inFlight[lang]) {
        this.inFlight[lang][text] = promise
      }
      await promise
    },
    async translateAndStore(text: string, lang: string, signal?: AbortSignal) {
      try {
        this.loading = true
        this.loadingCount += 1
        const translated = await translateWithGoogle(text, lang, this.availableLanguages, signal)
        if (this.translations[lang]) {
          this.translations[lang][text] = translated
        }
      } catch (err) {
        console.error('[ui-translate] failed to translate', err)
      } finally {
        this.loadingCount = Math.max(0, this.loadingCount - 1)
        if (this.loadingCount === 0) this.loading = false
        if (this.inFlight[lang]) {
          delete this.inFlight[lang][text]
        }
      }
    },
  },
})

