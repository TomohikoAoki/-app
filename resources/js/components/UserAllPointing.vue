<template>
    <div class="point-manage">
        <div>
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
            <div v-if="taskData" class="task-data-area">
                <ul class="category-area">
                    <li
                        v-for="cate in category"
                        :key="cate.value"
                        @click="changeTask(cate.value)"
                        class="select-category"
                        :class="{ active: currentTask == cate.value }"
                    >
                        {{ cate.label }}
                    </li>
                </ul>
                <div class="task-group">
                    <div
                        v-for="(user, index) in users"
                        :key="`user${index}:${user.id}`"
                    >
                        {{ user.name }}
                        <div
                            v-for="(task, index) in filterTask(user.id)"
                            :key="`${index}:${task.task_id}`"
                        >
                            {{ task.user_id }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ModalPointEdit
            v-if="showModal"
            :task="taskProps"
            :user="userProps"
            @emitClose="closePointEdit"
            @emitPoint="putPoint"
        ></ModalPointEdit>
        <div v-if="_sendFlag" @click="sendData" class="send-data">
            <span>更新</span>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ModalPointEdit from "./ModalPointEdit.vue";

export default {
    data() {
        return {
            shopId: null,
            currentTask: 1,
            users: null,
            showModal: false,
            mainData: [],
            taskData: null,
        };
    },
    components: {
        ModalPointEdit,
    },
    methods: {
        async fetchUsersAndTasks() {
            const response = await axios.get(`/api/user/get/${this.shopId}`);

            let data = response.data.data;

            this.users = data.filter((user) => {
                return user.authority == 3;
            });

            const resTask = await axios.get(`/api/task/${this.shopId}`);

            this.taskData = resTask.data;

            this.users.forEach((user) => {
                this.taskData.forEach((task) => {
                    let obj = {};
                    obj.user_id = user.id;
                    obj.position_id = user.position_id;
                    obj.category_id = task.category_id;
                    obj.task_id = task.id;
                    obj.point = 0;
                    obj.point_id = null;
                    obj.updated = false;
                    this.mainData.push(obj);
                });
            });
        },
        //pointデータを送信
        async sendData() {
            const response = await axios.post("/api/point", this._sendData);

            //色々初期化
            this.$store.dispatch("point/clearPoints");
            this.taskData = [];
            this.currentTask = 1;

            //タスク再読み込み
            this.getTaskWithPoint();
        },
        //カテゴリー切り替え
        changeTask(key) {
            this.currentTask = key;
        },
        //ポイント編集モーダルオープン
        openPointEdit(event, task) {
            this.showModal = true;
            this.taskProps = task;
            this.userProps = this.user;
        },
        //ポイント編集モーダルクローズ
        closePointEdit() {
            this.showModal = false;
        },
        //送信用データを配列で格納　＆　再描画の為にtaskDataを更新
        putPoint(data) {
            //task_id & user_id で重複削除
            let list = this._sendData.filter((item) => {
                if (
                    item.task_id !== data.task_id ||
                    item.user_id !== data.user_id
                ) {
                    return true;
                }
            });
            list.push(data);
            //送信用データの格納
            this.$store.dispatch("point/putPoints", list);

            //再描画用　pointを更新
            let targetTask = this.taskData.find(
                (task) => task.id === data.task_id
            );

            this.$set(targetTask, "point", data.point);
            this.$set(targetTask, "updated", true);
        },

        ifShopLeader() {
            if (this.currentAuth == 2) {
                this.shopId = this.getShopId;
                this.fetchUsers();
            }
        },
        filtered(id) {
            const res = this.mainData.filter((data) => {
                data.user_id == id;
            });

            return res;
        },
    },
    computed: {
        ...mapGetters({
            currentAuth: "auth/getAuthority",
            shops: "options/Shops",
            category: "options/taskCategory",
            categoryLabels: "options/categoryLabels",
            getShopId: "auth/getShopId",
            _sendData: "point/getSendData",
            _sendFlag: "point/getSendDataFlag",
        }),
        filterTask() {
            return function (id) {
                let test = this.mainData.filter((task) => {
                    return task.category_id == this.currentTask;
                });
                return test.filter((item) => {
                    return item.user_id == id
                })
            };
        },
    },
    watch: {
        shopId: function () {
            this.users = null;
            this.currentTask = 1;
            this.taskData = null;
            this.fetchUsersAndTasks();
        },
    },
    mounted() {
        this.ifShopLeader();
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
.task-data-area {
    margin-top: 4em;
    padding: 5em 0;
    width: 100%;
    border-top: 1px dotted;
    &__title {
        text-align: center;
        font-size: 2em;
        padding: 0 0 2em 0;
    }
}
.category-area {
    list-style: none;
    .select-category {
        display: inline-block;
        cursor: pointer;
        border: 1px solid;
        padding: 1em;
        margin: 0.2em;
        border-radius: 2px;
    }
    .active {
        background-color: rgb(236, 236, 236);
        color: #313644;
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
