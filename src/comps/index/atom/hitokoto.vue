<template>
    <div v-if="state.show" v-loading="state.load" class="card mb-0 pointer">
        <div v-on:click="method.init()" class="card-body">
            <p class="mb-0 text-center">{{ state.hitokoto }}</p>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import utils from '{src}/utils/utils'

const state = reactive({
    load: true,
    show: false,
    hitokoto: '',
})

const method = {
    init: async () => {

        state.load         = true
        const { hitokoto } = await axios.get('https://v1.hitokoto.cn')
        state.load         = false

        if (utils.is.empty(hitokoto)) return

        state.show         = true
        state.hitokoto     = hitokoto
    }
}

onMounted(async () => {
    await method.init()
})
</script>