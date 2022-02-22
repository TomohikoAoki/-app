<template>
    <div>
        <h2>MASTER HOME</h2>
        <router-link to="/user-manage"> <h3>ユーザー管理</h3></router-link>

        <router-link to="/shop-manage"><h3>店舗管理</h3></router-link>
        <h3>タスク管理</h3>
        <ul class="operation-listbox">
            <li><a>タスク登録/編集</a></li>
        </ul>
        <h3>ポイント管理</h3>
        <ul class="operation-listbox">
            <li><a>ポイント登録/編集</a></li>
        </ul>
    </div>
</template>
<script>
import store from '../store';
import router from '../router';
export default {
    beforeRouteEnter (to, from, next) {
        switch (store.getters['auth/getAuthority']) {
            case 1: next(); break;
            case 2: router.push('/home/leader') ; break;
            case 3: router.push('/home/user'); break;
            default: router.push('/');
        }
    }
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
