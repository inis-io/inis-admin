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

onMounted( () => {
    state.item = new Vditor(ctx.$refs['vditor'], {
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