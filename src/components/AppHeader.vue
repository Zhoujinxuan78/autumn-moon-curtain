<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <header
    class="sticky top-0 z-20 flex items-center justify-between px-4 h-12 bg-white border-b border-gray-100"
  >
    <div class="flex items-center gap-2" @click="router.push('/home')">
      <span class="inline-block w-2 h-5 rounded-sm" style="background: #157a6e" />
      <span class="text-lg font-semibold brand-text">帘语 · 窗帘展示</span>
    </div>
    <span class="text-xs text-gray-400">专业窗帘 · 配件 · 定制</span>
  </header>
</template>
