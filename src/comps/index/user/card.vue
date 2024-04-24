<template>
    <div class="row">
        <div class="col-md-6">
            <div v-ripple="{ color: 'white' }" class="card mirror-scan mb-0" :style="{ background }">
                <div v-loading="state.load" class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5 class="card-title text-white fs-3">{{ state.user?.nickname }}</h5>
                            <i-badge :left="state.level?.current?.value" :right="state.level?.current?.name"></i-badge>
                            <p class="text-light pt-1 mb-2">
                                <span class="font-15 me-2">经验值</span>
                                <span class="font-note-extra-bold letter-spacing font-20">{{ state.user?.exp || 0 }}</span>
                            </p>
                        </div>
                        <i-level :value="state.level?.current?.value || 0"></i-level>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="white-space-nowrap text-white font-13 me-2">LV.{{ state.level?.current?.value }}</span>
                        <el-progress :percentage="state.progress" :stroke-width="6" color="#2481FA" striped striped-flow :duration="10" class="w-100">
                            <span class="text-white font-13">{{ state.user?.exp || 0 }} / {{ state.level?.next?.exp || 0 }}</span>
                        </el-progress>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div v-loading="state.load" class="card-body d-flex flex-column justify-content-between p-2">
                <div class="text-dark">
                    <p class="mb-0">头衔：{{ state.user?.title || ' - ' }}</p>
                    <p class="mb-0">Q&nbsp;Q：{{ QQ(state.user?.email) || ' - ' }}</p>
                    <p class="mb-0">微信：{{ state.user?.wechat || ' - ' }}</p>
                    <p class="mb-0">邮箱：{{ state.user?.email || ' - ' }}</p>
                    <div class="h-1px bg-white d-block my-2"></div>
                </div>
                <div class="text-muted">
                    <p class="mb-0">注册时间：{{ nature(state.user?.create_time) }}</p>
                    <p class="mb-0">最后登录：{{ nature(state.user?.login_time) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import utils from '{src}/utils/utils'
import axios from '{src}/utils/request'
import { defineProps, reactive, onMounted, computed } from 'vue'
import ILevel from '{src}/comps/custom/i-level.vue'
import IBadge from '{src}/comps/custom/i-badge.vue'

const props = defineProps({
    uid: { type: Number, default: null, required: true },
})

const state = reactive({
    color: '#2481FA',
    user: {},
    level: {},
    load: false,
    progress: 0,
})

// 初始化 - 获取用户信息
const init = async () => {

    state.load = true

    const { code, data } = await axios.get('/api/users/one', {
        id: props.uid,
    })

    state.load = false

    if (code !== 200) return

    state.user  = data
    state.level = data?.result?.level
}

// 人性化时间
const nature = value => utils.time.nature(value)
// 从邮箱里面解析出QQ
const QQ = email => {
    const reg   = /(\d{5,})@qq\.com/
    const match = email.match(reg)
    return (match && match.length > 1) ? match[1] : null
}

// 渐变色 - 暗
/*
 * @param {string} hex - 十六进制颜色值
 * @param {number} percent - 百分比 0-100
 * @param {number} mode - 模式 0-减少[暗] 1-增加[明]
 * @return {string} - 返回新的十六进制颜色值
 */
const GradientRamp  = (hex = '#2481FA', percent = 90, mode = 0)  => {

    // 强制 percent 为 0-100 之间的值
    percent = Math.min(100, Math.max(0, parseInt(percent)))

    hex = hex.toUpperCase()
    const hexRegExp = /^#([0-9A-F]{6})$/

    if (!hexRegExp.test(hex)) throw new Error('请传入合法的16进制颜色值，eg: #FF0000')

    let r = parseInt(hex.substring(1, 3), 16)
    let g = parseInt(hex.substring(3, 5), 16)
    let b = parseInt(hex.substring(5, 7), 16)

    r = mode === 0 ? Math.max(0, r - percent) : Math.min(255, r + percent)
    g = mode === 0 ? Math.max(0, g - percent) : Math.min(255, g + percent)
    b = mode === 0 ? Math.max(0, b - percent) : Math.min(255, b + percent)

    // 将新的RGB值转换为十六进制颜色
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const background = computed(() => {
    return `linear-gradient(30deg,
        ${GradientRamp(state.color, 90, 1)},
        ${GradientRamp(state.color, 50, 1)},
        ${GradientRamp(state.color, 10, 1)}
    )`
})

onMounted(() => init())

watch(() => state.user, () => {
    state.progress = ((state.user?.exp / state.level?.next?.exp || 1) * 100).toFixed(2)
})
</script>