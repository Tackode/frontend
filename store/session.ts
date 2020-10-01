interface State {
  login: string | null
  token: string | null
  email: string | null
  role: string | null
}

type SessionData = {
  login: string
  token: string
  email: string
  role: string
}

function setInLocalStorage(key: string, value?: string) {
  if (value != null) {
    localStorage.setItem(key, value)
  } else {
    localStorage.removeItem(key)
  }
}

const state = (): State => ({
  login: null,
  token: null,
  email: null,
  role: null,
})

const mutations = {
  loadFromStorage(state: State) {
    state.login = localStorage.getItem('login')
    state.token = localStorage.getItem('token')
    state.email = localStorage.getItem('email')
    state.role = localStorage.getItem('role')
  },
  setSession(state: State, session: SessionData) {
    state.login = session.login
    setInLocalStorage('login', session.login)

    state.token = session.token
    setInLocalStorage('token', session.token)

    state.email = session.email
    setInLocalStorage('email', session.email)

    state.role = session.role
    setInLocalStorage('role', session.role)
  },
  logout(state: State) {
    state.login = null
    setInLocalStorage('login')

    state.token = null
    setInLocalStorage('token')

    state.email = null
    setInLocalStorage('email')

    state.role = null
    setInLocalStorage('role')
  },
}

const getters = {
  login(state: State): string | null {
    return state.login
  },
  token(state: State): string | null {
    return state.token
  },
  email(state: State): string | null {
    return state.email
  },
  role(state: State): string | null {
    return state.role
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions: {},
  mutations,
}
