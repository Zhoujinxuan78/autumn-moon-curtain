<script setup lang="ts">
import { useCustomProducts } from '@/composables/useCustomProducts'
import ProductCard from '@/components/ProductCard.vue'
import EmptyState from '@/components/EmptyState.vue'

// 公开页面仅展示已发布成品（RLS 已保证 visible_date 过滤）
const { products, loading } = useCustomProducts({ publishedOnly: true })
</script>

<template>
  <div class="page-pad">
    <h2 class="text-lg font-semibold mb-3">客户定制案例</h2>
    <van-loading v-if="loading" class="block mx-auto mt-10" />
    <div v-else-if="products.length" class="grid grid-cols-2 gap-3">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <EmptyState v-else text="暂无定制案例" />
  </div>
</template>
