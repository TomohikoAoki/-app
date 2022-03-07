<template >
    <fieldset>
        <select :name="name" @change="updateValue" class="form-control">
            <template v-for="(option, index) in options">
                <option :value="option.value" :key="index">
                    {{ option.label }}
                </option>
            </template>
        </select>
    </fieldset>
</template>

<script>
export default {
    props: {
        value: { type: String, },
        options: { type: Array, required: true },
        name: { type: String, required: true },
    },
    methods: {
        updateValue: function(e) {
            this.$emit('input', e.target.value);
        }
    },

};
</script>
