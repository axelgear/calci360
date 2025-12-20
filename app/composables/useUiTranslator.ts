import { storeToRefs } from 'pinia'
import { useUiTranslateStore } from '@/stores/ui-translate'

export function useUiTranslator() {
  const store = useUiTranslateStore()
  if (!store.hydrated) store.initFromCookie()

  const { language, availableLanguages, loading } = storeToRefs(store)

  const t = (text: string) => store.t(text)

  return {
    t,
    language,
    availableLanguages,
    setLanguage: store.setLanguage,
    translating: loading,
  }
}

