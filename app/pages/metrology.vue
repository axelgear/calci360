<script setup lang="ts">
import type { TableColumn, TableRow } from '~/components/DataTable.vue'
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

definePageMeta({
  hideLogo: true,
})

useHead({
  title: 'Metrology & SI Units Reference',
})

useSeoMeta({
  title: 'Structural Framework of Global Metrology - SI Units & Fundamental Constants',
  ogTitle: 'Metrology & SI Units Reference',
  description: 'Comprehensive guide to the International System of Units (SI), fundamental constants, base units, and derived dimensions for science and engineering.',
  ogDescription: 'Learn about base units, fundamental constants, and derived dimensions in modern metrology.',
})

/* ========== TABLE DATA ========== */

/* Time Units Table */
const timeColumns: TableColumn[] = [
  { key: 'unit', label: 'Time Unit' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'relation', label: 'Relation to Second (s)' },
  { key: 'context', label: 'Origin/Context' },
]

const timeRows: TableRow[] = [
  { unit: 'Nanosecond', symbol: 'ns', relation: '10<sup>−9</sup> s', context: 'High-speed electronics' },
  { unit: 'Microsecond', symbol: 'μs', relation: '10<sup>−6</sup> s', context: 'Signal processing' },
  { unit: 'Millisecond', symbol: 'ms', relation: '0.001 s', context: 'Human reaction time' },
  { unit: 'Second', symbol: 's', relation: '1 s', context: 'SI base unit' },
  { unit: 'Minute', symbol: 'min', relation: '60 s', context: 'Sexagesimal system' },
  { unit: 'Hour', symbol: 'h', relation: '3,600 s', context: 'Standard workday division' },
  { unit: 'Day', symbol: 'd', relation: '86,400 s', context: "Earth's rotation (mean)" },
  { unit: 'Sidereal Day', symbol: '—', relation: '86,164.0905 s', context: "Earth's rotation relative to stars" },
  { unit: 'Week', symbol: '—', relation: '604,800 s', context: 'Calendar cycle' },
  { unit: 'Tropical Year', symbol: '—', relation: '31,556,925.2 s', context: 'Seasonal cycle' },
  { unit: 'Sidereal Year', symbol: '—', relation: '31,558,149.76 s', context: 'Orbital period relative to stars' },
  { unit: 'Shake', symbol: '—', relation: '10<sup>−8</sup> s', context: 'Nuclear physics (decay events)' },
  { unit: 'Jiffy', symbol: '—', relation: '0.01 s', context: 'Electronics/Computing cycles' },
]

/* Length Units Table */
const lengthColumns: TableColumn[] = [
  { key: 'unit', label: 'Length Unit' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'si', label: 'SI Equivalent (m)' },
  { key: 'field', label: 'Application Field' },
]

const lengthRows: TableRow[] = [
  { unit: 'Nanometer', symbol: 'nm', si: '10<sup>−9</sup> m', field: 'Nanotechnology/Optics' },
  { unit: 'Micrometer', symbol: 'μm', si: '10<sup>−6</sup> m', field: 'Manufacturing/Biology' },
  { unit: 'Millimeter', symbol: 'mm', si: '0.001 m', field: 'Mechanical engineering' },
  { unit: 'Centimeter', symbol: 'cm', si: '0.01 m', field: 'General measurement' },
  { unit: 'Meter', symbol: 'm', si: '1 m', field: 'SI Base unit' },
  { unit: 'Kilometer', symbol: 'km', si: '1,000 m', field: 'Infrastructure/Geography' },
  { unit: 'Inch', symbol: 'in', si: '0.0254 m', field: 'Manufacturing (US/UK)' },
  { unit: 'Foot', symbol: 'ft', si: '0.3048 m', field: 'Architecture/Civil' },
  { unit: 'Yard', symbol: 'yd', si: '0.9144 m', field: 'Textiles/Land measurement' },
  { unit: 'Mile', symbol: 'mi', si: '1,609.344 m', field: 'Transportation' },
  { unit: 'Nautical Mile', symbol: 'NM', si: '1,852 m', field: 'Aviation/Navigation' },
  { unit: 'Fathom', symbol: 'ftm', si: '1.8288 m', field: 'Maritime (depth)' },
  { unit: 'Astronomical Unit', symbol: 'au', si: '1.496 × 10<sup>11</sup> m', field: 'Solar system distances' },
  { unit: 'Light-year', symbol: 'ly', si: '9.461 × 10<sup>15</sup> m', field: 'Interstellar distances' },
  { unit: 'Parsec', symbol: 'pc', si: '3.086 × 10<sup>16</sup> m', field: 'Galactic astronomy' },
  { unit: 'Ångström', symbol: 'Å', si: '10<sup>−10</sup> m', field: 'Crystallography/Chemistry' },
  { unit: 'Fermi', symbol: 'fm', si: '10<sup>−15</sup> m', field: 'Nuclear physics' },
  { unit: 'Bohr radius', symbol: 'a₀', si: '5.292 × 10<sup>−11</sup> m', field: 'Atomic physics' },
]

