<script setup lang="ts">
import { useUiTranslator } from '@/composables/useUiTranslator'
import { computed, ref, onMounted } from '#imports'

const { t } = useUiTranslator()

// Helper functions and composables
const useMouse = () => ({ x: ref(0), y: ref(0) })
const useDeviceOrientation = () => ({ beta: ref(null), gamma: ref(null) })
const useTimestamp = ({ interval }: { interval: number }) => ref(Date.now())
const useSmoothValue = (value: any, smoothing: number) => value
const environment = { server: false }
const Point = class { constructor(public x: number, public y: number) {} }
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const eases = { 
	outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
	easeOutMax: 'cubic-bezier(0.16, 1, 0.3, 1)'
}

	const props = defineProps<{
		statusCode: number | string;
		message: string;
	}>();

	const message = computed(() => props.message
		.replace(/^Page Not Found:\\s*/i, t("page_not_found_info") + t("colon"))
		.replace(/^Page Not Found(?=\\s|$)/i, t("page_not_found_info")));
	const mouse = useMouse();
	const gsensor = useDeviceOrientation(); // Safari doesn't support accelerometer (gravity sensor), let it be.
	const inited = ref(false);
	const timestamp = useTimestamp({ interval: 1_000 });
	const dayNight = ref<HTMLDivElement>();
	const rotationDeg = computed(() => {
		const date = new Date(timestamp.value);
		let deg = date.getMilliseconds(); // ms
		deg = deg / 1000 + date.getSeconds(); // s
		deg = deg / 60 + date.getMinutes(); // min
		deg = deg / 60 + date.getHours(); // h
		deg = deg / 24 * 360; // deg
		return deg;
	});
	const parallaxRough = computed(() => {
		if (environment.server || !mouse.x.value && !mouse.y.value && gsensor.beta.value === null)
			return new Point(0, 0);
		else if (gsensor.beta.value === null) return new Point(
			mouse.x.value / window.innerWidth * 2 - 1,
			mouse.y.value / window.innerHeight,
		);
		else return new Point(
			(gsensor.gamma.value ?? 0) / 45,
			1 - clamp(gsensor.beta.value ?? 90, 0, 90) / 90,
		);
	});
	const parallax = useSmoothValue(parallaxRough, 0.1); // Smooth parallax movement

	onMounted(() => {
		// Sun and moon rotation
		if ("requestPermission" in DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function")
			DeviceMotionEvent.requestPermission(); // Safari's last struggle.
		inited.value = true;
		if (dayNight.value) {
			const deg = rotationDeg.value;
			const PRE_DEG = 10;
			dayNight.value.animate([
				{ rotate: deg - PRE_DEG + "deg", opacity: 0 },
				{ rotate: deg + "deg", opacity: 1 },
			], { duration: 500, easing: eases.easeOutMax });
		}
	});
</script>

<template>
	<main>
		<div ref="dayNight" class="day-night" :hidden="!inited" :style="{ rotate: rotationDeg + 'deg' }">
			<div class="moon-icon">🌙</div>
			<div class="sun-icon">☀️</div>
		</div>
		<div class="mountains" :style="{ '--x': parallax.x, '--y': parallax.y }">
			<div v-for="i in 11" :key="i">
				<div></div>
			</div>
		</div>
		<div class="spotlight"></div>
		<div class="content">
			<h1>{{ statusCode }}</h1>
			<p>{{ message }}</p>
			<!-- <div>test pointer: {{ parallax.x }}, {{ parallax.y }}</div>
			<div>test gsensor: {{ gsensor.alpha }}, {{ gsensor.beta }}, {{ gsensor.gamma }}</div>
			<div>{{ rotationDeg }}</div> -->
			<NuxtLink to="/" class="button">{{ t("Return to Home") }}</NuxtLink>
		</div>
	</main>
</template>

<style scoped lang="scss">
@use "sass:math";
@use "sass:list";
@use "~/assets/styles/_error-page-mixins" as *;

$title-animation-options: $ease-out-expo 600ms backwards calc(100ms * var(--i));
	$mountain-animation-options: $ease-out-expo 1500ms backwards;

	.spotlight {
		position: fixed;
		bottom: -30dvh;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 40dvh;
		// background: linear-gradient(45deg, #00dc82 0%, #36e4da 50%, #0047e1 100%);
		background: linear-gradient(45deg, c(accent-10) 0%, c(accent-80) 50%, c(accent) 100%);
		filter: blur(20dvh);
		pointer-events: none;

		html.dark & {
			background: black;
		}
	}

	.content {
		@include flex-center;
		@include square(100%);
		position: relative;
		z-index: 20;
		flex-direction: column;
		justify-content: start;
		padding: 5rem 3rem 0;

		h1 {
			--i: 2;
			margin: 0;
			margin-bottom: 2rem;
			color: c(accent);
			font-family: $english-logo-fonts;
			font-size: 6rem;
			font-weight: bold;
			font-variant-numeric: oldstyle-nums;
			line-height: 1;
			animation: float-down $title-animation-options;
		}

		p {
			--i: 1;
			margin: 0;
			margin-bottom: 4rem;
			font-size: 1.25rem;
			font-weight: 300;
			line-height: 1.25;
			word-break: break-word;
			animation: float-down $title-animation-options;
		}

		button {
			--i: 0;
			animation: float-down $title-animation-options;
		}
	}

	.home-link-button {
		background: none;
	}

	.home-link {
		@include round-large;
		--i: 0;
		position: relative;
		padding: 0.75rem 1.5rem;
		color: initial;
		text-decoration: none;
		background: none;
		background-color: #ffffff4d;
		backdrop-filter: blur(10px);
		animation: float-down $title-animation-options;

		:root.dark & {
			background-color: #1414144d;
		}

		&::before {
			@include round-large;
			content: "";
			position: absolute;
			inset: 0;
			width: 100%;
			padding: 2px;
			background: linear-gradient(90deg, #e2e2e2 0%, #e2e2e2 25%, #00dc82 50%, #36e4da 75%, #0047e1 100%);
			background-size: 400% auto !important;
			opacity: 0.5;
			mask: linear-gradient(white 0 0) content-box, linear-gradient(white 0 0);
			// stylelint-disable-next-line property-no-vendor-prefix
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			transition: background-position 0.3s ease-in-out, opacity 0.2s ease-in-out;

			:root.dark & {
				background: linear-gradient(90deg, #303030 0%, #303030 25%, #00dc82 50%, #36e4da 75%, #0047e1 100%);
			}
		}

		&:hover::before {
			background-position: -50% 0 !important;
			opacity: 1;
		}
	}

	main {
		height: 100dvh;
	}

	.mountains {
		@include square(100%);
		$height: 80dvh;
		$sqrt3: math.sqrt(3);
		--x: 0;
		--y: 0;
		position: fixed;
		left: calc((100dvw / 11 - $height * 2 / $sqrt3) / 2);
		display: flex;

		html.dark & {
			filter: brightness(0.3);
		}

		> * {
			@include square(100%);

			> * {
				position: absolute;
				bottom: 0;
				width: 0;
				height: 0;
				border-width: 0 calc($height / $sqrt3) $height;
				border-style: solid;
				border-color: transparent;
				transition: none;
				animation: move-up $mountain-animation-options;
			}

			@for $i from 1 through 11 {
				$colors: c(accent), c(accent-40), c(accent-30), c(accent-20), c(accent-10), c(accent-5);

				&:nth-of-type(#{$i}) > * {
					$j: $i - 1;
					$layer: 5 - math.abs($j - 5);
					--from: calc(175px * (5 - #{$layer}) / 5 + 20px);
					bottom: calc(40% * $layer / -5);
					z-index: 6 - $layer;
					border-bottom-color: list.nth($colors, $layer + 1);
					translate: calc(var(--x) * (1.1 - $layer / 5) * 60px) calc(var(--y) * (1.1 - $layer / 5) * 100px);
				}
			}
		}
	}

	.day-night {
		@include square(1.5 * 100dvh);
		@include flex-center;
		position: fixed;
		top: 0.25 * 100dvh;
		left: 50%;
		flex-direction: column;
		justify-content: space-between;
		translate: -50%;
		transition: none;

		> * {
			@include square(calc(100vmin / 5));
			fill: c(accent-20);
		}
	}

	@media (width >= 640px) {
		.content {
			h1 {
				font-size: 10rem;
				line-height: 1;
			}

			p {
				font-size: 2.25rem;
				line-height: 2.5rem;
			}
		}

		.home-link {
			font-size: 1.25rem;
			line-height: 1.75rem;
		}
	}

	@keyframes float-down {
		from {
			translate: 0 -50px;
			opacity: 0;
		}
	}

	@keyframes move-up {
		from {
			translate: 0 var(--from);
		}
	}
	
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 2rem;
		background: var(--accent-500);
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
		font-weight: 600;
		transition: all 0.2s;
		margin-top: 2rem;
		
		&:hover {
			background: var(--accent-600);
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(var(--accent-500-rgb), 0.3);
		}
	}
	
	.moon-icon, .sun-icon {
		font-size: 3rem;
		position: absolute;
		filter: blur(2px);
		opacity: 0.8;
	}
	
	.moon-icon {
		top: 20%;
		left: 10%;
		animation: float-moon 20s infinite ease-in-out;
	}
	
	.sun-icon {
		top: 15%;
		right: 15%;
		animation: float-sun 25s infinite ease-in-out;
	}
	
	@keyframes float-moon {
		0%, 100% { transform: translate(0, 0) rotate(0deg); }
		33% { transform: translate(20px, -30px) rotate(10deg); }
		66% { transform: translate(-10px, 20px) rotate(-5deg); }
	}
	
	@keyframes float-sun {
		0%, 100% { transform: translate(0, 0) rotate(0deg); }
		50% { transform: translate(-30px, 30px) rotate(180deg); }
	}
</style>
