<template>
    <div class="point-manage">
        <div>
            <CurrentPositionVue
                v-model="currentPosition"
                :selected="currentPosition"
                :hiddenPositions="hiddenPositions"
            ></CurrentPositionVue>
            <div v-if="viewData" class="task-data-area">
                <!-- task category 選択 -->
                <SelectCategoryVue
                    :shopId="shop"
                    :positionId="currentPosition"
                    :currentCategory="CurrentCategory"
                    v-model="CurrentCategory"
                    :concatCommonFlag="true"
                ></SelectCategoryVue>
                <!-- 横スクロール用wrap -->
                <div class="task-wrap">
                    <!-- ここからテーブル -->
                    <div class="task-group">
                        <!-- index添字用 -->

                        <div class="task-index">
                            <div class="task-index__empty"></div>
                            <div
                                class="task-index__index"
                                v-for="n of taskIndex"
                                :key="n"
                            >
                                {{ n }}
                            </div>
                        </div>
                        <!-- ここからviewData -->
                        <div
                            v-for="user in usersFilteredPosition"
                            :key="`user:${user.id}`"
                            class="task-user"
                        >
                            <p class="task-user__name">{{ user.name }}</p>
                            <div
                                v-for="task in filterTask(user.id)"
                                :key="`${user.id}:${task.task_id}`"
                                class="task-user__point-area"
                                :class="{
                                    updated: task.updated === true,
                                }"
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
                    <div v-if="noTask" class="no-task">
                        <p>タスクが登録されていません</p>
                        <router-link
                            :to="{
                                name: 'task-manage',
                                query: { shopId: shop, currentCategory: CurrentCategory, position: currentPosition },
                            }"
                            class="to-task-manage"
                            >タスク管理へ</router-link
                        >
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
        {{ noTask }}
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import router from "../router";

import ModalPointEdit from "./ModalPointEdit.vue";
import CurrentPositionVue from "./parts/CurrentPosition.vue";
import SelectCategoryVue from "./parts/SelectCategory.vue";

export default {
    data() {
        return {
            CurrentCategory: 1,
            currentPosition: 1,
            showModal: false,
            viewData: null,
            taskIndex: null,
            hiddenPositions: [3],
            noTask: false,
        };
    },
    props: ["shop", "taskData", "users"],
    components: {
        ModalPointEdit,
        CurrentPositionVue,
        SelectCategoryVue,
    },
    methods: {
        createView() {
            //初期化
            this.viewData = [];

            this.users.forEach((user) => {
                //taskの配列データ、userデータ（pointデータ含む）,send前のローカルにあるデータから
                //画面表示用のデータの配列を作成する関数
                let data = this.$helpers.createViewData(
                    this.taskData,
                    user,
                    this._sendData
                );
                this.viewData = this.viewData.concat(data);
            });
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
        //初期化
        iniData() {
            this.CurrentCategory = 1;
            this.currentPosition = 1;
            this.viewData = null;
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
            let targetTask = this.viewData.find((task) => {
                if (
                    task.task_id === data.task_id &&
                    task.user_id === data.user_id
                ) {
                    return true;
                }
            });

            this.$set(targetTask, "point", data.point);
            this.$set(targetTask, "updated", true);
        },
        //viewDataをcategoryとユーザーでフィルタリング
        //index用に配列の要素数も
        filterTask(id) {
            let tasks = this.viewData.filter(
                (task) =>
                    Number(task.category_id) === Number(this.CurrentCategory)
            );
            let list = tasks.filter((item) => item.user_id == id);
            this.taskIndex = list.length;

            this.noTask = !this.taskIndex ? true : false;

            return list;
        },
    },
    computed: {
        ...mapGetters({
            _sendData: "point/getSendData",
            _sendFlag: "point/getSendDataFlag",
        }),
        //店舗ユーザーをポジションでフィルタリング
        usersFilteredPosition() {
            return this.users.filter((user) => {
                return (
                    Number(user.position_id) === Number(this.currentPosition)
                );
            });
        },
    },
    watch: {
        //親コンポーネントからのデータに変更があればviewDataを更新で再描画
        taskData: function () {
            if (this.users && this.taskData) this.createView();
        },
        users: function () {
            if (this.users && this.taskData) this.createView();
        },
        shop: function () {
            this.iniData();
        },
    },
    mounted() {
        if (this.users && this.taskData) this.createView();
    },
};
</script>

<style lang="scss" scoped>
.point-manage {
    border-top: 1px dotted;
    margin: 40px 0 0 0;
    padding: 40px 0 0 0;
}
.task-data-area {
    margin-top: 2em;
    padding: 2em 0;
    width: 100%;
    &__title {
        text-align: center;
        font-size: 2em;
        padding: 0 0 2em 0;
    }
}
.task-wrap {
    overflow-x: scroll;
    padding: 20px 0;
    position: relative;
    min-height: 500px;
    .task-group {
        display: table;
        border: 1px solid;
        border-collapse: collapse;
        @media screen and (min-width: 500px) {
            font-size: 1.2em;
        }
        @media screen and (min-width: 850px) {
            font-size: 1.4em;
        }
        .task-index {
            display: table-row;
            border-bottom: 1px solid;
            background-color: #525b61;
            &__empty {
                min-width: 120px;
                display: table-cell;
            }
            &__index {
                display: table-cell;
                min-width: 3em;
                text-align: center;
                font-size: 0.8em;
                color: #caced1;
            }
        }
        .task-user {
            display: table-row;
            border-bottom: 1px solid;
            &__name {
                min-width: 120px;
                display: table-cell;
                vertical-align: middle;
                padding: 0.4em 0.3em;
            }
            &__point-area {
                min-width: 3em;
                text-align: center;
                display: table-cell;
                border-left: 1px dotted #a8a8a8;
                vertical-align: middle;
                &:hover {
                    background-color: #38466d;
                }
                &.updated {
                    background-color: #5d5d5f;
                    &:hover {
                        background-color: #38466d;
                    }
                }
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
    .no-task {
        text-align: center;
        margin: 0 0 0 120px;
        width: 400px;
        padding: 10px;
        position: absolute;
        top: 30px;
        left: 30px;
        background-color: #5d5d5f;
        .to-task-manage {
            display: block;
            font-size: 1.3em;
            font-weight: bold;
            text-align: center;
            width: 200px;
            padding: 1em 0.5em;
            margin: 10px auto;
            border: 1px solid;
            border-radius: 10px;
            box-sizing: border-box;
        }
    }
}
</style>
