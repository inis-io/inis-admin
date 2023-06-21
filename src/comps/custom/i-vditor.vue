<template>
    <div v-bind="$attrs" ref="vditor"></div>
</template>

<script setup>

import Vditor from 'vditor'
import 'vditor/dist/index.css'

const { ctx, proxy } = getCurrentInstance()

const state = reactive({
    item: Vditor,
    content: '### 默认'
})

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

onMounted( () => {
    state.item = new Vditor(proxy.$refs['vditor'], {
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
        ...Object.assign({}, defOpts, props.opts),
    })
})

watch(() => props.modelValue, (val) => {
    state.item.setValue(val)
})

// 通过 proxy 暴露给父组件
defineExpose({
    getHTML: () => state.item.getHTML(),
    getValue: () => state.item.getValue(),
    html2md: (html) => state.item.html2md(html),
})
</script>