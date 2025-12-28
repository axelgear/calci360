export default defineNuxtPlugin((nuxtApp) => {
  // Apply theme class during SSR
  type ThemeType = 'light' | 'dark' | 'system'
  const themeCookie = useCookie<ThemeType>('ui-theme')
  const theme = themeCookie.value || 'light'
  
  // For SSR, we can't check system preference, so default to light for 'system'
  const effectiveTheme = theme === 'dark' ? 'dark' : 'light'
  
  // Add theme class to the HTML element via useHead
  useHead({
    htmlAttrs: {
      class: effectiveTheme === 'dark' ? 'dark' : ''
    }
  })
})
