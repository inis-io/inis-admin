<template>
    <div v-load="[state.status.loading, null, null]" class="card">
        <div class="card-body">
            <i-svg name="ram" size="55px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        <strong class="text-success">推荐开启，有利于减少数据库和服务器的负担！</strong><br>
                        开启后会对API数据进行缓存，减少重复执行数据库操作以及对数据的运算，<br>
                        从而提高API的响应速度，减少服务器的负担。<br>
                        PS：缓存数据会通过内存的方式存储在服务器的内存中。
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" size="14px"></i-svg>
                        <span class="ms-1">内存缓存</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开启" inactive-text="关闭" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </h2>
            <span class="badge bg-success"> +20% </span>
            <span class="text-muted">
                综合提升，<span v-on:click="method.show()" class="text-white">点我配置</span>
            </span>
        </div>
    </div>

    <teleport to="body">
        <div ref="item-modal" id="fill-item-modal" class="modal fade dark" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg mt-5">
                <div class="modal-content modal-filled position-relative">
                    <i-svg name="close" size="20px" color="#ccc" class="modal-close customize" data-bs-dismiss="modal"></i-svg>
                    <div class="modal-header d-flex justify-content-center">
                        <strong>配置 文件 缓存服务</strong>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group mb-3">
                                    <label class="form-label">
                                        <el-tooltip content="缓存有效时间，建议2小时，即7200秒，0表示永不过期" placement="top">
                                            <span>
                                                <i-svg name="hint" size="14px"></i-svg>
                                                <span class="ms-1">过期时间（秒）：</span>
                                            </span>
                                        </el-tooltip>
                                    </label>
                                    <input v-model="state.struct.expire" type="text" class="form-control customize text-white">
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
import utils from "{src}/utils/utils.js";

const { ctx, proxy } = getCurrentInstance()
const emit  = defineEmits(['refresh'])
const state = reactive({
    modal: Modal,
    struct: {
        open:     false,
        default:  null,
        expire:   '2 * 60 * 60',
    },
    status: {
        finish: false,
        active: false,
        loading: true,
    },
})

onMounted(async () => {
    await method.init()
    state.modal = new Modal(proxy.$refs['item-modal'])
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/toml/cache', {
            name: 'ram'
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

        const { code, msg } = await axios.put('/api/toml/cache-default', {
            value: 'ram', open: value
        })

        if (code === 200) return emit('refresh', 'cache-redis', 'cache-file')

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        if (utils.is.empty(state.struct.expire)) return notyf.warn('请填写 过期时间！')

        const { code, msg } = await axios.put('/api/toml/cache-ram', state.struct)

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.modal.hide()
    },
}

watch(() => state.struct, () => {
    state.status.active = state.struct.default === 'ram' && state.struct.open
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>