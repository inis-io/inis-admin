<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="env" size="50px" color="rgb(var(--assist-color))" class="position-absolute opacity-25" style="right: 1.7rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        <strong class="text-success">限制分页查询单次最大数据量，开启让系统毫无瑕疵！</strong><br>
                        分页限制可以限制坏人发起恶意请求，如恶意请求 999999 乃至无限大的数据，<br>
                        导致服务器崩溃，分页限制可以限制每页最大请求数据量，超过则强制性=最大值<br>
                        注意：如果开启了缓存，此项可不开，因为缓存数据不会导致重复查询
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">分页限制</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="我怂" inactive-text="无所畏惧">
                </el-switch>
            </h2>
            <span class="badge bg-primary font-white"> +5% </span>
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
                <div class="col-md-12">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="限制分页查询单次最大数据量，推荐：30" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">最大值：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input-number v-model="state.struct.text" :min="5" class="w-100 d-flex"></el-input-number>
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
        text: 10
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
            key: 'SYSTEM_PAGE_LIMIT'
        })
        if (code !== 200) return
        state.struct = data

        state.status.finish  = true
        state.status.loading = false
    },
    show() {
        if (!state.status.finish) return notyf.warn('分页限制配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    change: async value => {

        const { code, msg } = await axios.post('/api/config/save', {
            key: 'SYSTEM_PAGE_LIMIT',
            value: value ? 1 : 0
        })

        if (code === 200) return

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        state.status.wait   = true

        const { code, msg } = await axios.post('/api/config/save', {
            key: 'SYSTEM_PAGE_LIMIT',
            text: state.struct.text
        })

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    }
}

watch(() => state.struct, () => {
    state.status.active = parseInt(state.struct.value) === 1
    // 限制 state.struct.text 最小值为 5
    if (state.struct.text < 5)  state.struct.text = 5
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>