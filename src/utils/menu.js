import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import { push } from '{src}/utils/route'
import session from '{src}/utils/session'
import utils from "{src}/utils/utils.js";

export const list = async () => {

    // 全部的权限
    let all = await session.get.AuthPagesColumn()
    // 用户权限
    let auth = utils.get.session('USERINFO', 'pages') || ''
    // 用户权限列表
    let list = [{
        label: '创作',
        icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <path d="M288 416h192c17.67 0 32-14.33 32-32s-14.33-32-32-32H288c-17.67 0-32 14.33-32 32s14.33 32 32 32zM288 576h352c17.69 0 32-14.31 32-32s-14.31-32-32-32H288c-17.67 0-32 14.31-32 32s14.33 32 32 32zM480 672H288c-17.67 0-32 14.31-32 32s14.33 32 32 32h192c17.67 0 32-14.31 32-32s-14.33-32-32-32zM939.98 645.16L826.84 532.02c-6.25-6.25-14.44-9.37-22.63-9.37s-16.38 3.12-22.63 9.37L553.37 760.24c-6 6-9.37 14.14-9.37 22.63V896c0 17.67 14.33 32 32 32h113.14c8.49 0 16.63-3.37 22.63-9.37l228.21-228.21c12.49-12.5 12.49-32.76 0-45.26zM675.88 864H608v-67.88L804.21 599.9l67.88 67.88L675.88 864z" fill="rgb(var(--svg-color))"></path>
            <path d="M448 864H192V160h383.86l0.11 128.09c0.06 35.23 28.78 63.91 64 63.91H768v80c0 17.67 14.33 32 32 32s32-14.33 32-32V274.87c0-8.58-3.45-16.8-9.56-22.82L673.09 105.18A32.002 32.002 0 0 0 650.66 96H160c-17.67 0-32 14.33-32 32v768c0 17.67 14.33 32 32 32h288c17.67 0 32-14.33 32-32s-14.33-32-32-32z m319.72-576H639.97l-0.1-125.73L767.72 288z" fill="rgb(var(--svg-color))"></path>
        </svg>`,
        items: ['/admin/article', '/admin/article/group', '/admin/article/write', '/admin/pages','/admin/pages/write'],
        children: [],
    },{
        label: '管理',
        icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path d="M743.2704 264.32l91.8784 53.0176v130.56l-156.5184 90.368-0.384-126.848-97.28-56.32zM404.9664 826.3936v-173.9008l103.7568 59.5456 102.912-59.3152-0.7936 173.0048-103.7056 59.5968-102.0928-58.88z m42.3168-472.704l-108.1088 61.9008v121.7024L179.2 444.0832v-126.6176l102.5792-59.264 165.6576 95.5136z m66.8928 38.7072l98.4576 56.8064-0.6144 127.4112-103.3728 59.6992-103.808-60.5952v-122.2656l109.3888-61.056z" fill="rgb(var(--svg-color))"></path>
            <path d="M673.5872 224.128l-160.4096 91.8272L347.52 220.16 507.1616 128zM338.7136 788.1472L179.2 695.9872v-172.9536l159.744 91.8272v173.44z m496.4352-264.576v172.4928l-155.8272 89.856-0.4608-172.2368 156.16-90.2144z" fill="rgb(var(--svg-color))" opacity=".5"></path>
        </svg>`,
        items: ['/admin/users', '/admin/comment', '/admin/placard', '/admin/banner', '/admin/tags', '/admin/links', '/admin/links/group', '/admin/system'],
        children: [],
    },{
        label: '安全',
        icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" id="mx_n_1684237595000" width="18" height="18">
            <path d="M512 63.2L160.8 226.4v244.8c0 226.4 149.6 437.6 351.2 489.6 201.6-51.2 351.2-263.2 351.2-489.6V226.4L512 63.2z m-8 574.4l-45.6 45.6-45.6-45.6-90.4-90.4 45.6-45.6L458.4 592l204-204 45.6 45.6L504 637.6z" class="" fill="rgb(var(--svg-color))"></path>
        </svg>`,
        items: ['/admin/auth/rules', '/admin/auth/group', '/admin/api/keys', '/admin/auth/pages', '/admin/ip/black', '/admin/qps/warn'],
        children: [],
    }]

    // 用户拥有的页面权限
    let pages = []
    // 用户拥有的接口权限
    if (auth?.indexOf('all') !== -1) {
        pages = all.map(item => item.path)
    } else {
        // 字符串转数组
        pages = auth.split('|')
        // 去重 去空
        pages = [...new Set(pages)].filter(item => item)
    }

    for (let index in list) {
        // 取 pages 和 list 的交集
        let cross = list[index].items.filter(item => pages.indexOf(item) !== -1)
        // 把交集的到的结果加上 all 二维数组继续进行补全，根据 all.map(item => item.path) 的结果
        let children = cross.map(item => all.find(i => i.path === item))
        // 修正 children item 的字段 label => name，fn: () => push(item.path)
        children = children.map(item => {
            item.label = item.name
            item.fn = () => push(item.path)
            return item
        })
        // 把 children 赋值给 list[index].children
        list[index].children = children
    }

    // 如果 list[index].children 为空，就删除 list[index]
    list = list.filter(item => item.children.length)

    return list
}

export const config = {
    hasIcon: true,
    iconType: 'svg-icon',
    menuWidth: 130,
    customClass: 'i-table-menu',
    useLongPressInMobile: true,
    menuWrapperCss: {
        background: 'rgba(var(--theme-color), calc(var(--theme-opacity) * 1.65))',
        boxShadow: 'unset',
        backdropFilter: 'var(--theme-blur)',
    },
    menuItemCss: {
        labelColor: '#fff',
    },
    menuList: [],
}