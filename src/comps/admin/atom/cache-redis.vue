<template>
    <div v-loading="state.status.loading" class="card mb-3">
        <div class="card-body">
            <i-svg name="redis" color="rgb(var(--assist-color))" size="56px" class="position-absolute opacity-25" style="right: 1.5rem"></i-svg>
            <h6 class="text-muted mt-0">
                <el-tooltip placement="top">
                    <template #content>
                        <strong class="text-success">推荐开启，有利于减少数据库和服务器的负担！</strong><br>
                        开启后会对API数据进行缓存，减少重复执行数据库操作以及对数据的运算，<br>
                        从而提高API的响应速度，减少服务器的负担。<br>
                        PS：缓存数据会存储在专门的缓存数据库Redis中。
                    </template>
                    <span class="d-inline-flex align-items-center">
                        <i-svg name="hint" color="rgb(var(--icon-color))" size="14px"></i-svg>
                        <span class="ms-1">Redis 缓存</span>
                    </span>
                </el-tooltip>
            </h6>
            <h2 class="m-b-20">
                <el-switch v-model="state.status.active" v-on:change="method.change" :disabled="!state.status.finish"
                           active-text="开启" inactive-text="关闭">
                </el-switch>
            </h2>
            <span class="badge bg-success font-white"> +30% </span>
            <span class="text-muted">
                综合提升，<span v-on:click="method.show()" class="text-dark pointer">点我配置</span>
            </span>
        </div>
    </div>

    <el-dialog v-model="state.status.dialog" class="custom" draggable :close-on-click-modal="false">
        <template #header>
            <strong class="flex-center">配置 Redis 缓存服务</strong>
        </template>
        <template #default>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="主机地址，如：localhost" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">主机：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.host"></el-input>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="端口号，如：6379" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">端口：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input-number v-model="state.struct.port" :min="1" :max="65535" class="w-100 d-flex" style="height: 28px" controls-position="right">
                        </el-input-number>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label required">
                            <el-tooltip content="数据库索引，如：0" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">数据库：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-select v-model="state.struct.database" placeholder="请选择方式" class="d-block custom font-13">
                            <el-option v-for="(_, index) in 16" :key="index" :label="index" :value="index">
                                <span class="font-13">{{ index }}</span>
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="Redis密码，无密码为空即可" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">密码：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.password" show-password placeholder="无密码为空即可"></el-input>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="缓存有效时间，建议2小时，即7200秒，0表示永不过期" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">过期时间（秒）：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.expire"></el-input>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group mb-3">
                        <label class="form-label">
                            <el-tooltip content="每个Key固定的前缀，如：inis:" placement="top">
                                <span>
                                    <i-svg name="hint" size="14px"></i-svg>
                                    <span class="ms-1">前缀：</span>
                                </span>
                            </el-tooltip>
                        </label>
                        <el-input v-model="state.struct.prefix"></el-input>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <el-button v-on:click="state.status.dialog = false">取 消</el-button>
            <el-button v-on:click="method.test()" :loading="state.status.test">
                <i-svg v-if="!state.status.test" name="connect" size="14px"></i-svg>
                <span class="ms-1">测试连接</span>
            </el-button>
            <el-button v-on:click="method.save()" :loading="state.status.wait">保 存</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import utils from '{src}/utils/utils.js'
import notyf from '{src}/utils/notyf.js'
import axios from '{src}/utils/request.js'

const { ctx, proxy } = getCurrentInstance()
const emit  = defineEmits(['refresh'])
const state = reactive({
    struct: {
        open:     false,
        default:  null,
        host:     'localhost',
        port:     6379,
        database: 0,
        password: '',
        prefix:   'inis:',
        expire:   '2 * 60 * 60',
    },
    status: {
        finish: false,
        active: false,
        dialog: false,
        loading: true,
        test: false,
    },
    backup: {}
})

onMounted(async () => {
    await method.init()
})

const method = {
    init: async () => {

        state.status.finish  = false
        state.status.loading = true

        const { code, data } = await axios.get('/api/toml/cache', {
            name: 'redis'
        })

        state.status.loading = false

        if (code !== 200) return
        state.struct = data

        // 拷贝一份备份
        state.backup = JSON.parse(JSON.stringify(data))

        state.status.finish  = true
    },
    show() {
        if (!state.status.finish) return notyf.warn('配置获取失败，无法进行配置！')
        state.status.dialog = true
    },
    change: async value => {

        const { code, msg } = await axios.put('/api/toml/cache-default', {
            value: 'redis', open: value
        })

        if (code === 200) return emit('refresh', 'cache-file', 'cache-ram')

        state.status.active = !value
        notyf.error(msg)
    },
    save: async () => {

        let field = ['host', 'port', 'database', 'password']

        // 检查关键配置是否有变化
        if (!utils.object.equal(state.struct, state.backup, field)) return notyf.warn('请先完成测试连接')

        if (utils.is.empty(state.struct.host))      return notyf.warn('请填写 主机地址！')
        if (utils.is.empty(state.struct.port))      return notyf.warn('请填写 端口号！')
        if (utils.is.empty(state.struct.database))  return notyf.warn('请选择 数据库！')

        state.status.wait   = true

        const { code, msg } = await axios.put('/api/toml/cache-redis', state.struct)

        state.status.wait   = false

        if (code !== 200) return notyf.error('保存失败：' + msg)

        state.status.dialog = false
    },
    test: async () => {

        if (utils.is.empty(state.struct.host))      return notyf.warn('请填写 主机地址！')
        if (utils.is.empty(state.struct.port))      return notyf.warn('请填写 端口号！')
        if (utils.is.empty(state.struct.database))  return notyf.warn('请选择 数据库！')

        state.status.test = true

        const { code, msg, data } = await axios.post('/api/toml/test-redis', state.struct)

        state.status.test = false

        if (code === 200) {
            // 拷贝一份备份
            state.backup = JSON.parse(JSON.stringify(state.struct))
            return notyf.success(msg)
        }

        notyf.error(`${msg}<br>${data}`)
    },
}

watch(() => state.struct, () => {
    state.status.active = state.struct.default === 'redis' && state.struct.open
}, { deep: true })

// 将子组件方法暴露给父组件
defineExpose({
    init: method.init,
})
</script>