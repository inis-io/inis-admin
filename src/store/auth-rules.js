import { defineStore } from 'pinia'
import cache from '{src}/utils/cache'
import utils from '{src}/utils/utils'
import axios from '{src}/utils/request'

// 规则树
const tree = (state = {}) => {

    const cacheName = 'auth-rule-tree'

    if (cache.has(cacheName)) return (state.tree = cache.get(cacheName))

    axios.get('/api/auth-rules/column', {
        field: 'id,name,method,route,hash'
    }).then(({ code, data }) => {

        if (code !== 200) return

        state.flat = JSON.parse(JSON.stringify(data))
        // 缓存数据
        cache.set('auth-rule-flat', JSON.parse(JSON.stringify(data)), inis.cache)

        // 分组数据
        let group  = []
        let titles = []

        const regex1 = /^[【|\[](.+?)[】|\]](.+)/
        // 匹配特殊字符串隔开的
        const regex2 = /(.+)[^\w\u4e00-\u9fa5\s](.+)/
        // 正则匹配
        for (let item of data) {

            let rule   = null
            let match1 = item.name.match(regex1)
            let match2 = item.name.match(regex2)

            // 外围数组标题
            let title  = ''

            if (match1) {
                rule  = match1
                title = match1[1].trim()
            }
            else if (match2) {
                rule  = match2
                title = match2[1].trim()
            }

            // 判断标题是否存在数组中
            if (utils.in.array(title, titles)) {

                group.find(item => item?.value === title)?.children.push({ id: item.id, value: parseInt(item.hash), label: rule[2].trim() })

            } else {

                titles.push(title)
                let son = { id: item.id, value: parseInt(item.hash), label: rule[2].trim() }
                group.push({ value: title, label: title, children: [son] })
            }
        }

        // 缓存数据
        cache.set(cacheName, group, inis.cache)

        state.tree = group
    })

    return state.tree
}

// 规则扁平化
const flat = (state = {}) => {

    const cacheName = 'auth-rule-flat'

    if (cache.has(cacheName)) return (state.flat = cache.get(cacheName))

    axios.get('/api/auth-rules/column', {
        field: 'id,name,method,route,hash'
    }).then(({ code, data }) => {

        if (code !== 200) return

        state.flat = data

        // 缓存数据
        cache.set(cacheName, data, inis.cache)
    })
}

export const useAuthRulesStore = defineStore('auth-rules', {
    state: () => ({
        tree: [],       // 规则树
        flat: [],       // 规则扁平化
    }),
    getters: {
        // 获取规则树
        getTree(state = {}) {
            return tree(state)
        },
        // 获取规则扁平化
        getFlat(state = {}) {
            return flat(state)
        }
    },
    actions: {
        async setFlat() {
            const cacheName = 'auth-rule-flat'

            if (cache.has(cacheName)) {
                this.flat = cache.get(cacheName)
                return { code: 200, msg: 'cache', data: this.flat }
            }

            const { code, msg, data } = await axios.get('/api/auth-rules/column', {
                field: 'id,name,method,route,hash'
            })

            if (code !== 200) return

            this.flat = data

            // 缓存数据
            cache.set(cacheName, data, inis.cache)

            return { code, msg, data }
        },
        async setTree() {

            const cacheName = 'auth-rule-tree'

            const { code, msg, data } = await this.setFlat()

            if (code !== 200) return
            // 分组数据
            let group  = []
            let titles = []

            const regex1 = /^[【|\[](.+?)[】|\]](.+)/
            // 匹配特殊字符串隔开的
            const regex2 = /(.+)[^\w\u4e00-\u9fa5\s](.+)/
            // 正则匹配
            for (let item of data) {

                let rule   = null
                let match1 = item.name.match(regex1)
                let match2 = item.name.match(regex2)

                // 外围数组标题
                let title  = ''

                if (match1) {
                    rule  = match1
                    title = match1[1].trim()
                }
                else if (match2) {
                    rule  = match2
                    title = match2[1].trim()
                }

                // 判断标题是否存在数组中
                if (utils.in.array(title, titles)) {

                    group.find(item => item?.value === title)?.children.push({ id: item.id, value: parseInt(item.hash), label: rule[2].trim() })

                } else {

                    titles.push(title)
                    let son = { id: item.id, value: parseInt(item.hash), label: rule[2].trim() }
                    group.push({ value: title, label: title, children: [son] })
                }
            }

            // 缓存数据
            cache.set(cacheName, group, inis.cache)

            this.tree = group

            return { code, msg, data: group }
        }
    }
})