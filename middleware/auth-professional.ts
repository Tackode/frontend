import { Middleware } from '@nuxt/types'

const AuthProfessional: Middleware = ({ store, redirect, app }) => {
  if (store.getters['session/role'] !== 'Professional') {
    redirect(app.localePath('/login'))
  }
}

export default AuthProfessional
