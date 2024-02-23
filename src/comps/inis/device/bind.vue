<template>
    <div v-loading="state.status.loading" class="card">
        <div class="card-body">
            <el-image src="https://inis.cn/favicon.ico" class="position-absolute opacity-25" style="right: 1.5rem; height: 55px" />
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● 程序后端许多功能都依赖于 inis 社区<br>
                        ● 绑定仅限于为您提供更好的服务体验，不涉及您的程序任何敏感信息，请放心使用<br>
                        <span v-if="state.status.bind">● 当前绑定账号：{{ state.struct.account }}</span>
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">绑定 inis 社区账号</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.bind" v-on:change="method.change" :disabled="!state.status.bind"
                   active-text="绑定" inactive-text="解绑">
                </el-switch>
            </h2>
            <span class="badge bg-success font-white"> 更多 </span>
            <span class="text-muted">
                其它配置信息，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom sm" :close-on-click-modal="false">
        <template #header>
            <div class="d-flex flex-column align-items-center">
                <div class="flex-center">
                    <el-image src="https://inis.cn/assets/imgs/logo-white.png" style="height: 52px" class="my-1 py-1"></el-image>
                </div>
            </div>
        </template>
        <template #default>
            <div class="container-xxl">
                <el-tooltip placement="top">
                    <template #content>
                        程序后端许多功能都依赖于 inis 社区，绑定仅限于为您提供更好的服务体验，不涉及您的程序任何敏感信息，请放心使用。<br>
                    </template>
                    <el-alert type="success" :closable="false" center class="mb-3 box-shadow-light d-inline-flex align-items-center pointer">
                        <template #title>
                            <i-svg name="!" size="15px" color="var(--el-color-success)"></i-svg>
                            <span class="ms-1">绑定 inis 社区账号</span>
                        </template>
                    </el-alert>
                </el-tooltip>
                <div class="row mb-3 mt-3">
                    <label class="col-3 col-form-label">帐号：</label>
                    <div class="col-9">
                        <el-input v-model="state.struct.account" class="custom" placeholder="帐号 | 邮箱 | 手机号"></el-input>
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="col-3 col-form-label">密码：</label>
                    <div class="col-9 d-flex">
                        <el-input v-model="state.struct.password" v-on:keyup.enter="method.save()" show-password class="custom" placeholder="请输入密码"></el-input>
                    </div>
                </div>
                <div class="flex-center">
                    <a href="https://inis.cc" target="_blank" class="text-dark">没有账号？去注册</a>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="modal-footer d-flex justify-content-center">
                <el-button v-on:click="state.status.dialog = false">取 消</el-button>
                <el-button v-on:click="method.save()" :loading="state.status.wait">
                    {{state.status.wait ? '绑定中 ...' : '绑 定'}}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import notyf from '{src}/utils/notyf.js'
import axios from '{src}/utils/request.js'
import utils from "{src}/utils/utils.js";
import ISvg from "{src}/comps/custom/i-svg.vue";

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    struct: {
        account: null,
        password: null,
    },
    status: {
        bind   : false,
        finish : false,
        dialog : false,
        loading: true,
    },
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/inis/device/user')

        state.status.loading = false

        if (code !== 200) return

        state.struct         = data
        state.status.bind    = true
        state.status.finish  = true
    },
    change: async value => {

        if (value) return state.status.bind = value

        const { code, msg } = await axios.del('/inis/device/bind')

        if (code !== 200) {
            state.status.bind = true
            return notyf.error(msg)
        }
    },
    show() {
        state.status.dialog = true
    },
    save: async () => {

        if (utils.is.empty(state.struct.account))  return notyf.warn('请输入账号！')
        if (utils.is.empty(state.struct.password)) return notyf.warn('请输入密码！')

        state.status.wait   = true

        const { code, msg } = await axios.post('/inis/device/bind', state.struct)

        state.status.wait   = false

        if (code !== 200) return notyf.error(msg)

        state.status.bind   = true
        state.status.dialog = false
    },
}

onMounted(async () => {
    await method.init()
})

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>