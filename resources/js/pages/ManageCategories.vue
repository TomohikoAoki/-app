<template>
    <div>
        <h2>CATEGORY MANAGE</h2>
        <div>
            <h3>使用カテゴリー選択</h3>
            <div class="select-box-area shop">
                <SelectShopBox v-model="shopId"></SelectShopBox>
            </div>
            <PositionSelect
                v-model="currentPosition"
                :selected="currentPosition"
            ></PositionSelect>
            <!--使用するカテゴリー-->
            <div id="used-list">
                <ul class="used-list-area">
                    <li
                        v-for="category in filterUsedCategory"
                        :key="category.value"
                        :value="category.value"
                        @click="changeMoveFlag(category.value)"
                        :class="{ active: category.moveFlag }"
                    >
                        {{ category.label }}
                    </li>
                </ul>
                <div class="button-area">
                    <div
                        @click="moveCategory(0)"
                        class="button-up"
                        :class="{ nonactive: !moveFlag }"
                    >
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0,0,48,48"
                            >
                                <path
                                    d="M14.15 30.15 12 28l12-12 12 12-2.15 2.15L24 20.3Z"
                                /></svg>
                        </span>
                    </div>
                    <div
                        @click="moveCategory(1)"
                        class="button-down"
                        :class="{ nonactive: !moveFlag }"
                    >
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0,0,48,48"
                            >
                                <path
                                    d="m24 30.8-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z"
                                /></svg>
                        </span>
                    </div>
                </div>
            </div>
            <!--カテゴリー一覧-->
            <ul class="category-list">
                <li
                    v-for="category in filterCategory"
                    :key="category.value"
                    :value="category.value"
                    :class="{ used: category.flag }"
                    @click="changeFlag(category)"
                >
                    <span
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0,0,48,48"
                        >
                            <path
                                d="M18.9 35.7 7.7 24.5l2.15-2.15 9.05 9.05 19.2-19.2 2.15 2.15Z"
                            />
                        </svg>
                    </span>
                    {{ category.label }}<span></span>
                </li>
            </ul>
        </div>
        <h3 class="create-category-title">新規カテゴリー作成</h3>
        <div>
            <ValidationObserver v-slot="ObserverProps" ref="obs">
                <form @submit.prevent="addCategory" class="form-category">
                    <div class="select-box-area">
                        <SelectPositionBox v-model="positionId">
                        </SelectPositionBox>
                    </div>
                    <div class="input-category-area">
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
                    </div>
                    <div
                        class="btn btn-secondary add-cate"
                        type="submit"
                        :disabled="
                            ObserverProps.invalid || !ObserverProps.validated
                        "
                    >
                        ADD CATE
                    </div>
                </form>
            </ValidationObserver>
        </div>
        <div class="register" @click="registerData">登録</div>
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
            usedList: [],
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
            let list = [];
            this.usedList.forEach((item) => {
                this.categories.forEach((obj) => {
                    if (Number(obj.value) === Number(item)) {
                        //移動用フラグ あれば true なければ　false
                        obj["moveFlag"] =
                            this.moveFlag === obj.value ? true : false;
                        list.push(obj);
                    }
                });
            });

            return list.filter(
                (item) => item.position_id == this.currentPosition
            );
        },
    },
    methods: {
        async getUsedCategory() {
            const response = await axios.get(
                `/api/category/shop/${this.shopId}/index`
            );

            if (!response.data) {
                this.usedList = [];
                return;
            }
            this.usedList = response.data;
        },
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
        //使用カテゴリーに追加 or 削除
        changeFlag(obj) {
            if (!obj.flag) {
                this.usedList.push(Number(obj.value));
                return;
            }
            //moveFlag立ってたら削除
            this.moveFlag = this.moveFlag === obj.value ? null : this.moveFlag;
            this.usedList.splice(this.usedList.indexOf(Number(obj.value)), 1);
        },
        //カテゴリー順番入れ替えアクティブに
        changeMoveFlag(value) {
            this.moveFlag = this.moveFlag == value ? null : value;
        },
        //カテゴリー順番入れ替え
        moveCategory(direct) {
            if (this.moveFlag) {
                let list = [];

                this.categories.forEach((item) => {
                    if (
                        Number(item.position_id) ===
                        Number(this.currentPosition)
                    ) {
                        list.push(item.value);
                    }
                });

                let residueUsedList = [];

                let arr = this.usedList.filter((item) => {
                    if (list.includes(item)) {
                        return true;
                    }
                    residueUsedList.push(item);
                    return false;
                });

                const index = arr.indexOf(this.moveFlag);
                const lastIndex = arr.length - 1;

                switch (direct) {
                    case 0: // move up
                        if (index) {
                            let v = arr[index - 1];

                            arr.splice(index - 1, 1, this.moveFlag);
                            arr.splice(index, 1, v);

                            this.usedList = arr.concat(residueUsedList);
                        }
                        break;
                    case 1: // move down
                        if (arr[lastIndex] !== this.moveFlag) {
                            let v = arr[index + 1];

                            arr.splice(index + 1, 1, this.moveFlag);
                            arr.splice(index, 1, v);

                            this.usedList = arr.concat(residueUsedList);
                        }
                }
            }
        },
        async registerData() {
            let formUsedList = {};

            formUsedList["used_category"] = this.usedList;
            formUsedList["shop_id"] = this.shopId;

            const response = await axios.post(
                "api/category/shop/create",
                formUsedList
            );

            console.log(response);
        },
    },
    watch: {
        currentPosition: function () {
            this.moveFlag = null;
        },
        shopId: function () {
            this.getUsedCategory();
        },
    },
};
</script>

