<template>
    <div v-loading="state.status.init" class="card mb-3">
        <div class="card-body">
            <i-svg name="upgrade" size="50px" color="rgb(var(--assist-color))" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        <strong class="text-success">默认主题也就是当前您看到的后台</strong><br>
                        ● 默认主题一般情况下是自动升级的，在超级管理员权限下检查到新版本会自动升级<br>
                        ● 自动升级检查10分钟会检查一次，也可以通过当前卡片的功能手动检查并进行升级
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">默认主题</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-button v-on:click="method.init(false)" :loading="state.status.loading" type="primary" size="small" round plain style="margin: 4px 0">
                    <span>检 查 更 新</span>
                </el-button>
                <el-button v-if="state.show.upgrade" v-on:click="method.upgrade" :loading="state.status.upgrade" type="primary" size="small" round plain class="ms-2" style="margin: 4px 0">
                    <span>升 级</span>
                </el-button>
                <el-button v-on:click="method.show" type="primary" size="small" round class="ms-2" style="margin: 4px 0">
                    <span>日 志</span>
                </el-button>
            </h2>
            <div class="d-flex justify-content-between">
                <span>当前版本：{{ state.version }}</span>
                <span>最新版本：{{ state.struct.version || '∞' }}</span>
            </div>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">更新日志</strong>
        </template>
        <template #default>
            <div v-if="!utils.is.empty(state.struct)" class="container-xxl">
                <div class="d-flex justify-content-between align-items-center px-2 mb-2">
                    <el-tooltip :content="`${state.struct.result?.author?.nickname}：${state.struct.result?.author?.description}`" placement="top">
                        <div class="d-flex align-items-center pointer">
                            <el-avatar :src="state.struct.result?.author?.avatar" :size="25" class="avatar-shadow mirror-scan"></el-avatar>
                            <span class="font-13 ms-1">{{ state.struct.result?.author?.nickname }}</span>
                        </div>
                    </el-tooltip>
                    <span class="font-13">时间：{{ utils.time.to.date(state.struct?.create_time) }}</span>
                </div>
                <div class="el-alert el-alert--success is-light box-shadow-light d-flex justify-content-between">
                    <span>{{ state.struct.title }}</span>
                    <span class="d-flex align-items-center">
                        <i-svg name="dot" :color="method.color(state.struct.progress).color" size="20px"></i-svg>
                        {{ method.color(state.struct.progress).text }}：{{ state.struct.version }}
                    </span>
                </div>
                <div v-if="!utils.is.empty(state.struct.content)" class="mt-2 markdown">
                    <el-scrollbar max-height="400px">
                        <div v-html="method.markdown(state.struct.content)" class="white-space-line"></div>
                    </el-scrollbar>
                </div>
            </div>
            <div v-else class="container-xxl">
                <div class="el-alert el-alert--success is-light box-shadow-light flex-center">
                    无更新日志
                </div>
            </div>
        </template>
        <template #footer>
            <el-button v-on:click="state.status.dialog = false">
                取 消
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import MarkdownIt from 'markdown-it'
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    struct: {},
    status: {
        init:     true,
        finish:   false,
        dialog:   false,
        loading:  true,
        upgrade:  false,
    },
    show: {
        upgrade: false,
    },
    version: inis.version
})

const method = {
    init: async (init = true) => {

        state.status.init    = init
        state.status.loading = true

        const { code, data } = await axios.get('/inis/theme-version/next', {
            theme_key: 'inis', progress: 'pro'
        })

        state.status.init    = false
        state.status.loading = false

        if (code !== 200) return

        state.struct = data
    },
    // 升级
    upgrade: async () => {

        state.status.upgrade = true

        const { code, msg } = await axios.post('/api/upgrade/theme', {
            id: state.struct?.id
        })

        state.status.upgrade = false

        if (code !== 200) notyf.error(msg)

        notyf.success('升级成功！')
        await method.init(false)
    },
    show() {
        state.status.dialog = true
    },
    // 解析Markdown
    markdown: content => {
        const md   = new MarkdownIt()
        return md.render(content)
    },
    color : value => {
        switch (value) {
            case 'design':  return { color: 'var(--bs-secondary)', text: '设计中' }
            case 'dev':     return { color: 'var(--bs-primary)',   text: '开发版' }
            case 'test':    return { color: 'var(--bs-warning)',   text: '测试版' }
            case 'pro':     return { color: 'var(--bs-success)',   text: '正式版' }
            case 'abandon': return { color: 'var(--bs-danger)',    text: '停止维护' }
            default:        return { color: 'var(--bs-light)',     text: '未知' }
        }
    },
}

onMounted(async () => {
    await method.init()
})

// 监听版本变化
watch(() => state.struct, (item = {}) => {
    state.show.upgrade = utils.compare.version(item.version, state.version)
})

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>