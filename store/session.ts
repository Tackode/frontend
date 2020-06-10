interface State {
  sessionId: string | null
}

const state = (): State => ({
  sessionId: null
})

const actions = {
  setSessionId({ commit }: any, sessionId: string | null) {
    commit('SET_SESSION_ID', sessionId)
  }
}

const mutations = {
  SET_SESSION_ID(state: State, sessionId: string | null) {
    localStorage.setItem('sessionId', sessionId ?? '')
    state.sessionId = sessionId
  }
}

const getters = {
  sessionId(state: State): string | null {
    return state.sessionId
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
