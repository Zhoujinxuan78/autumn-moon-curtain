<template>
    <div ref="masonry" class="masonry mx-auto">
        <div v-for="(item, index) in finishSampleData" :key="index" class="masonry-item" @click="openDetail(item.id)">
            <img :src="item.image" @load="onImgLoad" />
            <div class="relative flex justify-center overlay">
                <span class="relative flex w-full text-[30px]">{{ item.title }}</span>
                <div class="info">
                    <span class="icon">❤️</span> 2333
                </div>
                <span class="relative flex w-full justify-end text-[24px] text-[#949AA9]">{{ item.date }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import Masonry from 'masonry-layout'
import { ref, onMounted } from 'vue'
import { finishSampleData } from '@/constants'
import { useRouter } from 'vue-router'

const router = useRouter()

const masonry = ref(null)


const onImgLoad = () => {
    if (masonry.value) {
        new Masonry(masonry.value, {
            itemSelector: '.masonry-item',
            gutter: 12,
            fitWidth: true,
            percentPosition: true
        })
    }
}

onMounted(() => {
    // 首次初始化
    onImgLoad()
})

function openDetail(id) {
    router.push({
        name: 'descriptions',
        query: {
            data: id
        }
    })
}

</script>

<style scoped>
.masonry {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    max-width: 800px;
    margin: 0 auto;
    /* border: #000 1px solid; */
}

.masonry-item {
    width: 48%;
    /* 两列布局 */
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
}

.masonry-item img {
    width: 100%;
    display: block;
    object-fit: cover;
}

.overlay {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    width: 287px;
    min-height: 128px;
    padding: 10px;
    border-radius: 9px;
    background: rgba(0, 0, 0, 0.25);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    color: white;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.title {
    font-size: 30px;
    font-weight: bold;
}

.info {
    font-size: 25px;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: -30px;
}

.icon {
    color: red;
}
</style>