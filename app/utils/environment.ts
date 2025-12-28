/**
 * Environment detection utilities
 */

/**
 * Check if code is running on client side
 */
export const isClient = process.client

/**
 * Check if code is running on server side
 */
export const isServer = process.server

/**
 * Check if running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Check if running in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production'

/**
 * Environment object for easy access
 */
export const environment = {
  client: isClient,
  server: isServer,
  development: isDevelopment,
  production: isProduction,
} as const

/**
 * Browser detection
 */
export const browser = {
  isChrome: isClient && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
  isFirefox: isClient && /Firefox/.test(navigator.userAgent),
  isSafari: isClient && /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
  isEdge: isClient && /Edg/.test(navigator.userAgent),
  isIE: isClient && /Trident/.test(navigator.userAgent),
} as const

/**
 * Operating system detection
 */
export const os = {
  isWindows: isClient && /Windows/.test(navigator.userAgent),
  isMac: isClient && /Mac/.test(navigator.userAgent),
  isLinux: isClient && /Linux/.test(navigator.userAgent),
  isAndroid: isClient && /Android/.test(navigator.userAgent),
  isIOS: isClient && /iPhone|iPad|iPod/.test(navigator.userAgent),
} as const

/**
 * Feature detection
 */
export const features = {
  hasTouch: isClient && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
  hasPointer: isClient && 'PointerEvent' in window,
  hasWebGL: isClient && (() => {
    try {
      const canvas = document.createElement('canvas')
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
    } catch (e) {
      return false
    }
  })(),
  hasWebP: isClient && (() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5
  })(),
  hasServiceWorker: isClient && 'serviceWorker' in navigator,
  hasNotification: isClient && 'Notification' in window,
  hasGeolocation: isClient && 'geolocation' in navigator,
  hasLocalStorage: isClient && (() => {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  })(),
  hasSessionStorage: isClient && (() => {
    try {
      const test = '__sessionStorage_test__'
      sessionStorage.setItem(test, test)
      sessionStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  })(),
} as const
