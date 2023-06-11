import router from '{src}/route/index.js'

export function push (options) {
    // 添加路由跳转前的拦截器
    router.beforeEach((to, from, next) => {
        // do something before route change
        next()
    })

    // 调用原始的 push 方法
    router.push(options)

    // 添加路由跳转后的处理
    router.afterEach((to, from) => {
        // do something after route change
    })
}
