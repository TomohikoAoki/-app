import { OK, CREATED } from '../util'

const state = {
    tasks: null,
    tasksApiStatus: null,
}

const getters = {
    taskData: (state) => (state.tasks ? state.tasks : []),
    tasksApiStatus: (state) => state.tasksApiStatus,
}

const mutations = {
    setTasks(state, tasks) {
        state.tasks = tasks
    },
    setTasksApiStatus(state, data) {
        state.tasksApiStatus = data
    }
}

const actions = {
    async getTasks({ commit }, shopId) {
        commit('setTasks', null)

        const response = await axios.get(`/api/task/${shopId}`)

        if (response.status === OK) {
            commit('setTasksApiStatus', true)

            commit('setTasks', response.data.data)

            return false
        }

        //エラー時
        commit('setTasksApiStatus', false)
        commit('error/setCode', response.status, { root: true })
    },
    async registerTask({ commit }, data) {
        const response = await axios.post("/api/task", data)

        if (response.status === CREATED) {
            commit('setTasksApiStatus', true)

            let tasks = state.tasks

            if (tasks) {
                tasks.push(response.data)
            } else {
                tasks = [response.data]
            }

            commit('setTasks', tasks)

            return false
        }

        //エラー時
        commit('setTasksApiStatus', false)
        commit('error/setCode', response.status, { root: true })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}