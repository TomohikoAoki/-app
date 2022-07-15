const state = {
    shops: null,
    positions: [
        { value: "1", label: "ホール" },
        { value: "2", label: "キッチン" },
        { value: "3", label: "共通" },
    ],
    lunks: [
        { value: "1", label: "店長" },
        { value: "2", label: "チーフ" },
        { value: "3", label: "ホール長" },
        { value: "4", label: "主任" },
        { value: "5", label: "プロレベル" },
        { value: "6", label: "感動レベル" },
        { value: "7", label: "安心レベル" },
        { value: "8", label: "標準レベル" },
        { value: "9", label: "初心者レベル" },
        { value: "10", label: "新人レベル" },
    ],
    authority: [
        { value: "1", label: "管理者" },
        { value: "2", label: "店舗管理者" },
        { value: "3", label: "ユーザー" },
    ],
    categories: null,
    shopUsedCategory: null,
    categoriesFiltered: null,
};

const getters = {
    Shops: (state) => state.shops,
    Positions: (state) => state.positions,
    Lunks: (state) => state.lunks,
    optionAuth: (state) => state.authority,
    taskCategory: (state) => state.categories,
    shopLabels: (state) => $_makeLabels(state.shops),
    lunkLabels: (state) => $_makeLabels(state.lunks),
    positionLabels: (state) => $_makeLabels(state.positions),
    authLabels: (state) => $_makeLabels(state.authority),
    categoryLabels: function(state) {
        return function(shopId) {
            let list = state.categories.filter(
                (item) => item.shop_id == shopId
            );
            return $_makeLabels(list);
        };
    },
    stateShopUsedCategory: (state) => state.shopUsedCategory,
    storeCategoriesFiltered: (state) => state.categoriesFiltered,
};

const mutations = {
    setShops(state, data) {
        state.shops = data;
    },
    setCategories(state, data) {
        state.categories = data;
    },
    setShopUsedCategory(state, data) {
        state.shopUsedCategory = data;
    },
    setCategoriesFiltered(state, data) {
        state.categoriesFiltered = data;
    },
};

const actions = {
    async getShops({ commit }) {
        const response = await axios.get("/api/shop/index");

        let shops = [];

        response.data.forEach((item) => {
            item.value = item.id;
            item.label = item.shop_name;

            delete item.id;
            delete item.shop_name;

            shops.push(item);
        });

        shops.sort((a, b) => a.value - b.value);

        commit("setShops", shops);
    },
    async getCategories({ commit }) {
        const response = await axios.get("/api/category/index");

        let categories = [];

        response.data.forEach((item) => {
            item.value = item.id;

            delete item.id;

            categories.push(item);
        });

        commit("setCategories", categories);
    },
    async getCategoriesFiltered({ commit, dispatch }, shopId) {
        if (!state.categories) await dispatch("getCategories");
        await dispatch("getShopUsedCategory", shopId);

        let [categories, shopUsed] = [state.categories, state.shopUsedCategory];

        if (categories && shopUsed) {
            let list = []
            shopUsed.forEach((item) => {
                categories.forEach((obj) => {
                    if (Number(obj.value) === Number(item)) {
                        list.push(obj);
                    }
                });
            });
            commit("setCategoriesFiltered", list);
        }
    },
    async getShopUsedCategory({ commit }, shopId) {
        const response = await axios.get(`/api/category/shop/${shopId}/index`);

        if (!response.data) {
            commit("setShopUsedCategory", []);
            return;
        }

        commit("setShopUsedCategory", response.data);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};

//プライベート関数
function $_makeLabels(arr) {
    return arr.reduce((a, b) => {
        return Object.assign(a, {
            [b.value]: b.label,
        });
    }, {});
}