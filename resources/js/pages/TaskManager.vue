<template>
    <div>
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
                <button type="submit" class="btn btn-dark" @click="getTask">
                    GET TASK
                </button>
            </div>
            <div v-if="taskData">
                <ul>
                    <li
                        v-for="(value, key) in taskData"
                        :key="key"
                        @click="changeTask(key)"
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
                    >
                        <p class="task__index">{{ index + 1 }}</p>
                        <p class="task__body">{{ task.content }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
    data() {
        return {
            shopId: null,
            positionId: null,
            taskData: null,
            currentTask: 1,
        };
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
        changeTask(key) {
            this.currentTask = key;
        },
    },
};
</script>

<style scoped lang="scss">
.select-box-area {
    max-width: 400px;
    margin: 10px auto;
}
.task-group {
    border: 1px solid;
    margin: 1em 0;
    h3 {
        padding-top: 1em;
    }
}
.task {
    display: flex;
    border-bottom: 1px dotted;
    padding: 1em 0;
    &__index {
        width: 2em;
        text-align: center;
        margin: 0;
    }
    &__body {
        margin: 0;
    }
}
</style>
