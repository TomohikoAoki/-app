<template>
    <div class="header">
        <h1 @click="goHome">HEADER</h1>
        <div class="header-item">
            <span v-if="isLogin">{{ username }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    computed: {
        ...mapGetters({
            isLogin: 'auth/checkUser',
            username: 'auth/getUserName',
        })
    },
    methods: {
        goHome() {
            this.$router.push('/home/master')
        }
    }
}
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
    color:#333;
    h1 {
        text-align: center;
        font-size: 1em;
    }
}
</style>
