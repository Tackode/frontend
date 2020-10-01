import { Middleware } from '@nuxt/types'

const AuthUser: Middleware = ({ store, redirect, app }) => {
  if (store.getters['session/role'] == null) {
    redirect(app.localePath('/login/'))
  }
}

export default AuthUser
