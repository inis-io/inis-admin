<template>
    <span class="d-flex i-badge">
        <span class="d-flex align-items-center item left">
            <slot name="left">
                <i-svg name="vip-integral" size="10px" class="svg"></i-svg>
                <span class="h-18px">LV.{{ props.left }}</span>
            </slot>
        </span>
        <span class="item right">
            <slot name="right">
                <span class="h-18px d-block">{{ props.right }}</span>
            </slot>
        </span>
    </span>
</template>

<script setup lang="ts">
const props = defineProps({
    left: {
        type: Number,
        default: null,
    },
    right: {
        type: String,
        default: '徽章',
    },
})
</script>

<style lang="css" scoped>
.i-badge{
    color: white;
	  /* height: 18px; */
    font-size: 12px;
    user-select: none;
}
.i-badge .item{
    padding: 0 .375rem;
    backdrop-filter: blur(10px) saturate(160%);
    -webkit-backdrop-filter: blur(10px) saturate(160%);
}
.i-badge .item.left{
    z-index: 1;
    border-radius: 30px;
    background: #2481fa;
    border: 1px solid #2481fa;
    box-shadow: 0 1px 4px #2481fa;
}
.i-badge .item.right{
    border-radius: 30px;
    margin-left: -15px;
    padding: 0 10px 0 20px;
    box-shadow: 0 1px 4px #66a7fc;
    background: rgba(102, 167, 252, 1);
    border: 1px solid rgba(102, 167, 252, 0.5);
}
.i-badge .item.left .svg{
    margin-right: 5px;
}
.black-gray-gradual .i-badge .item.right{
	background: rgba(255, 255, 255, 0.92);
}
</style>