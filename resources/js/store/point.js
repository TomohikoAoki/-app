import { OK, CREATED } from '../util'

const state = {
    sendData: [],
    pointsWithUser: null,
}

const getters = {
    getSendData: (state) => state.sendData,
    getSendDataFlag: (state) => state.sendData.length !== 0,
    pointsWithUser: (state) => (state.pointsWithUser ? state.pointsWithUser : "")
}

const mutations = {
    setSendData(state, data) {
        state.sendData = data
    },
    clearSendData(state) {
        state.sendData = []
    },
    setPointsWithUser(state, data) {
        state.pointsWithUser = data
    }
}

const actions = {
    putPoints({ commit }, data) {
        commit('setSendData', data);
    },
    clearPoints({ commit }) {
        commit('clearSendData')
    },
    async sendPoints({ state, commit }, shopId) {
        const response = await axios.post("/api/point", state.sendData)

        if (response.status === CREATED) {
            commit('clearSendData')
        }
    },
    async getPointWithUser({ commit }, userId) {
        const response = await axios.get(`/api/point?user_id=${userId}`)

        if (response.status === OK) {
            commit('setPointsWithUser', response.data.data)
        }

    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}