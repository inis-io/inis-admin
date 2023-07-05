<template>
    <div ref="pointer" id="pointer"></div>
    <div id="background">
        <el-image src="/assets/imgs/bg.webp" fit="cover" style="width: 100%; height: 100%;position: fixed;left: 0;top: 0;">
            <template #error>
                <el-image :src="state.cover" fit="cover" style="width: 100%; height: 100%;position: fixed;left: 0;top: 0;">
                </el-image>
            </template>
        </el-image>
        <div ref="cover" class="cover" style="opacity: 1; transition: all 1.5s ease 0s;"></div>
    </div>
    <div id="go-to-top" ref="go-to-top" class="d-none">
        <button class="flex-center p-0" type="button">
            <i-svg name="go-to-top" size="30px"></i-svg>
        </button>
    </div>
</template>

<script setup>
import utils from '{src}/utils/utils'

const { ctx, proxy } = getCurrentInstance()
const unix  = Math.round(new Date().getTime() / 1000)
const state = reactive({
    cover: `https://api.inis.cc/api/file/random?name=cure&unix=${unix}`,
})

nextTick(() => {

    /* 鼠标样式 */
    const pointer = proxy.$refs['pointer']
    const width   = pointer.offsetWidth / 2

    // 获取当前滚动条高度
    const getScrollTop = () => {
        let result = 0
        if (document.documentElement && document.documentElement.scrollTop) {
            result = document.documentElement.scrollTop
        } else if (document.body) {
            result = document.body.scrollTop
        }
        return result
    }

    const setPosition = (x, y) => {
        pointer.style.transform = `translate(${x - width + 1}px, ${getScrollTop() + y - width + 1}px)`
    }

    const body = document.querySelector('body')
    body.addEventListener('mousemove', e => window.requestAnimationFrame(() => {
        setPosition(e.clientX, e.clientY)
    }))

    const loading = document.querySelector('#loading-box')
    // 移除开屏动画
    if (loading) setTimeout(() => loading.classList.add('loaded'), 500)

    const cover = proxy.$refs['cover']
    const image = proxy.$refs['bg-img']

    cover.style.setProperty('opacity', 0)
    cover.style.setProperty('transition', 'all 1.5s ease 0s')

    // 移动端去除鼠标样式
    if (Boolean(window.navigator.userAgent.match(/AppWebKit.*Mobile.*/))) {
        pointer.style.display = 'none'
    }

    // 监听混动条
    window.onscroll = () => {
        // defer => 延迟单击事件 execute=>是否执行单击事件
        let [defer, execute] = [null, true]
        // 兼容方式获取滚动条Y坐标轴
        let y = window.pageYOffset !== undefined ?  window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        const goToTop = proxy.$refs['go-to-top']
        goToTop.style.setProperty('display', y > 300 ? 'block' : 'none', 'important')
        // 单击事件
        goToTop.addEventListener('click',() => {
            execute = true
            defer = setTimeout(() => {
                if (execute) utils.to.scroll(0)
            }, 150)
        })
        // 双击事件
        goToTop.addEventListener('dblclick',() => {
            // 清除单击事件
            clearTimeout(defer)
            execute = false
            utils.to.scroll(scrollButtom())
        })

        // 获取滚动条最大高度
        const scrollButtom = () => {
            // 客户端浏览器高度
            let clientHeight = 0
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = document.body.clientHeight < document.documentElement.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight
            } else {
                clientHeight = document.body.clientHeight > document.documentElement.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight
            }
            let scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
            return scrollHeight - clientHeight
        }
    }
})

</script>

<style scoped>
#go-to-top{
    position: fixed;
    right: 5%;
    bottom: 6%;
    z-index: 9999;
}
#go-to-top button{
    background: rgba(var(--dark-color), var(--dark-opacity));
    border-radius: 50%;
    width: 40px;
    height: 40px;
    border: none;
    transition: .2s ease-in;
    position: relative;
}
</style>