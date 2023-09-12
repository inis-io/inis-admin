import {defineStore} from 'pinia'
import utils from '{src}/utils/utils'
import cache from '{src}/utils/cache'
import axios from '{src}/utils/request'

// 获取指定配置
const one = (state = {}, key = '') => {

    if (utils.is.empty(key)) return {}

    axios.get('/api/config/one', { key }).then(({ code, data }) => {

        if (code !== 200) return state[key] = {}

        // 缓存数据
        cache.set(`config[${key}]`, data, inis.cache)

        state[key] = data
    })

    return state[key]
}

// 消除异步污染
const infect = (cacheName, promise) => {

    let cacheData = cache.get(cacheName) || {
        status: 'wait', value: null
    }

    // 成功 - 读取缓存
    if (cacheData?.status === 'success') {
        return cacheData.value
    }
    // 失败 - 抛出异常
    else if (cacheData?.status === 'error') {
        throw cacheData.value
    }

    // 发送真实请求 - 抛出错误
    throw promise.then(({ code, data }) => {

        if (code !== 200) {
            cacheData = { status: 'error', value: null }
            // 缓存数据
            cache.set(cacheName, cacheData, inis.cache)
            return cacheData
        }

        cacheData = { status: 'success', value: data }

        // 缓存数据
        cache.set(cacheName, cacheData, inis.cache)

    }).catch(error => {

        cacheData = { status: 'error', value: error }

        cache.set(cacheName, cacheData, inis.cache)
    })
}

export const useConfigStore = defineStore('config', {
    state: () => ({
        ALLOW_REGISTER: cache.get('config[ALLOW_REGISTER]'),
    }),
    getters: {
        getAllowRegister(state = {}) {

            const cacheName = 'config[ALLOW_REGISTER]'

            if (cache.has(cacheName)) return (state.ALLOW_REGISTER = cache.get(cacheName))

            return one(this, 'ALLOW_REGISTER')
        }
    },
    actions: {
        // 获取指定配置
        test() {
            const promise   = axios.get('/api/config/one', { key: 'ALLOW_REGISTER' })
            return infect('config[TEST]', promise)
        },
    },
})

export const run = (fn) => {
    try {
        fn()
    } catch (err) {
        if (err instanceof Promise) {
            err.then(fn, fn)
        }
    }
}