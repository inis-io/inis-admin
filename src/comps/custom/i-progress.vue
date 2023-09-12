<template>
    <div class="i-progress bar active">
        <span class="line"></span>
    </div>
</template>

<script setup>
const props = defineProps({
    height: {
        type: Number,
        default: 3
    },
})
</script>

<style lang="css" scoped>
.i-progress {
    width: 100%;
    z-index: 1000;
}
.bar.active {
    -webkit-animation: change 2.25s infinite .75s;
    -moz-animation: change 2.25s infinite .75s;
    animation: change 2.25s infinite .75s;
}
.bar {
    height: v-bind(height + 'px');
    margin-bottom: -3px;
    position: relative;
    will-change: transform;
}
.bar.active .line {
    animation: change 2.25s infinite;
    -moz-animation: change 2.25s infinite;
    -webkit-animation: change 2.25s infinite;
}
.bar .line {
    width: 100%;
    height: 0;
    position: absolute;
    text-indent: -9999px;
    background-color: #23b7e5;
}
.active>span {
    display: inherit;
}
.bar.active .line:before {
    -webkit-animation: moving .75s infinite;
    -moz-animation: moving .75s infinite;
    animation: moving .75s infinite;
}
.bar .line:before {
    content: "";
    left: 0;
    right: 0;
    width: 100%;
    height: v-bind(height + 'px');
    position: absolute;
    background-color: inherit;
}
@-webkit-keyframes moving {
    0% {transform:scaleX(0)}
    99.9% {transform:scaleX(1)}
    100% {transform:scaleX(0)}
}
@-moz-keyframes moving {
    0% {transform:scaleX(0)}
    99.9% {transform:scaleX(1)}
    100% {transform:scaleX(0)}
}
@keyframes moving {
    0% {transform:scaleX(0)}
    99.9% {transform:scaleX(1)}
    100% {transform:scaleX(0)}
}
@-webkit-keyframes change {
    0% {background-color:#23b7e5}
    33.3% {background-color:#23b7e5}
    33.33% {background-color:#fad733}
    66.6% {background-color:#fad733}
    66.66% {background-color:#7266ba}
    99.9% {background-color:#7266ba}
}
@-moz-keyframes change {
    0% {background-color:#23b7e5}
    33.3% {background-color:#23b7e5}
    33.33% {background-color:#fad733}
    66.6% {background-color:#fad733}
    66.66% {background-color:#7266ba}
    99.9% {background-color:#7266ba}
}
@keyframes change {
    0% {background-color:#23b7e5}
    33.3% {background-color:#23b7e5}
    33.33% {background-color:#fad733}
    66.6% {background-color:#fad733}
    66.66% {background-color:#7266ba}
    99.9% {background-color:#7266ba}
}
</style>