declare module '#app' {
  interface NuxtApp {
    // Add custom properties to NuxtApp
  }
  
  interface RuntimeConfig {
    // Add runtime config types
  }
}

declare module '#imports' {
  // Auto-imported utilities will be typed here
}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    // Add runtime config schema
  }
  
  interface PublicRuntimeConfig {
    // Add public runtime config
  }
}

// Module declarations for packages without types
declare module 'vue-virtual-scroller' {
  import type { DefineComponent } from 'vue'
  
  export const RecycleScroller: DefineComponent<any, any, any>
  export const DynamicScroller: DefineComponent<any, any, any>
  export const DynamicScrollerItem: DefineComponent<any, any, any>
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.json' {
  const content: any
  export default content
}

export {}
