<template>
    <span v-if="state.lottie.show" class="wh-30px position-relative">
        <i class="red-dot">.</i>
        <i-lottie name="beil" v-model="state.lottie.play" v-on:click="state.item.dialog = true"></i-lottie>
    </span>
    <teleport to="body">
        <el-dialog v-model="state.item.dialog" class="custom pt-0 pb-0" :close-on-click-modal="false">
            <template #header>
                <strong class="font-14">
                    <span>{{ state.struct.title }}：</span>
                    <span class="me-1">{{ state.struct.result?.theme?.key }}</span>
                    <span class="me-1">{{ state.struct.result?.theme?.title }}</span>
                    <span class="me-1">{{ method.progress(state.struct.progress) }}版本</span>
                    <span>{{ state.struct.version }}</span>
                </strong>
            </template>
            <template #default>
                <div class="flex-center flex-column">
                    <h3>发现新的主题版本，是否立即更新？</h3>
                </div>
                <div class="container-xxl mt-2">
                    <el-scrollbar v-loading="state.loading.markdown" height="400px">
                        <div v-html="method.markdown(state.struct.content)" class="white-space-line"></div>
                    </el-scrollbar>
                </div>
            </template>
            <template #footer>
                <div class="modal-footer d-flex justify-content-center">
                    <el-button v-on:click="state.item.dialog = false">忽略本次更新</el-button>
                    <el-button v-on:click="method.upgrade()" :loading="state.loading.upgrade">
                        {{ state.loading.upgrade ? '正在更新' : '立即更新' }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </teleport>
</template>

<script setup>
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import MarkdownIt from 'markdown-it'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    item: {
        dialog: false,
    },
    loading: {
        markdown: true,
        upgrade : false,
    },
    lottie: {
        show: false,
        play: false,
    },
    struct: {},
    select: {
        progress: [
            { value: 'design',  label: '设计' },
            { value: 'dev',     label: '开发' },
            { value: 'test',    label: '测试' },
            { value: 'pro',     label: '正式' },
            { value: 'abandon', label: '停止维护' },
        ],
    },
})

onMounted(async () => {
    await method.check()
})

const method = {
    // 检查更新
    check: async () => {

        const { code, data } = await axios.get('/inis/theme-version/next', {
            theme_key: 'inis', progress: 'pro'
        })

        if (code !== 200) return

        // 本地版本与最新版本对比
        if (!utils.compare.version(inis?.version, data?.version)) return

        state.struct      = data
        state.lottie.show = true
        state.lottie.play = true
    },
    // 查找版本
    progress: value => {
        const item = state.select.progress.find(item => item.value === value)
        return item ? item.label : ''
    },
    // 解析Markdown
    markdown: content => {
        const md = new MarkdownIt()
        state.loading.markdown = false
        return md.render(content)
    },
    // 升级
    upgrade: async () => {

        state.loading.upgrade = true

        const url = await method.download()

        const { code, msg }   = await axios.post('/api/upgrade/theme', { url })

        if (code !== 200) {
            state.loading.upgrade = false
            return notyf.error(msg)
        }

        state.item.dialog     = false
        state.lottie.show     = false
        state.loading.upgrade = false

        notyf.success('升级成功！')
    },
    // 获取更新地址
    download: async () => {

        if (utils.is.empty(state.struct?.id)) return notyf.warn('未查询到更新信息')

        const { code, msg, data } = await axios.get('/inis/theme-version/download', {
            id: state.struct?.id
        })
        if (code !== 200) return notyf.error(msg)

        if (utils.is.empty(data?.url)) return notyf.warn('未查询到更新包下载地址')

        return data?.url
    },
}
</script>

<style lang="css" scoped>
.red-dot {
    display: inline-block;
    color: var(--bs-danger) !important;
    top: -38px;
    right: -3px;
    font-size: 40px;
    font-style: normal;
    position: absolute;
    animation: red-dot 1s infinite;
}
@keyframes red-dot {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>