module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/attributes-order': 'off',
    'vue/require-default-prop': 'off',
  },
  ignorePatterns: ['static/vendors/*'],
}
