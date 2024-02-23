<template>
    <i-table :opts="state.opts" ref="i-table">

        <template #start>
            <el-table-column type="selection" width="55"></el-table-column>
        </template>

        <template v-if="props.type === 'all'" #end>
            <el-table-column :fixed="right" label="操作" width="100" class-name="text-end">
                <template #default="scope">
                    <span class="d-flex justify-content-end">
                        <el-button v-on:click="method.edit(scope.row)" size="small">
                            <i-svg color="rgb(var(--icon-color))" name="edit" size="16px"></i-svg>
                        </el-button>
                        <el-button v-on:click="method.delete(scope.row.id, true)" size="small" class="ms-0">
                            <i-svg color="rgb(var(--icon-color))" name="delete" size="21px"></i-svg>
                        </el-button>
                    </span>
                </template>
            </el-table-column>
        </template>
        <template v-if="props.type === 'remove'" #end>
            <el-table-column :fixed="right" label="操作" width="160" class-name="text-end">
                <template #default="scope">
                    <span class="d-flex justify-content-end">
                        <el-button v-on:click="method.restore(scope.row.id)" size="small">
                            <i-svg color="rgb(var(--icon-color))" name="restore" size="16px"></i-svg>
                        </el-button>
                        <el-button v-on:click="method.edit(scope.row)" size="small" class="ms-0">
                            <i-svg color="rgb(var(--icon-color))" name="edit" size="16px"></i-svg>
                        </el-button>
                        <el-button v-on:click="method.delete(scope.row.id, false)" size="small" class="ms-0">
                            <i-svg color="rgb(var(--icon-color))" name="delete" size="21px"></i-svg>
                        </el-button>
                    </span>
                </template>
            </el-table-column>
        </template>

        <template #i-name="{ scope = {} }">
            <span v-on:dblclick="method.edit(scope)" class="d-flex align-items-center">
                <el-tooltip :content="scope.name" :disabled="utils.is.empty(scope.name)" placement="top">
                    <span class="d-flex align-items-center">
                        <i-svg name="dot" :color="scope.root === 1 ? 'var(--bs-success)' : 'var(--bs-secondary)'" size="20px"></i-svg>
                        <span class="limit-1-line">{{ scope?.name }}</span>
                    </span>
                </el-tooltip>
            </span>
        </template>

        <template #i-users="{ scope = {} }">
            <div class="d-flex align-items-center">
                <el-tooltip v-for="(item, index) in scope.result?.users?.slice(0, 5)" :key="item.id" :content="`@${item.nickname} ${item.account}`" placement="top">
                    <el-avatar :src="item.avatar" size="small" :class="'avatar-shadow ms-n2 z-index-' + (10 - index)"></el-avatar>
                </el-tooltip>
                <el-tooltip v-if="scope.result?.users?.length > 12" :content="`有 ${scope.result?.users?.length} 人拥有该权限`" placement="top">
                    <span class="z-index-0 bg-primary-lighten d-flex align-items-center justify-content-center font-white ms-n2 avatar-shadow" style="width: 24px; height: 24px; border-radius: 200px">+</span>
                </el-tooltip>
            </div>
        </template>

        <template #i-remark="{ scope = {} }">
            <el-tooltip :disabled="utils.is.empty(scope.remark)" placement="top">
                <template #content>
                    <span v-html="method.autoWrap(scope.remark)"></span>
                </template>
                <span class="limit-1-line">{{ scope?.remark || '无' }}</span>
            </el-tooltip>
        </template>

        <template #i-key="{ scope = {} }">
            <el-tooltip :disabled="utils.is.empty(scope.key)" placement="top">
                <template #content>
                    <span v-html="method.autoWrap(scope.key)"></span>
                </template>
                <span class="limit-1-line">{{ scope?.key || '-' }}</span>
            </el-tooltip>
        </template>

    </i-table>

    <el-dialog v-model="state.item.dialog" class="custom" :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">{{ utils.is.empty(state.struct.id) ? '添 加' : '编 辑' }} 权 限 分 组</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="（必须）这个权限分组的名称叫什么？" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">名称：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.name"></el-input>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="唯一的 key 值，方便区分权限分组" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">唯一识别码：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.key"></el-input>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip placement="top">
                                <template #content>
                                    <span>（可选）为该分组的用户分配更高级的权限</span><br>
                                    <span>● 默认：即便用户拥有了对应的权限，也只能操作自己的数据，适用于普通用户或会员</span><br>
                                    <span>● 管理：该权限适用于有管理权限的用户，比如管理员和编辑员等，对别人的数据有操作权限</span><br>
                                </template>
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">权限：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.struct.root" placeholder="请选择权限" class="d-block custom font-13">
                            <el-option v-for="item in state.select.root" :key="item.value" :label="item.label" :value="item.value" class="d-flex justify-content-between">
                                <span class="font-13 d-flex align-items-center">
                                    <i-svg name="dot" :color="item.color" size="20px"></i-svg>
                                    {{ item.label }}
                                </span>
                                <small class="text-muted">{{ item.subtitle }}</small>
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="备注而已，页面上不会显示此项" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">备注：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.remark" :autosize="{ minRows: 3, maxRows: 10 }" placeholder="备注一下，避免忘记！" type="textarea"></el-input>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="添加用户权限" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">成员：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.selected.users" multiple filterable default-first-option placeholder="请选择权限" class="d-block custom font-13 multiple">
                            <el-option v-for="item in state.select.users" :key="item.id" :label="item.nickname" :value="item.id">
                                <span class="d-flex justify-content-between">
                                    <span class="d-flex align-items-center">
                                        <el-avatar :src="item.avatar" size="small" class="avatar-shadow"></el-avatar>
                                        <span class="font-14 ms-1">{{ item.nickname }}</span>
                                    </span>
                                    <small class="text-muted">{{ item.account }}</small>
                                </span>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="为用户分配后台的页面访问权限" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">页面：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.selected.pages" multiple filterable default-first-option placeholder="请选择权限" class="d-block custom font-13 multiple">
                            <el-option v-for="item in state.select.pages" :key="item.hash" :label="item.name" :value="item.hash">
                                <span class="font-13">
                                    <span v-if="!utils.is.empty(item.svg)" v-html="item.svg"></span>
                                    <i-svg color="rgb(var(--icon-color))" v-else-if="!utils.is.empty(item.icon)" :name="item.icon" :size="item.size"></i-svg>
                                    {{ item.name }}
                                </span>
                                <small class="text-muted float-end">{{ item.path }}</small>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="该分组下拥有的权限" placement="top">
                                <span>
                                    <i-svg color="rgb(var(--icon-color))" name="hint" size="14px"></i-svg>
                                    <span class="ms-1">规则：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-cascader placeholder="试试搜索：文章" :options="state.select.rules" :props="{ multiple: true }" filterable
                            class="d-block custom multiple" v-model="state.rules.select" v-on:change="method.change">
                            <template #default="{ node, data }">
                                <span>{{ data.label }} </span>
                                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                            </template>
                        </el-cascader>
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
import utils from '{src}/utils/utils.js'
import notyf from '{src}/utils/notyf.js'
import axios from '{src}/utils/request.js'
import ITable from '{src}/comps/custom/i-table.vue'
import { config as MenuConfig } from '{src}/utils/menu'
import { useUsersStore } from '{src}/store/users'
import { useAuthRulesStore } from '{src}/store/auth-rules'
import { useAuthPagesStore } from '{src}/store/auth-pages'

