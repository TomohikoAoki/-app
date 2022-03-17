<template>
    <div>
        <h2>USER MANAGEMENT</h2>
        <div>
            <router-link to="/user-manage/create"
                ><BaseButtonVue>ユーザー登録</BaseButtonVue></router-link
            >
        </div>
        <div v-if="shopUsers">
            <section>
                <div v-for="(shop, key) in shopUsers" :key="key" class="card">
                    <h3 class="shop-name card-header">
                        {{ shopNames[key] }}
                    </h3>
                    <div class="card-body">
                        <div
                            v-for="(members, key) in shop"
                            :key="key"
                            class="role"
                        >
                            <h4 class="role__name">{{ key }}</h4>
                            <div
                                v-for="member in members"
                                :key="member.id"
                                class="user"
                            >
                                <div>
                                    <p class="user__employee-code">
                                        {{ member.employee_code }}
                                    </p>
                                    <p class="user__name">
                                        {{ member.name }}
                                    </p>
                                </div>
                                <div>
                                    <router-link
                                        :to="`/user-manage/edit/${member.id}`"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            enable-background="new 0 0 24 24"
                                            height="45px"
                                            viewBox="0 0 24 24"
                                            width="45px"
                                            fill="#666666"
                                        >
                                            <g>
                                                <path
                                                    d="M0,0h24v24H0V0z"
                                                    fill="none"
                                                />
                                            </g>
                                            <g>
                                                <g>
                                                    <path
                                                        d="M10.67,13.02C10.45,13.01,10.23,13,10,13c-2.42,0-4.68,0.67-6.61,1.82C2.51,15.34,2,16.32,2,17.35V19c0,0.55,0.45,1,1,1 h8.26C10.47,18.87,10,17.49,10,16C10,14.93,10.25,13.93,10.67,13.02z"
                                                    />
                                                    <circle
                                                        cx="10"
                                                        cy="8"
                                                        r="4"
                                                    />
                                                    <path
                                                        d="M20.75,16c0-0.22-0.03-0.42-0.06-0.63l0.84-0.73c0.18-0.16,0.22-0.42,0.1-0.63l-0.59-1.02c-0.12-0.21-0.37-0.3-0.59-0.22 l-1.06,0.36c-0.32-0.27-0.68-0.48-1.08-0.63l-0.22-1.09c-0.05-0.23-0.25-0.4-0.49-0.4h-1.18c-0.24,0-0.44,0.17-0.49,0.4 l-0.22,1.09c-0.4,0.15-0.76,0.36-1.08,0.63l-1.06-0.36c-0.23-0.08-0.47,0.02-0.59,0.22l-0.59,1.02c-0.12,0.21-0.08,0.47,0.1,0.63 l0.84,0.73c-0.03,0.21-0.06,0.41-0.06,0.63s0.03,0.42,0.06,0.63l-0.84,0.73c-0.18,0.16-0.22,0.42-0.1,0.63l0.59,1.02 c0.12,0.21,0.37,0.3,0.59,0.22l1.06-0.36c0.32,0.27,0.68,0.48,1.08,0.63l0.22,1.09c0.05,0.23,0.25,0.4,0.49,0.4h1.18 c0.24,0,0.44-0.17,0.49-0.4l0.22-1.09c0.4-0.15,0.76-0.36,1.08-0.63l1.06,0.36c0.23,0.08,0.47-0.02,0.59-0.22l0.59-1.02 c0.12-0.21,0.08-0.47-0.1-0.63l-0.84-0.73C20.72,16.42,20.75,16.22,20.75,16z M17,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S18.1,18,17,18z"
                                                    />
                                                </g>
                                            </g>
                                        </svg>
                                    </router-link>
                                    <router-link to="">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            enable-background="new 0 0 24 24"
                                            height="45px"
                                            viewBox="0 0 24 24"
                                            width="45px"
                                            fill="#666666"
                                        >
                                            <g>
                                                <rect
                                                    fill="none"
                                                    height="24"
                                                    width="24"
                                                />
                                                <rect
                                                    fill="none"
                                                    height="24"
                                                    width="24"
                                                />
                                            </g>
                                            <g>
                                                <g>
                                                    <path
                                                        d="M20,3H4C2.9,3,2,3.9,2,5v14c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V5 C22,3.9,21.1,3,20,3z M9,17H6c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1h3c0.55,0,1,0.45,1,1C10,16.55,9.55,17,9,17z M9,13H6 c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1h3c0.55,0,1,0.45,1,1C10,12.55,9.55,13,9,13z M9,9H6C5.45,9,5,8.55,5,8c0-0.55,0.45-1,1-1h3 c0.55,0,1,0.45,1,1C10,8.55,9.55,9,9,9z M18.7,11.12l-3.17,3.17c-0.39,0.39-1.03,0.39-1.42,0l-1.41-1.42 c-0.39-0.39-0.39-1.02,0-1.41c0.39-0.39,1.02-0.39,1.41,0l0.71,0.71l2.47-2.47c0.39-0.39,1.02-0.39,1.41,0l0.01,0.01 C19.09,10.1,19.09,10.74,18.7,11.12z"
                                                        fill-rule="evenodd"
                                                    />
                                                </g>
                                            </g>
                                        </svg>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { OK } from "../util";
