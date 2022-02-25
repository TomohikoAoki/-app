<template>
    <div>
        <h2>TASK MANAGEMENT</h2>
        <div class="form-group row">
            <label class="label">店舗をお選び下さい</label>
            <select v-model="shopId" class="form-control">
                <option v-for="(value, key) in shops" :key="key" :value="key">
                    {{ value }}
                </option>
            </select>
        </div>
        <div class="form-group row">
             <label class="label">ポジションをお選び下さい。</label>
            <select v-model="positionId" class="form-control">
                <option
                    v-for="(value, key) in positions"
                    :key="key"
                    :value="key"
                >
                    {{ value }}
                </option>
            </select>
        </div>
        <div>
            <p>{{ shopId }}</p>
            <p>{{ positionId }}</p>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
    data() {
        return {
            shopId: null,
            positionId: null,
        };
    },
    computed: {
        ...mapGetters({
            shops: "options/Shops",
            positions: "options/Positions",
        }),
    },
};
</script>
