<template>
    <div class="button-wrap">
        <div class="button"><slot>テスト</slot></div>
    </div>
</template>

<style lang="scss" scoped>
.button-wrap {
    width: 100%;
    text-align: center;
    margin: 3em 0;
    .button {
        border: 1px solid;
        padding: 1em;
        display: inline-block;
        border-radius: 5px;
    }
}
</style>
