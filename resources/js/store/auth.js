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
    getUserName: (state) => (state.user ? state.user.name : ""),
    getCurrentUserId: (state) => (state.user.id ? state.user.id : ""),
    getAuthority: (state) => (state.user ? state.user.authority : ""),
    getShopId: (state) => state.user.profile.shop_id ? state.user.profile.shop_id : ""
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

        console.log(response)

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
            commit("setUser", response.data[0]);
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
        const user = !isEmpty(response.data) ? response.data[0] : null;

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