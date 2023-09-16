<template>
    <span v-if="state.lottie.show" class="wh-30px position-relative upgrade-system">
<!--        <i v-if="state.lottie.play" class="red-dot">.</i>-->
        <i-lottie name="bell" v-model="state.lottie.play" v-on:click="state.item.dialog = true" class="lottie"></i-lottie>
    </span>
    <teleport to="body">
        <el-dialog v-model="state.item.dialog" class="custom pt-0 pb-0" :close-on-click-modal="false" v-on:close="method.close">
            <template #header>
                <strong class="font-14">
                    <span>{{ state.struct.title }}：</span>
                    <span class="me-1">{{ state.struct.result?.theme?.title }}</span>
                    <span class="me-1">{{ method.progress(state.struct.progress) }}版本</span>
                    <span>{{ state.struct.version }}</span>
                </strong>
            </template>
            <template #default>
                <div v-if="!state.loading.finish">
                    <el-alert type="success" :closable="false" center class="box-shadow-light">
                        <template #title>
                            <i-svg name="!" size="15px" color="var(--el-color-success)"></i-svg>
                            <span class="ms-1">发现新的 inis 版本，是否立即更新？</span>
                        </template>
                    </el-alert>
                    <div v-if="!utils.is.empty(state.struct.content)" class="container-xxl mt-2 markdown">
                        <el-scrollbar max-height="400px">
                            <div v-html="method.markdown(state.struct.content)" class="white-space-line"></div>
                        </el-scrollbar>
                    </div>
                </div>
                <div v-else>
                    <el-alert type="success" :closable="false" center class="mb-3 box-shadow-light">
                        <template #title>
                            <i-svg name="!" size="15px" color="var(--el-color-success)"></i-svg>
                            <span class="ms-1">更新已完成，但还需要等待后续操作</span>
                        </template>
                    </el-alert>
                    <el-tabs v-model="state.item.tabs" id="tabs-area" class="tag">

                        <el-tab-pane name="wait">
                            <template #label>
                                <span class="fw-bolder font-12">宝塔用户等两分钟</span>
                            </template>
                            <div class="card radius-10">
                                <div class="card-body p-2">
                                    <p>如果您是宝塔用户，且满足以下条件，只需要等待两分钟即可</p>
                                    <p>1、【次要】使用了 Go项目 部署的本程序</p>
                                    <p>2、【重要】勾选了 开机启动（默认守护进程2分钟）</p>
                                    <el-image src="/assets/imgs/png/upgrade-1.png" class="w-100"></el-image>
                                </div>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane name="worry">
                            <template #label>
                                <span class="fw-bolder font-12">急！一刻都不想等</span>
                            </template>
                            <div class="card radius-10">
                                <div class="card-body p-2">
                                    <p>如果您比较着急，希望马上启动本程序，按照以下步骤操作即可</p>
                                    <p>1、找到本程序的启动按钮（windows系统双击可执行程序）</p>
                                    <p>2、点击启动项目</p>
                                    <el-image src="/assets/imgs/png/upgrade-2.png" class="w-100"></el-image>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </template>
            <template #footer>
                <div v-if="!state.loading.finish" class="modal-footer d-flex justify-content-center">
                    <el-button v-on:click="method.ignore()" :disabled="state.loading.upgrade">忽略本次更新</el-button>
                    <el-button v-on:click="method.upgrade()" :loading="state.loading.upgrade">
                        {{ state.loading.upgrade ? '正在更新' : '立即更新' }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </teleport>
</template>

<script setup>
import cache from '{src}/utils/cache'
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import MarkdownIt from 'markdown-it'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    item: {
        tabs  : 'wait',
        dialog: false,
    },
    loading: {
        finish  : false,  // 升级完成
        upgrade : false,
    },
    lottie: {
        show: false,
        play: false,
    },
    // 下个版本信息
    struct: { version: null },
    // 本地程序版本号
    version: null,
    select: {
        progress: [
            { value: 'design',  label: '设计' },
            { value: 'dev',     label: '开发' },
            { value: 'test',    label: '测试' },
            { value: 'pro',     label: '正式' },
            { value: 'abandon', label: '停止维护' },
        ],
    },
    user: cache.get('user-info') || {}
})

onMounted(async () => {
    // 只有超级管理员才有权限
    if (state.user?.result?.auth?.all === true) {
        await method.check()
    }
})

const method = {
    // 检查更新
    check: async () => {

        await method.next()
        await method.version()

        // 本地版本与最新版本对比
        if (!utils.compare.version(state.struct?.version, state.version)) return

        state.lottie.show = true

        // 忽略版本
        if (state.struct?.version === cache?.get('system-version-ignore')) return

        state.lottie.play = true
    },
    // 获取本地版本
    version: async () => {

        // 缓存名称
        const cacheName = 'system-version-local'

        if (cache.has(cacheName)) {
            state.version = cache.get(cacheName)
            return
        }

        // 缓存不存在
        const { code, data } = await axios.get('/dev/info/version')

        if (code !== 200) return

        state.version = data?.inis
        // 缓存10分钟 - 防止频繁请求
        cache.set(cacheName, data?.inis, inis.cache)
    },
    // 获取下个版本
    next: async () => {

        const cacheName = 'system-version-next'
        if (cache.has(cacheName)) {
            state.struct = cache.get(cacheName)
            return
        }

        const { data } = await axios.get('/inis/system-version/next', {
            progress: 'pro'
        })
        state.struct = data
        // 缓存10分钟 - 防止频繁请求
        cache.set(cacheName, data, inis.cache)
    },
    // 查找版本
    progress: value => {
        const item = state.select.progress.find(item => item.value === value)
        return item ? item.label : ''
    },
    // 解析Markdown
    markdown: content => {
        const md   = new MarkdownIt()
        return md.render(content)
    },
    // 升级
    upgrade: async () => {

        // 删除缓存 - 防止升级完成导致重复升级
        cache.del('system-version-local')

        state.loading.upgrade = true

        const { code, msg }   = await axios.post('/api/upgrade/system', {
            id: state.struct?.id
        })

        if (code !== 200) {
            state.loading.upgrade = false
            return notyf.error(msg)
        }

        state.lottie.play     = false
        state.loading.finish  = true
        state.loading.upgrade = false

        notyf.success('升级成功！')
    },
    // 忽略本次更新
    ignore: async () => {
        // 忽略一周
        cache.set('system-version-ignore', state.struct?.version, 7 * 24 * 60)
        state.lottie.play = false
        state.item.dialog = false
    },
    // 关闭对话框
    close: () => {
        // 更新完成之后关闭的对话框
        if (state.loading.finish) {
            // 隐藏lottie
            state.lottie.show = false
        }
    },
}
</script>