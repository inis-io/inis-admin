<template>
    <i-row-text title="账号" class="account">
        <template #value>
            <el-input v-if="state.item.edit" v-model="state.struct.account" v-on:keydown.enter="method.save()">
                <template #suffix>
                    <el-button v-on:click="method.save()" :loading="state.item.wait" type="primary" size="small" plain round>
                        保存
                    </el-button>
                    <el-button v-on:click="state.item.edit = false" type="primary" size="small" plain round>
                        取消
                    </el-button>
                </template>
            </el-input>
            <span v-else class="font-14">{{ state.struct.account }}</span>
            <el-button v-if="!state.item.edit" v-on:click="method.edit.click" plain round class="ms-4 edit" type="primary" size="small">
                编辑
            </el-button>
        </template>
    </i-row-text>
</template>

<script setup>
import cache from '{src}/utils/cache.js'
import notyf from '{src}/utils/notyf.js'
import utils from '{src}/utils/utils.js'
import axios from '{src}/utils/request.js'
import iRowText from '{src}/comps/custom/i-row-text.vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
})
const emit  = defineEmits(['finish','edit'])
const state = reactive({
    item: {
        edit: false,
        wait: false,
    },
    struct: cache.get('user-info'),
})

const method = {
    edit: {
        finish() {
            state.struct = cache.get('user-info')
        },
        click: () => {
            state.item.edit = true
            emit('edit', 'account')
        }
    },
    save: async () => {

        if (utils.is.empty(state.struct.id))      return notyf.warn('请先登录！')
        if (utils.is.empty(state.struct.account)) return notyf.warn('账号不能为空！')

        state.item.wait     = true

        const { code, msg } = await axios.put('/api/users/update', {
            id: state.struct.id,
            account: state.struct.account,
        })

        state.item.wait     = false

        if (code !== 200) return notyf.error(msg)

        state.item.edit     = false

        // 重新获取用户信息
        await method.checkToken()
    },
    // 校验登录
    async checkToken() {

        const { data, code } = await axios.post('/api/comm/check-token')

        if (code !== 200) return

        emit('finish', data.user)

        cache.set('user-info', data.user, 10)
    },
}

watch(() => props.modelValue, (val) => {
    state.item.edit = val === 'account'
})
</script>

<style scoped>
.row.account .el-button.edit {
    opacity: 0;
    transition: opacity .5s;
}
.row.account:hover .el-button.edit, .row.account .is-focus .el-button.edit {
    opacity: 1;
    transition: opacity .5s;
}
</style>