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
                    <select v-model="positionId" class="form-control">
                        <option
                            v-for="user in users"
                            :key="user.id"
                            :value="user.position_id"
                        >
                            {{ user.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div v-if="taskData" class="task-data-area">
                <h3 class="task-data-area__title">TASK</h3>
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
                        @click="openEdit($event, task)"
                    >
                        <p class="task__index">{{ index + 1 }}</p>
                        <p class="task__body">{{ task.content }}</p>
                    </div>
                </div>
            </div>
            <button type="button" @click="sendData">データ送信</button>
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
            users: null,
            currentTask: 1,
            taskData: null,
            pointData: null,
            formData: {
                givenPointList: []
            }
        };
    },
    methods: {
        async fetchUsers() {
            const response = await axios.get(`/api/user/get/${this.shopId}`);

            this.users = response.data.data;
        },
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
        async sendData() {
            const response = await axios.post('/api/point-l', this.formData)

            console.log(response.status)
        },
        changeTask(key) {
            this.currentTask = key;
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
            return this.taskData[this.currentTask];
        },
    },
    watch: {
        shopId() {
            this.fetchUsers();
        },
        positionId() {
            this.getTask();
        },
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
        flex: 1;
    }
}
</style>