/* Mass Units Table */
const massColumns: TableColumn[] = [
  { key: 'unit', label: 'Mass Unit' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'relation', label: 'Relation to kg' },
  { key: 'domain', label: 'Domain' },
]

const massRows: TableRow[] = [
  { unit: 'Microgram', symbol: 'μg', relation: '10<sup>−9</sup> kg', domain: 'Pharmacology' },
  { unit: 'Milligram', symbol: 'mg', relation: '10<sup>−6</sup> kg', domain: 'Chemistry' },
  { unit: 'Gram', symbol: 'g', relation: '0.001 kg', domain: 'Laboratory standard' },
  { unit: 'Kilogram', symbol: 'kg', relation: '1 kg', domain: 'SI base unit' },
  { unit: 'Metric Ton', symbol: 't', relation: '1,000 kg', domain: 'Heavy industry' },
  { unit: 'Pound (Avoirdupois)', symbol: 'lb', relation: '0.45359237 kg', domain: 'General commerce (US)' },
  { unit: 'Ounce', symbol: 'oz', relation: '0.0283495 kg', domain: 'Food/Postage' },
  { unit: 'Slug', symbol: 'slug', relation: '14.5939 kg', domain: 'Aerospace (USC)' },
  { unit: 'Stone', symbol: 'st', relation: '6.35029 kg', domain: 'Body weight (UK)' },
  { unit: 'Troy Ounce', symbol: 'oz t', relation: '0.0311035 kg', domain: 'Precious metals' },
  { unit: 'Grain', symbol: 'gr', relation: '6.48 × 10<sup>−5</sup> kg', domain: 'Ballistics/Jewelry' },
  { unit: 'Atomic Mass Unit', symbol: 'u', relation: '1.661 × 10<sup>−27</sup> kg', domain: 'Particle physics' },
  { unit: 'Carat', symbol: 'ct', relation: '0.0002 kg', domain: 'Gemstones' },
]

/* Electrical Units Table */
const electricalColumns: TableColumn[] = [
  { key: 'quantity', label: 'Quantity' },
  { key: 'name', label: 'Unit Name' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'si', label: 'SI Base Unit Equivalent' },
]

const electricalRows: TableRow[] = [
  { quantity: 'Current', name: 'ampere', symbol: 'A', si: 'A' },
  { quantity: 'Potential Difference', name: 'volt', symbol: 'V', si: 'kg·m²·s<sup>−3</sup>·A<sup>−1</sup>' },
  { quantity: 'Resistance', name: 'ohm', symbol: 'Ω', si: 'kg·m²·s<sup>−3</sup>·A<sup>−2</sup>' },
  { quantity: 'Capacitance', name: 'farad', symbol: 'F', si: 'kg<sup>−1</sup>·m<sup>−2</sup>·s<sup>4</sup>·A²' },
  { quantity: 'Inductance', name: 'henry', symbol: 'H', si: 'kg·m²·s<sup>−2</sup>·A<sup>−2</sup>' },
  { quantity: 'Charge', name: 'coulomb', symbol: 'C', si: 's·A' },
  { quantity: 'Conductance', name: 'siemens', symbol: 'S', si: 'kg<sup>−1</sup>·m<sup>−2</sup>·s³·A²' },
  { quantity: 'Magnetic Flux', name: 'weber', symbol: 'Wb', si: 'kg·m²·s<sup>−2</sup>·A<sup>−1</sup>' },
  { quantity: 'Magnetic Flux Density', name: 'tesla', symbol: 'T', si: 'kg·s<sup>−2</sup>·A<sup>−1</sup>' },
]

/* Temperature Scales Table */
const temperatureColumns: TableColumn[] = [
  { key: 'scale', label: 'Scale' },
  { key: 'unit', label: 'Reference Unit' },
  { key: 'conversion', label: 'Conversion from Kelvin' },
  { key: 'usage', label: 'Usage' },
]

const temperatureRows: TableRow[] = [
  { scale: 'Kelvin', unit: 'K', conversion: '—', usage: 'SI base unit' },
  { scale: 'Celsius', unit: '°C', conversion: 'T(K) − 273.15', usage: 'General engineering' },
  { scale: 'Fahrenheit', unit: '°F', conversion: 'T(K) × 1.8 − 459.67', usage: 'US industrial/domestic' },
  { scale: 'Rankine', unit: '°R', conversion: 'T(K) × 1.8', usage: 'Thermodynamics (US)' },
]

/* Molarity vs Molality Table */
const molarityColumns: TableColumn[] = [
  { key: 'feature', label: 'Feature' },
  { key: 'molarity', label: 'Molarity (M)' },
  { key: 'molality', label: 'Molality (m)' },
]

