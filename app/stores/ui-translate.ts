import { defineStore } from 'pinia'
import { LANGUAGE_OPTIONS } from '@/utils/language-options'
import { translateWithGoogle } from '@/utils/translator'

type TranslationMap = Record<string, Record<string, string>>
type InFlightMap = Record<string, Record<string, Promise<void>>>

export const useUiTranslateStore = defineStore('ui-translate', {
  state: () => ({
    language: 'en',
    translations: {} as TranslationMap,
    inFlight: {} as InFlightMap,
    loading: false,
    loadingCount: 0,
    hydrated: false,
    availableLanguages: LANGUAGE_OPTIONS,
  }),
  actions: {
    ensureLanguageBuckets(lang: string) {
      if (!this.translations[lang]) this.translations[lang] = {}
      if (!this.inFlight[lang]) this.inFlight[lang] = {}
    },
    initFromCookie() {
      if (this.hydrated) return
      const langCookie = useCookie<string>('ui-lang', {
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      if (langCookie.value) this.language = langCookie.value
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

      if (this.translations[lang][text]) return
      if (this.inFlight[lang][text]) {
        await this.inFlight[lang][text]
        return
      }

      const controller = new AbortController()
      const promise = this.translateAndStore(text, lang, controller.signal)
      this.inFlight[lang][text] = promise
      await promise
    },
    async translateAndStore(text: string, lang: string, signal?: AbortSignal) {
      try {
        this.loading = true
        this.loadingCount += 1
        const translated = await translateWithGoogle(text, lang, this.availableLanguages, signal)
        this.translations[lang][text] = translated
      } catch (err) {
        console.error('[ui-translate] failed to translate', err)
      } finally {
        this.loadingCount = Math.max(0, this.loadingCount - 1)
        if (this.loadingCount === 0) this.loading = false
        delete this.inFlight[lang][text]
      }
    },
  },
})

