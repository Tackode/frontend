import { Middleware } from '@nuxt/types'

const AuthGuest: Middleware = ({ store, redirect, app }) => {
  const role = store.getters['session/role']

  if (role === 'Public') {
    redirect(app.localePath('/user/check-ins/'))
  } else if (role === 'Professional') {
    redirect(app.localePath('/organization/places/'))
  }
}

export default AuthGuest
