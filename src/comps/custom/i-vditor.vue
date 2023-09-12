<template>
    <el-progress v-if="state.progress.show" :percentage="state.progress.value" :color="state.progress.color"></el-progress>
    <div v-bind="$attrs" ref="vditor"></div>
</template>

<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()

const state  = reactive({
    item: Vditor,
    content: '### 默认',
    progress: {
        value: 0,
        show : false,
        color: 'var(--bs-dark)',
    }
})

const method = {
    item: () => {
        return new Vditor(proxy.$refs['vditor'], {
            cdn: base_url + 'assets/libs/vditor',
            // cdn: 'https://unpkg.com/vditor@3.9.3',
            placeholder: '写点什么吧！',
            toolbarConfig: {
                pin: true,              // 固定工具栏
            },
            cache: {
                enable: false,          // 关闭缓存
            },
            counter: {
                enable: true,           // 启用计数器
            },
            resize: {
                enable: true,           // 支持主窗口大小拖拽
            },
            preview: {
                hljs: {
                    enable: true,       // 启用代码高亮
                    lineNumber: true,   // 启用行号
                },
                math: {
                    engine: 'MathJax',
                }
            },
            after: () => {
                state.item.setValue(props.modelValue)
            },
            upload: {
                accept: 'image/*, video/*',
                multiple: false,
                // 上传失败自定义方法
                handler: async files => {

                    // 创建一个 formData
                    const params = new FormData
                    params.append('file', files[0])

                    state.progress.show = true

                    const { code, msg, data } = await axios.post('/api/file/upload', params, {
                        // 上传进度
                        onUploadProgress: speed => {
                            state.progress.value = Math.round(speed.loaded / speed.total * 100)
                        }
                    })

                    if (code !== 200) {
                        notyf.error(msg)
                        state.progress.color = 'var(--bs-danger)'
                        setTimeout(() => (state.progress.show  = false), 3000)
                        return
                    }

                    const { path } = data

                    if (method.fileFormat(path) === 'image') {
                        state.item.insertValue(`![](${path})`)
                    } else if (method.fileFormat(path) === 'video') {
                        state.item.insertValue(`<video src="${path}" controls>Not Support</video>`)
                    } else {
                        state.item.insertValue(`${path}`)
                    }

                    state.progress.show  = false
                },
                filename: name => {
                    return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5.)]/g, '')
                    .replace(/[?\\/:|<>*\[\]()$%{}@~]/g, '')
                    .replace('/\\s/g', '');
                },
            },
            ...Object.assign({}, defOpts, props.opts),
        })
    },
    // 文件格式
    fileFormat(url = null){

        let result  = 'other'
        const image = ['png','jpg','jpeg','gif','webp','svg','ico']
        const video = ['avi','mp4']
        const array = url.split('.')
        const pop   = array.pop()

        if (utils.in.array(pop, image))      result = 'image'
        else if (utils.in.array(pop, video)) result = 'video'

        return result
    },
}

let defOpts = {
    height: 360,
    toolbarConfig: {
        pin: true,
    },
    cache: {
        enable: false,
    },
}

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    opts: {
        type: Object,
        default: {
            height: 360,
            toolbarConfig: {
                pin: true,
            },
            cache: {
                enable: false,
            },
        },
        required: false
    },
})

const base_url = (process.env.NODE_ENV === 'production' ? (import.meta.env.VITE_BASE || '/') : '/')

onMounted(() => {
    state.item = method.item()
})

// 打印当前时间戳

watch(() => props.modelValue, (value) => {
    state.item?.setValue(value)
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

// 通过 proxy 暴露给父组件
defineExpose({
    getHTML: () => state.item?.getHTML(),
    getValue: () => state.item?.getValue(),
    html2md: (html) => state.item?.html2md(html),
    setValue: (markdown) => state.item?.setValue(markdown),
})
</script>