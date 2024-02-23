<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="tencent" color="rgb(var(--assist-color))" size="60px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● COS可以替代传统的本地存储，有能力的情况推荐开启COS存储<br>
                        ● 开启后，后续上传的文件将会自动上传到COS，不会占用服务器的空间和带宽
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">COS</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开始" inactive-text="关闭">
                </el-switch>
            </h2>
            <span class="badge bg-primary font-white"> 推荐 </span>
            <span class="text-muted ms-1">
                这个也不错，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">配置 腾讯云COS 存储</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="腾讯云COS SecretId" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">SecretId：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.secret_id" show-password></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="腾讯云COS SecretKey" placement="top">
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
                            <el-tooltip content="腾讯云COS AppId" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">AppId：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.app_id"></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="存储桶名称" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">COS Bucket：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.bucket"></el-input>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="所在地区，如这里的 ap-guangzhou（广州）" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">COS Region：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.struct.region" placeholder="请选择所在地区" class="d-block custom font-13">
                            <el-option v-for="item in state.select.region" :key="item.value" :label="item.label" :value="item.value">
                                <span class="font-13">{{ item.label }}</span>
                                <small class="text-muted float-end">{{ item.value }} | {{ item.area }}</small>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="存储在哪个目录下" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">存储目录：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.path" placeholder="如: inis"></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="用于访问 - 不填写则使用默认域名" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">COS 外网域名：</span>
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
        path:       'inis',
        default:    null,
        domain:     null,
        app_id:     null,
        bucket:     null,
        region:     null,
        secret_id:  null,
        secret_key: null,
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
            { value: 'ap-beijing-1', label: '北京一区', area: '中国大陆' },
            { value: 'ap-beijing', label: '北京', area: '中国大陆' },
            { value: 'ap-nanjing', label: '南京', area: '中国大陆' },
            { value: 'ap-shanghai', label: '上海', area: '中国大陆' },
            { value: 'ap-guangzhou', label: '广州', area: '中国大陆' },
            { value: 'ap-chengdu', label: '成都', area: '中国大陆' },
            { value: 'ap-chongqing', label: '重庆', area: '中国大陆' },
            { value: 'ap-shenzhen-fsi', label: '深圳金融', area: '中国大陆' },
            { value: 'ap-shanghai-fsi', label: '上海金融', area: '中国大陆' },
            { value: 'ap-beijing-fsi', label: '北京金融', area: '中国大陆' },
            { value: 'ap-hongkong', label: '中国香港', area: '亚太' },
            { value: 'ap-singapore', label: '新加坡', area: '亚太' },
            { value: 'ap-mumbai', label: '孟买', area: '亚太' },
            { value: 'ap-jakarta', label: '雅加达', area: '亚太' },
            { value: 'ap-seoul', label: '首尔', area: '亚太' },
            { value: 'ap-bangkok', label: '曼谷', area: '亚太' },
            { value: 'ap-tokyo', label: '东京', area: '亚太' },
            { value: 'na-siliconvalley', label: '硅谷（美西）', area: '北美' },
            { value: 'na-ashburn', label: '弗吉尼亚（美东）', area: '北美' },
            { value: 'na-toronto', label: '多伦多', area: '北美' },
            { value: 'sa-saopaulo', label: '圣保罗', area: '南美' },
            { value: 'eu-frankfurt', label: '法兰克福', area: '欧洲' },
        ]
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
            name: 'cos'
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
            value: value ? 'cos' : null
        })

        if (code === 200) return emit('refresh')

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        let field = ['secret_id', 'secret_key', 'app_id', 'region', 'bucket']

        // 检查关键配置是否有变化
        if (!utils.object.equal(state.struct, state.backup, field)) return notyf.warn('请先OSS连接测试')

        if (utils.is.empty(state.struct.secret_id))  return notyf.warn('请填写 SecretId！')
        if (utils.is.empty(state.struct.secret_key)) return notyf.warn('请填写 SecretKey！')
        if (utils.is.empty(state.struct.app_id))     return notyf.warn('请填写 AppId！')
        if (utils.is.empty(state.struct.region))     return notyf.warn('请填写 Bucket！')
        if (utils.is.empty(state.struct.bucket))     return notyf.warn('请填写 Region！')

        state.status.wait   = true

        const { code, msg } = await axios.put('/api/toml/storage-cos', state.struct)

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    },
    test: async () => {

        if (utils.is.empty(state.struct.secret_id))  return notyf.warn('请填写 SecretId！')
        if (utils.is.empty(state.struct.secret_key)) return notyf.warn('请填写 SecretKey！')
        if (utils.is.empty(state.struct.app_id))     return notyf.warn('请填写 AppId！')
        if (utils.is.empty(state.struct.region))     return notyf.warn('请填写 Bucket！')
        if (utils.is.empty(state.struct.bucket))     return notyf.warn('请填写 Region！')

        state.status.test         = true

        const { code, msg, data } = await axios.post('/api/toml/test-cos', state.struct)

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
    state.status.active = state.struct.default === 'cos'
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>