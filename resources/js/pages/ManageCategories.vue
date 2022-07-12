<template>
    <div>
        <h2>CATEGORY MANAGE</h2>
        <h3>カテゴリー作成</h3>
        <form>
            <div class="form-group row">
                <label class="label">ポジション選択</label>
                <select v-model="positionId" class="form-control">
                    <option
                        v-for="position in positions"
                        :key="position.value"
                        :value="position.value"
                    >
                        {{ position.label }}
                    </option>
                </select>
            </div>
            <div>
                <ValidationObserver v-slot="ObserverProps" ref="obs">
                    <form @submit.prevent="addCategory">
                        <ValidationProvider
                            rules="required|max:10"
                            name="タスク内容"
                        >
                            <div slot-scope="ProviderProps">
                                <textarea
                                    v-model="categoryForm.content"
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
                                ObserverProps.invalid ||
                                !ObserverProps.validated
                            "
                        >
                            ADD TASK
                        </button>
                    </form>
                </ValidationObserver>
            </div>
        </form>
        <h3>店舗使用カテゴリー</h3>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import { ValidationObserver, ValidationProvider } from "vee-validate";
import Axios from "axios";

export default {
    data() {
        return {
            shopId: "",
            positionId: "",
            categoryList: "",
            usedList: "",
            categoryForm: {
                content: ""
            }
        };
    },
    components: {
        ValidationObserver,
        ValidationProvider,
    },
    computed: {
        ...mapGetters({
            shops: "options/Shops",
            categories: "options/taskCategory",
            positions: "options/Positions",
        }),
    },
    methods: {
        //新規カテゴリー作成
        async addCategory() {
            this.categoryForm["position_id"] = this.positionId;

            const response = await Axios.post('/api/category/create', this.categoryForm)
        }
    }
};
</script>
