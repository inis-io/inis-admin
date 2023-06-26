<template>
    <footer id="footer" class="text-white user-select-none">
        <span>Copyright © {{ year }}</span>
        <span> & <a href="https://inis.cc" target="_blank" class="text-white">INIS 2.0.0</a></span>
        <span> & <a href="https://inis-pro.apifox.cn" target="_blank" class="text-white">API 文档</a></span>
    </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>