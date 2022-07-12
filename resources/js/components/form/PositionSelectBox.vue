<template>
    <fieldset>
        <label class="label">ポジション選択</label>
        <select @change="updateValue" class="form-control">
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
    computed: {
        ...mapGetters({
            positions: "options/Positions",
        }),
    },
    methods: {
        updateValue: function (e) {
            this.$emit("input", e.target.value);
        },
    },
    mounted() {
    this.$emit("input", this.positions[0].value);
  }
};
</script>
