<template>
    <div class="container-fluid container-box">
        <div class="row">
            <div v-for="item in 8" :key="item" class="col-md-3">
                <div v-slide-in class="card">
                    <div class="card-body p-2">
                        <el-image :src="'/api/file/rand?name=imgs.txt&size=250x150&redirect=true&id=' + item" fit="cover" class="w-100 cover" style="height: 150px">
                        </el-image>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { useRouter } from 'vue-router'
import { onMounted, getCurrentInstance, reactive } from 'vue'
import axios from '{src}/utils/request'

const { ctx, proxy } = getCurrentInstance()

const router = useRouter()
const state  = reactive({
    
})

onMounted(() => {

})
</script>