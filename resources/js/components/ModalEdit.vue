<template>
    <div class="modaler" @click.self="closeModal">
        <div class="modaler-content">
            <h3>タスク修正</h3>
            <div v-if="!updateFlag">
                <p>taskID:{{ task.id }}</p>
                <textarea
                    class="text-area form-control"
                    v-model="taskData.content"
                ></textarea>
                <button class="btn btn-dark" @click="editTask">修正送信</button>
            </div>
            <div v-else>
                <p>更新を完了しました</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["task"],
    data() {
        return {
            taskData: {
                id: this.task.id,
                content: this.task.content,
            },
            updateFlag: false,
        };
    },
    methods: {
        closeModal() {
            this.$emit("emitClose");
        },
        async editTask() {
            const response = await axios.put("/api/task", this.taskData);

            if (response.status === 200) {
                this.updateFlag = true;
                this.$emit('update')
            }
        },
    },
};
</script>

<style scoped lang="scss">
.modaler {
    width: 100%;
    height: 100vh;
    background-color: rgba(24, 24, 24, 0.7);
    z-index: 1000;
    position: absolute;
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
        .text-area {
            height: calc(1.3em * 3);
            line-height: 1.3;
            width: 100%;
        }
    }
}
</style>
