import { createApp } from 'vue'
import App from '{src}/app.vue'
import route  from '{src}/route'

// 注册 vsg-icons 组件
import 'virtual:svg-icons-register'
import svg from '{src}/utils/plugins/svg/index.vue'

// 默认的bootstrap样式
// https://github.com/caroso1222/notyf
import 'notyf/notyf.min.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
// 覆盖掉bootstrap的样式
import '{src}/assets/libs/bootstrap.min.css'
import directives from '{src}/utils/directives'
import socket from '{src}/utils/socket'

const app = createApp(App)
app.use(route).use(directives)
app.component('i-svg', svg)
app.provide('socket', socket)
app.mount('#app')

const { VITE_LOG_ERROR, VITE_LOG_WARN } = import.meta.env
// 屏蔽错误信息
if (VITE_LOG_ERROR === 'false') app.config.errorHandler = () => null
// 屏蔽警告信息
if (VITE_LOG_WARN  === 'false') app.config.warnHandler  = () => null