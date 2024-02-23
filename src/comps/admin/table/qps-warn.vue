<template>
    <i-table :opts="state.opts" ref="i-table">

        <template #start>
            <el-table-column type="selection" width="55"></el-table-column>
        </template>

        <template v-if="props.type === 'all'" #end>
            <el-table-column :fixed="right" label="操作" width="100" class-name="text-end">
                <template #default="scope">
                    <span class="d-flex justify-content-end">
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
                        <el-button v-on:click="method.delete(scope.row.id, false)" size="small" class="ms-0">
                            <i-svg color="rgb(var(--icon-color))" name="delete" size="21px"></i-svg>
                        </el-button>
                    </span>
                </template>
            </el-table-column>
        </template>

        <template #i-ip="{ scope = {} }">
            <el-tooltip :content="'双击复制：' + scope.ip" :disabled="utils.is.empty(scope?.ip)" placement="top">
                <span v-on:dblclick="method.copy(scope?.ip)">{{ method.omit(scope?.ip, 15) }}</span>
            </el-tooltip>
        </template>

        <template #i-route="{ scope = {} }">
            <el-tooltip :content="`双击复制：[${scope.method}] ${scope.path}`" :disabled="utils.is.empty(scope.path)" placement="top">
                <span v-on:dblclick="method.copy(`[${scope.method}] ${scope.path}`, '复制成功！')">
                    <span :class="'text-' + method.color(scope.method)">[{{ scope?.method }}]</span>
                    <span class="ms-1">{{ method.omit(scope?.path, 30, ' ...', 'end') }}</span>
                </span>
            </el-tooltip>
        </template>

        <template #i-agent="{ scope = {} }">
            <el-tooltip :disabled="utils.is.empty(scope.agent)" placement="top">
                <template #content>
                    <span v-html="method.autoWrap(scope.agent)"></span>
                </template>
                <span>{{ method.omit(scope?.agent, 35) }}</span>
            </el-tooltip>
        </template>

    </i-table>
</template>

<script setup>
import utils from '{src}/utils/utils.js'
import notyf from '{src}/utils/notyf.js'
import axios from '{src}/utils/request.js'
import ITable from '{src}/comps/custom/i-table.vue'
import { config as MenuConfig } from '{src}/utils/menu.js'

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
const left = computed(() => {
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
const state  = reactive({
    item: {
        table: 'qps-warn',
    },
    struct: {},
    opts: {
        url: '/api/qps-warn/all',
        params: props.params,
        columns: [
            { prop: 'ip', label: 'IP', width: 120, slot: true, fixed: left },
            { prop: 'route', label: '路由', width: 150, slot: true },
            { prop: 'agent' , label: 'User-Agent', width: 250, slot: true },
            { prop: 'update_time', label: '更新时间', width: 140, sortable: true },
            { prop: 'create_time', label: '创建时间', width: 140, sortable: true },
        ],
        menu: {
            ...MenuConfig,
            menuList: [{
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
})

const method = {
    // 刷新数据
    init: async () => {
        // 重新加载数据
        await proxy.$refs['i-table']['init']()
    },
     // 真删 和 软删
    async delete(ids = [], isSoft = true) {

        if (utils.is.empty(ids)) return

        // 拼接服务地址
        const uri = `/api/${state.item.table}/${isSoft ? 'remove' : 'delete'}`

        const { code, msg } = await axios.del(uri, { ids })

        if (code !== 200) return notyf.error(msg)

        // 刷新回收站数据
        emit('refresh', 'remove')

        // 重新加载数据
        await method.init()
    },
    // 恢复数据
    async restore(ids = []) {

        if (utils.is.empty(ids)) return

        const { code, msg } = await axios.put(`/api/${state.item.table}/restore`, { ids })

        if (code !== 200) return notyf.error(msg)

        // 刷新全部数据
        emit('refresh', 'all')

        // 重新加载数据
        await method.init()
    },
    // 自动换行
    autoWrap(text = '', length = 40, symbol = '<br>') {
        // 判断 text 是否为空
        if (utils.is.empty(text)) return text
        // 每隔 length 个字符添加一个换行符
        return text.replace(new RegExp(`(.{${length}})`, 'g'), `$1${symbol}`)
    },
    // 复制文本
    copy  : (text = null, msg = '复制成功！') => {

        if (utils.is.empty(text)) return

        utils.set.copy.text(text)

        if (!utils.is.empty(msg)) return notyf.info(msg)
    },
    // 省略文本
    omit  : (text = null, length = 10, omission = ' ... ', location = 'center') => {
        if (utils.is.empty(text)) return '空'
        return utils.string.omit(text, length, omission, location)
    },
    // 分配颜色
    color : (value = 'GET') => {
        // 强转大写
        value = value.toUpperCase()
        let opts = {'GET':'success', 'POST':'warning', 'PUT':'info', 'DELETE':'danger'}
        return opts[value] || 'dark'
    },
}

onMounted(async () => {
    if (props.init) await method.init()
})

watch(() => props.init, (val) => {
    if (val) method.init()
})

// 回收站数据
if (props.type === 'remove') {
    state.opts.menu.menuList = [{
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
})
</script>