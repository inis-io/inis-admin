<template>
    <div class="container-fluid container-box">
        <div class="row d-none d-lg-flex">
            <div class="col-lg-6 d-flex">
                <div class="input-group custom-search me-1">
                    <i-svg name="search" color="rgb(var(--icon-color))" size="18px"></i-svg>
                    <input class="form-control custom search mimic" autocomplete="new-password" type="text" placeholder="这是个假搜索">
                </div>
                <button v-on:click="method.refresh()" class="btn btn-auto mx-1 mimic" type="button">刷新</button>
            </div>
            <div class="col-lg-6 d-flex justify-content-end" style="z-index: -1">
                <button class="btn btn-auto h-35px mimic" disabled type="button">
                    {{ state.item.title }}
                </button>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <el-tabs v-model="state.item.tabs" id="tabs-area" class="circle">

                    <el-tab-pane name="security">
                        <template #label>
                            <span class="fw-bolder font-12">安全</span>
                        </template>
                        <div class="row">
                            <div class="col-md-4">
                                <atom-api-key ref="api-key"></atom-api-key>
                            </div>
                            <div class="col-md-4">
                                <atom-qps ref="qps"></atom-qps>
                            </div>
                            <div class="col-md-4">
                                <atom-qps-black ref="qps-black"></atom-qps-black>
                            </div>
                            <div class="col-md-4">
                                <atom-page-limit ref="page-limit"></atom-page-limit>
                            </div>
                            <div class="col-md-4">
                                <atom-jwt ref="jwt"></atom-jwt>
                            </div>
                            <div class="col-md-4">
                                <atom-allow-register ref="allow-register"></atom-allow-register>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane name="optimize">
                        <template #label>
                            <span class="fw-bolder font-12">优化</span>
                        </template>
                        <div class="row">
                            <div class="col-md-4">
                                <atom-cache-redis ref="cache-redis" v-on:refresh="method.refresh"></atom-cache-redis>
                            </div>
                            <div class="col-md-4">
                                <atom-cache-file ref="cache-file" v-on:refresh="method.refresh"></atom-cache-file>
                            </div>
                            <div class="col-md-4">
                                <atom-cache-ram ref="cache-ram" v-on:refresh="method.refresh"></atom-cache-ram>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane name="storage">
                        <template #label>
                            <span class="fw-bolder font-12">存储</span>
                        </template>
                        <div class="row">
                            <div class="col-md-4">
                                <atom-storage-local ref="storage-local" v-on:refresh="method.refresh"></atom-storage-local>
                            </div>
                            <div class="col-md-4">
                                <atom-storage-oss ref="storage-oss" v-on:refresh="method.refresh"></atom-storage-oss>
                            </div>
                            <div class="col-md-4">
                                <atom-storage-cos ref="storage-cos" v-on:refresh="method.refresh"></atom-storage-cos>
                            </div>
                            <div class="col-md-4">
                                <atom-storage-kodo ref="storage-kodo" v-on:refresh="method.refresh"></atom-storage-kodo>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane name="sms">
                        <template #label>
                            <span class="fw-bolder font-12">短信</span>
                        </template>
                        <div class="row">
                            <div class="col-md-4">
                                <atom-sms-email ref="sms-email" v-on:refresh="method.refresh"></atom-sms-email>
                            </div>
                            <div class="col-md-4">
                                <atom-sms-aliyun ref="sms-aliyun" v-on:refresh="method.refresh"></atom-sms-aliyun>
                            </div>
                            <div class="col-md-4">
                                <atom-sms-tencent ref="sms-tencent" v-on:refresh="method.refresh"></atom-sms-tencent>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane name="other">
                        <template #label>
                            <span class="fw-bolder font-12">其他</span>
                        </template>
                        <div class="row">
                            <div class="col-md-4">
                                <atom-page ref="page" v-on:refresh="method.refresh"></atom-page>
                            </div>
                            <div class="col-md-4">
                                <atom-article ref="article" v-on:refresh="method.refresh"></atom-article>
                            </div>
                            <div class="col-md-4">
                                <atom-site-info ref="site-info" v-on:refresh="method.refresh"></atom-site-info>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane name="inis">
                        <template #label>
                            <span class="fw-bolder font-12">inis</span>
                        </template>
                        <div class="row">
                            <div class="col-md-4">
                                <atom-upgrade ref="upgrade" v-on:refresh="method.refresh"></atom-upgrade>
                            </div>
                            <div class="col-md-4">
                                <device-bind ref="device-bind" v-on:refresh="method.refresh"></device-bind>
                            </div>
                        </div>
                    </el-tab-pane>

                </el-tabs>
            </div>
        </div>
    </div>

    <mouse-menu ref="mouse" v-bind="state.item.menu"></mouse-menu>
