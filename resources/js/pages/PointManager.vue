<template>
    <div>
        <h2>POINT MANAGE</h2>
        <div class="select-box-area">
            <ShopSelectBoxVue
                v-if="currentAuth == 1"
                v-model="shopId"
                :disabledFlag="_sendFlag"
            ></ShopSelectBoxVue>
            <p v-if="_sendFlag" class="danger small">
                更新を完了しないと店舗の変更はできません。
            </p>
        </div>
        <ul class="change-view">
            <li
                @click="changeComponent(1)"
                :class="{ active: currentComponent === 1 }"
            >
                <span class="material-icons-outlined">
                    format_align_justify </span
                >個別表示
            </li>
            <li
                @click="changeComponent(2)"
                :class="{ active: currentComponent === 2 }"
            >
                <span class="material-icons-outlined"> apps </span>
                全体表示
            </li>
        </ul>
        <UserPointing
            v-if="currentComponent === 1"
            :shop="shopId"
            :taskData="taskData"
            :users="users"
            ref="point"
        ></UserPointing>
        <UserAllPointing
            v-if="currentComponent === 2"
            :shop="shopId"
            :taskData="taskData"
            :users="users"
            ref="point"
        ></UserAllPointing>
        <div v-if="_sendFlag" @click="sendData" class="send-data">
            <span>更新</span>
        </div>
    </div>
</template>

<script>
import UserPointing from "../components/UserPointing.vue";
import UserAllPointing from "../components/UserAllPointing.vue";
import ShopSelectBoxVue from "../components/form/ShopSelectBox.vue";
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            currentComponent: 1,
            shopId: null,
        };
    },
    components: {
        UserPointing,
        UserAllPointing,
        ShopSelectBoxVue,
    },
    computed: {
        ...mapGetters({
            _sendFlag: "point/getSendDataFlag",
            _sendData: "point/getSendData",
            currentAuth: "auth/getAuthority",
            getShopId: "auth/getShopId",
            users:"point/pointsAndUsers",
            taskData:"tasks/taskData",
        }),
    },
    methods: {
        async getTask() {
             await this.$store.dispatch('tasks/getTasks', this.shopId);
             await this.$store.dispatch('point/getPointsAndUsers', this.shopId)

        },
        //pointデータを送信
        async sendData() {
            this.$store.dispatch("point/sendPoints");

            this.currentComponent = 1;

            this.$refs.point.iniData();

            this.getTask();
        },
        confirm() {
            return window.confirm(
                "変更した採点データが保存されていません。このままページを離脱しますか？"
            );
        },
        ifShopLeader() {
            if (this.currentAuth == 2) {
                this.shopId = this.getShopId;
            }
        },
        changeComponent(key) {
            this.currentComponent = key;
        },
    },
    mounted() {
        this.ifShopLeader();
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
            this.$store.dispatch("point/clearPoints");
            next();
        }
        next();
    },
    watch: {
        shopId: function () {
            if (this.shopId) {
                this.currentComponent = 1;
                this.getTask();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.select-box-area {
    max-width: 400px;
    margin: 10px auto;
}
.change-view {
    display: flex;
    margin: 40px auto 0 auto;
    list-style: none;
    border: 1px solid;
    border-radius: 7px;
    width: 340px;
    padding: 0;
    li {
        flex: 1;
        padding: 1em 0;
        text-align: center;
        span {
            vertical-align: middle;
        }
        &.active {
            background-color: rgb(236, 236, 236);
            color: #313644;
        }
    }
}
.send-data {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background-color: #f7f2e0;
    width: 70px;
    height: 70px;
    text-align: center;
    border-radius: 50%;
    color: #38466d;
    cursor: pointer;
    span {
        display: block;
        margin: 0 auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
    }
}
</style>
