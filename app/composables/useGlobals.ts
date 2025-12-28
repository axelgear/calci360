/**
 * Global composables and utilities
 */
import { ref, computed, readonly, watchEffect, onUnmounted } from 'vue'

/**
 * Format a number with specified decimal places
 */
export const useFormatNumber = () => {
  const formatNumber = (value: number, decimals: number = 2): string => {
    return value.toFixed(decimals).replace(/\.?0+$/, '')
  }

  const formatWithCommas = (value: number, decimals: number = 2): string => {
    const formatted = formatNumber(value, decimals)
    const parts = formatted.split('.')
    if (parts[0]) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return parts.join('.')
  }

  const formatScientific = (value: number, significantFigures: number = 4): string => {
    return value.toExponential(significantFigures - 1)
  }

  return {
    formatNumber,
    formatWithCommas,
    formatScientific,
  }
}

/**
 * Format currency values
 */
export const useFormatCurrency = () => {
  const formatCurrency = (value: number, currency: string = 'USD', locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value)
  }

  return {
    formatCurrency,
  }
}

/**
 * Device detection utilities
 */
export const useDevice = () => {
  const isMobile = computed(() => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  })

  const isTablet = computed(() => {
    if (typeof window === 'undefined') return false
    return /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent)
  })

  const isDesktop = computed(() => !isMobile.value && !isTablet.value)

  const isTouchDevice = computed(() => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })

  return {
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isDesktop: readonly(isDesktop),
    isTouchDevice: readonly(isTouchDevice),
  }
}

/**
 * Clipboard utilities
 */
export const useClipboard = () => {
  const copy = async (text: string): Promise<boolean> => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      return false
    }
  }

  const paste = async (): Promise<string | null> => {
    if (!navigator.clipboard) return null
    
    try {
      const text = await navigator.clipboard.readText()
      return text
    } catch (err) {
      return null
    }
  }

  return {
    copy,
    paste,
  }
}

/**
 * Local storage with reactive state
 */
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const data = ref<T>(defaultValue)

  // Load from localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        data.value = JSON.parse(stored)
      } catch (e) {
        console.error(`Failed to parse localStorage key "${key}":`, e)
      }
    }
  }

  // Watch for changes and save
  watchEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data.value))
    }
  })

  const remove = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
      data.value = defaultValue
    }
  }

  return {
    data,
    remove,
  }
}

/**
 * Debounce function calls
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout | null = null

  const debouncedFn = (...args: Parameters<T>): void => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  onUnmounted(cancel)

  return {
    debouncedFn,
    cancel,
  }
}

/**
 * Throttle function calls
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 300
) => {
  let inThrottle = false

  const throttledFn = (...args: Parameters<T>): void => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }

  return throttledFn
}
