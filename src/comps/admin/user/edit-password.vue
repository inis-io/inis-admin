<template>
    <i-row-text title="密码" class="password">
        <template #value>
            <div v-if="state.item.edit" class="row w-100">
                <div class="col-md-5">
                    <el-input v-model="state.struct.password1" show-password placeholder="新密码"></el-input>
                </div>
                <div class="col-md-5">
                    <el-input v-model="state.struct.password2" show-password v-on:keydown.enter="method.save()" placeholder="再次确认密码"></el-input>
                </div>
                <div class="col-md-2 mt-lg-0 mt-3">
                    <el-button v-on:click="method.save()" :loading="state.item.wait" type="primary" size="small" plain round>
                        保存
                    </el-button>
                    <el-button v-on:click="state.item.edit = false" type="primary" size="small" plain round>
                        取消
                    </el-button>
                </div>
            </div>
            <span v-else class="font-14">************</span>
            <el-button v-if="!state.item.edit" v-on:click="method.edit.click()" plain round class="ms-4 edit" type="primary" size="small">
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
        loading: false,
        second: 0,
    },
    struct: cache.get('user-info'),
    timer: null,
})

const method = {
    edit: {
        finish() {
            state.struct = cache.get('user-info')
        },
        click: () => {
            state.item.edit = true
            emit('edit', 'password')
        }
    },
    save: async () => {

        if (utils.is.empty((state.struct.id)))      return notyf.warn('请先登录！')
        if (utils.is.empty(state.struct.password1)) return notyf.warn('请输入新密码！')
        if (utils.is.empty(state.struct.password2)) return notyf.warn('请输入再次输入新密码！')
        if (state.struct.password1 !== state.struct.password2) return notyf.warn('两次输入的密码不一致！')

        state.item.wait     = true

        const { code, msg } = await axios.put('/api/users/update', {
            id: state.struct.id, password: state.struct.password1
        })

        state.item.wait     = false

        if (code !== 200) return notyf.error(msg)

        state.item.edit     = false

        emit('finish')

        notyf.success('密码重置成功，请重新登录！')

        // 清除登录信息
        cache.del('user-info')
        utils.clear.cookie(globalThis?.inis?.token_name || 'INIS_LOGIN_TOKEN')

        // 回到首页
        setTimeout(() => (globalThis.location.href = '/'), 800)
    },
}

watch(() => props.modelValue, (val) => {
    state.item.edit = val === 'password'
})
</script>

<style scoped>
.row.password .el-button.edit {
    opacity: 0;
    transition: opacity .5s;
}
.row.password:hover .el-button.edit, .row.password .is-focus .el-button.edit {
    opacity: 1;
    transition: opacity .5s;
}
</style>