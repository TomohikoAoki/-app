function $_makeLabels(arr) {
    return arr.reduce((a, b) => {
        return Object.assign(a, {
            [b.value]: b.label
        });
    }, {});
}

const state = {
    shops: null,
    positions: [
        { value: "1", label: "ホール" },
        { value: "2", label: "キッチン" },
        { value: "3", label: "その他" },
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
    taskCate: [
        { value: "1", label: "NHK・身だしなみ" },
        { value: "2", label: "お茶番・バッシング" },
        { value: "3", label: "運び" },
        { value: "4", label: "オーダー" },
        { value: "5", label: "セッター" },
        { value: "6", label: "パートナー" },
        { value: "7", label: "花番" },
    ],
};

const getters = {
    Shops: (state) => state.shops,
    Positions: (state) => state.positions,
    Lunks: (state) => state.lunks,
    optionAuth: (state) => state.authority,
    taskCategory: (state) => state.taskCate,
    shopLabels: (state) => $_makeLabels(state.shops),
    lunkLabels: (state) => $_makeLabels(state.lunks),
    positionLabels: (state) => $_makeLabels(state.positions),
    authLabels: (state) => $_makeLabels(state.authority),
    categoryLabels: (state) => $_makeLabels(state.taskCate),
};

const mutations = {
    setShops(state, data) {
        state.shops = data;
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

        commit("setShops", shops);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};