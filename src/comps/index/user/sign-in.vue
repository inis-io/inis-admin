<template>
    <el-dialog v-model="state.item.dialog" :show-close="false" class="custom sm">
        <template #header>
            <div v-if="utils.in.array(method.today(), state.days)" class="flex-center">
                <i-lottie name="finish" v-model="state.item.finish" width="70px" height="70px"></i-lottie>
                <span class="fw-medium fs-3">已签到，经验值 +30</span>
            </div>
            <div v-else class="flex-center">
                <i-svg name="check-in" size="50px"></i-svg>
                <span class="fw-medium fs-3 ms-2">签到领奖励！</span>
            </div>
        </template>
        <template #default>
            <el-calendar v-model="state.date" class="sign-in mx-3 radius-10">
                <template #header="{ date }">
                    <span>本月签到</span>
                    <span>{{ date }}</span>
                </template>
                <template #date-cell="{ data }">
                    <span :class="utils.in.array(method.day(data), state.days) ? 'check-in' : ''">
                        {{ method.day(data) }}
                    </span>
                </template>
            </el-calendar>
        </template>
        <template #footer>
            <div class="modal-footer d-flex justify-content-center">
                <el-button v-if="!utils.in.array(method.today(), state.days)" v-on:click="method.signIn()" :loading="state.item.wait">
                    {{ state.item.wait ? '签 到 中 ...' : '立 即 签 到' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import { useCommStore } from '{src}/store/comm'
import ILottie from "{src}/comps/custom/i-lottie.vue";

const store = {
    comm: useCommStore()
}
const state = reactive({
    item: {
        wait: false,
        finish: true,
    },
    date: new Date(),
    days: []
})

const method = {
    // 获取本月签到
    init: async () => {

        // 本月区间 - 时间戳
        const timestamp = method.range()

        const { code, data } = await axios.get('/api/exp/column', {
            where: [
                ['state','=', 1],
                ['type', '=', 'check-in'],
                ['uid',  '=', store.comm.login.user.id],
                ['create_time', '>=', timestamp[0]],
                ['create_time', '<=', timestamp[1]],
            ],
            field: 'id,value,create_time',
        })

        if (code !== 200) return

        // 强转数组
        state.days = Array.from(new Set(data.map(item => (new Date(item.create_time * 1000)).getDate())))
    },
    // 传入日期对象，返回本日是几号
    day: value => parseInt(value.day.split('-').slice(2).join('-')),
    // 签到
    signIn: async () => {

        state.item.wait = true
        const { code, msg } = await axios.post('/api/exp/check-in')
        state.item.wait = false

        if (code !== 200) return notyf.error(msg)

        notyf.info(msg)
        await method.init()
    },
    // 本月开始和结束时间戳
    range: () => {

        const [start, end] = [new Date(), new Date()]
        start.setDate(1)
        start.setHours(0, 0, 0, 0)
        end.setMonth(end.getMonth() + 1, 1)
        end.setHours(0, 0, 0, 0)

        return [Math.floor(start.getTime() / 1000), Math.floor(end.getTime() / 1000) - 1]
    },
    // 今天是几号
    today: () => (new Date()).getDate()
}

onMounted(async () => {
    await method.init()
})
</script>