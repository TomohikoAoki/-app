<template>
    <div class="modaler" @click.self="closeModal">
        <div class="modaler-content">
            <nav class="navigation">
                <ul>
                    <router-link
                        to="/home/master"
                        @click.native="closeModal"
                        tag="li"
                        >ホーム</router-link
                    >
                    <router-link to="" @click.native="closeModal" tag="li"
                        >アカウント設定</router-link
                    >
                    <router-link
                        to="/user-manage"
                        @click.native="closeModal"
                        tag="li"
                        >ユーザー管理</router-link
                    >
                    <router-link
                        to="/shop-manage"
                        @click.native="closeModal"
                        tag="li"
                        v-if="currentAuth == 1"
                        >店舗管理</router-link
                    >
                    <router-link
                        to="/task-manage"
                        @click.native="closeModal"
                        tag="li"
                        >タスク管理</router-link
                    >
                    <router-link
                        to="/point-manage"
                        @click.native="closeModal"
                        tag="li"
                        >ポイント管理</router-link
                    >
                    <router-link
                        to="/point-manage"
                        @click.native="logout"
                        tag="li"
                        >ログアウト</router-link
                    >
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";
import { mapGetters } from "vuex";

export default {
    data() {
        return {};
    },
    methods: {
        closeModal() {
            this.$emit("emitClose");
        },
        async logout() {
            this.closeModal()
            this.$store.dispatch("auth/logout");
        },
    },
    computed: {
        ...mapGetters({
            currentAuth: "auth/getAuthority",
            isLogin: "auth/checkUser",
        }),
    },
    mounted() {
        const modal = document.querySelector(".modaler");
        disableBodyScroll(modal);
    },
    beforeDestroy() {
        clearAllBodyScrollLocks();
    },
};
</script>

<style scoped lang="scss">
.modaler {
    width: 100%;
    height: 100vh;
    background-color: rgba(24, 24, 24, 0);
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    &-content {
        background-color: rgb(59, 168, 156);
        height: 100vh;
        width: 70vw;
        max-width: 500px;
        box-sizing: border-box;
        margin: 0 auto;
        position: absolute;
        top: 0;
        right: 0;
        color: #333;
        padding: 30px 10px;
        box-sizing: border-box;
        text-align: center;
        .btn {
            margin: 3em 0 0 0;
        }
    }
}
.navigation {
    ul {
        color: rgb(255, 255, 255);
        list-style: none;
        margin: 0;
        padding: 0;
        li {
            font-size: 1.3em;
            margin: 0;
            padding: 1em 0;
            border-bottom: 1px dotted;
            &:hover {
                background-color: rgb(50, 146, 135);
            }
        }
    }
}
</style>