const molarityRows: TableRow[] = [
  { feature: 'Unit', molarity: 'mol/L', molality: 'mol/kg' },
  { feature: 'Denominator', molarity: 'Total volume of solution', molality: 'Mass of solvent only' },
  { feature: 'Temperature', molarity: 'Dependent', molality: 'Independent' },
  { feature: 'Best Usage', molarity: 'Laboratory titrations', molality: 'Physical chemistry research' },
]

/* Kinematics Table */
const kinematicsColumns: TableColumn[] = [
  { key: 'quantity', label: 'Quantity' },
  { key: 'si', label: 'SI Unit' },
  { key: 'formula', label: 'Formula' },
  { key: 'usc', label: 'USC/Other Unit' },
]

const kinematicsRows: TableRow[] = [
  { quantity: 'Velocity', si: 'm/s', formula: 'Δd / Δt', usc: 'ft/s or mph' },
  { quantity: 'Acceleration', si: 'm/s²', formula: 'Δv / Δt', usc: 'ft/s² or g' },
  { quantity: 'Force', si: 'Newton (N)', formula: 'm × a', usc: 'Pound-force (lbf)' },
  { quantity: 'Work/Energy', si: 'Joule (J)', formula: 'F × d', usc: 'Foot-pound (ft-lb)' },
  { quantity: 'Power', si: 'Watt (W)', formula: 'E / t', usc: 'Horsepower (hp)' },
]

/* Pressure Table */
const pressureColumns: TableColumn[] = [
  { key: 'unit', label: 'Unit' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'pascal', label: 'Pascal Equivalent (Pa)' },
  { key: 'context', label: 'Context' },
]

const pressureRows: TableRow[] = [
  { unit: 'Pascal', symbol: 'Pa', pascal: '1 Pa', context: 'SI derived unit' },
  { unit: 'Kilopascal', symbol: 'kPa', pascal: '1,000 Pa', context: 'Civil engineering loads' },
  { unit: 'Megapascal', symbol: 'MPa', pascal: '10<sup>6</sup> Pa', context: 'Material yield strength' },
  { unit: 'Bar', symbol: 'bar', pascal: '10<sup>5</sup> Pa', context: 'Fluid hydraulics' },
  { unit: 'Atmosphere', symbol: 'atm', pascal: '101,325 Pa', context: 'Atmospheric science' },
  { unit: 'PSI', symbol: 'lbf/in²', pascal: '6,894.76 Pa', context: 'Mechanical systems (US)' },
  { unit: 'Torr', symbol: 'Torr', pascal: '133.322 Pa', context: 'Vacuum systems' },
]

/* Torque Table */
const torqueColumns: TableColumn[] = [
  { key: 'unit', label: 'Torque Unit' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'si', label: 'SI Equivalent (N·m)' },
  { key: 'usage', label: 'Usage' },
]

const torqueRows: TableRow[] = [
  { unit: 'Newton-meter', symbol: 'N·m', si: '1 N·m', usage: 'SI standard' },
  { unit: 'Inch-pound', symbol: 'in·lbf', si: '0.1129848', usage: 'Fastener specifications' },
  { unit: 'Foot-pound', symbol: 'ft·lbf', si: '1.355818', usage: 'Automotive engines' },
  { unit: 'Dyne-centimeter', symbol: 'dyn·cm', si: '10<sup>−7</sup>', usage: 'Micro-mechanics' },
]

/* Fundamental Constants Table */
const constantsColumns: TableColumn[] = [
  { key: 'constant', label: 'Constant' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'value', label: 'Value', mono: true },
  { key: 'uncertainty', label: 'Rel. Uncertainty' },
]

const constantsRows: TableRow[] = [
  { constant: 'Speed of Light', symbol: '<em>c</em>', value: '299,792,458 m/s', uncertainty: 'Exact' },
  { constant: 'Planck Constant', symbol: '<em>h</em>', value: '6.62607015 × 10<sup>−34</sup> J·s', uncertainty: 'Exact' },
  { constant: 'Elementary Charge', symbol: '<em>e</em>', value: '1.602176634 × 10<sup>−19</sup> C', uncertainty: 'Exact' },
  { constant: 'Boltzmann Constant', symbol: '<em>k</em>', value: '1.380649 × 10<sup>−23</sup> J/K', uncertainty: 'Exact' },
  { constant: 'Avogadro Constant', symbol: 'N<sub>A</sub>', value: '6.02214076 × 10<sup>23</sup> mol<sup>−1</sup>', uncertainty: 'Exact' },
  { constant: 'Newton. Gravitation', symbol: '<em>G</em>', value: '6.67430(15) × 10<sup>−11</sup> m³/(kg·s²)', uncertainty: '2.2 × 10<sup>−5</sup>' },
  { constant: 'Fine-structure Const.', symbol: 'α', value: '7.2973525643 × 10<sup>−3</sup>', uncertainty: '1.5 × 10<sup>−10</sup>' },
  { constant: 'Rydberg Constant', symbol: 'R<sub>∞</sub>', value: '10,973,731.568157 m<sup>−1</sup>', uncertainty: '1.1 × 10<sup>−12</sup>' },
  { constant: 'Electron Mass', symbol: 'm<sub>e</sub>', value: '9.1093837139 × 10<sup>−31</sup> kg', uncertainty: '3.0 × 10<sup>−10</sup>' },
]

