<!-- 组件二次封装 -->
<template>
    <span class="i-lottie">
        <vue3-lottie ref="ctx" :animation-data="props.modelValue"></vue3-lottie>
    </span>
</template>

<script setup>
import { Vue3Lottie } from 'vue3-lottie'
const { ctx, proxy } = getCurrentInstance()

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    width: {
        type: [String, Number],
        default: '30px'
    },
    height: {
        type: [String, Number],
        default: '30px'
    },
})

onMounted(() => {
    const entries = Object.entries(proxy?.$refs['ctx'])
    for (const [key, value] of entries) {
        ctx[key] = value
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