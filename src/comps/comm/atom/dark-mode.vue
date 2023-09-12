<template>
    <span v-on:click="method.switch()" class="i-lottie">
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
    width: {
        type: [String, Number],
        default: '70px'
    },
    height: {
        type: [String, Number],
        default: '42px'
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
    lottie: {
        playSegments: () => {},
    },
    night: false,
})

nextTick(async () => {
    await method.init()
})

const method = {
    init: async () => {
        const data = await axios.get(`/assets/json/lottie/dark-mode.json`)
        if (utils.is.empty(data)) return
        const item = lottie.loadAnimation({
            container: dest.value,          // 选择渲染dom
            autoplay: false,                // 自动播放
            loop: false,                     // 循环播放
            renderer: 'svg',                // 渲染格式
            animationData: data,            // 渲染动效json
        })

        // 设置播放帧，并停止
        item.goToAndStop(state.night ? 160 : 80, true)
        // 播放速度
        item.setSpeed(2)

        state.lottie = item
    },
    switch: () => {
        state.night = !state.night
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
watch(() => state.night, (value) => {
    if (value) {
        state.lottie?.playSegments([70, 160], true)
    } else {
        state.lottie?.playSegments([0, 80], true)
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