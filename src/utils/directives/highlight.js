import utils from '{src}/utils/utils'
import hljs from 'highlight.js'

const render = el => {
    el.querySelectorAll('pre').forEach(pre => {

        // 检查初始化
        if (!utils.is.empty(pre.getAttribute('init'))) return

        const code = pre.querySelector('code')
        hljs.highlightBlock(code)
        // 显示行号
        code.innerHTML = `<ul><li>${code.innerHTML.replace(/\n/g, "</li><li>")}</li></ul>`
        // 如果最后一个li为空，删除
        if (code.querySelector('ul li:last-child').innerText === '') code.querySelector('ul li:last-child').remove()
        // 添加头
        let language = null
        code.classList.forEach((className) => {
            if (className.indexOf("language-") !== -1) language = className.split('-')[1]
        })
        let head = document.createElement('div')
        head.classList.add('head')
        head.innerHTML = `<p>
            <span class='code-language'>${language.toUpperCase()}</span>
            <span class='copy'>
                <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                    <path d="M812.8 499.2 524.8 211.2C512 198.4 499.2 192 480 192L256 192C217.6 192 192 217.6 192 256l0 224C192 499.2 198.4 512 211.2 524.8l288 288c25.6 25.6 64 25.6 89.6 0l224-224C838.4 563.2 838.4 524.8 812.8 499.2zM384 384C364.8 403.2 332.8 403.2 313.6 384s-19.2-51.2 0-70.4 51.2-19.2 70.4 0C403.2 332.8 403.2 364.8 384 384z" fill="#fff"></path>
                </svg>
                <span class="text">复制</span>
            </span>
        </p>`
        code.parentNode.insertBefore(head, code)
        // 创建修复滚动条白点
        let repair = document.createElement('span')
        repair.classList.add('repair')
        code.parentNode.insertBefore(repair, code)
        pre.setAttribute('init', true)

        // 复制操作
        pre.querySelectorAll('.copy').forEach(item => {
            item.addEventListener('click', () => {
                utils.set.copy.text(pre.querySelector('code').innerText)
                item.querySelector('.text').innerText = '已复制'
            })
        })
    })
}

export default {
    mounted(el, binding) {
        render(el)
    },
    updated(el, binding) {
        render(el)
    },
}