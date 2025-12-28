export default defineNuxtPlugin(() => {
  // Apply theme immediately from cookie before hydration
  type ThemeType = 'light' | 'dark' | 'system'
  const themeCookie = useCookie<ThemeType>('ui-theme')
  const theme = themeCookie.value || 'light'
  
  let effectiveTheme: 'light' | 'dark' = 'light'
  
  if (theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } else if (theme === 'dark') {
    effectiveTheme = 'dark'
  }
  
  // Apply theme class immediately
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  // Apply accent color if set
  const accentCookie = useCookie<string>('ui-accent')
  if (accentCookie.value) {
    document.documentElement.style.setProperty('--accent-500', accentCookie.value)
    
    // Convert hex to RGB for opacity usage
    const hex = accentCookie.value.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    document.documentElement.style.setProperty('--accent-500-rgb', `${r}, ${g}, ${b}`)
    
    // Also set legacy variables
    document.documentElement.style.setProperty('--accent-primary', accentCookie.value)
    document.documentElement.style.setProperty('--accent-primary-rgb', `${r}, ${g}, ${b}`)
  }
})
