<template>
    <el-progress v-if="state.progress.show" :percentage="state.progress.value" :color="state.progress.color"></el-progress>
    <editor v-bind="$attrs" :init="state.init"></editor>
</template>

<script setup>
import notyf from '{src}/utils/notyf.js'
import utils from '{src}/utils/utils.js'
import axios from '{src}/utils/request.js'

import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/models/dom'
import 'tinymce/icons/default'
import 'tinymce/themes/silver/theme'
// tinymce插件可按自己的需要进行导入 - 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/help'
import 'tinymce/plugins/image'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'

const { ctx, proxy } = getCurrentInstance()

const base_url = (process.env.NODE_ENV === 'production' ? (import.meta.env.VITE_BASE || '/') : '/')

const props = defineProps({
    opts: {
        type: Object,
        default: {},
        required: false
    },
})

const state = reactive({
    init: {
        placeholder:'请输入内容 ...',
        promotion: false,                                                       // 高级升级促销选项
        height: 600,
        base_url: base_url + 'assets/libs/tinymce',                             // 基础路径
        plugins: 'lists link image table code wordcount help',
        mobile: {
            menubar: true,
        },
        language: 'zh-Hans',                                                    // 语言
        browser_spellcheck: true,                                               // 拼写检查
        branding: false,                                                        // 去水印
        elementpath: false,                                                     // 禁用编辑器底部的状态栏
        statusbar: false,                                                       // 隐藏编辑器底部的状态栏
        // paste_data_images: false,                                            // 不允许粘贴图像
        convert_urls: false,                                                    // 禁止自动转换url
        content_style: `
            * { color: rgb(${utils.get.css.var('--theme-font-color')}); }
            html{scrollbar-width: thin;scrollbar-color: rgba(0,0,0,.2) transparent;}
            html::-webkit-scrollbar{width:4px;height:10px;background-color:rgba(0,0,0,0);}
            html::-webkit-scrollbar-thumb{border-radius:6px;background-color:rgba(0,0,0,.2);transition:all .4s ease;-moz-transition:all .4s ease;-webkit-transition:all .4s ease;-o-transition:all .4s ease}
            html::-webkit-scrollbar-track{background-color:rgba(0,0,0,.1)}
        `,
        fontsize_formats: '14px 16px 18px 20px 24px 26px 28px 30px 32px 36px',  // 字体大小
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue;PingFang SC;sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun;serifsans-serif;Terminal=terminal;monaco;Times New Roman=times new roman;times', // 字体
        file_picker_types: 'image',
        images_upload_credentials: true,
        // 上传
        images_upload_handler: async (blobInfo) => {

            try {

                const params = new FormData
                params.append('file', blobInfo.blob())

                state.progress.show = true

                const { data, code, msg } = await axios.post('/api/file/upload', params, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    // 上传进度
                    onUploadProgress: speed => {
                        state.progress.value = Math.round(speed.loaded / speed.total * 100)
                    }
                })

                if (code !== 200) {
                    notyf.error(msg)
                    state.progress.color = 'var(--bs-danger)'
                    setTimeout(() => (state.progress.show  = false), 3000)
                }

                const { path } = data

                state.progress.show  = false

                return path

            } catch (error) {
                notyf.error(error)
                state.progress.color = 'var(--bs-danger)'
                setTimeout(() => (state.progress.show  = false), 3000)
            }
        },
        ...props.opts,
    },
    progress: {
        value: 0,
        show : false,
        color: 'var(--bs-dark)',
    }
})

onMounted(async () => {
    await tinymce.init({})
})

// 监听进度条的进度，动态改变颜色
watch(() => state.progress.value, value => {
    if (value < 30) {
        state.progress.color = 'var(--bs-dark)'
    } else if (value < 60) {
        state.progress.color = 'var(--bs-primary)'
    } else if (value < 100) {
        state.progress.color = '#409eff'
    } else if (value === 100) {
        state.progress.color = 'var(--bs-success)'
    }
})
</script>