<template>
    <div class="position-relative">
        <el-image v-if="state.type === 'rand'" :src="method.rand()" style="height: 200px" class="w-100 d-block pointer radius-4" fit="cover">
            <template #error>
                <el-image :src="method.rand()"></el-image>
            </template>
        </el-image>
        <el-image v-else-if="state.type === 'image'" :src="state.imgs[0]" style="height: 200px" class="w-100 d-block pointer radius-4" fit="cover">
            <template #error>
                <el-image :src="method.rand()"></el-image>
            </template>
        </el-image>
        <el-carousel v-else height="200px" direction="vertical" :interval="5 * 1000">
            <el-carousel-item v-for="(item, index) in state.imgs" :key="index">
                <el-image :src="item" fit="cover" class="w-100 pointer h-100 radius-4">
                    <template #error>
                        <el-image :src="method.rand()"></el-image>
                    </template>
                </el-image>
            </el-carousel-item>
        </el-carousel>
        <div class="position-absolute top-0 start-0 end-0 p-2">
            <slot name="header"></slot>
        </div>
        <div class="cover-shadow">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup>
import utils from '{src}/utils/utils'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    }
})

const state = reactive({
    type: 'rand',
    imgs: [],
})

const method = {
    init: () => {
        let imgs = props.modelValue.split(',')
        // 去空
        state.imgs = imgs.filter(item => !utils.is.empty(item))

        // 如果没有图片，则随机一张
        if (utils.is.empty(state.imgs)) {
            state.type = 'rand'
        }
        // 如果只有一张图片，则直接显示
        else if (state.imgs.length === 1) {
            state.type = 'image'
        }
        // 如果有多张图片，则轮播
        else {
            state.type = 'carousel'
        }
    },
    rand: () => '/api/file/rand?name=imgs.txt&id=' + utils.uuid()
}

onMounted(() => {
    method.init()
})
</script>