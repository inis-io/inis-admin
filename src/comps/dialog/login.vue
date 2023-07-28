<template>
    <el-dialog v-model="state.item.dialog" class="custom sm" :close-on-click-modal="false">
        <template #header>
            <div class="flex-center">
                <el-image src="/assets/imgs/logo-white.png" style="height: 52px" class="my-1 py-1"></el-image>
            </div>
        </template>
        <template #default>
            <div class="container-xxl">
                <el-tabs v-model="state.item.tabs" :stretch="true">
                    <el-tab-pane name="code">
                        <template #label>
                            <span class="fw-bolder font-12">验证码登录</span>
                        </template>
                        <div class="row mb-3 mt-3">
                            <label class="col-3 col-form-label">账户：</label>
                            <div class="col-9">
                                <el-input v-model="state.struct.account" class="custom" placeholder="手机号 | 邮箱"></el-input>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-3 col-form-label">验证码：</label>
                            <div class="col-9">
                                <el-input v-model="state.struct.code" v-on:keyup.enter="method.login()" class="custom" placeholder="请输入验证码">
                                    <template #suffix>
                                        <el-button v-on:click="method.code()" :loading="state.item.loading">
                                            获取 <span v-if="state.item.loading">{{ state.item.second }} s</span>
                                        </el-button>
                                    </template>
                                </el-input>
                            </div>
                        </div>
                        <div class="flex-center">
                            无账号自动注册
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="tradition">
                        <template #label>
                            <span class="fw-bolder font-12">账密登录</span>
                        </template>
                        <div class="row mb-3 mt-3">
                            <label class="col-3 col-form-label">帐号：</label>
                            <div class="col-9">
                                <el-input v-model="state.struct.account" class="custom" placeholder="帐号 | 邮箱 | 手机号"></el-input>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-3 col-form-label">密码：</label>
                            <div class="col-9 d-flex">
                                <el-input v-model="state.struct.password" v-on:keyup.enter="method.login()" show-password class="custom" placeholder="请输入密码"></el-input>
                            </div>
                        </div>
                        <div class="flex-center">
                            推荐验证码登录
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div class="d-flex justify-content-center">
                    <span v-on:click="method.reset()" class="pointer">忘记密码</span>
                    <span v-if="state.item.register" class="mx-2">|</span>
                    <span v-if="state.item.register" v-on:click="method.register()" class="pointer">注册帐号</span>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="modal-footer d-flex justify-content-center">
                <el-button v-on:click="method.login()" :loading="state.item.wait">
                    {{state.item.wait ? '登录中 ...' : '登  录'}}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import cache   from '{src}/utils/cache'
import utils   from '{src}/utils/utils'
import notyf   from '{src}/utils/notyf'
import axios   from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()
const emit  = defineEmits(['finish','register','reset'])
const state = reactive({
    item: {
        tabs: 'code',
        type: 'social-login',   // 登录类型
        wait: false,            // 是否等待
        loading:  false,        // 是否加载中
        finish :  false,        // 登录完成
        dialog :  false,
        register: false,        // 是否允许注册
        second: 0,              // 倒计时
    },
    struct: {
        account : null,         // 邮箱 | 账号
        password: null,         // 密码
        code:     null,         // 验证码
    },
    timer: null,
})

onMounted(async () => {
    await method.ALLOW_REGISTER()
})

const method = {
    // 登录
    async login() {

        state.item.wait = true

        const params = state.item.tabs === 'code' ? {
            code  : state.struct.code,
            social: state.struct.account
        } : {
            account : state.struct.account,
            password: state.struct.password
        }

        try {

            const { data, code, msg } = await axios.post('/api/comm/' + state.item.type, params)

            state.item.wait = false

            if (code === 200) {
                cache?.set('user-info', data.user, 10)
                utils.set.cookie(globalThis?.inis?.token_name || 'INIS_LOGIN_TOKEN', data.token, 7 * 24 * 60 * 60)
                state.item.finish = true
                state.item.dialog = false
                emit('finish', data.user)
                return
            }
            if (code === 201) return notyf.info(msg)

            setTimeout(() => {
                notyf.error(msg)
                // 重置计时器
                state.item.second = 0
                clearInterval(state.timer)
            }, 1000)

        } catch (error) {
            notyf.error(error)
        }
    },
    // 获取验证码
    async code() {

        if (utils.is.empty(state.struct.account))  return notyf.warn('帐号不能为空哟？')
        if (!utils.is.email(state.struct.account) && !utils.is.phone(state.struct.account)) return notyf.warn('格式不对哟！')
        state.struct.code = null

        await method.login()

        state.item.second = 60
        state.timer = setInterval(() => {
            state.item.second--
            if (state.item.second <= 0) clearInterval(state.timer)
        }, 1000)
    },
    // 显示对话框
    show: () => (state.item.dialog = true),
    // 点击注册
    register: () => {
        state.item.dialog = false
        emit('register')
    },
    // 点击忘记密码
    reset: () => {
        state.item.dialog = false
        emit('reset')
    },
    // 是否允许注册
    async ALLOW_REGISTER() {
        let { value } = await proxy?.$api.config.one('ALLOW_REGISTER')
        state.item.register = parseInt(value) === 1
    },
}

watch(() => state.item.tabs, (val) => {
    state.item.type = val === 'code' ? 'social-login' : 'login'
})
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