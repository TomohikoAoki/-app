import { OK, CREATED, UNPROCESSABLE_ENTITY } from "../util";
import router from '../router'

const state = {
    user: null,
    apiStatus: null,
    loginErrorMessages: null,
    registerErrorMessages: null,
};

const getters = {
    checkUser: (state) => !!state.user,
    user: (state) => (state.user ? state.user : ""),
    getUserName: (state) => (state.user ? state.user.name : ""),
    getCurrentUserId: (state) => (state.user ? state.user.id : ""),
    getAuthority: (state) => (state.user ? state.user.authority : ""),
    getShopId: (state) => state.user ? state.user.shop_id : ""
};

const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    setApiStatus(state, status) {
        state.apiStatus = status;
    },
    setLoginErrorMessages(state, messages) {
        state.loginErrorMessages = messages;
    },
    setRegisterErrorMessages(state, messages) {
        state.registerErrorMessages = messages;
    },
};

const actions = {
    async createUser({ commit }, data) {
        commit("setApiStatus", null);
        const response = await axios.post("/api/user/create", data);

        if (response.status === CREATED) {
            commit("setApiStatus", true);
            router.push('/user-manage')
            return false;
        }

        commit("setApiStatus", false);
        if (response.status === UNPROCESSABLE_ENTITY) {
            commit("setRegisterErrorMessages", response.data.errors);
        } else {
            commit("error/setCode", response.status, { root: true });
        }
    },
    async login({ commit }, data) {
        commit("setApiStatus", null);
        const response = await axios.post("/api/login", data);

        if (response.status === OK) {
            commit("setApiStatus", true);
            commit("setUser", response.data.data);
            return false;
        }

        commit("setApiStatus", false);
        if (response.status === UNPROCESSABLE_ENTITY) {
            commit("setLoginErrorMessages", response.data.errors);
        } else {
            commit("error/setCode", response.status, { root: true });
        }
    },
    async logout({ commit }) {
        commit('setApiStatus', null)
        const response = await axios.post("/api/logout");

        if (response.status === OK) {
            commit('setApiStatus', true)
            commit('setUser', null)
            router.push('/');
            return false
        }

        commit('setApiStatus', false)
        commit('error/setCode', response.status, { root: true })
    },
    async currentUser({ commit }) {
        commit('setApiStatus', null)
        const response = await axios.get("/api/user");
        const user = response.data.data ? response.data.data : null;

        if (response.status === OK) {
            commit('setApiStatus', true)
            commit("setUser", user)
            return false
        }

        commit('setApiStatus', false)
        commit('error/setCode', response.status, { root: true })
    },
};

function isEmpty(obj) {
    return !Object.keys(obj).length;
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};