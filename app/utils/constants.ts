/**
 * Global constants for the calculator app
 */

/**
 * Application metadata
 */
export const APP_NAME = 'Free Online Calculator'
export const APP_SHORT_NAME = 'Calculator'
export const APP_DESCRIPTION = 'Free online calculators for engineering, science, and mathematics. GD&T tools, unit converters, geometry calculators, and more.'
export const APP_VERSION = '1.0.0'

/**
 * API endpoints
 */
export const API_BASE_URL = process.env.NUXT_PUBLIC_API_URL || 'https://api.calculator.app'
export const API_TIMEOUT = 30000 // 30 seconds

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  THEME: 'calculator-theme',
  LOCALE: 'calculator-locale',
  RECENT_CALCULATIONS: 'calculator-recent',
  FAVORITES: 'calculator-favorites',
  PREFERENCES: 'calculator-preferences',
} as const

/**
 * Theme constants
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const

/**
 * Animation durations
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
} as const

/**
 * Common regex patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  NUMBER: /^-?\d+\.?\d*$/,
  INTEGER: /^-?\d+$/,
  POSITIVE_NUMBER: /^\d+\.?\d*$/,
  POSITIVE_INTEGER: /^\d+$/,
} as const

/**
 * Calculator categories
 */
export const CALCULATOR_CATEGORIES = [
  { id: 'engineering', name: 'Engineering', icon: 'engineering' },
  { id: 'geometry', name: 'Geometry', icon: 'category' },
  { id: 'conversion', name: 'Unit Conversion', icon: 'swap_horiz' },
  { id: 'finance', name: 'Finance', icon: 'attach_money' },
  { id: 'physics', name: 'Physics', icon: 'science' },
  { id: 'chemistry', name: 'Chemistry', icon: 'biotech' },
  { id: 'mathematics', name: 'Mathematics', icon: 'functions' },
  { id: 'statistics', name: 'Statistics', icon: 'bar_chart' },
] as const

/**
 * Common units
 */
export const UNITS = {
  LENGTH: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
  AREA: ['mm²', 'cm²', 'm²', 'km²', 'in²', 'ft²', 'yd²', 'mi²'],
  VOLUME: ['mm³', 'cm³', 'm³', 'L', 'mL', 'in³', 'ft³', 'gal', 'fl oz'],
  MASS: ['mg', 'g', 'kg', 't', 'oz', 'lb', 'ton'],
  TIME: ['ns', 'μs', 'ms', 's', 'min', 'h', 'day', 'week', 'month', 'year'],
  TEMPERATURE: ['°C', '°F', 'K', '°R'],
  ANGLE: ['rad', 'deg', 'grad', 'turn'],
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER: 'Server error. Please try again later.',
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SAVED: 'Successfully saved.',
  COPIED: 'Copied to clipboard.',
  CALCULATED: 'Calculation complete.',
  DELETED: 'Successfully deleted.',
  UPDATED: 'Successfully updated.',
} as const
