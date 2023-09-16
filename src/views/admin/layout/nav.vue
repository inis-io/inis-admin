<template>
    <div class="topnav">
        <div class="container-fluid user-select-none">
            <nav class="navbar navbar-dark navbar-expand-lg topnav-menu py-1">
                <div class="collapse navbar-collapse justify-content-between">
                    <el-menu class="navbar-nav w-100 custom" :unique-opened="true" menu-trigger="hover" mode="horizontal" background-color="transparent">
                        <el-menu-item index="/">
                            <el-image v-on:click="push('/')" :src="`/assets/imgs/logo-${state.theme}.png`" style="width: 100px;" class="d-flex flex-center"></el-image>
                        </el-menu-item>
                        <el-sub-menu v-for="(item, index) in state.menu" :key="index" :index="index.toString()" show-timeout="50" hide-timeout="50">
                            <template #title>
                                <span class="d-flex align-items-center">
                                    <i v-html="item.icon" style="margin-top: -2px" class="nav-icon"></i>
                                    <span class="ms-1">{{ item.label }}</span>
                                </span>
                            </template>
                            <el-menu-item v-for="(val, key) in item.children" :key="key" :index="key.toString()" v-on:click="val.fn()">
                                <i-svg :name="val.icon" :size="val.size" class="me-1"></i-svg>
                                {{ val.label }}
                            </el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                    <el-menu :unique-opened="true" mode="horizontal" class="navbar-nav d-flex align-items-center justify-content-end w-100" background-color="transparent">
                        <el-menu-item index="1">
                            <upgrade-system></upgrade-system>
                        </el-menu-item>
                        <el-sub-menu show-timeout="50" hide-timeout="50" index="login-user" class="icon-none">
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
                                    <small>{{store.comm.getLogin.user?.email}}</small>
                                </div>
                                <el-avatar :src="store.comm.getLogin.user?.avatar" shape="square" size="medium"></el-avatar>
                            </template>
                            <el-menu-item v-on:click="method.push({ path: '/admin' })" index="/admin">
                                <i-svg name="console" size="16px" class="me-1"></i-svg>
                                控制台
                            </el-menu-item>
                            <el-menu-item v-on:click="method.push({ path: '/admin/account/home' })" index="/admin/account/home">
                                <i-svg name="personal" size="15px" class="me-1"></i-svg>
                                个人中心
                            </el-menu-item>
                            <el-menu-item>
                                <i-svg name="logout" size="16px" class="me-1"></i-svg>
                                <span v-on:click="store.comm.logout('/')" class="w-100">退出登录</span>
                            </el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </div>
            </nav>
            <nav class="d-lg-none d-black">
                <div class="d-flex justify-content-between">
                    <span v-on:click="state.drawer.show = true" class="wh-24px d-block ms-2">
                        <i-svg name="side" size="22px" color="rgb(var(--assist-color))"></i-svg>
                    </span>
                    <small class="font-14">{{ store.comm.nav.title }}</small>
                     <span v-if="!store.comm.getLogin.finish" class="mx-2">
                        <i-svg name="user" size="26px" color="rgb(var(--assist-color))"></i-svg>
                    </span>
                    <div v-else v-on:click="push({ path: '/admin' })" class="d-flex align-items-center justify-content-center" style="margin-top: -8px">
                        <span class="d-block wh-30px">
                            <upgrade-system></upgrade-system>
                        </span>
                        <el-avatar :src="store.comm.getLogin.user?.avatar" :size="26" class="mx-2 mirror-scan"></el-avatar>
                    </div>
                </div>
            </nav>
        </div>
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
            <p class="fw-medium font-14 d-flex align-items-center mb-0">
                <span class="me-1 w-2px h-16px bg-info radius-4"></span>
                导航菜单
            </p>
            <el-menu class="nav-bg my-1 custom" unique-opened>
                <el-sub-menu v-for="(item, index) in state.menu" :key="index" :index="item.name.toString()" show-timeout="50" hide-timeout="50">
                    <template #title>
                        <span class="d-flex align-items-center">
                            <i v-html="item.icon" style="margin-top: -2px;" class="nav-icon"></i>
                            <span class="ms-1" :style="(index === 1 ? 'margin-left: 1px !important' : '')">
                                {{ item.label }}
                            </span>
                        </span>
                    </template>
                    <el-menu-item v-for="(val, key) in item.children" :key="key" :index="val.path.toString()" v-on:click="method.fn(val.fn())">
                        <span class="font-14 fw-medium">{{ val.label }}</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </template>
        <template #footer>
            <span class="flex-center">
                <span v-on:click="method.push({ path: '/admin' })" class="flex-center mx-1">
                    <i-svg color="rgb(var(--assist-color))" name="console" size="18px" class="me-1"></i-svg>
                </span>
                <span v-on:click="method.push({ path: '/admin/account/home' })" class="flex-center mx-1">
                    <i-svg color="rgb(var(--assist-color))" name="personal" size="18px" class="me-1"></i-svg>
                </span>
                <span v-on:click="store.comm.logout('/')" class="flex-center mx-1">
                    <i-svg color="rgb(var(--assist-color))" name="logout" size="17px" class="me-1"></i-svg>
                </span>
            </span>
        </template>
  </el-drawer>
</template>

<script setup>
import utils from '{src}/utils/utils'
import { push } from '{src}/utils/route'
import { list as MenuList } from '{src}/utils/menu'
import UpgradeSystem from '{src}/comps/upgrade/system.vue'
import { useCommStore } from '{src}/store/comm'

const { ctx, proxy } = getCurrentInstance()
const router = useRouter()
const store  = {
    comm: useCommStore(),
}
const state  = reactive({
    theme: 'white',
    drawer: {
        show: false,
        menu: true,
    },
    menu: [],
})

onMounted(async () => {
    state.menu = await MenuList()
})

nextTick(async () => {
    await method.getTheme()
})

const method = {
    async getTheme() {
        let theme = document.querySelector('body').getAttribute('inis-theme')
        if (!utils.is.empty(theme)) {
            if (theme.indexOf('white') !== -1) state.theme = 'white'
            else state.theme = 'dark'
        }
    },
    fn: fn => {
        state.drawer.show = false
        fn()
    },
    push: params => {
        state.drawer.show = false
        push(params)
    },
    // 是否为空
    empty: value => utils.is.empty(value),
    router: (params = {}) => router.push(params),
}
</script>