<template>
    <div>
        <h2>POINT MANAGE</h2>
        <div class="select-box-area">
            <div class="form-group row" v-if="currentAuth == 1">
                <label class="label" for="shop">店舗選択</label>
                <select
                    v-model="shopId"
                    class="form-control"
                    :disabled="_sendFlag"
                >
                    <option
                        v-for="shop in shops"
                        :key="shop.value"
                        :value="shop.value"
                    >
                        {{ shop.label }}
                    </option>
                </select>
                <p v-if="_sendFlag" class="danger small">
                    更新を完了しないと店舗の変更はできません。
                </p>
            </div>
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
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            currentComponent: 1,
            shopId: null,
            taskData: null,
            users: null,
        };
    },
    components: {
        UserPointing,
        UserAllPointing,
    },
    computed: {
        ...mapGetters({
            _sendFlag: "point/getSendDataFlag",
            _sendData: "point/getSendData",
            shops: "options/Shops",
            currentAuth: "auth/getAuthority",
            getShopId: "auth/getShopId",
        }),
    },
    methods: {
        async getTask() {
            const responseTask = await axios.get(`api/task/${this.shopId}`);
            const responseUser = await axios.get(`api/point/${this.shopId}`);

            this.taskData = responseTask.data.data;
            this.users = responseUser.data.data;
        },
        //pointデータを送信
        async sendData() {
            const response = await axios.post("/api/point", this._sendData);

            //初期化
            this.$store.dispatch("point/clearPoints");

            this.taskData = null;
            this.users = null;
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
                this.taskData = null;
                this.user = null;
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
.form-control:disabled {
    color: rgb(197, 197, 197);
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
