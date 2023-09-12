<template>
    <i-row-text title="手机号" class="phone">
        <template #value>
            <div v-if="state.item.edit" class="row w-100">
                <div class="col-md-7">
                    <el-input v-model="state.struct.phone" v-on:keydown.enter="method.save()" placeholder="手机号">
                        <template #suffix>
                            <el-button v-on:click="method.save()" :loading="state.item.wait" type="primary" size="small" plain round>
                                保存
                            </el-button>
                            <el-button v-on:click="state.item.edit = false" type="primary" size="small" plain round>
                                取消
                            </el-button>
                        </template>
                    </el-input>
                </div>
                <div class="col-md-5">
                    <el-input v-model="state.struct.code" class="custom" placeholder="请输入验证码">
                        <template #suffix>
                            <el-button v-on:click="method.code()" :loading="state.item.loading" type="primary" size="small" plain round>
                                获取 <span v-if="state.item.loading">{{ state.item.second }} s</span>
                            </el-button>
                        </template>
                    </el-input>
                </div>
            </div>
            <span v-else class="font-14">{{ utils.string.omit(state.struct.phone, 7, '***', 'center') }}</span>
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
            emit('edit', 'phone')
        }
    },
    save: async () => {

        if (utils.is.empty(state.struct?.phone))  return notyf.warn('请输入手机号！')
        if (utils.is.empty(state.struct?.code))   return notyf.warn('请输入验证码！')

        state.item.wait     = true

        const { code, msg } = await axios.put('/api/users/phone', {
            phone: state.struct?.phone, code: state.struct?.code
        })

        state.item.wait     = false

        if (code !== 200) return notyf.error(msg)

        state.item.edit     = false

        state.item.second   = 0
        state.struct.code   = null
        clearInterval(state.timer)

        // 重新获取用户信息
        await method.checkToken()
    },
    code: async () => {

        if (utils.is.empty(state.struct?.phone))  return notyf.warn('请输入手机号！')

        const { code, msg } = await axios.put('/api/users/phone', {
            phone: state.struct?.phone,
        })

        if (!utils.in.array(code, [200,201])) return notyf.error(msg)

        state.item.second = 60
        state.timer = setInterval(() => {
            state.item.second--
            if (state.item.second <= 0) clearInterval(state.timer)
        }, 1000)
    },
    // 校验登录
    async checkToken() {

        const { data, code } = await axios.post('/api/comm/check-token')

        if (code !== 200) return

        emit('finish', data.user)

        cache.set('user-info', data.user, 10)
    },
}

watch(() => state.item.second, (val) => {
    state.item.loading = val > 0
})
watch(() => props.modelValue, (val) => {
    state.item.edit = val === 'phone'
})
</script>

<style scoped>
.row.phone .el-button.edit {
    opacity: 0;
    transition: opacity .5s;
}
.row.phone:hover .el-button.edit, .row.phone .is-focus .el-button.edit {
    opacity: 1;
    transition: opacity .5s;
}
</style>