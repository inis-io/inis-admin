<template>
    <div class="container-fluid container-box">
        <div v-if="state.close" class="card card-body">
            <div class="d-flex justify-content-center align-items-center">
                <i-svg name="!" size="25px" color="var(--el-color-success)"></i-svg>
                <strong class="font-16 ms-1">登录成功！</strong>
            </div>
            <div class="d-flex justify-content-center mt-2">
                <strong class="font-14">{{ state.second }}s 后自动关闭当前窗口！</strong>
            </div>
        </div>
    </div>
</template>

<script setup>
import notyf from '{src}/utils/notyf'
import cache from '{src}/utils/cache'
import utils from '{src}/utils/utils'
import axios from '{src}/utils/request'
import { useCommStore } from '{src}/store/comm'

const { proxy } = getCurrentInstance()
const route = useRoute()
const store = {
    comm: useCommStore(),
}
const state = reactive({
    second: 5,
    close: false,
    timer: null,
})

const method= {
    check: async () => {

        const { code, msg, data } = await axios.post('/api/comm/check-token', {}, {
            headers: {
                Authorization: route.params.token
            }
        })

        if (code !== 200) return notyf.error(msg)

        cache.set('user-info', data.user, 10)
        utils.set.cookie(globalThis?.inis?.token_name || 'INIS_LOGIN_TOKEN', route.params.token, 7 * 24 * 60 * 60)
        // 更新仓库状态
        store.comm.login.finish = true
        store.comm.login.user   = data.user

        // 关闭当前窗口
        const close = () => {
            state.close = true
            state.timer = setInterval(() => {
                state.second--
                if (state.second === 0) {
                    state.close = false
                    clearInterval(state.timer)
                    window.close()
                }
            }, 1000)
        }

        close()
    }
}

onMounted(() => {
    method.check()
})
</script>