<template>
    <div class="w-100 py-1 radius-5 comment">
        <el-progress v-if="state.progress.show" :percentage="state.progress.value" :color="state.progress.color"></el-progress>
        <div v-bind="$attrs" ref="vditor"></div>
        <div v-if="state.focus" class="d-flex justify-content-between align-items-center px-2">
            <el-popover placement="bottom" :width="300" trigger="click" class="p-0">

                <el-tabs active-name="qq" tab-position="bottom" class="comment-box">

                    <el-tab-pane v-for="(item, index) in state.emoji.data" :key="index" :name="index">
                        <template #label>
                            <span class="font-12">{{ method.name(index) }}</span>
                        </template>
                        <div class="tags overflow-y-auto" style="max-height: 200px;">
                            <small v-for="(src, key) in item" :key="key" class="p-1 white-space-nowrap user-select-none">
                                <el-image v-on:click="method.insert(`![](${src})`)" :src="src" fit="cover" style="width: 24px; height: 24px" class="pointer item"></el-image>
                            </small>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <template #reference>
                    <el-button class="p-0" style="height: 20px; width: 20px" size="small">
                        <i-svg name="emoji" color="#8a8a8a" size="15px"></i-svg>
                    </el-button>
                </template>
            </el-popover>
            <el-button v-on:click="method.send()" :disabled="!state.send" type="primary" size="small" class="btn btn-info text-white" style="line-height: 0">
                发送
            </el-button>
        </div>
    </div>
</template>

<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import { useCommStore } from '{src}/store/comm'

const emit  = defineEmits(['finish'])
const props = defineProps({
    pid: {
        type: Number,
        default: 0,
    },
    bindType: {
        type: String,
        default: 'article',
        required: true,
    },
    bindId: {
        type: Number,
        default: 0,
        required: true,
    },
})

const { ctx, proxy } = getCurrentInstance()
const store = {
    comm: useCommStore(),
}
const state  = reactive({
    send  : false,
    focus : false,
    emoji : {
        show: false,
        data: [],
    },
    vditor: Vditor,
    progress: {
        value: 0,
        show : false,
        color: 'var(--bs-dark)',
    }
})

const base_url = (process.env.NODE_ENV === 'production' ? (import.meta.env.VITE_BASE || '/') : '/')

const method = {
    // 当选择器的输入框失去焦点时触发
    blur: (event) => {
        // 如果点击的元素和评论框无关联
        if (utils.is.empty(event.relatedTarget)) {
            // 如果评论内容为空
            if (utils.is.empty(state.struct.content)) {
                // 取消焦点
                state.focus = false
            }
        }
        // 有关联
        else {
            // 设置焦点
            proxy.$refs['el-input'].focus()
        }
    },
    // 当选择器的输入框获得焦点时触发
    focus: () => {
        state.focus = true
    },
    // 插入内容
    insert: (content) => {
        // 在末尾处插入内容
        state.vditor.insertValue(content, true)
    },
    vditor: () => {
        return new Vditor(proxy.$refs['vditor'], {
            // 最小高度
            minHeight: 30,
            cdn: base_url + 'assets/libs/vditor',
            // cdn: 'https://unpkg.com/vditor@3.9.3',
            placeholder: '尊重是评论打动人心的入场券！',
            toolbar: [],
            cache: {
                enable: false,          // 关闭缓存
            },
            preview: {
                hljs: {
                    enable: true,       // 启用代码高亮
                    // lineNumber: true,   // 启用行号
                },
                math: {
                    engine: 'MathJax',
                },
            },
            // after: () => {
            //     state.item.setValue(props.modelValue)
            // },
            upload: {
                accept: 'image/*, video/*',
                multiple: false,
                // 上传失败自定义方法
                handler: async files => {

                    // 创建一个 formData
                    const params = new FormData
                    params.append('file', files[0])

                    state.progress.show = true

                    const { code, msg, data } = await axios.post('/api/file/upload', params, {
                        // 上传进度
                        onUploadProgress: speed => {
                            state.progress.value = Math.round(speed.loaded / speed.total * 100)
                        }
                    })

                    if (code !== 200) {
                        notyf.error(msg)
                        state.progress.color = 'var(--bs-danger)'
                        setTimeout(() => (state.progress.show  = false), 3000)
                        return
                    }

                    const { path } = data

                    if (method.fileFormat(path) === 'image') {
                        state.vditor.insertValue(`![](${path})`)
                    } else if (method.fileFormat(path) === 'video') {
                        state.vditor.insertValue(`<video src="${path}" controls>Not Support</video>`)
                    } else {
                        state.vditor.insertValue(`${path}`)
                    }

                    state.progress.show  = false
                },
                filename: name => {
                    return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5.)]/g, '')
                    .replace(/[?\\/:|<>*\[\]()$%{}@~]/g, '')
                    .replace('/\\s/g', '');
                },
            },
            // 编辑器焦点变化时触发
            focus: () => {
                state.focus = true
            },
            // 编辑器失去焦点时触发
            blur: () => {
                // 如果评论内容为空
                state.focus = !utils.is.empty(state.vditor.getValue())
            },
            // 编辑器内容变化时触发
            input: (value) => {
                state.send = !utils.is.empty(value)
            },
        })
    },
    // 文件格式
    fileFormat(url = null){

        let result  = 'other'
        const image = ['png','jpg','jpeg','gif','webp','svg','ico']
        const video = ['avi','mp4']
        const array = url.split('.')
        const pop   = array.pop()

        if (utils.in.array(pop, image))      result = 'image'
        else if (utils.in.array(pop, video)) result = 'video'

        return result
    },
    // 获取表情包
    emoji: async () => {
        const { data } = await axios.get('/api/file/emoji')
        state.emoji.data = data
    },
    // name 转义
    name: (name) => {
        const fields = {
            'qq': 'QQ', 'bilibili': 'B站', 'tiktok': '抖音'
        }
        return fields[name] || name
    },
    // 发送评论
    send: async () => {

        const content = state.vditor.getValue()

        if (utils.is.empty(content)) return notyf.warn('评论内容不能为空')

        const { code, msg } = await axios.post('/api/comment/create', {
            content, bind_id: props.bindId, bind_type: props.bindType, pid: props.pid, editor: 'markdown'
        })

        if (code !== 200) return notyf.error(msg)

        state.vditor.setValue('')
        state.send  = false
        state.focus = false

        // 评论完成
        emit('finish')
    },
}

onMounted(() => {
    state.vditor = method.vditor()
    method.emoji()
})

watch(() => state.emoji.data, (val) => {
    state.emoji.show = !utils.is.empty(val)
})
</script>