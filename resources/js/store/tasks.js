import { OK } from '../util'

const state = {
    tasks: null,
}

const getters = {
    taskData: (state) => (state.tasks ? state.tasks : []),
}

const mutations = {
    setTasks(state, tasks) {
        state.tasks = tasks
    }
}

const actions = {
    async getTasks({ commit }, shopId) {
        commit('setTasks', null)

        const response = await axios.get(`/api/task/${shopId}`)

        if (response.status === OK) {
            commit('setTasks', response.data.data)

        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}