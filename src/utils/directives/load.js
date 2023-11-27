// 参数归一化
const config = (binding) => {
    let result = {
        open: false,
        text: '数据加载中...',
        tips: '获取数据和渲染页面需要一点时间，请耐心等待'
    }
    if (typeof binding.value === 'boolean') {
        result.open = binding.value
        return result
    }
    if (Array.isArray(binding.value)) {

        let [open, text, tips] = binding.value
        if (typeof open === 'boolean') result.open = open
        result.text = text
        result.tips = tips

        return result
    }
    if (typeof binding.value === 'object') {
        result = Object.assign(result, binding.value)
        return result
    }
}

// 渲染 loading
const render = (el, binding) => {

    const { text, tips } = config(binding)

    const html = `<div class="loading-left-bg"></div>
    <div class="loading-right-bg"></div>
    <div class="spinner-box">
        <div class="loader">
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
        </div>
        <div class="loading-word">
            <p class="loading-title font-18 fw-bolder">
                ${ text || '' }
            </p>
            <span class="font-13">
                ${ tips || '' }
            </span>
        </div>
    </div>`
    el.loading = document.createElement('div')
    el.loading.id = 'v-load'
    el.loading.innerHTML = html
    el.appendChild(el.loading)
    el.classList.add('position-relative')
}

// 移除 loading
const remove = (el) => {
    el.loading.className = 'loaded'
    setTimeout(() => {
        el.removeChild(el.loading)
        el.classList.remove('position-relative')
        el.loading = null
    }, 300)
}
export default {
    mounted(el, binding) {
        const { open } = config(binding)
        if (open) render(el, binding)
    },
    updated(el, binding) {
        const { open } = config(binding)
        if (open) {
            if (!el.loading) render(el, binding)
            return
        }
        if (el.loading) remove(el)
    },
    unmounted(el) {
        if (el.loading) remove(el)
    }
}