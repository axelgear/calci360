<script setup lang="ts">
// Place this file in the root directory to customize error page styles (e.g., 404, 500).

import { httpResponseStatusCodes } from "~/helpers/http-status";
import type { NuxtError } from "#app";
import { onMounted, useHead } from "#imports";
import { useUiTranslator } from '@/composables/useUiTranslator'

const { t } = useUiTranslator()

	const props = withDefaults(defineProps<{
		error: Partial<NuxtError>;
	}>(), {
		error: () => ({
			// @ts-ignore
			statusCode: 233,
		message: "Fun",
		}),
	});

	/**
 * Check if the error matches any of the given status codes.
 * @param statusCodes - Status codes to check.
 * @returns Whether the error matches any status code.
	 */
	function isStatusCode(...statusCodes: number[]) {
		for (const statusCode of statusCodes)
			// eslint-disable-next-line eqeqeq
			if (props.error.statusCode == statusCode)
			// Using == intentionally for type coercion.
				return true;
		return false;
	}

	onMounted(() => console.log(props.error));

	useHead({
		title: httpResponseStatusCodes[props.error.statusCode!],
	titleTemplate: "%s - Calculator App",
		bodyAttrs: { class: "no-scroll" },
	});
</script>

<template>
	<NuxtLayout v-if="isStatusCode(404, 233)" name="error404" :statusCode="error.statusCode" :message="error.message" />
	<NuxtLayout v-else-if="isStatusCode(403)" name="error403" :statusCode="error.statusCode" :message="error.message" />
	<NuxtLayout v-else-if="isStatusCode(502)" name="error502" :statusCode="error.statusCode" :message="error.message" />
	<!-- TODO: For the 301 error page design, we might need a new parameter to pass the reason why the content was removed. -->
	<NuxtLayout v-else-if="isStatusCode(301)" name="error301" :statusCode="error.statusCode" :message="error.message" />
	<NuxtLayout v-else name="error500" :statusCode="error.statusCode" :message="error.message" :stack="error.stack ?? ''" />
</template>
