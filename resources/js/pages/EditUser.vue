<template>
    <div class="container card">
        <h2 class="title">ユーザー編集</h2>
        <div class="card-body">
            <h3 class="title-username">{{ data.name }}さんのデータ</h3>
            <ValidationObserver ref="obs" v-slot="ObserverProps">
                <form onsubmit="return false;" class="form form-horizontal">
                    <div class="form-group row" v-if="currentUserAuth == 1">
                        <label class="col-md-3 d-flex align-items-center"
                            >名前</label
                        >
                        <div class="col-md-9">
                            <div
                                v-if="switchEdit.name"
                                @click="changeEdit('name')"
                                class="decision"
                            >
                                {{ data.name }}
                            </div>
                            <div v-if="!switchEdit.name" class="input-area">
                                <ValidationProvider
                                    rules="required|max:25"
                                    name="username"
                                    mode="lazy"
                                >
                                    <div slot-scope="ProviderProps">
                                        <input
                                            type="text"
                                            v-model="data.name"
                                            class="form-control"
                                        />
                                        <p class="text-danger small">
                                            {{ ProviderProps.errors[0] }}
                                        </p>
                                    </div>
                                </ValidationProvider>
                                <button
                                    @click="changeEdit('name')"
                                    type="button"
                                >
                                    確定
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row" v-if="currentUserAuth == 1">
                        <label class="col-md-3 d-flex align-items-center"
                            >権限</label
                        >
                        <div class="col-md-9">
                            <div
                                v-if="switchEdit.authority"
                                @click="changeEdit('authority')"
                                class="decision"
                            >
                                {{ authLabels[data.authority] }}
                            </div>
                            <div
                                v-if="!switchEdit.authority"
                                class="input-area"
                            >
                                <ValidationProvider
                                    :rules="`required|${authOneOf}`"
                                    name="authority"
                                >
                                    <div
                                        slot-scope="ProviderProps"
                                        class="radio-wrap"
                                    >
                                        <div
                                            v-for="item in optionAuth"
                                            :key="item.value"
                                            class="form-check"
                                        >
                                            <input
                                                type="radio"
                                                :value="item.value"
                                                v-model="data.authority"
                                                :id="item.value"
                                                class="form-check-input"
                                            />

                                            <label
                                                :for="item.value"
                                                class="form-check-label"
                                                >{{ item.label }}</label
                                            >
                                        </div>
                                        <p class="text-danger small">
                                            {{ ProviderProps.errors[0] }}
                                        </p>
                                    </div>
                                </ValidationProvider>
                                <button
                                    @click="changeEdit('authority')"
                                    type="button"
                                >
                                    確定
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-3 d-flex align-items-center"
                            >社員コード</label
                        >
                        <div class="col-md-9">
                            <div
                                v-if="switchEdit.employee_code"
                                @click="changeEdit('employee_code')"
                                class="decision"
                            >
                                {{ data.employee_code }}
                            </div>
                            <div
                                v-if="!switchEdit.employee_code"
                                class="input-area"
                            >
                                <ValidationProvider
                                    rules="regex:^([0-9]{6})$"
                                    name="employee_code"
                                >
                                    <div slot-scope="ProviderProps">
                                        <input
                                            type="text"
                                            v-model="data.employee_code"
                                            class="form-control"
                                        />
                                        <p class="text-danger small">
                                            {{ ProviderProps.errors[0] }}
                                        </p>
                                    </div>
                                </ValidationProvider>
                                <button
                                    @click="changeEdit('employee_code')"
                                    type="button"
                                >
                                    確定
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row" v-if="currentUserAuth == 1">
                        <label class="col-md-3 d-flex align-items-center"
                            >店舗</label
                        >
                        <div class="col-md-9">
                            <div
                                v-if="switchEdit.shop_id"
                                @click="changeEdit('shop_id')"
                                class="decision"
                            >
                                {{ shopLabels[data.shop_id] }}
                            </div>
                            <div v-if="!switchEdit.shop_id" class="input-area">
                                <ValidationProvider
                                    :rules="`required|${shopOneOf}`"
                                    name="shop"
                                >
                                    <div slot-scope="ProviderProps">
                                        <select
                                            v-model="data.shop_id"
                                            class="form-control"
                                        >
                                            <option
                                                v-for="shop in filterShops"
                                                :key="shop.value"
                                                :value="shop.value"
                                                class="shop_options"
                                            >
                                                {{ shop.label }}
                                            </option>
                                        </select>
                                        <p class="text-danger small">
                                            {{ ProviderProps.errors[0] }}
                                        </p>
                                    </div>
                                </ValidationProvider>
                                <button
                                    @click="changeEdit('shop_id')"
                                    type="button"
                                >
                                    確定
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-3 d-flex align-items-center"
                            >ランク/役職</label
                        >
                        <div class="col-md-9">
                            <div
                                v-if="switchEdit.lunk"
                                @click="changeEdit('lunk')"
                                class="decision"
                            >
                                {{ lunkLabels[data.lunk] }}
                            </div>
                            <div v-if="!switchEdit.lunk" class="input-area">
                                <ValidationProvider
                                    :rules="`required|${lunkOneOf}`"
                                    name="lunk"
                                >
                                    <div slot-scope="ProviderProps">
                                        <select
                                            v-model="data.lunk"
                                            class="form-control"
                                        >
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
                                <button
                                    @click="changeEdit('lunk')"
                                    type="button"
                                >
                                    確定
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-3 d-flex align-items-center"
                            >ポジション</label
                        >
                        <div class="col-md-9">
                            <div
                                v-show="switchEdit.position_id"
                                @click="changeEdit('position_id')"
                                class="decision"
                            >
                                {{ positionLabels[data.position_id] }}
                            </div>
                            <div
                                v-show="!switchEdit.position_id"
                                class="input-area"
                            >
                                <ValidationProvider
                                    :rules="`required|${posiOneOf}`"
                                    name="position"
                                >
                                    <div
                                        slot-scope="ProviderProps"
                                        class="radio-wrap"
                                    >
                                        <div
                                            v-for="position in filterPositions"
                                            :key="position.value"
                                            class="form-check"
                                        >
                                            <input
                                                type="radio"
                                                :value="position.value"
                                                :id="position.value"
                                                v-model="data.position_id"
                                                class="form-check-input"
                                            />
                                            <label
                                                :for="position.value"
                                                class="form-check-label"
                                                >{{ position.label }}</label
                                            >
                                        </div>
                                        <p class="text-danger small">
                                            {{ ProviderProps.errors[0] }}
                                        </p>
                                    </div>
                                </ValidationProvider>
                                <button
                                    @click="changeEdit('position_id')"
                                    type="button"
                                >
                                    確定
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-3 d-flex align-items-center"
                            >メールアドレス</label
                        >
                        <div class="col-md-9">
                            <div
                                v-show="switchEdit.email"
                                @click="changeEdit('email')"
                                class="decision"
                            >
                                {{ data.email }}
                            </div>
                            <div v-show="!switchEdit.email" class="input-area">
                                <ValidationProvider rules="email" name="email">
                                    <div slot-scope="ProviderProps">
                                        <input
                                            type="text"
                                            v-model="data.email"
                                            class="form-control"
                                        />
                                        <span class="text-danger small">{{
                                            ProviderProps.errors[0]
                                        }}</span>
                                    </div>
                                </ValidationProvider>
                                <button
                                    @click="changeEdit('email')"
                                    type="button"
                                >
                                    確定
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        @click="updateUser"
                        class="btn btn-dark"
                        :disabled="
                            ObserverProps.invalid || !ObserverProps.validated
                        "
                    >
                        更新
                    </button>
                </form>
            </ValidationObserver>
            <BaseButton v-on:click.native="deleteUser"
                >ユーザーを削除する</BaseButton
            >
            <ModalConfirm></ModalConfirm>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { OK } from "../util";
