<template>
    <div v-load="[state.status.loading, null, null]" class="card">
        <div class="card-body">
            <i-svg name="register" color="rgb(var(--assist-color))" size="50px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● 是否允许用户自行注册账号（开放注册功能？）<br>
                        ● 如果不允许，那么只能通过管理员手动创建账号
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">自行注册</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="允许" inactive-text="不允许" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </h2>
            <span class="badge bg-primary font-white"> +0.1% </span>
            <span class="text-muted ms-1">
                安全性提升
            </span>
        </div>
    </div>
</template>

<script setup>
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    struct: {},
    status: {
        finish: false,
        active: false,
        loading: true,
    }
})

onMounted(async () => {
    await method.init()
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/config/one', {
            key: 'ALLOW_REGISTER'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        state.status.finish  = true
    },
    change: async value => {

        const { code, msg } = await axios.post('/api/config/save', {
            key: 'ALLOW_REGISTER',
            value: value ? 1 : 0
        })

        if (code === 200) return

        state.status.active = !value
        notyf.error(msg)
    },
}

watch(() => state.struct, () => {
    state.status.active = parseInt(state.struct.value) === 1
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>