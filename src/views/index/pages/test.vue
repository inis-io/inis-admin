<template>
    <div class="container-fluid container-box">
        <el-tabs v-model="state.item.tabs">
            <el-tab-pane name="all">
                <template #label>
                    <span class="fw-bolder font-12">全部</span>
                </template>
            </el-tab-pane>
            <el-tab-pane name="remove">
                <template #label>
                    <span class="fw-bolder font-12">回收站</span>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
import axios from '{src}/utils/request'
import { useRouter } from 'vue-router'
import { onMounted, getCurrentInstance, reactive } from 'vue'

const { ctx, proxy } = getCurrentInstance()

const router = useRouter()
const state  = reactive({
    item: {
        tabs: 'all',
    },
})

</script>