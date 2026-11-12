<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'auth' })
const { t } = useT()
const { signUp } = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const needsConfirm = ref(false)
const showPassword = ref(false)

async function submit() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = t('auth.passwordMin', 'Password must be at least 6 characters')
    return
  }
  loading.value = true
  try {
    const hasSession = await signUp(email.value.trim(), password.value, name.value.trim())
    if (hasSession) await router.replace('/')
    else needsConfirm.value = true
  } catch (e: any) {
    error.value = e?.message || t('common.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-shell">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>
    <div class="ambient ambient-three"></div>

    <div class="auth-container">
      <div class="brand-header">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7h16M4 12h10M4 17h7"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <span>Rinciin<span class="brand-dot">.</span></span>
      </div>

      <div class="auth-card">
        <div class="card-glow"></div>

        <template v-if="needsConfirm">
          <div class="success-content">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.7">
                <rect x="3" y="5" width="18" height="14" rx="3"/>
                <path d="m3 7 9 6 9-6"/>
                <path d="m15 15 2 2 4-4"/>
              </svg>
            </div>

            <div class="eyebrow">
              <span class="status-dot"></span>
              ONE LAST STEP
            </div>

            <h1>{{ t('auth.checkEmailTitle', 'Check your email') }}</h1>

            <p class="success-description">
              {{ t('auth.checkEmail', { email }) }}
            </p>

            <NuxtLink to="/login" class="submit-button success-button">
              {{ t('auth.backToLogin', 'Back to Login') }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <path d="M5 12h14m-6-6 6 6-6 6"/>
              </svg>
            </NuxtLink>
          </div>
        </template>

        <template v-else>
          <div class="auth-heading">
            <div class="eyebrow">
              <span class="status-dot"></span>
              START SOMETHING GOOD
            </div>

            <h1>{{ t('auth.registerTitle', 'Create Account') }}</h1>
            <p>{{ t('auth.registerSub', 'Sign up to get started.') }}</p>
          </div>

          <form class="auth-form" @submit.prevent="submit">
            <div class="field-group">
              <label class="field-label">
                {{ t('auth.fullName', 'Full Name') }}
              </label>

              <div class="input-wrapper">
                <svg class="field-icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.7">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 21a8 8 0 0 1 16 0"/>
                </svg>

                <input
                  v-model="name"
                  class="auth-input"
                  placeholder="John Doe"
                  autocomplete="name"
                  required
                />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">
                {{ t('auth.email', 'Email Address') }}
              </label>

              <div class="input-wrapper">
                <svg class="field-icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.7">
                  <rect x="3" y="5" width="18" height="14" rx="3"/>
                  <path d="m3 7 9 6 9-6"/>
                </svg>

                <input
                  v-model="email"
                  type="email"
                  class="auth-input"
                  placeholder="your@email.com"
                  autocomplete="email"
                  required
                />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">
                {{ t('auth.password', 'Password') }}
              </label>

              <div class="input-wrapper">
                <svg class="field-icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.7">
                  <rect x="4" y="10" width="16" height="11" rx="2"/>
                  <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                </svg>

                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="auth-input"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  required
                />

                <button
                  type="button"
                  class="password-toggle"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13 13 0 0 1-2 3"/>
                    <path d="M6.61 6.61A13 13 0 0 0 2 12s3 7 10 7a10 10 0 0 0 5-1.4"/>
                    <path d="m2 2 20 20"/>
                  </svg>
                </button>
              </div>
            </div>

            <Transition name="error">
              <div v-if="error" class="error-alert" role="alert">
                <span>!</span>
                {{ error }}
              </div>
            </Transition>

            <button class="submit-button" type="submit" :disabled="loading">
              <svg v-if="loading" class="spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none"
                  stroke="currentColor" stroke-width="3" opacity=".25"/>
                <path d="M21 12a9 9 0 0 0-9-9"
                  fill="none" stroke="currentColor" stroke-width="3"/>
              </svg>

              <span>
                {{ loading ? t('common.loading', 'Loading...') : t('auth.signUp', 'Sign Up') }}
              </span>

              <svg v-if="!loading" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <path d="M5 12h14m-6-6 6 6-6 6"/>
              </svg>
            </button>
          </form>

          <div class="auth-footer">
            <span>{{ t('auth.hasAccount', 'Already have an account?') }}</span>
            <NuxtLink to="/login">
              {{ t('auth.signIn', 'Log in here') }}
            </NuxtLink>
          </div>
        </template>
      </div>

      <p class="bottom-note">
        <span>✦</span> Take control of every little detail.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ───────────── Theme tokens ─────────────
   Light = default. Dark aktif saat <html class="dark"> (sama seperti main CSS). */
.auth-shell {
  --a-shell-bg: #f5f8f5;
  --a-amb-1: #c6eed8;
  --a-amb-2: #d5eee0;
  --a-amb-3: #e2f3df;

  --a-brand-text: #153c2a;
  --a-brand-dot: #159b5d;

  --a-card-bg: rgba(255, 255, 255, 0.91);
  --a-card-border: rgba(255, 255, 255, 0.9);
  --a-card-shadow: 0 20px 70px rgba(31, 75, 49, 0.08), 0 2px 8px rgba(31, 75, 49, 0.04);
  --a-card-glow: #d9f5e5;

  --a-eyebrow: #278255;
  --a-dot: #20a568;
  --a-dot-ring: #20a56818;

  --a-heading: #183c2b;
  --a-sub: #87968c;

  --a-label: #344c3c;
  --a-link: #198653;
  --a-link-hover: #0d5835;

  --a-input-border: #e7eee8;
  --a-input-text: #234333;
  --a-input-bg: #f9fbf9;
  --a-input-placeholder: #b0bbb3;
  --a-input-focus-border: #28a66b;
  --a-input-focus-bg: #ffffff;
  --a-input-focus-ring: #20a56813;

  --a-success-bg: #e7f6ed;
  --a-success-icon: #159b60;

  --a-icon: #92a599;
  --a-icon-active: #15965b;

  --a-error-text: #c03939;
  --a-error-bg: #fff3f2;
  --a-error-border: #f9d9d6;

  --a-footer-line: #edf1ed;
  --a-footer-text: #8b998f;
  --a-footer-link: #168653;
  --a-footer-link-hover: #105c39;

  --a-note: #9aaca0;
  --a-note-star: #1a9b60;

  color-scheme: light;
}

.dark .auth-shell {
  --a-shell-bg: #0e1411;
  --a-amb-1: rgba(32, 165, 104, 0.22);
  --a-amb-2: rgba(23, 130, 84, 0.18);
  --a-amb-3: rgba(52, 211, 153, 0.1);

  --a-brand-text: #e8f4ed;
  --a-brand-dot: #34d399;

  --a-card-bg: rgba(22, 30, 26, 0.86);
  --a-card-border: rgba(255, 255, 255, 0.07);
  --a-card-shadow: 0 20px 70px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  --a-card-glow: rgba(52, 211, 153, 0.16);

  --a-eyebrow: #4fd99b;
  --a-dot: #34d399;
  --a-dot-ring: #34d39926;

  --a-heading: #eef7f1;
  --a-sub: #96a99d;

  --a-label: #c5d5cb;
  --a-link: #4fd99b;
  --a-link-hover: #8af0c0;

  --a-input-border: #2b3a32;
  --a-input-text: #e8f4ed;
  --a-input-bg: #121a16;
  --a-input-placeholder: #5f7066;
  --a-input-focus-border: #34d399;
  --a-input-focus-bg: #16201b;
  --a-input-focus-ring: #34d39922;

  --a-success-bg: rgba(52, 211, 153, 0.14);
  --a-success-icon: #4fd99b;

  --a-icon: #6f8478;
  --a-icon-active: #4fd99b;

  --a-error-text: #ff9a90;
  --a-error-bg: rgba(227, 90, 80, 0.12);
  --a-error-border: rgba(227, 90, 80, 0.32);

  --a-footer-line: #26332b;
  --a-footer-text: #8a9e92;
  --a-footer-link: #4fd99b;
  --a-footer-link-hover: #8af0c0;

  --a-note: #6f8478;
  --a-note-star: #4fd99b;

  color-scheme: dark;
}

/* ───────────── Layout ───────────── */
.auth-shell {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  background: var(--a-shell-bg);
  isolation: isolate;
  transition: background-color 0.25s ease;
}

.ambient {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  pointer-events: none;
  z-index: -1;
  animation: float 12s ease-in-out infinite;
}

.ambient-one {
  width: 440px;
  height: 440px;
  background: radial-gradient(circle, var(--a-amb-1) 0%, transparent 70%);
  top: -190px;
  right: -100px;
}

.ambient-two {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--a-amb-2) 0%, transparent 70%);
  bottom: -250px;
  left: -180px;
  animation-delay: -4s;
}

.ambient-three {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, var(--a-amb-3) 0%, transparent 70%);
  top: 40%;
  left: 10%;
  animation-delay: -7s;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  animation: appear 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.brand-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 26px;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--a-brand-text);
}

