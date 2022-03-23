import "./bootstrap";

import Vue from "vue";

import router from "./router";

import store from "./store";

import App from "./App.vue";

//vee-validation

import {
    extend,
    localize,
} from "vee-validate";

import ja from 'vee-validate/dist/locale/ja.json'

import {
    email,
    oneOf,
    required,
    confirmed,
    regex,
    max,
    min,
    alpha_dash,
} from "vee-validate/dist/rules";

extend("required", required);
extend("email", email);
extend("oneOf", oneOf);
extend("confirmed", confirmed);
extend("regex", regex);
extend('max', max);
extend('min', min);
extend('alpha_dash', alpha_dash);

const dict = {
    custom: {
        username: {
            required: 'Your name is empty'
        },
    },
    names: {
        username: '名前',
        password: 'パスワード',
        password_confirm: '再パスワード',
        employee_code: '社員コード',
        shop: '店舗',
        lunk: 'ランク・役職',
        position: 'ポジション',
        authority: '権限',
    },
    messages: {
        email: 'メールアドレスの形式が違います'
    },



}

localize('ja', ja);
localize('ja', dict);

//vee-validation end

import Helpers from "./helpers"

const plugin = {
    install() {
        Vue.prototype.$helpers = Helpers
    }
}

Vue.use(plugin)

const createApp = async() => {
    await store.dispatch("auth/currentUser");
    await store.dispatch("options/getShops");

    const app = new Vue({
        el: "#app",
        router,
        store,
        components: { App },
        template: "<App />",
    });

};

createApp();