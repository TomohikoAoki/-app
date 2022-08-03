<template>
    <div>
        <ul class="category-area" v-if="!noListFlag">
            <li
                v-for="cate in filterCategory"
                :key="cate.value"
                :value="cate.value"
                @click="changeCategory"
                class="select-category"
                :class="{ active: currentCategory == cate.value }"
            >
                {{ cate.label }}
            </li>
        </ul>
        <div v-else>
            <p>
                カテゴリーが登録されていません。<br />
                カテゴリーが登録されていないと、タスクは登録できません。<br />
                下記からカテゴリーを登録して下さい。<br />
            </p>
            <router-link
                :to="{
                    name: 'category-manage',
                    query: { shopId: shopId },
                }"
                class="to-category-manage"
                >カテゴリー管理</router-link
            >
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            noListFlag: false,
        };
    },
    props: ["shopId", "positionId", "currentCategory", "concatCommonFlag"],
    computed: {
        ...mapGetters({
            categories: "options/storeCategoriesFiltered",
        }),
        filterCategory() {
            if (this.categories) {
                let list = this.categories.filter((item) => {
                    //共通カテゴリもまとめて表示の場合
                    if (this.concatCommonFlag) {
                        return (
                            Number(item.position_id) ===
                                Number(this.positionId) ||
                            Number(item.position_id) == 3
                        );
                    }
                    //共通カテゴリを分けて表示の場合
                    return Number(item.position_id) === Number(this.positionId);
                });

                this.noListFlag = !list.length ? true : false;

                if (!this.noListFlag) {
                    if (
                        !list.some(
                            (item) =>
                                Number(item.value) ===
                                Number(this.currentCategory)
                        )
                    )
                        this.$emit("input", list[0].value);
                } else {
                    this.$emit("input", null);
                }

                return list;
            }

            return [];
        },
    },
    methods: {
        changeCategory: function (e) {
            this.selected = e.target.value;
            this.$emit("input", e.target.value);
        },
        //カテゴリー取得関数
        async getCategories() {
            await this.$store.dispatch(
                "options/getCategoriesFiltered",
                this.shopId
            );
        },
    },
    watch: {
        shopId: function () {
            this.getCategories();
        },
        categories: function () {
            this.noListFlag = false;
        },
    },
    mounted() {
        this.getCategories();
    },
};
</script>

<style lang="scss" scoped>
.category-area {
    list-style: none;
    margin: 0;
    padding: 0;
    .select-category {
        display: inline-block;
        cursor: pointer;
        border: 1px solid;
        padding: 1em;
        margin: 0.2em;
        border-radius: 2px;
        &.active {
            background-color: rgb(236, 236, 236);
            color: #313644;
        }
    }
}
</style>
