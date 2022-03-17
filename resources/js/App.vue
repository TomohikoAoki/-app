<template>
    <div class="app-box bg-dark">
        <Header></Header>
        <main class="main">
            <div class="container">
                <RouterView />
            </div>
        </main>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from "./components/header.vue";
import Footer from "./components/footer.vue";

import { INTERNAL_SERVER_ERROR } from "./util";

export default {
    components: {
        Footer,
        Header,
    },
    computed: {
        errorCode() {
            return this.$store.state.error.code;
        },
    },
    watch: {
        errorCode: {
            handler(val) {
                if (val === INTERNAL_SERVER_ERROR) {
                    this.$router.push("/500");
                }
            },
            immediate: true,
        },
        $route() {
            this.$store.commit("error/setCode", null);
        },
    },
};
</script>

<style>
.app-box {
    position: relative;
    color: #fff;
}
.main {
    position: relative;
    padding: 80px 0;
    min-height: 70vh;
}

</style>
