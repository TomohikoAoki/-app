<template>
    <div
        class="modal-confirm"
        :class="{ active: modalFlag }"
    >
        <div class="modal-main"><span>OK</span></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            modalFlag: false,
        };
    },
    props: ["okFlag"],
    methods: {
        flagCheck() {
            if (this.modalFlag) {
                setTimeout(() => {
                    this.modalFlag = false;
                    this.$emit("input", this.modalFlag);
                }, 2000);
            }
        },
    },
    watch: {
        okFlag: function () {
            if (this.okFlag) {
                this.modalFlag = true;
                this.flagCheck();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.modal-confirm {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    &.active {
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadein-keyframes 1s ease 1s 1 forwards;
    }
    .modal-main {
        width: 200px;
        height: 100px;
        background-color: aquamarine;
        text-align: center;
        font-weight: bold;
        font-size: 2.0em;
        color: #0f4849;
        border-radius: 10px;
        display: table;
        span {
            display: table-cell;
            vertical-align: middle;
        }
    }
}
@keyframes fadein-keyframes {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>
