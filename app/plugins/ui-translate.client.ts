import { useUiTranslateStore } from '@/stores/ui-translate'

export default defineNuxtPlugin(() => {
  const store = useUiTranslateStore()
  store.initFromCookie()

  watch(
    () => store.language,
    () => {
      store.syncDocumentLang()
    },
    { immediate: true },
  )
})

