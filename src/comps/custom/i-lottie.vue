<!-- 组件二次封装 -->
<template>
    <span class="i-lottie">
        <span ref="dest"></span>
    </span>
</template>

<script setup>
import axios from 'axios'
import lottie from 'lottie-web'
import utils from '{src}/utils/utils'

const dest  = ref(null)
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
    opts: {
        type: Object,
        default: () => ({
            loop: true,
            autoplay: true,
            animationData: {},
        })
    }
})
const state = reactive({
    lottie: Animation | null
})

nextTick(async () => {
    await method.init()
})

const method = {
    init: async () => {
        const data = await axios.get(`/assets/json/lottie/${props.name}.json`)
        if (utils.is.empty(data)) return
        const item = lottie.loadAnimation({
            container: dest.value,          // 选择渲染dom
            autoplay: props.modelValue,     // 自动播放
            loop: true,                     // 循环播放
            renderer: 'svg',                // 渲染格式
            animationData: data,            // 渲染动效json
            // ...props.opts,                  // 其他参数
        })

        state.lottie = item
    }
}

watch(() => props.modelValue, (value) => {
    if (state.lottie === null) return
    if (value) {
        state.lottie?.play()
    } else {
        state.lottie?.stop()
    }
})
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