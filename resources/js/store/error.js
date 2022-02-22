const state = {
    code: null
}

const mutations = {
    setCode(state, code) {
        state.code = code
    }
}

const actions = {
    putErrorCode({ commit }, data) {
        commit('setCode', data)
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}