const emit  = defineEmits(['refresh','update:init'])
const props = defineProps({
    type: {
        type: String,
        default: 'all',
    },
    params: {
        type: Object,
        default: () => ({
            order: 'id asc',
        }),
    },
    init: {
        type: Boolean,
        default: false,
    }
})

// table - fixed
const left  = computed(() => {
    let result = 'left'
    if (utils.is.mobile()) result = false
    return result
})
// table - fixed
const right = computed(() => {
    let result = 'right'
    if (utils.is.mobile()) result = false
    return result
})

const { ctx, proxy } = getCurrentInstance()
const store  = {
    users: useUsersStore(),
    authRules: useAuthRulesStore(),
    authPages: useAuthPagesStore(),
}
const state  = reactive({
    item: {
        table: 'auth-group',
        dialog: false,
        wait: false,
    },
    struct: { root: 0 },
    opts: {
        url: '/api/auth-group/all',
        params: props.params,
        columns: [
            { prop: 'name', label: '名称', width: 150, slot: true, fixed: left },
            { prop: 'key', label: '识别码', width: 80, slot: true, align: 'center' },
            { prop: 'users', label: '成员', width: 180, slot: true },
            { prop: 'remark' , label: '备注', width: 150, slot: true },
            { prop: 'update_time', label: '更新时间', width: 140, sortable: true },
            { prop: 'create_time', label: '创建时间', width: 140, sortable: true },
        ],
        menu: {
            ...MenuConfig,
            menuList: [{
                label: '编辑',
                icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14"">
                        <path fill="rgb(var(--menu-icon-color))" d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z">
                        </path>
                    </svg>`,
                fn: (params) => method.edit(params.row),
                hidden: (params) => !utils.is.empty(params.select)
            },{
                label: '回收站',
                icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                        <path fill="rgb(var(--menu-icon-color))" d="M256 298.666667h512v554.666666H256V298.666667z m85.333333 85.333333v384h341.333334V384H341.333333z m42.666667 85.333333h85.333333v213.333334H384v-213.333334z m170.666667 0h85.333333v213.333334h-85.333333v-213.333334zM213.333333 298.666667h597.333334v85.333333H213.333333V298.666667z m170.666667-128h256v85.333333H384V170.666667z">
                        </path>
                    </svg>`,
                fn: (params) => {
                    // 删除一行
                    if (utils.is.empty(params.select)) method.delete(params.row.id)
                    else {
                        const ids = params.select.map(item => item.id)
                        method.delete(ids)
                    }
                },
            }],
        }
    },
    rules: {
        // 选中的值
        select: [],
        // 规则原始列表
        column: []
    },
    // 下拉框
    select: {
        root: [
            { value: 0, label: '默认', subtitle: '只允许操作自己的数据', color: 'var(--bs-secondary)' },
            { value: 1, label: '管理', subtitle: '（穿透）允许操作他人的数据', color: 'var(--bs-success)' }
        ],
        pages: store.authPages.getFlat,
        rules: store.authRules.getTree,
    },
    selected: {
        users: [],
        pages: [],
    },
})

