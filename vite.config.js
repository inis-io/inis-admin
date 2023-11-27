import path from 'path'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// element-plus 自动按需引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { visualizer } from 'rollup-plugin-visualizer'

// vite.plugin.js
import { externals } from './vite.plugin'

// https://vitejs.dev/config/
export default ({ mode }) => {

    let env = { ...loadEnv(mode, __dirname), VITE_LIBS: '' }

    let cdn = {
        name: env?.VITE_CDN || null,
        path: '//unpkg.com',
    }

    // 处理CDN
    switch (cdn.name?.toLowerCase()) {
    case 'jsdelivr':
        cdn.path = '//cdn.jsdelivr.net/npm'
        break
    case 'unpkg':
        cdn.path = '//unpkg.com'
        break
    default:
        cdn.path = '//unpkg.com'
        break
    }

    let libs = {
        css: ['/bootstrap@5.2.3/dist/css/bootstrap.min.css'],
        js: [
            '/vue@3/dist/vue.global.js',
            '/vuex@4.0.0/dist/vuex.global.js',
            '/vue-router@4.1.6/dist/vue-router.global.js',
            '/axios/dist/axios.min.js',
            '/@vueuse/shared',
            '/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js'
        ],
    }

    if (cdn.name) {

        libs.css = libs.css.map(item => `${cdn.path}${item}`)
        libs.js  = libs.js.map(item => `${cdn.path}${item}`)

        let html = ''
        libs.css.forEach(item => {
            html += `<link rel="stylesheet" href="${item}">\n`
        })
        libs.js.forEach(item => {
            html += `<script src="${item}" defer></script>\n`
        })

        env.VITE_LIBS = html
    }

    // 时间戳
    const timestamp = Math.round(new Date() / 1000)
    const base_url = (process.env.NODE_ENV === 'production' ? (env?.VITE_BASE || '/') : '/')

    let plugins = [
        vue(),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
            // 指定symbolId格式
            symbolId: 'icon-[dir]-[name]',

            /**
             * 自定义插入位置
             * @default: body-last
             */
            inject: 'body-last' | 'body-first',

            /**
             * custom dom id
             * @default: __svg__icons__dom__
             */
            customDomId: '__svg__icons__dom__',
        }),
        AutoImport({
            // 自动导入 - 全局
            imports: ['vue', 'vue-router'],
            // 生成全局变量名
            dts: 'src/auto-imports.d.ts',
            // element-plus - 自动按需引入 - 注册中文
            // resolvers: [ElementPlusResolver()],
        }),
        // Components({
        //     // element-plus - 自动按需引入 - 注册中文
        //     // resolvers: [ElementPlusResolver()],
        // }),
        ElementPlus({
            // element-plus - 自动按需引入 - 注册中文
            // resolvers: [ElementPlusResolver()],
        }),
        createHtmlPlugin({
            inject: {
                data: { ...env },
            },
        }),

        // 打包优化
        // visualizer(),
        // externals(),
    ]
    if (cdn.name) {
        plugins.push(externals())
    }

    return {
        base: base_url,
        plugins: plugins,
        // 别名
        resolve: {
            alias: {
                '@/': path.resolve(__dirname, '/src/'),
                '{src}': path.resolve(__dirname, 'src'),
            }
        },
        build: {
            minify: 'terser',
            // 打包后的文件名
            outDir: 'dist',
            // 打包后的静态资源文件夹名称
            assetsDir: 'static',
            // 分包
            chunkSizeWarningLimit: 2000,
            terserOptions: {
                compress: {
                    // 移除console
                    drop_console: true,
                    // 移除debugger
                    drop_debugger: true,
                }
            },
            // 启用/禁用 CSS 代码拆分
            // cssCodeSplit: true,
            // 打包后更改文件名
            rollupOptions: {
                output: {
                    assetFileNames: asset => {
                        let info    = asset.name.split('.')
                        let ext = info[info.length - 1]
                        if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(asset.name)) {
                            ext = 'media'
                        } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(asset.name)) {
                            ext = 'images'
                        } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(asset.name)) {
                            ext = 'font'
                        }
                        return `static/${ext}/${timestamp}.[name][extname]`
                    },
                    chunkFileNames: `static/js/${timestamp}.[name].js`,
                    entryFileNames: `static/js/${timestamp}.[name].js`,
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString()
                        }
                    }
                },
            },
        },
        server: {
            // 代理
            proxy: {
                '/api': {
                    target: env.VITE_API,
                    changeOrigin: true,
                },
                '/dev': {
                    target: env.VITE_API,
                    changeOrigin: true,
                },
                '/inis': {
                    target: env.VITE_API,
                    changeOrigin: true,
                },
                '/socket.io': {
                    target: env.VITE_SOCKET,
                    ws: true,
                }
            },
        }
    }
}