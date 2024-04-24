// 自定义动画函数
function animate({ duration, draw }) {

    let start = performance.now()

    requestAnimationFrame(function animate(time) {

        let timeFraction = (time - start) / duration
        if (timeFraction > 1) timeFraction = 1

        let progress = timeFraction

        draw(progress)

        if (timeFraction < 1) requestAnimationFrame(animate)
    })
}

export default {
    mounted(el, binding) {

        let config    = { color: 'rgba(36,129,250,0.2)', duration: 400 }
        config.color    = binding.value?.[0] || config.color
        config.duration = binding.value?.[1] || config.duration

        let span
        let isIn = false

        el.style.overflow  = 'hidden'
        el.style.position  = 'relative'

        const max = Math.max(el.offsetWidth, el.offsetHeight) * 2.4

        // 鼠标进入事件
        el.addEventListener('mouseenter', event => {

            if (!isIn) {

                isIn = true

                // 创建或重置 span 元素
                if (!span) {
                    span = document.createElement('span')
                    span.style.position     = 'absolute'
                    span.style.transform    = 'translate(-50%, -50%)'
                    span.style.borderRadius = '50%'
                    el.appendChild(span)
                }

                // 设置 span 元素样式
                span.style.top             = event.offsetY + 10 + 'px'
                span.style.left            = event.offsetX + 10 + 'px'
                span.style.backgroundColor = config.color

                // 开始动画
                animate({
                    duration: config.duration, draw(progress) {
                        // 检查 span 是否存在
                        if (span) {
                            span.style.width  = progress * max + 'px'
                            span.style.height = progress * max + 'px'
                        }
                    }
                });
            }
        });

        // 鼠标离开事件
        el.addEventListener('mouseleave', () => {

            if (isIn) {

                isIn = false

                if (span) {

                    animate({
                        duration: config.duration / 2, draw(progress) {
                            // 检查 span 是否存在
                            if (span) {
                                span.style.width  = (1 - progress) * max + 'px'
                                span.style.height = (1 - progress) * max + 'px'
                            }
                        }
                    })

                    // 监听动画结束事件，在动画结束后移除 span 元素
                    span.addEventListener('animationend', () => {
                        if (span && span.parentNode === el) { // 确保 span 仍然是 el 的子节点
                            el.removeChild(span)
                            span = null
                        }
                    })
                }
            }
        })
    },
    unmounted(el) {
        el.removeEventListener('mouseenter')
        el.removeEventListener('mouseleave')
    }
}
