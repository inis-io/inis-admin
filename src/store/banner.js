import { defineStore } from 'pinia'
import cache from '{src}/utils/cache'
import axios from '{src}/utils/request'

// 活期轮播
const current = (state = {}) => {

    const cacheName = 'banner-current'

    if (cache.has(cacheName)) return (state.tree = cache.get(cacheName))

    const time = Math.round(new Date() / 1000)

    axios.get('/api/banner/column', {
        // 仅获取当前时间段内的轮播图
        where: [
            ['start_time','<=', time],
            ['end_time','>=', time],
        ],
    }).then(({ code, data }) => {

        if (code !== 200) return

        state.current = data

        // 缓存数据
        cache.set(cacheName, data, inis.cache)
    })
}

export const useBannerStore = defineStore('banner', {
    state: () => ({
        current: {},    // 活期轮播 - 即有效周期内的轮播
    }),
    getters: {
        getCurrent(state = {}) {
            return current(state)
        },
    },
    actions: {
        async setCurrent() {

            const cacheName = 'banner-current'

            if (cache.has(cacheName)) {
                this.current = cache.get(cacheName)
                return { code: 200, msg: 'cache', data: this.current }
            }

            const time = Math.round(new Date() / 1000)

            const { code, msg, data } = await axios.get('/api/banner/column', {
                // 仅获取当前时间段内的轮播图
                where: [
                    ['start_time','<=', time],
                    ['end_time','>=', time],
                ],
            })

            if (code !== 200) return

            this.current = data

            // 缓存数据
            cache.set(cacheName, data, inis.cache)

            return { code, msg, data }
        },
    }
})