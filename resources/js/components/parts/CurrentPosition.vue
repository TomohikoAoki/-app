<template>
    <div class="select-position">
        <p>ポジション選択</p>
        <ul>
            <li
                v-for="(position, index) in positions"
                :value="position.value"
                :key="index"
                @click="updateValue"
                :class="{ 'active': selected == position.value, 'hidden': index == positionsLast }"
            >
                {{ position.label }}
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    props: [
        'selected'
    ],
    computed: {
        ...mapGetters({
            positions: "options/Positions",
        }),
        positionsLast() {
            return this.positions.length - 1
        }
    },
    methods: {
        updateValue: function (e) {
            this.$emit("input", e.target.value);
        },
    },
    mounted() {
        this.$emit("input", this.positions[0].value);
    },
};
</script>

<style lang="scss" scoped>
.select-position {
    display: flex;
    width: 350px;
    margin: 0 auto;
    vertical-align: middle;
    justify-content: center;
    flex-wrap: wrap;
    p {
        font-weight: bold;
        padding: 0.5em 1em 0.5em 0;
        margin: 0;
    }
    ul {
        display: flex;
        margin: 0;
        padding: 0;
        border: 1px solid;
        border-radius: 5px;
        list-style: none;
        width: 250px;
        li {
            flex: 1;
            text-align: center;
            padding: 0.5em 0;
            &.active {
                background-color: rgb(236, 236, 236);
                color: #313644;
            }
            &.hidden {
                display: none;
            }
        }
    }
}
</style>