.brand-icon {
  width: 39px;
  height: 39px;
  border-radius: 13px;
  background: linear-gradient(135deg, #176b45, #0e9b60);
  display: grid;
  place-items: center;
  color: white;
  box-shadow: 0 5px 14px #16744735;
}

.brand-icon svg {
  width: 22px;
}

.brand-dot {
  color: var(--a-brand-dot);
}

.auth-card {
  position: relative;
  overflow: hidden;
  background: var(--a-card-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--a-card-border);
  border-radius: 25px;
  padding: 38px;
  box-shadow: var(--a-card-shadow);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.card-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--a-card-glow), transparent 70%);
  pointer-events: none;
}

.auth-heading {
  position: relative;
  margin-bottom: 27px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
  color: var(--a-eyebrow);
  margin-bottom: 13px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--a-dot);
  box-shadow: 0 0 0 4px var(--a-dot-ring);
}

.auth-heading h1,
.success-content h1 {
  font-size: 29px;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.2;
  color: var(--a-heading);
}

.auth-heading p {
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--a-sub);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.field-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--a-label);
}

.forgot-link {
  font-size: 11px;
  font-weight: 700;
  color: var(--a-link);
  transition: color 0.2s;
}

.forgot-link:hover {
  color: var(--a-link-hover);
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.auth-input {
  width: 100%;
  height: 51px;
  padding: 0 45px;
  border: 1px solid var(--a-input-border);
  border-radius: 12px;
  outline: none;
  color: var(--a-input-text);
  background: var(--a-input-bg);
  font-size: 13px;
  transition: all 0.25s ease;
}

.auth-input::placeholder {
  color: var(--a-input-placeholder);
}

.auth-input:focus {
  border-color: var(--a-input-focus-border);
  background: var(--a-input-focus-bg);
  box-shadow: 0 0 0 4px var(--a-input-focus-ring);
}

/* Autofill browser memaksa latar kuning/putih; samakan dengan tema. */
.auth-input:-webkit-autofill,
.auth-input:-webkit-autofill:hover,
.auth-input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--a-input-text);
  caret-color: var(--a-input-text);
  -webkit-box-shadow: 0 0 0 1000px var(--a-input-bg) inset;
  transition: background-color 9999s ease-out 0s;
}

