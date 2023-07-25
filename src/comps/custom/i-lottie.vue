<!-- 组件二次封装 -->
<template>
    <span class="i-lottie">
        <span ref="ctx"></span>
    </span>
</template>

<script setup>
import axios from 'axios'
import lottie from 'lottie-web'
import utils from '{src}/utils/utils'
const { ctx, proxy } = getCurrentInstance()

const emit  = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: '',
        required: true
    },
    width: {
        type: [String, Number],
        default: '30px'
    },
    height: {
        type: [String, Number],
        default: '30px'
    },
    opts: () => ({
        type: Object,
        default: () => ({
            loop: true,
            autoplay: true,
            animationData: {},
        })
    })
})
const state = reactive({
    lottie: null,
})

onMounted( async () => {
    await method.init()
    const entries = Object.entries(proxy?.$refs['ctx'])
    for (const [key, value] of entries) {
        ctx[key] = value
    }
})

const method = {
    init: async () => {
        const data = await axios.get(`/assets/json/lottie/${props.name}.json`)
        if (utils.is.empty(data)) return
        state.lottie = lottie.loadAnimation({
            container: proxy.$refs['ctx'],  // 选择渲染dom
            loop: true,                     // 循环播放
            autoplay: props.modelValue,     // 自动播放
            renderer: 'svg',                // 渲染格式
            animationData: data,            // 渲染动效json
            ...props.opts,                  // 其他参数
        })
    }
}

watch(() => props.modelValue, (value) => {
    if (state.lottie === null) return
    if (value) {
        state.lottie.play()
    } else {
        state.lottie.stop()
    }
})

// onBeforeUnmount(() => {
//     proxy.$refs['ctx'].destroy()
// })
</script>

<style lang="css" scoped>
.i-lottie{
    width: v-bind('props.width');
    height: v-bind('props.height');
}
.i-lottie svg {
    display: block !important;
}
</style>