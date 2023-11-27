<template>
    <div class="container-fluid container-box px-2 px-lg-3">
        <div class="row position-relative">
            <div v-if="!state.load.mutual" class="mutual d-lg-block d-none">
                <div class="position-fixed">
                    <el-badge v-for="(item, index) of state.mutual" :key="index" :value="item.count" :max="99" :hidden="item.count === 0" type="primary" class="item position-relative shake-little-hover">
                        <span v-on:click="method.mutual.switch(state.struct.id, index)">
                            <i-svg :name="index.toString()" :size="item.size" :color="item.action"></i-svg>
                        </span>
                    </el-badge>
                </div>
            </div>
            <div v-loading="state.load.item" class="col-lg-9 px-2">
                <div class="card mb-lg-3 mb-2">
                    <div class="card-body">
                        <h3 class="text-dark fs-2 mt-0 fw-medium">{{ state.struct.title }}</h3>
                        <div class="d-flex align-items-center mt-2">
                            <el-avatar :src="state.struct?.result?.author?.avatar" size="small"></el-avatar>
                            <span class="text-dark font-16 ms-2">{{ state.struct?.result?.author?.nickname }}</span>
                            <small class="badge badge-outline-warning item right ms-1 scale-90">{{ state.struct?.result?.author?.title }}</small>
                            <span class="text-muted mx-2">|</span>
                            <span class="me-1">{{ method.nature(state.struct?.create_time) }}</span>
                            <span>发表了本文</span>
                        </div>
                        <atom-banner-simple v-model="state.struct.covers" class="mt-3"></atom-banner-simple>
                        <div v-html="state.struct.content" v-plyr v-highlight class="content markdown mt-3"></div>
                    </div>
                </div>
                <comment-body v-model="state.struct.id" type="article" :total="state.struct.result?.comment?.count"></comment-body>
            </div>
            <div class="col-lg-3 sticky">
                <div class="card bg-white-only mb-lg-3 mb-2">
                    <div class="card-body p-2">
                        <div class="d-flex">
                            <span class="d-flex align-items-center justify-content-center position-relative" style="width: 65px; height: 65px">
                                <i-lottie name="avatar/crane" v-model="state.avatar" width="70px" height="70px" class="z-index-9"></i-lottie>
                                <el-avatar :src="state.struct?.result?.author?.avatar" :size="52" style="top: 10px; left: 5px" class="avatar-shadow position-absolute"></el-avatar>
                            </span>
                            <div class="d-flex flex-column justify-content-center ms-2">
                                <span class="font-18 text-dark d-flex align-items-center">
                                    <span class="text-dark font-16 me-2">{{ state.struct?.result?.author?.nickname }}</span>
                                    <small class="badge-outline-info rounded-pill item right px-2 font-12 radius-10 d-flex align-items-center scale-90">
                                        <span class="fw-bold">LV.{{ state.struct?.result?.author?.result?.level?.current?.value }}</span>
                                    </small>
                                </span>
                                <small class="text-secondary">{{ state.struct?.result?.author?.description || '这个人很懒，什么都没留下！' }}</small>
                            </div>
                        </div>
                    </div>
                    <span class="w-100 h-1px bg-light"></span>
                    <div v-if="!state.load.item" class="d-flex justify-content-center px-2 py-3">

                        <el-tooltip :content="'有 ' + state.struct.result?.like?.length + ' 人点赞'" :disabled="!state.struct.result?.like?.length" placement="top">
                            <span class="d-flex align-items-center mx-1 pointer">
                                <i-svg name="like" size="14px" color="#6c757dc4"></i-svg>
                                <span class="ms-1">{{ state.struct.result?.like?.length || 0 }}</span>
                            </span>
                        </el-tooltip>
                        <el-tooltip :content="'有 ' + state.struct.result?.collect?.length + ' 人收藏'" :disabled="!state.struct.result?.collect?.length" placement="top">
                            <span class="d-flex align-items-center mx-1 pointer">
                                <i-svg name="collect" size="15px" color="#6c757dc4"></i-svg>
                                <span class="ms-1">{{ state.struct.result?.collect?.length || 0 }}</span>
                            </span>
                        </el-tooltip>
                        <el-tooltip :content="'有 ' + state.struct.views + ' 次浏览'" :disabled="!state.struct.views" placement="top">
                            <span class="d-flex align-items-center mx-1 pointer">
                                <i-svg name="book-white" size="14px" color="#6c757dc4"></i-svg>
                                <span class="ms-1">{{ state.struct.views || 0 }}</span>
                            </span>
                        </el-tooltip>
                        <el-tooltip :content="'有 ' + state.struct.result?.comment?.count + ' 条评论'" :disabled="!state.struct.result?.comment?.count" placement="top">
                            <span class="d-flex align-items-center mx-1 pointer">
                                <i-svg name="comment" size="12px" color="#6c757dc4"></i-svg>
                                <span class="ms-1">{{ state.struct.result?.comment?.count || 0 }}</span>
                            </span>
                        </el-tooltip>
                        <el-tooltip :content="'被分享了 ' + state.struct.result?.share?.length + ' 次'" :disabled="!state.struct.result?.share?.length" placement="top">
                            <span class="d-flex align-items-center mx-1 pointer">
                                <i-svg name="share" size="16px" color="#6c757dc4"></i-svg>
                                <span class="ms-1">{{ state.struct.result?.share?.length || 0 }}</span>
                            </span>
                        </el-tooltip>
                    </div>
                    <div v-if="!utils.is.empty(state.struct.result?.tags)" class="card-body pt-0 py-3 px-3">
                        <p class="mb-1 fw-medium font-14 d-flex align-items-center">
                            <span class="me-1 w-4px h-10px bg-info radius-4"></span>
                            文章标签
                        </p>
                        <div class="card box-shadow-wrap-normal mb-0">
                            <div class="d-flex tags p-1">
                                <span v-for="item in state.struct.result?.tags" :key="item.id" class="item pointer py-1 px-2 scale-90">
                                    <el-tooltip :content="item.description" :disabled="!item.description" placement="top">
                                        {{ item.name }}
                                    </el-tooltip>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-if="!utils.is.empty(state.struct.result?.group)" class="card-body pt-0 py-3 px-3">
                        <p class="mb-1 fw-medium font-14 d-flex align-items-center">
                            <span class="me-1 w-4px h-10px bg-info radius-4"></span>
                            文章分类
                        </p>
                        <div class="card box-shadow-wrap-normal mb-0 tags">
                            <p v-for="item in state.struct.result?.group" :key="item.id" class="py-2 ps-3 mb-0 pointer item">
                                <el-tooltip :content="item.description" :disabled="!item.description" placement="top">
                                    <span>{{ item.name }}</span>
                                </el-tooltip>
                            </p>
                        </div>
                    </div>
                    <div v-if="state.group.show" class="card-body pt-0 py-3 px-3">
                        <p class="mb-1 fw-medium font-14 d-flex align-items-center">
                            <span class="me-1 w-4px h-10px bg-info radius-4"></span>
                            其它文章
                        </p>
                        <div v-loading="state.group.load" class="card box-shadow-wrap-normal mb-0 tags">
                            <p v-for="item in state.group.list" :key="item.id" class="py-2 ps-3 mb-0 pointer item">
                                <span v-on:click="push({ name: 'index-theme-detail', params: { id: item.id }})" class="d-flex">{{ item.title }}</span>
                            </p>
                        </div>
                    </div>
                    <div v-if="state.tags.show" class="card-body pt-0 py-3 px-3">
                        <p class="mb-1 fw-medium font-14 d-flex align-items-center">
                            <span class="me-1 w-4px h-10px bg-info radius-4"></span>
                            相关文章
                        </p>
                        <div v-loading="state.tags.load" class="card box-shadow-wrap-normal mb-0 tags">
                            <p v-for="item in state.tags.list" :key="item.id" class="py-2 ps-3 mb-0 pointer item">
                                <span v-on:click="push({ name: 'index-theme-detail', params: { id: item.id }})" class="d-flex">{{ item.title }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <teleport to="body">
        <atom-share v-model="state.dialog.share" :struct="state.struct" type="article"></atom-share>
    </teleport>
</template>

<script setup>
import MarkdownIt from 'markdown-it'
import cache from '{src}/utils/cache'
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import { push } from '{src}/utils/route'
import AtomShare from '{src}/comps/index/atom/share.vue'
import CommentBody from '{src}/comps/index/atom/comment/body.vue'
import AtomBannerSimple from '{src}/comps/index/atom/banner/simple.vue'
import { useCommStore } from '{src}/store/comm'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

const { ctx, proxy } = getCurrentInstance()

const route = useRoute()
const store = {
    comm: useCommStore(),
}
const state = reactive({
    avatar: true,
    user: cache.get('user-info'),
    id: route.params?.id,
    load: {
        buy: false,
        item: false,
        mutual: true,
        markdown: true,
    },
    struct: {},
    dialog: {
        share: false,
        delivery: false,
    },
    // 是否为移动端
    mobile: false,
    // 交互元素 - 点赞、评论、收藏、分享
    mutual: {
        like: { size: '20px' },
        share: { size: '22px' },
        comment: { size: '18px' },
        collect: { size: '22px' },
    },
    item: {
        progress: {},
    },
    group: {
        load: false,
        show: false,
        list: [],
    },
    tags: {
        load: false,
        show: false,
        list: [],
    }
})

const method = {
    // 初始化
    init: async (load = true) => {

        // 未指定ID - 返回首页
        if (utils.is.empty(state.id)) return push({ path: '/' })

        state.load.item = load

        const { code, data } = await axios.get('/api/article/one', {
            id: state.id,
        })

        state.load.item = false

        // 未找到内容 - 返回首页
        if (code !== 200) return push({ path: '/' })

        // 解析Markdown
        if (data?.editor === 'vditor') {
            data.content = method.markdown(data.content)
        }

        state.struct = data

        await nextTick(() => method.fancybox())

        method.mutual.init(data?.result)
        // 相关文章
        method.tags()
        // 同类文章
        method.group()
    },
    // 查询分组内的数据
    group: async () => {

        state.group.load = true

        // 字符串转数组，去重，去空，转int
        let ids = [...new Set(state.struct?.group?.split('|').filter(item => !utils.is.empty(item)))].map(item => parseInt(item))

        if (utils.is.empty(ids)) {
            state.group.load = false
            state.group.show = false
            return
        }

        let like = ids.map(item => ['group', `%|${item}|%`])

        const { code, data } = await axios.get('/api/article/all', {
            like: like, limit: 5, field: 'id,title', not: ['id', state.struct?.id]
        })

        state.group.load = false

        if (code !== 200) return

        state.group.show = !utils.is.empty(data?.data)

        state.group.list = data?.data
    },
    // 查询标签内的数据
    tags: async () => {

        state.tags.load = true

        // 字符串转数组，去重，去空，转int
        let ids = [...new Set(state.struct?.tags?.split('|').filter(item => !utils.is.empty(item)))].map(item => parseInt(item))

        if (utils.is.empty(ids)) {
            state.tags.load = false
            state.tags.show = false
            return
        }

        let like = ids.map(item => ['tags', `%|${item}|%`])

        const { code, data } = await axios.get('/api/article/all', {
            like: like, limit: 5, field: 'id,title', not: ['id', state.struct?.id]
        })

        state.tags.load = false

        if (code !== 200) return

        state.tags.show = !utils.is.empty(data?.data)

        state.tags.list = data?.data
    },
    // 交互元素
    mutual: {
        // 获取交互元素
        init: (result = {}) => {

            const uid = state.user?.id

            state.load.mutual = true

            const field = ['like', 'comment', 'collect', 'share']
            for (const item of field) {
                // 评论特殊处理
                if (item === 'comment') {
                    state.mutual[item].count  = result[item].count || 0
                    state.mutual[item].action = 'rgb(var(--inis-gray))'
                } else {
                    state.mutual[item].ids    = result[item].map(item=>parseInt(item)) || []
                    state.mutual[item].count  = result[item].length || 0
                    state.mutual[item].action = utils.in.array(uid, state.mutual[item].ids) ? 'rgb(var(--assist-color))' : 'rgb(var(--inis-gray))'
                }
            }

            state.load.mutual = false
        },
        // 点赞
        switch: async (id = null, type = 'like') => {

            if (utils.in.array(type, ['like', 'collect'])) return method.mutual.submit(id, type)
            else if (type === 'share') {
                state.dialog.share = true
            }

            if (type === 'comment') return notyf.info('暂未开放评论功能！')
        },
        // 提交
        submit: async (id = null, type = 'like') => {

            const uid  = state.user?.id
            let status = utils.in.array(uid, state.mutual[type].ids) ? 0 : 1

            const { code, msg } = await axios.post('/api/exp/' + type, {
                bind_id: id, bind_type: 'article', state: status
            })

            // 登录
            if (code === 401) return store.comm.switchAuth('login', true)
            if (code !== 200) return notyf.error(msg)

            await method.init(false)
        },
        // 分享
        share: async () => {},
        // 评论
        comment: () => {},
    },
    // 解析Markdown
    markdown: content => {
        const md = new MarkdownIt({
            html: true,
        })
        state.load.markdown = false
        return md.render(content)
    },
    // 复制
    copy: (text = null, message = '') => {
        if (utils.is.empty(text)) return
        utils.set.copy.text(text)
        if (!utils.is.empty(message)) notyf.success(message)
    },
    // 人性化时间
    nature: value => utils.time.nature(value),
    // 图片预览
    fancybox: () => {
        const images = Array.from(document.querySelectorAll('.content img'))
        images.map(item=> {
            item.classList.add('pointer')
            item.addEventListener('click', () => {
                Fancybox.fromNodes(images, {
                    Toolbar: {
                        display: {
                            left: ['infobar'],
                            right: ['slideshow', 'download', 'thumbs', 'close'],
                            middle: ['zoomIn','zoomOut','toggle1to1','rotateCCW','rotateCW','flipX','flipY'],
                        },
                    },
                    // 显示第几张图片
                    startIndex: images.indexOf(item),
                })
            })
        })
    }
}

onMounted(async () => {
    state.mobile = utils.is.mobile()
    await method.init()
})

// 加载进度动画
watch(() => state.load.item, (value) => {
    store.comm.progress = value
    // 加载完成 - 滚动到顶部
    if (!value) utils.to.scroll(0, 0)
})

watch(() => route.params?.id, (value) => {
    if (utils.is.empty(value)) return
    state.id = value
    method.init()
})
</script>

<style lang="css" scoped>
.mutual{
    position: absolute;
    top: 60px;
    left: -80px;
}
.mutual .item {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    background: #fff no-repeat;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 rgba(50,50,50,.04);
    cursor: pointer;
}
.mutual .item .count{
    position: absolute;
    top: 0;
    right: 0;
    left: 75%;
    height: 17px;
    width: 17px;
    padding: 0 5px;
    border-radius: 9px;
    font-size: 11px;
    text-align: center;
    white-space: nowrap;
    background-color: #c2c8d1;
    color: #fff;
    box-shadow: 0 2px 4px 0 rgba(50,50,50,.04);
}
.sticky > :nth-last-child(1){
    position: sticky;
    top: 4rem;
}
</style>