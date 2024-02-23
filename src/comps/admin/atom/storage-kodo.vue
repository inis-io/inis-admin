<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <el-image src="/assets/imgs/png/qiniu.png" class="position-absolute opacity-25" style="right: 1.5rem; height: 65px" />
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● KODO可以替代传统的本地存储，有能力的情况推荐开启KODO存储（但是总体体验上比OSS和COS略差）<br>
                        ● 开启后，后续上传的文件将会自动上传到KODO，不会占用服务器的空间和带宽
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">KODO</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开始" inactive-text="关闭">
                </el-switch>
            </h2>
            <span class="badge bg-info font-white"> 一般 </span>
            <span class="text-muted ms-1">
                不是很好用，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">配置 七牛云KODO 存储</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="七牛云AccessKey" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">AccessKey：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.access_key" show-password></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="七牛云SecretKey" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">SecretKey：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.secret_key" show-password></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="存储桶名称" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">Bucket：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.bucket"></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="KODO 所在地区" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">Region：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.struct.region" placeholder="请选择所在地区" class="d-block custom font-13">
                            <el-option v-for="item in state.select.region" :key="item.value" :label="item.label" :value="item.value">
                                <span class="font-13">{{ item.label }}</span>
                                <small class="text-muted float-end">{{ item.value }}</small>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="（必须）外网域名 - 用于访问" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">外网域名：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.domain"></el-input>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <el-button v-on:click="state.status.dialog = false">取 消</el-button>
            <el-button v-on:click="method.test()" :loading="state.status.test">
                <i-svg v-if="!state.status.test" name="connect" size="14px"></i-svg>
                <span class="ms-1">测试连接</span>
            </el-button>
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
        default:    null,
        domain:     null,
        access_key: null,
        secret_key: null,
        bucket:     null,
        region:     null,
    },
    status: {
        active: true,
        finish: false,
        dialog: false,
        loading: true,
        wait: false,
        test: false,
    },
    backup: {},
    select: {
        region: [
            { value: 'z0',  label: '华东' },
            { value: 'z1',  label: '华北河北' },
            { value: 'z2',  label: '华南广东' },
            { value: 'na0', label: '北美' },
            { value: 'as0', label: '新加坡' },
            { value: 'cn-east-2',      label: '华东浙江' },
            { value: 'ap-northeast-1', label: '亚太-首尔机房' },
        ],
    },
})

onMounted(async () => {
    await method.init()
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/toml/storage', {
            name: 'kodo'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        // 拷贝一份备份
        state.backup = JSON.parse(JSON.stringify(data))

        state.status.finish  = true
    },
    show() {
        if (!state.status.finish) return notyf.warn('配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    change: async value => {

        if (!value) return state.status.active = true

        const { code, msg } = await axios.put('/api/toml/storage-default', {
            value: value ? 'kodo' : null
        })

        if (code === 200) return emit('refresh')

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        let field = ['access_key', 'secret_key', 'bucket', 'region']

        // 检查关键配置是否有变化
        if (!utils.object.equal(state.struct, state.backup, field)) return notyf.warn('请先KODO连接测试')

        if (utils.is.empty(state.struct.access_key)) return notyf.warn('请填写 AccessKey！')
        if (utils.is.empty(state.struct.secret_key)) return notyf.warn('请填写 SecretKey！')
        if (utils.is.empty(state.struct.bucket))     return notyf.warn('请填写 Bucket！')
        if (utils.is.empty(state.struct.region))     return notyf.warn('请填写 Region！')
        if (utils.is.empty(state.struct.domain))     return notyf.warn('请填写 外网域名！')

        state.status.wait   = true

        const { code, msg } = await axios.put('/api/toml/storage-kodo', state.struct)

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    },
    test: async () => {

        if (utils.is.empty(state.struct.access_key)) return notyf.warn('请填写 AccessKey！')
        if (utils.is.empty(state.struct.secret_key)) return notyf.warn('请填写 SecretKey！')
        if (utils.is.empty(state.struct.bucket))     return notyf.warn('请填写 Bucket！')
        if (utils.is.empty(state.struct.region))     return notyf.warn('请填写 Region！')

        state.status.test         = true

        const { code, msg, data } = await axios.post('/api/toml/test-kodo', state.struct)

        state.status.test         = false

        if (code === 200) {
            // 拷贝一份备份
            state.backup = JSON.parse(JSON.stringify(state.struct))
            return notyf.success(msg)
        }

        notyf.error(`${msg}<br>${data}`)
    },
}

watch(() => state.struct, () => {
    state.status.active = state.struct.default === 'kodo'
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>