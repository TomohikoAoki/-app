<template>
    <div>
        <h2>CATEGORY MANAGE</h2>
        <h3>カテゴリー作成</h3>
        <ValidationObserver v-slot="ObserverProps" ref="obs">
            <form @submit.prevent="addCategory">
                <div class="select-box-area">
                    <SelectPositionBox v-model="positionId">
                    </SelectPositionBox>
                </div>
                <div>
                    <ValidationProvider
                        rules="required|max:10"
                        name="タスク内容"
                    >
                        <div slot-scope="ProviderProps">
                            <textarea
                                v-model="categoryForm.label"
                                class="form-control add-textarea"
                            ></textarea>
                            <p class="text-danger small">
                                {{ ProviderProps.errors[0] }}
                            </p>
                        </div>
                    </ValidationProvider>
                    <button
                        class="btn btn-secondary"
                        type="submit"
                        :disabled="
                            ObserverProps.invalid || !ObserverProps.validated
                        "
                    >
                        ADD TASK
                    </button>
                </div>
            </form>
        </ValidationObserver>
        <h3>店舗使用カテゴリー</h3>
        <div class="select-box-area">
            <SelectShopBox v-model="shopId"></SelectShopBox>
        </div>
        <PositionSelect v-model="currentPosition" :selected="currentPosition"></PositionSelect>
        <ul>

                <li v-for="category in filterCategory" :key="category.value"></li>
        </ul>
        {{ shopId }}
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import { ValidationObserver, ValidationProvider } from "vee-validate";
import SelectShopBox from "../components/form/ShopSelectBox";
import SelectPositionBox from "../components/form/PositionSelectBox";
import PositionSelect from "../components/parts/CurrentPosition.vue"

export default {
    data() {
        return {
            shopId: "",
            positionId: "",
            categoryList: "",
            usedList: "",
            categoryForm: {
                label: "",
            },
            currentPosition: 1,
        };
    },
    components: {
        SelectShopBox,
        SelectPositionBox,
        PositionSelect,
        ValidationObserver,
        ValidationProvider,
    },
    computed: {
        ...mapGetters({
            categories: "options/taskCategory",
        }),
    },
    methods: {
        //新規カテゴリー作成
        async addCategory() {
            this.categoryForm["position_id"] = this.positionId;

            const response = await axios.post(
                "/api/category/create",
                this.categoryForm
            );
        },
        filterCategory() {
            return this.categories.filter((item) => {
                item.position_id == this.currentPosition
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.select-box-area {
    max-width: 400px;
    width: 90%;
    margin: 10px auto;
}
</style>
