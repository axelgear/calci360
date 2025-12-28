<script setup lang="ts">
import { inject } from '@vercel/analytics'
import { useHead, onMounted } from '#imports'
import { useUiTranslateStore } from '@/stores/ui-translate'

// Get the host URL
const host = typeof window !== 'undefined' ? window.location.host : 'calculator.app'

// Set up head configuration with comprehensive meta tags
useHead({
  titleTemplate: (titleChunk: string | undefined) => {
    return titleChunk ? `${titleChunk} - Free Online Calculator` : 'Free Online Calculator - Engineering & Scientific Tools'
  },
  meta: [
    { charset: 'UTF-8' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=Edge,chrome=1' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'renderer', content: 'webkit' },
    { name: 'description', content: 'Free online calculators for engineering, science, and mathematics. GD&T tools, unit converters, geometry calculators, and more.' },
    { name: 'keywords', content: 'calculator,engineering,GD&T,geometric dimensioning,tolerancing,unit converter,geometry,mathematics,science,metrology' },
    // Apple-specific
    { name: 'apple-mobile-web-app-title', content: 'Calculator' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-touch-fullscreen', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'format-detection', content: 'email=no' },
    // Anti-transform
    { 'http-equiv': 'Cache-Control', content: 'no-siteapp' },
    { name: 'referrer', content: 'no-referrer' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Free Online Calculator' },
    { property: 'og:title', content: 'Free Online Calculator' },
    { property: 'og:description', content: 'Free online calculators for engineering, science, and mathematics.' },
    { property: 'og:image', content: `https://${host}/og-image.png` },
    { property: 'og:url', content: `https://${host}` },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: 'Free Online Calculator' },
    { name: 'twitter:title', content: 'Free Online Calculator' },
    { name: 'twitter:description', content: 'Free online calculators for engineering, science, and mathematics.' },
    { name: 'twitter:image', content: `https://${host}/og-image.png` },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/manifest.json' },
  ],
})

// Initialize UI store
const uiStore = useUiTranslateStore()

// Initialize Vercel Analytics and UI settings
onMounted(() => {
  inject()
  
  // Initialize language from cookies (theme is handled by plugins)
  uiStore.initLanguageFromCookie()
  
  // Log a welcome message in development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '%cFree Online Calculator%c\nPrecision tools for engineering and science!\n',
      'font-size: 24px; font-weight: bold; color: #00a2d3;',
      'color: #00a2d3;'
    )
  }
})

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
  })
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/global.scss";
@use "@/assets/styles/_mixins.scss" as *;

/* App-specific styles */
.nav-bg {
  position: sticky;
  width: 100%;
  height: 3rem;
  background-color: var(--accent-500);
  box-shadow: 0 0 1.5rem 0 rgba(var(--accent-500-rgb), 0.3);
}

/* Page transitions */
.page-leave-active {
  transition: all 0.2s cubic-bezier(0.95, 0.05, 0.795, 0.035);
}

.page-leave-to {
  transform: translateY(-4rem);
  opacity: 0;
}

/* Material Icons fallback */
@font-face {
  font-weight: 400;
  font-family: 'Material Icons Round';
  font-style: normal;
  font-display: block;
  src: url('https://fonts.gstatic.com/s/materialiconsround/v108/LDItaoyNOAY6Uewc665JcIzCKsKc_M9flwmPq_HTTw.woff2')
    format('woff2');
}

.material-icons {
  display: inline-block;
  font-weight: normal;
  font-size: 1.5rem;
  font-family: 'Material Icons Round';
  font-style: normal;
  line-height: 1;
  direction: ltr;
  letter-spacing: normal;
  white-space: nowrap;
  text-transform: none;
  word-wrap: normal;
  font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  user-select: none;
}

/* Mobile link adjustments */
a {
  @include phone {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}

/* Override for inline links */
p a,
li a,
span a {
  @include phone {
    min-height: auto;
    display: inline;
  }
}
</style>