</template>

<script setup>
import MouseMenu from '@howdyjs/mouse-menu'
import { useCommStore } from '{src}/store/comm'
import { config as MenuConfig, list as MenuList } from '{src}/utils/menu'
import AtomSmsEmail from '{src}/comps/admin/atom/sms-email.vue'
import AtomSmsAliyun from '{src}/comps/admin/atom/sms-aliyun.vue'
import AtomSmsTencent from '{src}/comps/admin/atom/sms-tencent.vue'
import AtomApiKey from '{src}/comps/admin/atom/api-key.vue'
import AtomAllowRegister from '{src}/comps/admin/atom/allow-register.vue'
import AtomQps from '{src}/comps/admin/atom/qps.vue'
import AtomQpsBlack from '{src}/comps/admin/atom/qps-black.vue'
import AtomPageLimit from '{src}/comps/admin/atom/page-limit.vue'
import AtomJwt from '{src}/comps/admin/atom/jwt.vue'
import AtomCacheRedis from '{src}/comps/admin/atom/cache-redis.vue'
import AtomCacheFile from '{src}/comps/admin/atom/cache-file.vue'
import AtomCacheRam from '{src}/comps/admin/atom/cache-ram.vue'
import AtomStorageLocal from '{src}/comps/admin/atom/storage-local.vue'
import AtomStorageOss from '{src}/comps/admin/atom/storage-oss.vue'
import AtomStorageCos from '{src}/comps/admin/atom/storage-cos.vue'
import AtomStorageKodo from '{src}/comps/admin/atom/storage-kodo.vue'
import AtomPage from '{src}/comps/admin/atom/page.vue'
import AtomArticle from '{src}/comps/admin/atom/article.vue'
import AtomSiteInfo from '{src}/comps/admin/atom/site-info.vue'
import DeviceBind from '{src}/comps/inis/device/bind.vue'
import AtomUpgrade from '{src}/comps/admin/atom/upgrade.vue'

const { ctx, proxy } = getCurrentInstance()
const store  = {
    comm: useCommStore(),
}
const state  = reactive({
    item: {
        title : '系统配置',
        tabs  : 'security',
        menu  : {
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
    refresh: {
        inis    : ['device-bind','upgrade'],
        other   : ['site-info','page','article'],
        optimize: ['cache-redis','cache-file','cache-ram'],
        sms     : ['sms-email','sms-aliyun','sms-tencent'],
        storage : ['storage-local','storage-oss','storage-cos','storage-kodo'],
        security: ['api-key','qps','page-limit','jwt','allow-register','qps-black'],
    },
})

onMounted(async () => {
    // 追加鼠标右键菜单
    state.item.menu.menuList.push(...[{line: true}, ...await MenuList()])
})

// 方法
const method = {
    // 刷新
    refresh(...args) {
        // 允许刷新的参数
        let allow = [...state.refresh[state.item.tabs]]
        // 如果没有传参则刷新所有
        if (args.length === 0) args = allow
        // 如果传参则过滤不允许的参数
        else args = args.filter(item => allow.includes(item))
        // 批量刷新
        for (let item of args) proxy.$refs[item]['init']()
    },
}

// 监听 html 下的鼠标右键事件
document.addEventListener('contextmenu', (event) => {
    // 阻止默认事件
    event.preventDefault()
    // 判断点击在不在 #tabs-area 区域内，在不显示右键菜单 if (!event?.target?.closest('#tabs-area'))
    proxy.$refs['mouse']?.show(event.x, event.y)
})
</script>