<style lang="scss" scoped>
.shop.select-box-area {
    max-width: 400px;
    margin: 10px auto;
    width: 90%;
}

#used-list {
    margin: 30px auto 30px auto;
    display: flex;
    justify-content: center;
    padding: 0;
    max-width: 450px;
    .used-list-area {
        max-width: 400px;
        width: 90%;
        height: 350px;
        overflow-y: scroll;
        margin: 0 auto;
        background-color: rgba(255, 255, 255, 0.9);
        list-style: none;
        padding: 0;
        li {
            width: 100%;
            font-size: 1.2em;
            color: #474747;
            padding: 0.8em 1em;
            margin: 0;
            border-bottom: 1px dotted;
            cursor: pointer;
            &.active {
                background-color: rgb(173, 173, 173);
            }
        }
    }
    .button-area {
        display: block;
        width: 50px;
        margin: 0;
        padding: 0;
        position: relative;
        div {
            width: 50px;
            height: 50px;
            background-color: #999999;
            border-radius: 50%;
            cursor: pointer;
            text-align: center;
            margin-left: 10px;
            &.nonactive {
                background-color: #515151;
            }
            span {
                vertical-align: middle;
                height: 100%;
                width: 100%;
            }
        }
        .button-up {
            position: absolute;
            top: 0;
        }
        .button-down {
            position: absolute;
            bottom: 0;
        }
    }
}
.category-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    li {
        border: 1px solid;
        padding: 1em 0.3em;
        margin: 0.5em;
        cursor: pointer;
        &.used {
            color: #0eb99d;
            span {
                display: inline-block;
                width: 2em;
                svg {
                    visibility: visible;
                    fill: #0eb99d;
                }
            }
        }
        span {
            display: inline-block;
            width: 2em;
            svg {
                visibility: hidden;
            }
        }
    }
}

.create-category-title {
    text-align: center;
}
.form-category {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    max-width: 500px;
    margin: 0 auto;
    .select-box-area {
        width: 120px;
        margin: 0 10px 0 0;
    }
    .input-category-area {
        flex: 1;
        margin: 20px 0 0 0;
        min-width: 200px;
    }
    .add-cate {
        margin: 0 0 0 10px;
        width: 100px;
    }
}
.register {
    border: 1px solid;
    font-size: 2em;
    margin: 50px auto 10px auto;
    padding: 1em;
    max-width: 200px;
    text-align: center;
}
</style>
