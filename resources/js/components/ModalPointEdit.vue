<template>
    <div class="modaler" @click.self="closeModal">
        <div class="modaler-content">
            <h3>採点</h3>
            <div>
                <p class="context">{{ task.content }}</p>
                <ValidationObserver ref="obs" v-slot="ObserverProps">
                    <ValidationProvider rules="required|oneOf:1,2,3,4,5" name="タスク内容">
                        <div slot-scope="ProviderProps">
                            <input
                                type="radio"
                                name="point"
                                v-model="pointData.point"
                                value="1"
                            /><label>知ってる</label>
                            <input
                                type="radio"
                                name="point"
                                v-model="pointData.point"
                                value="2"
                            /><label>理解している </label>
                            <input
                                type="radio"
                                name="point"
                                v-model="pointData.point"
                                value="3"
                            /><label>出来る</label>
                            <input
                                type="radio"
                                name="point"
                                v-model="pointData.point"
                                value="4"
                            /><label>継続してやってる</label>
                            <input
                                type="radio"
                                name="point"
                                v-model="pointData.point"
                                value="5"
                            /><label>教えられる</label>
                            <p class="text-danger small">
                                {{ ProviderProps.errors[0] }}
                            </p>
                        </div>
                    </ValidationProvider>
                    <button
                        class="btn btn-dark"
                        @click="emitPoint"
                        :disabled="
                            ObserverProps.invalid || !ObserverProps.validated
                        "
                    >
                        確定
                    </button>
                </ValidationObserver>
            </div>
        </div>
    </div>
</template>

<script>
import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from "body-scroll-lock";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
    props: ["task","user"],
    data() {
        return {
            pointData: {
                task_id: this.task.id,
                point: this.task.point,
                user_id: this.user.id,
                id: this.task.point_id,
            },
        };
    },
    components: {
        ValidationObserver,
        ValidationProvider,
    },
    methods: {
        closeModal() {
            this.$emit("emitClose");
        },
        emitPoint() {
            let obj = {}
            for(let key in this.pointData) {
                obj[key] = this.pointData[key]
            }
            this.$emit('emitPoint', obj)
            this.closeModal();
        },
    },
    mounted() {
        const modal = document.querySelector(".modaler");
        disableBodyScroll(modal);
    },
    beforeDestroy() {
        clearAllBodyScrollLocks();
    },
};
</script>

<style scoped lang="scss">
.modaler {
    width: 100%;
    height: 100vh;
    background-color: rgba(24, 24, 24, 0.7);
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    &-content {
        background-color: darkgrey;
        width: 90%;
        max-width: 700px;
        margin: 0 auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        -webkit-transform: translateY(-50%) translateX(-50%);
        color: #333;
        padding: 30px 10px;
        box-sizing: border-box;
        text-align: center;
        .btn {
            margin: 3em 0 0 0;
        }
        .context {
            font-weight: bold;
        }
    }
}
</style>