const method = {
    // 自动换行
    autoWrap(text = '', length = 40, symbol = '<br>') {
        // 判断 text 是否为空
        if (utils.is.empty(text)) return text
        // 每隔 length 个字符添加一个换行符
        return text.replace(new RegExp(`(.{${length}})`, 'g'), `$1${symbol}`)
    },
    // 规则树变化
    change() {
        let array = []
        // 强转数组
        for (let item of [...state.rules.select]) array.push(item[1])
        // 去重去空
        array = [...new Set(array)].filter(item => item).join(',')
        state.struct.rules = array
    },
    // 计算用户数量
    count: (value = null) => {
        if (utils.is.empty(value)) return 0
        let array = value.split('|')
        // 去空去重
        array = [...new Set(array.filter(item => !utils.is.empty(item)))]
        return array.length
    },
    // 删除数据
    async delete(ids = [], isSoft = true) {

        if (utils.is.empty(ids)) return

        // 拼接服务地址
        const uri = `/api/${state.item.table}/${isSoft ? 'remove' : 'delete'}`

        const {code, msg} = await axios.del(uri, {ids})

        if (code !== 200) return notyf.error(msg)

        // 刷新回收站数据
        emit('refresh', 'remove')

        // 重新加载数据
        await method.init()
    },
    // 编辑数据
    edit: async struct => {

        await method.users()

        // 获取规则树
        const { data } = await store.authRules.setTree()
        state.select.rules = data

        state.struct = struct

        if (struct.pages?.indexOf('all') !== -1) {
            state.selected.pages = state.select.pages?.map(item => item?.hash)
        } else {
            // 去空
            state.selected.pages = struct.pages?.split(',').filter(item => item)
        }
        // 字符串转数组 - 去空 - 去重
        state.selected.users = struct.result?.users.map(item => parseInt(item.id)).filter(item => item)

        // 判断 struct.rules 是否包含 all - 全部权限
        if (struct.rules.includes('all')) {
            let rules = []
            for (let item of state.select.rules) {
                for (let child of item?.children) {
                    rules.push([item?.label, child.value])
                }
            }
            state.rules.select = rules
            return state.item.dialog = true
        }

        // 只有部分权限
        let ids = []
        // 字符串转数组
        if (struct.rules) ids = struct.rules.split(',').map(item => parseInt(item))
        // 从原始数据中获取数据
        if (store.authRules.getFlat) {
            let rules = []
            const regex1 = /^[【|\[](.+?)[】|\]](.+)/
            // 匹配特殊字符串隔开的
            const regex2 = /(.+)[^\w\u4e00-\u9fa5\s](.+)/
            for (const item of store.authRules.getFlat) {
                if (ids.includes(parseInt(item.hash))) {
                    let match1 = item.name.match(regex1)
                    let match2 = item.name.match(regex2)
                    let name = ''
                    if (match1) name = match1[1].trim()
                    else if (match2) name = match2[1].trim()
                    rules.push([name, parseInt(item.hash)])
                }
            }
            state.rules.select = rules
        }

        state.item.dialog = true
    },
    // 初始化数据
    init: async () => {
        state.selected.users = []
        state.selected.pages = []
        // 重新加载数据
        await proxy.$refs['i-table']['init']()
    },
    // 省略文字
    omit: (text = null, length = 10, omission = ' ... ', location = 'center') => {
        if (utils.is.empty(text)) return '空'
        return utils.string.omit(text, length, omission, location)
    },
    // 恢复数据
    async restore(ids = []) {

        if (utils.is.empty(ids)) return

        const {code, msg} = await axios.put(`/api/${state.item.table}/restore`, {ids})

        if (code !== 200) return notyf.error(msg)

        // 刷新全部数据
        emit('refresh', 'all')

        // 重新加载数据
        await method.init()
    },
    // 保存数据
    save: async (params = state.struct || {}) => {

        if (utils.is.empty(params)) return notyf.warn('你在想什么？什么都不填！')
        if (utils.is.empty(params?.name)) return notyf.warn('分组名称是必须的哟！')

        // 判断是否拥有全部的权限
        let ids = store.authRules.getFlat.map(item=>parseInt(item.hash))
        // 去重去空
        ids = [...new Set(ids)].filter(item => item)
        // 重新排序
        ids.sort((a, b) => a - b)
        // 选中的权限
        let select = state.rules.select.map(item => item[1] || null)
        // 去重去空
        select = [...new Set(select)].filter(item => item)
        // 重新排序
        select.sort((a, b) => a - b)
        // 判断是否拥有全部的权限
        if (utils.array.equal(ids, select)) params.rules = 'all'
        else if (select) params.rules = select.join(',')
        else params.rules = null

        // 页面权限
        let arr1 = state.select.pages?.map(item => parseInt(item.hash)).filter(item => item)
        let arr2 = state.selected.pages.map(item => parseInt(item)).filter(item => item)

        if (utils.array.equal(arr1, arr2)) params.pages = 'all'
        else if (utils.is.empty(arr2)) params.pages = ''
        else params.pages = arr2.join(',')

        if (utils.is.empty(state.selected.users)) params.uids = ''
        else params.uids = `|${state.selected.users.join('|')}|`

        state.item.wait = true

        const {code, msg} = await axios.post(`/api/${state.item.table}/save`, params)

        state.item.wait = false

        if (code !== 200) return notyf.error(msg)

        // 关闭模态框
        state.item.dialog = false
        // 重新加载数据
        await method.init()
    },
    // 显示盒子
    show: () => {
        state.struct = {}
        state.rules.select   = []
        state.selected.users = []
        state.selected.pages = []
        state.item.dialog    = true
    },
    // 获取用户列表
    users: async () => {

        const fn = data => {
            return data.map(item => {
                const { id, nickname, account, avatar } = item
                return { id, nickname, account, avatar }
            })
        }

        if (!utils.is.empty(store.users.column)) {
            state.select.users = fn(store.users.column)
            return
        }

        const { code, data } = await axios.get('/api/users/column')

        if (code !== 200) return

        store.users.column = data
        state.select.users = fn(data)
    }
}

