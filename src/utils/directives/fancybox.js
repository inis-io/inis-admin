import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

const bind = (el) => {
    // 找到 el 下的所有图片
    const imgs = Array.from(el.querySelectorAll('img'))
    // 遍历所有图片
    imgs.map(item=> {
        item.classList.add('pointer')
        item.addEventListener('click', () => {
            Fancybox.fromNodes(imgs, {
                Toolbar: {
                    display: {
                        left: ['infobar'],
                        right: ['slideshow', 'download', 'thumbs', 'close'],
                        middle: ['zoomIn','zoomOut','toggle1to1','rotateCCW','rotateCW','flipX','flipY'],
                    },
                },
                // 显示第几张图片
                startIndex: imgs.indexOf(item),
            })
        })
    })
}

export default {
    mounted(el, binding) {
        bind(el)
    },
    updated(el, binding) {
        Fancybox.destroy()
        bind(el)
    },
    unmounted(el) {
        // 销毁
        Fancybox.destroy()
    }
}