/* Mathematical Constants Table */
const mathConstantsColumns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'value', label: 'Value (Approx.)', mono: true },
  { key: 'property', label: 'Property' },
]

const mathConstantsRows: TableRow[] = [
  { name: 'Pi', symbol: 'π', value: '3.14159265358979...', property: 'Transcendental' },
  { name: "Euler's Number", symbol: 'e', value: '2.71828182845904...', property: 'Transcendental' },
  { name: 'Golden Ratio', symbol: 'φ', value: '1.61803398874989...', property: 'Algebraic' },
  { name: 'Square Root of 2', symbol: '√2', value: '1.41421356237309...', property: 'Irrational' },
  { name: 'Euler-Mascheroni', symbol: 'γ', value: '0.57721566490153...', property: 'Unknown rationality' },
]

/* Digital Storage Prefixes Table */
const digitalPrefixColumns: TableColumn[] = [
  { key: 'prefix', label: 'Prefix' },
  { key: 'siDecimal', label: 'SI (Decimal)' },
  { key: 'siSymbol', label: 'Symbol' },
  { key: 'iecBinary', label: 'IEC (Binary)' },
  { key: 'iecSymbol', label: 'Symbol' },
  { key: 'discrepancy', label: 'Discrepancy' },
]

const digitalPrefixRows: TableRow[] = [
  { prefix: '10³ / 2<sup>10</sup>', siDecimal: 'kilo', siSymbol: 'k', iecBinary: 'kibi', iecSymbol: 'Ki', discrepancy: '2.4%' },
  { prefix: '10⁶ / 2<sup>20</sup>', siDecimal: 'mega', siSymbol: 'M', iecBinary: 'mebi', iecSymbol: 'Mi', discrepancy: '4.9%' },
  { prefix: '10⁹ / 2<sup>30</sup>', siDecimal: 'giga', siSymbol: 'G', iecBinary: 'gibi', iecSymbol: 'Gi', discrepancy: '7.4%' },
  { prefix: '10<sup>12</sup> / 2<sup>40</sup>', siDecimal: 'tera', siSymbol: 'T', iecBinary: 'tebi', iecSymbol: 'Ti', discrepancy: '10.0%' },
  { prefix: '10<sup>15</sup> / 2<sup>50</sup>', siDecimal: 'peta', siSymbol: 'P', iecBinary: 'pebi', iecSymbol: 'Pi', discrepancy: '12.6%' },
]

/* Conversion Factors Table */
const conversionColumns: TableColumn[] = [
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'multiply', label: 'Multiply By' },
]

const conversionRows: TableRow[] = [
  { from: 'Inch (in)', to: 'Meter (m)', multiply: '0.0254 (Exact)' },
  { from: 'Foot (ft)', to: 'Meter (m)', multiply: '0.3048 (Exact)' },
  { from: 'Pound (lb)', to: 'Kilogram (kg)', multiply: '0.45359237 (Exact)' },
  { from: 'Gallon (US)', to: 'Liter (L)', multiply: '3.785412' },
  { from: 'Atmosphere (atm)', to: 'Pascal (Pa)', multiply: '101,325 (Exact)' },
  { from: 'Calorie (th.)', to: 'Joule (J)', multiply: '4.184 (Exact)' },
]

/* Base Units Data */
const baseUnits = [
  { icon: 'schedule', name: 'Second', symbol: 's', definition: 'Time' },
  { icon: 'straighten', name: 'Meter', symbol: 'm', definition: 'Length' },
  { icon: 'scale', name: 'Kilogram', symbol: 'kg', definition: 'Mass' },
  { icon: 'bolt', name: 'Ampere', symbol: 'A', definition: 'Electric Current' },
  { icon: 'thermostat', name: 'Kelvin', symbol: 'K', definition: 'Temperature' },
  { icon: 'science', name: 'Mole', symbol: 'mol', definition: 'Amount of Substance' },
  { icon: 'light_mode', name: 'Candela', symbol: 'cd', definition: 'Luminous Intensity' },
]

/* Table of Contents */
const tocItems = [
  { id: 'base-units', label: 'The Seven Base Units of SI' },
  { id: 'second', label: 'The Second: Time Measurement' },
  { id: 'meter', label: 'The Meter: Spatial Dimension' },
  { id: 'kilogram', label: 'The Kilogram: Mass via Planck Constant' },
  { id: 'ampere', label: 'The Ampere: Electrical Metrology' },
  { id: 'kelvin', label: 'The Kelvin: Thermal Dynamics' },
  { id: 'mole', label: 'The Mole: Chemical Quantification' },
  { id: 'candela', label: 'The Candela: Luminous Intensity' },
  { id: 'derived', label: 'Derived Dimensions & Engineering' },
  { id: 'constants', label: 'Fundamental Constants' },
  { id: 'information', label: 'Information Theory Units' },
  { id: 'radiation', label: 'Radiological Units' },
]

