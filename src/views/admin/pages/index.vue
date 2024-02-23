<template>
    <div class="container-fluid container-box">
        <div class="row">
            <div class="col-md-8 px-2">
                <el-carousel trigger="click" height="350px" class="color-thief" arrow="always">
                    <el-carousel-item v-for="(item, index) in 6" :key="item">
                        <el-image :src="'https://inis.cn/api/file/rand?name=imgs.txt&id=' + item" crossorigin="anonymous"
                            v-on:load="method.load($event.target, index)" fit="cover" class="w-100" style="height: 310px">
                        </el-image>
                        <div class="carousel-footer mb-2" ref="carousel-footer">
                            <p class="title mb-3 ms-3">
                                <span class="font-white font-17">这是测试的内容</span>
                            </p>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="col-md-4 px-2">
                <div class="card mb-3">
                    <div class="card-body py-2">
                        <div class="d-flex align-items-center justify-content-between">
                            <span class="font-16 text-dark">热门主题</span>
                            <span>更多</span>
                        </div>
                        <ul class="i-ul mb-0">
                            <li class="mt-2 d-flex align-items-center justify-content-between">
                                <span class="font-13">
                                    <span class="point-circle bg-secondary me-2"></span>
                                    inis 默认主题
                                </span>
                                <span>使用人数 50W+</span>
                            </li>
                            <li class="mt-2 d-flex align-items-center justify-content-between">
                                <span class="font-13">
                                    <span class="point-circle bg-secondary me-2"></span>
                                    其它主题
                                </span>
                                <span>使用人数 100K+</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <el-image src="/1.png" style="height: 113px" class="w-100" fit="cover"></el-image>
            </div>
        </div>
        <div class="card mt-2">
            <div class="card-body p-0">
                <el-tabs v-model="state.item.tabs">
                    <el-tab-pane name="count">
                        <template #label>
                            <span class="fw-bolder font-12">数据统计</span>
                        </template>
                        <div class="row px-3 pb-3">
                            <div v-for="item in 8" :key="item" class="col-md-3 py-1">
                                <div class="card mb-0" style="box-shadow: unset">
                                    <div class="card-body">
                                        {{ item }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="other">
                        <template #label>
                            <span class="fw-bolder font-12">其它信息</span>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
    <mouse-menu ref="mouse" v-bind="state.item.menu"></mouse-menu>
</template>

<script setup>
import ColorThief from 'colorthief'
import MouseMenu from '@howdyjs/mouse-menu'
import { list as MenuList, config as MenuConfig } from '{src}/utils/menu'

const { ctx, proxy } = getCurrentInstance()

const router = useRouter()
const state  = reactive({
    item: {
        tabs  : 'count',
        menu  : {
            ...MenuConfig,
            menuList: [{
                label: '刷新',
                icon: `<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                    <path fill="rgb(var(--menu-icon-color))" d="M608 928c-229.76 0-416-186.24-416-416h-0.128c0-0.416 0.128-0.768 0.128-1.184a95.904 95.904 0 1 0-191.872-1.184c0 0.384-0.128 0.768-0.128 1.184l0.032 0.384c0 0.288 0.096 0.544 0.096 0.8H0c0 282.784 229.216 512 512 512 282.016 0 510.592-227.968 511.872-509.632C1022.592 743.072 836.928 928 608 928z"></path>
                    <path fill="rgb(var(--menu-icon-color))" d="M1023.872 512H1024c0-282.784-229.216-512-512-512C230.016 0 1.408 227.968 0.128 509.632 1.408 280.96 187.072 96 416 96c229.76 0 416 186.24 416 416h0.128c0 0.416-0.128 0.768-0.128 1.184a96 96 0 0 0 96 96 95.872 95.872 0 0 0 95.872-94.816c0-0.416 0.128-0.768 0.128-1.184l-0.032-0.384c0-0.288-0.096-0.544-0.096-0.8z"></path>
                </svg>`,
                fn: () => method.refresh()
            }],
        },
    }
})

onMounted(async () => {
    // 追加鼠标右键菜单
    state.item.menu.menuList.push(...[{line: true}, ...await MenuList()])
})

const method = {
    load: async (img, index) => {
        const color = await (new ColorThief).getColor(img)
        proxy.$refs['carousel-footer'][index].style.background = `rgb(${color.join(',')})`
    }
}


// 监听 html 下的鼠标右键事件
document.addEventListener('contextmenu', (event) => {
    // 阻止默认事件
    event.preventDefault()
    // 判断点击在不在 #tabs-area 区域内，在不显示右键菜单
    proxy.$refs['mouse']?.show(event.x, event.y)
})
</script>