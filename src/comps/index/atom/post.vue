<template>
    <!-- 文章分组 - 开始 -->
    <div class="d-flex mb-lg-3 mb-2 position-relative">
        <el-dropdown class="custom mimic me-1 text-ls-6px radius-5 scroll-item" trigger="click">
            <span class="el-dropdown-link d-flex align-items-center">
                {{ state.item.sort }}
                <i-svg name="down"></i-svg>
            </span>
            <template #dropdown>
                <el-dropdown-item v-on:click="method.order('top desc, views desc', '热门')">热门</el-dropdown-item>
                <el-dropdown-item v-on:click="method.order('top desc, create_time desc', '最新')">最新</el-dropdown-item>
                <el-dropdown-item v-on:click="method.order('top desc, create_time asc', '最早')">最早</el-dropdown-item>
            </template>
        </el-dropdown>
        <el-scrollbar v-loading="state.group.load" style="max-width: calc(100% - 130px)">
            <div class="d-flex">
                <button v-for="item in state.group.list" :key="item.id" v-on:click="method.like(item.id)" type="button"
                    :class="'btn mx-1 btn-auto mimic radius-5 scroll-item' + (state.group.action === item.id ? ' action' : '')">
                    <el-tooltip :disabled="utils.is.empty(item.description)" :content="item.description" placement="top">
                        <div class="d-flex align-items-center">
                            <el-avatar v-if="!utils.is.empty(item.avatar)" :src="item.avatar" :size="16"></el-avatar>
                            <span class="px-1">{{ item.name }}</span>
                        </div>
                    </el-tooltip>
                </button>
            </div>
        </el-scrollbar>
        <div class="d-flex position-absolute end-0">
            <el-tooltip content="刷新" placement="top">
                <button v-on:click="method.refresh" class="btn btn-auto mimic radius-5 scrollbar-demo-item" type="button">
                    <i-svg name="refresh"></i-svg>
                </button>
            </el-tooltip>
        </div>
    </div>
    <!-- 文章分组 - 结束 -->

    <!-- 文章列表 - 开始 -->
    <div class="row">
        <div v-if="!utils.is.empty(state.article.list)" v-for="item in state.article.list" :key="item.id" class="col-lg-6">
            <div class="card mb-lg-3 mb-2 ribbon-box">
                <div class="card-body p-2">
                    <div v-if="item.top === 1 && !state.article.load" class="ribbon-two ribbon-two-danger">
                        <span class="fw-medium">置顶</span>
                    </div>
                    <skeleton-img-text v-model="state.article.load">
                        <atom-banner-cover v-model="item.covers" class="mask pointer"
                            v-on:click="push({ name: 'index-article-detail', params: { id: item.id }})">
                            <template #footer>
                                <span class="d-flex">
                                    <span class="d-flex align-items-center">
                                        <i-svg name="book" size="14px" color="rgb(var(--article-color))"></i-svg>
                                        <span class="ms-1">{{ item.views || 0 }}</span>
                                    </span>
                                    <span class="d-flex align-items-center ms-2">
                                        <i-svg name="comment-outline" size="18px" color="rgb(var(--article-color))"></i-svg>
                                        <span class="ms-1">{{ item.result?.comment?.count || 0 }}</span>
                                    </span>
                                </span>
                                <span>{{ utils.natureTime(item.last_update || item.update_time) }}</span>
                            </template>
                        </atom-banner-cover>
                        <p class="mb-0 mt-2 limit-1-line"> {{ item.title }}</p>
                    </skeleton-img-text>
                </div>
            </div>
        </div>
        <div v-else v-loading="state.article.load" class="col-lg-12">
            <div class="card card-body mb-0 d-flex align-items-center flex-column">
                <i-svg name="empty" size="168px"></i-svg>
                <p class="separator mb-0 text-muted">暂无内容</p>
            </div>
        </div>
    </div>
    <!-- 文章列表 - 结束 -->
</template>

<script setup>
import utils from '{src}/utils/utils'
import axios from '{src}/utils/request'
import { push } from '{src}/utils/route'
import AtomBannerCover from '{src}/comps/index/atom/banner/cover.vue'
import SkeletonImgText from '{src}/comps/index/skeleton/image-text.vue'

const router = useRouter()
const state  = reactive({
    // 文章列表
    article: {
        list: [],
        order: 'top desc, views desc',
        like: [],
        load: false
    },
    // 文章分组
    group: {
        // 选中
        action: null,
        list: [],
        load: false,
    },
    // 分页
    page: {
        show : false,
        // 当前页码
        code : 1,
        limit: 6,
        total: 1,
    },
    item: {
        sort: '排序'
    },
})

const method = {
    // 初始化 - 获取主题数据
    init: async (page = state.page.code) => {

        state.article.load = true

        const params = {
            page:  page,
            limit: state.page.limit,
            order: state.article.order,
            like:  state.article.like,
            where: 'audit = 1',
        }

        const { data: res } = await axios.get('/api/article/all', params)

        state.article.load  = false

        state.article.list  = res.data
        state.page.total    = res.page
        state.page.code     = parseInt(page)
    },
    // 主题分组
    group: async () => {

        state.group.load = true

        const { data } = await axios.get('/api/article-group/column', {
            field: 'id,name,avatar,description'
        })

        state.group.load = false
        state.group.list = data
    },
    // 设置排序方式
    order(order = 'create_time asc', sort = '排序') {
        state.item.sort     = sort
        state.article.order = order
        // 刷新
        method.init(state.page.code)
    },
    // 刷新
    refresh: () => {
        state.article.like   = []
        state.group.action = null
        method.init(state.page.code)
        method.group()
    },
    like: async (group = null) => {
        if (utils.is.empty(group)) return
        state.group.action = group
        state.article.like   = ['group', `%|${group}|%`]
        await method.init()
    }
}

onMounted(() => {
    method.init(state.page.code)
    method.group()
})
</script>


<style scoped>
.scroll-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.sticky > :nth-last-child(1){
    position: sticky;
    top: 5.8rem;
}
</style>