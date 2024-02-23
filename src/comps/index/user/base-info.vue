<template>
    <div class="card mb-0">
        <div class="card-body">
            <div v-if="!store.comm.getLogin.finish" class="d-flex justify-content-between">
                <div class="d-flex align-items-center">
                    <i-svg name="avatar" size="40px"></i-svg>
                    <div class="d-flex flex-column ms-2">
                        <span class="font-18 text-dark">您好！</span>
                        <small class="text-muted">登录做任务领算粒</small>
                    </div>
                </div>
                <el-button v-on:click="method.login.show" type="primary" size="small">签到 +5</el-button>
            </div>
            <div v-else class="d-flex justify-content-between">
                <div class="d-flex align-items-center">
                    <div>
                        <el-avatar :src="store.comm.getLogin.user.avatar" fit="cover" size="large" class="avatar-shadow mirror-scan"></el-avatar>
                    </div>
                    <div class="d-flex flex-column ms-2">
                        <span class="font-18 text-dark d-flex align-items-center">
                            <span>{{ store.comm.getLogin.user.nickname }}</span>
                            <small class="badge-outline-info rounded-pill item right px-2 font-12 radius-10 d-flex align-items-center ms-2">
                                <i-svg v-if="!utils.is.empty(store.comm.getLogin.user?.gender)" :name="store.comm.getLogin.user?.gender" size="18px" class="me-1"></i-svg>
                                <span class="fw-bold">Lv.{{ store.comm.getLogin.user.result.level.current.value }}</span>
                            </small>
                        </span>
                        <small class="text-muted">{{ store.comm.getLogin.user.description || '这个人很懒，什么都没留下！' }}</small>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between mt-4 px-3">
                <div v-on:click="method.compute()" class="d-flex flex-column align-items-center pointer">
                    <i-svg name="integral" size="30px" color="rgb(var(--assist-color))"></i-svg>
                    <span class="mt-2">个人中心</span>
                </div>
                 <div class="d-flex flex-column align-items-center">
                    <i-svg name="work" size="30px" color="rgb(var(--assist-color))"></i-svg>
                    <span style="margin-top: 0.74rem!important;">我的喜欢</span>
                </div>
                 <div v-on:click="method.signIn()" class="d-flex flex-column align-items-center pointer">
                    <i-svg name="sign-in" size="33px" color="rgb(var(--assist-color))"></i-svg>
                    <span style="margin-top: 0.46rem!important;">每日签到</span>
                </div>
            </div>
            <div class="h-1px bg-light my-3"></div>
            <div class="d-flex justify-content-around px-3 font-16 position-relative">
                <div>BUG反馈</div>
                <span class="line position-absolute"></span>
                <div>我的建议</div>
            </div>
        </div>
    </div>

    <user-sign-in v-model="state.item.signIn"></user-sign-in>
</template>

<script setup>
import utils from '{src}/utils/utils'
import { push } from '{src}/utils/route'
import { useCommStore } from '{src}/store/comm'
import UserSignIn from '{src}/comps/index/user/sign-in.vue'
import ILevel from '{src}/comps/custom/i-level.vue'

const { ctx, proxy } = getCurrentInstance()

const router = useRouter()
const store  = {
    comm: useCommStore()
}
const state = reactive({
    item: {
        signIn: false,
    },
})

const method = {
    // 登录
    login: {
        // 显示登录框
        show: () => {
            store.comm.switchAuth('login', true)
        },
    },
    // 签到
    signIn: () => {
        // 如果还没有登录 - 则显示登录框
        if (!store.comm.getLogin.finish) return (store.comm.switchAuth('login', true))
        state.item.signIn = true
    },
    // 算粒
    compute: () => {
        // 如果还没有登录 - 则显示登录框
        if (!store.comm.getLogin.finish) return (store.comm.switchAuth('login', true))
        push('/admin/account/home')
    }
}
</script>

<style lang="css" scoped>
.line.position-absolute{
    height: 38px;
    width: 1px;
    background: rgba(var(--bs-light-rgb, 0.1));
    bottom: -4px;
}
</style>