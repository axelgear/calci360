import type { ConverterConfig } from '../../types'
import { mass } from '../../base/mass'

/**
 * Mass/Weight Converter - Base unit for force, energy, density, etc.
 * Base unit: kilogram (kg)
 */

const M = mass

export const massConverter: ConverterConfig = {
  type: 'converter',
  name: 'Mass/Weight Converter',
  description: 'Convert between different mass and weight units including kilograms, pounds, ounces, and tons',
  category: 'Unit Conversion',
  icon: 'scale',
  keywords: ['mass', 'weight', 'kilogram', 'pound', 'ounce', 'ton', 'gram'],
  defaultFromUnit: 'kilogram',
  defaultToUnit: 'pound',
  precision: 6,
  showAllConversions: true,
  units: [
    /* Metric SI */
    { id: 'picogram', name: 'Picogram', symbol: 'pg', toBase: M.picogram },
    { id: 'nanogram', name: 'Nanogram', symbol: 'ng', toBase: M.nanogram },
    { id: 'microgram', name: 'Microgram', symbol: 'μg', toBase: M.microgram },
    { id: 'milligram', name: 'Milligram', symbol: 'mg', toBase: M.milligram },
    { id: 'centigram', name: 'Centigram', symbol: 'cg', toBase: M.centigram },
    { id: 'decigram', name: 'Decigram', symbol: 'dg', toBase: M.decigram },
    { id: 'gram', name: 'Gram', symbol: 'g', toBase: M.gram },
    { id: 'dekagram', name: 'Dekagram', symbol: 'dag', toBase: M.dekagram },
    { id: 'hectogram', name: 'Hectogram', symbol: 'hg', toBase: M.hectogram },
    { id: 'kilogram', name: 'Kilogram', symbol: 'kg', toBase: M.kilogram },
    { id: 'metric-ton', name: 'Metric Ton (Tonne)', symbol: 't', toBase: M['metric-ton'] },
    { id: 'gigagram', name: 'Gigagram (Kiloton)', symbol: 'Gg', toBase: M.gigagram },

    /* Imperial Avoirdupois */
    { id: 'grain', name: 'Grain', symbol: 'gr', toBase: M.grain },
    { id: 'dram', name: 'Dram', symbol: 'dr', toBase: M.dram },
    { id: 'ounce', name: 'Ounce', symbol: 'oz', toBase: M.ounce },
    { id: 'pound', name: 'Pound', symbol: 'lb', toBase: M.pound },
    { id: 'stone', name: 'Stone', symbol: 'st', toBase: M.stone },
    { id: 'quarter', name: 'Quarter', symbol: 'qr', toBase: M.quarter },
    { id: 'hundredweight', name: 'Hundredweight (US)', symbol: 'cwt', toBase: M.hundredweight },
    { id: 'hundredweight-uk', name: 'Hundredweight (UK)', symbol: 'cwt (UK)', toBase: M['hundredweight-uk'] },
    { id: 'short-ton', name: 'Short Ton (US)', symbol: 'ton (US)', toBase: M['short-ton'] },
    { id: 'long-ton', name: 'Long Ton (UK)', symbol: 'ton (UK)', toBase: M['long-ton'] },

    /* Troy */
    { id: 'troy-grain', name: 'Troy Grain', symbol: 'gr t', toBase: M['troy-grain'] },
    { id: 'troy-pennyweight', name: 'Pennyweight', symbol: 'dwt', toBase: M['troy-pennyweight'] },
    { id: 'troy-ounce', name: 'Troy Ounce', symbol: 'oz t', toBase: M['troy-ounce'] },
    { id: 'troy-pound', name: 'Troy Pound', symbol: 'lb t', toBase: M['troy-pound'] },

    /* Gems / Jewelry */
    { id: 'carat', name: 'Carat', symbol: 'ct', toBase: M.carat },
    { id: 'point', name: 'Point (gem)', symbol: 'pt', toBase: M.point },
    { id: 'momme', name: 'Momme', symbol: 'momme', toBase: M.momme },

    /* Atomic / Physics */
    { id: 'atomic-mass-unit', name: 'Atomic Mass Unit', symbol: 'u', toBase: M['atomic-mass-unit'] },
    { id: 'dalton', name: 'Dalton', symbol: 'Da', toBase: M.dalton },
    { id: 'electron-mass', name: 'Electron Mass', symbol: 'mₑ', toBase: M['electron-mass'] },
    { id: 'proton-mass', name: 'Proton Mass', symbol: 'mₚ', toBase: M['proton-mass'] },
    { id: 'planck-mass', name: 'Planck Mass', symbol: 'mₚₗ', toBase: M['planck-mass'] },

    /* Engineering */
    { id: 'slug', name: 'Slug', symbol: 'slug', toBase: M.slug },
    { id: 'kip', name: 'Kip', symbol: 'kip', toBase: M.kip },

    /* Historical / Regional */
    { id: 'chinese-liang', name: 'Liang (Tael)', symbol: '両', toBase: M['chinese-liang'] },
    { id: 'chinese-jin', name: 'Jin (Catty)', symbol: '斤', toBase: M['chinese-jin'] },
    { id: 'indian-tola', name: 'Tola', symbol: 'tola', toBase: M['indian-tola'] },

    /* Astronomical */
    { id: 'solar-mass', name: 'Solar Mass', symbol: 'M☉', toBase: M['solar-mass'] },
    { id: 'earth-mass', name: 'Earth Mass', symbol: 'M⊕', toBase: M['earth-mass'] },
  ],
}

