<template>
    <el-carousel v-loading="!state.banner.show" v-if="state.banner.show" :interval="10 * 1000" trigger="click" height="250px" class="color-thief" arrow="always">
        <el-carousel-item v-for="(item, index) in state.banner.list" :key="item.id">
            <el-image v-on:load="method.load($event.target, index)" v-on:click="method.jump(item.url, item.target)"
                 :src="item.image" crossorigin="anonymous" fit="cover" class="w-100 pointer" style="height: 230px">
            </el-image>
            <div class="carousel-footer" ref="carousel-footer">
                <p class="title mb-3 ms-3">
                    <span v-if="!utils.is.empty(item.title)" class="font-white font-17 me-2">{{ item.title }}</span>
                    <span v-if="!utils.is.empty(item.title)" class="font-white font-17">{{ item.content }}</span>
                </p>
            </div>
        </el-carousel-item>
    </el-carousel>
</template>

<script setup>
import ColorThief from 'colorthief'
import utils from '{src}/utils/utils'
import { useBannerStore } from '{src}/store/banner'

const { ctx, proxy } = getCurrentInstance()

const router = useRouter()
const store  = {
    banner: useBannerStore(),
}
const state  = reactive({
    // 轮播图
    banner: {
        show: false,
        list: store.banner.getCurrent,
    },
})

const method = {
    init: async () => {
        await method.banner()
    },
    // 图片加载完成后，获取图片主色调
    load: async (img, index) => {
        const color = await (new ColorThief).getColor(img)
        proxy.$refs['carousel-footer'][index].style.background = `rgb(${color.join(',')})`
    },
    // 获取轮播图
    banner: async () => {

        const { data } = await store.banner.setCurrent()

        if (utils.is.empty(data)) return

        state.banner.show = true
        state.banner.list = data
    },
    // 跳转链接
    jump: (url = '', target = '_blank') => {

        // 正则匹配 url 是否合法网址
        const reg = new RegExp(/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?(\?[\w.-=&]*)?$/i)
        if (!reg.test(url)) return

        if (!utils.in.array(target, ['_self','_blank','_parent','_top'])) target = '_blank'
        // 跳转
        window.open(url, target)
    },
}

onMounted(async () => {
    await method.init()
})
</script>