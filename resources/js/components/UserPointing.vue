<template>
    <div class="point-manage">
        <div class="select-box-area">
            <div v-if="users" class="form-group row">
                <label class="label">ユーザー選択</label>
                <select v-model="user" class="form-control">
                    <option v-for="user in users" :key="user.id" :value="user">
                        {{ user.name }}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="taskData" class="task-data-area">
            <h3 class="task-data-area__title">{{ user.name }}さんの評価</h3>
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
                <h4 class="task-group__title">
                    {{ categoryLabels[currentTask] }}
                </h4>
                <div
                    v-for="(task, index) in filterMainData"
                    :key="task.task_id"
                    class="task"
                    :class="{ updated: task.updated === true }"
                    @click="openPointEdit($event, task)"
                >
                    <p class="task__index">{{ index + 1 }}</p>
                    <p class="task__body">
                        {{ filterTaskContent(task.task_id) }}
                    </p>
                    <p class="task__point">
                        <span
                            :class="{
                                point1: task.point == 1,
                                point2: task.point == 2,
                                point3: task.point == 3,
                                point4: task.point == 4,
                                point5: task.point == 5,
                            }"
                        ></span>
                    </p>
                </div>
            </div>
        </div>
        <ModalPointEdit
            v-if="showModal"
            :data="dataProps"
            :task="taskProps"
            @emitClose="closePointEdit"
            @emitPoint="putPoint"
        ></ModalPointEdit>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ModalPointEdit from "./ModalPointEdit.vue";

export default {
    data() {
        return {
            user: null,
            users: null,
            currentTask: 1,
            taskData: null,
            viewData: [],
            showModal: false,
        };
    },
    props: ['shop'],
    components: {
        ModalPointEdit,
    },
    methods: {
        async fetchUsers() {
            const response = await axios.get(`/api/user/get/${this.shop}`);

            let data = response.data.data;

            this.users = data.filter((user) => {
                return user.authority == 3;
            });
        },
        async getTaskWithPoint() {
            this.taskData = [];
            this.viewData = [];
            //店舗とポジションに紐付いたタスクデータ取得
            const response = await axios.get(
                `/api/task?shop=${this.shop}&position=${this.user.position_id}`
            );
            let tasks = response.data;

            this.taskData = tasks;

            //ユーザーに紐付いたポイントデータ取得
            const resPoints = await axios.get(
                `api/point?user_id=${this.user.id}`
            );
            let user = resPoints.data.data;

            let data = this.$helpers.createViewData(
                this.taskData,
                user,
                this._sendData
            );

            this.viewData = data;
        },

        //カテゴリー切り替え
        changeTask(key) {
            this.currentTask = key;
        },
        //ポイント編集モーダルオープン
        openPointEdit(event, data) {
            this.showModal = true;
            this.dataProps = data;
            this.taskProps = this.taskData;
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

            let targetTask = this.viewData.find(
                (task) => task.task_id === data.task_id
            );

            this.$set(targetTask, "point", data.point);
            this.$set(targetTask, "updated", true);
        },

    },
    computed: {
        ...mapGetters({
            category: "options/taskCategory",
            categoryLabels: "options/categoryLabels",
            _sendData: "point/getSendData",
            _sendFlag: "point/getSendDataFlag",
        }),
        filterMainData() {
            return this.viewData.filter((task) => {
                return task.category_id == this.currentTask;
            });
        },
        filterTaskContent() {
            return function (taskId) {
                let task = this.taskData.find((item) => item.id === taskId);
                return task.content;
            };
        },
    },
    watch: {
        shop: function () {
            this.users = null;
            this.user = null;
            this.currentTask = 1;
            this.taskData = null;
            this.fetchUsers();
        },
        user() {
            this.getTaskWithPoint();
        },
    },
    mounted() {
        if(this.shop) {
            this.fetchUsers();
        }
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
.task-group {
    border: 1px solid;
    margin: 1em 0;
    &__title {
        padding: 0.7em 0 0.7em 1em;
        background-color: #7b7e88;
        color: #313644;
        margin: 0;
        line-height: 1em;
    }
}
.task {
    display: flex;
    border-bottom: 1px dotted #929292cb;
    margin: 0;
    cursor: pointer;
    box-sizing: border-box;
    &:hover {
        background-color: #38466d;
    }
    &.updated {
        background-color: #5d5d5f;
        &:hover {
            background-color: #38466d;
        }
    }
    &__index {
        width: 3em;
        text-align: center;
        margin: 0;
        border-right: 1px solid;
        padding: 1em 0;
        box-sizing: border-box;
    }
    &__body {
        margin: 0;
        padding: 1em 0.5em;
        box-sizing: border-box;
        flex: 2;
    }
    &__point {
        margin: 0;
        box-sizing: border-box;
        padding: 1em 0;
        width: 3em;
        text-align: center;
        border-left: 1px solid;
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
</style>
