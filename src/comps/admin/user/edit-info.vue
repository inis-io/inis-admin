<template>
    <el-dialog v-model="state.item.dialog" class="custom" :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">修改个人信息</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-3">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="您的尊称是？" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">昵称：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.nickname"></el-input>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="您的性别是？" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">性别：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.struct.gender" class="d-block custom font-13" placeholder="请选择">
                            <el-option v-for="item in state.select.gender" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="建议设置一个头像，效果更佳" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">头像：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.avatar" autocomplete="off" class="custom" placeholder="填写图片地址或点击上传图片">
                            <template #suffix>
                                <el-button v-on:click="method.upload('avatar')" :loading="state.item.upload">
                                    <i-svg v-if="!state.item.upload" name="upload" color="rgb(var(--icon-color))" size="14px"></i-svg>
                                    <span class="ms-1">上传</span>
                                </el-button>
                            </template>
                        </el-input>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="简单的介绍一下" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">个人简介：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.description" :autosize="{ minRows: 3, maxRows: 10 }" type="textarea"></el-input>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <el-button v-on:click="state.item.dialog = false">取 消</el-button>
            <el-button v-on:click="method.save()" :loading="state.item.wait">保 存</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import cache from '{src}/utils/cache'
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()
const emit  = defineEmits(['finish'])
const state = reactive({
    item: {
        wait: false,    // 是否等待
        dialog: false,  // 是否显示对话框
        upload: false,  // 是否正在上传
    },
    struct: cache.get('user-info') || {},
    select: {
        gender: [
            { value: null, label: '保密'},
            { value: 'boy', label: '男' },
            { value: 'girl', label: '女' },
        ]
    }
})

const method = {
    // 显示对话框
    show: () => (state.item.dialog = true),
    save: async () => {

        if (utils.is.empty(state.struct?.id)) return notyf.warn('请先登录！')

        state.item.wait           = true

        const { code, msg } = await axios.put('/api/users/update', state.struct)

        state.item.wait           = false

        if (code !== 200) return notyf.error(msg)

        state.item.dialog = false

        // 重新获取用户信息
        await method.checkToken()
    },
    // 校验登录
    async checkToken() {

        const { data, code } = await axios.post('/api/comm/check-token')

        if (code !== 200) return

        emit('finish', data.user)

        cache.set('user-info', data.user, 10)
    },
    // 上传
    async upload(field = 'image') {

        // 创建一个 input
        const input  = document.createElement('input')
        input.type   = 'file'
        input.accept = 'image/*'

        // 监听 input 的 change 事件
        input.addEventListener('change', async () => {
            // 创建一个 formData
            const params = new FormData
            params.append('file', input.files[0])

            state.item.upload         = true

            // 上传图片
            const { code, msg, data } = await axios.post('/api/file/upload', params)

            state.item.upload         = false

            if (code !== 200) return notyf.error(msg)
            // 设置图片
            state.struct[field] = data.path
            // 清空 input
            input.value = ''
            notyf.info('上传成功！')
        })

        // 触发 input 的 click 事件
        input.click()
    },
}

// 将子组件方法暴露给父组件
defineExpose({
    show: method.show,
})
</script>