<template>
    <div v-on:click="method.show()" class="card mb-lg-3 mb-2 pointer">
        <div class="card-body">
            <span class="text-dark limit-1-line font-13">
                <span class="text-muted me-2">服务</span>
                {{ method.abstract() }}
            </span>
        </div>
    </div>

    <teleport to="body">
        <el-dialog v-model="state.dialog" class="custom sm">
            <template #header>
                <div class="flex-center fw-bold fs-4">{{ state.title }}</div>
            </template>
            <template #default>
                <div class="container-xxl">
                    <div v-for="(item, index) in state.list" :key="index" class="d-flex mb-3">
                        <i-svg :name="item.icon" size="35px" color="#ff7000"></i-svg>
                        <div class="d-flex flex-column ms-2">
                            <span class="text-dark fw-medium">{{ item.title }}</span>
                            <small>{{ item.desc }}</small>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
            </template>
        </el-dialog>
        <el-drawer v-model="state.drawer" direction="btt" :show-close="false" class="radius mb-0">
            <template #header="{ close, titleId, titleClass }">
                <div :id="titleId" class="flex-center fw-medium text-dark fs-4">{{ state.title }}</div>
                <i-svg name="close" size="15px" color="#8a919f" v-on:click="close"></i-svg>
            </template>
            <template #default>
                <div class="container-xxl">
                    <div v-for="(item, index) in state.list" :key="index" class="d-flex mb-3">
                        <i-svg :name="item.icon" size="35px" color="#ff7000"></i-svg>
                        <div class="d-flex flex-column ms-2">
                            <span class="text-dark fw-medium">{{ item.title }}</span>
                            <small>{{ item.desc }}</small>
                        </div>
                    </div>
                </div>
            </template>
        </el-drawer>
    </teleport>
</template>

<script setup>
import utils from '{src}/utils/utils'
import ISvg from "{src}/comps/custom/i-svg.vue";

const state = reactive({
    drawer: false,
    dialog: false,
    mobile: false,
    list: [
        {
            icon: 'safeguard',
            title: 'UI 原创',
            desc: 'inis 官方商城，质量有保障'
        },
        {
            icon: 'safeguard',
            title: '自动发货',
            desc: '线上自动发货，付款秒到货'
        },
        {
            icon: 'safeguard',
            title: '虚拟物品不支持退款',
            desc: '因为是虚拟产品，售出概不退款'
        }
    ],
    title: '服 务 保 障',
})

const method = {
    // 显示对话框
    show: (yes = true) => {
        if (state.mobile) {
            state.drawer = yes
        } else state.dialog = yes
    },
    // 简介
    abstract: () => {
        let [result, split] = ['', ' ● ']
        for (let i = 0; i < state.list.length; i++) {
            result += state.list[i].title + split
        }
        // 去掉最后一个分隔符
        return result.substring(0, result.length - split.length)
    }
}

onMounted(async () => {
    state.mobile = utils.is.mobile()
})
</script>