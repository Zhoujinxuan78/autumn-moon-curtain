<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProduct, fetchProductParts } from '@/api/customProducts'
import type { CustomProduct } from '@/types'
import { formatDateTime } from '@/utils/format'
import { getPublicUrl } from '@/api/storage'

const route = useRoute()
const router = useRouter()
const product = ref<CustomProduct | null>(null)
const relatedParts = ref<Array<{ quantity: number; part: any }>>([])
const loading = ref(true)

const images = computed(() => {
  if (!product.value) return []
  const arr = []
  if (product.value.cover_url) arr.push(product.value.cover_url)
  if (Array.isArray(product.value.image_urls)) arr.push(...product.value.image_urls)
  return arr.map((p) => getPublicUrl(p))
})

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    const [p, parts] = await Promise.all([
      fetchProduct(id),
      fetchProductParts(id),
    ])
    product.value = p
    relatedParts.value = parts
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="pb-20">
    <van-nav-bar
      title="案例详情"
      left-text="返回"
      left-arrow
      @click-left="router.back()"
    />

    <van-loading v-if="loading" class="block mx-auto mt-10" />

    <template v-else-if="product">
      <van-swipe v-if="images.length" :autoplay="0" indicator-color="#157a6e">
        <van-swipe-item v-for="(img, i) in images" :key="i">
          <van-image :src="img" fit="cover" width="100%" height="260" />
        </van-swipe-item>
      </van-swipe>

      <div class="page-pad">
        <h2 class="text-lg font-semibold">{{ product.title }}</h2>
        <div class="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
          <span v-if="product.location">
            <van-icon name="location-o" /> {{ product.location }}
          </span>
          <span>{{ formatDateTime(product.created_at).slice(0, 10) }}</span>
          <span v-if="product.visible_date">
            定时: {{ formatDateTime(product.visible_date) }}
          </span>
        </div>

        <p
          v-if="product.description"
          class="mt-3 text-sm text-gray-600 leading-6"
        >
          {{ product.description }}
        </p>

        <div v-if="relatedParts.length" class="mt-4">
          <div class="text-sm font-medium mb-2">所用配件</div>
          <div
            v-for="rp in relatedParts"
            :key="rp.part?.id"
            class="card flex items-center gap-2 p-2 mb-2"
          >
            <van-image
              :src="getPublicUrl(rp.part?.image_url)"
              width="48"
              height="48"
              radius="6"
            />
            <div class="flex-1">
              <div class="text-sm">{{ rp.part?.name || '已删除配件' }}</div>
              <div class="text-xs text-gray-400">数量 ×{{ rp.quantity }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <EmptyState v-else text="未找到该案例" />
  </div>
</template>
