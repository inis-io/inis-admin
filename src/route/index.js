import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import { list as MenuList } from '{src}/utils/menu'

const routes = [{
    path: '/',
    component: ()    => import('{src}/views/index/layout/base.vue'),
    children: [{
        path: '/',
        name: 'index-home',
        meta: { title: '首页' },
        component: () => import('{src}/views/index/pages/index.vue'),
    },{
        path: '/test',
        name: 'index-test',
        meta: { title: '测试' },
        component: () => import('{src}/views/index/pages/test.vue'),
    },{
        path: '/icons',
        name: 'index-icons',
        meta: { title: '图标' },
        component: () => import('{src}/views/index/pages/icons.vue'),
    }],
},{
    name: 'install',
    path: '/install',
    component: ()    => import('{src}/views/install/layout/base.vue'),
    meta: { title: '安装引导' },
    children: [{
        // path 匹配 / 或 /index 或 /home
        path: '/',  // 正则匹配：空 或 / 或 index 或 home
        name: 'install-index',
        meta: { title: '安装引导' },
    }],
},{
    name: 'admin',
    path: '/admin',
    component: ()    => import('{src}/views/admin/layout/base.vue'),
    children: [{
        path: /index|home|admin/,  // 正则匹配：空 或 / 或 index 或 home
        name: 'admin-home',
        meta: { title: '首页', auth: false },
        component: () => import('{src}/views/admin/pages/index.vue'),
    },{
        path: '/admin/users',
        name: 'admin-users',
        meta: { title: '用户' },
        component: () => import('{src}/views/admin/pages/users.vue'),
    },{
        path: '/admin/banner',
        name: 'admin-banner',
        meta: { title: '轮播' },
        component: () => import('{src}/views/admin/pages/banner.vue'),
    },{
        path: '/admin/links',
        name: 'admin-links',
        meta: { title: '友链' },
        component: () => import('{src}/views/admin/pages/links.vue'),
    },{
        path: '/admin/tags',
        name: 'admin-tags',
        meta: { title: '标签' },
        component: () => import('{src}/views/admin/pages/tags.vue'),
    },{
        path: '/admin/placard',
        name: 'admin-placard',
        meta: { title: '公告' },
        component: () => import('{src}/views/admin/pages/placard.vue'),
    },{
        path: '/admin/comment',
        name: 'admin-comment',
        meta: { title: '评论' },
        component: () => import('{src}/views/admin/pages/comment.vue'),
    },{
        path: '/admin/article',
        name: 'admin-article',
        meta: { title: '文章' },
        component: () => import('{src}/views/admin/pages/article.vue'),
    },{
        path: '/admin/article/write/:id(\\d+)?',
        name: 'admin-article-write',
        meta: { title: '撰写文章' },
        component: () => import('{src}/views/admin/pages/article-write[id].vue'),
    },{
        path: '/admin/article/group',
        name: 'admin-article-group',
        meta: { title: '文章分组' },
        component: () => import('{src}/views/admin/pages/article-group.vue'),
    },{
        path: '/admin/pages',
        name: 'admin-pages',
        meta: { title: '页面列表' },
        component: () => import('{src}/views/admin/pages/pages.vue'),
    },{
        path: '/admin/pages/write/:id(\\d+)?',
        name: 'admin-pages-write',
        meta: { title: '撰写页面' },
        component: () => import('{src}/views/admin/pages/pages-write[id].vue'),
    },{
        path: '/admin/links/group',
        name: 'admin-links-group',
        meta: { title: '友链分组' },
        component: () => import('{src}/views/admin/pages/links-group.vue'),
    },{
        path: '/admin/auth/rules',
        name: 'admin-auth-rules',
        meta: { title: '权限规则' },
        component: () => import('{src}/views/admin/pages/auth-rules.vue'),
    },{
        path: '/admin/auth/group',
        name: 'admin-auth-group',
        meta: { title: '权限分组' },
        component: () => import('{src}/views/admin/pages/auth-group.vue'),
    },{
        path: '/admin/auth/pages',
        name: 'admin-auth-pages',
        meta: { title: '页面权限' },
        component: () => import('{src}/views/admin/pages/auth-pages.vue'),
    },{
        path: '/admin/api/keys',
        name: 'admin-api-keys',
        meta: { title: '接口密钥' },
        component: () => import('{src}/views/admin/pages/api-keys.vue'),
    },{
        path: '/admin/system',
        name: 'admin-system',
        meta: { title: '系统配置' },
        component: () => import('{src}/views/admin/pages/system.vue'),
    },{
        path: '/admin/test',
        name: 'admin-test',
        meta: { title: '测试' },
        component: () => import('{src}/views/admin/pages/test.vue'),
    }],
},{
    path: '/register',
    name: 'register',
    meta: { title: '注册' },
    component: () => import('{src}/views/index/pages/register.vue'),
},{
    // 404 路由
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('{src}/views/error.vue'),
}]

const base = '/'
const mode = 'hash'
const route = createRouter({
    routes, history: mode === 'history' ? createWebHistory(base) : createWebHashHistory(base)
})

// 路由守卫
route.beforeEach(async (to, from, next) => {

    // 获取当前页面的 meta 信息
    const meta = to.meta || {}
    // 设置页面标题
    if (meta?.title) document.title = meta.title

    // 登录状态无效 - 跳转到登录页面
    const invalid = async (params = { path: '/' }) => {

        utils.clear.session('USERINFO')
        await axios.del('/api/comm/logout')

        next(params)
    }

    // 检查是否以 /install 开头
    if (to.path.indexOf('/install') === 0) {

        const { code, msg } = await axios.get('/dev/install/check')

        if (code !== 200) {
            next('/')
            return notyf.error(msg)
        }

        next()
    }

    // 判断 to.name 是否为 admin-开头的路由
    if (to.path.indexOf('/admin') === 0) {

        const { data, code } = await axios.post('/api/comm/check-token')

        if (code !== 200) return invalid()

        // 获取菜单列表
        let list = await MenuList()
        let array = ['/admin/test']
        // 把 list.children 下的 item.path 放到一维数组 array 中
        list.map(item => {
            if (item.children) {
                item.children.map(child=>array.push(child.path))
            }
        })

        // 是否需要校验权限
        if (to.meta.auth !== false) {
            let check = false
            for (let item of array) if (to.path.indexOf(item) !== -1) {
                check = true
                break
            }
            if (!check) return next('/')
        }

        // 设置用户信息
        utils.set.session('USERINFO', data.user)

        next()

    } else next()
})

export default route
