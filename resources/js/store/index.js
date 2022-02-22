import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import error from './error'
import options from './options'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        auth,
        error,
        options,
    }
})

export default store
