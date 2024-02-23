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

        <template #i-title="{ scope = {} }">
            <span v-on:dblclick="method.edit(scope)" class="d-flex align-items-center">
                <el-tooltip v-if="scope.audit === 1" content="已审核" placement="top">
                    <i-svg name="audit" size="20px" class="me-1"></i-svg>
                </el-tooltip>
                <el-tooltip :content="scope.title" :disabled="utils.is.empty(scope.title)" placement="top">
                    <span class="limit-1-line">{{ scope?.title }}</span>
                </el-tooltip>
            </span>
        </template>

        <template #i-remark="{ scope = {} }">
            <el-tooltip :disabled="utils.is.empty(scope.remark)" placement="top">
                <template #content>
                    <span v-html="method.autoWrap(scope.remark)"></span>
                </template>
                <span>{{ method.omit(scope?.remark) }}</span>
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

const router = useRouter()
const emit   = defineEmits(['refresh','update:init'])
const props  = defineProps({
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
        table: 'pages',
    },
    struct: {},
    opts: {
        url: '/api/pages/all',
        params: props.params,
        columns: [
            { prop: 'title',  label: '标题', width: 150, slot: true, fixed: left },
            { prop: 'key',    label: '唯一键', width: 100 },
            { prop: 'remark', label: '备注', width: 200, slot: true },
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
})

const method = {
    // 刷新数据
    init: async () => {
        // 重新加载数据
        await proxy.$refs['i-table']['init']()
    },
    // 编辑数据
    edit: struct => {
        router.push({path: '/admin/pages/write/' + parseInt(struct.id)})
    },
     // 真删 和 软删
    async delete(ids = [], isSoft = true) {

        if (utils.is.empty(ids)) return

        // 拼接服务地址
        const uri = `/api/${state.item.table}/${isSoft ? 'remove' : 'delete'}`

        const { code, msg } = await axios.del(uri, { ids })

        if (code !== 200) return notyf.error(msg)

        // 刷新回收站数据
        emit('refresh', 'remove', 'check', 'audit')

        // 重新加载数据
        await method.init()
    },
    // 恢复数据
    async restore(ids = []) {

        if (utils.is.empty(ids)) return

        const { code, msg } = await axios.put(`/api/${state.item.table}/restore`, { ids })

        if (code !== 200) return notyf.error(msg)

        // 刷新全部数据
        emit('refresh', 'all', 'check', 'audit')

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
})
</script>