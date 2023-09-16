<template>
    <div v-on:click="method.show()" v-loading="state.status.loading" class="card pointer mb-3">
        <div class="card-body">
            <i-svg name="site" color="rgb(var(--assist-color))" size="50px" class="position-absolute opacity-25" style="right: 2rem"></i-svg>
            <h6 class="text-muted text-uppercase mt-0">
                <el-tooltip content="（点击卡片配置）站点信息，如：备案号、头像、favicon、关键词和描述等" placement="top">
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">站点信息</span>
                    </span>
                </el-tooltip>
            </h6>
            <div class="d-flex">
                <span class="d-flex align-items-center justify-content-center position-relative" style="width: 60px; height: 60px">
                    <i-lottie name="avatar/crane" v-model="state.item.avatar" width="65px" height="65px" class="z-index-9"></i-lottie>
                    <el-avatar :src="state.struct.json.avatar" :size="52" style="top: 7px; left: 2px" class="avatar-shadow position-absolute"></el-avatar>
                </span>
                <div class="d-flex flex-column justify-content-center ms-2">
                    <span class="font-18 text-dark d-flex align-items-center">
                        <span class="text-dark font-16 me-2 limit-1-line">{{ state.struct.json.title }}</span>
                    </span>
                    <small class="text-secondary limit-2-line">{{ state.struct.json.description || '这个人很懒，什么都没留下！' }}</small>
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">站 点 信 息 配 置</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="ICP备案码" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">ICP 备案码：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.json.copy.code" placeholder="ICP备案码"></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="工信部网址，如：https://beian.miit.gov.cn" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">ICP 备案链接：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.json.copy.link" placeholder="如：https://beian.miit.gov.cn"></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="公安备案码" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">公安备案码：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.json.police.code" placeholder="公安备案码"></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="公安备案网址，如：https://www.beian.gov.cn" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">公安备案链接：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.json.police.link" placeholder="如：https://www.beian.gov.cn"></el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="本站点的头像" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">站点头像：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.json.avatar" class="custom" placeholder="填写图片地址或点击上传">
                            <template #suffix>
                                <el-button v-on:click="method.upload('avatar')" :loading="state.upload.avatar">
                                    <i-svg v-if="!state.upload.avatar" name="upload" color="rgb(var(--icon-color))" size="14px"></i-svg>
                                    <span class="ms-1">上传</span>
                                </el-button>
                            </template>
                        </el-input>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="本站点的小图标" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">favicon：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.json.favicon" class="custom" placeholder="填写图片地址或点击上传">
                            <template #suffix>
                                <el-button v-on:click="method.upload('favicon')" :loading="state.upload.favicon">
                                    <i-svg v-if="!state.upload.favicon" name="upload" color="rgb(var(--icon-color))" size="14px"></i-svg>
                                    <span class="ms-1">上传</span>
                                </el-button>
                            </template>
                        </el-input>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="站点标题，如：米哈游" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">站点标题：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.json.title"></el-input>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="网站关键词，主要用于SEO场景，有助于收录" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">关键词：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.item.keyword" :reserve-keyword="false" default-first-option collapse-tags-tooltip
                            allow-create multiple filterable collapse-tags class="d-block custom font-13" placeholder="请输入站点关键词">
                            <el-option v-for="(item, index) in state.item.keyword" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="本网站运营的开始时间" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">运营时间：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-date-picker v-model="state.struct.json.date" type="date" format="YYYY-MM-DD" value-format="X" class="d-block w-100 custom" placeholder="请选择本站开设的时间">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="网站描述，主要用于SEO场景，有助于收录" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">站点描述：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.json.description" :autosize="{ minRows: 1, maxRows: 10 }" placeholder="站点描述！" type="textarea"></el-input>
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
import cache from '{src}/utils/cache'
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()
const state = reactive({
    item: {
        avatar: true,
        keyword: ''
    },
    struct: {
        key: 'SITE_INFO',
        json: {
            title: '',
            avatar: '',
            favicon: '',
            copy: {
                code: '',
                link: '',
            },
            police: {
                code: '',
                link: '',
            },
            date: '',
            keyword: '',
            description: '',
        },
        remark: '站点信息',
    },
    status: {
        finish: false,
        loading: true,
        dialog: false
    },
    upload: {
        avatar: false,
        favicon: false,
    }
})

onMounted(async () => {
    await method.init()
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/config/one', {
            key: 'SITE_INFO'
        })

        state.status.loading = false

        if (code === 204) return  method.save()
        if (code !== 200) return
        state.struct = utils.object.deep.merge(state.struct, data)

        // 处理关键词
        if (data.json.keyword) {
            state.item.keyword = data.json.keyword.split(',')
        }

        state.status.finish  = true
    },
    show() {
        if (!state.status.finish) return notyf.warn('配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    save: async () => {

        state.status.wait   = true

        const { code, msg } = await axios.post('/api/config/save', {
            ...state.struct,
            json: JSON.stringify(state.struct.json)
        })

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false

        // 删除本地缓存
        cache.del('site-info')
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

            state.upload[field]       = true
            // 上传图片
            const { code, msg, data } = await axios.post('/api/file/upload', params)

            state.upload[field]       = false

            if (code !== 200) return notyf.error(msg)
            // 设置图片
            state.struct.json[field] = data.path
            // 清空 input
            input.value = ''
            notyf.info('上传成功！')
        })

        // 触发 input 的 click 事件
        input.click()
    },
}

watch(() => state.item.keyword, value => {
    state.struct.json.keyword = !value ? '' : value.join(',')
})

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>