<template>
    <div class="relative flex flex-col w-[750px] h-screen bg-[#E9ECF3] overflow-x-hidden">
        <!-- border-[1px] border-solid border-[#000] -->
        <div class="relative left-[50%] translate-x-[-50%] top-[-90px] w-[1005px] h-[1005px] bg-center bg-no-repeat bg-cover flex-shrink-0 "
            :style="{ backgroundImage: `url(${Bg})` }"></div>
        <img src="../assets/back_ic.png" class="absolute top-[20px] left-[20px] w-[70px] h-[70px] z-10"
            @click="onNavBackClick" />
        <div class="absolute flex justify-center items-center w-full top-0 h-[865px]">
            <img :src="currentImage" class="max-h-[600px] rounded-[50px]" />
        </div>
        <div class="absolute flex flex-col top-[765px] w-full pb-10">
            <div class="flex flex-row gap-[20px] flex-wrap justify-center items-center w-full ">
                <FinishedItem v-for="(item, index) in descriptionDataList" :key="index" :finishedItem="item"
                    @on-item-click="onItemClick" />
            </div>
            <!-- 标题&价格 -->
            <div class="relative flex flex-row w-full mt-[20px] justify-between px-[50px]">
                <span class="relative text-[42px] font-bold">{{ itemInfo.title }}</span>
                <span class="relative mt-[20px] text-[40px] font-bold text-[#274EA3]">{{ itemInfo.price }}</span>
            </div>
            <!-- 评分 -->
            <div class="relative flex flex-row w-full items-center px-[50px] gap-[10px]">
                <span class="icon">⭐</span>
                <span class="text-[32px] font-[600] mt-[5px]">{{ itemInfo.starNumber }}</span>
                <span class="text-[32px] text-[#A2A2A2] font-[600] mt-[5px]">({{ itemInfo.Exposure }}k 观看过)</span>
            </div>
            <!-- 描述 -->
            <span class="relative text-[42px] font-bold w-full px-[50px] mt-[20px]">产品描述</span>
            <div class="relative text-[32px] text-[#4A4A4A] font-normal w-full px-[50px] mt-[10px] leading-[48px]">
                {{ itemInfo.productDescription }}
            </div>
        </div>

    </div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { finishSampleData } from '@/constants'
import Bg from '@/assets/round_bg.png'
import FinishedItem from '@/components/finishedItem.vue'

const router = useRouter()
const route = useRoute()

const rootName = 'index'
const id = route.query.data || 1
const itemInfo = finishSampleData.find(sample => sample.id === Number(id))
const descriptionDataList = computed(() => {
    console.log('itemInfo', itemInfo.descriptionData)
    return itemInfo ? itemInfo.descriptionData : ''
})
const currentImage = ref(itemInfo.image)

function onNavBackClick() {
    // if (route.name === rootName) {
    //     closeWindow()
    //     return
    // }
    console.log(window.history.length)
    if (window.history.length > 1) {
        router.go(-1)
    }
}

function onItemClick(descInfo) {
    currentImage.value = descInfo
}

const masonry = ref(null)
</script>

<style scoped></style>