import BaseButtonVue from "../components/parts/BaseButton.vue";

export default {
    data() {
        return {
            shopUsers: {},
        };
    },
    components: {
        BaseButtonVue,
    },
    methods: {
        async fetchUsers() {
            //管理者なら全部取得、店舗リーダーなら店舗ユーザー取得
            let id = this.userAuth == 1 ? "0" : this.shopId;

            const response = await axios.get(`api/user/get/${id}`);

            //エラー時
            if (response.status !== OK) {
                this.$store.dispatch("error/putErrorCode", response.status);
                return false;
            }

            const users = response.data.data;
            this.shopUsers = {};

            users.forEach((user) => {
                //管理者除外
                if (user.authority == 1) {
                    return false;
                }

                let shopId = user.shop_id;

                //店舗があればそこに追加
                if (shopId in this.shopUsers) {
                    if (user.authority == 2) {
                        this.shopUsers[shopId].leaders.push(user);
                        return false;
                    }

                    this.shopUsers[shopId].members.push(user);
                    return false;
                }

                //店舗が無ければオブジェクト作成
                this.shopUsers[shopId] = { leaders: [], members: [] };

                if (user.authority == 2) {
                    this.shopUsers[shopId].leaders.push(user);
                    return false;
                }

                this.shopUsers[shopId].members.push(user);
            });
        },
    },
    computed: {
        ...mapGetters({
            shopId: "auth/getShopId",
            userAuth: "auth/getAuthority",
            shopNames: "options/shopLabels",
        }),
    },
    watch: {
        $route: {
            async handler() {
                await this.fetchUsers();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss">
.card {
    margin: 20px 0;
    color: #333;
    padding: 0 0 0 0;
}
.shop-name.card-header {
    width: 100%;
    color: #333;
    padding: 1em 0 1em 1em;
    margin: 0 0;
    box-sizing: border-box;
}
.role {
    &__name {
        color: #b6b6b6;
        padding: 1em 0 0.3em 0;
    }
    .user {
        border-bottom: 1px dotted #c4c4c4;
        padding: 0.5em 0.3em;
        font-size: 1.25em;
        width: 95%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
            display: flex;
            margin: 0;
            align-items: center;
            padding: 0;
            .user__name {
                padding: 0;
                margin: 0;
                line-height: 1em;
            }
            .user__employee-code {
                font-size: 0.9em;
                padding-right: 1em;
                line-height: 1em;
                margin: 0;
            }
            a {
                svg {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
