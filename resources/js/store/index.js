import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import error from './error'
import options from './options'
import point from './point'
import tasks from './tasks'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        auth,
        error,
        options,
        point,
        tasks,
    }
})

export default store