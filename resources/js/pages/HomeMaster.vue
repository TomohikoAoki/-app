<template>
    <div>
        <h2>MANAGER HOME</h2>
        <router-link to="/user-manage"> <h3>ユーザー管理</h3></router-link>
        <div v-if="auth === 1">
            <router-link to="/shop-manage"><h3>店舗管理</h3></router-link>
        </div>
        <router-link to="/task-manage"><h3>タスク管理</h3></router-link>
        <router-link to="/category-manage"><h3>カテゴリー管理</h3></router-link>
        <router-link to="/point-manage"><h3>ポイント管理</h3></router-link>
    </div>
</template>

<script>
import store from "../store";
import router from "../router";
export default {
    data() {
        return {
            auth: store.getters["auth/getAuthority"],
        };
    },
    beforeRouteEnter(to, from, next) {
        switch (store.getters["auth/getAuthority"]) {
            case 1:
                next();
                break;
            case 2:
                next();
                break;
            case 3:
                router.push("/home/user");
                break;
            default:
                router.push("/");
        }
    },
};
</script>

<style lang="scss">
h2 {
    text-align: center;
}
h3 {
    font-size: 1.3em;
}
.operation-listbox {
    a {
        display: block;
    }
}
</style>
