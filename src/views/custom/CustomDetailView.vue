<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProduct, fetchProductParts, type ProductPartRow } from '@/api/customProducts'
import type { CustomProduct } from '@/types'
import { formatDateTime } from '@/utils/format'
import { getPublicUrl, getThumbUrl } from '@/api/storage'
import { showImagePreview } from 'vant'

const route = useRoute()
const router = useRouter()
const product = ref<CustomProduct | null>(null)
const relatedParts = ref<ProductPartRow[]>([])
const loading = ref(true)

const images = computed(() => {
  if (!product.value) return []
  const arr = []
  if (product.value.cover_url) arr.push(product.value.cover_url)
  if (Array.isArray(product.value.image_urls)) arr.push(...product.value.image_urls)
  return arr.map((p) => getThumbUrl(p, 800, 75))
})

function previewProduct(index: number) {
  if (!images.value.length) return
  showImagePreview({ images: images.value, startPosition: index })
}

function openPart(id?: number) {
  if (id) router.push(`/parts/${id}`)
}

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
      <van-swipe v-if="images.length" :autoplay="0">
        <van-swipe-item v-for="(img, i) in images" :key="i">
          <van-image
            :src="img"
            fit="contain"
            width="100%"
            height="260"
            style="background: var(--curtain-bg)"
            class="cursor-pointer"
            @click="previewProduct(i)"
          />
        </van-swipe-item>
        <template #indicator="{ active, total }">
          <div class="swipe-indicator">
            <span
              v-for="n in total"
              :key="n"
              class="swipe-dot"
              :class="{ 'swipe-dot--active': active === n - 1 }"
            />
          </div>
        </template>
      </van-swipe>

      <div class="page-pad">
        <h2 class="text-lg font-semibold">{{ product.title }}</h2>
        <div class="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
          <span v-if="product.location">
            <van-icon name="location-o" /> {{ product.location }}
          </span>
          <span v-if="product.customer_name">
            <van-icon name="user-o" /> {{ product.customer_name }}
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
            class="card flex items-center gap-2 p-2 mb-2 cursor-pointer"
            @click="openPart(rp.part?.id)"
          >
            <van-image
              :src="getThumbUrl(rp.part?.image_url, 120, 70)"
              width="48"
              height="48"
              radius="6"
              fit="contain"
              style="background: var(--curtain-bg)"
            />
            <div class="flex-1">
              <div class="text-sm">{{ rp.part?.name || '已删除配件' }}</div>
              <div class="text-xs text-gray-400">
                数量 ×{{ rp.quantity }}
                <span
                  v-if="rp.part?.tier && rp.part.tier.is_visible !== false"
                  class="ml-1"
                  >· 档位：{{ rp.part.tier.name }}</span
                >
              </div>
            </div>
            <van-icon name="arrow" class="text-gray-300 shrink-0" />
          </div>
        </div>
      </div>
    </template>

    <EmptyState v-else text="未找到该案例" />
  </div>
</template>

<style scoped>
/* 案例轮播指示器：底部居中胶囊条，深色半透明底 + 浅色圆点，在浅色图片/奶油底上都清晰可见 */
.swipe-indicator {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(58, 44, 34, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}
.swipe-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  transition: width 0.2s ease, background 0.2s ease;
}
.swipe-dot--active {
  width: 18px;
  background: #f2e2d6;
}
</style>