.field-icon {
  position: absolute;
  left: 16px;
  width: 17px;
  height: 17px;
  color: var(--a-icon);
  pointer-events: none;
  transition: color 0.2s;
}

.input-wrapper:focus-within .field-icon {
  color: var(--a-icon-active);
}

.password-toggle {
  position: absolute;
  right: 14px;
  display: grid;
  place-items: center;
  padding: 5px;
  color: var(--a-icon);
  cursor: pointer;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: var(--a-icon-active);
}

.password-toggle svg {
  width: 18px;
  height: 18px;
}

.submit-button {
  width: 100%;
  min-height: 53px;
  border-radius: 12px;
  margin-top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: white;
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(115deg, #176a43, #159b60);
  box-shadow: 0 7px 18px #16855230;
  transition: all 0.25s ease;
  cursor: pointer;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 11px 24px #16855240;
  background: linear-gradient(115deg, #125b38, #0d8752);
}

.submit-button:active:not(:disabled) {
  transform: scale(0.985);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.submit-button svg {
  width: 17px;
  height: 17px;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

.error-alert {
  padding: 12px 14px;
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--a-error-text);
  background: var(--a-error-bg);
  border: 1px solid var(--a-error-border);
  border-radius: 10px;
  font-size: 12px;
}

.error-alert span {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #e35a50;
  color: white;
  font-weight: 800;
}

.auth-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 25px;
  padding-top: 22px;
  border-top: 1px solid var(--a-footer-line);
  font-size: 11px;
  color: var(--a-footer-text);
}

.auth-footer a {
  font-weight: 800;
  color: var(--a-footer-link);
  transition: color 0.2s;
}

.auth-footer a:hover {
  color: var(--a-footer-link-hover);
}

.success-content {
  position: relative;
  text-align: center;
  padding: 12px 0;
}

.success-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 24px;
  display: grid;
  place-items: center;
  border-radius: 22px;
  color: var(--a-success-icon);
  background: var(--a-success-bg);
  animation: appear 0.6s ease both;
}

.success-icon svg {
  width: 35px;
  height: 35px;
}

.success-content .eyebrow {
  justify-content: center;
}

.success-description {
  margin: 15px 0 28px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--a-sub);
  overflow-wrap: anywhere;
}

.success-button {
  text-decoration: none;
}

.bottom-note {
  margin-top: 24px;
  text-align: center;
  color: var(--a-note);
  font-size: 11px;
  letter-spacing: 0.2px;
}

.bottom-note span {
  color: var(--a-note-star);
  margin-right: 5px;
}

.error-enter-active,
.error-leave-active {
  transition: all 0.2s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes appear {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(15px, -20px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .auth-shell {
    padding: 25px 16px;
  }

  .auth-card {
    padding: 30px 22px;
    border-radius: 20px;
  }

  .auth-heading h1,
  .success-content h1 {
    font-size: 26px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .auth-container,
  .ambient,
  .spinner {
    animation: none;
  }

  *, *::before, *::after {
    transition-duration: 0.01ms !important;
  }
}
</style>