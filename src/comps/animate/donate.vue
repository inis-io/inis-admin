<template>
    <div class="donate">
        <div class="content">
            <div class="front pt-3">
                <slot name="front">
                    <h3 class="title mb-2">{{ state.title[0] }}</h3>
                    <h3 class="title-pay">
                        <span class="me-1">使用微信支付</span>
                        <span>鼠标悬停使用支付宝</span>
                    </h3>
                    <img :src="props.wx" class="subtitle-img" alt="">
                </slot>
            </div>
            <div class="back pt-3">
                <slot name="back">
                    <h3 class="title mb-2">{{ state.title[1] }}</h3>
                    <h3 class="title-pay">
                        <span class="me-1">使用支付宝支付</span>
                        <span>移开鼠标使用微信</span>
                    </h3>
                    <img :src="props.alipay" class="subtitle-img" alt="">
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import utils from '{src}/utils/utils'
import { reactive } from 'vue'

const props = defineProps({
    wx: {
        type: String,
        default: '',
    },
    alipay: {
        type: String,
        default: '',
    },
    height: {
        type: String,
        default: '30vh',
    },
    title: {
        type: [Array, String],
    }
})

const state = reactive({
    unit  : 'px',
    width : 0,
    height: 0,
    scale : 405 / 464,
    padding: 0,
    title: ['请作者喝杯冰阔落🍻','请作者喝杯咖啡☕️'],
})

const method = {
    init: () => {
        method.parse()
        method.width()
        method.padding()
        method.title()
    },
    // 解析高度
    parse: () => {
        // 正则匹配height的数字和单位
        const reg    = /(\d+)(\w+)/
        const unit   = props.height.match(reg)[2]
        const height = props.height.match(reg)[1]
        if (!utils.is.empty(unit))   state.unit   = unit
        if (!utils.is.empty(height)) state.height = height
    },
    // 宽高比为：405:464
    width: () => {
        state.width = (state.height * state.scale).toFixed(2)
    },
    // 计算padding
    padding: () => {
        state.padding = (state.width * 0.1).toFixed(2)
    },
    // 标题
    title: () => {
        if (utils.is.empty(props.title)) return
        if (Array.isArray(props.title)) {
            props.title?.forEach((item, index) => {
                state.title[index] = item
            })
        } else if (typeof props.title === 'string') {
            state.title[0] = props.title
        }
    },
}
method.init()
</script>

<style scoped lang="css">
h3 {
    font-size: 1em;
    margin: 1px 10px;
}
.pt-3 {
    padding-top: 1.5rem!important;
}
.mb-2 {
    margin-bottom: .75rem!important;
}
.me-1 {
    margin-right: .375rem!important;
}

.donate {
    cursor: pointer;
    margin-top: 10px;
    max-width: v-bind('state.width + state.unit');
    height: calc(v-bind('state.height + state.unit') + 1.5 * v-bind('state.padding + state.unit'));
}

.content {
    height: 100%;
    padding: 5em;
    margin-left: 15px;
    text-align: center;
    position: relative;
    border-radius: 10px;
    transition: all 2.25s;
    background-color: #00c250;
    transform-style: preserve-3d;
}

.donate:hover .content {
    transform: rotateY(0.5turn);
}

.front, .back {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: #fff;
    padding: 1em;
    position: absolute;
    border-radius: 10px;
    backface-visibility: hidden;
    transform-style: preserve-3d;
}

.title {
    font-size: 1.5rem;
    transform: translateZ(5rem);
}
.subtitle-img {
    margin-top: 10px;
    border-radius: 10px;
    transform: translateZ(2rem);
    height: calc(v-bind('state.height + state.unit') - 2 * v-bind('state.padding + state.unit'));
}

.back {
    background-color: #1677ff;
    transform: rotateY(0.5turn);
}

.title-pay {
    transform: translateZ(3rem);
}
.title-pay span {
    font-size: 0.7em;
    transform: translateZ(3rem);
}
</style>