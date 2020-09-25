import { Middleware } from '@nuxt/types'

const AuthGuest: Middleware = ({ store, redirect }) => {
  const role = store.getters['session/role']

  if (role === 'Public') {
    redirect('/user/check-ins')
  } else if (role === 'Professional') {
    redirect('/organization/places')
  }
}

export default AuthGuest