/* Orbit Visual Icons */
const orbitIcons = ['straighten', 'scale', 'schedule', 'thermostat', 'bolt', 'science', 'light_mode']
</script>

<template>
    <div class="metrology-page">
        <!-- Back Button -->
        <div class="page-appbar">
            <NuxtLink to="/" class="back">
                <span class="material-icons">arrow_back</span>
            </NuxtLink>
        </div>

        <article class="content">
            <!-- Hero Section -->
            <header class="hero">
                <div class="hero-content">
                    <span class="badge">{{ t('Reference Guide') }}</span>
                    <h1>{{ t('Structural and Theoretical Framework of Global Metrology') }}</h1>
                    <p class="subtitle">
                        {{ t('A Multi-Disciplinary Analysis of Base Units, Fundamental Constants, and Derived Dimensions') }}
                    </p>
                </div>
                <OrbitVisual :icons="orbitIcons" :size="200" :duration="90" />
            </header>

            <!-- Introduction -->
            <section class="intro">
                <p>
                    {{ t('The architecture of modern science and engineering is built upon a foundation of') }}
                    <strong>{{ t('standardized measurement') }}</strong>.
                    {{ t('This system, primarily the International System of Units (SI), facilitates a universal language of quantification that transcends linguistic and geographical barriers.') }}
                </p>
                <p>
                    {{ t('In 2019, the metrological community enacted a paradigm shift by redefining the SI base units in terms of') }}
                    <strong>{{ t('seven defining constants') }}</strong>{{ t(', ensuring that the units of measurement are linked to invariant properties of the universe rather than physical artifacts.') }}
                </p>
            </section>

            <!-- Table of Contents -->
            <nav class="toc">
                <h2><span class="material-icons">list</span> {{ t('Table of Contents') }}</h2>
                <ol>
                    <li v-for="item in tocItems" :key="item.id">
                        <a :href="`#${item.id}`">{{ t(item.label) }}</a>
                    </li>
                </ol>
            </nav>

            <!-- Base Units Section -->
            <ContentSection id="base-units" icon="foundation"
                :title="t('Seven Pillars of the International System of Units (SI)')">
                <p>
                    {{ t('The contemporary SI is structured around seven base units. These units are considered the fundamental building blocks from which all other quantities in physics, chemistry, and engineering are derived.') }}
                </p>
                <div class="base-units-grid">
                    <div v-for="unit in baseUnits" :key="unit.symbol" class="base-unit-card">
                        <span class="material-icons">{{ unit.icon }}</span>
                        <h3>{{ t(unit.name) }}</h3>
                        <p class="symbol">{{ unit.symbol }}</p>
                        <p class="definition">{{ t(unit.definition) }}</p>
                    </div>
                </div>
            </ContentSection>

            <!-- The Second -->
            <ContentSection id="second" icon="schedule" :title="t('The Second: The Fundamental Anchor of Time')">
                <p>
                    {{ t('In the hierarchy of units, the second (s) occupies a position of unique importance, as it is utilized in the definitions of most other base and derived units.') }}
                </p>
                <DefinitionBox :title="t('Official Definition')">
                    <p>
                        {{ t('The second is defined by taking the fixed numerical value of the cesium frequency, Δν') }}<sub>Cs</sub>,
                        {{ t('to be') }} <strong>9,192,631,770</strong> {{ t('when expressed in the unit Hz (s') }}<sup>−1</sup>).
                    </p>
                </DefinitionBox>
                <DataTable :columns="timeColumns" :rows="timeRows" hoverable />
                <InsightBox>
                    <p>
                        {{ t('A sidereal day is approximately 3 minutes and 56 seconds shorter than a mean solar day because the Earth moves along its orbit while rotating.') }}
                    </p>
                </InsightBox>
            </ContentSection>

            <!-- The Meter -->
            <ContentSection id="meter" icon="straighten" :title="t('The Meter: Defining the Spatial Dimension')">
                <DefinitionBox :title="t('Official Definition')">
                    <p>
                        {{ t('Since 1983, the meter has been defined as the distance traveled by light in a vacuum during a time interval of') }} <strong>1/299,792,458</strong> {{ t('of a second.') }}
                    </p>
                </DefinitionBox>
                <DataTable :columns="lengthColumns" :rows="lengthRows" hoverable />
                <InsightBox>
                    <p>
                        {{ t('The US Survey foot is defined as 1200/3937 meters, leading to a discrepancy of approximately two parts per million compared to the international foot.') }}
                    </p>
                </InsightBox>
            </ContentSection>

            <!-- The Kilogram -->
            <ContentSection id="kilogram" icon="scale" :title="t('The Kilogram: Redefining Mass via the Planck Constant')">
                <p>
                    {{ t('The kilogram (kg) is the only base unit whose name contains a prefix. It was historically defined by a physical artifact, the International Prototype of the Kilogram (IPK).') }}
                </p>
                <DefinitionBox :title="t('Official Definition (2019)')">
                    <p>
                        {{ t('The kilogram is now linked to the Planck constant (h), which is fixed at exactly') }}
                        <strong>6.62607015 × 10<sup>−34</sup> J·s</strong>.
                    </p>
                </DefinitionBox>
                <DataTable :columns="massColumns" :rows="massRows" hoverable />
                <InsightBox>
                    <p>{{ t('A slug is the mass that accelerates at 1 ft/s² when a force of 1 lbf is applied.') }}</p>
                </InsightBox>
            </ContentSection>

            <!-- The Ampere -->
            <ContentSection id="ampere" icon="bolt" :title="t('The Ampere and Electrical Metrology')">
                <DefinitionBox :title="t('Official Definition (2019)')">
                    <p>
                        {{ t('The ampere (A) is defined by the elementary charge (e), fixed at') }}
                        <strong>1.602176634 × 10<sup>−19</sup></strong> {{ t('coulombs (C).') }}
                    </p>
                </DefinitionBox>
                <DataTable :columns="electricalColumns" :rows="electricalRows" hoverable />
                <InsightBox :title="t('Third-Order Insight')">
                    <p>
                        {{ t('Electrical metrology relies on the Von Klitzing constant (R') }}<sub>K</sub> = h/e²) {{ t('and the Josephson constant (K') }}<sub>J</sub> = 2e/h) {{ t('for the realization of the ohm and the volt.') }}
                    </p>
                </InsightBox>
            </ContentSection>

            <!-- The Kelvin -->
            <ContentSection id="kelvin" icon="thermostat"
                :title="t('The Kelvin: Thermal Dynamics and the Boltzmann Constant')">
                <DefinitionBox :title="t('Official Definition (2019)')">
                    <p>
                        {{ t('The kelvin (K) is linked to the Boltzmann constant (k), fixed at') }}
                        <strong>1.380649 × 10<sup>−23</sup> J/K</strong>.
                    </p>
                </DefinitionBox>
                <DataTable :columns="temperatureColumns" :rows="temperatureRows" hoverable />
            </ContentSection>

            <!-- The Mole -->
            <ContentSection id="mole" icon="science" :title="t('The Mole: Quantification in Chemistry')">
                <DefinitionBox :title="t('Official Definition (2019)')">
                    <p>
                        {{ t('The mole (mol) is defined as exactly') }} <strong>6.02214076 × 10<sup>23</sup></strong> {{ t('elementary entities.') }}
                    </p>
                </DefinitionBox>
                <p>
                    {{ t('In chemical engineering, the mole allows for the direct translation of atomic ratios (stoichiometry) into measurable quantities of mass and volume.') }}
                </p>
                <h3>{{ t('Molarity vs. Molality') }}</h3>
                <DataTable :columns="molarityColumns" :rows="molarityRows" hoverable />
            </ContentSection>

            <!-- The Candela -->
            <ContentSection id="candela" icon="light_mode" :title="t('The Candela: Photometry and Luminous Intensity')">
                <DefinitionBox :title="t('Official Definition')">
                    <p>
                        {{ t('The candela (cd) is defined by the luminous efficacy of monochromatic radiation of frequency 540 × 10') }}<sup>12</sup> Hz, {{ t('which is set at') }} <strong>683 lm/W</strong>.
                    </p>
                </DefinitionBox>
                <p>
                    {{ t('Derived units in photometry include the') }} <strong>{{ t('lumen') }}</strong> (lm) {{ t('for luminous flux and the') }}
                    <strong>{{ t('lux') }}</strong> (lx) {{ t('for illuminance.') }}
                </p>
            </ContentSection>

            <!-- Derived Dimensions -->
            <ContentSection id="derived" icon="architecture" :title="t('Derived Dimensions and Engineering Mechanics')">
                <p>
                    {{ t('Derived units are created through the algebraic combination of base units to describe complex physical phenomena.') }}
                </p>
                <h3>{{ t('Kinematics and Dynamics') }}</h3>
                <DataTable :columns="kinematicsColumns" :rows="kinematicsRows" hoverable />

                <h3>{{ t('Stress, Pressure, and Material Strength') }}</h3>
                <DataTable :columns="pressureColumns" :rows="pressureRows" hoverable />

                <h3>{{ t('Torque and Rotational Motion') }}</h3>
                <DataTable :columns="torqueColumns" :rows="torqueRows" hoverable />
            </ContentSection>

            <!-- Fundamental Constants -->
            <ContentSection id="constants" icon="auto_awesome" :title="t('Fundamental Constants (CODATA 2022)')">
                <p>
                    {{ t('Fundamental constants are the unchanging "DNA" of the universe. They provide the ultimate reference points for all scientific inquiry.') }}
                </p>
                <DataTable :columns="constantsColumns" :rows="constantsRows" hoverable />
                <InsightBox :title="t(`The 'Big G' Problem`)">
                    <p>
                        {{ t('The relative uncertainty of the gravitational constant G remains significantly higher than that of other constants due to the difficulty in measuring such a weak force.') }}
                    </p>
                </InsightBox>
                <h3>{{ t('Mathematical Constants') }}</h3>
                <DataTable :columns="mathConstantsColumns" :rows="mathConstantsRows" hoverable />
            </ContentSection>

            <!-- Information Theory -->
            <ContentSection id="information" icon="storage" :title="t('Information Theory: Quantifying Digital Entropy')">
                <p>
                    {{ t('The fundamental unit of information is the bit. In information theory, its formal definition is the "shannon".') }}
                </p>
                <h3>{{ t('Digital Storage Prefixes') }}</h3>
                <DataTable :columns="digitalPrefixColumns" :rows="digitalPrefixRows" hoverable />
                <InsightBox>
                    <p>
                        {{ t('A drive marketed as "1 Terabyte" (decimal) actually contains only 931 Gibibytes (binary), which is the value typically reported by operating systems.') }}
                    </p>
                </InsightBox>
                <h3>{{ t('Information Entropy Units') }}</h3>
                <ul class="entropy-list">
                    <li><strong>{{ t('Shannon (Sh) / Bit:') }}</strong> {{ t('Log base 2. Associated with binary outcomes.') }}</li>
                    <li><strong>{{ t('Nat:') }}</strong> {{ t('Log base e. Used in physics and mathematical derivations.') }}</li>
                    <li><strong>{{ t('Hartley (Hart) / Ban:') }}</strong> {{ t('Log base 10. Used for decimal-based systems.') }}</li>
                </ul>
            </ContentSection>

            <!-- Radiological Units -->
            <ContentSection id="radiation" icon="warning" :title="t('Radiological Physics and Ionizing Radiation')">
                <p>
                    {{ t('Radiation metrology is divided into measurements of activity (the source), absorbed dose (the physical energy deposited), and dose equivalent (the biological impact).') }}
                </p>
                <h3>{{ t('Activity and Source Strength') }}</h3>
                <FormulaBox>
                    <p>
                        1 Ci = 3.7 × 10<sup>10</sup> Bq = 37 GBq<br>
                        1 mCi = 37 MBq<br>
                        1 μCi = 37 kBq
                    </p>
                </FormulaBox>
                <h3>{{ t('Dosimetry: Gray and Sievert') }}</h3>
                <p>
                    {{ t('The') }} <strong>{{ t('Gray (Gy)') }}</strong> {{ t('measures the absorbed dose—exactly 1 Joule of energy absorbed per kilogram of tissue. The') }} <strong>{{ t('Sievert (Sv)') }}</strong> {{ t('accounts for biological damage.') }}
                </p>
                <FormulaBox>
                    <p>
                        {{ t('Dose in Sv = Absorbed Dose in Gy × W') }}<sub>R</sub><br>
                        1 Sv = 100 rem<br>
                        1 Gy = 100 rad
                    </p>
                </FormulaBox>
                <p>{{ t('A typical chest X-ray delivers a dose of approximately') }} <strong>0.1 mSv</strong>.</p>
            </ContentSection>

            <!-- Best Practices -->
            <ContentSection icon="rule" :title="t('Standardization and Best Practices (NIST SP 811)')">
                <h3>{{ t('Spelling and Capitalization Rules') }}</h3>
                <ul class="best-practices-list">
                    <li><strong>{{ t('Unit Names:') }}</strong> {{ t('Always lowercase (newton, pascal) unless at the beginning of a sentence.') }}</li>
                    <li><strong>{{ t('Unit Symbols:') }}</strong> {{ t('Symbols from names are capitalized (W for Watt, Pa for Pascal). Others are lowercase.') }}</li>
                    <li><strong>{{ t('Spacing:') }}</strong> {{ t('Always separate the numerical value from the unit symbol (e.g., 50 kg, not 50kg).') }}</li>
                </ul>
                <h3>{{ t('Common Conversion Factors') }}</h3>
                <DataTable :columns="conversionColumns" :rows="conversionRows" hoverable />
            </ContentSection>

            <!-- Conclusion -->
            <section class="conclusion">
                <h2><span class="material-icons">auto_fix_high</span> {{ t('The Future of Universal Measurement') }}</h2>
                <p>
                    {{ t('By decoupling units from physical objects and anchoring them to fundamental constants, humanity has created a measurement system that is, in theory, communicable to any intelligent civilization in the galaxy.') }}
                </p>
                <p>
                    {{ t('For the professional engineer or researcher, the mastery of these units is more than a technical skill; it is the exercise of precision that prevents bridge failures and enables the synchronization of a global digital economy.') }}
                </p>
            </section>

            <!-- CTA -->
            <div class="cta-section">
                <h3>{{ t('Try Our Unit Converters') }}</h3>
                <p>{{ t('Put this knowledge into practice with our comprehensive unit conversion tools.') }}</p>
                <NuxtLink to="/calculator" class="cta-button">
                    <span class="material-icons">calculate</span>
                    {{ t('View All Calculators') }}
                </NuxtLink>
            </div>
        </article>
    </div>
