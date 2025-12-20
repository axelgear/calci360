/**
 * Physical Constants (CODATA 2022)
 * All values in SI units unless otherwise noted
 */

/* ========== DEFINING CONSTANTS (Exact by definition since 2019) ========== */

/** Speed of light in vacuum (m/s) - exact */
export const SPEED_OF_LIGHT = 299_792_458

/** Planck constant (J·s) - exact */
export const PLANCK_CONSTANT = 6.62607015e-34

/** Reduced Planck constant ℏ = h/(2π) (J·s) */
export const REDUCED_PLANCK = PLANCK_CONSTANT / (2 * Math.PI)

/** Elementary charge (C) - exact */
export const ELEMENTARY_CHARGE = 1.602176634e-19

/** Boltzmann constant (J/K) - exact */
export const BOLTZMANN_CONSTANT = 1.380649e-23

/** Avogadro constant (mol⁻¹) - exact */
export const AVOGADRO_CONSTANT = 6.02214076e23

/** Luminous efficacy of 540 THz radiation (lm/W) - exact */
export const LUMINOUS_EFFICACY = 683

/** Hyperfine transition frequency of Cs-133 (Hz) - exact */
export const CESIUM_FREQUENCY = 9_192_631_770

/* ========== DERIVED EXACT CONSTANTS ========== */

/** Molar gas constant R = NA × k (J/(mol·K)) - exact */
export const GAS_CONSTANT = AVOGADRO_CONSTANT * BOLTZMANN_CONSTANT

/** Faraday constant F = NA × e (C/mol) - exact */
export const FARADAY_CONSTANT = AVOGADRO_CONSTANT * ELEMENTARY_CHARGE

/** Stefan-Boltzmann constant σ (W/(m²·K⁴)) */
export const STEFAN_BOLTZMANN = 5.670374419e-8

/** Wien displacement constant b (m·K) */
export const WIEN_DISPLACEMENT = 2.897771955e-3

/* ========== MEASURED CONSTANTS (with uncertainty) ========== */

/** Newtonian gravitational constant (m³/(kg·s²)) */
export const GRAVITATIONAL_CONSTANT = 6.67430e-11

/** Standard gravity on Earth (m/s²) - exact by convention */
export const STANDARD_GRAVITY = 9.80665

/** Standard atmospheric pressure (Pa) - exact */
export const STANDARD_ATMOSPHERE = 101_325

/** Vacuum permittivity ε₀ (F/m) */
export const VACUUM_PERMITTIVITY = 8.8541878128e-12

/** Vacuum permeability μ₀ (N/A² or H/m) */
export const VACUUM_PERMEABILITY = 1.25663706212e-6

/** Impedance of free space Z₀ (Ω) */
export const IMPEDANCE_FREE_SPACE = 376.730313668

/** Fine-structure constant α (dimensionless) */
export const FINE_STRUCTURE_CONSTANT = 7.2973525693e-3

/** Inverse fine-structure constant 1/α */
export const INVERSE_FINE_STRUCTURE = 137.035999084

/** Rydberg constant R∞ (m⁻¹) */
export const RYDBERG_CONSTANT = 10_973_731.568160

/* ========== PARTICLE MASSES ========== */

/** Electron mass (kg) */
export const ELECTRON_MASS = 9.1093837015e-31

/** Proton mass (kg) */
export const PROTON_MASS = 1.67262192369e-27

/** Neutron mass (kg) */
export const NEUTRON_MASS = 1.67492749804e-27

/** Atomic mass unit (kg) */
export const ATOMIC_MASS_UNIT = 1.66053906660e-27

/** Proton-electron mass ratio */
export const PROTON_ELECTRON_RATIO = 1836.15267343

/* ========== ATOMIC / QUANTUM CONSTANTS ========== */

/** Bohr radius a₀ (m) */
export const BOHR_RADIUS = 5.29177210903e-11

/** Classical electron radius r_e (m) */
export const ELECTRON_RADIUS = 2.8179403262e-15

/** Compton wavelength of electron (m) */
export const COMPTON_WAVELENGTH_ELECTRON = 2.42631023867e-12

/** Compton wavelength of proton (m) */
export const COMPTON_WAVELENGTH_PROTON = 1.32140985539e-15

/** Bohr magneton μ_B (J/T) */
export const BOHR_MAGNETON = 9.2740100783e-24

