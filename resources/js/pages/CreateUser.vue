<template>
    <div class="container card">
        <h2 class="title">ユーザー登録</h2>
        <div>
            <div v-if="registerErrors" class="alert alert-danger">
                <p>サーバーエラー</p>
                <ul v-for="(value, key) in registerErrors" :key="key">
                    <li v-for="msg in value" :key="msg">
                        {{ msg }}
                    </li>
                </ul>
            </div>
            <ValidationObserver ref="obs" v-slot="ObserverProps">
                <form @submit.prevent="register" class="form-horizontal form">
                    <div class="form-group row">
                        <label
                            for="username"
                            class="col-md-3 d-flex align-items-center"
                            >名前</label
                        >
                        <ValidationProvider
                            rules="required|max:25"
                            mode="lazy"
                            name="username"
                            class="col-md-9"
                        >
                            <div slot-scope="ProviderProps">
                                <input
                                    type="text"
                                    id="username"
                                    v-model="registerForm.name"
                                    class="form-control"
                                />
                                <p class="text-danger small">
                                    {{ ProviderProps.errors[0] }}
                                </p>
                            </div>
                        </ValidationProvider>
                    </div>
                    <div class="form-group row">
                        <label
                            for="password"
                            class="col-md-3 d-flex align-items-center"
                            >パスワード</label
                        >
                        <ValidationProvider
                            rules="required|min:6|alpha_dash"
                            name="password"
                            class="col-md-9"
                        >
                            <div slot-scope="ProviderProps">
                                <input
                                    type="password"
                                    id="password"
                                    v-model="registerForm.password"
                                    class="form-control"
                                />
                                <p class="text-danger small">
                                    {{ ProviderProps.errors[0] }}
                                </p>
                            </div>
                        </ValidationProvider>
                    </div>
                    <div class="form-group row">
                        <label
                            for="password-confirm"
                            class="col-md-3 d-flex align-items-center"
                            >再パスワード</label
                        >
                        <ValidationProvider
                            rules="required|confirmed:password"
                            mode="eager"
                            name="password_confirm"
                            class="col-md-9"
                        >
                            <div slot-scope="ProviderProps">
                                <input
                                    type="password"
                                    id="password-confirm"
                                    v-model="registerForm.password_confirmation"
                                    class="form-control"
                                />
                                <p class="text-danger small">
                                    {{ ProviderProps.errors[0] }}
                                </p>
                            </div>
                        </ValidationProvider>
                    </div>
                    <div v-if="userAuthority === 1" class="form-group row">
                        <label class="col-md-3 d-flex align-items-center"
                            >権限</label
                        >
                        <ValidationProvider
                            rules="required|oneOf:1,2,3"
                            class="col-md-9"
                            name="authority"
                        >
                            <div slot-scope="ProviderProps" class="radio-wrap">
                                <div class="form-check">
                                    <input
                                        type="radio"
                                        value="1"
                                        id="admin"
                                        v-model="registerForm.authority"
                                        class="form-check-input"
                                    />
                                    <label for="admin" class="form-check-label"
                                        >管理者</label
                                    >
                                </div>
                                <div class="form-check">
                                    <input
                                        type="radio"
                                        value="2"
                                        id="shop-admin"
                                        v-model="registerForm.authority"
                                        class="form-check-input"
                                    />
                                    <label
                                        for="shop-admin"
                                        class="form-check-label"
                                        >店舗管理者</label
                                    >
                                </div>
                                <div class="form-check">
                                    <input
                                        type="radio"
                                        value="3"
                                        id="user"
                                        v-model="registerForm.authority"
                                        class="form-check-input"
                                    />
                                    <label for="user" class="form-check-label"
                                        >ユーザー</label
                                    >
                                </div>
                                <p class="text-danger small">
                                    {{ ProviderProps.errors[0] }}
                                </p>
                            </div>
                        </ValidationProvider>
                    </div>
                    <div class="form-group row">
                        <label
                            for="employee_code"
                            class="col-md-3 d-flex align-items-center"
                            >社員コード</label
                        >
                        <ValidationProvider
                            rules="regex:^([0-9]{6})$"
                            name="employee_code"
                            class="col-md-9"
                        >
                            <div slot-scope="ProviderProps">
                                <input
                                    type="text"
                                    id="employee_code"
                                    v-model="registerForm.employee_code"
                                    class="form-control"
                                />
                                <p class="text-danger small">
                                    {{ ProviderProps.errors[0] }}
                                </p>
                            </div>
                        </ValidationProvider>
                    </div>

                    <div v-if="userAuthority === 1" class="form-group row">
                        <label
                            for="shop_id"
                            class="col-md-3 d-flex align-items-center"
                            >店舗名</label
                        >
                        <ValidationProvider
                            :rules="`required|${shopOneOf}`"
                            name="shop"
                            class="col-md-8"
                        >
                            <div slot-scope="ProviderProps">
                                <select
                                    v-model="registerForm.shop_id"
                                    id="shop_id"
                                    class="form-control"
                                >
                                    <option disabled value="">
                                        所属店舗を選んで下さい
                                    </option>
                                    <option
                                        v-for="shop in shops"
                                        :value="shop.value"
                                        :key="shop.value"
                                    >
                                        {{ shop.label }}
                                    </option>
                                </select>
                                <p class="text-danger small">
                                    {{ ProviderProps.errors[0] }}
                                </p>
                            </div>
                        </ValidationProvider>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-3 d-flex align-items-center"
                            >作業ポジション</label
                        >
                        <ValidationProvider
                            :rules="`required|${posiOneOf}`"
                            name="position"
                            class="col-md-9"
                        >
                            <div slot-scope="ProviderProps" class="radio-wrap">
                                <div
                                    v-for="position in Positions"
                                    :key="position.value"
                                    class="form-check"
                                >
                                    <input
                                        type="radio"
                                        :value="position.value"
                                        v-model="registerForm.position_id"
                                        class="form-check-input"
                                    />
                                    <label class="form-check-label">{{ position.label }}</label>
                                </div>
                                <p class="text-danger small">
                                    {{ ProviderProps.errors[0] }}
                                </p>
                            </div>
                        </ValidationProvider>
                    </div>
                    <div class="form-group row">
                        <label
                            for="lunk"
                            class="col-md-3 d-flex align-items-center"
                            >ランク・役職</label
                        >
                        <ValidationProvider
                            :rules="`required|${lunkOneOf}`"
                            name="lunk"
                            class="col-md-8"
                        >
                            <div slot-scope="ProviderProps">
                                <select
                                    v-model="registerForm.lunk"
                                    id="lunk"
                                    class="form-control"
                                >
                                    <option disabled value="">
                                        ランク・役職を選んで下さい
                                    </option>
                                    <option
                                        v-for="lunk in Lunks"
                                        :key="lunk.value"
                                        :value="lunk.value"
                                    >
                                        {{ lunk.label }}
                                    </option>
                                </select>
                                <p class="text-danger small">
                                    {{ ProviderProps.errors[0] }}
                                </p>
                            </div>
                        </ValidationProvider>
                    </div>
                    <div class="form-group row">
                        <label
                            for="email"
                            class="col-md-3 d-flex align-items-center"
                            >メールアドレス</label
                        >
                        <ValidationProvider
                            rules="email"
                            mode="lazy"
                            name="email"
                            class="col-md-9"
                        >
                            <div slot-scope="ProviderProps">
                                <input
                                    type="text"
                                    id="email"
                                    v-model="registerForm.email"
                                    class="form-control"
                                />
                                <p class="text-danger small">
                                    {{ ProviderProps.errors[0] }}
                                </p>
                            </div>
                        </ValidationProvider>
                    </div>
                    <div class="form-footer">
                        <button
                            type="submit"
                            class="btn btn-dark"
                            :disabled="ObserverProps.invalid"
                        >
                            登録
                        </button>
                    </div>
                </form>
            </ValidationObserver>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

