import { loadEnv } from 'vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'

export const replace = (mode) => {
    return {
        name: 'replace',
        transform(code) {

            const name = 'inis.api'

            // 读取 .env 文件中的 VITE_API_URI 变量
            const env = loadEnv(mode, __dirname)

            // 定义正则表达式
            // const regex = new RegExp(`["']${env.VITE_API_TEST}["']`, 'g')

            // const regex = new RegExp(`"http://localhost:1000"|'http://localhost:1000'`, 'g')

            return {
                // 匹配代码中的 env.VITE_API 字符串，包含单引号和双引号，替换为 name 变量
                // code: code.replace(regex, name),
                // code: code.replace(/"API地址"|'API地址'/g, 'VITE_UNTI_API'),
                // code: code.replace(/"http:\/\/localhost:1000"|'http:\/\/localhost:1000'/g, name),
            }
        },
    }
}

// 打包优化 - 外部化
export const externals = () => {
    return viteExternalsPlugin({
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'axios': 'axios',
        'bootstrap': 'bootstrap',
        'vue-demi': 'VueDemi',
    })
}
