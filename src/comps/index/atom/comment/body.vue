<template>
    <div class="card mb-lg-3 mb-2">
        <div class="card-body">

            <!-- 已登录 - 开始 -->
            <div v-if="store.comm.login.finish">
                <div v-if="state.comment.pid === 0" class="d-flex align-items-center">
                    <span class="me-2">
                        <el-avatar :src="store.comm.login.user?.avatar" :size="30" class="avatar-shadow"></el-avatar>
                    </span>
                    <i-comment :bind-id="props.modelValue" :bind-type="props.type" v-on:finish="method.finish" class="text-bg-muted"></i-comment>
                </div>
            </div>
            <!-- 已登录 - 结束 -->
            <!-- 未登录 - 开始 -->
            <div v-else class="d-flex flex-column justify-content-center align-items-center">
                <button v-on:click="store.comm.switchAuth('login', true)" type="button" class="btn mx-1 btn-auto mimic action" style="border-radius: 200px;padding: 5px 15px;">
                    <span class="d-flex align-items-center">
                        <i-svg name="user" size="20px" color="rgb(var(--theme-color))"></i-svg>
                        <small class="ms-1">登 录</small>
                    </span>
                </button>
                <span class="mt-2" style="color: #999">喜欢这篇文章吗？</span>
                <small style="color: #999">别忘了点赞或赞赏，让我知道创作的路上有你陪伴！</small>
            </div>
            <!-- 未登录 - 结束 -->

            <div class="d-flex justify-content-between align-items-center mt-2">
                <span>评论 {{ utils.format.number(props.total) || 0 }}</span>
                <el-switch v-model="state.order.just" width="60" inline-prompt active-text="正序" inactive-text="倒序">
                </el-switch>
            </div>

            <!-- 评论列表 - 开始 -->
            <div v-if="state.comment.show" v-loading="state.comment.load" class="user-select-none">
                <div v-for="item in state.comment.list" :key="item.id" class="py-1">
                    <div class="d-flex align-items-center">
                        <el-avatar :src="item.result?.author?.avatar" class="avatar-shadow" :size="30"></el-avatar>
                        <span class="mx-1 font-13 fw-bolder">{{ item.result?.author?.nickname || '无昵称' }}</span>
                    </div>
                    <div class="d-flex">
                        <span class="ms-4 user-select-text comment markdown">
                            <i-markdown v-if="item.editor === 'markdown'" v-model="item.content"></i-markdown>
                            <span v-else-if="item.editor === 'html'" v-html="item.content"></span>
                            <span v-else>{{ item.content }}</span>
                        </span>
                    </div>
                    <div class="d-flex ms-4 py-1 justify-content-between">
                        <div class="d-flex text-muted">
                            <span v-on:click="method.setLike(item.id)" class="d-flex align-items-center font-13 pe-2 pointer">
                                <i-svg v-if="!utils.in.array(store.comm.login.user?.id, item.result?.like?.uids)" name="like-outline" size="15px" color="#8a8a8a" style="margin-bottom: 3px"></i-svg>
                                <i-svg v-else name="like" size="15px" color="red" style="margin-bottom: 3px"></i-svg>
                                <span class="ms-1" style="line-height:20px; margin-bottom: 2px">{{ item.result?.like?.count || 0 }}</span>
                            </span>
                            <span v-on:click="method.setPid(item.id)" class="d-flex align-items-center font-13 pointer">
                                <i-svg name="comment-outline-1" size="14px" color="#8a8a8a"></i-svg>
                                <small class="ms-1" style="line-height:20px">回复</small>
                            </span>
                        </div>
                        <div class="d-flex">
                            <span>{{ utils.natureTime(item.create_time) }}</span>
                        </div>
                    </div>
                    <div v-if="state.comment.pid === item.id" class="ps-3 pb-1">
                        <i-comment :bind-id="props.modelValue" :bind-type="props.type" :pid="item.id" v-on:finish="method.finish" class="text-bg-muted"></i-comment>
                    </div>
                    <!-- 回复列表 - 开始 -->
                    <div v-if="!utils.is.empty(item?.replies)" class="text-bg-muted ms-3 py-2 radius-5">
                        <div v-for="reply in item?.replies" :key="reply.id" class="px-2">
                            <div class="d-flex align-items-center">
                                <el-avatar :src="reply.result?.author?.avatar" class="avatar-shadow" :size="30"></el-avatar>
                                <span class="mx-1 font-13 fw-bolder">{{ reply.result?.author?.nickname || '无昵称' }}</span>
                            </div>
                            <div class="d-flex">
                                <span class="ms-4 user-select-text comment markdown">
                                    <i-markdown v-if="reply.editor === 'markdown'" v-model="reply.content"></i-markdown>
                                    <span v-else-if="reply.editor === 'html'" v-html="reply.content"></span>
                                    <span v-else>{{ reply.content }}</span>
                                </span>
                            </div>
                            <div class="d-flex ms-4 py-1 justify-content-between">
                                <div class="d-flex text-muted">
                                    <span v-on:click="method.setLike(reply.id)" class="d-flex align-items-center font-13 pe-2 pointer">
                                        <i-svg v-if="!utils.in.array(store.comm.login.user?.id, reply.result?.like?.uids)" name="like-outline" size="15px" color="#8a8a8a" style="margin-bottom: 3px"></i-svg>
                                        <i-svg v-else name="like" size="15px" color="red" style="margin-bottom: 3px"></i-svg>
                                        <span class="ms-1" style="line-height:20px; margin-bottom: 2px">{{ reply.result?.like?.count }}</span>
                                    </span>
                                    <span v-on:click="method.setPid(reply.id)" class="d-flex align-items-center font-13 pointer">
                                        <i-svg name="comment-outline-1" size="14px" color="#8a8a8a"></i-svg>
                                        <small class="ms-1" style="line-height:20px">回复</small>
                                    </span>
                                </div>
                                <div class="d-flex">
                                    <span>{{ utils.natureTime(reply.create_time) }}</span>
                                </div>
                            </div>
                            <div v-if="state.comment.pid === reply.id" class="ms-3 mb-1 box-shadow">
                                <i-comment :bind-id="props.modelValue" :bind-type="props.type" :pid="reply.id" v-on:finish="method.finish" class="bg-white"></i-comment>
                            </div>
                        </div>
                    </div>
                    <!-- 回复列表 - 结束 -->
                </div>
            </div>
            <!-- 评论列表 - 结束 -->
            <div v-else class="mb-0 d-flex align-items-center flex-column">
                <i-svg name="empty" size="168px"></i-svg>
                <p class="separator mb-0 text-muted">暂无内容</p>
            </div>

            <!-- 页码 - 开始 -->
            <div class="flex-center">
                <el-pagination :current-page="state.comment.page" :page-size="state.comment.limit" :page-count="state.comment.total" class="mt-2"
                   v-on:current-change="method.change" :disabled="state.comment.load" small background layout="prev, pager, next" hide-on-single-page>
                </el-pagination>
            </div>
            <!-- 页码 - 结束 -->
        </div>
    </div>
