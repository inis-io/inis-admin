<template>
    <div id="account-home" class="container-fluid container-box px-2">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <el-avatar :src="state.user?.avatar" :size="70" fit="cover" size="large" class="avatar-shadow mirror-scan"></el-avatar>
                            </div>
                            <div class="col">
                                <span class="mb-0 d-flex align-items-center">
                                    <span class="font-18">{{ state.user?.nickname }}</span>
                                    <small class="badge-outline-info rounded-pill item right px-2 font-12 radius-10 d-flex align-items-center ms-2">
                                        <i-svg v-if="!utils.is.empty(store.comm.getLogin.user?.gender)" :name="store.comm.getLogin.user?.gender" size="18px" class="me-1"></i-svg>
                                        <span class="fw-bold">Lv.{{ store.comm.getLogin.user.result.level.current.value }}</span>
                                    </small>
                                </span>
                                <el-progress :percentage="((state.user?.exp / state.user?.result?.level?.next?.exp || 1) * 100).toFixed(2)" color="rgb(var(--assist-color))" style="width: 200px" class="mb-1"></el-progress>
                                <p class="mb-1">{{ state.user?.description }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 d-flex justify-content-end">
                        <el-button v-on:click="method.edit.show()" type="primary" class="shadow">修改资料</el-button>
                    </div>
                </div>
            </div>
        </div>
        <el-tabs v-model="state.item.tabs" class="overall tag">

            <el-tab-pane name="info">
                <template #label>
                    <span class="fw-bolder font-12">基本信息</span>
                </template>
                <div class="card mt-3">
                    <div class="card-body">
                        <i-row-text title="昵称" :value="state.user?.nickname"></i-row-text>
                        <i-row-text title="头衔" :value="state.user?.title"></i-row-text>
                        <i-row-text title="性别">
                            <template #value>
                                <span v-if="utils.is.empty(state.user?.gender)">保密</span>
                                <span v-else>
                                    {{ state.user?.gender === 'boy' ? '男' : '女' }}
                                </span>
                            </template>
                        </i-row-text>
                        <i-row-text title="简介" :value="state.user?.description"></i-row-text>
                        <i-row-text title="注册" :value="utils.time.nature(state.user?.create_time)"></i-row-text>
                    </div>
                </div>
            </el-tab-pane>

            <el-tab-pane name="account">
                <template #label>
                    <span class="fw-bolder font-12">账号设置</span>
                </template>
                <div class="card mt-3">
                    <div class="card-body">
                        <user-edit-account  v-model="state.item.edit" v-on:finish="method.edit.finish" v-on:edit="method.edit.click"></user-edit-account>
                        <user-edit-email    v-model="state.item.edit" v-on:finish="method.edit.finish" v-on:edit="method.edit.click"></user-edit-email>
                        <user-edit-phone    v-model="state.item.edit" v-on:finish="method.edit.finish" v-on:edit="method.edit.click"></user-edit-phone>
                        <user-edit-password v-model="state.item.edit" v-on:finish="method.edit.finish" v-on:edit="method.edit.click"></user-edit-password>
                    </div>
                </div>
            </el-tab-pane>

            <el-tab-pane name="collect" v-if="false">
                <template #label>
                    <span class="fw-bolder font-12">我的收藏</span>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>

    <user-edit-info ref="info" v-on:finish="method.edit.finish"></user-edit-info>
    <mouse-menu ref="mouse" v-bind="state.item.menu"></mouse-menu>
</template>

<script setup>
import cache from '{src}/utils/cache'
import utils from '{src}/utils/utils'
import MouseMenu from '@howdyjs/mouse-menu'
import { useCommStore } from '{src}/store/comm'
import { useWalletStore } from '{src}/store/wallet'
import iRowText from '{src}/comps/custom/i-row-text.vue'
import UserEditInfo from '{src}/comps/admin/user/edit-info.vue'
import UserEditAccount from '{src}/comps/admin/user/edit-account.vue'
import UserEditEmail from '{src}/comps/admin/user/edit-email.vue'
import UserEditPhone from '{src}/comps/admin/user/edit-phone.vue'
import UserEditPassword from '{src}/comps/admin/user/edit-password.vue'
import { list as MenuList, config as MenuConfig } from '{src}/utils/menu'

const { ctx, proxy } = getCurrentInstance()
const store  = {
    comm: useCommStore(),
    wallet: useWalletStore(),
}
const state  = reactive({
    user: cache.get('user-info') || {},
    item: {
        tabs: 'info',
        edit: null,
        menu: {
            ...MenuConfig,
            menuList: [{
                label: '刷新',
                icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                    <path fill="rgb(var(--menu-icon-color))" d="M608 928c-229.76 0-416-186.24-416-416h-0.128c0-0.416 0.128-0.768 0.128-1.184a95.904 95.904 0 1 0-191.872-1.184c0 0.384-0.128 0.768-0.128 1.184l0.032 0.384c0 0.288 0.096 0.544 0.096 0.8H0c0 282.784 229.216 512 512 512 282.016 0 510.592-227.968 511.872-509.632C1022.592 743.072 836.928 928 608 928z"></path>
                    <path fill="rgb(var(--menu-icon-color))" d="M1023.872 512H1024c0-282.784-229.216-512-512-512C230.016 0 1.408 227.968 0.128 509.632 1.408 280.96 187.072 96 416 96c229.76 0 416 186.24 416 416h0.128c0 0.416-0.128 0.768-0.128 1.184a96 96 0 0 0 96 96 95.872 95.872 0 0 0 95.872-94.816c0-0.416 0.128-0.768 0.128-1.184l-0.032-0.384c0-0.288-0.096-0.544-0.096-0.8z"></path>
                </svg>`,
                fn: () => method.refresh()
            }],
        },
    },
    wallet: {
        show: false,
        struct: {
            money: 0,
            compute: 0,
        }
    }
})

// 方法
const method = {
    // 修改资料
    edit: {
        show: () => proxy.$refs['info'].show(),
        finish: params => {
            if (utils.is.empty(params)) return
            state.user = params
        },
        click: params => (state.item.edit = params),
    },
}

onMounted(async () => {
    // 追加鼠标右键菜单
    state.item.menu.menuList.push(...[{ line: true }, ...await MenuList()])
})

// 监听 html 下的鼠标右键事件
document.addEventListener('contextmenu', (event) => {
    // 阻止默认事件
    event.preventDefault()
    // 判断点击在不在 #tabs-area 区域内，在不显示右键菜单
    if (!event?.target?.closest('#tabs-area')) proxy.$refs['mouse']?.show(event.x, event.y)
})
</script>