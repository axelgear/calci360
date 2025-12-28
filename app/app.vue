<script setup lang="ts">
import { inject } from '@vercel/analytics'
import { useHead, onMounted } from '#imports'

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

// Initialize Vercel Analytics
onMounted(() => {
  inject()
  
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
:root {
  --accent-300: #ffdfe7;
  --accent-500: #00a2d3;
  --accent-500-rgb: 0 162 211;
  --hover-overlay: rgb(0 0 0 / 5%);
  --hover-overlay-light: rgb(255 255 255 / 15%);
  --card: rgb(255 255 255 / 10%);
  --ripple: var(--hover-overlay);
  --main-bg: white;
  --neutral: #797173;
  --text: black;
  background-color: var(--main-bg);

  @include dark {
    --hover-overlay: rgb(255 255 255 / 8%);
    --card: rgb(255 255 255 / 5%);
    --main-bg: #212121;
    --neutral: #e5e4e4;
    --text: white;
  }
}

*,
::before,
::after {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'liga';
}

html,
body {
  overscroll-behavior: none;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
}

body {
  margin: 0;
  padding: 0;
  font-size: 1rem;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Roboto Flex', Roboto, Inter, 'Segoe UI Variable Display', 'Segoe UI', Ubuntu,
    Cantarell, 'Noto Sans CJK SC', 'Noto Sans SC', 'Source Han Sans CN', 'Microsoft YaHei UI', 'Microsoft YaHei',
    system-ui, sans-serif;
  -webkit-tap-highlight-color: transparent;
  overflow-x: hidden;

  @include phone {
    font-size: 0.95rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    transition-duration: 0s !important;
    animation-duration: 0s !important;
  }
}

/* reset */
h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family:
    Montserrat,
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    sans-serif;
}

a {
  text-decoration: none;

  /* Minimum touch target for mobile accessibility */
  @include phone {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}

/* Override for inline links that shouldn't have min-height */
p a,
li a,
span a {
  @include phone {
    min-height: auto;
    display: inline;
  }
}

.nav-bg {
  position: sticky;
  width: 100%;
  height: 3rem;
  background-color: var(--accent-500);
  box-shadow: 0 0 1.5rem 0 rgb(var(--accent-500-rgb) / 30%);
}

/* .page-enter-active {
  transition: all 0.6s cubic-bezier(0.1, 0.9, 0.2, 1);
} */

.page-leave-active {
  transition: all 0.2s cubic-bezier(0.95, 0.05, 0.795, 0.035);
}

/* .page-enter-from {
  transform: translateY(8rem);
  opacity: 0;
} */

.page-leave-to {
  transform: translateY(-4rem);
  opacity: 0;
}

/* fallback */
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
</style>
