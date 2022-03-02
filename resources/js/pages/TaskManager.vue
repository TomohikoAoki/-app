<template>
    <div class="task-manage">
        <h2>TASK MANAGEMENT</h2>
        <div>
            <div class="select-box-area">
                <div class="form-group row">
                    <label class="label">店舗選択</label>
                    <select v-model="shopId" class="form-control">
                        <option
                            v-for="(value, key) in shops"
                            :key="key"
                            :value="key"
                        >
                            {{ value }}
                        </option>
                    </select>
                </div>
                <div class="form-group row">
                    <label class="label">ポジション選択</label>
                    <select v-model="positionId" class="form-control">
                        <option
                            v-for="(value, key) in positions"
                            :key="key"
                            :value="key"
                        >
                            {{ value }}
                        </option>
                    </select>
                </div>
                <div class="get-task-button">
                <button type="submit" class="btn btn-secondary" @click="getTask">
                    GET TASK
                </button>
                </div>
            </div>
            <div v-if="taskData">
                <ul class="category-area">
                    <li
                        v-for="(value, key) in taskData"
                        :key="key"
                        @click="changeTask(key)"
                        class="select-category"
                        :class="{ active: currentTask == key }"
                    >
                        {{ category[key] }}
                    </li>
                </ul>
                <div class="task-group">
                    <h3>{{ category[currentTask] }}</h3>
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
                            <form>
                                <textarea
                                    v-model="taskForm.content"
                                    class="form-control add-textarea"
                                ></textarea>
                                <button
                                    class="btn btn-secondary btn-taskadd"
                                    @click="addTask"
                                    type="button"
                                >
                                    ADD TASK
                                </button>
                            </form>
                        </div>
                    </div>
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

export default {
    data() {
        return {
            shopId: null,
            positionId: 1,
            taskData: null,
            currentTask: 1,
            showModal: false,
            showForm: false,
            taskForm: {
                content: "",
            },
        };
    },
    components: {
        ModalEdit,
    },
    computed: {
        ...mapGetters({
            shops: "options/Shops",
            positions: "options/Positions",
            category: "options/taskCategory",
        }),
        filterTask() {
            return this.taskData[this.currentTask];
        },
    },
    methods: {
        async getTask() {
            const response = await axios.get(
                `/api/task?shop=${this.shopId}&position=${this.positionId}`
            );

            this.taskData = {};

            response.data.forEach((data) => {
                let categoryId = data.category_id;

                if (categoryId in this.taskData) {
                    this.taskData[categoryId].push(data);
                    return false;
                }

                this.taskData[categoryId] = [data];
            });
        },
        async addTask() {
            this.taskForm["shop_id"] = this.shopId;
            this.taskForm["position_id"] = this.positionId;
            this.taskForm["category_id"] = this.currentTask;

            const response = await axios.post("/api/task", this.taskForm);

            if (response.status === 201) {
                this.showForm = false;
                this.taskForm = { content: "" };

                this.taskData[response.data.category_id].push(response.data)

            }
        },
        changeTask(key) {
            this.showForm = false;
            this.taskForm = { content: "" };
            this.currentTask = key;
        },
        openEdit(event, task) {
            this.showModal = true;
            this.propsTask = task;
        },
        closeEdit() {
            this.showModal = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.select-box-area {
    max-width: 400px;
    margin: 10px auto;
    .get-task-button {
        text-align: center;
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
    h3 {
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
