<template>
    <fieldset>
        <label class="label">ポジション選択</label>
        <select v-model="selectedValue" class="form-control">
            <option
                v-for="(position, index) in positions"
                :value="position.value"
                :key="index"
            >
                {{ position.label }}
            </option>
        </select>
    </fieldset>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            selectedValue: null,
        };
    },
    props: ["selected"],
    computed: {
        ...mapGetters({
            positions: "options/Positions",
        }),
    },
    mounted() {
        if(this.selected){
            this.selectedValue = this.selected
            this.$emit("input", this.selectedValue);
            return false
        }
        this.selectedValue = this.positions[0].value
        this.$emit("input", this.positions[0].value);
    },
    watch : {
        selectedValue: function() {
            this.$emit("input", this.selectedValue)
        }
    }
};
</script>
