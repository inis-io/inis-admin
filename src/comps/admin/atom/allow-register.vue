<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="register" color="rgb(var(--assist-color))" size="50px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        ● 是否允许用户自行注册账号（开放注册功能？）<br>
                        ● 如果不允许，那么只能通过管理员手动创建账号
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">注 册</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                    active-text="允许" inactive-text="不允许">
                </el-switch>
            </h2>
            <span class="badge bg-primary font-white"> +0.1% </span>
            <span class="text-muted ms-1">
                安全性提升，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">配置</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-lg-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip placement="top">
                                <template #content>
                                    <span>（可选）为该分组的用户分配更高级的权限</span><br>
                                    <span>● 默认：即便用户拥有了对应的权限，也只能操作自己的数据，适用于普通用户或会员</span><br>
                                    <span>● 管理权限：该权限适用于有管理权限的用户，比如管理员和编辑员等，对别人的数据有操作权限</span><br>
                                </template>
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">注册：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.struct.value" placeholder="请选择权限" class="d-block custom font-13">
                            <el-option v-for="item in state.select.value" :key="item.value" :label="item.label" :value="item.value" class="d-flex align-items-center">
                                <i-svg name="dot" :color="item.color" size="20px"></i-svg>
                                <span class="font-13">{{ item.label }}</span>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="为注册的用户分配默认的权限" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">分配权限：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.item.auth" :reserve-keyword="false" default-first-option collapse-tags-tooltip
                            allow-create multiple filterable collapse-tags class="d-block custom font-13" placeholder="选择注册的默认权限">
                            <el-option v-for="item in state.select.auth" :key="item.id" :label="item.name" :value="item.id" class="d-flex justify-content-between">
                                <span class="font-13 d-flex align-items-center">
                                    <i-svg name="dot" :color="item.color" size="20px"></i-svg>
                                    {{ item.name }}
                                </span>
                                <small class="text-muted">{{ item.key }}</small>
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <el-button v-on:click="state.status.dialog = false">取 消</el-button>
            <el-button v-on:click="method.save()" :loading="state.status.wait">保 存</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import notyf from '{src}/utils/notyf.js'
import axios from '{src}/utils/request.js'
import utils from "{src}/utils/utils.js";

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    item: {
        auth: [],
    },
    struct: {
        key: 'ALLOW_REGISTER',
    },
    status: {
        finish: false,
        active: false,
        dialog: false,
        loading: true,
        wait: false,
    },
    select: {
        auth: [],
        value: [
            { value: '0', label: '禁止注册', color: 'var(--bs-danger)' },
            { value: '1', label: '允许注册', color: 'var(--bs-success)' }
        ]
    }
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/config/one', {
            key: 'ALLOW_REGISTER'
        })

        state.status.loading = false

        if (code !== 200) return

        state.struct = data

        state.status.finish  = true
    },
    change: async value => {

        const { code, msg } = await axios.post('/api/config/save', {
            key: 'ALLOW_REGISTER',
            value: value ? 1 : 0
        })

        if (code === 200) return

        state.status.active = !value
        notyf.error(msg)
    },
    show() {
        if (!state.status.finish) return notyf.warn('配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    // 保存配置
    save: async () => {

        state.status.wait   = true

        const { code, msg } = await axios.post('/api/config/save', {
            ...state.struct, text: state.item.auth
        })

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    },
    // 获取权限分组
    auth: async () => {

        const { code, data } = await axios.get('/api/auth-group/column', {
            field: 'id,key,name,root'
        })
        if (code !== 200) return

        state.select.auth = data.map(item=>{
            item.color = item.root === 1 ? 'var(--bs-success)' : 'var(--bs-secondary)'
            return item
        })
    }
}

onMounted(() => {
    method.init()
    method.auth()
})

watch(() => state.struct, (row) => {
    state.item.auth     = (row?.text?.split(',') || []).filter(item => !utils.is.empty(item)).map(item=>parseInt(item))
    state.status.active = parseInt(state.struct?.value) === 1
}, { deep: true })

watch(() => state.status.active, (value) => {
    state.struct.value = value ? '1' : '0'
})

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>