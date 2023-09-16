<template>
    <div class="container-fluid mt-5">
        <el-steps :active="state.item.active" simple>
            <el-step title="配置数据库"></el-step>
            <el-step title="创建管理员"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <div class="card mt-3">
            <div v-if="state.item.active === 1" class="card-body">
                <div class="row my-2">
                    <div class="col-md-6">
                        <div class="form-group mb-3">
                            <label class="form-label">
                                <el-tooltip content="数据库的类型，目前只支持MySQL" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">类型：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-select v-model="state.struct.type" placeholder="请选择方式" class="d-block custom font-13">
                                <el-option v-for="item in state.select.db" :key="item.value" :label="item.label" :value="item.value">
                                    <span class="font-13">{{ item.label }}</span>
                                    <small class="text-muted float-end">{{ item.value }}</small>
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group mb-3">
                            <label class="form-label">
                                <el-tooltip content="推荐用默认的 utf8mb4" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">字符集：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-select v-model="state.struct.charset" placeholder="请选择方式" class="d-block custom font-13">
                                <el-option v-for="item in state.select.charset" :key="item.value" :label="item.value" :value="item.value">
                                    <span class="font-13">{{ item.value }}</span>
                                    <small class="text-muted float-end">{{ item.label }}</small>
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip placement="top">
                                    <template #content>
                                        （必须）正常来说默认就行，相对于程序所在的服务器来说，如果数据库不在本地，那么就填写数据库所在的服务器地址
                                    </template>
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">地址：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.struct.hostname" placeholder="如：localhost"></el-input>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip content="（必须）默认端口是：3306，如果修改过端口，请填写正确的端口号" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">端口号：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.struct.hostport"></el-input>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip content="（必须）数据库表前缀" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">表前缀：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.struct.prefix" disabled></el-input>
                        </div>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip content="（必须）数据库的名称" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">数据库名：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.struct.database"></el-input>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip content="（必须）数据库用户名称" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">用户名：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.struct.username"></el-input>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip content="（必须）数据库的密码" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">密码：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.struct.password" show-password></el-input>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <el-button v-on:click="method.connect()" :loading="state.load.connect" class="mx-2">
                        <i-svg v-if="!state.item.connect" name="connect" size="14px"></i-svg>
                        <span class="ms-1">测试连接</span>
                    </el-button>
                    <el-button v-on:click="method.next(2)" type="primary" class="mx-2">下一步</el-button>
                </div>
            </div>
            <div v-else-if="state.item.active === 2" class="card-body">
                <div class="row my-2">
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip placement="top">
                                    <template #content>
                                        （必须）用来登录的账户，此处默认管理员权限
                                    </template>
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">帐号：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.user.account"></el-input>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip content="（必须）推荐大于8位，且包含数字、字母和特殊符号" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">密码：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.user.password1" show-password></el-input>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip content="（必须）推荐大于8位，且包含数字、字母和特殊符号" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">确认密码：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.user.password2" show-password></el-input>
                        </div>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col-md-6">
                        <div class="form-group mb-3">
                            <label class="form-label">
                                <el-tooltip placement="top">
                                    <template #content>
                                        用来显示的昵称
                                    </template>
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">昵称：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.user.nickname"></el-input>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group mb-3">
                            <label class="form-label required">
                                <el-tooltip content="（必须）开启短信服务之后，用来登录或找回密码" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">邮箱：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.user.email"></el-input>
                        </div>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col-lg-12">
                        <div class="form-group mb-3">
                            <label class="form-label">
                                <el-tooltip content="简单的介绍一下" placement="top">
                                    <span>
                                        <i-svg name="hint" size="14px"></i-svg>
                                        <span class="ms-1">个人简介：</span>
                                    </span>
                                </el-tooltip>
                            </label>
                            <el-input v-model="state.user.description" :autosize="{ minRows: 3, maxRows: 10 }" placeholder="写点什么吧 ..." type="textarea"></el-input>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <el-button v-on:click="method.prev(1)" class="mx-2">上一步</el-button>
                    <el-button v-on:click="method.createAdmin()" type="primary" class="mx-2">下一步</el-button>
                </div>
            </div>
            <div v-else class="card-body">
                <div class="alert alert-primary pb-0" role="alert">
                    <h3 class="alert-heading">恭喜您！</h3>
                    <p>当你看到我的时候，就表示你已经成功的安装 inis 程序，感谢你的使用。</p>
                    <p>●
                        <el-tooltip content="双击复制" placement="top">
                            <span v-on:dblclick="method.copy(632274746)">inis官方QQ群：632274746</span>
                        </el-tooltip>
                        <span class="mx-2">|</span>
                        <el-tooltip content="双击复制" placement="top">
                            <span v-on:dblclick="method.copy(926403239)">开发者QQ群：926403239</span>
                        </el-tooltip>
                        <span class="mx-2">|</span>
                        <el-tooltip content="点我前往" placement="top">
                            <span v-on:click="method.window('//inis.cc', '_blank')">官方社区 inis.cc</span>
                        </el-tooltip>
                    </p>
                    <p>●
                        <el-tooltip content="双击复制" placement="top">
                            <span v-on:dblclick="method.copy(97783391)">作者QQ：97783391</span>
                        </el-tooltip>
                        <span class="mx-2">|</span>
                        <el-tooltip content="双击复制" placement="top">
                            <span v-on:dblclick="method.copy('v-inis')">作者微信：v-inis</span>
                        </el-tooltip>
                        <span class="mx-2">|</span>
                        <el-tooltip content="点我前往" placement="top">
                            <span v-on:click="method.window('https://inis-pro.apifox.cn', '_blank')">API 文档：inis-pro.apifox.cn</span>
                        </el-tooltip>
                    </p>
                    <hr>
                    <p class="d-flex justify-content-center my-3">
                        <el-button v-on:click="method.window()" type="primary" class="mx-2">回 到 首 页</el-button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()

