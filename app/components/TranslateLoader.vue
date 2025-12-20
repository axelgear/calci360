<template>
  <div class="translate-loader" role="status" aria-live="polite">
    <div class="ui-abstergo">
      <div class="abstergo-loader">
        <div />
        <div />
        <div />
      </div>
      <div class="ui-text">
        {{ label }}
        <div class="ui-dot" />
        <div class="ui-dot" />
        <div class="ui-dot" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string }>(), {
  label: 'Syncing translations',
})
</script>

<style scoped lang="scss">
.translate-loader {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--main-bg) 65%, #0b1f2f 35%);
  backdrop-filter: blur(10px);
}

/* From Uiverse.io by Galahhad */
.ui-abstergo {
  --primary: #fff;
  --secondary: rgb(var(--accent-500-rgb) / 40%);
  --shadow-blur: 6px;
  --text-shadow-blur: 4px;
  --animation-duration: 2s;
  --size: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 24px;
  scale: var(--size);
  color: var(--primary);
}

.abstergo-loader * {
  box-sizing: content-box;
}

.ui-text {
  display: flex;
  align-items: baseline;
  column-gap: 6px;
  color: var(--primary);
  text-shadow: 0 0 var(--text-shadow-blur) var(--secondary);
  font-family: Menlo, 'Fira Code', 'JetBrains Mono', monospace;
  letter-spacing: 0.04em;
}

.ui-dot {
  content: "";
  display: block;
  width: 4px;
  height: 4px;
  animation: dots var(--animation-duration) infinite linear;
  animation-delay: .4s;
  background-color: var(--primary);
}

.ui-dot:nth-child(2) { animation-delay: .8s; }
.ui-dot:nth-child(3) { animation-delay: 1.2s; }
.ui-dot + .ui-dot { margin-left: 3px; }

.abstergo-loader {
  width: 103px;
  height: 90px;
  position: relative;
}

.abstergo-loader div {
  width: 50px;
  border-right: 12px solid transparent;
  border-left: 12px solid transparent;
  border-top: 21px solid var(--primary);
  position: absolute;
  filter: drop-shadow(0 0 var(--shadow-blur) var(--secondary));
}

.abstergo-loader div:nth-child(1) {
  top: 27px;
  left: 7px;
  rotate: -60deg;
  animation: line1 var(--animation-duration) linear infinite alternate;
}

.abstergo-loader div:nth-child(2) {
  bottom: 2px;
  left: 0;
  rotate: 180deg;
  animation: line2 var(--animation-duration) linear infinite alternate;
}

.abstergo-loader div:nth-child(3) {
  bottom: 16px;
  right: -9px;
  rotate: 60deg;
  animation: line3 var(--animation-duration) linear infinite alternate;
}

.abstergo-loader:hover div:nth-child(1) {
  top: 21px;
  left: 14px;
  rotate: 60deg;
}

.abstergo-loader:hover div:nth-child(2) {
  bottom: 5px;
  left: -8px;
  rotate: 300deg;
}

.abstergo-loader:hover div:nth-child(3) {
  bottom: 7px;
  right: -11px;
  rotate: 180deg;
}

@keyframes line1 {
  0%, 40% { top: 27px; left: 7px; rotate: -60deg; }
  60%, 100% { top: 22px; left: 14px; rotate: 60deg; }
}

@keyframes line2 {
  0%, 40% { bottom: 2px; left: 0; rotate: 180deg; }
  60%, 100% { bottom: 5px; left: -8px; rotate: 300deg; }
}

@keyframes line3 {
  0%, 40% { bottom: 16px; right: -9px; rotate: 60deg; }
  60%, 100% { bottom: 7px; right: -11px; rotate: 180deg; }
}

@keyframes dots {
  0% { background-color: var(--secondary); }
  30% { background-color: var(--primary); }
  70%, 100% { background-color: var(--secondary); }
}
</style>

