<template>

    <!-- 默认美化 -->
    <i-beautify></i-beautify>

    <!-- 顶部导航栏 -->
    <i-nav></i-nav>

    <router-view></router-view>

    <!-- 页脚 -->
    <i-footer></i-footer>

</template>

<script setup>
import '{src}/assets/css/app.min.css'
import '{src}/assets/css/media.min.css'
import iNav from '{src}/views/admin/layout/nav.vue'
import iBeautify from '{src}/views/admin/layout/beautify.vue'
import iFooter from '{src}/views/admin/layout/footer.vue'

nextTick(()=>{
    const body = document.querySelector('body')
    body.setAttribute('data-layout', 'topnav')
    // body.setAttribute('inis-theme', 'dark')
    body.setAttribute('inis-theme', 'white')
    body.classList.add('user-select-none')
    // 给 app 添加一个 class
    const app = document.querySelector('#app')
    app.classList.add('admin')
})
</script>