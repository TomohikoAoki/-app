export default {
    isType: function(x) {
        return x != x ?
            "NaN" :
            x === Infinity || x === -Infinity ?
            "Infinity" :
            Object.prototype.toString.call(x).slice(8, -1);
    },

    //taskの配列データ、userデータ（pointデータ含む）,send前のローカルにあるデータから
    //画面表示用のデータの配列を作成する
    createViewData: function(tasks, user, local = null) {
        let dataArray = [];

        let points = user.points ? user.points : [];

        //send前のデータがあればpointを上書き　＆　新規pointを追加
        if (local) {
            let localData = local.filter((item) => item.user_id === user.id);

            if (localData.length) {
                points.forEach((point) => {
                    let target = localData.find((item) => item.id === point.id);

                    if (target) {
                        point.point = target.point;
                        point.updated = true;
                    }
                });

                //新規のデータはpointDataと紐付けられないのでフィルタリングして
                //pushで追加する
                let nullId = localData.filter((item) => item.id === null);

                if (nullId.length) {
                    //そのままぶっこむと参照になってsendDataに影響するので
                    //新規オブジェクトを作ってpointsDataにpush(値渡し)
                    nullId.forEach((item) => {
                        let obj = {};
                        for (let key in item) {
                            obj[key] = item[key];
                        }
                        obj.updated = true;

                        points.push(obj);
                    });
                }
            }
        }

        tasks.forEach((task) => {
            //taskごとのview用データ初期化
            let data = {};
            data.task_id = task.id;
            data.category_id = task.category_id;
            data.point = 0;
            data.point_id = null;
            data.user_id = user.id;
            data.position_id = user.position_id;
            data.updated = false;

            // ユーザーに紐付いたpointData or send前のデータ　があれば
            if (points.length) {
                let target = points.find((point) => point.task_id === task.id);

                if (target) {
                    data.point = target.point;
                    data.point_id = target.id;
                    data.updated = target.updated;
                }
            }

            dataArray.push(data);
        });

        return dataArray;
    },

    /**
     * 任意の桁で四捨五入する関数
     * @param {number} value 四捨五入する数値
     * @param {number} base どの桁で四捨五入するか（10→10の位、0.1→小数第１位）
     * @return {number} 四捨五入した値
     */
    orgRound: function(value, base) {
        return Math.floor(value * base) / base;
    },
};