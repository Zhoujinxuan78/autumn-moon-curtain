<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCustomProducts } from '@/composables/useCustomProducts'
import ProductCard from '@/components/ProductCard.vue'
import EmptyState from '@/components/EmptyState.vue'

// 公开页面仅展示已发布成品（RLS 已保证 visible_date 过滤）
const { products, loading, load } = useCustomProducts({ publishedOnly: true })

const search = ref('')
const startDate = ref('')
const endDate = ref('')

function reload() {
  load({ search: search.value, startDate: startDate.value, endDate: endDate.value })
}

// 搜索输入防抖（300ms），避免每次按键都打数据库
let timer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(reload, 300)
})
// 日期变更即时筛选
watch([startDate, endDate], reload)

function clearFilters() {
  search.value = ''
  startDate.value = ''
  endDate.value = ''
  load()
}
</script>

<template>
  <div class="page-pad">
    <h2 class="text-lg font-semibold mb-3">客户定制案例</h2>

    <van-search
      v-model="search"
      placeholder="搜索名称 / 地址 / 客户名"
      shape="round"
    />

    <div class="flex flex-wrap items-center gap-2 my-2 text-sm">
      <div class="flex items-center gap-1">
        <span class="text-gray-500">时间</span>
        <input
          v-model="startDate"
          type="date"
          class="border border-gray-200 rounded px-2 py-1 text-sm bg-white"
        />
        <span class="text-gray-400">~</span>
        <input
          v-model="endDate"
          type="date"
          class="border border-gray-200 rounded px-2 py-1 text-sm bg-white"
        />
      </div>
      <van-button size="mini" plain @click="clearFilters">清空筛选</van-button>
    </div>

    <van-loading v-if="loading" class="block mx-auto mt-10" />
    <div v-else-if="products.length" class="grid grid-cols-2 gap-3">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <EmptyState v-else text="未找到匹配的案例" />
  </div>
</template>
