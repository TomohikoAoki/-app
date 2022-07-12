<template>
    <div class="task-manage">
        <h2>TASK MANAGEMENT</h2>
        <div>
            <div class="select-box-area">
                <!-- 店舗セレクトセクション -->
                <SelectShopBox
                    v-model="shopId"
                    v-if="currentAuth == 1"
                ></SelectShopBox>
                <!-- ポジションセレクトセクション -->
                <SelectPositionBox v-model="positionId"> </SelectPositionBox>
            </div>
            <div v-if="taskData" class="task-data-area">
                <h3 class="task-data-area__title">TASK</h3>
                <!-- カテゴリーセレクトセクション -->
                <ul class="category-area" v-if="filterCategory.length">
                    <li
                        v-for="cate in filterCategory"
                        :key="cate.value"
                        @click="changeTask(cate.value)"
                        class="select-category"
                        :class="{ active: currentTask == cate.value }"
                    >
                        {{ cate.label }}
                    </li>
                </ul>
                <div v-else>カテゴリーが登録されていません。</div>
                <!-- タスク表示セクション -->
                <div class="task-group" v-if="filterCategory.length">
                    <h4 class="task-group__title"></h4>
                    <div
                        v-for="(task, index) in filterTask"
                        :key="task.id"
                        class="task"
                        @click="openEdit($event, task)"
                    >
                        <p class="task__index">{{ index + 1 }}</p>
                        <p class="task__body">{{ task.content }}</p>
                    </div>
                    <div class="task-bottom">
                        <div v-if="!showForm">
                            <span
                                class="material-icons add-icon"
                                @click.prevent="showForm = !showForm"
                            >
                                add_circle_outline
                            </span>
                        </div>
                        <div v-else>
                            <ValidationObserver
                                v-slot="ObserverProps"
                                ref="obs"
                            >
                                <form @submit.prevent="addTask">
                                    <ValidationProvider
                                        rules="required|max:100"
                                        name="タスク内容"
                                    >
                                        <div slot-scope="ProviderProps">
                                            <textarea
                                                v-model="taskForm.content"
                                                class="form-control add-textarea"
                                            ></textarea>
                                            <p class="text-danger small">
                                                {{ ProviderProps.errors[0] }}
                                            </p>
                                        </div>
                                    </ValidationProvider>
                                    <button
                                        class="btn btn-secondary btn-taskadd"
                                        type="submit"
                                        :disabled="
                                            ObserverProps.invalid ||
                                            !ObserverProps.validated
                                        "
                                    >
                                        ADD TASK
                                    </button>
                                </form>
                            </ValidationObserver>
                        </div>
                    </div>
                </div>
                <div v-else>
                    カテゴリーが登録されていないと、タスクは登録できません。
                </div>
            </div>
        </div>
        <ModalEdit
            v-if="showModal"
            @emitClose="closeEdit"
            @update="getTask"
            :task="propsTask"
        ></ModalEdit>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ModalEdit from "../components/ModalEdit.vue";
import SelectShopBox from "../components/form/ShopSelectBox";
import SelectPositionBox from "../components/form/PositionSelectBox";

import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
    data() {
        return {
            shopId: null,
            positionId: null,
            taskData: null,
            currentTask: null,
            showModal: false,
            showForm: false,
            taskForm: {
                content: "",
            },
        };
    },
    components: {
        ModalEdit,
        ValidationObserver,
        ValidationProvider,
        SelectShopBox,
        SelectPositionBox,
    },
    computed: {
        ...mapGetters({
            category: "options/taskCategory",
        }),
        ...mapState("auth", {
            currentAuth: function (state) {
                if (state.user.authority === 2) {
                    this.shopId = state.user.shop_id;
                }
                return state.user.authority;
            },
        }),
        filterTask() {
            return this.taskData.filter((item) => {
                if (
                    item.position_id == this.positionId &&
                    item.category_id == this.currentTask
                ) {
                    return true;
                }
            });
        },
        filterCategory() {
            if (this.category.length) {
                let list = this.category.filter(
                    (item) => item.position_id == this.positionId
                );
                this.currentTask = list[0].value;
                return list;
            }
            return [];
        },
    },
    methods: {
        async getTask() {
            const response = await axios.get(`/api/task/${this.shopId}`);

            this.taskData = [];

            this.taskData = response.data.data;
        },
        //新規タスク登録
        async addTask() {
            this.taskForm["shop_id"] = this.shopId;
            this.taskForm["position_id"] = this.positionId;
            this.taskForm["category_id"] = this.currentTask;

            const response = await axios.post("/api/task", this.taskForm);

            if (response.status === 201) {
                this.showForm = false;
                this.taskForm = { content: "" };

                this.taskData.push(response.data);
            }
        },
        changeTask(key) {
            this.showForm = false;
            this.taskForm = { content: "" };
            this.currentTask = key;
        },
        //modal オープン
        openEdit(event, task) {
            this.showModal = true;
            this.propsTask = task;
        },
        //modal クローズ
        closeEdit() {
            this.showModal = false;
        },
    },
    watch: {
        shopId() {
            if (this.positionId) {
                this.showForm = false;
                this.taskForm = { content: "" };
                this.getTask();
            }
        },
        positionId() {
            if (this.shopId) {
                this.showForm = false;
                this.taskForm = { content: "" };
                this.getTask();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.select-box-area {
    max-width: 400px;
    width: 90%;
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
        flex: 1;
    }
}
.task-bottom {
    text-align: center;
    padding: 0.7em 0;
    line-height: 1em;
    .add-icon {
        cursor: pointer;
        font-size: 2.5em;
    }
    .add-textarea {
        width: 90%;
        margin: 1em auto 0 auto;
    }
    .btn-taskadd {
        margin: 1em 0;
    }
}
</style>
