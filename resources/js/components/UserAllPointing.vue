<template>
    <div class="point-manage">
        <div>
            <CurrentPositionVue v-model="currentPosition" :selected="currentPosition" :hiddenPositions="hiddenPositions"></CurrentPositionVue>
            <div v-if="viewData" class="task-data-area">
                <!-- task category 選択 -->
                <ul class="category-area">
                    <li
                        v-for="cate in filterCategory"
                        :key="cate.value"
                        @click="changeTask(cate.value)"
                        class="select-category"
                        :class="{ active: CurrentCategory == cate.value }"
                    >
                        {{ cate.label }}
                    </li>
                </ul>
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
                                class="task-user__point"
                                :class="{ updated: task.updated === true }"
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
        </div>
        <ModalPointEdit
            v-if="showModal"
            :task="taskProps"
            :data="dataProps"
            @emitClose="closePointEdit"
            @emitPoint="putPoint"
        ></ModalPointEdit>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalPointEdit from "./ModalPointEdit.vue";
import CurrentPositionVue from "./parts/CurrentPosition.vue";

export default {
    data() {
        return {
            CurrentCategory: 1,
            currentPosition: 1,
            showModal: false,
            viewData: null,
            taskIndex: null,
            hiddenPositions: [3],
        };
    },
    props: ["shop", "taskData", "users"],
    components: {
        ModalPointEdit,
        CurrentPositionVue
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
        //カテゴリー切り替え
        changeTask(key) {
            this.CurrentCategory = key;
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
        //ホールandキッチン切り替え
        changePosition(key) {
            this.currentPosition = key;
            this.createView();
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
        //カテゴリー取得 (店舗ごとにはstoreでフィルタ済みのはず…)
        async getCategories() {
            await this.$store.dispatch(
                "options/getCategoriesFiltered", this.shop
            );
        },
        //viewDataをcategoryとユーザーでフィルタリング
        //index用に配列の要素数も
        filterTask(id) {
                let tasks = this.viewData.filter(
                    (task) => Number(task.category_id) === Number(this.CurrentCategory)
                );
                let list = tasks.filter((item) => item.user_id == id);
                this.taskIndex = list.length;

                return list;
        },
    },
    computed: {
        ...mapGetters({
            categories: "options/storeCategoriesFiltered",
            _sendData: "point/getSendData",
            _sendFlag: "point/getSendDataFlag",
        }),
        //店舗ユーザーをポジションでフィルタリング
        usersFilteredPosition() {
            return this.users.filter((user) => {
                return Number(user.position_id) === Number(this.currentPosition);
            });
        },
        //categoryをユーザーのポジションでフィルタリング
        //共通は３
        //カテゴリー初期値(CurrentCategory)にカテゴリー配列の最初の配列のvalueを入れる
        //登録されてなかったら空の配列
        filterCategory() {
            if (this.categories) {
                let list = this.categories.filter((item) => {
                    return (
                        item.position_id == this.currentPosition ||
                        item.position_id == 3
                    );
                });
                if(list.length) this.CurrentCategory = list[0].value;
                return list;
            }
            return [];
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
            this.getCategories();
            this.iniData();
        },
    },
    mounted() {
        this.getCategories();
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
.select-position {
    display: flex;
    width: 350px;
    margin: 0 auto;
    vertical-align: middle;
    justify-content: center;
    p {
        font-weight: bold;
        padding: 0.5em 1em 0.5em 0;
        margin: 0;
    }
    ul {
        display: flex;
        margin: 0;
        padding: 0;
        border: 1px solid;
        border-radius: 5px;
        list-style: none;
        width: 250px;
        li {
            flex: 1;
            text-align: center;
            padding: 0.5em 0;
            &.active {
                background-color: rgb(236, 236, 236);
                color: #313644;
            }
        }
    }
}

.category-area {
    list-style: none;
    margin: 0;
    padding: 0;
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
            &__point {
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
}
</style>
