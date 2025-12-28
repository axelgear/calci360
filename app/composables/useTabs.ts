import type { InjectionKey, Ref } from 'vue'

export const TabsContextKey: InjectionKey<{
  activeTab: Ref<string>
  setActiveTab: (id: string) => void
}> = Symbol('tabs-context')
