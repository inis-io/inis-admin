// 参数归一化
const params = (binding) => {
    let result = {
        open: false,
        tips: '上锁中 . . .'
    }
    if (typeof binding.value === 'boolean') {
        result.open = binding.value
        return result
    }
    if (Array.isArray(binding.value)) {

        let [ open, tips ] = binding.value
        if (typeof open === 'boolean') result.open = open
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

    const { tips } = params(binding)

    const html = ``
    el.loading = document.createElement('div')
    el.loading.id = 'v-lock'
    el.loading.innerHTML = html
    el.appendChild(el.loading)
    el.classList.add('position-relative')

    // 给 v-lock::after 添加 tips
    if (tips) {
        const style = document.createElement('style')
        style.innerHTML = `
            #v-lock::after {
                content: '${tips}';
            }
        `
        el.appendChild(style)
    }
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
        const { open } = params(binding)
        if (open) render(el, binding)
    },
    updated(el, binding) {
        const { open } = params(binding)
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