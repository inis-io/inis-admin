<template>
    <div class="container-fluid container-box">

    </div>
</template>

<script setup>
import utils from '{src}/utils/utils'
import notyf from '{src}/utils/notyf'
// import axios from '{src}/utils/request'
import { useRouter } from 'vue-router'
import { onMounted, getCurrentInstance, reactive } from 'vue'
import axios from "axios"

const { ctx, proxy } = getCurrentInstance()

const router = useRouter()
const state  = reactive({

})

const testApi = () => {
    const array = []
    for (let i = 0; i < 50; i++) {
        // array.push(utils.fetch.get('/api/test').then(res => console.log(res)))
        array.push(axios.get('/api/users/one').then(res => console.log(res)))
    }
    axios.all(array).then(res => console.log(res))
    // for (let item of array) {
    //     item()
    // }
}

// testApi()

// setInterval(testApi, 1)

</script>