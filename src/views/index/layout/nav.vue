<template>
    <div class="topnav">
        <div class="container-fluid user-select-none">
            <nav class="navbar navbar-dark navbar-expand-lg topnav-menu py-1 d-none d-lg-block">
                <div class="collapse navbar-collapse justify-content-between">
                    <el-menu class="navbar-nav w-100" :router="false" :unique-opened="true" mode="horizontal" background-color="transparent">
                        <el-menu-item index="/">
                            <el-image v-on:click="push('/')" :src="`/assets/imgs/logo-${state.theme || 'white'}.png`" style="width: 100px;" class="d-flex flex-center"></el-image>
                        </el-menu-item>
                        <el-sub-menu index="manage">
                            <template #title>
                                <strong class="font-12">管理</strong>
                            </template>
                            <el-menu-item route="/admin/users">
                                <i-svg name="user" size="16px" class="me-1"></i-svg>
                                用户
                            </el-menu-item>
                            <el-menu-item route="/admin/device">
                                <i-svg name="pc" size="16px" class="me-1"></i-svg>
                                设备
                            </el-menu-item>
                            <el-menu-item route="/admin/auth">
                                <i-svg name="lock" size="16px" class="me-1"></i-svg>
                                权限
                            </el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="tool">
                            <template #title>
                                <strong class="font-12">工具</strong>
                            </template>
                            <el-menu-item v-on:click="method.router({name:'index-test'})">测试</el-menu-item>
                            <el-menu-item v-on:click="method.router({name:'admin-icons'})" route="/admin/icons">图标</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                    <el-menu :router="true" :unique-opened="true" mode="horizontal" background-color="transparent"
                             class="navbar-nav d-flex align-items-center justify-content-end w-100">
                        <template v-if="state.login.finish">
                            <el-sub-menu index="login-user" class="icon-none">
                                <template #title>
                                    <div class="d-flex flex-column align-items-end user-select-text me-2">
                                        <span v-if="!utils.is.empty(state.login.user?.title)" class="font-14">
                                            <strong class="badge item left bg-dark px-2 py-1" style="color: #fff">
                                                {{ state.login.user?.nickname }}
                                            </strong>
                                            <span class="badge item right bg-warning px-2 py-1">
                                                {{ state.login.user?.title }}
                                            </span>
                                        </span>
                                        <strong v-else>
                                            {{ state.login.user?.nickname }}
                                        </strong>
                                        <small>{{state.login.user?.email}}</small>
                                    </div>
                                    <el-avatar :src="state.login.user?.avatar + (state.login.user?.avatar.includes('?') ? '&' : '?') + 'size=40x40'" class="me-1" shape="square" size="medium"></el-avatar>
                                </template>
                                <el-menu-item index="/admin">
                                    <i-svg color="rgb(var(--assist-color))" name="console" size="16px" class="me-1"></i-svg>
                                    控制台
                                </el-menu-item>
                                <el-menu-item index="/admin/account/home">
                                    <i-svg color="rgb(var(--assist-color))" name="personal" size="16px" class="me-1"></i-svg>
                                    个人中心
                                </el-menu-item>
                                <el-menu-item v-on:click="method.logout()">
                                    <i-svg color="rgb(var(--assist-color))" name="logout" size="16px" class="me-1"></i-svg>
                                    <span class="w-100">退出登录</span>
                                </el-menu-item>
                            </el-sub-menu>
                        </template>
                        <template v-else>
                            <el-menu-item v-if="state.config.register" :index="1">
                                <strong v-on:click="method.register.show()" class="font-12">注册</strong>
                            </el-menu-item>
                            <el-menu-item :index="2">
                                <strong v-on:click="method.login.show()" class="font-12">登录</strong>
                            </el-menu-item>
                        </template>
                    </el-menu>
                </div>
            </nav>
            <nav class="d-lg-none d-black py-1">
                <div class="d-flex justify-content-between">
                    <span>
                        <span v-on:click="state.drawer = true" class="mx-2">
                            <i-svg name="menu" size="24px" color="rgb(var(--assist-color))"></i-svg>
                        </span>
                    </span>
                    <span>
                        <span v-if="!state.login.finish" v-on:click="method.login.show()" class="mx-2">
                            <i-svg name="user" size="26px" color="rgb(var(--assist-color))"></i-svg>
                        </span>
                        <a v-else href="/admin">
                            <el-avatar :src="state.login.user?.avatar" :size="26" class="mx-2"></el-avatar>
                        </a>
                    </span>
                </div>
            </nav>
        </div>
    </div>

    <el-drawer v-model="state.drawer" direction="ltr" size="70%" :show-close="false" class="card">
        <template #header>
            <span class="flex-center">
                <a href="/">
                    <img v-if="state.theme === 'dark'" src="https://inis.cn/assets/images/logo.png" height="40">
                    <img v-else src="https://inis.cn/assets/images/logo.png" height="40">
                </a>
            </span>
        </template>
        <template #default>
            这是内容
        </template>
        <template #footer>
            <span class="flex-center">
                <span class="flex-center mx-1">
                    <el-tooltip class="box-item" effect="dark" content="97783391" placement="top">
                        <i-svg name="qq" size="24px"></i-svg>
                    </el-tooltip>
                </span>
                <span class="flex-center mx-1">
                    <el-tooltip class="box-item" effect="dark" content="v-inis" placement="top">
                        <i-svg name="we-chat" size="22px"></i-svg>
                    </el-tooltip>
                </span>
                <span class="flex-center mx-1">
                    <el-tooltip class="box-item" effect="dark" content="97783391@qq.com" placement="top">
                        <i-svg name="email" size="26px"></i-svg>
                    </el-tooltip>
                </span>
                <span class="flex-center mx-1">
                    <el-tooltip class="box-item" effect="dark" content="racns" placement="top">
                        <i-svg name="github" size="26px"></i-svg>
                    </el-tooltip>
                </span>
                <span class="flex-center">
                    <el-tooltip class="box-item" effect="dark" content="萌卜兔" placement="top">
                        <i-svg name="bilibili" size="38px"></i-svg>
                    </el-tooltip>
                </span>
            </span>
        </template>
  </el-drawer>

    <dialog-login ref="login" v-on:finish="method.login.finish" v-on:register="method.register.show()" v-on:reset="method.reset.show()"></dialog-login>
    <dialog-register ref="register" v-on:finish="method.register.finish" v-on:login="method.login.show()"></dialog-register>
    <dialog-reset-password ref="reset-password" v-on:finish="method.login.show()" v-on:login="method.login.show()"></dialog-reset-password>
