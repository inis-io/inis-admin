<template>
    <div v-if="state.active.show" v-loading="state.active.load" class="card mb-0 mt-2 mt-lg-3">
        <div class="card-header d-flex justify-content-between py-3 ps-3 bg-image">
            <span class="font-16 line-height-20 text-dark">{{ state.month }}月社区贡献榜</span>
            <span v-on:click="state.item.dialog = true" class="font-13 text-info fw-medium pointer">如何上榜</span>
        </div>
        <div class="card-body p-2">
            <div v-for="(item, index) in state.active.list" :key="item.id" class="my-2 d-flex align-items-center position-relative">
                <span v-html="method.active(index + 1)" style="width: 30px;"></span>
                <el-tooltip :content="`${item.nickname}：${item.description}`" :disabled="!item.description" placement="right">
                    <el-avatar :src="item.avatar" :size="40" :class="`avatar-shadow ${item.description ? 'pointer' : ''}`"></el-avatar>
                </el-tooltip>
                <span class="d-flex flex-column ms-2">
                    <span class="d-flex align-items-center">
                        <span class="font-15 fw-medium text-dark me-1">{{ item.nickname }}</span>
                    </span>
                    <small>本月活跃 {{ utils.format.number(item.count) }} 次</small>
                </span>
                <span class="position-absolute end-0 fs-bolder">{{ utils.format.number(item.exp || 0) }}</span>
            </div>
        </div>
    </div>

    <teleport to="body">
        <el-dialog v-model="state.item.dialog" class="custom">
            <template #header>
                <div class="flex-center">
                    <el-image src="/assets/imgs/logo-white.png" style="height: 52px" class="my-1 py-1"></el-image>
                </div>
            </template>
            <template #default>
                <div class="bg-white p-3 radius-10">
                    <el-alert type="success" :closable="false" class="mb-3">
                        <template #title>
                            <p class="mb-0">完成以下每日任务，可以获得对应的经验值</p>
                        </template>
                    </el-alert>
                    <el-table :data="state.rules" stripe style="width: 100%" class="custom simple">
                        <el-table-column prop="name" label="名称"></el-table-column>
                        <el-table-column prop="exp" label="经验值">
                            <template #default="scope">
                                +{{ scope.row.exp }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="count" label="次/日"></el-table-column>
                    </el-table>
                </div>
            </template>
        </el-dialog>
    </teleport>
</template>

<script setup>
import utils from '{src}/utils/utils'
import axios from '{src}/utils/request'

const state  = reactive({
    item: {
        dialog: false,
    },
    active: {
        load: false,
        show: false,
        list: [],
    },
    // 当前月份
    month: null,
    rules: [{
        name: '签到',
        exp: 30,
        count: 1,
    },{
        name: '登录',
        exp: 5,
        count: 1,
    },{
        name: '点赞',
        exp: 1,
        count: 10,
    },{
        name: '收藏',
        exp: 1,
        count: 10,
    },{
        name: '访问',
        exp: 1,
        count: 10,
    },{
        name: '分享',
        exp: 1,
        count: 10,
    },{
        name: '评论',
        exp: 1,
        count: 10,
    }]
})

const method = {
    init: async () => {

        state.active.load = true

        const { code, data } = await axios.get('/api/exp/active', {
            limit: 8,
        })

        state.active.load = false

        if (code !== 200) return

        state.active.list = data
    },
    // 排行榜
    active: (index = 1) => {
        let result = {}
        switch (index) {
            case 1:
                result = {text: '1st', color: 'var(--bs-pink)'}
                break;
            case 2:
                result = {text: '2nd', color: 'var(--bs-orange)'}
                break;
            case 3:
                result = {text: '3rd', color: 'var(--bs-green)'}
                break;
            default:
                result = {text: index + 'th', color: 'var(--bs-gray)'}
                break;
        }
        return `<span style="color: ${result.color};"><span class="fw-bold">${result.text}</span></span>`
    },
    // 获取当前的月份
    month: () => {
        const date  = new Date()
        state.month = date.getMonth() + 1
    }
}

onMounted(() => {
    method.init()
    method.month()
})

// 监听用户活跃度数据
watch(() => state.active.list, value => {
    // 如果数据不为空，则显示
    state.active.show = !utils.is.empty(value)
})
</script>