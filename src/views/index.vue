<template>
  <div class="relative flex h-screen w-[750px] flex-col">
    <div class="relative top-2 flex w-full flex-row items-center justify-center">
      <img class="h-[66px] w-[63px]" :src="LOGO" alt="logo" />
      <van-search class="custom-search w-[486px]" v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch"
        shape="round">
        <template #action>
          <div class="text-[32px]" @click="onClickButton">搜索</div>
        </template>
      </van-search>
    </div>
    <van-tabs v-model="active" :swipeable="true" class="custom-tabs relative top-[50px]" color="#00E0D7"
      title-active-color="#222222" title-inactive-color="#AAAAAA" sticky>
      <van-tab v-for="(item, key, index) in tabNames" :key="key">
        <template #title>
          <span :style="{ fontSize: '16px', fontWeight: 'bold' }">
            {{ item }}
          </span>
        </template>
        <component :is="getTabComponent(Number(index))" class="relative top-[30px] pb-[50px]" />

      </van-tab>

    </van-tabs>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  ref,
  reactive,
  watchEffect,
  provide,
} from 'vue'
import LOGO from '@/assets/logo_ic.png'
import { showToast } from 'vant'
import { tabNames } from '@/constants'
import FinishedSample from '@/components/FinishedSample.vue'
import GameCoinsFaq from '@/components/IncomeFaq.vue'
import RechargeFaq from '@/components/RechargeFaq.vue'
const active = ref(0)
const value = ref('')
const onSearch = () => showToast('搜索成功！')
const onClickButton = () => {
  showToast(`当前输入：${value.value}`)
}
// 这里定义每个 tab 对应的组件
const getTabComponent = (index: number) => {
  switch (index) {
    case 0:
      console.log('FinishedSample')
      return FinishedSample
    case 1:
      return GameCoinsFaq
    case 2:
      return RechargeFaq
    case 3:
      return RechargeFaq
    default:
      return null
  }
}
</script>
<style scoped>
.custom-search ::v-deep(.van-search__content) {
  height: 60px;
  padding-top: 12px;
  border-radius: 30px;
}

/* 输入框文字居中对齐（可选） */
.custom-search ::v-deep(input.van-field__control) {
  height: 40px;
  font-size: 22px;
}

/* ✅ 修改放大镜 icon 大小 */
.custom-search ::v-deep(.van-field__left-icon .van-icon) {
  font-size: 30px;
}

.custom-tabs ::v-deep(.van-tabs__wrap) {
  height: 65px;
}

.custom-tabs ::v-deep(.van-tab) {
  height: 50px !important;
  line-height: 50px;
}

.custom-tabs ::v-deep(.van-tabs__line) {
  height: 6px;
}
</style>