import ModalConfirm from "../components/ModalConfirm.vue";
import BaseButton from "../components/parts/BaseButton.vue";

// vee-validate関係
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
            data: {
                name: "",
                employee_code: "",
                lunk: "",
                position_id: "",
                email: "",
                shop_id: "",
                authority: "",
            },
            switchEdit: {
                name: true,
                employee_code: true,
                lunk: true,
                position_id: true,
                email: true,
                shop_id: true,
                authority: true,
            },
        };
    },
    components: {
        ValidationProvider,
        ValidationObserver,
        ModalConfirm,
        BaseButton,
    },
    methods: {
        async changeEdit(key) {
            //validationObserverがエラー時は切り替わらない
            if (await this.$refs.obs.validate()) {
                //開くフィールド以外は閉じる
                for (let prop in this.switchEdit) {
                    this.switchEdit[prop] =
                        key === prop ? !this.switchEdit[prop] : true;
                }
            }
        },
        async fetchUserById() {
            const response = await axios.get(
                `/api/user/detail/${this.$route.params.id}`
            );

            const user = response.data.data;
            Object.keys(user).forEach((key) => {
                this.data[key] = user[key];
            });
        },
        async updateUser() {
            const response = await axios.put(
                `/api/user/detail/${this.$route.params.id}`,
                this.data
            );

            if (response.status === OK) {
                //編集したのがログインユーザーならcurrentUserを更新
                if (this.currentUserId == response.data.data.id) {
                    this.$store.dispatch("auth/currentUser");
                }

                this.$router.push("/user-manage");
            }
        },
        async deleteUser() {
            const response = await axios.delete(
                `/api/user/detail/${this.$route.params.id}`
            );
            if (response.status === OK) {
                this.$router.push("/user-manage");
            } else {
                this.$router.push("/500");
            }
        },
    },
    computed: {
        ...mapGetters({
            currentUserId: "auth/getCurrentUserId",
            currentUserAuth: "auth/getAuthority",
            Lunks: "options/Lunks",
            Positions: "options/Positions",
            shops: "options/Shops",
            optionAuth: "options/optionAuth",
            shopLabels: "options/shopLabels",
            lunkLabels: "options/lunkLabels",
            positionLabels: "options/positionLabels",
            authLabels: "options/authLabels",
        }),
        ...mapState("options", {
            //バリデーションルール用テキストを返す
            lunkOneOf: (state) => $_getKeyForValid("oneOf:", state.lunks),
            posiOneOf: (state) => $_getKeyForValid("oneOf:", state.positions),
            shopOneOf: (state) => $_getKeyForValid("oneOf:", state.shops),
            authOneOf: (state) => $_getKeyForValid("oneOf:", state.authority),
        }),
        //ポジション-共通は隠す
        filterPositions() {
            return this.Positions.filter((item) => Number(item.value) !== 3)
        },
        //店舗-共通は隠す
        filterShops() {
            return this.shops.filter((item) => Number(item.value) !== 99 )
        }
    },
    watch: {
        $route: {
            async handler() {
                await this.fetchUserById();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.title {
    padding: 1.7em 0;
    margin: 0;
}
.title-username {
    border-bottom: 1px solid;
    margin: 0 0 1.2em 0;
    padding: 0 0 0.3em 0.2em;
}
.card {
    background: rgb(240, 239, 255);
    background: linear-gradient(
        90deg,
        rgba(240, 239, 255, 1) 0%,
        rgba(243, 252, 254, 1) 100%
    );
    padding-bottom: 50px;
}

.input-area {
    display: flex;
}
.decision {
    height: 2em;
    width: 100%;
    font-size: 1.2em;
    cursor: pointer;
}
.btn {
    display: block;
    margin: 40px auto 0 auto;
}
.bottom-group {
    text-align: center;
    margin-top: 3em;
}

.radio-wrap {
    display: flex;
    .form-check {
        margin-right: 1em;
    }
}
.button {
    &.delete {
        border: 1px solid;
        padding: 1em;
        display: inline-block;
        border-radius: 5px;
    }
}
.shop-options {
    font-size: 2em;
}
</style>
