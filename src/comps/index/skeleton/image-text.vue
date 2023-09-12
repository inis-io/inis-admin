<template>
    <el-space class="w-100" direction="vertical" alignment="flex-start">
        <el-skeleton :loading="props.modelValue" animated>
            <template #template>
                <el-skeleton-item variant="image" style="height: 200px"></el-skeleton-item>
                <el-skeleton-item variant="text" class="w-50 mt-2 pb-0 h-18px d-block"></el-skeleton-item>
            </template>
            <template #default>
                <slot name="default"></slot>
            </template>
        </el-skeleton>
    </el-space>
</template>

<script setup>
const emit  = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    }
})
</script>