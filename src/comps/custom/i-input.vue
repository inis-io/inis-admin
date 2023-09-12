<!-- 组件二次封装 -->
<template>
    <el-input ref="ctx" v-bind="$attrs">
        <template v-for="(_, name) in $slots" #[name]="data">
            <slot :name="name" v-bind="data || {}"></slot>
        </template>
    </el-input>
</template>

<script setup>
const { ctx, proxy } = getCurrentInstance()

onMounted(() => {
    const entries = Object.entries(proxy?.$refs['ctx'])
    for (const [key, value] of entries) {
        ctx[key] = value
    }
})
</script>

<style scoped>

</style>