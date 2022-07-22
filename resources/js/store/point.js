import { OK, CREATED } from "../util";

const state = {
    sendData: [],
    pointsAndUsers: null,
    pointsWithUser: null,
    pointApiStatus: null,
};

const getters = {
    getSendData: (state) => state.sendData,
    getSendDataFlag: (state) => state.sendData.length !== 0,
    pointsAndUsers: (state) => state.pointsAndUsers,
    pointsWithUser: (state) =>
        state.pointsWithUser ? state.pointsWithUser : "",
    getPointApiStatus: (state) => state.pointApiStatus,
};

const mutations = {
    setSendData(state, data) {
        state.sendData = data;
    },
    clearSendData(state) {
        state.sendData = [];
    },
    setPointsAndUsers(state, data) {
        state.pointsAndUsers = data
    },
    setPointsWithUser(state, data) {
        state.pointsWithUser = data;
    },
    setPointApiStatus(state, data) {
        state.pointApiStatus = data;
    },
};

const actions = {
    putPoints({ commit }, data) {
        commit("setSendData", data);
    },
    clearPoints({ commit }) {
        commit("clearSendData");
    },
    async getPointsAndUsers({ commit }, shopId) {
        const response = await axios.get(`api/point/${shopId}`)

        if (response.status === OK) {
            commit("setPointApiStatus", true);

            commit('setPointsAndUsers', response.data.data)

            return false
        }

        //エラー時
        commit("setPointApiStatus", false);
        commit("error/setCode", response.status, { root: true });

    },
    async sendPoints({ state, commit }) {
        const response = await axios.post("/api/point", state.sendData);

        if (response.status === CREATED) {
            commit("setPointApiStatus", true);
            commit("clearSendData");

            return false;
        }

        //エラー時
        commit("setPointApiStatus", false);
        commit("error/setCode", response.status, { root: true });
    },
    async getPointWithUser({ commit }, userId) {
        const response = await axios.get(`/api/point?user_id=${userId}`);

        if (response.status === OK) {
            commit("setPointApiStatus", true);
            commit("setPointsWithUser", response.data.data);

            return false
        }

        //エラー時
        commit("setPointApiStatus", false);
        commit("error/setCode", response.status, { root: true });
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
