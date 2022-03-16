<template>
    <div class="point-manage">
        <h2>POINT MANAGE</h2>
        <div>
            <div class="select-box-area">
                <div class="form-group row" v-if="currentAuth == 1">
                    <label class="label" for="shop">店舗選択</label>
                    <select v-model="shopId" class="form-control">
                        <option
                            v-for="shop in shops"
                            :key="shop.value"
                            :value="shop.value"
                        >
                            {{ shop.label }}
                        </option>
                    </select>
                </div>
                <div v-if="users" class="form-group row">
                    <label class="label">ユーザー選択</label>
                    <select v-model="user" class="form-control">
                        <option
                            v-for="user in users"
                            :key="user.id"
                            :value="user"
                        >
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
                        v-for="(task, index) in filterTask"
                        :key="task.id"
                        class="task"
                        @click="openPointEdit($event, task)"
                    >
                        <p class="task__index">{{ index + 1 }}</p>
                        <p class="task__body">{{ task.content }}</p>
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
        </div>
        <p>{{ sendFlag }}</p>
        <ModalPointEdit
            v-if="showModal"
            :task="taskProps"
            :user="userProps"
            @emitClose="closePointEdit"
            @emitPoint="putPoint"
        ></ModalPointEdit>
        <div v-if="sendFlag" @click="sendData" class="send-data">
            <span>更新</span>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ModalPointEdit from "../components/ModalPointEdit.vue";

export default {
    data() {
        return {
            shopId: null,
            user: null,
            users: null,
            currentTask: 1,
            taskData: null,
            pointData: null,
            formData: {
                pointList: [],
            },
            showModal: false,
            sendFlag: false,
        };
    },
    components: {
        ModalPointEdit,
    },
    methods: {
        async fetchUsers() {
            const response = await axios.get(`/api/user/get/${this.shopId}`);

            this.users = response.data.data;
        },
        //タスクデータにポイントデータをmergeして取得
        async getTaskWithPoint() {
            //店舗とポジションに紐付いたタスクデータ取得
            const response = await axios.get(
                `/api/task?shop=${this.shopId}&position=${this.user.position_id}`
            );

            let tasks = response.data

            //ユーザーに紐付いたポイントデータ取得
            const resPoints = await axios.get(
                `api/point?user_id=${this.user.id}`
            );

            let pointsData = resPoints.data;

            //ポイントデータ加工
            //既にsendDataにデータがある場合、ユーザーを切り替えても点数変更が描画に反映されるように処理
            let localData = [];
            if (this.formData.pointList.length) {
                //sendDataの中のユーザーに紐付いたデータをフィルタリング
                localData = this.formData.pointList.filter((item) => {
                    return item.user_id == this.user.id;
                });
            }

            //localDataがあれば
            if (localData.length) {
                //apiで取得したpointsDataをlocalDataで上書き(pointプロパティだけ)
                pointsData.forEach((point) => {
                    let overWriteData = localData.find(
                        (data) => data.task_id === point.task_id
                    );
                    if (overWriteData) {
                        point.point = overWriteData.point;
                    }
                });

                //pointのidが無いデータを追加（新規で追加しようとしているsendData）
                //id=nullでフィルタリング
                let nullIdData = localData.filter((item) => {
                    return item.id === null;
                });

                if (nullIdData) {
                    //そのままぶっこむと参照になってsendDataに影響するので
                    //新規オブジェクトを作ってpointsDataにpush(値渡し)
                    nullIdData.forEach((item) => {
                        let object = {};
                        for (let key in item) {
                            object[key] = item[key];
                        }
                        pointsData.push(object);
                    });
                }
            }

            //idが重複するのでpoint_idに変更
            pointsData.forEach((point) => {
                point.point_id = point.id;
                delete point.id;
                delete point.editor; //無くてもいい
            });

            this.taskData = {};

            //タスクデータをpointDataとまとめてthis.taskDataに挿入
            tasks.forEach((task) => {
                //point:0とpoint_id:nullを追加
                Object.assign(task, { point: 0, point_id: null });
                //ポイントデータとタスクデータが紐付いている場合は上書き
                let overWriteData = pointsData.find(
                    (point) => point.task_id == task.id
                );

                Object.assign(task, overWriteData);
                return task;
            });

            this.taskData = tasks;
        },
        //pointデータを送信
        async sendData() {
            const response = await axios.post("/api/point", this.formData);

            //送信用データを空に
            this.formData.pointList = [];
            this.sendFlag = false;
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
            //task_idで重複削除
            let list = this.formData.pointList.filter((item) => {
                if (
                    item.task_id !== data.task_id ||
                    item.user_id !== data.user_id
                ) {
                    return true;
                }
            });
            list.push(data);
            //送信用データの格納
            this.formData.pointList = list;
            this.sendFlag = true;

            //再描画用　pointを更新
            this.taskData.forEach((task, index) => {
                if (task.id === data.task_id) {
                    this.$set(this.taskData[index], "point", data.point);
                }
            });

        },
        confirm() {
            return window.confirm(
                "変更した採点データが保存されていません。このままページを離脱しますか？"
            );
        },
    },
    computed: {
        ...mapGetters({
            currentAuth: "auth/getAuthority",
            shops: "options/Shops",
            category: "options/taskCategory",
            categoryLabels: "options/categoryLabels",
        }),
        filterTask() {
            const filteredTask = this.taskData.filter((task) => {
                return task.category_id == this.currentTask;
            });
            return filteredTask;
        },
    },
    watch: {
        shopId() {
            this.fetchUsers();
        },
        user() {
            this.getTaskWithPoint();
        },
    },
    //ページの移動前にpointデータが残っていたら確認
    beforeRouteLeave(to, from, next) {
        if (this.sendFlag) {
            if (this.confirm() === false) return;
            next();
        }
        next();
    },
    mounted() {
        let self = this;
        window.onbeforeunload = function () {
            if (self.sendFlag) {
                return "未保存のデータがあります。処理を実行しますが？";
            }
        };
    },
};
</script>

<style lang="scss" scoped>
.select-box-area {
    max-width: 400px;
    margin: 10px auto;
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
