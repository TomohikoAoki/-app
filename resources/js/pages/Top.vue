<template>
    <div>
        <h2>トップ</h2>
        <div>
            <form class="form" @submit.prevent="login">
                <div v-if="loginErrors" class="alert alert-danger">
                    <p>エラーです</p>
                    <ul v-if="loginErrors.name">
                        <li v-for="msg in loginErrors.name" :key="msg">
                            {{ msg }}
                        </li>
                    </ul>
                    <ul v-if="loginErrors.password">
                        <li v-for="msg in loginErrors.password" :key="msg">
                            {{ msg }}
                        </li>
                    </ul>
                </div>
                <div class="form-group">
                    <label for="login-name" class="form-label"
                        >ログインID</label
                    >
                    <input
                        type="text"
                        id="login-name"
                        v-model="loginForm.name"
                        class="form-control"
                        aria-describedby="inputGroupPrepend"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="login-password">パスワード</label>
                    <input
                        type="password"
                        id="login-password"
                        v-model="loginForm.password"
                        class="form-control"
                        required
                    />
                </div>
                <button type="submit" class="btn btn-primary">LOGIN</button>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import store from "../store";
import router from "../router";

export default {
    data() {
        return {
            loginForm: {
                name: "",
                password: "",
            },
        };
    },
    methods: {
        async login() {
            await this.$store.dispatch("auth/login", this.loginForm);

            if (this.apiStatus) {
                switch (this.authority) {
                    case 1:
                        this.$router.push("home/master");
                        break;
                    case 2:
                        this.$router.push("home/leader");
                        break;
                    case 3:
                        this.$router.push("home/user");
                        break;
                }
            }
        },
        clearError() {
            this.$store.commit("auth/setLoginErrorMessages", null);
        },
    },
    computed: {
        ...mapState({
            apiStatus: (state) => state.auth.apiStatus,
            loginErrors: (state) => state.auth.loginErrorMessages,
        }),
        ...mapGetters({ authority: "auth/getAuthority" }),
    },
    created() {
        this.clearError();
    },
    beforeRouteEnter(to, from, next) {
        switch (store.getters["auth/getAuthority"]) {
            case 1:
                router.push("/home/master");
                break;
            case 2:
                router.push("/home/leader");
                break;
            case 3:
                router.push("/home/user");
                break;
            default:
                next();
        }
    },
};
</script>

<style scoped>
h2 {
    text-align: center;
}
</style>
