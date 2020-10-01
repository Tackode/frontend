import { Plugin } from '@nuxt/types'

const vuexInitPlugin: Plugin = ({ store }) => {
  store.commit('session/loadFromStorage')
}

export default vuexInitPlugin
