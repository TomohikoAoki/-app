<template>
    <div class="category-manage">
        <h2>CATEGORY MANAGE</h2>
        <div>
            <h3 class="used-categories-title">使用カテゴリー</h3>
            <div class="select-box-area shop">
                <SelectShopBox
                    v-model="shopId"
                    v-if="currentAuth == 1"
                ></SelectShopBox>
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
                                />
                            </svg>
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
                                />
                            </svg>
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
                        <SelectPositionBox
                            v-model="currentPosition"
                            :selected="currentPosition"
                        >
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
                    <button
                        class="btn btn-secondary add-cate"
                        type="submit"
                        :disabled="
                            ObserverProps.invalid || !ObserverProps.validated
                        "
                    >
                        ADD CATE
                    </button>
                </form>
            </ValidationObserver>
        </div>
        <div class="register" @click="registerData">登録</div>
        <ModalConfirmVue :okFlag="okFlag" v-model="okFlag"></ModalConfirmVue>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import { ValidationObserver, ValidationProvider } from "vee-validate";
import SelectShopBox from "../components/form/ShopSelectBox";
import SelectPositionBox from "../components/form/PositionSelectBox";
import PositionSelect from "../components/parts/CurrentPosition.vue";
import ModalConfirmVue from "../components/ModalConfirm.vue";

export default {
    data() {
        return {
            shopId: 1,
            usedList: null,
            categoryForm: {
                label: "",
            },
            currentPosition: 1,
            moveFlag: null,
            okFlag: false,
        };
    },
    components: {
        SelectShopBox,
        SelectPositionBox,
        PositionSelect,
        ModalConfirmVue,
        ValidationObserver,
        ValidationProvider,
    },
    computed: {
        ...mapGetters({
            categories: "options/taskCategory",
            shopUsedCategory: "options/stateShopUsedCategory",
            optionsApiStatus: "options/getOptionsApiStatus",
        }),
        ...mapState("auth", {
            //店舗管理者判定
            currentAuth: function (state) {
                if (state.user.authority === 2) {
                    this.shopId = state.user.shop_id;
                }
                return state.user.authority;
            },
        }),
        //カテゴリー一覧（ポジションごと）
        //使用されてる判定のflag property 追加
        filterCategory() {
            if (this.usedList) {
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
            }
        },
        //使用カテゴリー
        filterUsedCategory() {
            if (this.usedList) {
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
            }
        },
    },
    methods: {
        //新規カテゴリー作成
        async addCategory() {
            this.categoryForm["position_id"] = this.currentPosition;

            await this.$store.dispatch(
                "options/registerCategory",
                this.categoryForm
            );

            if (this.optionsApiStatus) {
                this.categoryForm = { label: "" };
                this.$refs.obs.reset();
            }
        },
        //使用カテゴリー取得　（店舗ごと）
        async getUsedCategory() {
            await this.$store.dispatch(
                "options/getShopUsedCategory",
                this.shopId
            );

            this.usedList = this.shopUsedCategory;
        },
        //使用するカテゴリー登録（店舗ごと）
        async registerData() {
            let formUsedList = {};

            //共通を一番前に変更
            let list = [];
            this.categories.forEach((item) => {
                if (Number(item.position_id) === 3) {
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

            formUsedList["used_category"] = arr.concat(residueUsedList);
            formUsedList["shop_id"] = this.shopId;

            await this.$store.dispatch(
                "options/registerShopUsedCategory",
                formUsedList
            );

            if (this.optionsApiStatus) {
                this.getUsedCategory();
                this.okFlag = true;
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
                //全カテゴリーから現在のポジションでフィルタリングしてlistに（使用カテゴリーが全ポジションが混在しているため抽出用）ついでにidだけに
                let list = [];
                this.categories.forEach((item) => {
                    if (
                        Number(item.position_id) ===
                        Number(this.currentPosition)
                    ) {
                        list.push(item.value);
                    }
                });

                //抽出用配列を使って使用カテゴリーを、使用していて現在のポジションのカテゴリー(arr)と
                //使ってるけど違うポジションのカテゴリー(residueUseList)に分ける
                let residueUsedList = [];

                let arr = this.usedList.filter((item) => {
                    if (list.includes(item)) {
                        return true;
                    }
                    residueUsedList.push(item);
                    return false;
                });

                //順番入れ替え作業 配列のindexで
                const index = arr.indexOf(this.moveFlag);
                const lastIndex = arr.length - 1;

                switch (direct) {
                    case 0: // move up
                        if (index) {
                            let v = arr[index - 1];

                            arr.splice(index - 1, 1, this.moveFlag);
                            arr.splice(index, 1, v);

                            //違うポジションの配列と結合
                            this.usedList = arr.concat(residueUsedList);
                        }
                        break;
                    case 1: // move down
                        if (arr[lastIndex] !== this.moveFlag) {
                            let v = arr[index + 1];

                            arr.splice(index + 1, 1, this.moveFlag);
                            arr.splice(index, 1, v);

                            //違うポジションの配列と結合
                            this.usedList = arr.concat(residueUsedList);
                        }
                }
            }
        },
    },
    watch: {
        currentPosition: function () {
            this.moveFlag = null;
        },
        shopId: {
            immediate: true,
            handler: function () {
                this.getUsedCategory();
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.category-manage {
    position: relative;
}

.used-categories-title {
    text-align: center;
}
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
    cursor: pointer;
}
</style>
