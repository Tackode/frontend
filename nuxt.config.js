import dotenv from 'dotenv'

// Prepare env variables
dotenv.config()

console.log('API_URL:', process.env.API_URL)

export default {
  target: 'server',
  dev: process.env.NODE_ENV !== 'production',
  /*
   ** Headers of the page
   */
  server: {
    host: process.env.HOST,
    port: 4000,
  },
  router: {
    trailingSlash: true,
  },
  publicRuntimeConfig: {
    frontUrl: process.env.FRONT_URL,
    apiUrl: process.env.API_URL,
  },
  head: {
    titleTemplate: '%s - Covid-Journal',
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ff5a5f' },
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
    { src: '~plugins/vuex-init', mode: 'client' },
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
        defaultLocale: 'fr',
        baseUrl: process.env.FRONT_URL,
        vueI18nLoader: true,
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected',
          alwaysRedirect: true,
        },
      },
    ],
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    componentPlugins: [
      'ModalPlugin',
      'ToastPlugin',
      'FormPlugin',
      'FormCheckboxPlugin',
      'FormInputPlugin',
      'FormTextareaPlugin',
      'FormGroupPlugin',
      'ButtonPlugin',
      'CardPlugin',
      'DropdownPlugin',
      'ImagePlugin',
      'LayoutPlugin',
      'MediaPlugin',
      'NavbarPlugin',
      'TooltipPlugin',
      'AlertPlugin',
    ],
    components: ['BIcon', 'BIconPencilFill', 'BIconTrash', 'BIconInfoCircle'],
  },
  pwa: {
    meta: {
      name: 'Covid-Journal',
      description:
        "Enregistrez votre passage et soyez notifié d'un contact potentiel avec une personne infectée.",
      theme_color: '#ff5a5f',
      lang: 'fr',
      ogHost: process.env.FRONT_URL,
    },
    manifest: {
      name: 'Covid-Journal',
      short_name: 'CovidJournal',
      description:
        "Enregistrez votre passage et soyez notifié d'un contact potentiel avec une personne infectée.",
      background_color: '#f4f4f4',
      lang: 'fr',
    },
  },
  sitemap: {
    hostname: process.env.FRONT_URL,
    i18n: true,
    exclude: [
      '/validate-session',
      '/user/**',
      '/organization/**',
      '/en/validate-session',
      '/en/user/**',
      '/en/organization/**',
    ],
  },
  robots: {
    UserAgent: '*',
    Disallow: [
      '/validate-session',
      '/user',
      '/organization',
      '/en/validate-session',
      '/en/user',
      '/en/organization',
    ],
    Sitemap: `${process.env.FRONT_URL}/sitemap.xml`,
  },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: process.env.NODE_ENV === 'production',
    cache: process.env.NODE_ENV === 'production',
  },
}
