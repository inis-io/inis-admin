<template>
    <el-config-provider :locale="state.locale">
        <router-view></router-view>
    </el-config-provider>
    <upgrade-theme></upgrade-theme>
</template>

<script setup>
import upgradeTheme from '{src}/comps/upgrade/theme.vue'
import lang from 'element-plus/es/locale/lang/zh-cn'
// import lang from 'element-plus/lib/locale/lang/zh-cn'
const state = reactive({
    // 将默认语言设置为中文
    locale: lang
})

// 追加配置
globalThis.inis = {
    api: { uri: '', key: '' },
    cache: 10,
    lazy_time : 500,
    token_name: import.meta.env.VITE_TOKEN_NAME,
    ...globalThis.inis,
    version   : import.meta.env.VITE_VERSION,
}

import channel from '{src}/utils/channel'

const item = new channel('theme')

item.on((data) => {
    console.log('主题更新：', data)
})

// /* 创建一个广播通道 */
// const channelObj = new BroadcastChannel('televiseChannel');
//
// // 监听消息事件
// channelObj.onmessage = function(event) {
//   const newData = event.data;
//   console.log('收到的更新数据：', newData);
// };
</script>