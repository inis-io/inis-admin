<template>
    <div v-load="[state.status.loading, null, null]" class="card">
        <div class="card-body">
            <i-svg name="crypt" size="55px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        JWT（JSON Web Token）是一种在网络应用中传递声明信息的轻量级、安全的方式。<br>
                        JWT具有通用性和可扩展性，可以应用在很多场景，比如用户认证、单点登录、API访问授权等。
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" size="14px"></i-svg>
                        <span class="ms-1">JWT</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开始" inactive-text="关闭" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </h2>
            <span class="badge bg-primary"> +5% </span>
            <span class="text-muted ms-1">
                安全性提升，<span v-on:click="method.show()" class="text-warning">点我配置</span>
            </span>
        </div>
    </div>

    <teleport to="body">
        <div ref="item-modal" id="fill-item-modal" class="modal fade dark" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg mt-5">
                <div class="modal-content modal-filled position-relative">
                    <i-svg name="close" size="20px" color="#ccc" class="modal-close customize" data-bs-dismiss="modal"></i-svg>
                    <div class="modal-header d-flex justify-content-center">
                        <strong> 配置 JSON Web Token </strong>
                    </div>
                    <div class="modal-body">
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
                                    <input v-model="state.struct.issuer" type="text" class="form-control customize text-white">
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
                                    <input v-model="state.struct.subject" type="text" class="form-control customize text-white">
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
                                    <div class="input-group">
                                        <input v-model="state.struct.key" style="height: 30px" type="text" class="form-control customize text-white">
                                        <div class="input-group-append">
                                            <button v-on:click="method.rand()" type="button" class="btn btn-outline-light flex-center ms-2">
                                                <i-svg name="phone" size="14px"></i-svg>
                                                <span class="ms-1">随机</span>
                                            </button>
                                        </div>
                                    </div>
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
                                    <input v-model="state.struct.expire" style="height: 30px" type="text" class="form-control customize text-white">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">取 消</button>
                        <button v-on:click="method.save()" type="button" class="btn btn-info">保 存</button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>

import { Modal } from 'bootstrap'
import { getCurrentInstance, onMounted, reactive, watch } from 'vue'
const { ctx, proxy } = getCurrentInstance()

import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const state = reactive({
    modal: Modal,
    struct: {
        key    : null,
        issuer : null,
        subject: null,
        expire : null,
    },
    status: {
        finish: false,
        active: true,
        loading: true,
    }
})

onMounted(async () => {
    await method.init()
    state.modal = new Modal(proxy.$refs['item-modal'])
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
        state.modal.show()
    },
    change: async value => {
        if (!value) {
            state.status.active = true
            notyf.warn('？？？？？？？？？？？？？<br>JWT是基础服务，这可不许关')
        }
    },
    save: async () => {

        const { code, msg } = await axios.put('/api/toml/crypt-jwt', state.struct)

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.modal.hide()
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