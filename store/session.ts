interface State {
  login: string | null
  token: string | null
  email: string | null
  role: string | null
}

const state = (): State => {
  if (process.client && window && window.localStorage) {
    return {
      login: localStorage.getItem('login'),
      token: localStorage.getItem('token'),
      email: localStorage.getItem('email'),
      role: localStorage.getItem('role'),
    }
  } else {
    return {
      login: null,
      token: null,
      email: null,
      role: null,
    }
  }
}

const actions = {
  setSession({ commit }: any, session: any) {
    commit('SET_LOGIN', session.login)
    commit('SET_TOKEN', session.token)
    commit('SET_EMAIL', session.user.email)
    commit('SET_ROLE', session.user.role)
  },

  logout({ commit }: any) {
    commit('SET_LOGIN', null)
    commit('SET_TOKEN', null)
    commit('SET_EMAIL', null)
    commit('SET_ROLE', null)
    commit('SET_LOCAL_EMAIL', null)
  },
}

const mutations = {
  SET_LOGIN(state: State, login: string | null) {
    if (login) {
      localStorage.setItem('login', login)
    } else {
      localStorage.removeItem('login')
    }

    state.login = login
  },
  SET_TOKEN(state: State, token: string | null) {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }

    state.token = token
  },
  SET_EMAIL(state: State, email: string | null) {
    if (email) {
      localStorage.setItem('email', email)
    } else {
      localStorage.removeItem('email')
    }

    state.email = email
  },
  SET_ROLE(state: State, role: string | null) {
    if (role) {
      localStorage.setItem('role', role)
    } else {
      localStorage.removeItem('role')
    }

    state.role = role
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
  actions,
  mutations,
}
