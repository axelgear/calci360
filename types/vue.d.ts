import type { DefineComponent } from 'vue'

declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  export interface GlobalComponents {
    // Register global components here if needed
    NuxtLink: typeof import('nuxt/dist/app/components/nuxt-link')['default']
    NuxtPage: typeof import('nuxt/dist/app/components/nuxt-page')['default']
    NuxtLayout: typeof import('nuxt/dist/app/components/nuxt-layout')['default']
    NuxtLoadingIndicator: typeof import('nuxt/dist/app/components/nuxt-loading-indicator')['default']
    ClientOnly: typeof import('nuxt/dist/app/components/client-only')['default']
  }

  export interface ComponentCustomProperties {
    // Add custom properties available in all components
    $formatNumber: (value: number, decimals?: number) => string
    $formatCurrency: (value: number, currency?: string) => string
  }
}

// Augment @vue/runtime-core
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    // Add runtime core custom properties
  }
}

export {}
