export default {
    beforeMount(el) {
        const images = el.getElementsByTagName('img')
        for (let item of images) {
            // 给图片上预览盒子
            item.outerHTML = `<a data-fancybox='gallery' href='${item.src}' data-caption='${item.alt}'>${item.outerHTML}</a>`
        }
    }
}