</template>

<style scoped lang="scss">
/* Global heading colors for this page */
h1, h2, h3, h4, h5, h6 {
  color: var(--text);
}

@keyframes back-in {
  from {
    transform: translateY(100%);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.metrology-page {
  min-height: 100vh;
  background: linear-gradient(180deg, rgb(var(--accent-500-rgb) / 3%) 0%, transparent 300px);
}

.page-appbar {
  height: 3rem;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 101;
  overflow: hidden;

  @include phone {
    left: 2.75rem;
  }

  .back {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0 1rem;
    color: var(--neutral);
    animation: back-in 800ms cubic-bezier(0.75, 0, 0, 1) backwards;
    transition: color 0.2s;
    text-decoration: none;

    @include phone {
      padding: 0 0.75rem;
    }

    &:hover {
      color: var(--accent-500);
    }
  }
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem;
  
  @include phone {
    padding: 3.5rem 1rem 2rem;
  }
}

/* Hero Section */
.hero {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: center;
  padding: 2rem 0 3rem;
  border-bottom: 1px solid rgb(var(--accent-500-rgb) / 10%);
  margin-bottom: 2rem;
  animation: fade-in-up 0.6s cubic-bezier(0.1, 0.9, 0.2, 1) both;
  
  @include phone {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2rem 0;
  }
  
  .badge {
    display: inline-block;
    padding: 0.35rem 0.75rem;
    background: var(--accent-500);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 999px;
    margin-bottom: 1rem;
  }
  
  h1 {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--text) 0%, var(--accent-500) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    
    @include phone {
      font-size: 1.75rem;
    }
  }
  
  .subtitle {
    font-size: 1.1rem;
    color: var(--neutral);
    line-height: 1.6;
  }
}

/* Intro */
.intro {
  margin-bottom: 2rem;
  
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text);
    margin-bottom: 1rem;
    
    strong {
      color: var(--accent-500);
    }
  }
}

