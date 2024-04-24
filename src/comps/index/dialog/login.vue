<template>
    <el-dialog v-model="state.item.dialog" class="custom sm" :close-on-click-modal="false">
        <template #header>
            <div class="flex-center">
                <el-image src="/assets/imgs/logo-white.png" style="height: 52px" class="my-1 py-1"></el-image>
            </div>
        </template>
        <template #default>
            <div class="container-xxl">
                <el-alert type="success" :closable="false" center class="mb-3 box-shadow-light">
                    <template #title>
                        <i-svg name="!" size="15px" color="var(--el-color-success)"></i-svg>
                        <span class="ms-1">{{ state.item.tabs === 'code' ? '没有账号自动注册' : '推荐验证码登录' }}</span>
                    </template>
                </el-alert>
                <el-tabs v-model="state.item.tabs" stretch>
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
                            <div ref="verify" class="col-9">
                                <el-input v-model="state.struct.code" v-on:keyup.enter="method.login()" class="custom" placeholder="请输入验证码">
                                    <template #suffix>
                                        <el-button v-on:click="method.code()" :loading="state.item.loading">
                                            获取 <span v-if="state.item.loading">{{ state.item.second }} s</span>
                                        </el-button>
                                    </template>
                                </el-input>
                            </div>
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
                            <div ref="password" class="col-9 d-flex">
                                <el-input v-model="state.struct.password" v-on:keyup.enter="method.login()" show-password class="custom" placeholder="请输入密码"></el-input>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div class="d-flex justify-content-center">
                    <span v-on:click="method.reset()" class="pointer">忘记密码</span>
                    <span v-if="parseInt(store.config.getAllowRegister?.value) === 1" class="mx-2">|</span>
                    <span v-if="parseInt(store.config.getAllowRegister?.value) === 1" v-on:click="method.register()" class="pointer">注册帐号</span>
                </div>
<!--                <div class="d-flex justify-content-center mt-3">-->
<!--                    <span class="flex-center mx-1">-->
<!--                        <el-button v-on:click="method.oauth('qq')" round>-->
<!--                            <i-svg name="qq" size="24px"></i-svg>-->
<!--                        </el-button>-->
<!--                    </span>-->
<!--                    <span class="flex-center mx-1">-->
<!--                        <el-button round>-->
<!--                            <i-svg name="github" size="26px"></i-svg>-->
<!--                        </el-button>-->
<!--                    </span>-->
<!--                </div>-->
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
import cache from '{src}/utils/cache.js'
import utils from '{src}/utils/utils.js'
import notyf from '{src}/utils/notyf.js'
import axios from '{src}/utils/request.js'
import crypto from '{src}/utils/crypto.js'
import { useCommStore } from '{src}/store/comm'
import { useConfigStore } from '{src}/store/config'
import ISvg from "{src}/comps/custom/i-svg.vue";

const { ctx, proxy } = getCurrentInstance()
const emit  = defineEmits(['finish'])
const store = {
    comm: useCommStore(),
    config: useConfigStore()
}
const state = reactive({
    item: {
        tabs: 'code',
        type: 'social-login',   // 登录类型
        wait: false,            // 是否等待
        loading:  false,        // 是否加载中
        finish :  false,        // 登录完成
        dialog :  false,
        second: 0,              // 倒计时
    },
    struct: {
        account : null,         // 邮箱 | 账号
        password: null,         // 密码
        code:     null,         // 验证码
    },
    timer: null,
})

const method = {
    // 登录
    async login() {

        const unix = await method.unix()
        const iv   = crypto.token(`iv-${unix}` , 16, 'login')
        const key  = crypto.token(`key-${unix}`, 16, 'login')
        const AES  = crypto.AES(key, iv)

        state.item.wait = true

        const params = state.item.tabs === 'code' ? {
            code  : state.struct.code,
            social: state.struct.account
        } : {
            account : AES.encrypt(state.struct.account),
            password: AES.encrypt(state.struct.password)
        }

        try {

            const { data, code, msg } = await axios.post('/api/comm/' + state.item.type, params, {
                headers: {
                    'X-Khronos': unix,
                    'X-Gorgon' : `${key} ${iv}`,
                    'X-Argus'  : AES.encrypt(JSON.stringify({
                        unix, account: state.struct.account, password: state.struct.password
                    }))
                }
            })

            state.item.wait = false

            if (code === 200) {
                cache.set('user-info', data.user, 10)
                utils.set.cookie(globalThis?.inis?.token_name || 'INIS_LOGIN_TOKEN', data.token, 7 * 24 * 60 * 60)
                state.item.finish = true
                state.item.dialog = false
                // 更新仓库状态
                store.comm.login.finish = true
                store.comm.login.user   = data.user
                store.comm.switchAuth('login', false)
                // 通知父组件
                emit('finish', data.user)
                return
            }
            if (code === 201) return notyf.info(msg)

            // 水平抖动动画
            method.animation()

            notyf.error(msg)
            method.clearCache()
            // 重置计时器
            state.item.second = 0
            clearInterval(state.timer)

        } catch (error) {
            notyf.error(error)
            method.clearCache()
            state.item.wait = false
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
        store.comm.switchAuth('register', true)
    },
    // 点击忘记密码
    reset: () => {
        store.comm.switchAuth('reset', true)
    },
    // 动画
    animation: () => {
        const els = [proxy.$refs.verify, proxy.$refs.password]
        els.forEach(el => {
            el.classList.add('active', 'shake-horizontal')
            setTimeout(() => {
                el.classList.remove('active', 'shake-horizontal')
            }, 1000)
        })
    },
    // 清除缓存
    clearCache: () => {
        // 清理全部的 Cookie
        utils.set.cookie(globalThis?.inis?.token_name || 'INIS_LOGIN_TOKEN', '', -1)
    },
    // 获取当前时间戳 - 服务器时间和客户端时间可能存在误差
    unix: async () => {
        // 获取服务器时间
        const { code, data } = await axios.get('/dev/info/time')
        // 服务器时间获取失败，返回客户端时间
        if (code !== 200) return Math.round(new Date() / 1000)
        // 返回服务器时间戳
        return data.unix
    },
    // 三方授权登录
    oauth: (target = 'qq') => {
        // 打印当前时间戳
        window.open(`/api/oauth/${target}?key=inis`, "oauth", "width=800,height=500,top=100,left=100")
    }
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