<template>
    <div class="container-fluid container-box px-2 px-lg-3">
        <div class="row">
            <div class="col-lg-9 px-2">
                <atom-banner-color-thief class="mb-3"></atom-banner-color-thief>
                <atom-post></atom-post>
            </div>
            <div class="col-lg-3 sticky">
                <base-info></base-info>
                <atom-ranking></atom-ranking>
            </div>
        </div>
    </div>
</template>

<script setup>
import AtomPost from '{src}/comps/index/atom/post.vue'
import BaseInfo from '{src}/comps/index/user/base-info.vue'
import AtomRanking from '{src}/comps/index/atom/ranking.vue'
import AtomHitokoto from '{src}/comps/index/atom/hitokoto.vue'
import AtomBannerColorThief from '{src}/comps/index/atom/banner/color-thief.vue'

const router = useRouter()
const state  = reactive({

})
</script>

<style lang="css" scoped>
.sticky > :nth-last-child(1){
    position: sticky;
    top: 5.8rem;
}
</style>