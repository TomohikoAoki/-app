<template>
    <fieldset>
        <label class="label">店舗選択</label>
        <select v-model="shopValue" class="form-control" :disabled="disabledFlag">
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
    data() {
        return {
            shopValue: null
        }
    },
    props: {
        disabledFlag:{
            type: null,
            default: false,
            required: false,
        },
        shopId: {
            type: null,
            default: false,
            required: false,
        }
    },
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
        if(this.shopId){
            this.shopValue = this.shopId
            this.$emit("input", this.shopValue);
            return false
        }
        this.shopValue = this.shops[0].value
        this.$emit("input", this.shops[0].value);
    },
    watch : {
        shopValue: function() {
            this.$emit("input", this.shopValue)
        }
    }
}
</script>

<style lang="scss" scoped>
.form-control:disabled {
    color: rgb(197, 197, 197);
}
</style>
