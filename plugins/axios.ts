import { Plugin } from '@nuxt/types'

const axiosPlugin: Plugin = ({ $axios, $config, store }) => {
  $axios.defaults.baseURL = $config.apiUrl

  $axios.onRequest((config) => {
    const username = store.getters['session/login']
    const password = store.getters['session/token']

    if (username != null && password != null) {
      config.auth = { username, password }
    }
  })
}

export default axiosPlugin
