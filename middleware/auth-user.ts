import { Middleware } from '@nuxt/types'

const AuthUser: Middleware = ({ store, redirect }) => {
  if (store.getters['session/role'] == null) {
    redirect('/login')
  }
}

export default AuthUser
