export default {
    mounted(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = '', height = ''
        const isReize = () => {
            const style = document.defaultView.getComputedStyle(el)
            if (width !== style.width || height !== style.height) {
                // 关键
                binding.value()
            }
            width  = style.width
            height = style.height
        }
        el.__vueSetInterval__ = setInterval(isReize, 300)
    },
    unmounted(el) {
        clearInterval(el.__vueSetInterval__)
    }
}