<script setup lang="ts">
import { inject } from '@vercel/analytics'

useHead({
  titleTemplate: '%s - Free Online Calculator',
})

onMounted(() => {
  inject()
})
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