/** Nuclear magneton μ_N (J/T) */
export const NUCLEAR_MAGNETON = 5.0507837461e-27

/* ========== ELECTROMAGNETIC CONSTANTS ========== */

/** Josephson constant K_J = 2e/h (Hz/V) */
export const JOSEPHSON_CONSTANT = 483_597.8484e9

/** Von Klitzing constant R_K = h/e² (Ω) */
export const VON_KLITZING_CONSTANT = 25_812.80745

/** Magnetic flux quantum Φ₀ = h/(2e) (Wb) */
export const MAGNETIC_FLUX_QUANTUM = 2.067833848e-15

/** Conductance quantum G₀ = 2e²/h (S) */
export const CONDUCTANCE_QUANTUM = 7.748091729e-5

/* ========== PLANCK UNITS ========== */

/** Planck length (m) */
export const PLANCK_LENGTH = 1.616255e-35

/** Planck time (s) */
export const PLANCK_TIME = 5.391247e-44

/** Planck mass (kg) */
export const PLANCK_MASS = 2.176434e-8

/** Planck temperature (K) */
export const PLANCK_TEMPERATURE = 1.416784e32

/** Planck energy (J) */
export const PLANCK_ENERGY = 1.9561e9

/* ========== ASTRONOMICAL CONSTANTS ========== */

/** Speed of sound at sea level (m/s) - approximate */
export const SPEED_OF_SOUND = 343

/** Astronomical unit (m) - exact since 2012 */
export const ASTRONOMICAL_UNIT = 149_597_870_700

/** Light year (m) */
export const LIGHT_YEAR = 9_460_730_472_580_800

/** Parsec (m) */
export const PARSEC = 3.085677581491367e16

/** Solar mass (kg) */
export const SOLAR_MASS = 1.98892e30

/** Earth mass (kg) */
export const EARTH_MASS = 5.9722e24

/** Earth radius (equatorial, m) */
export const EARTH_RADIUS_EQUATORIAL = 6_378_137

/** Earth radius (polar, m) */
export const EARTH_RADIUS_POLAR = 6_356_752.3142

/** Moon mass (kg) */
export const MOON_MASS = 7.342e22

/** Solar luminosity (W) */
export const SOLAR_LUMINOSITY = 3.828e26

/* ========== MATHEMATICAL CONSTANTS ========== */

/** Pi (π) */
export const PI = Math.PI

/** Tau (τ = 2π) */
export const TAU = 2 * Math.PI

/** Euler's number (e) */
export const EULER_NUMBER = Math.E

/** Golden ratio (φ) */
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2

/** Square root of 2 (√2) */
export const SQRT_2 = Math.SQRT2

/** Square root of 3 (√3) */
export const SQRT_3 = Math.sqrt(3)

/** Natural logarithm of 2 (ln 2) */
export const LN_2 = Math.LN2

/** Natural logarithm of 10 (ln 10) */
export const LN_10 = Math.LN10

/** Euler-Mascheroni constant (γ) */
export const EULER_MASCHERONI = 0.5772156649015329

/** Apéry's constant (ζ(3)) */
export const APERY_CONSTANT = 1.2020569031595943

/* ========== CONVERSION FACTORS ========== */

/** Electronvolt to Joule */
export const EV_TO_JOULE = ELEMENTARY_CHARGE

/** Calorie (thermochemical) to Joule - exact */
export const CALORIE_TO_JOULE = 4.184

/** Calorie (IT) to Joule - exact */
export const CALORIE_IT_TO_JOULE = 4.1868

/** BTU (IT) to Joule */
export const BTU_TO_JOULE = 1055.06

/** Horsepower (mechanical) to Watt - exact */
export const HP_TO_WATT = 745.7

/** Horsepower (metric) to Watt - exact */
export const HP_METRIC_TO_WATT = 735.49875

/** Bar to Pascal */
export const BAR_TO_PASCAL = 100_000

/** Torr to Pascal */
export const TORR_TO_PASCAL = 101_325 / 760

/** PSI to Pascal */
export const PSI_TO_PASCAL = 6894.757293168

/* ========== TEMPERATURE OFFSETS ========== */

/** Celsius to Kelvin offset */
export const CELSIUS_OFFSET = 273.15

/** Fahrenheit to Rankine offset */
export const FAHRENHEIT_OFFSET = 459.67

