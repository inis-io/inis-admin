<template>
    <footer id="footer" class="text-white user-select-none">
        <span>Copyright © 2020 - {{ state.year }}</span>
        <span> & <a href="https://inis.cc" target="_blank" class="text-white">inis {{ state.version.system }}</a></span>
        <span> & theme {{ state.version.theme }}</span>
    </footer>
</template>

<script setup>
import cache from 'lscache'
import utils from '{src}/utils/utils.js'
import axios from '{src}/utils/request.js'

const state = reactive({
    year: new Date().getFullYear(),
    version: {
        theme: inis.version,
        system: '3.0.0',
    }
})

onMounted(async () => {
    await method.version()
})

const method = {
    version: async () => {

        // 缓存名称
        const cacheName = 'system-version-local'

        if (!utils.is.empty(cache?.get(cacheName))) {
            state.version.system = cache?.get(cacheName)
            return
        }

        // 缓存不存在
        const { code, data } = await axios.get('/dev/info/version')

        if (code !== 200) return

        state.version.system = data?.inis
        // 缓存10分钟 - 防止频繁请求
        cache?.set(cacheName, data?.inis, 24 * 60)
    }
}
</script>