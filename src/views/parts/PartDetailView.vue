<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPart } from '@/api/parts'
import { fetchCategories } from '@/api/categories'
import type { Part, Category } from '@/types'
import { formatPrice, specsToList } from '@/utils/format'
import { getPublicUrl, getThumbUrl } from '@/api/storage'
import { showImagePreview } from 'vant'

const route = useRoute()
const router = useRouter()
const part = ref<Part | null>(null)
const categories = ref<Category[]>([])
const loading = ref(true)
const activeImg = ref('')

function previewImage(index: number) {
  if (!images.value.length) return
  showImagePreview({ images: images.value, startPosition: index })
}

const images = computed(() => {
  if (!part.value) return []
  const arr = []
  if (part.value.image_url) arr.push(part.value.image_url)
  if (Array.isArray(part.value.gallery)) arr.push(...part.value.gallery)
  return arr.map((p) => getThumbUrl(p, 800, 75))
})

const specRows = computed(() => specsToList(part.value?.specs))

// 仅前台可见的档位作为质量标签
const tier = computed(() =>
  part.value?.tier && part.value.tier.is_visible !== false
    ? part.value.tier
    : null,
)

const categoryName = computed(() => {
  if (!part.value?.category_id) return '未分类'
  return (
    categories.value.find((c) => c.id === part.value!.category_id)?.name ||
    '未分类'
  )
})

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    ;[part.value, categories.value] = await Promise.all([
      fetchPart(id),
      fetchCategories(),
    ])
    activeImg.value = images.value[0] || ''
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page-pad pb-20">
    <van-nav-bar
      title="配件详情"
      left-text="返回"
      left-arrow
      @click-left="router.back()"
    />

    <van-loading v-if="loading" class="block mx-auto mt-10" />

    <template v-else-if="part">
      <van-image
        :src="activeImg"
        fit="contain"
        width="100%"
        height="280"
        radius="12"
        lazy-load
        style="background: var(--curtain-bg)"
        class="cursor-pointer"
        @click="previewImage(images.indexOf(activeImg))"
      />
      <div v-if="images.length > 1" class="flex gap-2 mt-2 overflow-x-auto">
        <img
          v-for="(img, i) in images"
          :key="i"
          :src="img"
          loading="lazy"
          class="w-16 h-16 rounded object-contain shrink-0 cursor-pointer"
          :class="img === activeImg ? 'border-2 border-[var(--curtain-primary)]' : 'border-2 border-transparent'"
          style="background: var(--curtain-bg)"
          @click="activeImg = img"
        />
      </div>

      <h2 class="mt-3 text-lg font-semibold">{{ part.name }}</h2>
      <div class="mt-1 text-base font-semibold" style="color: var(--curtain-primary)">
        {{ formatPrice(part.price, part.price_unit) }}
      </div>

      <div class="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <van-tag plain type="primary">{{ categoryName }}</van-tag>
        <van-tag v-if="tier" plain>{{ tier.name }}</van-tag>
        <span v-if="!part.is_published" class="text-red-500">未发布</span>
      </div>

      <div v-if="part.description" class="mt-3 text-sm text-gray-600 leading-6">
        {{ part.description }}
      </div>

      <div v-if="specRows.length" class="card mt-3 p-3">
        <div class="text-sm font-medium mb-2">规格参数</div>
        <div
          v-for="s in specRows"
          :key="s.key"
          class="flex justify-between text-sm py-1 border-b border-gray-50"
        >
          <span class="text-gray-400">{{ s.key }}</span>
          <span>{{ s.value }}</span>
        </div>
      </div>
    </template>

    <EmptyState v-else text="未找到该配件" />
  </div>
</template>
