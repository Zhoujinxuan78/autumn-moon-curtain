<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCategories } from '@/composables/useCategories'
import { useParts } from '@/composables/useParts'
import CategorySidebar from '@/components/CategorySidebar.vue'
import PartCard from '@/components/PartCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const { categories } = useCategories({ activeOnly: true })
const selected = ref<number | 'all'>('all')

// 公开页面仅展示已发布配件（一次拉取，前端按分类过滤，保证分类切换流畅）
const { parts, loading } = useParts({ publishedOnly: true })

const list = computed(() =>
  selected.value === 'all'
    ? parts.value
    : parts.value.filter((p) => p.category_id === selected.value),
)
</script>

<template>
  <div class="flex" style="min-height: calc(100vh - 108px)">
    <div class="bg-white" style="width: 90px">
      <CategorySidebar v-model="selected" :categories="categories" />
    </div>
    <div class="flex-1 page-pad">
      <van-loading v-if="loading" class="block mx-auto mt-10" />
      <div v-else-if="list.length" class="grid grid-cols-2 gap-3">
        <PartCard v-for="p in list" :key="p.id" :part="p" />
      </div>
      <EmptyState v-else text="该分类下暂无配件" />
    </div>
  </div>
</template>
