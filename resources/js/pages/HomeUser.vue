<template>
    <div>
        <p>USER HOME</p>
        <p>{{ user.name }}のHOME</p>
        <div v-if="viewData">
            <div class="all-area">
                <p class="point-label">合計</p>
                <div class="point">
                    <span class="current-point"
                        >{{ allCurrentPoint }}&nbsp;/</span
                    >
                    <span>{{ allFullPoint }}</span>
                </div>
            </div>
            <div class="category-area">
                <div
                    v-for="category in filterCategories"
                    :key="category.value"
                    class="category"
                >
                    <p class="point-label">{{ category.label }}</p>
                    <div class="point">
                        <span class="current-point"
                            >{{ currentPoint(category.value) }}&nbsp;/</span
                        >
                        <span>{{ fullPoint(category.value) }}</span>
                    </div>
                    <div>達成率:&nbsp;{{ achieveRate(category.value) }}%</div>
                </div>
                <div class="category" style="visibility: hidden"></div>
                <div class="category" style="visibility: hidden"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            viewData: null,
        };
    },
    computed: {
        ...mapGetters({
            user: "auth/user",
            taskCategory: "options/taskCategory",
        }),
        filterCategories() {
            return this.taskCategory(this.user.shop_id).filter(
                (item) =>
                    item.position_id == this.user.position_id ||
                    item.position_id == 3
            );
        },
        allFullPoint() {
            return this.viewData.length * 5;
        },
        allCurrentPoint() {
            return this.viewData.reduce((a, b) => {
                return a + b.point;
            }, 0);
        },
        fullPoint() {
            return function (categoryValue) {
                let list = this.viewData.filter(
                    (item) => item.category_id == categoryValue
                );

                return list.length * 5;
            };
        },
        currentPoint() {
            return function (categoryValue) {
                let list = this.viewData.filter(
                    (item) => item.category_id == categoryValue
                );

                return list.reduce((a, b) => {
                    return a + b.point;
                }, 0);
            };
        },
        achieveRate() {
            return function (categoryValue) {
                let list = this.viewData.filter(
                    (item) => item.category_id == categoryValue
                );

                let rate = 100 / (list.length * 5);

                let point = list.reduce((a, b) => {
                    return a + b.point;
                }, 0);

                return Math.floor(point * rate);
            };
        },
    },
    methods: {
        async createViewData() {
            const responseTask = await axios.get(
                `/api/task/${this.user.shop_id}`
            );

            const response = await axios.get(
                `/api/point?user_id=${this.user.id}`
            );

            let points = response.data.data.points;

            let arrData = [];

            let tasks = responseTask.data.data.filter(
                (task) =>
                    task.position_id == this.user.position_id ||
                    task.position_id == 3
            );

            tasks.forEach((task) => {
                let obj = {};
                obj.task_id = task.id;
                obj.point = 0;
                obj.category_id = task.category_id;

                if (points.length) {
                    let target = points.find((item) => item.task_id == task.id);

                    if (target) {
                        obj.point = target.point;
                    }
                }

                arrData.push(obj);
            });
            this.viewData = arrData;
        },
    },
    mounted() {
        this.createViewData();
    },
};
</script>

<style scoped lang="scss">
.all-area {
    border: 2px solid;
    text-align: center;
    border-radius: 10px;
    padding: 1em 0;
    margin: 0 auto 1em auto;
    max-width: 300px;
    .point-label {
        margin: 0;
        font-size: 2em;
    }
    .point {
        .current-point {
            font-size: 3em;
        }
    }
}
.category-area {
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    margin: 0 auto;
    justify-content: center;
    .category {
        width: 47%;
        border: 1px solid;
        text-align: center;
        border-radius: 10px;
        padding: 1.2em 0 0.7em 0;
        margin: 0.3em 0.3em;
        max-width: 270px;
        .point-label {
            margin: 0;
            font-size: 1.1em;
        }
        .point {
            .current-point {
                font-size: 3em;
            }
        }
    }
    & > div:last-child {
        visibility: hidden;
    }
}
</style>
