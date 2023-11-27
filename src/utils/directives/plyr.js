import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

const render = el => {
    el.querySelectorAll('video').forEach(item => {

        // 先检查 <meta name="referrer" content="no-referrer"> 是否存在
        // 如果不存在则插入
        if (!document.querySelector('meta[name="referrer"]')) {
            document.head.insertAdjacentHTML('beforeend', '<meta name="referrer" content="no-referrer">')
        }

        // 找一下 video 是否包含 source
        const source = item.querySelector('source')
        // 如果有 source 则使用 source 的 src
        const src = source ? source.src : item.src

        // 如果有 source 则使用 source 的 options
        // 把 player 存起来，方便后面调用
        item.plyr = new Plyr(item, {
            i18n: {
                speed: '速度',
                normal: '正常',
            },
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