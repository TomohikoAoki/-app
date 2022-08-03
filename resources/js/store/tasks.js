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
    //タスク取得
    async getTasks({ commit }, shopId) {
        commit('setTasks', null)
        commit('setTasksApiStatus', null)

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
    //タスク登録
    //category_id: int, content: string, position_id: int(なぜかテキスト？), shop_id: intのオブジェクトを送信
    async registerTask({ commit }, data) {
        commit('setTasksApiStatus', null)

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
    },
    //タスクの編集
    //id: int, content: string のオブジェクトを送信
    async editTask({ commit }, taskData) {
        commit('setTasksApiStatus', null)

        const response = await axios.put("/api/task", taskData);

        if (response.status === OK) {
            commit('setTasksApiStatus', true)
            console.log(response.data)
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