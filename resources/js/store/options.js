const state = {
    shops: null,
    positions: {
        1: "ホール",
        2: "キッチン",
        3: "その他",
    },
    lunks: {
        1: "店長",
        2: "チーフ",
        3: "ホール長",
        4: "主任",
        5: "プロレベル",
        6: "感動レベル",
        7: "安心レベル",
        8: "標準レベル",
        9: "初心者レベル",
        10: "新人レベル",
    },
    authority: {
        1: "管理者",
        2: "店舗管理者",
        3: "ユーザー",
    },
    taskCate: {
        1: "NHK・身だしなみ",
        2: "お茶番・バッシング",
        3: "運び",
        4: "オーダー",
        5: "セッター",
        6: "パートナー",
        7: "花番",
    }
};

const getters = {
    Shops: (state) => state.shops,
    Positions: (state) => state.positions,
    Lunks: (state) => state.lunks,
    optionAuth: (state) => state.authority,
    taskCategory: (state) => state.taskCate,
};

const mutations = {
    setShops(state, data) {
        state.shops = data;
    },
};

const actions = {
    async getShops({ commit }) {
        const response = await axios.get("/api/shop/index");

        let shops = response.data.reduce(function(a, b) {
            return Object.assign(a, {
                [b.id]: b.shop_name,
            });
        }, {});

        commit('setShops', shops)
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};