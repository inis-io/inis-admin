<template>
    <div v-load="[state.status.loading, null, null]" class="card">
        <div class="card-body">
            <i-svg name="security" size="60px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        <strong class="text-danger">风险操作！此功能不懂请勿开启！</strong><br>
                        ● 开启之后，所有的API均需要在请求头中提交 <strong class="text-danger">i-api-key=密钥</strong> 方能使用！<br>
                        ● 于此同时API安全性将提升90%，剩下10%取决于你的密钥复杂度和对手的能力强弱！
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" size="14px"></i-svg>
                        <span class="ms-1">API KEY</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开启" inactive-text="关闭" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </h2>
            <span class="badge bg-primary"> +90% </span>
            <span class="text-muted ms-1">
                安全性提升，<span v-on:click="method.show()" class="text-warning">点我查看更多</span>
            </span>
        </div>
    </div>

    <teleport to="body">
        <div ref="item-modal" id="fill-item-modal" class="modal fade dark" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg mt-5">
                <div class="modal-content modal-filled position-relative">
                    <i-svg name="close" size="20px" color="#ccc" class="modal-close customize" data-bs-dismiss="modal"></i-svg>
                    <div class="modal-header d-flex justify-content-center">
                        <strong>配置</strong>
                    </div>
                    <div class="modal-body font-15">
                        <p class="my-1">● API KEY 不是什么很NB的技术，却能大大提高的接口安全</p>
                        <p class="my-1">● 正常来说不开启也没关系，因为除此之外还有QPS限流器在帮你拦截异常流量</p>
                        <p class="my-1">● 但是如果您开启了API KEY，在使用其它主题的时候，需要按照要求配置密钥到您的主题中，否则主题会拿不到任何数据</p>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">取 消</button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>

import { Modal } from 'bootstrap'
import { getCurrentInstance, onMounted, reactive, watch } from 'vue'
const { ctx, proxy } = getCurrentInstance()

import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const state = reactive({
    modal: Modal,
    struct: {},
    status: {
        finish: false,
        active: false,
        loading: true,
    }
})

onMounted(async () => {
    await method.init()
    state.modal = new Modal(proxy.$refs['item-modal'])
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/config/one', {
            key: 'SYSTEM_API_KEY'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        state.status.finish  = true
    },
    show() {
        if (!state.status.finish) return notyf.warn('API KEY配置获取失败，无法进行配置！')
        state.modal.show()
    },
    change: async value => {

        const { code, msg } = await axios.post('/api/config/save', {
            key: 'SYSTEM_API_KEY',
            value: value ? 1 : 0
        })

        if (code === 200) return

        state.status.active = !value
        notyf.error(msg)
    },
}

watch(() => state.struct, () => {
    state.status.active = parseInt(state.struct.value) === 1
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>