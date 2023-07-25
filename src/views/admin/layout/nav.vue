<template>
    <div class="topnav">
        <div class="container-fluid user-select-none">
            <nav class="navbar navbar-dark navbar-expand-lg topnav-menu py-1">
                <div class="collapse navbar-collapse justify-content-between">
                    <el-menu class="navbar-nav w-100" :router="true" :unique-opened="true" menu-trigger="hover" mode="horizontal" background-color="transparent">
                        <el-menu-item index="/">
                            <el-image v-on:click="push('/')" :src="`/assets/imgs/logo-${state.theme}.png`" style="width: 100px;" class="d-flex flex-center"></el-image>
                        </el-menu-item>
                        <el-sub-menu v-for="(item, index) in state.menu" :key="index" :index="index.toString()" show-timeout="50" hide-timeout="50">
                            <template #title>{{ item.label }}</template>
                            <el-menu-item v-for="(val, key) in item.children" :key="key" :index="key.toString()" v-on:click="val.fn()">
                                <i-svg :name="val.icon" :size="val.size" color="rgb(var(--assist-color))" class="me-1"></i-svg>
                                {{ val.label }}
                            </el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                    <el-menu :unique-opened="true" mode="horizontal" class="navbar-nav d-flex align-items-center justify-content-end w-100" background-color="transparent">
                        <el-menu-item index="1">
                            <atom-upgrade></atom-upgrade>
                        </el-menu-item>
                        <el-sub-menu show-timeout="50" hide-timeout="50" index="login-user" class="icon-none">
                            <template #title>
                                <div class="d-flex flex-column align-items-end user-select-text me-2">
                                    <span v-if="!utils.is.empty(state.user?.title)" class="font-14">
                                        <strong class="badge item left bg-dark px-2 py-1" style="color: #fff">
                                            {{ state.user?.nickname }}
                                        </strong>
                                        <span class="badge item right bg-warning px-2 py-1">
                                            {{ state.user?.title }}
                                        </span>
                                    </span>
                                    <strong v-else>
                                        {{ state.user?.nickname }}
                                    </strong>
                                    <small>{{state.user?.email}}</small>
                                </div>
                                <el-avatar :src="state.user?.avatar + (state.user?.avatar.includes('?') ? '&' : '?') + 'size=40x40'" class="mirror-scan" shape="square" size="medium"></el-avatar>
                            </template>
                            <el-menu-item v-on:click="push({ name: 'admin-home' })" index="index-home">
                                <i-svg color="rgb(var(--assist-color))" name="console" size="16px" class="me-1"></i-svg>
                                控制台
                            </el-menu-item>
                            <el-menu-item v-on:click="push({ name: 'admin-account-home' })" index="/admin/account/home">
                                <i-svg color="rgb(var(--assist-color))" name="personal" size="16px" class="me-1"></i-svg>
                                个人中心
                            </el-menu-item>
                            <el-menu-item>
                                <i-svg color="rgb(var(--assist-color))" name="logout" size="16px" class="me-1"></i-svg>
                                <span v-on:click="method.logout()" class="w-100">退出登录</span>
                            </el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </div>
            </nav>
            <nav class="d-lg-none d-black">
                <div class="d-flex justify-content-between">
                    <span>
                        <span v-on:click="state.drawer = true" class="mx-2">
                            <i-svg color="rgb(var(--assist-color))" name="menu" size="24px"></i-svg>
                        </span>
                    </span>
                    <span>
                        <a v-if="!state.login.finish" data-bs-toggle="modal" data-bs-target="#fill-item-modal" href="javascript:" class="mx-2">
                            <i-svg color="rgb(var(--assist-color))" name="user-white" size="26px"></i-svg>
                        </a>
                        <a v-else href="/admin">
                            <el-avatar :src="state.user?.avatar" :size="26" class="mx-2"></el-avatar>
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
</template>

<script setup>
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import { push } from '{src}/utils/route'
import { list as MenuList } from '{src}/utils/menu'
import AtomUpgrade from '{src}/comps/atom/upgrade.vue'

const { ctx, proxy } = getCurrentInstance()
const router = useRouter()
const state  = reactive({
    theme: 'white',
    login: {
        finish : false,         // 登录完成
    },
    user: utils.get.session('USERINFO'),
    drawer: false,
    menu: [],
})

onMounted(async () => {
    await method.checkToken()
    state.menu = await MenuList()
})

nextTick(async () => {
    await method.getTheme()
})

const method = {
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
        // 返回首页
        setTimeout(() => {
            proxy.$router.push('/')
        }, 500)
    },
    // 校验登录
    async checkToken() {

        if (utils.has.session('USERINFO')) return state.login.finish = true

        const { data, code, msg } = await axios.post('/api/comm/check-token')
        
        if (code === 412) return
        if (code !== 200) return notyf.error(msg)
        
        state.user = data.user
        state.login.finish = true
        utils.set.session('USERINFO', data.user)
    },
    async getTheme() {
        let theme = document.querySelector('body').getAttribute('inis-theme')
        if (!utils.is.empty(theme)) {
            if (theme.indexOf('white') !== -1) state.theme = 'white'
            else state.theme = 'dark'
        }
    },
    // 是否为空
    empty: value => utils.is.empty(value),
    router: (params = {}) => router.push(params),
}
</script>