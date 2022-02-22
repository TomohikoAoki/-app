<template>
    <div>
        <h2>LEADER HOME</h2>
        <h3>ユーザー管理</h3>
        <router-link to="/user-manage">ユーザー管理画面</router-link>
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
