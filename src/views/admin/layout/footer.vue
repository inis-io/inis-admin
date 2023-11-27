<template>
    <footer id="footer" class="text-dark user-select-none">
        <span>Copyright © {{ state.year.start }} ~ {{ state.year.end }}</span>
        <span v-if="state.site.show"> &
            <a :href="state.site.struct?.copy?.link" target="_blank" class="text-dark">
                {{ state.site.struct?.copy?.code || '备案码' }}
            </a>
        </span>
        <span v-if="!utils.is.empty(state.site.struct?.police?.code)"> &
            <a :href="state.site.struct?.police?.link" target="_blank" class="text-dark">
                {{ state.site.struct?.police?.code || '公安备案' }}
            </a>
        </span>
        <span> & <a href="https://inis.cc" target="_blank" class="text-dark">inis {{ state.version.system }}</a></span>
        <span> & theme {{ state.version.theme }}</span>
    </footer>
</template>

<script setup>
import utils from '{src}/utils/utils'
import cache from '{src}/utils/cache'
import axios from '{src}/utils/request'

const state = reactive({
    year: {
        start: null,
        end  : new Date().getFullYear()
    },
    site: {
        show: false,
        struct: {
            copy: {}
        }
    },
    version: {
        theme: inis.version,
        system: '3.0.0',
    },
})

const method = {
    // 获取站点信息
    site: async () => {

        // 缓存名称
        const cacheName = 'site-info'

        if (cache.has(cacheName)) {
            state.site.struct = cache.get(cacheName)
            return
        }

        // 缓存不存在
        const { code, data } = await axios.get('/api/config/one', {
            key: 'SITE_INFO',
        })

        if (code !== 200) return

        state.site.struct = data.json
        // 缓存10分钟 - 防止频繁请求
        cache.set(cacheName, data.json, inis.cache)
    },
    // 获取系统版本
    version: async () => {

        // 缓存名称
        const cacheName = 'system-version-local'

        if (cache.has(cacheName)) {
            state.version.system = cache.get(cacheName)
            return
        }

        // 缓存不存在
        const { code, data } = await axios.get('/dev/info/version')

        if (code !== 200) return

        state.version.system = data?.inis
        // 缓存10分钟 - 防止频繁请求
        cache.set(cacheName, data?.inis, inis.cache)
    },
    // 给一个时间戳，返回年份
    year: (timestamp = Math.round(new Date() / 1000)) => {

        // 将时间戳转换为毫秒数
        const milliseconds = parseInt(timestamp) * 1000
        // 创建一个新的Date对象，并传入毫秒数
        const date = new Date(milliseconds)

        // 使用Date对象的getFullYear方法获取年份
        return date.getFullYear()
    }
}

onMounted(async () => {
    await method.site()
    await method.version()
})

watch(() => state.site.struct, (value) => {
    state.site.show = !utils.is.empty(value)
})

watch(() => state.site.struct, (value) => {
    if (!utils.is.empty(value?.date)) state.year.start = method.year(value?.date)
})
</script>