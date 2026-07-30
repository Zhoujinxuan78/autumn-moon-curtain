<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { signOut } = useAuth()

const links = [
  { to: '/admin/dashboard', icon: 'chart-trending-o', label: '概览' },
  { to: '/admin/categories', icon: 'bars', label: '分类' },
  { to: '/admin/parts', icon: 'apps-o', label: '配件' },
  { to: '/admin/products', icon: 'photo-o', label: '案例' },
]

async function onLogout() {
  await showConfirmDialog({ title: '退出登录', message: '确认退出管理员账号？' })
  await signOut()
  router.replace('/admin/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: transparent">
    <header
      class="sticky top-0 z-20 flex items-center justify-between px-4 h-12 bg-white border-b border-gray-100"
    >
      <span class="text-base font-semibold brand-text">管理后台</span>
      <van-button size="small" plain type="primary" @click="onLogout">
        退出
      </van-button>
    </header>

    <div class="flex flex-1">
      <!-- 侧边导航（桌面端显示，移动端折叠为顶部横向） -->
      <nav
        class="hidden md:flex flex-col w-36 shrink-0 bg-white border-r border-gray-100 py-2"
      >
        <router-link
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="px-4 py-3 text-sm text-gray-600 hover:text-[var(--curtain-primary)]"
          active-class="!text-[var(--curtain-primary)] bg-[var(--curtain-primary-soft)] font-medium"
        >
          {{ l.label }}
        </router-link>
      </nav>

      <main class="flex-1 page-pad">
        <router-view />
      </main>
    </div>

    <!-- 移动端底部快捷入口 -->
    <van-tabbar route fixed class="md:hidden">
      <van-tabbar-item
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        :icon="l.icon"
      >
        {{ l.label }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
