<script setup lang="ts">
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

const props = defineProps<{
	statusCode: number | string;
	message: string;
}>();
</script>

<template>
	<div class="card">
		<div class="fire">🔥</div>
		<div class="content">
			<h1>{{ statusCode }}</h1>
			<h2>{{ message }}</h2>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "~/assets/styles/_error-page-mixins" as *;

$title-animation-options: $ease-out-expo 600ms backwards calc(100ms * var(--i));

	.card {
		@include round-large;
		@include card-shadow;
		$margin-y: 3.5rem;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: calc(100dvh - 2 * $margin-y);
		margin: $margin-y 2.5rem 0;
		overflow: clip;
		animation: intro 600ms $ease-out-smooth;

		.content {
			@include flex-center;
			@include square(100%);
			position: relative;
			z-index: 20;
			flex-direction: column;
			justify-content: start;
			padding-top: 5rem;
			color: c(accent);

			h1 {
				--i: 1;
				margin: 0;
				font-family: $english-logo-fonts;
				font-size: 112px;
				font-weight: bold;
				font-variant-numeric: oldstyle-nums;
				line-height: 1;
				animation: float-down $title-animation-options;
			}

			h2 {
				--i: 0;
				margin: 0.5rem;
				font-family: $english-logo-fonts;
				font-size: 26px;
				animation: float-down $title-animation-options;
			}
		}

		.fire {
			@include square(100%);
			position: absolute;
			animation: fade-in 1s $ease-out-sine;
		}
	}

	@keyframes float-down {
		from {
			translate: 0 -50px;
			opacity: 0;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}
	
	.fire {
		position: absolute;
		top: -3.5em;
		right: -0.3em;
		font-size: 2rem;
		animation: flicker 1.5s infinite;
	}
	
	@keyframes flicker {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.8; transform: scale(1.1); }
	}
</style>
