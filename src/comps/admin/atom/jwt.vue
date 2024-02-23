<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="crypt" size="55px" color="rgb(var(--assist-color))" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        JWT（JSON Web Token）是一种在网络应用中传递声明信息的轻量级、安全的方式。<br>
                        JWT具有通用性和可扩展性，可以应用在很多场景，比如用户认证、单点登录、API访问授权等。
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">JWT</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开始" inactive-text="关闭">
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
            <strong class="flex-center">配置 JSON Web Token</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="签发者，比如：萌卜兔" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">签发者：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.issuer"></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="主题，比如：萌卜兔" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">主题：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.subject"></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="生成JWT的密钥，建议复杂度高一些" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">密钥：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.key" class="custom" placeholder="请输入验证码">
                            <template #suffix>
                                <el-button v-on:click="method.rand()">
                                    <i-svg name="restore" color="rgb(var(--vice-color))" size="14px"></i-svg>
                                    <span class="ms-1">随机</span>
                                </el-button>
                            </template>
                        </el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="签名有效期，可以用乘法，如：7 * 24 * 60 * 60 表示7天" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">过期时间(秒)：</span>
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
import notyf from '{src}/utils/notyf.js'
import axios from '{src}/utils/request.js'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    struct: {
        key    : null,
        issuer : null,
        subject: null,
        expire : null,
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

        const { code, data } = await axios.get('/api/toml/crypt', {
            name: 'jwt'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        state.status.finish  = true
    },
    show() {
        if (!state.status.finish) return notyf.warn('分页限制配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    change: async value => {
        if (!value) {
            state.status.active = true
            notyf.warn('？？？？？？？？？？？？？<br>JWT是基础服务，这可不许关')
        }
    },
    save: async () => {

        state.status.wait   = true

        const { code, msg } = await axios.put('/api/toml/crypt-jwt', state.struct)

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    },
    rand(field = 'key') {
        let result  = 'INIS-'
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const len   = chars.length
        for (let i  = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * len))
        }
        state.struct[field] = result
    },
}

watch(() => state.struct, () => {
    // key 只允许输入字母、数字和全部的特殊字符
    state.struct.key    = state.struct.key.replace(/[^\w!@#$%^&*()_+\-=\[\]{};:'"\\|\/?,.<>~`\s]/g, '')
    // 只能是 数字、空格和运算符
    state.struct.expire = state.struct.expire.replace(/[^\d\s*+\-\/]/g, '')

}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>