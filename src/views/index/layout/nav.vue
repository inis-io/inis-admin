<template>
    <div class="topnav">
        <div class="container-fluid user-select-none">
            <nav class="navbar navbar-dark navbar-expand-lg topnav-menu py-1 d-none d-lg-block">
                <div class="collapse navbar-collapse justify-content-between">
                    <el-menu class="navbar-nav w-100" :router="false" :unique-opened="true" mode="horizontal" background-color="transparent">
                        <el-menu-item index="/">
                            <el-image v-on:click="method.push('/')" :src="`/assets/imgs/logo-${state.theme || 'white'}.png`" style="width: 100px;" class="d-flex flex-center"></el-image>
                        </el-menu-item>
                        <el-menu-item route="/articles">
                            <span v-on:click="push({ name: 'index-articles-list' })"
                                :class="'d-flex align-items-center' + (state.nav.name === 'articles' ? ' active' : '')">
                                <i-svg name="article" size="15px"></i-svg>
                                <span class="ms-1">文章</span>
                            </span>
                        </el-menu-item>
                        <el-menu-item route="/pages">
                            <span
                                :class="'d-flex align-items-center' + (state.nav.name === 'pages' ? ' active' : '')">
                                <i-svg name="issues" size="15px"></i-svg>
                                <span class="ms-1">页面</span>
                            </span>
                        </el-menu-item>
                    </el-menu>
                    <el-menu :router="true" :unique-opened="true" mode="horizontal" background-color="transparent"
                             class="navbar-nav d-flex align-items-center justify-content-end w-100">
                        <template v-if="store.comm.getLogin.finish">
                            <el-sub-menu index="login-user" class="icon-none">
                                <template #title>
                                    <div class="d-flex flex-column align-items-end user-select-text me-2">
                                        <span v-if="!utils.is.empty(store.comm.getLogin.user?.title)" class="font-14 scale-90">
                                            <strong class="badge item left bg-dark px-2 py-1" style="color: #fff">
                                                {{ store.comm.getLogin.user?.nickname }}
                                            </strong>
                                            <span class="badge item right bg-warning px-2 py-1">
                                                {{ store.comm.getLogin.user?.title }}
                                            </span>
                                        </span>
                                        <strong v-else>
                                            {{ store.comm.getLogin.user?.nickname }}
                                        </strong>
                                        <small>{{ store.comm.getLogin.user?.email }}</small>
                                    </div>
                                    <el-avatar :src="store.comm.getLogin.user?.avatar + (store.comm.getLogin.user?.avatar.includes('?') ? '&' : '?') + 'size=40x40'" class="me-1" shape="square" size="medium"></el-avatar>
                                </template>
                                <el-menu-item index="/admin">
                                    <i-svg name="console" size="16px" class="me-1"></i-svg>
                                    控制台
                                </el-menu-item>
                                <el-menu-item index="/admin/account/home">
                                    <i-svg name="personal" size="15px" class="me-1"></i-svg>
                                    个人中心
                                </el-menu-item>
                                <el-menu-item v-on:click="store.comm.logout()">
                                    <i-svg name="logout" size="16px" class="me-1"></i-svg>
                                    <span class="w-100">退出登录</span>
                                </el-menu-item>
                            </el-sub-menu>
                        </template>
                        <template v-else>
                            <el-menu-item v-if="parseInt(store.config.getAllowRegister?.value) === 1" :index="1">
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
                <div class="d-flex justify-content-between align-items-center">
                    <span v-on:click="state.drawer.show = true" class="wh-24px d-block ms-2">
                        <i-svg name="side" size="22px" color="rgb(var(--assist-color))"></i-svg>
                    </span>
                    <span v-if="!store.comm.getLogin.finish" v-on:click="method.login.show()" class="wh-30px d-block me-2">
                        <i-lottie name="user" v-model="state.drawer.menu"></i-lottie>
                    </span>
                    <span v-else v-on:click="push({ path: '/admin' })">
                        <el-avatar :src="store.comm.getLogin.user?.avatar" :size="30" class="mx-2 avatar-shadow mirror-scan"></el-avatar>
                    </span>
                </div>
            </nav>
        </div>
        <i-progress v-if="store.comm.progress"></i-progress>
    </div>

    <el-drawer v-model="state.drawer.show" direction="ltr" size="75%" :show-close="false" class="custom side">
        <template #header>
            <div class="d-flex flex-column">
                <span class="flex-center mb-3">
                    <el-image v-on:click="method.push('/')" :src="`/assets/imgs/logo-${state.theme || 'white'}.png`" style="width: 100px;" class="d-flex flex-center"></el-image>
                </span>
                <div v-if="store.comm.getLogin.finish" class="d-flex flex-column">
                    <p class="mb-2 fw-medium font-14 d-flex align-items-center">
                        <span class="me-1 w-2px h-16px bg-info radius-4"></span>
                        个人信息
                    </p>
                    <el-image src="https://inis.cn/api/file/rand?name=imgs.txt&size=250x120" style="height: 120px; border-radius: 6px 6px 0 0" fit="cover"></el-image>
                    <div class="card card-body position-relative mb-0 nav-bg">
                        <div class="d-flex">
                            <el-avatar :src="store.comm.getLogin.user?.avatar" :size="50" class="position-absolute avatar-shadow mirror-scan" style="top: -25px" shape="square"></el-avatar>
                            <div class="d-flex align-items-center position-absolute" style="top: 5px; left: 70px">
                                <span class="text-dark font-15 fw-bolder">{{ store.comm.getLogin.user?.nickname }}</span>
                                <span class="badge badge-outline-warning item right ms-1 scale-90">
                                    {{ store.comm.getLogin.user?.title }}
                                </span>
                            </div>
                            <p class="mt-2 pt-1 mb-0 font-13">{{ store.comm.getLogin.user?.description || '这个人很懒，什么都没留下！' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #default>
            <p class="mb-2 fw-medium font-14 d-flex align-items-center">
                <span class="me-1 w-2px h-16px bg-info radius-4"></span>
                导航菜单
            </p>
            <el-menu class="nav-bg">
                <el-menu-item v-on:click="method.push({ name: 'index-articles-list' })" index="articles">
                    <span class="d-flex align-items-center">
                        <i-svg name="article" size="14px"></i-svg>
                        <span class="font-14 fw-medium ms-1">文 章</span>
                    </span>
                </el-menu-item>
                <el-menu-item index="bug">
                    <span class="d-flex align-items-center">
                        <i-svg name="issues" size="14px"></i-svg>
                        <span class="font-14 fw-medium ms-1">页 面</span>
                    </span>
                </el-menu-item>
            </el-menu>
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

    <dialog-login v-model="store.comm.auth.login"></dialog-login>
    <dialog-register v-model="store.comm.auth.register"></dialog-register>
    <dialog-reset-password v-model="store.comm.auth.reset" v-on:finish="method.login.show()"></dialog-reset-password>
</template>

<script setup>
import utils from '{src}/utils/utils'
import { push } from '{src}/utils/route'
import { useCommStore } from '{src}/store/comm'
import { useConfigStore } from '{src}/store/config'
import DialogLogin from '{src}/comps/index/dialog/login.vue'
import DialogRegister from '{src}/comps/index/dialog/register.vue'
import DialogResetPassword from '{src}/comps/index/dialog/reset-password.vue'
import iProgress from '{src}/comps/custom/i-progress.vue'

const { ctx, proxy } = getCurrentInstance()
const router = useRouter()
const store  = {
    comm: useCommStore(),
    config: useConfigStore()
}
const state  = reactive({
    theme: 'white',
    drawer: {
        show: false,
        menu: true
    },
    config: {
        // 是否允许注册
        register: false,
    },
    nav: {
        name: 'index',
        color: {
            active: 'rgb(var(--assist-color))',
            inactive: 'rgb(var(--vice-font-color))',
        }
    },
})

const method = {
    // 登录
    login: {
        // 显示登录框
        show: () => store.comm.switchAuth('login', true),
    },
    // 忘记密码
    reset: {
        // 显示忘记密码框
        show: () => store.comm.switchAuth('reset', true),
    },
    // 注册
    register: {
        // 显示注册框
        show: () => store.comm.switchAuth('register', true),
    },
    // 获取当前主题
    async getTheme() {
        let theme = document.querySelector('body').getAttribute('inis-theme')
        if (!utils.is.empty(theme)) {
            if (theme.indexOf('white') !== -1) state.theme = 'white'
            else state.theme = 'dark'
        }
    },
    // 路由跳转
    router: (params = {}) => router.push(params),
    // 路由跳转 - 关闭抽屉
    push: (params = {}) => {
        push(params)
        state.drawer.show = false
    },
}

onMounted(() => {
    state.theme = document.querySelector('body').getAttribute('inis-theme')
})
nextTick(async () => {
    await method.getTheme()
})

// 监听当前路由 name 改变
watch(() => router.currentRoute.value.name, (val) => {
    const map = {
        'index-themes-list': 'themes',
        'index-articles-list': 'articles',
    }
    state.nav.name = map[val] || val
}, { immediate: true })

watch(() => state.drawer.show, (val) => {
    // 显示抽屉时禁止滚动
    document.querySelector('body').style.overflow = val ? 'hidden' : 'auto'
})
</script>