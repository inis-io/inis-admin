<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="aliyun" color="rgb(var(--assist-color))" size="60px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● OSS可以替代传统的本地存储，有能力的情况推荐开启OSS存储<br>
                        ● 开启后，后续上传的文件将会自动上传到OSS，不会占用服务器的空间和带宽
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">OSS</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开始" inactive-text="关闭">
                </el-switch>
            </h2>
            <span class="badge bg-warning font-white"> 推荐 </span>
            <span class="text-muted ms-1">
                这个还不错，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">配置 阿里云OSS 存储</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="阿里云 AccessKey ID" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">AccessKey ID：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.access_key_id" show-password></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="阿里云AccessKey Secret" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">AccessKey Secret：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.access_key_secret" show-password></el-input>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="OSS 外网 Endpoint" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">Endpoint：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.struct.endpoint" placeholder="请选择所在地区" class="d-block custom font-13">
                            <el-option v-for="item in state.select.endpoint" :key="item.value" :label="item.label" :value="item.value">
                                <span class="font-13">{{ item.label }}</span>
                                <small class="text-muted float-end">{{ item.value }}</small>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="存储桶名称" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">OSS Bucket：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.bucket"></el-input>
                    </div>
                </div>
                <div class="col-md-4">
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
                <div class="col-md-12">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="用于访问 - 不填写则使用默认域名" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">OSS 外网域名：</span>
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
        path:              'inis',
        default:           null,
        domain:            null,
        bucket:            null,
        endpoint:          null,
        access_key_id:     null,
        access_key_secret: null,
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
        endpoint: [
            { value: 'oss-cn-hangzhou.aliyuncs.com', label: '华东1（杭州）' },
            { value: 'oss-cn-shanghai.aliyuncs.com', label: '华东2（上海）' },
            { value: 'oss-cn-nanjing.aliyuncs.com', label: '华东5（南京-本地地域）' },
            { value: 'oss-cn-fuzhou.aliyuncs.com', label: '华东6（福州-本地地域）' },
            { value: 'oss-cn-qingdao.aliyuncs.com', label: '华北1（青岛）' },
            { value: 'oss-cn-beijing.aliyuncs.com', label: '华北2（北京）' },
            { value: 'oss-cn-zhangjiakou.aliyuncs.com', label: '华北 3（张家口）' },
            { value: 'oss-cn-huhehaote.aliyuncs.com', label: '华北5（呼和浩特）' },
            { value: 'oss-cn-wulanchabu.aliyuncs.com', label: '华北6（乌兰察布）' },
            { value: 'oss-cn-shenzhen.aliyuncs.com', label: '华南1（深圳）' },
            { value: 'oss-cn-heyuan.aliyuncs.com', label: '华南2（河源）' },
            { value: 'oss-cn-guangzhou.aliyuncs.com', label: '华南3（广州）' },
            { value: 'oss-cn-chengdu.aliyuncs.com', label: '西南1（成都）' },
            { value: 'oss-cn-hongkong.aliyuncs.com', label: '中国香港' },
            { value: 'oss-us-west-1.aliyuncs.com', label: '美国（硅谷）①' },
            { value: 'oss-us-east-1.aliyuncs.com', label: '美国（弗吉尼亚）①' },
            { value: 'oss-ap-northeast-1.aliyuncs.com', label: '日本（东京）①' },
            { value: 'oss-ap-northeast-2.aliyuncs.com', label: '韩国（首尔）' },
            { value: 'oss-ap-southeast-1.aliyuncs.com', label: '新加坡①' },
            { value: 'oss-ap-southeast-2.aliyuncs.com', label: '澳大利亚（悉尼）①' },
            { value: 'oss-ap-southeast-3.aliyuncs.com', label: '马来西亚（吉隆坡）①' },
            { value: 'oss-ap-southeast-5.aliyuncs.com', label: '印度尼西亚（雅加达）①' },
            { value: 'oss-ap-southeast-6.aliyuncs.com', label: '菲律宾（马尼拉）' },
            { value: 'oss-ap-southeast-7.aliyuncs.com', label: '泰国（曼谷）' },
            { value: 'oss-ap-south-1.aliyuncs.com', label: '印度（孟买）①' },
            { value: 'oss-eu-central-1.aliyuncs.com', label: '德国（法兰克福）①' },
            { value: 'oss-eu-west-1.aliyuncs.com', label: '英国（伦敦）' },
            { value: 'oss-me-east-1.aliyuncs.com', label: '阿联酋（迪拜）①' },
            { value: 'oss-rg-china-mainland.aliyuncs.com', label: '无地域属性（中国内地）' },
            { value: 'oss-cn-hzfinance.aliyuncs.com', label: '杭州金融云公网' },
            { value: 'oss-cn-shanghai-finance-1-pub.aliyuncs.com', label: '上海金融云公网' },
            { value: 'oss-cn-szfinance.aliyuncs.com', label: '深圳金融云公网' },
            { value: 'oss-cn-beijing-finance-1-pub.aliyuncs.com', label: '北京金融云公网' },
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
            name: 'oss'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        // 拷贝一份备份
        state.backup = JSON.parse(JSON.stringify(data))

        state.status.finish  = true
    },
    show() {
        if (!state.status.finish) return notyf.warn('存储配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    change: async value => {

        if (!value) return state.status.active = true

        const { code, msg } = await axios.put('/api/toml/storage-default', {
            value: value ? 'oss' : null
        })

        if (code === 200) return emit('refresh')

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        let field = ['access_key_id', 'access_key_secret', 'endpoint', 'bucket']

        // 检查关键配置是否有变化
        if (!utils.object.equal(state.struct, state.backup, field)) return notyf.warn('请先OSS连接测试')

        if (utils.is.empty(state.struct.access_key_id))     return notyf.warn('请填写 AccessKey ID！')
        if (utils.is.empty(state.struct.access_key_secret)) return notyf.warn('请填写 AccessKey Secret！')
        if (utils.is.empty(state.struct.endpoint))          return notyf.warn('请填写 Endpoint！')
        if (utils.is.empty(state.struct.bucket))            return notyf.warn('请填写 Bucket！')

        state.status.wait   = true

        const { code, msg } = await axios.put('/api/toml/storage-oss', state.struct)

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    },
    test: async () => {

        if (utils.is.empty(state.struct.access_key_id))     return notyf.warn('请填写 AccessKey ID！')
        if (utils.is.empty(state.struct.access_key_secret)) return notyf.warn('请填写 AccessKey Secret！')
        if (utils.is.empty(state.struct.endpoint))          return notyf.warn('请填写 Endpoint！')
        if (utils.is.empty(state.struct.bucket))            return notyf.warn('请填写 Bucket！')

        state.status.test         = true

        const { code, msg, data } = await axios.post('/api/toml/test-oss', state.struct)

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
    state.status.active = state.struct.default === 'oss'
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>