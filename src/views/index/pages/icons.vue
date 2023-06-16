<template>
    <div class="container-fluid container-box">
        <div class="row icons-list-demo">
            <div v-for="item in state.icons" :key="item" class="col-xl-3 col-lg-4 col-sm-6">
                <span class="d-flex align-items-center">
                    <i-svg :name="item" size="20px" />
                    <span v-on:dblclick="copy(item, '复制成功')" class="ms-2">{{ item }}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import utils from '{src}/utils/utils.js'
import notyf from '{src}/utils/notyf.js'
const { ctx, proxy } = getCurrentInstance()

const state = reactive({
    icons: []
})
const modulesFiles = import.meta.glob('../../../assets/svg/*.svg');
let files = []
for (let path in modulesFiles) files.push(path)
state.icons = files.map(item=>item.split('/').pop().split('.').shift())

const copy = (text = null, msg = null) => {

    if (utils.is.empty(text)) return

    utils.set.copy.text(text)

    if (!utils.is.empty(msg)) return notyf.success(msg)
}

</script>

<style scoped>
</style>