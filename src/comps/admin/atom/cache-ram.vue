<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="ram" color="rgb(var(--assist-color))" size="55px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        <strong class="text-success">推荐开启，有利于减少数据库和服务器的负担！</strong><br>
                        开启后会对API数据进行缓存，减少重复执行数据库操作以及对数据的运算，<br>
                        从而提高API的响应速度，减少服务器的负担。<br>
                        PS：缓存数据会通过内存的方式存储在服务器的内存中。
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">内存缓存</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-tooltip content="请不要作死，内存很宝贵，不要用在这种地方，除非你是本地环境或者不怕死" placement="top">
                    <el-switch v-model="state.status.active" v-on:change="method.change" disabled
                               active-text="开启" inactive-text="关闭">
                    </el-switch>
                </el-tooltip>
            </h2>
            <span class="badge bg-success font-white"> +20% </span>
            <span class="text-muted">
                综合提升，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">配置 内存 缓存服务</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="缓存有效时间，建议2小时，即7200秒，0表示永不过期" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">过期时间（秒）：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.expire"></el-input>
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
import utils from '{src}/utils/utils.js'
import notyf from '{src}/utils/notyf.js'
import axios from '{src}/utils/request.js'

const { ctx, proxy } = getCurrentInstance()
const emit  = defineEmits(['refresh'])
const state = reactive({
    struct: {
        open:     false,
        default:  null,
        expire:   '2 * 60 * 60',
    },
    status: {
        finish: false,
        active: false,
        dialog: false,
        loading: true,
        wait: false,
    },
})

onMounted(async () => {
    await method.init()
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/toml/cache', {
            name: 'ram'
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

        const { code, msg } = await axios.put('/api/toml/cache-default', {
            value: 'ram', open: value
        })

        if (code === 200) return emit('refresh', 'cache-redis', 'cache-file')

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        if (utils.is.empty(state.struct.expire)) return notyf.warn('请填写 过期时间！')

        state.status.wait   = true

        const { code, msg } = await axios.put('/api/toml/cache-ram', state.struct)

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    },
}

watch(() => state.struct, () => {
    state.status.active = state.struct.default === 'ram' && state.struct.open
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>