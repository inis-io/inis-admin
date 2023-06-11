<template>
    <el-config-provider :locale="state.locale">
        <router-view></router-view>
    </el-config-provider>
</template>

<script setup>
import { reactive } from 'vue'
import lang from 'element-plus/lib/locale/lang/zh-cn'
const state = reactive({
    // 将默认语言设置为中文
    locale: lang
})
</script>