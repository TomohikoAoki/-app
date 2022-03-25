const state = {
    sendData: [],
}

const getters = {
    getSendData: (state) => state.sendData,
    getSendDataFlag: (state) => state.sendData.length !== 0
}

const mutations = {
    setSendData(state, data) {
        state.sendData = data
    },
    clearSendData(state) {
        state.sendData = []
    }
}

const actions = {
    putPoints({ commit }, data) {
        commit('setSendData', data);
    },
    clearPoints({ commit }) {
        commit('clearSendData')
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}