//vee-Validate関係
import { ValidationProvider, ValidationObserver } from "vee-validate";

//プライベート
function $_getKeyForValid(str, arr) {
    arr.forEach((item) => {
        str += item.value + ",";
    });
    return str;
}

export default {
    data() {
        return {
            registerForm: {
                name: "",
                password: "",
                password_confirmation: "",
                employee_code: "",
                shop_id: "",
                position_id: "",
                authority: "",
                lunk: "",
                email: "",
            },
        };
    },
    components: {
        ValidationObserver,
        ValidationProvider,
    },
    methods: {
        async register() {
            if (await this.$refs.obs.validate()) {
                if (this.userAuthority == 2) {
                    this.registerForm.shop_id = this.shopId;
                    this.registerForm.authority = 3;
                }

                this.$store.dispatch("auth/createUser", this.registerForm);
            }
        },
        clearError() {
            this.$store.commit("auth/setRegisterErrorMessages", null);
        },
    },
    computed: {
        ...mapState({
            registerErrors: (state) => state.auth.registerErrorMessages,
            apiStatus: (state) => state.auth.apiStatus,
            //バリデーションルール用テキストを返す
            lunkOneOf: (state) =>
                $_getKeyForValid("oneOf:", state.options.lunks),
            posiOneOf: (state) =>
                $_getKeyForValid("oneOf:", state.options.positions),
            shopOneOf: (state) =>
                $_getKeyForValid("oneOf:", state.options.shops),
        }),
        ...mapGetters({
            userAuthority: "auth/getAuthority",
            shopId: "auth/getShopId",
            Lunks: "options/Lunks",
            Positions: "options/Positions",
            shops: "options/Shops",
        }),
    },
    created() {
        this.clearError();
    },
    watch: {},
};
</script>

<style lang="scss" scoped>
.card {
    background: rgb(240, 239, 255);
    background: linear-gradient(
        90deg,
        rgba(240, 239, 255, 1) 0%,
        rgba(243, 252, 254, 1) 100%
    );
    padding-bottom: 50px;
}
.title {
    padding: 1.7em 0;
    margin: 0;
}
.form {
    max-width: 700px;
    margin: 0 auto;
}
.radio-wrap {
    display: flex;
    .form-check {
        margin-right: 1em;
    }
}
.form-footer {
    display: flex;
    justify-content: center;
    margin: 50px 0 0 0;
    .btn {
        margin: 0 auto;
    }
}
</style>
