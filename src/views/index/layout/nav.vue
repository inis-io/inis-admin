<template>
    <div class="topnav">
        <div class="container-fluid user-select-none">
            <nav class="navbar navbar-dark navbar-expand-lg topnav-menu py-1">
                <div class="collapse navbar-collapse justify-content-between">
                    <el-menu class="navbar-nav w-100" :router="false" :unique-opened="true" mode="horizontal" background-color="transparent">
                        <el-menu-item index="/">
                            <el-image src="/assets/images/logo.png" style="width: 100px;" class="d-flex flex-center"></el-image>
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
                    <el-menu class="navbar-nav d-flex align-items-center justify-content-end w-100" :router="true" :unique-opened="true" mode="horizontal" background-color="transparent">
                        <template v-if="state.login.finish">
                            <el-sub-menu index="login-user" class="icon-none">
                                <template #title>
                                    <div class="d-flex flex-column align-items-end user-select-text me-2">
                                        <strong class="font-14">{{state.user?.nickname}}</strong>
                                        <small>{{state.user?.email}}</small>
                                    </div>
                                    <el-avatar :src="state.user?.avatar + (state.user?.avatar.includes('?') ? '&' : '?') + 'size=40x40'" class="me-1" shape="square" size="medium"></el-avatar>
                                </template>
                                <el-menu-item v-on:click="push('/admin')">
                                    <i-svg name="console" size="16px" class="me-1"></i-svg>
                                    控制台
                                </el-menu-item>
                                <el-menu-item route="/admin/personal">
                                    <i-svg name="personal" size="16px" class="me-1"></i-svg>
                                    个人中心
                                </el-menu-item>
                                <el-menu-item v-on:click="method.logout()">
                                    <i-svg name="logout" size="16px" class="me-1"></i-svg>
                                    <strong class="w-100">退出登录</strong>
                                </el-menu-item>
                            </el-sub-menu>
                        </template>
                        <template v-else>
                            <el-menu-item>
                                <strong class="font-12">注册</strong>
                            </el-menu-item>
                            <el-menu-item>
                                <strong v-on:click="state.modal.show()" class="font-12">登录</strong>
                            </el-menu-item>
                        </template>
                    </el-menu>
                </div>
            </nav>
            <nav class="d-lg-none d-black">
                <div class="d-flex justify-content-between">
                    <span>
                        <span v-on:click="state.drawer = true" class="mx-2">
                            <i-svg name="menu" size="24px"></i-svg>
                        </span>
                    </span>
                    <span>
                        <a v-if="!state.login.finish" data-bs-toggle="modal" data-bs-target="#fill-item-modal" href="javascript:" class="mx-2">
                            <i-svg name="user-white" size="26px"></i-svg>
                        </a>
                        <a v-else href="/admin">
                            <el-avatar :src="state.user?.avatar" :size="26" class="mx-2"></el-avatar>
                        </a>
                    </span>
                </div>
            </nav>
        </div>
    </div>

    <teleport to="body">
        <div ref="login-modal" id="fill-item-modal" class="modal fade dark" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog mt-5">
                <div class="modal-content modal-filled opacity-8 position-relative">
                    <i-svg name="close" size="20px" color="#ccc" class="modal-close customize" data-bs-dismiss="modal"></i-svg>
                    <div class="modal-header d-flex justify-content-center box-shadow py-1">
                        <h4 class="modal-title">
                            <img v-if="state.theme === 'dark'" src="/assets/images/logo.png" height="52">
                            <img v-else src="/assets/images/logo.png" height="52">
                        </h4>
                    </div>
                    <div class="modal-body">
                        <ul class="nav nav-tabs nav-justified nav-bordered mb-3">
                            <li class="nav-item">
                                <a v-on:click="state.login.type = 'social-login'" href="#nav-login-social" data-bs-toggle="tab" aria-expanded="false" class="nav-link active">
                                    <span class="text-white">验证码登录</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a v-on:click="state.login.type = 'login'" href="#nav-login" data-bs-toggle="tab" aria-expanded="true" class="nav-link">
                                    <span class="text-white">传统登录</span>
                                </a>
                            </li>
                        </ul>

                        <div class="tab-content w-80 mt-5 m-auto">
                            <div class="tab-pane show active" id="nav-login-social">
                                <div class="row mb-3">
                                    <label class="col-3 col-form-label">账户：</label>
                                    <div class="col-9">
                                        <input v-model="state.login.account" type="text" class="form-control customize text-white" placeholder="邮箱">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label class="col-3 col-form-label">验证码：</label>
                                    <div class="col-9">
                                        <div class="input-group">
                                            <input v-model="state.login.code" v-on:keyup.enter="method.login()" type="text" autocomplete="new-password" class="form-control customize text-white" placeholder="请输入验证码">
                                            <div class="input-group-append ms-2">
                                                <button v-on:click="get.code()" ref="get-code" class="btn btn-outline-light d-flex align-items-center text-white" type="button" style="height: 28px;">
                                                    获取
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane" id="nav-login">
                                <div class="row mb-3">
                                    <label class="col-3 col-form-label">帐号：</label>
                                    <div class="col-9">
                                        <input v-model="state.login.account" type="text" class="form-control customize text-white" placeholder="帐号 | 邮箱 | 手机号">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label class="col-3 col-form-label">密码：</label>
                                    <div class="col-9 d-flex">
                                        <input v-model="state.login.password" v-on:keyup.enter="method.login()" type="password" autocomplete="new-password" class="form-control customize text-white" placeholder="请输入密码">
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center">
                                <router-link to="reset" class="text-light">忘记密码</router-link>
                                <span class="mx-2">|</span>
                                <router-link to="register" class="text-light">注册帐号</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button ref="login-btn" type="button" class="btn btn-outline-light d-flex align-items-center px-3">
                            <div v-if="state.login.loading" class="spinner-border text-light wh-15px me-2" role="status"></div>
                            <span v-on:click="method.login()" class="text-white">
                                {{state.login.loading ? '登录中 ...' : '登  录'}}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>

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