const state  = reactive({
    item: {
        active: 1,
        DB_KEY: 'DATABASE_STRUCT',
        connect: false
    },
    struct: {
        type: 'mysql',
        hostname: 'localhost',
        hostport: 3306,
        charset: 'utf8mb4',
        prefix: 'inis_',
        database: '',
        username: '',
        password: '',
    },
    user: {
        account: null,
        password1: null,
        password2: null,
        nickname: null,
        email: null,
        description: '这个人很懒，什么都没有留下！',
    },
    select: {
        db: [{ value: 'mysql', label: 'MySQL 数据库' }],
        charset: [
            { value: 'utf8mb4', label: '支持4字节的Unicode字符，是MySQL 5.5.3及以上版本推荐使用的默认字符集。' },
            { value: 'utf8',    label: '支持3字节的Unicode字符，但无法正确存储一些特殊的Emoji表情符号。' },
            { value: 'gb2312',  label: '汉字编码标准。' },
            { value: 'gbk',     label: '扩展了gb2312字符集，支持更多汉字。' },
            { value: 'latin1',  label: 'ISO-8859-1字符集，支持西欧语言。' },
        ],
    },
    load: {
        connect: false,
    },
    retry: {
        count: 1,
        time: 2000,
    },
})

onMounted(async () => {
    if (utils.has.session(state.item.DB_KEY)) {
        state.struct = utils.get.session(state.item.DB_KEY)
    }
})

const method = {
    // 连接数据库
    connect: async () => {

        if (utils.is.empty(state.struct.hostname)) return notyf.warn('数据库地址不能为空！')
        if (utils.is.empty(state.struct.hostport)) return notyf.warn('数据库端口不能为空！')
        if (utils.is.empty(state.struct.database)) return notyf.warn('数据库名称不能为空！')
        if (utils.is.empty(state.struct.username)) return notyf.warn('数据库用户名不能为空！')
        if (utils.is.empty(state.struct.password)) return notyf.warn('数据库密码不能为空！')

        state.load.connect  = true

        const { code, msg } = await axios.post('/dev/install/connect-db', state.struct)

        state.load.connect  = false

        if (code !== 200) {
            state.item.connect = false
            return notyf.error(msg)
        }

        state.item.connect = true
        notyf.success('数据库连接成功！')
        utils.set.session(state.item.DB_KEY, state.struct)
    },
    // 初始化数据库
    initDB: async () => {

        const { code, msg } = await axios.post('/dev/install/init-db')
        if (code === 200) return

        notyf.error(msg)
        state.item.connect = false
    },
    // 创建管理员
    createAdmin: async () => {

        if (!state.item.connect) return notyf.warn('请先测试数据库连接！')

        if (utils.is.empty(state.user.account))   return notyf.warn('帐号不能为空！')
        if (utils.is.empty(state.user.email))     return notyf.warn('邮箱不能为空！')
        if (!utils.is.email(state.user.email))    return notyf.warn('邮箱格式不正确！')
        if (utils.is.empty(state.user.password1)) return notyf.warn('密码不能为空！')
        if (utils.is.empty(state.user.password2)) return notyf.warn('请再次输入密码！')
        if (state.user.password1 !== state.user.password2) return notyf.warn('两次输入的密码不一致！')

        state.user.password = state.user.password2

        try {

            const { code, msg } = await axios.post('/dev/install/create-admin', state.user)
            if (code === 500) return method.retry()
            if (code !== 200) return notyf.error(msg)

            delete state.user.password1
            delete state.user.password2

            notyf.success('创建管理员成功！')
            utils.clear.session(state.item.DB_KEY)
            await method.lock()
            await method.next(3)

        } catch (error) {
            await method.retry()
        }
    },
    // 重试
    retry: async () => {

        if (state.retry.count > 5) return notyf.error('安装失败，请联系兔子，QQ：97783391', {
            duration: 10 * 60 * 1000,
        })

        await method.sleep(state.retry.time)
        await method.connect()
        await method.sleep(state.retry.time)
        await method.initDB()
        await method.sleep(state.retry.time)
        await method.createAdmin()

        state.retry.count++
    },
    sleep: (time = 1000) => new Promise((resolve) => setTimeout(resolve, time)),
    // 上锁（安装锁）
    lock: async () => {
        const { code, msg } = await axios.post('/dev/install/lock')
        if (code !== 200) return notyf.error(msg)
    },
    // 下一步
    next: async (active = 1) => {
        if (active === 2) {
            if (!state.item.connect) return notyf.warn('请先测试数据库连接！')
            await method.initDB()
        }
        state.item.active = active
    },
    // 上一步
    prev: (active = 1) => {
        state.item.active = active
    },
    // 打开窗口
    window: (path = '/', target = '_self') => window.open(path, target),
    // 复制文本
    copy  : (text = null, msg = '复制成功！') => {

        if (utils.is.empty(text)) return

        utils.set.copy.text(text)

        if (!utils.is.empty(msg)) return notyf.info(msg)
    },
}

watch(() => state.user, (value = {}) => {
    // 清除 account 中的空格
    state.user.account = value.account.replace(/\s+/g, '')
}, { deep: true })
</script>