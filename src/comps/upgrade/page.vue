<template>

</template>

<script setup>
import { ElNotification } from 'element-plus'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    last: null,
})

onMounted(async () => {
    // 仅在生产环境下执行
    if (import.meta.env.PROD) await method.refresh()
})

const method = {
    // 刷新页面
    refresh: () => {
        setTimeout(async () => {
            const check = await method.update()
            if (check) {
                ElNotification({
                    type: 'success',
                    title: '主题更新完成！',
                    duration: 0,
                    dangerouslyUseHTMLString: true,
                    message: `<div class="d-flex">
                        <span class="me-2">刷新页面体验新功能？</span>
                        <button onclick="location.reload()" type="button" class="btn btn-outline-info btn-sm rounded-pill py-0">刷 新</button>
                    </so>`,
                    position: 'bottom-right',
                })
            }
            await method.refresh()
        }, inis.lazy_time * 10 * 3)
    },
    // 正则获取页面中的所有script标签
    html: async () => {
        let result = []
        let match  = null
        // /\<script.*src=["'](?<src>[^"']+)/gm
        const reg  = /<script.*src=["'](?<src>[^"']+)/gm
        const html = await fetch('/?unix=' + Date.now()).then(res=>res.text())
        reg.lastIndex = 0
        while ((match = reg.exec(html)) !== null) {
            result.push(match.groups.src)
        }
        return html
    },
    // 检查页面是否更新
    update: async () => {
        const scripts = await method.html()
        if (!state.last) {
            state.last = scripts
            return false
        }
        let result = false
        if (state.last.length !== scripts.length) {
            result = true
        }
        for (let i = 0; i < state.last.length; i++) {
            if (state.last[i] !== scripts[i]) {
                result = true
                break
            }
        }
        state.last = scripts
        return result
    },
}

</script>