import { Modal } from 'bootstrap'
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import { push } from '{src}/utils/route'
import { onMounted, getCurrentInstance, reactive, watch, nextTick } from 'vue'
import { useRouter } from "vue-router"

const { ctx, proxy } = getCurrentInstance()

const router   = useRouter()
const state = reactive({
    theme: 'dark',
    login: {
        finish : false,         // 登录完成
        loading: false,         // 是否加载中
        type: 'social-login',    // 登录类型
        account: null,          // 邮箱 | 账号
        password: null,         // 密码
        code: null,             // 验证码
    },
    user: utils.get.session('USERINFO'),
    drawer: false,
    modal: null,
    timer: {
        code: null
    }
})

onMounted(() => {
    method.checkToken()
    state.modal = new Modal(proxy.$refs['login-modal'])
    state.theme = document.querySelector('body').getAttribute('inis-theme')
})

const get = {
    // 获取验证码
    async code() {
        
        if (utils.is.empty(state.login.account))  return notyf.warn('帐号不能为空哟？')
        if (!utils.is.email(state.login.account) && !utils.is.phone(state.login.account)) return notyf.warn('格式不对哟！')
        state.login.code = null
        await method.login()

        let time     = 60
        state.timer.code = setInterval(() => {
            
            time--

            if (time > 0) {
                ctx.$refs['get-code'].innerText = `获取 ${time}s`
                ctx.$refs['get-code'].disabled = true
            } else {
                // 当减到0时赋值为60
                time = 60
                ctx.$refs['get-code'].innerText = '获取'
                // 清除定时器
                clearInterval(state.timer.code)
                ctx.$refs['get-code'].disabled = false
            }
            
        }, 1000)
    }
}

const method = {
    // 登录
    async login() {

        state.login.loading = true

        const params = state.login.type === 'social-login' ? {
            code  : state.login.code,
            social: state.login.account
        } : {
            account : state.login.account,
            password: state.login.password
        }

        try {

            const { data, code, msg } = await axios.post('/api/comm/' + state.login.type, params)
            
            if (code === 200) {
                notyf.success(msg)
                utils.set.session('USERINFO' , data.user)
                utils.set.cookie(globalThis?.inis?.token_name || 'INIS_LOGIN_TOKEN', data.token, 7 * 24 * 60 * 60   )
                state.user = data.user
                state.login.finish = true
                state.modal.hide()
                return
            }
            if (code === 201) return notyf.success(msg)

            setTimeout(() => {
                notyf.warn(msg)
                // 重置计时器
                ctx.$refs['get-code'].innerText = '获取'
                ctx.$refs['get-code'].disabled = false
                clearInterval(state.timer.code)
            }, 1000)

        } catch (error) {

            notyf.error(error)
        }

        state.login.loading = false
    },
    // 退出登录
    async logout() {
        
        const { data, code, msg } = await axios.del('/api/comm/logout')
        
        if (code !== 200) return notyf.error(msg)
        
        notyf.success(msg)
        state.login.finish = false
        utils.clear.session('USERINFO')
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
    router: (params = {}) => router.push(params),
}

watch(() => state.login.loading, (val) => {
    ctx.$refs['login-btn'].disabled = val;
})
watch(() => state.login.code, (val) => {
    // 去除空字符串
    state.login.code = val.replace(/\s+/g, '')
})
</script>