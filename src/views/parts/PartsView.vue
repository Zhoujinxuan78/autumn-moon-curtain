<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCategories } from '@/composables/useCategories'
import { useParts } from '@/composables/useParts'
import { fetchAllCategoryTiers } from '@/api/categoryTiers'
import type { CategoryTier } from '@/types'
import CategorySidebar from '@/components/CategorySidebar.vue'
import PartCard from '@/components/PartCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const { categories } = useCategories({ activeOnly: true })
const selected = ref<number | 'all'>('all')
const selectedTier = ref<number | 'all'>('all')

// 公开页面仅展示已发布配件（一次拉取，前端按分类过滤，保证分类切换流畅）
const { parts, loading } = useParts({ publishedOnly: true })

// 档位跟随所选类别：切换分类即换档位集合
const allTiers = ref<CategoryTier[]>([])
fetchAllCategoryTiers().then((t) => (allTiers.value = t))

const tiersByCategory = computed<Record<number, CategoryTier[]>>(() => {
  const map: Record<number, CategoryTier[]> = {}
  for (const t of allTiers.value) {
    ;(map[t.category_id] ||= []).push(t)
  }
  return map
})

// 仅当选择了具体类别时才展示该类别的档位筛选
const visibleTiers = computed<CategoryTier[]>(() =>
  selected.value === 'all' ? [] : tiersByCategory.value[selected.value] || [],
)

// 切换分类时重置档位筛选
watch(selected, () => (selectedTier.value = 'all'))

const list = computed(() => {
  let arr =
    selected.value === 'all'
      ? parts.value
      : parts.value.filter((p) => p.category_id === selected.value)
  if (selectedTier.value !== 'all') {
    arr = arr.filter((p) => p.tier_id === selectedTier.value)
  }
  return arr
})
</script>

<template>
  <div class="flex" style="min-height: calc(100vh - 108px)">
    <div class="bg-white" style="width: 90px">
      <CategorySidebar v-model="selected" :categories="categories" />
    </div>
    <div class="flex-1 page-pad">
      <!-- 质量档位筛选（跟随所选类别） -->
      <div v-if="visibleTiers.length" class="flex gap-2 overflow-x-auto pb-2 -mt-1">
        <span
          class="shrink-0 text-xs px-3 py-1 rounded-full cursor-pointer"
          :style="
            selectedTier === 'all'
              ? 'background:var(--curtain-primary);color:#fff'
              : 'background:var(--curtain-bg-soft);color:var(--curtain-ink-soft)'
          "
          @click="selectedTier = 'all'"
        >
          全部档位
        </span>
        <span
          v-for="t in visibleTiers"
          :key="t.id"
          class="shrink-0 text-xs px-3 py-1 rounded-full cursor-pointer"
          :style="
            selectedTier === t.id
              ? 'background:var(--curtain-primary);color:#fff'
              : 'background:var(--curtain-bg-soft);color:var(--curtain-ink-soft)'
          "
          @click="selectedTier = t.id"
        >
          {{ t.name }}
        </span>
      </div>

      <van-loading v-if="loading" class="block mx-auto mt-10" />
      <div v-else-if="list.length" class="grid grid-cols-2 gap-3">
        <PartCard v-for="p in list" :key="p.id" :part="p" />
      </div>
      <EmptyState v-else text="该分类下暂无配件" />
    </div>
  </div>
</template>
