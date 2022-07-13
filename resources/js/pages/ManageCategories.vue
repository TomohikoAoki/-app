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
                        ADD CATE
                    </button>
                </div>
            </form>
        </ValidationObserver>
        <h3>使用カテゴリー</h3>
        <div class="select-box-area">
            <SelectShopBox v-model="shopId"></SelectShopBox>
        </div>
        <PositionSelect
            v-model="currentPosition"
            :selected="currentPosition"
        ></PositionSelect>
        <!--カテゴリー一覧-->
        <ul class="category-list">
            <li
                v-for="category in filterCategory"
                :key="category.value"
                :value="category.value"
                :class="{ used: category.flag }"
                @click="changeFlag(category)"
            >
                {{ category.label }}
            </li>
        </ul>
        <!--使用するカテゴリー-->
        <ul class="used-list">
            <li
                v-for="category in filterUsedCategory"
                :key="category.value"
                :value="category.value"
                @click="changeMoveFlag(category.value)"
                :class="{active: category.moveFlag}"
            >
                {{ category.label }}
            </li>
        </ul>
        <button>上</button>
        <button>下</button>
        {{ usedList }}
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { OK, CREATED } from "../util";

import { ValidationObserver, ValidationProvider } from "vee-validate";
import SelectShopBox from "../components/form/ShopSelectBox";
import SelectPositionBox from "../components/form/PositionSelectBox";
import PositionSelect from "../components/parts/CurrentPosition.vue";

export default {
    data() {
        return {
            shopId: "",
            positionId: "",
            usedList: [1, 3, 5, 7, 9, 11, 13],
            categoryForm: {
                label: "",
            },
            currentPosition: 1,
            moveFlag: null,
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
        filterCategory() {
            this.categories.forEach((item) => {
                if (this.usedList.includes(item.value)) {
                    item["flag"] = true;
                    return;
                }
                item["flag"] = false;
            });
            return this.categories.filter(
                (item) => item.position_id == this.currentPosition
            );
        },
        filterUsedCategory() {
            //順番大事だからフィルター使わずforEachで
            let list = []
            this.usedList.forEach((item) => {
                this.categories.forEach((obj) => {
                   if( Number(obj.value) === Number(item) ) {
                    //移動用フラグ あれば true なければ　false
                    obj['moveFlag'] = this.moveFlag === obj.value ? true : false
                    list.push(obj)
                   }
                })
            })

            return list.filter(
                (item) => item.position_id == this.currentPosition
            );
        },
    },
    methods: {
        //新規カテゴリー作成
        async addCategory() {
            this.categoryForm["position_id"] = this.positionId;

            const response = await axios.post(
                "/api/category/create",
                this.categoryForm
            );

            if (response.status === CREATED) {
                this.categoryForm = { label: "" };
                this.$store.dispatch("options/getCategories");
                this.$refs.obs.reset();
            }
        },
        changeFlag(obj) {
            if (!obj.flag) {
                this.usedList.push(Number(obj.value))
                return
            }
            //moveFlag立ってたら削除
            this.moveFlag = this.moveFlag === obj.value ? null : this.moveFlag
            this.usedList.splice(this.usedList.indexOf(Number(obj.value)), 1)
        },
        changeMoveFlag(value) {
            this.moveFlag = this.moveFlag == value ? null : value
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
.used {
    color: #f88874;
}
.active {
    background-color: aqua;
}
</style>
