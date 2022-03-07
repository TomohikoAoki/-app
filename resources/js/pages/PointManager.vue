<template>
    <div class="point-manage">
        <h2>POINT MANAGE</h2>
        <div>
            <div class="select-box-area">
                <div class="form-group row" v-if="currentAuth == 1">
                    <label class="label" for="shop">店舗選択</label>
                    <select v-model="shopId" class="form-control">
                        <option
                            v-for="shop in shops"
                            :key="shop.value"
                            :value="shop.value"
                        >
                            {{ shop.label }}
                        </option>
                    </select>
                </div>
                <div class="form-group row">
                    <label class="label">ユーザー選択</label>
                    <select v-model="positionId" class="form-control">
                        <option
                            v-for="position in positions"
                            :key="position.value"
                            :value="position.value"
                        >
                            {{ position.label }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"

export default {

}
</script>
