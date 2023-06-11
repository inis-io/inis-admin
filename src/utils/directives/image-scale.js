export default {
    created(el, binding, vnode, prevVnode) {},
    beforeMount(el, binding, vnode, prevVnode) {},
    mounted(el, binding, vnode, prevVnode) {

        let config    = { target: 'img', width: 16, height: 9 }
        config.width  = binding.value?.[0] || config.width
        config.height = binding.value?.[1] || config.height
        config.target = binding.value?.[2] || config.target

        const auto = () => {
            // 获取容器宽度
            let width  = el.offsetWidth
            // 获取容器高度
            let height = el.offsetHeight
            // 设置比例
            let scale  = config.height / config.width
            // 定时器，每间隔 1000 毫秒执行一次，执行10次或找到目标元素则停止
            let timer  = setInterval(() => {
                // 获取目标元素
                let target = el.querySelectorAll(config.target)
                // 如果找到目标元素则停止定时器
                if (target) {
                    clearInterval(timer)
                    // 遍历目标元素
                    target.forEach(item => {
                        width = item.offsetWidth || width
                        item.setAttribute('height', width * scale)
                    })
                }
                // 如果定时器执行10次还没找到目标元素则停止定时器
                if (timer > 10) clearInterval(timer)
                timer++
            }, 1000)
        }
        // 监听窗口大小变化
        window.addEventListener('resize', () => auto())
        // 手动改变窗口大小
        window.dispatchEvent(new Event('resize'))
    },
    beforeUpdate(el, binding, vnode, prevVnode) {},
    updated(el, binding, vnode, prevVnode) {},
    beforeUnmount(el, binding, vnode, prevVnode) {},
    unmounted(el, binding, vnode, prevVnode) {}
}