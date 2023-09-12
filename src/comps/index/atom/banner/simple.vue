<template>
    <el-carousel v-if="state.show" height="300px" :interval="5000">
          <el-carousel-item v-for="(item, index) in state.imgs" :key="index">
              <el-image :src="item" fit="cover" class="w-100 pointer h-100 radius-5">
                  <template #error>
                      <el-image :src="method.rand()"></el-image>
                  </template>
              </el-image>
          </el-carousel-item>
    </el-carousel>
</template>

<script setup>
import utils from '{src}/utils/utils'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    }
})

const state = reactive({
    show: false,
    imgs: [],
})

const method = {
    init: () => {
        let imgs = props.modelValue.split(',')
        // 去空
        state.imgs = imgs.filter(item => !utils.is.empty(item))
    },
    rand: () => '/api/file/rand?name=imgs.txt&id=' + utils.uuid()
}

onMounted(() => {
    method.init()
})

watch(() => state.imgs, (value) => {
    state.show = !utils.is.empty(value)
})

watch(() => props.modelValue, () => {
    method.init()
})
</script>