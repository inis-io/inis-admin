<template>
    <div v-load="[state.status.loading, null, null]" class="card">
        <div class="card-body">
            <i-svg name="editor" size="43px" class="position-absolute opacity-25" style="right: 2rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● Markdown编辑器：Vditor支持所见即所得、即时渲染（类似 Typora）和分屏预览模式。<br>
                        ● 富文本编辑器：TinyMCE是一个基于浏览器的所见即所得富文本编辑器，用于编辑HTML文档。<br>
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" size="14px"></i-svg>
                        <span class="ms-1">编辑器</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.struct.json.editor" v-on:change="method.change" :disabled="!state.status.finish"
                           active-value="tinymce" inactive-value="vditor" active-text="富文本" inactive-text="Markdown" active-color="#13ce66" inactive-color="#409eff">
                </el-switch>
            </h2>
            <span class="text-muted">
                选择默认的编辑器，主要用于文章和页面编辑。
            </span>
        </div>
    </div>
</template>

<script setup>

import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    struct: {
        json: {
            'editor': 'tinymce'
        }
    },
    status: {
        finish: false,
        loading: true,
    }
})

onMounted(async () => {
    await method.init()
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/config/one', {
            key: 'ARTICLE'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        state.status.finish  = true
    },
    change: async value => {

        const { code, msg } = await axios.post('/api/config/save', {
            key: 'ARTICLE',
            json: JSON.stringify({
                editor: value
            })
        })

        if (code === 200) return

        state.struct.json.editor = state.struct.json.editor === 'tinymce' ? 'vditor' : 'tinymce'
        notyf.error(msg)
    },
}

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>