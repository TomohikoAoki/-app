<template>
    <div>
        <h2>店舗登録</h2>
        <form @submit.prevent="registerShop">
            <div>
                <label for="shopname">店舗名</label>
                <input
                    type="text"
                    id="shopname"
                    v-model="registerShopForm.shopname"
                />
            </div>
            <button type="submit">店舗登録</button>
        </form>
        <div>
            <ul class="shop-list-box">
                <li v-for="shop in shops" :key="shop.id" class="shop-list">
                    <p class="shop-list__id">{{ shop.id }}</p>
                    <p class="shop-list__name">{{ shop.shop_name }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            registerShopForm: {
                shopname: "",
            },
            shops: [],
        };
    },
    methods: {
        async fetchShops() {
            const response = await axios.get("api/shop/index");
            this.shops = response.data;
        },
        async registerShop() {
            const response = await axios.post(
                "/api/shop/register",
                this.registerShopForm
            );

            this.registerShopForm.shopname = "";

            this.shops = response.data;
        },
    },
    watch: {
        $route: {
            async handler() {
                await this.fetchShops();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss">
.shop-list {
    width: 500px;
    display: flex;
    list-style-type: none;
    border-bottom: 1px solid;
    &__id {
        flex: 1;
    }
    &__name {
        flex: 3;
    }
}
</style>
