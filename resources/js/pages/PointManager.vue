<template>
    <div>
        <h2>POINT MANAGE</h2>
        <UserAllPointing></UserAllPointing>
    </div>
</template>

<script>
import UserPointing from '../components/UserPointing.vue'
import UserAllPointing from '../components/UserAllPointing.vue';
import { mapGetters } from 'vuex';

export default {
    components: {
        UserPointing,
        UserAllPointing,
    },
    computed: {
        ...mapGetters({
            _sendFlag : "point/getSendDataFlag",
        })
    },
    methods: {
        confirm() {
            return window.confirm(
                "変更した採点データが保存されていません。このままページを離脱しますか？"
            );
        },
    },
    mounted() {
        let self = this;
        window.onbeforeunload = function () {
            if (self._sendFlag) {
                return "未保存のデータがあります。処理を実行しますが？";
            }
        };
    },
    //ページの移動前にpointデータが残っていたら確認
    beforeRouteLeave(to, from, next) {
        if (this._sendFlag) {
            if (this.confirm() === false) return;
            this.$store.dispatch('point/clearPoints')
            next();
        }
        next();
    },
}
</script>

<style lang="scss" scoped>
</style>