onMounted(() => {
    if (props.init) method.init()
    method.users()
})

watch(() => props.init, (val) => {
    if (val) method.init()
})

// 监听对话框状态
watch(() => state.item.dialog, (value) => {
    // 关闭对话框时清空数据
    if (!value) state.struct = {}
})

// 回收站数据
if (props.type === 'remove') {
    state.opts.menu.menuList = [{
        label: '编辑',
        icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14"">
            <path fill="rgb(var(--menu-icon-color))" d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z">
        </path></svg>`,
        fn: (params) => method.edit(params.row),
        hidden: (params) => !utils.is.empty(params.select)
    },{
        label: '恢复',
        icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
            <path fill="rgb(var(--menu-icon-color))" d="M716.8 290.133333c-110.933333-102.4-281.6-106.666667-396.8-12.8S170.666667 537.6 247.466667 665.6c59.733333 106.666667 179.2 166.4 302.933333 149.333333s221.866667-102.4 256-221.866666c8.533333-34.133333 42.666667-51.2 76.8-42.666667 34.133333 8.533333 51.2 42.666667 42.666667 76.8-68.266667 226.133333-302.933333 354.133333-524.8 290.133333C174.933333 853.333333 42.666667 618.666667 106.666667 392.533333c42.666667-145.066667 153.6-256 298.666666-298.666666s298.666667 0 405.333334 102.4l81.066666-81.066667c8.533333-8.533333 21.333333-12.8 34.133334-8.533333 4.266667 12.8 12.8 21.333333 12.8 34.133333v264.533333c0 17.066667-12.8 29.866667-29.866667 29.866667h-260.266667c-12.8 0-25.6-8.533333-29.866666-17.066667s0-25.6 8.533333-34.133333l89.6-93.866667z"></path>
        </svg>`,
        fn: (params) => {
            // 恢复一行
            if (utils.is.empty(params.select)) method.restore(params.row.id)
            else {
                const ids = params.select.map(item => item.id)
                method.restore(ids)
            }
        }
    },{
        label: '删除',
        icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path fill="rgb(var(--menu-icon-color))" d="M256 298.666667h512v554.666666H256V298.666667z m85.333333 85.333333v384h341.333334V384H341.333333z m42.666667 85.333333h85.333333v213.333334H384v-213.333334z m170.666667 0h85.333333v213.333334h-85.333333v-213.333334zM213.333333 298.666667h597.333334v85.333333H213.333333V298.666667z m170.666667-128h256v85.333333H384V170.666667z">
        </path></svg>`,
        fn: (params) => {
            // 删除一行
            if (utils.is.empty(params.select)) method.delete(params.row.id, false)
            else {
                const ids = params.select.map(item => item.id)
                method.delete(ids, false)
            }
        },
    }]
}

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
    show: method.show,
})
</script>