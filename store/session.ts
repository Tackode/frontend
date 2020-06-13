interface State {
  login: string | null
  token: string | null
}

const state = (): State => ({
  login: null,
  token: null
})

const actions = {
  setSession({ commit }: any, session: any) {
    commit('SET_LOGIN', session.login)
    commit('SET_TOKEN', session.token)
  }
}

const mutations = {
  SET_LOGIN(state: State, login: string | null) {
    localStorage.setItem('login', login ?? '')
    state.login = login
  },
  SET_TOKEN(state: State, token: string | null) {
    localStorage.setItem('token', token ?? '')
    state.token = token
  }
}

const getters = {
  login(state: State): string | null {
    return state.login
  },
  token(state: State): string | null {
    return state.token
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
