<template>
    <div class="w-100 text-bg-muted py-1 radius-5">
        <el-input v-model="state.struct.content" v-on:focus="method.focus" v-on:blur="method.blur" placeholder="玩命开发中 . . ." class="custom comment-box px-2" ref="el-input">
            <template #append>
                <!-- v-if="state.focus" -->
                <div v-if="state.focus" class="d-flex justify-content-between align-items-center">
                    <el-popover placement="bottom" :width="300" trigger="click" class="p-0">

                        <el-tabs active-name="qq" tab-position="bottom" class="comment-box">
                            <el-tab-pane name="qq">
                                <template #label>
                                    <span class="font-12">QQ</span>
                                </template>
                                <div class="tags overflow-y-auto" style="max-height: 100px;">
                                    <small v-for="(item, index) in 20" :key="index" class="item py-1 px-2 pointer white-space-nowrap user-select-none">
                                        <span v-on:click="method.insert(`QQ${item}`)">QQ{{ item }}</span>
                                    </small>
                                </div>
                            </el-tab-pane>

                            <el-tab-pane name="bilibili">
                                <template #label>
                                    <span class="font-12">B站</span>
                                </template>
                                <div class="tags">
                                    <small v-for="(item, index) in 20" :key="index" class="item py-1 px-2 pointer white-space-nowrap user-select-none">
                                        <span v-on:click="method.insert(`B站${item}`)">B站{{ item }}</span>
                                    </small>
                                </div>
                            </el-tab-pane>

                            <el-tab-pane name="tiktok">
                                <template #label>
                                    <span class="font-12">抖音</span>
                                </template>
                                <div class="tags">
                                    <small v-for="(item, index) in 20" :key="index" class="item py-1 px-2 pointer white-space-nowrap user-select-none">
                                        <span v-on:click="method.insert(`抖音${item}`)">抖音{{ item }}</span>
                                    </small>
                                </div>
                            </el-tab-pane>
                        </el-tabs>

                        <template #reference>
                            <el-button type="success" class="p-0" style="height: 20px; width: 20px" size="small">
                                <i-svg name="emoji" color="#8a8a8a" size="15px"></i-svg>
                            </el-button>
                        </template>
                    </el-popover>
                    <el-button :disabled="!state.struct.content" type="primary" size="small" class="btn btn-info text-white">发送</el-button>
                </div>
            </template>
        </el-input>
    </div>
</template>

<script setup>
import utils from '{src}/utils/utils'

const { ctx, proxy } = getCurrentInstance()
const state  = reactive({
    focus: false,
    struct: {
        content: ''
    }
})

const method = {
    // 当选择器的输入框失去焦点时触发
    blur: (event) => {
        // 如果点击的元素和评论框无关联
        if (utils.is.empty(event.relatedTarget)) {
            // 如果评论内容为空
            if (utils.is.empty(state.struct.content)) {
                // 取消焦点
                state.focus = false
            }
        }
        // 有关联
        else {
            // 设置焦点
            proxy.$refs['el-input'].focus()
        }
    },
    // 当选择器的输入框获得焦点时触发
    focus: (event) => {
        state.focus = true
    },
    // 插入内容
    insert: (content) => {
        // 原生 JS 在光标处插入内容
        const input = proxy.$refs['el-input'].$refs.input
        const start = input.selectionStart
        const end   = input.selectionEnd
        const value = input.value
        input.value = value.slice(0, start) + content + value.slice(end)
        input.selectionStart = input.selectionEnd = start + content.length
        // 更新数据
        state.struct.content = input.value
    }
}

onMounted(() => {

})
</script>