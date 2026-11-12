export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@fontsource-variable/inter', '~/assets/css/main.css', '~/assets/css/theme.css'],
  // Diisi dari NUXT_PUBLIC_SUPABASE_URL dan NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabasePublishableKey: ''
    }
  },
  app: {
    head: {
      title: 'Rinciin — Personal Finance Tracker',
      htmlAttrs: { lang: 'id' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Rinciin — pencatatan keuangan pribadi yang rapi dan cepat.' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [
        {
          // Terapkan tema sebelum render pertama agar tidak berkedip
          innerHTML:
            "try{if(localStorage.getItem('pulsa-theme')==='dark')document.documentElement.classList.add('dark');var l=localStorage.getItem('pulsa-lang');if(l)document.documentElement.lang=l}catch(e){}"
        }
      ]
    }
  },
  typescript: { strict: true }
})
