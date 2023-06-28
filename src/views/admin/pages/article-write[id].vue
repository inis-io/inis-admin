<template>
    <div v-load="state.item.loading" class="container-fluid container-box">
        <div class="row">
            <div class="col-lg-9" id="banner">
                <div v-if="false" class="card mb-2 carousel-inner">
                    <div class="card-body p-0 m-0 position-relative">
                        <el-image style="height: 300px; width: 100%;" src="https://api.inis.cn/api/file/random" fit="cover"></el-image>
                        <div class="carousel-caption position-absolute start-0 end-0 bottom-0 text-start pb-0 pt-3 px-3 single-cover">
                            <span class="text-white">
                                <h5 class="subscript-left my-0">标题</h5>
                                <p class="pointer d-flex align-items-center">
                                    <i-svg name="book-white" class="me-1" size="14px"></i-svg>
                                    <span>描述 ...</span>
                                </p>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="card mb-2">
                    <div v-load="utils.is.empty(state.struct.editor)" class="card-body custom" style="min-height: 485px">
                        <span v-show="state.struct.editor === 'tinymce'">
                            <i-tinymce v-model="state.struct.content" id="tinymce"></i-tinymce>
                        </span>
                        <span v-show="state.struct.editor === 'vditor'">
                            <i-vditor ref="vditor" v-model="state.struct.content" :opts="{ height: 600 }"></i-vditor>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 custom" id="page-header-title">
                <el-collapse accordion v-model="state.item.active">
                    <div class="card mb-2">
                        <div class="card-body px-2 py-0">
                            <el-collapse-item name="1">
                                <template #title>
                                    展示信息
                                </template>
                                <div class="form-group mb-3">
                                    <el-tooltip content="（必须）文章的标题" placement="top">
                                        <span>
                                            <i-svg name="hint" size="14px"></i-svg>
                                            <span class="ms-1 required">标题：</span>
                                        </span>
                                    </el-tooltip>
                                    <input v-model="state.struct.title" type="text" autocomplete="new-password" class="form-control customize text-white" placeholder="文章标题">
                                </div>
                                <div class="form-group mb-3">
                                    <el-tooltip content="文章的摘要" placement="top">
                                        <span>
                                            <i-svg name="hint" size="14px"></i-svg>
                                            <span class="ms-1">摘要：</span>
                                        </span>
                                    </el-tooltip>
                                    <textarea v-model="state.struct.abstract" class="form-control customize custom-scroll text-white" rows="10" placeholder="简单的描述一下您的文章"></textarea>
                                </div>
                            </el-collapse-item>
                        </div>
                    </div>
                    <div class="card mb-2">
                        <div class="card-body px-2 py-0">
                            <el-collapse-item name="2">
                                <template #title>
                                    封面图
                                </template>
                                <el-tabs v-model="state.item.tabs" :stretch="true">
                                    <el-tab-pane label="预览" name="preview">
                                        <el-upload class="custom upload" action="/api/file/upload" :headers="method.headers()" :multiple="true" list-type="picture"
                                            :on-remove="method.cover.remove" :on-success="method.cover.success" :on-error="method.cover.error" :file-list="state.item.cover.preview">
                                            <button class="btn btn-auto mimic w-100" type="button">上 传</button>
                                        </el-upload>
                                    </el-tab-pane>
                                    <el-tab-pane label="外链" name="links">
                                        <textarea v-model="state.item.cover.links" wrap="off" class="form-control customize custom-scroll text-white" rows="10" placeholder="外链图片地址，一行一个"></textarea>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-collapse-item>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body px-2 py-0">
                            <el-collapse-item name="3">
                                <template #title>
                                    置顶、分类、标签
                                </template>
                                <div class="form-group mb-3">
                                    <label class="form-label">
                                        <el-tooltip content="可同时选择多个分类" placement="top">
                                            <span>
                                                <i-svg name="hint" size="14px"></i-svg>
                                                <span class="ms-1">置顶：</span>
                                            </span>
                                        </el-tooltip>
                                    </label>
                                    <el-select v-model="state.struct.top" class="w-100" placeholder="请选择" filterable>
                                        <el-option v-for="item in state.select.top" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="form-group mb-3">
                                    <label class="form-label">
                                        <el-tooltip content="可同时选择多个分类" placement="top">
                                            <span>
                                                <i-svg name="hint" size="14px"></i-svg>
                                                <span class="ms-1">分类：</span>
                                            </span>
                                        </el-tooltip>
                                    </label>
                                    <el-cascader :options="state.select.group" :props="{ multiple: true, checkStrictly: true }"
                                         v-model="state.item.group" collapse-tags clearable filterable class="w-100">
                                    </el-cascader>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">
                                        <el-tooltip content="可同时选择多个标签" placement="top">
                                            <span>
                                                <i-svg name="hint" size="14px"></i-svg>
                                                <span class="ms-1">标签：</span>
                                            </span>
                                        </el-tooltip>
                                    </label>
                                    <el-select v-model="state.item.tags" multiple collapse-tags class="w-100" placeholder="请选择" filterable>
                                        <el-option v-for="item in state.select.tags" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-collapse-item>
                        </div>
                    </div>
                </el-collapse>
            </div>
        </div>
    </div>
    <teleport to="body">
    <div class="inis-save">
        <el-tooltip content="保存文章" placement="top">
        <button v-on:click="method.save()" type="button" class="btn btn-auto mimic">
            <i-svg name="save" size="1.6em"></i-svg>
        </button>
        </el-tooltip>
    </div>
    </teleport>
    <mouse-menu ref="global-menu" v-bind="state.item.menu"></mouse-menu>
