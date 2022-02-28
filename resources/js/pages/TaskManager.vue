<template>
    <div>
        <h2>TASK MANAGEMENT</h2>
        <div>
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
        };
    },
    computed: {
        ...mapGetters({
            shops: "options/Shops",
            positions: "options/Positions",
            category: "options/taskCategory",
        }),
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
            console.log(this.taskData);
        },
    },
};
</script>