/* Table of Contents */
.toc {
  background: rgb(var(--accent-500-rgb) / 5%);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  margin-bottom: 3rem;
  
  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--text);
    
    .material-icons {
      color: var(--accent-500);
    }
  }
  
  ol {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 0.5rem;
    padding-left: 1.5rem;
    
    li {
      color: var(--neutral);
      
      a {
        color: var(--text);
        text-decoration: none;
        transition: color 0.2s;
        
        &:hover {
          color: var(--accent-500);
        }
      }
    }
  }
}

/* Base Units Grid */
.base-units-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.base-unit-card {
  background: var(--card);
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    border-color: var(--accent-500);
    box-shadow: 0 10px 30px rgb(var(--accent-500-rgb) / 15%);
  }
  
  .material-icons {
    font-size: 2rem;
    color: var(--accent-500);
    margin-bottom: 0.75rem;
  }
  
  h3 {
    font-size: 1rem;
    margin: 0 0 0.25rem;
    color: var(--text);
  }
  
  .symbol {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--accent-500);
    margin: 0;
  }
  
  .definition {
    font-size: 0.8rem;
    color: var(--neutral);
    margin: 0.25rem 0 0;
  }
}

/* Entropy List */
.entropy-list {
  list-style: none;
  padding: 0;
  
  li {
    padding: 0.75rem 1rem;
    background: var(--card);
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    border-left: 3px solid var(--accent-500);
    
    strong {
      color: var(--accent-500);
    }
  }
}

