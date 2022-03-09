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
                    <select v-model="userId" class="form-control">
                        <option
                            v-for="user in users"
                            :key="user.id"
                            :value="user.id"
                        >
                            {{ user.name }}
                        </option>
                    </select>
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
                    <h4 class="task-group__title">{{ categoryLabels[currentTask] }}</h4>
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
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"

export default {
    data() {
        return {
            shopId: null,
            userId: null,
            users: null,
            currentTask: 1,
            taskData: null,
        }
    },
    methods: {
        async fetchUsers(){
            const response = await axios.get(`/api/user/get/${this.shopId}`)

            this.users = response.data.data
        }
    },
    computed: {
        ...mapGetters({
            currentAuth: "auth/getAuthority",
            shops: "options/Shops",
            category: "options/taskCategory",
            categoryLabels: "options/categoryLabels"
        }),
    },
    watch: {
        shopId() {
            this.fetchUsers()
        }
    }
}
</script>
