<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { fetchCategories } from '@/api/categories'
import { fetchParts } from '@/api/parts'
import { fetchProducts } from '@/api/customProducts'

const router = useRouter()
const userStore = useUserStore()

const counts = ref({ categories: 0, parts: 0, products: 0 })
const loading = ref(true)

const roleLabel: Record<string, string> = {
  super_admin: '超级管理员',
  admin: '管理员',
  user: '普通用户',
}

onMounted(async () => {
  try {
    const [c, p, pr] = await Promise.all([
      fetchCategories(),
      fetchParts(),
      fetchProducts(),
    ])
    counts.value = {
      categories: c.length,
      parts: p.length,
      products: pr.length,
    }
  } finally {
    loading.value = false
  }
})

const cards = [
  { to: '/admin/categories', label: '分类管理', key: 'categories' as const },
  { to: '/admin/parts', label: '配件管理', key: 'parts' as const },
  { to: '/admin/products', label: '案例管理', key: 'products' as const },
]
</script>

<template>
  <div>
    <van-loading v-if="loading" class="block mx-auto mt-10" />
    <template v-else>
      <div class="card p-4 mb-3">
        <div class="text-lg font-semibold">
          你好，{{ userStore.profile?.display_name || '管理员' }}
        </div>
        <div class="text-xs text-gray-400 mt-1">
          当前角色：{{ roleLabel[userStore.profile?.role || 'user'] }}
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 mb-3">
        <div
          v-for="c in cards"
          :key="c.to"
          class="card p-3 text-center cursor-pointer"
          @click="router.push(c.to)"
        >
          <div class="text-2xl font-semibold" style="color: var(--curtain-primary)">
            {{ counts[c.key] }}
          </div>
          <div class="text-xs text-gray-400 mt-1">{{ c.label }}</div>
        </div>
      </div>

      <div class="card p-4 text-sm text-gray-500 leading-6">
        <div class="font-medium text-gray-700 mb-1">提示</div>
        首个注册的账号默认为普通用户。如需设为管理员，请在 Supabase
        SQL Editor 执行：
        <code class="block mt-1 p-2 rounded bg-gray-50 text-xs text-gray-600">
          update public.profiles set role='super_admin' where email='你的邮箱';
        </code>
      </div>
    </template>
  </div>
</template>