/* Best Practices List */
.best-practices-list {
  list-style: none;
  padding: 0;
  
  li {
    padding: 0.75rem 0;
    padding-left: 2rem;
    position: relative;
    border-bottom: 1px solid rgb(var(--accent-500-rgb) / 10%);
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--accent-500);
      font-weight: bold;
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    strong {
      color: var(--text);
    }
  }
}

/* Conclusion */
.conclusion {
  background: linear-gradient(135deg, rgb(var(--accent-500-rgb) / 8%) 0%, rgb(var(--accent-500-rgb) / 3%) 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-top: 3rem;
  
  h2 {
    border-bottom: none;
    padding-bottom: 0;
    color: var(--text) !important;
  }
  
  p {
    font-size: 1.05rem;
    color: var(--text);
  }
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: 3rem 2rem;
  margin-top: 2rem;
  background: var(--card);
  border-radius: 1.5rem;
  border: 1px solid rgb(var(--accent-500-rgb) / 15%);
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text);
  }
  
  p {
    color: var(--neutral);
    margin-bottom: 1.5rem;
  }
  
  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: var(--accent-500);
    color: white;
    font-weight: 600;
    text-decoration: none;
    border-radius: 999px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgb(var(--accent-500-rgb) / 30%);
    }
    
    .material-icons {
      font-size: 1.25rem;
    }
  }
}
</style>
