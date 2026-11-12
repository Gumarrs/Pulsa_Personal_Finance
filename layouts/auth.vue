
<script setup lang="ts">
const { lang, setLang } = usePrefs()
</script>

<template>
  <div class="auth-layout">
    <!-- Language Switcher -->
    <button
      class="language-toggle"
      type="button"
      @click="setLang(lang === 'id' ? 'en' : 'id')"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>
      </svg>

      <span>{{ lang === 'id' ? 'English' : 'Indonesia' }}</span>

      <svg class="language-chevron" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2">
        <path d="m7 10 5 5 5-5"/>
      </svg>
    </button>

    <main class="auth-main">
      <slot />
    </main>

    <div class="auth-layout-footer">
      © {{ new Date().getFullYear() }} Rinciin. Made for better financial habits.
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  isolation: isolate;
}

.auth-main {
  min-height: 100vh;
  min-height: 100dvh;
}

.language-toggle {
  position: absolute;
  z-index: 20;
  top: 22px;
  right: 26px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid rgb(var(--c-line));
  border-radius: 12px;
  background: rgb(var(--c-surface) / .8);
  backdrop-filter: blur(12px);
  color: rgb(var(--c-fg) / .72);
  font-size: 11px;
  font-weight: 700;
  transition: all .2s ease;
}

.language-toggle:hover {
  background: rgb(var(--c-surface));
  border-color: rgb(var(--c-accent) / .45);
  color: rgb(var(--c-accent));
  transform: translateY(-2px);
}

.language-toggle svg {
  width: 15px;
  height: 15px;
}

.language-chevron {
  width: 12px !important;
  height: 12px !important;
}

.auth-layout-footer {
  position: absolute;
  bottom: 12px;
  width: 100%;
  text-align: center;
  font-size: 10px;
  color: rgb(var(--c-muted));
  pointer-events: none;
}

@media (max-width: 480px) {
  .language-toggle {
    top: 12px;
    right: 12px;
  }

  .auth-layout-footer {
    position: relative;
    padding: 0 12px 14px;
    bottom: auto;
  }
}
</style>
