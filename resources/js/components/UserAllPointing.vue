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
                <h3>ポジション</h3>
                <ul>
                    <li @click="changePosition(1)">ホール</li>
                    <li @click="changePosition(2)">キッチン</li>
                </ul>
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
                        v-for="(user, index) in usersFilteredPosition"
                        :key="`user${index}:${user.id}`"
                        class="task-user"
                    >
                        <p class="task-user__name">{{ user.name }}</p>
                        <div
                            v-for="(task, index) in filterTask(user.id)"
                            :key="`${index}:${task.task_id}`"
                            class="task-user__point"
                            @click="openPointEdit($event, task)"
                        >
                            <span
                                :class="{
                                    point1: task.point == 1,
                                    point2: task.point == 2,
                                    point3: task.point == 3,
                                    point4: task.point == 4,
                                    point5: task.point == 5,
                                }"
                            ></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ModalPointEdit
            v-if="showModal"
            :task="taskProps"
            :data="dataProps"
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
            currentPosition: 1,
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
            this.mainData = [];
            this.taskData = null;
            this.users = null;
            const response = await axios.get(`/api/point/${this.shopId}`);

            let data = response.data.data;

            console.log(data);

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
                    obj.updated = false;
                    obj.point = 0;
                    obj.point_id = null;
                    if (user.points.length) {
                        let target = user.points.find((point) => {
                            return point.task_id === task.id;
                        });
                        if (target) {
                            obj.point = target.point;
                            obj.point_id = target.id;
                        }
                    }
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
        openPointEdit(event, data) {
            this.showModal = true;
            this.taskProps = this.taskData;
            this.dataProps = data;
        },
        //ポイント編集モーダルクローズ
        closePointEdit() {
            this.showModal = false;
        },
        changePosition(key) {
            this.currentPosition = key;
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
                    return item.user_id == id;
                });
            };
        },
        usersFilteredPosition() {
            return this.users.filter((user) => {
                return user.position_id === this.currentPosition;
            });
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
.task-group {
    overflow-x: scroll;
    .task-user {
        display: flex;
        align-items: stretch;
        flex-wrap: nowrap;

        &__name {
            min-width: 100px;
            border: 1px solid;
        }
        &__point {
            border: 1px solid;
            min-width: 3em;
            text-align: center;
            flex: 1;
            span {
                display: block;
                width: 1em;
                height: 1em;
                border-radius: 50%; /*角丸*/
                border: 1px solid;
                margin: 0 auto;
                content: "";
                &.point1 {
                    background-color: #fff;
                    border: none;
                }
                &.point2 {
                    background-color: rgb(203, 240, 144);
                    border: none;
                }
                &.point3 {
                    background-color: rgb(252, 249, 119);
                    border: none;
                }
                &.point4 {
                    background-color: rgb(151, 144, 252);
                    border: none;
                }
                &.point5 {
                    background-color: rgb(241, 170, 112);
                    border: none;
                }
            }
        }
    }
}
</style>
