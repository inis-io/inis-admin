<template>
    <div class="row my-3">
        <div :class="'col-' + props.row[0]">
            <slot name="title">
                <span class="font-14">{{ props.title }}</span>
            </slot>
        </div>
        <div :class="'d-flex align-items-center col-' + props.row[1]">
            <slot name="value">
                <span class="font-14">{{ props.value || '无' }}</span>
            </slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    row: {
        type: Array,
        default: [2, 10],
    },
    title: {
        type: String,
        default: '',
    },
    value: {
        type: String,
        default: '',
    },
})
</script>