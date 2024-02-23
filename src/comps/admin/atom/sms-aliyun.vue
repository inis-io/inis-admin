<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="aliyun" color="rgb(var(--assist-color))" size="60px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● 用于发送验证码相关的服务<br>
                        ● 注册、找回密码、通知等功能都需要依赖此服务
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">阿里云短信</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开启" inactive-text="关闭">
                </el-switch>
            </h2>
            <span class="badge bg-warning font-white"> 企业 </span>
            <span class="text-muted">
                企业推荐这个，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">配置阿里云短信服务</strong>
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
                            <el-tooltip content="阿里云 AccessKey Secret" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">AccessKey Secret：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.access_key_secret" show-password></el-input>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="阿里云 短信服务 endpoint，如：dysmsapi.aliyuncs.com" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">endpoint：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.endpoint"></el-input>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="短信签名，如：萌卜兔" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">短信签名：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.sign_name"></el-input>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="验证码模板，如：SMS_XXX02" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">验证码模板：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.verify_code"></el-input>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="用于阿里云短信测试接收测试信息的手机号" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">接收者手机号：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.phone" v-on:keydown.enter="method.test()" class="custom" placeholder="请输入手机号">
                            <template #suffix>
                                <el-button v-on:click="method.test()" :loading="state.status.test">
                                    <i-svg v-if="!state.status.test" name="phone" size="14px"></i-svg>
                                    <span class="ms-1">阿里云短信测试</span>
                                </el-button>
                            </template>
                        </el-input>
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
        access_key_id:      null,
        access_key_secret:  null,
        endpoint:       null,
        sign_name:      null,
        verify_code:    null,
        phone:          null,
        drive:     {
            sms: null,
            default: null,
        },
    },
    status: {
        finish: false,
        active: false,
        dialog: false,
        loading: true,
        test: false,
        wait: false,
    },
    backup: {}
})

onMounted(async () => {
    await method.init()
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/toml/sms', {
            name: 'aliyun'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        // 拷贝一份备份
        state.backup = JSON.parse(JSON.stringify(data))

        state.status.finish  = true
    },
    show() {
        if (!state.status.finish) return notyf.warn('SMS服务配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    change: async value => {

        const { code, msg } = await axios.put('/api/toml/sms-drive', {
            sms: value ? 'aliyun' : ''
        })

        if (code === 200) return emit('refresh', 'sms-tencent')

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        let field = ['access_key_id', 'access_key_secret', 'endpoint', 'sign_name', 'verify_code']

        // 检查关键配置是否有变化
        if (!utils.object.equal(state.struct, state.backup, field)) return notyf.warn('请先完成阿里云短信测试')

        if (utils.is.empty(state.struct.access_key_id))      return notyf.warn('请填写阿里云AccessKey ID！')
        if (utils.is.empty(state.struct.access_key_secret))  return notyf.warn('请填写阿里云AccessKey Secret！')
        if (utils.is.empty(state.struct.endpoint))           return notyf.warn('请填写阿里云短信服务endpoint！')
        if (utils.is.empty(state.struct.sign_name))          return notyf.warn('请填写短信签名！')
        if (utils.is.empty(state.struct.verify_code))        return notyf.warn('请填写验证码模板！')

        state.status.wait   = true

        const { code, msg } = await axios.put('/api/toml/sms-aliyun', state.struct)

         state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    },
    test: async () => {

        if (utils.is.empty(state.struct.phone))              return notyf.warn('请填写接收者手机号！')
        if (utils.is.empty(state.struct.access_key_id))      return notyf.warn('请填写阿里云AccessKey ID！')
        if (utils.is.empty(state.struct.access_key_secret))  return notyf.warn('请填写阿里云AccessKey Secret！')
        if (utils.is.empty(state.struct.endpoint))           return notyf.warn('请填写阿里云短信服务endpoint！')
        if (utils.is.empty(state.struct.sign_name))          return notyf.warn('请填写短信签名！')
        if (utils.is.empty(state.struct.verify_code))        return notyf.warn('请填写验证码模板！')
        if (!utils.is.phone(state.struct.phone))             return notyf.warn('接收者手机号格式不正确！')

        state.status.test         = true

        const { code, msg, data } = await axios.post('/api/toml/test-sms-aliyun', state.struct)

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
    state.status.active = state.struct.drive.sms === 'aliyun'
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>