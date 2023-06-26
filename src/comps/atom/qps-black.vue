<template>
    <div v-load="[state.status.loading, null, null]" class="card">
        <div class="card-body">
            <i-svg name="black" size="58px" color="rgb(var(--svg-color))" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        <strong class="text-success">开启后满足条件的客户端IP会被自动拉黑！</strong><br>
                        ● 此功能需要搭配 QPS 使用，在 时间频率 内，达到 触发 QPS 次数上限，自动拉黑对应的客户端IP<br>
                        ● 如：在1小时内，某客户端IP触发了3次 QPS 警告，则自动拉黑此客户端IP，并且后续无法访问任何API<br>
                        ● 此功能可以有效防止恶意攻击，如：CC攻击、DDOS攻击等<br>
                        ● 需要注意的是，随机图片接口也会受到影响<br>
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">自动 IP 黑名单</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="我怂" inactive-text="无所畏惧" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </h2>
            <span class="badge bg-primary font-white"> +30% </span>
            <span class="text-muted ms-1">
                安全性提升，<span v-on:click="method.show()" class="text-warning pointer">点我配置</span>
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
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label class="form-label">
                                        <el-tooltip content="触发QPS的次数，推荐：3" placement="top">
                                            <span>
                                                <i-svg name="hint" size="14px"></i-svg>
                                                <span class="ms-1">触发次数：</span>
                                            </span>
                                        </el-tooltip>
                                    </label>
                                    <el-input-number v-model="state.struct.json.count" :min="1" class="w-100 d-flex"></el-input-number>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label class="form-label">
                                        <el-tooltip content="可以用乘法，如：60 * 60 表示1小时" placement="top">
                                            <span>
                                                <i-svg name="hint" size="14px"></i-svg>
                                                <span class="ms-1">时间频率（秒）：</span>
                                            </span>
                                        </el-tooltip>
                                    </label>
                                    <input v-model="state.struct.json.second" type="text" class="form-control customize text-white">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">取 消</button>
                        <button v-on:click="method.save()" type="button" class="btn btn-info">保 存</button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>

import { Modal } from 'bootstrap'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    modal: Modal,
    struct: {
        value: 0,
        json: { count: null, second: '' },
    },
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
            key: 'SYSTEM_QPS_BLOCK'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        state.status.finish  = true
    },
    show() {
        if (!state.status.finish) return notyf.warn('配置获取失败，无法进行配置！')
        state.modal.show()
    },
    change: async value => {

        const { code, msg } = await axios.post('/api/config/save', {
            key: 'SYSTEM_QPS_BLOCK',
            value: value ? 1 : 0
        })

        if (code === 200) return

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        const { code, msg } = await axios.post('/api/config/save', {
            key: 'SYSTEM_QPS_BLOCK',
            json: JSON.stringify(state.struct.json)
        })

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.modal.hide()
    }
}

watch(() => state.struct, () => {
    state.status.active = parseInt(state.struct.value) === 1
    // 只能是 数字、空格和运算符
    state.struct.expire = state.struct.json.second.replace(/[^\d\s*+\-\/]/g, '')
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>