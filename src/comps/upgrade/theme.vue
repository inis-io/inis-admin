<template>
</template>

<script setup>
import cache from '{src}/utils/cache'
import utils from '{src}/utils/utils'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    struct: {},
    user: cache.get('user-info') || {}
})

onMounted(async () => {
    // 只有超级管理员才有权限
    if (state.user?.result?.auth?.all === true) {
        await method.check()
    }
})

const method = {
    // 检查更新
    check: async () => {

        const cacheName = 'theme-update'

        if (cache.has(cacheName)) return
        // 缓存10分钟 - 防止频繁请求
        else cache.set(cacheName, true, 10)

        const { code, data } = await axios.get('/inis/theme-version/next', {
            theme_key: 'inis', progress: 'pro'
        })

        if (code !== 200) return

        // 本地版本与最新版本对比
        if (!utils.compare.version(data?.version, inis?.version)) return

        state.struct      = data

        // 自动升级
        await method.upgrade()
    },
    // 升级
    upgrade: async () => {
        await axios.post('/api/upgrade/theme', {
            id: state.struct?.id
        })
    },
}
</script>