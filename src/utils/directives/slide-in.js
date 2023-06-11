// 记录元素和动画的对应关系 - 避免内存泄漏
const map = new WeakMap()

// 创建一个观察者对象 - 用来观察元素是否进入了可视区域
const ob = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        // 判断元素是否进入了可视区域
        if (entry.isIntersecting) {
            // 获取动画
            const animate = map.get(entry.target)
            // 播放动画
            animate.play()
            // 停止观察
            ob.unobserve(entry.target)
        }
    }
})

// 判断元素是否在可视区域内
const isBrowserView = (el) => {
    const rect = el.getBoundingClientRect()
    return rect.top < window.innerHeight
}

// 参数归一化
const params = (binding) => {
    let result = { distance: 150, duration: 1000 }

    if (Array.isArray(binding.value)) {

        let [ distance, duration ] = binding.value
        result.distance = distance
        result.duration = duration

        return result
    }

    if (typeof binding.value === 'object') {
        result = Object.assign(result, binding.value)
        return result
    }
}

export default {
    mounted(el, binding) {

        // 判断元素是否在可视区域内
        if (!isBrowserView(el)) return

        let { distance, duration } = params(binding)

        const animate = el.animate([
            { transform: `translateY(${distance}px)`, opacity: 0.5 },
            { transform: 'translateY(0)', opacity: 1 }
        ],  { duration: duration, easing: 'ease' })

        // 暂停动画
        animate.pause()
        // 记录元素和动画的对应关系
        map.set(el, animate)
        // 观察元素
        ob.observe(el)
    },
    unmounted(el) {
        // 停止观察
        ob.unobserve(el)
    }
}