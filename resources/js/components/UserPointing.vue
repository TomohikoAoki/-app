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
        <div v-if="viewData" class="task-data-area">
            <h3 class="task-data-area__title">{{ user.name }}さんの評価</h3>
            <SelectCategoryVue
                    :shopId="shop"
                    :positionId="user.position_id"
                    :currentCategory="CurrentCategory"
                    v-model="CurrentCategory"
                    :concatCommonFlag="true"
                ></SelectCategoryVue>
            <div class="task-group">
                <h4 class="task-group__title"></h4>
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
                <div v-if="noTask" class="no-task">
                    <p>タスクが登録されていません</p>
                    <router-link
                        :to="{
                            name: 'task-manage',
                            query: { shopId: shop, currentCategory: CurrentCategory },
                        }"
                        class="to-task-manage"
                        >タスク管理へ</router-link
                    >
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
import { mapGetters } from "vuex";
import router from "../router";

import ModalPointEdit from "./ModalPointEdit.vue";
import SelectCategoryVue from "./parts/SelectCategory.vue";

export default {
    data() {
        return {
            user: null,
            CurrentCategory: null,
            viewData: null,
            showModal: false,
            noTask: false,
        };
    },
    //shopId,店舗のタスクデータ全部,店舗のユーザー全員
    props: ["shop", "taskData", "users"],
    components: {
        ModalPointEdit,
        SelectCategoryVue,
    },
    methods: {
        createView() {
            //taskの配列データ、userデータ（pointデータ含む）,send前のローカルにあるデータから
            //画面表示用のデータの配列を作成する関数
            let data = this.$helpers.createViewData(
                this.taskData,
                this.user,
                this._sendData
            );

            this.viewData = data;
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
        //初期化
        iniData() {
            this.user = null;
            this.CurrentCategory = null;
            this.viewData = null;
        },
        //送信用データを配列で格納　＆　再描画の為にviewDataを更新
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
    },
    computed: {
        ...mapGetters({
            _sendData: "point/getSendData",
            _sendFlag: "point/getSendDataFlag",
        }),
        //viewDataをカテゴリーでフィルタリング
        filterMainData() {
            let list = this.viewData.filter((task) => {
                return task.category_id == this.CurrentCategory;
            });

            this.noTask = !list.length ? true : false

            return list
        },
        //タスクのcontent表示のため、viewDataと紐付ける
        filterTaskContent() {
            return function (taskId) {
                let task = this.taskData.find((item) => item.id === taskId);
                return task.content;
            };
        },
    },
    watch: {
        shop: function () {
            this.iniData();
        },
        user() {
            if (this.user) {
                this.createView();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.point-manage {
    border-top: 1px dotted;
    margin: 40px 0 0 0;
    padding: 40px 0 0 0;
}
.select-box-area {
    max-width: 400px;
    margin: 10px auto;
}
.form-control:disabled {
    color: rgb(197, 197, 197);
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
.task-group {
    border: 1px solid;
    margin: 1em 0;
    position: relative;
    &__title {
        padding: 0.7em 0 0.7em 1em;
        background-color: #7b7e88;
        color: #313644;
        margin: 0;
        line-height: 1em;
    }
    .no-task {
        text-align: center;
        margin: 0 0 0 120px;
        width: 400px;
        padding: 10px;
        position: absolute;
        top: 30px;
        left: 30px;
        right: 30px;
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
.task {
    display: flex;
    border-bottom: 1px solid #d6d6d6cb;
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
        border-right: 1px dotted #7b7e88;
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
        border-left: 1px dotted #7b7e88;
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
