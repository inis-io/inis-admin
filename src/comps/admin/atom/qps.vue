<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="qps" size="60px" color="rgb(var(--assist-color))" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        <strong class="text-success">开启后让DDOS和CC等异常流量无懈可击！</strong><br>
                        ● QPS俗称限流器，是一种作用于网络层的中间件，主要用于拦截异常流量，如DDOS和CC等<br>
                        ● QPS会将每个IP的请求次数限制在每秒的指定次数，超过则拒绝访问，从而保护服务器安全
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">QPS</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="我怂" inactive-text="无所畏惧">
                </el-switch>
            </h2>
            <span class="badge bg-primary font-white"> +90% </span>
            <span class="text-muted ms-1">
                安全性提升，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">配置</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="根据 IP 全局每秒限制的访问频率，推荐：50" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">全局限制：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input-number v-model="state.struct.json.global" :min="10" class="w-100 d-flex"></el-input-number>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="根据 IP + API 每秒限制的访问频率，推荐：15" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">单接口限制：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input-number v-model="state.struct.json.point" :min="5" class="w-100 d-flex"></el-input-number>
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
const state = reactive({
    struct: {
        value: 0,
        json: { global: 30, point: 15 },
    },
    status: {
        finish: false,
        active: false,
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

        const { code, data } = await axios.get('/api/config/one', {
            key: 'SYSTEM_QPS'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        state.status.finish  = true
    },
    show() {
        if (!state.status.finish) return notyf.warn('QPS配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    change: async value => {

        const { code, msg } = await axios.post('/api/config/save', {
            key: 'SYSTEM_QPS',
            value: value ? 1 : 0
        })

        if (code === 200) return

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        state.status.wait   = true

        const { code, msg } = await axios.post('/api/config/save', {
            key: 'SYSTEM_QPS',
            json: JSON.stringify(state.struct.json)
        })

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    }
}

watch(() => state.struct, () => {
    state.status.active = parseInt(state.struct.value) === 1
    // 限制 state.struct.json.global 最小值为 10
    if (state.struct.json.global < 10) state.struct.json.global = 10
    // 限制 state.struct.json.point 最小值为 5
    if (state.struct.json.point < 5)  state.struct.json.point = 5
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>