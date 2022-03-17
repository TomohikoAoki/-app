<template>
    <div class="header">
        <h1 @click="goHome">HEADER</h1>
        <div class="header-item" @click="showMenu" v-if="isLogin">
            <span class="material-icons-outlined account-icon">
                account_circle
            </span>
        </div>
        <transition name="modalnavi">
            <ModalMenu v-if="showModal" @emitClose="closeMenu"></ModalMenu>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalMenu from "./ModalMenu.vue";

export default {
    data() {
        return {
            showModal: false,
        };
    },
    components: {
        ModalMenu,
    },
    computed: {
        ...mapGetters({
            isLogin: "auth/checkUser",
            username: "auth/getUserName",
        }),
    },
    methods: {
        goHome() {
            this.$router.push("/home/master");
        },
        showMenu() {
            this.showModal = true;
        },
        closeMenu() {
            this.showModal = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.header {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    height: 50px;
    padding: 10px 0;
    margin-bottom: 30px;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 10;
    color: #333;
    h1 {
        text-align: center;
        font-size: 1em;
    }
    .header-item {
        .account-icon {
            font-size: 2.3em;
            padding: 0 0.15em 0 0;
        }
    }
    .modalnavi-enter-active,
    .modalnavi-leave-active {
        transform: translate(0px, 0px);
        transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }

    .modalnavi-enter,
    .modalnavi-leave-to {
        transform: translateX(100vh) translateX(0px);
    }
}
</style>
