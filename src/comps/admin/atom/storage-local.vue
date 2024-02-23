<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="serve" color="rgb(var(--assist-color))" size="60px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● 本地存储是指将图片等资源文件存储到服务器本地，然后通过访问服务器的方式获取资源文件<br>
                        ● 本地存储的优点是不花钱，缺点是占用服务器空间和带宽
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">本地存储</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开始" inactive-text="关闭">
                </el-switch>
            </h2>
            <span class="badge bg-dark font-white"> 传统 </span>
            <span class="text-muted ms-1">
                这个不花钱，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">配置本地存储</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="自定义存储域名" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">域名：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.domain"></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="存储在哪个目录下" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">存储目录：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.path" placeholder="如: storage"></el-input>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <el-button v-on:click="state.status.dialog = false">取 消</el-button>
            <el-button v-on:click="method.save()" :loading="state.status.wait">保 存</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import notyf from '{src}/utils/notyf.js'
import axios from '{src}/utils/request.js'

const { ctx, proxy } = getCurrentInstance()
const emit  = defineEmits(['refresh'])
const state = reactive({
    struct: {
        default: null,
        domain: null,
        path: 'storage',
    },
    status: {
        active: true,
        finish: false,
        dialog: false,
        loading: true,
        wait: false,
    }
})

onMounted(async () => {
    await method.init()
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/toml/storage', {
            name: 'local'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        state.status.finish  = true
    },
    show() {
        if (!state.status.finish) return notyf.warn('配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    change: async value => {

        if (!value) return state.status.active = true

        const { code, msg } = await axios.put('/api/toml/storage-default', {
            value: value ? 'local' : null
        })

        if (code === 200) return emit('refresh')

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        state.status.wait   = true

        const { code, msg } = await axios.put('/api/toml/storage-local', state.struct)

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    },
}

watch(() => state.struct, () => {
    state.status.active = state.struct.default === 'local'
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>