import { Middleware } from '@nuxt/types'

const AuthProfessional: Middleware = ({ store, redirect }) => {
  if (store.getters['session/role'] !== 'Professional') {
    redirect('/login')
  }
}

export default AuthProfessional
