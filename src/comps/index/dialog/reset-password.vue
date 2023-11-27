<template>
    <el-dialog v-model="state.item.dialog" class="custom" :close-on-click-modal="false">
        <template #header>
            <div class="flex-center">
                <el-image src="/assets/imgs/logo-white.png" style="height: 52px" class="my-1 py-1"></el-image>
            </div>
        </template>
        <template #default>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label">
                                <el-tooltip content="（必须）注册时候的账号" placement="top">
                                    <span>
                                        <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                        <span class="ms-1">账号：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.struct.account" class="custom" placeholder="请输入账号"></el-input>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label">
                                <el-tooltip content="可以是邮箱或者手机号，用于找回密码或验证码登录等" placement="top">
                                    <span>
                                        <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                        <span class="ms-1">联系方式：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.struct.social" class="custom" placeholder="电子邮箱或手机号"></el-input>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip content="（必须）用于确认您的邮箱或者手机号是有效的" placement="top">
                                    <span>
                                        <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                        <span class="ms-1">验证码：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.struct.code" class="custom" placeholder="请输入验证码">
                                <template #suffix>
                                    <el-button v-on:click="method.code()" :loading="state.item.loading">
                                        获取 <span v-if="state.item.loading">{{ state.item.second }} s</span>
                                    </el-button>
                                </template>
                            </el-input>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group mb-3">
                            <label class="form-label">
                                <el-tooltip content="重置之后的新密码" placement="top">
                                    <span>
                                        <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                        <span class="ms-1 required">新的密码：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.password.value" show-password class="custom" placeholder="请输入新密码"></el-input>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip content="（必须）再次确认密码" placement="top">
                                    <span>
                                        <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                        <span class="ms-1">确认密码：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.password.verify" show-password class="custom" placeholder="请再次输入新密码"></el-input>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="modal-footer d-flex justify-content-center">
                <el-button v-on:click="method.login()">
                    记起来了？点我登录
                </el-button>
                <el-button v-on:click="method.reset()" :loading="state.item.wait">
                    {{state.item.wait ? '重置中 ...' : '重置密码'}}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import utils from '{src}/utils/utils.js'
import notyf from '{src}/utils/notyf.js'
import axios from '{src}/utils/request.js'
import { useCommStore } from '{src}/store/comm'

const { ctx, proxy } = getCurrentInstance()
const emit  = defineEmits(['finish'])
const store = {
    comm: useCommStore()
}
const state = reactive({
    item: {
        loading:  false,        // 是否加载中
        dialog :  false,
        wait: false,
        second: 0,
    },
    struct: {
        social:   null,         // 联系方式
        account : null,         // 账号
        password: null,         // 密码
        nickname: null,         // 昵称
        code:     null,         // 验证码
    },
    password: {
        value: null,
        verify: null,
    },
    timer: null,
})

const method = {
    // 重置
    reset: async () => {

        if (utils.is.empty(state.struct.account, state.struct.social)) {
            return notyf.warn('账号或联系方式二选一')
        }
        if (utils.is.empty(state.password.value))           return notyf.warn('请输入密码！')
        if (utils.is.empty(state.password.verify))          return notyf.warn('请再次输入密码！')
        if (utils.is.empty(state.struct.code))              return notyf.warn('请输入验证码！')
        if (state.password.value !== state.password.verify) return notyf.warn('两次输入的密码不一致！')

        state.item.wait     = true

        const { code, msg } = await axios.post('/api/comm/reset-password', {
            ...state.struct, password: state.password.value
        })

        state.item.wait     = false

        if (code !== 200) return notyf.error(msg)

        notyf.success('重置成功！')

        state.item.dialog = false
        emit('finish')
    },
    // 获取验证码
    code: async () => {

        if (utils.is.empty(state.struct.account, state.struct.social)) {
            return notyf.warn('账号或联系方式二选一')
        }

        state.item.loading  = true

        const { code, msg } = await axios.post('/api/comm/reset-password', {
            social: state.struct.social,
            account: state.struct.account,
        })

        state.item.loading  = false

        if (!utils.in.array(code, [200,201])) return notyf.error(msg)

        notyf.success(msg)

        state.item.second = 60
        state.timer = setInterval(() => {
            state.item.second--
            if (state.item.second <= 0) clearInterval(state.timer)
        }, 1000)
    },
    // 显示对话框
    show: () => (state.item.dialog = true),
    // 点击登录
    login: () => {
        store.comm.switchAuth('login', true)
    },
}

watch(() => state.struct.code, (val) => {
    // 去除空字符串
    state.struct.code = val?.replace(/\s+/g, '')
})
watch(() => state.item.second, (val) => {
    state.item.loading = val > 0
})

// 将子组件方法暴露给父组件
defineExpose({
    show: method.show,
})
</script>