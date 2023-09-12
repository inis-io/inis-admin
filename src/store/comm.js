import { defineStore } from 'pinia'
import cache from '{src}/utils/cache'
import notyf from '{src}/utils/notyf'
import utils from '{src}/utils/utils'
import axios from '{src}/utils/request'
import { push } from '{src}/utils/route'

// 校验token
const checkToken = (state = {}) => {

    const cacheName = 'user-info'
    // 缓存中存在用户信息
    if (cache.has(cacheName)) return state.login.finish = true

    axios.post('/api/comm/check-token').then(({ code, msg, data })=> {

        if (code === 412) return
        if (code === 401) return logout(state)
        if (code !== 200) return notyf.error(msg)

        state.login.user   = data.user
        state.login.finish = true
        cache.set(cacheName, data.user, 10)
    })
}

// 登出
const logout = (state = {}, path = null) => {

    // 清除登录信息
    state.login.user   = {}
    state.login.finish = false
    cache.del('user-info')
    utils.clear.cookie(globalThis?.inis?.token_name || 'INIS_LOGIN_TOKEN')

    axios.del('/api/comm/logout').then(res => res)

    // 返回首页
    if (!utils.is.empty(path)) setTimeout(() => {
        push(path)
    }, 300)
}

export const useCommStore = defineStore('comm', {
    state: () => ({
        // 登录注册重置密码的状态
        auth: {
            login   : false,
            reset   : false,
            register: false,
        },
        login: {
            // 登录状态 - 是否登录完成
            finish: false,
            // 当前登录的用户信息
            user  : cache.get('user-info'),
        },
        progress: false,
        nav: {
            title: ''
        }
    }),
    // methods
    actions: {
        // 切换登录注册重置密码的状态
        switchAuth(name = 'login', bool = true) {
            for (const key in this.auth) {
                this.auth[key] = key === name ? bool : false
            }
        },
        // 登出
        logout(path = null) {
            logout(this, path)
        },
    },
    // computed
    getters: {
        // 获取登录信息
        getLogin: (state = {}) => {
            // 校验token
            checkToken(state)
            // 返回登录信息
            return state.login
        }
    },
})