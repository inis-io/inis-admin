<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="editor" color="rgb(var(--assist-color))" size="43px" class="position-absolute opacity-25" style="right: 2rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● Markdown编辑器：Vditor支持所见即所得、即时渲染（类似 Typora）和分屏预览模式。<br>
                        ● 富文本编辑器：TinyMCE是一个基于浏览器的所见即所得富文本编辑器，用于编辑HTML文档。<br>
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">文章</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.cache.json.editor" v-on:change="method.change" :disabled="!state.status.finish"
                           active-value="tinymce" inactive-value="vditor" active-text="富文本" inactive-text="Markdown">
                </el-switch>
            </h2>
            <span class="badge bg-success font-white"> 更多 </span>
            <span class="text-muted">
                其它配置信息，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">文章配置</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip placement="top">
                                <template #content>
                                    ● Markdown编辑器：Vditor支持所见即所得、即时渲染（类似 Typora）和分屏预览模式。<br>
                                    ● 富文本编辑器：TinyMCE是一个基于浏览器的所见即所得富文本编辑器，用于编辑HTML文档。<br>
                                </template>
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">编辑器：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.cache.json.editor" class="d-block custom font-13" placeholder="请选择">
                            <el-option v-for="item in state.select.editor" :key="item.value" :label="item.label" :value="item.value">
                                <span class="font-13">{{ item.label }}</span>
                                <small class="text-muted float-end">{{ item.value }}</small>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="用户发布的文章，是否需要审核" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">审核：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.struct.json.audit" class="d-block custom font-13" placeholder="请选择">
                            <el-option v-for="item in state.select.audit" :key="item.value" :label="item.label" :value="item.value">
                                <span class="font-13">{{ item.label }}</span>
                                <small class="text-muted float-end">{{ item.subtitle }}</small>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="是否允许用户评论" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">允许评论：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.struct.json.comment.allow" class="d-block custom font-13" placeholder="请选择">
                            <el-option v-for="item in state.select.comment.allow" :key="item.value" :label="item.label" :value="item.value">
                                <span class="font-13">{{ item.label }}</span>
                                <small class="text-muted float-end">{{ item.value }}</small>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="是否显示评论" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">显示评论：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.struct.json.comment.show" class="d-block custom font-13" placeholder="请选择">
                            <el-option v-for="item in state.select.comment.show" :key="item.value" :label="item.label" :value="item.value">
                                <span class="font-13">{{ item.label }}</span>
                                <small class="text-muted float-end">{{ item.value }}</small>
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <el-button v-on:click="state.status.dialog = false">取 消</el-button>
            <el-button v-on:click="method.save()" :loading="state.status.wait">保 存</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import cache from '{src}/utils/cache'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    cache: {
        name: 'article',
        json: {
            editor: 'tinymce'
        }
    },
    struct: {
        key: 'ARTICLE',
        json: {
            'comment': {
                'allow': 1, 'show': 1
            },
            'audit': 1,
        }
    },
    status: {
        finish: false,
        loading: true,
        dialog: false
    },
    select: {
        editor: [
            { value: 'tinymce', label: '富文本'},
            { value: 'vditor', label: 'Markdown' },
        ],
        comment: {
            allow: [
                { value: 1, label: '允许' },
                { value: 0, label: '禁止' },
            ],
            show: [
                { value: 1, label: '显示' },
                { value: 0, label: '隐藏' },
            ]
        },
        audit: [
            { value: 1, label: '开启', subtitle: '严格一点，防止乱搞' },
            { value: 0, label: '关闭', subtitle: '宽松一点，方便用户' },
        ]
    }
})

onMounted(async () => {
    await method.init()
})

const method = {
    init: async () => {

        method.cache()

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
        cache.set(state.cache.name, { ...state.cache.json, editor: value })
    },
    show() {
        if (!state.status.finish) return notyf.warn('配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    save: async () => {

        state.status.wait   = true

        const { code, msg } = await axios.post('/api/config/save', {
            ...state.struct,
            json: JSON.stringify(state.struct.json)
        })

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false

        cache.set(state.cache.name, state.cache.json)
    },
    // 获取缓存
    cache: (json = state.cache.json) => {

        // 缓存存在 - 直接返回
        if (cache.has(state.cache.name)) {
            state.cache.json = cache.get(state.cache.name)
            return
        }

        // 缓存不存在 - 保存缓存
        cache.set(state.cache.name, json)
    },
}

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>