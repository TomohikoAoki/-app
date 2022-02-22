<template>
    <div class="footer">
        <div v-if="isLogin">
            <button @click.prevent="logout" class="button logout">ログアウト</button>
        </div>

    </div>
</template>

<script>

export default {
    methods: {
        async logout() {
            this.$store.dispatch('auth/logout');

        }
    },
    computed: {
        isLogin() {
            return this.$store.getters['auth/checkUser']
        }
    }
}


</script>

<style>
.footer {
    height: 300px;
    padding-top: 50px;
    margin-top: 50px;

    background-color: rgb(73, 67, 67);
}
.button {
    display: block;
    margin: 0 auto;
}
</style>
