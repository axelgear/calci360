/**
 * Global client-side plugin for calculator app
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Add global error handlers
  if (typeof window !== 'undefined') {
    // Prevent right-click in production
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => {
        // Allow right-click on input and textarea elements
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return
        }
        e.preventDefault()
      })
    }

    // Add smooth scroll polyfill for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
      // Smooth scroll polyfill would be loaded here if needed
      // import('smoothscroll-polyfill').then((module) => {
      //   module.polyfill()
      // })
    }

    // Add performance monitoring
    if ('PerformanceObserver' in window) {
      try {
        // Monitor Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            console.log('LCP:', lastEntry.startTime)
          }
        })
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

        // Monitor First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if ('processingStart' in entry) {
              console.log('FID:', entry.processingStart - entry.startTime)
            }
          })
        })
        fidObserver.observe({ type: 'first-input', buffered: true })
      } catch (e) {
        // PerformanceObserver not fully supported
      }
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        const modal = document.querySelector('[role="dialog"]')
        if (modal) {
          const closeButton = modal.querySelector('[aria-label="Close"]') as HTMLElement
          if (closeButton) {
            closeButton.click()
          }
        }
      }
    })

    // Add visibility change handler
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('Page is hidden')
      } else {
        console.log('Page is visible')
      }
    })

    // Add online/offline handlers
    window.addEventListener('online', () => {
      console.log('Back online')
    })

    window.addEventListener('offline', () => {
      console.log('Gone offline')
    })

    // Detect color scheme preference
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
      darkModeQuery.addEventListener('change', (e) => {
        console.log('Color scheme changed:', e.matches ? 'dark' : 'light')
      })
    }

    // Add beforeunload handler for unsaved changes
    window.addEventListener('beforeunload', (e) => {
      // Check if there are unsaved changes
      const hasUnsavedChanges = document.querySelector('[data-unsaved="true"]')
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    })
  }

  // Provide global utilities
  return {
    provide: {
      formatNumber: (value: number, decimals = 2) => {
        return value.toFixed(decimals).replace(/\.?0+$/, '')
      },
      formatCurrency: (value: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
        }).format(value)
      },
    }
  }
})
