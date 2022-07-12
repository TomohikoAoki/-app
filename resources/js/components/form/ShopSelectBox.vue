<template>
    <fieldset>
        <label class="label">店舗選択</label>
        <select @change="updateValue" class="form-control">
            <option
                v-for="(shop, index) in shops"
                :value="shop.value"
                :key="index"
            >
                {{ shop.label }}
            </option>
        </select>
    </fieldset>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters({
            shops: "options/Shops",
        }),
    },
    methods: {
        updateValue: function (e) {
            this.$emit("input", e.target.value);
        },
    },
    mounted() {
    this.$emit("input", this.shops[0].value);
    }
}
</script>
