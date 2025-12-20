<script setup lang="ts">
import { useUiTranslator } from '@/composables/useUiTranslator'

const { translating, t } = useUiTranslator()
</script>

<template>
  <div class="layout-wrapper">
    <!-- Animated Background -->
    <div class="bg-effects">
      <div class="bg-grid" />
      <div class="bg-glow" />
      <div class="bg-particles">
        <span v-for="i in 12" :key="i" class="particle" :style="{ '--i': i }" />
      </div>
      <div class="bg-scanline" />
    </div>

  <Navigation />
  <ClientOnly>
    <TranslateLoader v-if="translating" :label="t('Translating interface')" />
  </ClientOnly>
  <slot />
  </div>
</template>

<style scoped lang="scss">
.layout-wrapper {
  position: relative;
  min-height: 100dvh;
}

::slotted {
  padding-top: 3rem;
}

/* Background Effects */
.bg-effects {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(var(--accent-500-rgb) / 3%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--accent-500-rgb) / 3%) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%);

  @include dark {
    background-image:
      linear-gradient(rgb(var(--accent-500-rgb) / 6%) 1px, transparent 1px),
      linear-gradient(90deg, rgb(var(--accent-500-rgb) / 6%) 1px, transparent 1px);
  }
}

.bg-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 150%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgb(var(--accent-500-rgb) / 8%) 0%, transparent 60%);
  animation: bg-pulse 8s ease-in-out infinite;

  @include dark {
    background: radial-gradient(ellipse at center, rgb(var(--accent-500-rgb) / 15%) 0%, transparent 60%);
  }
}

@keyframes bg-pulse {
  0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
  50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
}

.bg-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--accent-500);
  border-radius: 50%;
  opacity: 0;
  animation: particle-float 12s ease-in-out infinite;
  animation-delay: calc(var(--i) * 1s);
  left: calc(var(--i) * 8% + 2%);
  top: calc(var(--i) * 7% + 10%);
  filter: blur(1px);

  @include dark {
    box-shadow: 0 0 8px var(--accent-500);
  }
}

@keyframes particle-float {
  0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
  10% { opacity: 0.6; }
  50% { opacity: 0.3; transform: translateY(-100px) scale(1); }
  90% { opacity: 0.6; }
}

.bg-scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgb(var(--accent-500-rgb) / 1%) 2px,
    rgb(var(--accent-500-rgb) / 1%) 4px
  );
  animation: scanline-move 10s linear infinite;
  opacity: 0.5;

  @include dark {
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgb(var(--accent-500-rgb) / 3%) 2px,
      rgb(var(--accent-500-rgb) / 3%) 4px
    );
  }
}

@keyframes scanline-move {
  0% { transform: translateY(0); }
  100% { transform: translateY(100px); }
}
</style>
