<template>
    <img :src="props.src" :alt="props.alt">
</template>

<script setup>
const props = defineProps({
    src: {
        type: String,
        required: true,
    },
    alt: {
        type: String,
        default: '',
    },
    size: {
        type: String,
        default: '280px',
    },
    border: {
        type: String,
        default: '5px',
    },
    scale: {
        type: String,
        default: '1.35',
    },
    circle: {
        type: String,
        default: '192, 41, 66',
    },
    background: {
        type: String,
        default: '236, 208, 120',
    },
})
</script>

<style scoped>
img{
    --size: v-bind(size);
    --circle: v-bind(circle);
    --background: v-bind(background);
    --border: v-bind(border);
    --scale: 1;
    --option: content-box no-repeat center / calc(100% / var(--scale)) 100%;
    --shrink: calc((var(--size) / var(--scale) - var(--size)) / 2 - var(--border));

    width: var(--size);
    height: var(--size);
    cursor: pointer;
    transition: 0.5s;
    padding-top: 100px;
    outline: var(--border) solid rgb(var(--circle));
    outline-offset: calc(var(--shrink) + var(--border));
    border-radius: 0 0 999px 999px;
    transform: scale(var(--scale));
    background: radial-gradient(circle closest-side,
        rgb(var(--background)) calc(99% - var(--border)),
        rgb(var(--circle)) calc(100% - var(--border)),
        rgb(var(--circle)) 99%, transparent 100%
    ) var(--option);
    -webkit-mask: linear-gradient(#000, #000, #000) no-repeat center calc(0px - var(--shrink)) / calc(100% / var(--scale) - 2 * var(--border) ) 50%,
        radial-gradient(circle closest-side, #000 99%, transparent) var(--option);
    object-fit: contain;
    box-sizing: content-box;
}
img:hover{
    --scale: v-bind(scale);
}
</style>