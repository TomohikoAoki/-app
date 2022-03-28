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
    taskCate: [
        { value: "1", label: "NHK・身だしなみ", shop_id: "1", position_id: "3" },
        { value: "2", label: "お茶番・バッシング", shop_id: "1", position_id: "1" },
        { value: "3", label: "運び", shop_id: "1", position_id: "1" },
        { value: "4", label: "オーダー", shop_id: "1", position_id: "1" },
        { value: "5", label: "セッター", shop_id: "1", position_id: "1" },
        { value: "6", label: "パートナー", shop_id: "1", position_id: "1" },
        { value: "7", label: "花番", shop_id: "1", position_id: "1" },
        { value: "8", label: "キャベツ切る", shop_id: "1", position_id: "2" },
        { value: "9", label: "ガルニ", shop_id: "1", position_id: "2" },
        { value: "10", label: "仕込み", shop_id: "1", position_id: "2" },
        { value: "11", label: "揚げ技術", shop_id: "1", position_id: "2" },
        { value: "12", label: "準備・片付け", shop_id: "1", position_id: "2" },
        { value: "13", label: "皿洗い・炊飯", shop_id: "1", position_id: "2" },
        { value: "14", label: "お茶番・バッシング", shop_id: "2", position_id: "1" },
        { value: "15", label: "キャベツ切る", shop_id: "2", position_id: "2" },
    ],
};

const getters = {
    Shops: (state) => state.shops,
    Positions: (state) => state.positions,
    Lunks: (state) => state.lunks,
    optionAuth: (state) => state.authority,
    taskCategory: (state) =>
        function(shopId) {
            return state.taskCate.filter((item) => item.shop_id == shopId)
        },
    shopLabels: (state) => $_makeLabels(state.shops),
    lunkLabels: (state) => $_makeLabels(state.lunks),
    positionLabels: (state) => $_makeLabels(state.positions),
    authLabels: (state) => $_makeLabels(state.authority),
    categoryLabels: (state) =>
        function(shopId) {
            let list = state.taskCate.filter((item) => item.shop_id == shopId);
            return $_makeLabels(list);
        },
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

        shops.sort((a, b) => a.value - b.value);

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

//プライベート関数
function $_makeLabels(arr) {
    return arr.reduce((a, b) => {
        return Object.assign(a, {
            [b.value]: b.label,
        });
    }, {});
}