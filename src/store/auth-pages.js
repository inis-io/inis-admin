import { defineStore } from 'pinia'
import cache from '{src}/utils/cache'
import axios from '{src}/utils/request'

// 规则扁平化
const flat = (state = {}) => {

    const cacheName = 'auth-pages-flat'

    if (cache.has(cacheName)) return (state.flat = cache.get(cacheName))

    axios.get('/api/auth-pages/column', {
        field: 'name,path,icon,svg,size,hash'
    }).then(({ code, data }) => {

        if (code !== 200) return

        state.flat = data

        // 缓存数据
        cache.set(cacheName, data, inis.cache)
    })

    return state.flat
}

export const useAuthPagesStore = defineStore('auth-pages', {
    state: () => ({
        flat: [],       // 规则扁平化
    }),
    getters: {
        // 获取规则扁平化
        getFlat(state = {}) {
            return flat(state)
        }
    },
})