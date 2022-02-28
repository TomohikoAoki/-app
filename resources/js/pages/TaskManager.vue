<template>
    <div>
        <h2>TASK MANAGEMENT</h2>
        <div>
            <div class="select-box-area">
                <div class="form-group row">
                    <label class="label">店舗をお選び下さい</label>
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
                    <label class="label">ポジションをお選び下さい。</label>
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
                <div
                    v-for="(value, key) in taskData"
                    :key="key"
                    class="task-group"
                >
                    <h3>{{ category[value[0].category_id] }}</h3>
                    <div
                        v-for="(task, index) in value"
                        :key="task.id"
                        class="task"
                    >
                        <p class="task__index">{{ index + 1 }}</p>
                        <p class="task__body">{{ task.content }}</p>
                    </div>
                </div>
                <div class="pagination">
                    <button>&laquo; prev</button>
                    <button>next &raquo;</button>
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
            currentPage: 0,
            lastPage: 0,
        };
    },
    computed: {
        ...mapGetters({
            shops: "options/Shops",
            positions: "options/Positions",
            category: "options/taskCategory",
        }),
        isFirstPage() {
            return this.currentPage === 1;
        },
        isLastPage() {
            return this.currentPage === this.lastPage;
        },
    },
    methods: {
        async getTask() {
            const response = await axios.get(
                `/api/task?page=${this.currentPage}&shop=${this.shopId}&position=${this.positionId}`
            );

            this.taskData = {};

            console.log(response.data);

            response.data.data.forEach((data) => {
                let categoryId = data.category_id;

                if (categoryId in this.taskData) {
                    this.taskData[categoryId].push(data);
                    return false;
                }

                this.taskData[categoryId] = [data];
            });

            this.currentPage = response.data.current_page;
            this.lastPage = response.data.last_page;
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
