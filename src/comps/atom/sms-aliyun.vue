<template>
    <div v-load="[state.status.loading, null, null]" class="card">
        <div class="card-body">
            <el-tooltip placement="top">
                <template #content>
                    ● 用于发送验证码相关的服务
                </template>
                <i-svg name="aliyun" size="60px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            </el-tooltip>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● 用于发送验证码相关的服务
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" size="14px"></i-svg>
                        <span class="ms-1">阿里云短信</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开启" inactive-text="关闭" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </h2>
            <span class="badge bg-warning"> 企业 </span>
            <span class="text-muted">
                企业推荐这个，<span v-on:click="method.show()" class="text-white">点我配置</span>
            </span>
        </div>
    </div>

    <teleport to="body">
        <div ref="item-modal" id="fill-item-modal" class="modal fade dark" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg mt-5">
                <div class="modal-content modal-filled position-relative">
                    <i-svg name="close" size="20px" color="#ccc" class="modal-close customize" data-bs-dismiss="modal"></i-svg>
                    <div class="modal-header d-flex justify-content-center">
                        <strong>配置阿里云短信服务</strong>
                    </div>
                    <div class="modal-body">
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
                                    <input v-model="state.struct.access_key_id" type="text" class="form-control customize text-white">
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
                                    <input v-model="state.struct.access_key_secret" type="text" class="form-control customize text-white">
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
                                    <input v-model="state.struct.endpoint" type="text" class="form-control customize text-white">
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
                                    <input v-model="state.struct.sign_name" type="text" class="form-control customize text-white">
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
                                    <input v-model="state.struct.verify_code" type="text" class="form-control customize text-white">
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
                                    <div class="input-group">
                                        <input v-model="state.struct.phone" type="text" style="height: 30px" class="form-control customize text-white">
                                        <div class="input-group-append">
                                            <button v-on:click="method.test()" type="button" class="btn btn-outline-light flex-center ms-2">
                                                <i-svg name="phone" size="14px"></i-svg>
                                                <span class="ms-1">阿里云短信测试</span>
                                            </button>
                                        </div>
                                    </div>
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
import {defineEmits, getCurrentInstance, onMounted, reactive, watch} from 'vue'
const { ctx, proxy } = getCurrentInstance()

import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import utils from "{src}/utils/utils.js";

const emit  = defineEmits(['refresh'])
const state = reactive({
    modal: Modal,
    struct: {
        default:            null,
        access_key_id:      null,
        access_key_secret:  null,
        endpoint:       null,
        sign_name:      null,
        verify_code:    null,
        phone:          null,
    },
    status: {
        finish: false,
        active: false,
        loading: true,
    },
    backup: {}
})

onMounted(async () => {
    await method.init()
    state.modal = new Modal(proxy.$refs['item-modal'])
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
        state.modal.show()
    },
    change: async value => {

        if (!value) return state.status.active = true

        const { code, msg } = await axios.put('/api/toml/sms-default', {
            value: value ? 'aliyun' : null
        })

        if (code === 200) return emit('refresh')

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

        const { code, msg } = await axios.put('/api/toml/sms-aliyun', state.struct)

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.modal.hide()
    },
    test: async () => {

        if (utils.is.empty(state.struct.phone))              return notyf.warn('请填写接收者手机号！')
        if (utils.is.empty(state.struct.access_key_id))      return notyf.warn('请填写阿里云AccessKey ID！')
        if (utils.is.empty(state.struct.access_key_secret))  return notyf.warn('请填写阿里云AccessKey Secret！')
        if (utils.is.empty(state.struct.endpoint))           return notyf.warn('请填写阿里云短信服务endpoint！')
        if (utils.is.empty(state.struct.sign_name))          return notyf.warn('请填写短信签名！')
        if (utils.is.empty(state.struct.verify_code))        return notyf.warn('请填写验证码模板！')
        if (!utils.is.phone(state.struct.phone))             return notyf.warn('接收者手机号格式不正确！')

        const { code, msg, data } = await axios.post('/api/toml/test-sms-aliyun', state.struct)

        if (code === 200) {
            // 拷贝一份备份
            state.backup = JSON.parse(JSON.stringify(state.struct))
            return notyf.success(msg)
        }

        notyf.error(msg)

        if (!utils.is.empty(data)) return notyf.error(data)
    },
}

watch(() => state.struct, () => {
    state.status.active = state.struct.default === 'aliyun'
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>