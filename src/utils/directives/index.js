// 在src文件夹下新建directives文件夹，新建index.js文件
import load       from './load.js'
import lock       from './lock.js'
import imageBox   from './image-box.js'
import imageScale from './image-scale.js'
import plyr       from './plyr.js'
import resize     from './resize.js'
import fancybox   from './fancybox.js'
import highlight  from './highlight.js'
import ripple     from './ripple/index.ts'
import hover      from './hover.js'
import slideIn    from './slide-in.js'
import { MouseMenuDirective } from '@howdyjs/mouse-menu'

const directives = {
    imageBox, imageScale, mouseMenu: MouseMenuDirective, load, lock, slideIn, fancybox, highlight, plyr, resize, ripple, hover
}

export default {
    install(Vue) {
        // 通过遍历directives对象完成全局注册
        Object.keys(directives).forEach(item => {
            Vue.directive(item, directives[item])
        })
    }
}