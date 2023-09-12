<template>
    <el-dialog v-model="state.item.dialog" class="custom sm" :close-on-click-modal="false">
        <template #header>
            <div class="flex-center">分 享 到</div>
        </template>
        <template #default>
            <div class="container-xxl d-flex justify-content-center align-items-center mt-2">
                <div v-on:click="method.qq()" class="d-flex flex-column align-items-center px-3 py-1 radius-5 pointer item">
                    <i-svg name="qq" size="40px"></i-svg>
                    <span class="font-13 mt-1">QQ</span>
                </div>
                <div v-on:click="method.qzone()" class="d-flex flex-column align-items-center px-3 py-1 radius-5 pointer item">
                    <i-svg name="qzone" size="40px"></i-svg>
                    <span class="font-13 mt-1">空间</span>
                </div>
                <div v-on:click="method.wechat()" class="d-flex flex-column align-items-center px-3 py-1 radius-5 pointer item">
                    <i-svg name="wechat" size="40px"></i-svg>
                    <span class="font-13 mt-1">微信</span>
                </div>
                <div v-on:click="method.weibo()" class="d-flex flex-column align-items-center px-3 py-1 radius-5 pointer item">
                    <i-svg name="weibo" size="42px"></i-svg>
                    <span class="font-13 mt-1">微博</span>
                </div>
            </div>
        </template>
        <template #footer>

        </template>
    </el-dialog>
</template>

<script setup>
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const state = reactive({
    item: {
        dialog: false,
    },
})

const props = defineProps({
    type: {
        type: String,
        default: 'theme'
    },
    struct: {
        type: Object,
        required: true,
    },
})

const method = {
    // 分享到QQ
    qq: () => {
        const params = {
            url     : window.location.href,
            desc    : props.struct?.abstract,
            title   : props.struct?.title,
            summary : props.struct?.abstract,
            pics    : props.struct?.covers,
            flash   : '',
            site    : '',
        }
        const url = `https://connect.qq.com/widget/shareqq/index.html?${utils.stringfy(params)}`
        window.open(url, '_blank', 'width=800,height=600')

        method.submit()
    },
    // 分享到QQ空间
    qzone: () => {
        const params = {
            url     : window.location.href,
            desc    : utils.string.omit(props.struct.abstract, 100),
            title   : props.struct.title,
            summary : '',
            pics    : props.struct.covers,
            flash   : '',
            site    : '',
        }
        let url = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?${utils.stringfy(params)}`
        window.open(url, '_blank', 'width=800,height=600')

        method.submit()
    },
    // 分享到微信
    wechat: () => {
        console.log(props.struct)
        let text = `【${props.struct.title}】${props.struct.abstract} ${window.location.href}`
        method.copy(text, '复制成功！')

        method.submit()
    },
    // 分享到微博
    weibo: () => {
        const params = {
            url     : window.location.href,
            title   : props.struct.title,
        }
        let url = `https://service.weibo.com/share/share.php?${utils.stringfy(params)}`
        window.open(url, '_blank', 'width=800,height=600')

        method.submit()
    },
    submit: () => {

        if (utils.is.empty(props.struct?.id)) return

        let type = props.type || 'theme'

        axios.post('/api/exp/share', {
            bind_id: props.struct?.id, bind_type: type, state: 1
        })
    },
    // 复制
    copy: (text = null, message = '') => {
        if (utils.is.empty(text)) return
        utils.set.copy.text(text)
        if (!utils.is.empty(message)) notyf.success(message)
    },
}
</script>

<style lang="css" scoped>
.item{
    transition: all .3s;
}
.item:hover{
    background: #fff;
}
</style>