</template>

<script setup>
import notyf from '{src}/utils/notyf'
import utils from '{src}/utils/utils'
import axios from '{src}/utils/request'
import { useCommStore } from '{src}/store/comm'
import IComment from '{src}/comps/custom/i-comment.vue'
import IMarkdown from '{src}/comps/custom/i-markdown.vue'

const props = defineProps({
    modelValue: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        default: 'article',
        required: false
    },
    total: {
        type: Number,
        default: 0,
        required: false
    },
})

const store = {
    comm: useCommStore(),
}
const state = reactive({
    order: {
        just: false,
    },
    comment: {
        load: true,
        show: true,
        list: [],
        page: 1,
        total: 1,
        limit: 10,
        pid: 0,
    }
})

const method = {
    // 初始化评论数据
    init: async (page = state.comment.page) => {

        state.comment.load = true

        const { data: res } = await axios.get('/api/comment/flat', {
            order: state.order.just ? 'id asc' : 'id desc',
            bind_id: props.modelValue, bind_type: props.type, page, limit: state.comment.limit
        })

        const { page: total, data } = res

        state.comment.load  = false
        state.comment.list  = data
        state.comment.total = total
        state.comment.page  = parseInt(page)
    },
    // 切换页码
    change: async value => {
        state.comment.page = parseInt(value)
        await method.init(value)
    },
    // 设置 pid
    setPid: id => {

        // 如果没有登录
        if (!store.comm.login.finish) {
            // 提示登录
            store.comm.switchAuth('login', true)
            return
        }

        // 如果 id === state.comment.pid，说明是取消回复
        state.comment.pid = id === state.comment.pid ? 0 : id
    },
    // 设置 点赞
    setLike: async id => {

        // 如果没有登录
        if (!store.comm.login.finish) {
            // 提示登录
            store.comm.switchAuth('login', true)
            return
        }

        const { code, msg } = await axios.post('/api/exp/like', {
            bind_type: 'comment', bind_id: id
        })

        if (code !== 200) return notyf.info(msg)

        method.init()
    },
    // 评论完成
    finish: () => {
        state.comment.pid = 0
        method.init()
    },
}

watch(() => props.modelValue, (val) => {
    if (!utils.is.empty(val)) method.init()
})
watch(() => state.order.just, () => {
    state.comment.page = 1
    method.init()
})
watch(() => state.comment.list, (val) => {
    state.comment.show = !utils.is.empty(val)
})
</script>