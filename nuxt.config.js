import dotenv from 'dotenv'

// Prepare env variables
dotenv.config()

console.log('API_URL:', process.env.API_URL)
console.log('CSP:', process.env.CSP)

export default {
  dev: process.env.NODE_ENV !== 'production',
  /*
   ** Headers of the page
   */
  server: {
    host: process.env.HOST,
    port: 4000,
  },
  telemetry: false,
  head: {
    title: 'Covid Journal',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          "Enregistrez votre passage et soyez notifié d'un contact potentiel avec une personne infectée.",
      },
      { hid: 'og:type', name: 'og:type', content: 'website' },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Bienvenue sur Covid-Journal !',
      },
      { hid: 'og:site_name', name: 'og:site_name', content: 'Covid-Journal' },
      {
        hid: 'og:description',
        name: 'og:description',
        content:
          "Enregistrez votre passage et soyez notifié d'un contact potentiel avec une personne infectée.",
      },
      { name: 'msapplication-TileColor', content: '#5299d3' },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/icon.png' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/main.scss'],
  styleResources: {
    scss: ['@/assets/css/_variables.scss'],
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/formatters',
    '~plugins/qrcode',
    { src: '~plugins/vcalendar', mode: 'client' },
    '~plugins/vue2picker',
    '~plugins/i18n',
    { src: '~plugins/qrcodereader', mode: 'client' },
    { src: '~/plugins/axios', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/style-resources',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    [
      'nuxt-i18n',
      {
        locales: [
          {
            name: 'English',
            code: 'en',
            iso: 'en-EN',
            file: 'en-EN.js',
          },
          {
            name: 'Français',
            code: 'fr',
            iso: 'fr-FR',
            file: 'fr-FR.js',
          },
        ],
        strategy: 'prefix_and_default',
        defaultLocale: 'fr',
        vueI18nLoader: true,
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected',
          alwaysRedirect: true,
        },
      },
    ],
    [
      'nuxt-env',
      {
        keys: ['FRONT_URL', 'API_URL'],
      },
    ],
  ],
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: false,
  },
  /*
   ** Build configuration
   */
  build: {
    cache: true,
    hardSource: true,
    parallel: true,
    ssr: true,
  },
  render: {
    csp:
      process.env.NODE_ENV !== 'production'
        ? false
        : {
            reportOnly: true,
            hashAlgorithm: 'sha256',
            policies: {
              'default-src': ["'self'"],
              'img-src': ['https:', 'data:'],
              'worker-src': ["'self'", `blob:`],
              'style-src': ["'self'", "'unsafe-inline'"],
              'script-src': [
                "'self'",
                'https://webrtc.github.io/adapter/adapter-7.6.3.js',
                'https://cdn.jsdelivr.net/npm/jsqr@1.3.1/dist/jsQR.min.js',
              ],
              'form-action': ["'self'"],
              'frame-ancestors': ["'none'"],
              'object-src': ["'none'"],
              'connect-src': [`api.covid-journal.org`, `covid-journal.org`],
            },
          },
  },
}