</template>

<script setup>
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import { push } from '{src}/utils/route'
import session from '{src}/utils/session'
import DialogLogin from '{src}/comps/dialog/login.vue'
import DialogRegister from '{src}/comps/dialog/register.vue'
import DialogResetPassword from '{src}/comps/dialog/reset-password.vue'

const { ctx, proxy } = getCurrentInstance()
const router = useRouter()
const state  = reactive({
    theme: 'white',
    drawer: false,
    login: {
        finish: false,
        user: utils.get.session('USERINFO'),
    },
    config: {
        // 是否允许注册
        register: false,
    }
})

onMounted(() => {
    method.checkToken()
    state.theme = document.querySelector('body').getAttribute('inis-theme')
})
nextTick(async () => {
    await method.getTheme()
    await method.ALLOW_REGISTER()
})

const method = {
    // 登录
    login: {
        // 显示登录框
        show: () => proxy.$refs['login']['show'](),
        // 登录完成
        finish: (user) => {
            state.login.finish = true
            state.login.user   = user
        }
    },
    // 注册
    register: {
        // 显示注册框
        show: () => proxy.$refs['register']['show'](),
        // 注册完成
        finish: (user) => {
            state.login.user   = user
            state.login.finish = true
        }
    },
    // 忘记密码
    reset: {
        // 显示忘记密码框
        show: () => proxy.$refs['reset-password']['show'](),
    },
    // 退出登录
    async logout() {

        const { code } = await axios.del('/api/comm/logout')

        // 退出登录失败 - 清除登录信息
        if (code !== 200) {
            utils.clear.session('USERINFO')
            utils.clear.cookie(globalThis?.inis?.token_name || 'INIS_LOGIN_TOKEN')
            return
        }

        state.login.finish = false
        utils.clear.session('USERINFO')
        utils.clear.cookie(globalThis?.inis?.token_name || 'INIS_LOGIN_TOKEN')
    },
    // 校验登录
    async checkToken() {

        if (utils.has.session('USERINFO')) return state.login.finish = true

        const { data, code, msg } = await axios.post('/api/comm/check-token')
        
        if (code === 412) return
        if (code === 401) return method.logout()
        if (code !== 200) return notyf.error(msg)
        
        state.login.user = data.user
        state.login.finish = true
        utils.set.session('USERINFO', data.user)
    },
    // 获取当前主题
    async getTheme() {
        let theme = document.querySelector('body').getAttribute('inis-theme')
        if (!utils.is.empty(theme)) {
            if (theme.indexOf('white') !== -1) state.theme = 'white'
            else state.theme = 'dark'
        }
    },
    // 是否允许注册
    async ALLOW_REGISTER() {
        let { value } = await session.config.get('ALLOW_REGISTER') || { value: 0 }
        state.config.register = parseInt(value) === 1
    },
    router: (params = {}) => router.push(params),
}
</script>