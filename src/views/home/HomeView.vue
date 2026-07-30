<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const entries = [
  {
    to: '/parts',
    title: '零配件展示',
    desc: '导轨、布带、挂钩、花边……分类浏览全部配件',
    icon: 'apps-o',
  },
  {
    to: '/custom',
    title: '客户定制案例',
    desc: '真实落地成品图，按场景与地点查看',
    icon: 'photo-o',
  },
]
</script>

<template>
  <div class="page-pad">
    <!-- 品牌主视觉 -->
    <section
      class="rounded-xl p-6 text-white"
      style="background: linear-gradient(150deg, #cf9a6a 0%, #b5683f 55%, #8f4f2e 100%)"
    >
      <h1 class="text-2xl font-semibold display-serif">秋月窗帘</h1>
      <p class="mt-2 text-sm opacity-90">
        专注窗帘配件与定制落地，看得见的专业。
      </p>
      <van-button
        class="mt-4"
        round
        type="primary"
        @click="router.push('/parts')"
      >
        浏览配件
      </van-button>
    </section>

    <!-- 入口卡片 -->
    <section class="mt-4 grid grid-cols-1 gap-3">
      <div
        v-for="e in entries"
        :key="e.to"
        class="card flex items-center gap-3 p-4 cursor-pointer"
        @click="router.push(e.to)"
      >
        <van-icon :name="e.icon" size="28" color="#b5683f" />
        <div class="flex-1">
          <div class="font-medium">{{ e.title }}</div>
          <div class="text-xs text-gray-400 mt-0.5">{{ e.desc }}</div>
        </div>
        <van-icon name="arrow" color="#bbb" />
      </div>
    </section>

    <p class="mt-6 text-center text-xs text-gray-300">
      内部管理系统请点击底部「管理」进入
    </p>
  </div>
</template>
