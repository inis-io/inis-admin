<template>
    <span v-html="state.md.render(props.modelValue)"></span>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})
const state = reactive({
    md: new MarkdownIt({
        html: true,
    }),
})
watch(() => props.modelValue, () => {
    state.md.render(props.modelValue)
})
</script>