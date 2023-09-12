<template>
    <svg aria-hidden="true" :class="classList">
        <use :href="symbol" :fill="color" />
    </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    name  : { type: String, required: true },
    size  : { type: String, default: '1em' },
    color : { type: String, default: '#333' },
    class : { type: String, default: '' },
    width : { type: String, default: item => item.size},
    height: { type: String, default: item => item.size},
    prefix: { type: String, default: 'icon' },
})

const symbol    = computed(() => `#${props.prefix}-${props.name}`)
const classList = computed(() => [`${props.prefix}-${props.name}`, 'svg-icon', props.class])
</script>
  
<style scoped>
.svg-icon {
    width: v-bind(width);
    height: v-bind(height);
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>