</template>

<script setup>
import MarkdownIt from 'markdown-it'
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import IVditor from '{src}/comps/custom/i-vditor.vue'
import ITinymce from '{src}/comps/custom/i-tinymce.vue'

import MouseMenu from '@howdyjs/mouse-menu'
import { list as MenuList, config as MenuConfig } from '{src}/utils/menu'

const { ctx, proxy } = getCurrentInstance()

const route  = useRoute()
const router = useRouter()
const state  = reactive({
    item: {
        id: null,
        tags: [],
        group: [],
        active: ['1'],
        menu: {
            ...MenuConfig,
            menuList: [{
                label: '保存',
                icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
                    <path d="M777.216 0a106.496 106.496 0 0 1 77.824 48.128A107.52 107.52 0 0 1 870.4 102.4v153.6h68.096a102.4 102.4 0 0 1 73.216 51.2 120.832 120.832 0 0 1 12.288 39.936v583.68a113.664 113.664 0 0 1-26.112 56.832 106.496 106.496 0 0 1-65.536 34.304H91.136a113.152 113.152 0 0 1-55.808-25.088A106.496 106.496 0 0 1 0 932.352V349.184a112.64 112.64 0 0 1 15.36-45.056A102.4 102.4 0 0 1 92.16 256H153.6V153.6 88.576a96.256 96.256 0 0 1 20.48-51.2A104.96 104.96 0 0 1 247.296 0z m140.288 540.16H83.456v370.688a35.84 35.84 0 0 0 0 17.92 24.576 24.576 0 0 0 13.824 10.752 17.408 17.408 0 0 0 10.24 0h816.64a21.504 21.504 0 0 0 17.92-24.576v-374.784a51.2 51.2 0 0 0-24.576 0z m-204.8 48.64a40.448 40.448 0 0 1 37.888 39.936 44.544 44.544 0 0 1-17.408 34.816l-256 220.16a41.984 41.984 0 0 1-44.032 6.656A72.192 72.192 0 0 1 409.6 870.4l-115.2-132.608a41.984 41.984 0 0 1-13.312-29.184 38.912 38.912 0 0 1 26.112-38.912 39.936 39.936 0 0 1 47.104 10.24c34.304 37.888 67.584 77.312 102.4 115.2 76.288-65.024 153.6-131.072 227.84-196.608a40.96 40.96 0 0 1 28.16-9.728zM870.4 337.92V460.8a98.304 98.304 0 0 0 34.816 2.56 90.624 90.624 0 0 0 35.328-2.56V370.688a70.144 70.144 0 0 0 0-17.92 21.504 21.504 0 0 0-15.36-14.848c-7.68-5.12-17.92 0-26.624 0s-18.432-4.608-28.16 0zM102.4 338.432a19.968 19.968 0 0 0-20.48 19.968v102.4a32.768 32.768 0 0 0 20.48 2.56h54.784V363.52a51.2 51.2 0 0 0 0-23.04c-20.992-2.56-38.912-3.072-54.784-2.048z m665.6-256H260.096a21.504 21.504 0 0 0-24.064 16.384c-3.072 2.56-2.56 6.656-3.072 10.24v325.12A59.392 59.392 0 0 0 235.52 460.8a28.16 28.16 0 0 0 8.704 2.56h512a69.12 69.12 0 0 0 30.72-2.56 28.16 28.16 0 0 0 0-8.704V108.544a17.92 17.92 0 0 0 0-10.24 22.528 22.528 0 0 0-23.04-16.384zM358.4 204.8h112.64a41.472 41.472 0 0 1 39.424 30.208 39.936 39.936 0 0 1-10.752 39.424 42.496 42.496 0 0 1-30.72 12.288H354.304a58.88 58.88 0 0 1-23.04-3.584 40.448 40.448 0 0 1-24.064-39.424 39.936 39.936 0 0 1 33.28-38.912A82.944 82.944 0 0 1 358.4 204.8z" fill="rgb(var(--assist-color))"></path>
                </svg>`,
                fn: () => method.save()
            }],
        },
        tabs: 'preview',
        // 封面数据
        cover: {
            // 预览图
            preview: {},
            // 外链图
            links: ''
        },
        loading: false,
    },
    struct: { content: '', editor: null },
    select: {
        top: [{ value: 0, label: '否' }, { value: 1, label: '是' }],
        tags: [],
        group: [],
    },
    backup: {
        group: [],
    },
})

onMounted(async () => {
    document.querySelectorAll('.container-fluid').forEach(el => {
        el.classList.remove('container-fluid')
        el.classList.add('container-xxl')
    })
    await method.init()
    // 追加鼠标右键菜单
    state.item.menu.menuList.push(...[{line: true}, ...await MenuList()])
})

const method = {
    init: async () => {
        let id = route.params?.id
        if (!utils.is.empty(id)) {
            state.item.id = parseInt(id)
            state.item.loading = true
        }
        await method.getGroup()
        await method.getTags()
        if (!utils.is.empty(state.item.id)) {
            await method.getArticle(state.item.id)
        } else {
            await method.getConfig()
        }
    },
    // Editor 切换
    getConfig: async () => {
        const { code, data } = await axios.get('/api/config/one', { key: 'ARTICLE' })
        if (code !== 200) return
        if (utils.in.array(data?.json?.editor, ['tinymce', 'vditor'])) {
            state.struct.editor = data.json.editor
        } else {
            state.struct.editor = 'tinymce'
        }
    },
    // 获取文章信息
    getArticle: async (id = null) => {
        const { code, msg, data } = await axios.get('/api/article/one', { id })
        if (code !== 200) {
            await router.push({path: '/admin/article/write'})
            notyf.error(msg)
            return notyf.warn('已为您跳转到文章撰写页！')
        }
        state.struct = data

        // 封面图 - 字符串转数组 - name 正则出文件名部分
        if (!utils.is.empty(data.covers)) {
            // state.item.cover.links   = data.covers.split(',').join('\n')
            state.item.cover.preview = data.covers.split(',').map(item => ({
                name: item.replace(/.*\//, ''), url: item,
            }))
        }
        // 分类 - 字符串转数组 - 去空 去重 转int
        if (!utils.is.empty(data.group)) {
            let group = data.group.split('|').filter(item => !utils.is.empty(item)).map(item => parseInt(item))
            state.item.group = method.tree.parse(state.backup.group, group)
        }
        // 标签 - 字符串转数组 - 去空 去重 转int
        if (!utils.is.empty(data.tags)) {
            state.item.tags = data.tags.split('|').filter(item => !utils.is.empty(item)).map(item => parseInt(item))
        }

        // 关闭加载状态
        if (!utils.is.empty(id)) state.item.loading = false
    },
    // 获取文章分组
    getGroup: async () => {
        const { code, data } = await axios.get('/api/article-group/column', {
            field: 'id,pid,name,avatar'
        })
        if (code !== 200) return
        state.backup.group = data
        state.select.group = method.tree.stringify(data, 0)
    },
    // 获取文章标签
    getTags: async () => {
        const { code, data } = await axios.get('/api/tags/column', {
            field: 'id,name'
        })
        if (code !== 200) return
        state.select.tags = data.map(item => ({ value: item.id, label: item.name }))
    },
    // 保存
    save: async () => {

        // Vditor 编辑器
        if (state.struct.editor === 'vditor') {
            state.struct.content = proxy.$refs['vditor'].getValue()
        }

        // 正则匹配 html 纯文本内容 - 去除换行符
        const reg = /<[^>]+>/g
        // 文章字数
        let length = state.struct?.content?.replace(reg, '')?.replace(/\n/g, '')?.length || 0
        switch (length) {
        case 0:
            return notyf.warn('你这文章一个字都没写，糊弄谁呢？')
        case 1:
            return notyf.warn('真就只写一个字呗？')
        default:
            if (length < 10) return notyf.warn('你这太水了，10个字都不到。')
        }
        if (utils.is.empty(state.struct?.title)) return notyf.warn('你可能忘记写标题了')

        // 封面图 - 去空
        let covers = state.item.cover.links.split('\n').filter(item => !utils.is.empty(item))
        // 把 state.item.group 的二维数组转换成一维数组
        let group = state.item.group.reduce((prev, next) => prev.concat(next), [])
        // 去空 去重 排序
        group = Array.from(new Set(group.filter(item => item))).sort((a, b) => a - b)

        state.struct.covers = !utils.is.empty(covers) ? covers.join(',') : ''
        state.struct.tags   = !utils.is.empty(state.item.tags) ? `|${state.item.tags.join('|')}|` : ''
        state.struct.group  = !utils.is.empty(group) ? `|${group.join('|')}|` : ''

        if (state.struct.editor === 'vditor') {
            state.struct.content = proxy.$refs['vditor'].getValue()
        }

        const { code, msg, data } = await axios.post('/api/article/save', state.struct)
        if (code !== 200) return notyf.error(msg)
        notyf.success(msg)

        state.item.id   = data.id
        state.struct.id = data.id

        await router.push({path: '/admin/article/write/' + parseInt(data.id)})
    },
    // 树
    tree: {
        stringify: (data = [], pid = 0) => {
            const result = []
            for (const item of data) {
                if (item.pid === pid) {
                    const node = { value: item.id, label: item.name, children: [] }
                    node.children = method.tree.stringify(data, item.id)
                    result.push(node)
                }
            }
            return result
        },
        parse: (data, selected) => {
            let result = []
            for (let item of data) {
                if (selected.includes(item.id)) {
                    if (item.pid === 0) result.push([item.id])
                    else {
                        for (let i = 0; i < result.length; i++) {
                            if (result[i][result[i].length - 1] === item.pid) {
                                result.push([...result[i], item.id])
                                break
                            }
                        }
                    }
                }
            }
            return result
        }
    },
    cover: {
        // 移除封面图
        remove: (file) => {
            delete state.item.cover.preview[file.uid]
        },
        // 上传成功
        success: async (response, file, list) => {

            const { code, msg } = response
            if (code !== 200) return notyf.error(msg)

            for (let key = 0; key < list.length; key++) {
                // 判断是否存在 response
                if (list[key].response) {
                    const { data } = list[key].response
                    if (!data?.path) continue
                    list[key] = { name: data.path.replace(/.*\//, ''), url: data.path }
                }
            }
            state.item.cover.preview = list
        },
        // 上传失败
        error: (err, file, fileList) => {
            console.log(err, file, fileList)
        }
    },
    // 文件上传自定义头
    headers: () => {
        let result = {}
        if (!utils.is.empty(globalThis?.inis?.API_KEY)) {
            result['i-api-key'] = globalThis?.inis?.API_KEY
        }
        let TOKEN_NAME = globalThis?.inis?.TOKEN_NAME || 'INIS_LOGIN_TOKEN'
        if (utils.has.cookie(TOKEN_NAME)) {
            let token = utils.get.cookie(TOKEN_NAME)
            if (!utils.is.empty(token)) {
                result.Authorization = token
            }
        }
        return result
    },
    empty: value => utils.is.empty(value),
}

watch(() => state.item.cover, (value) => {
    // 计算封面图数量
    let len = {
        preview: value.preview.length || 0,
        links: value.links.split('\n').filter(item => !utils.is.empty(item)).length || 0
    }

    // 预览图数量大于外链图数量 - 补齐外链图
    if (len.preview > len.links) {
        state.item.cover.links = value.preview.map(item => item.url).join('\n') + '\n'
    }
    // 外链图数量大于预览图数量 - 补齐预览图
    else if (len.links > len.preview) {
        state.item.cover.links   = value.links + '\n'
        state.item.cover.preview = value.links.split('\n').filter(item => !utils.is.empty(item)).map(item => ({ name: item.replace(/.*\//, ''), url: item }))
    }

}, { deep: true })

watch(() => route.params?.id, (value) => {
    if (utils.is.empty(value)) return
    method.init()
})

// 监听 html 下的鼠标右键事件
document.addEventListener('contextmenu', (event) => {
    // 阻止默认事件
    event.preventDefault()
    // 判断点击在不在 #tabs-area 区域内，在不显示右键菜单
    if (!event?.target?.closest('#tinymce')) proxy.$refs['global-menu']?.show(event.x, event.y)
})

// 组件注销前 - 重置 container-xxl
onBeforeUnmount(() => {
    document.querySelectorAll('.container-xxl').forEach(el => {
        el.classList.remove('container-xxl')
        el.classList.add('container-fluid')
    })
})
</script>