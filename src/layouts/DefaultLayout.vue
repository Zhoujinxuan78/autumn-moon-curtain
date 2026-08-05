<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: transparent">
    <AppHeader />
    <main class="flex-1 pb-[calc(60px+env(safe-area-inset-bottom))]">
      <router-view />
    </main>
    <van-tabbar route fixed>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/parts" icon="apps-o">零配件</van-tabbar-item>
      <van-tabbar-item to="/custom" icon="photo-o">定制案例</van-tabbar-item>
      <van-tabbar-item to="/admin/dashboard" icon="setting-o">
        管理
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
