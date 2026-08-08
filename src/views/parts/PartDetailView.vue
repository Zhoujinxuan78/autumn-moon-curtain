<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPart } from '@/api/parts'
import { fetchCategories } from '@/api/categories'
import type { Part, Category } from '@/types'
import { formatPrice, specsToList } from '@/utils/format'
import { getPublicUrl, getThumbUrl } from '@/api/storage'
import { showImagePreview, type SwipeInstance } from 'vant'

const route = useRoute()
const router = useRouter()
const part = ref<Part | null>(null)
const categories = ref<Category[]>([])
const loading = ref(true)
const current = ref(0)
const swipeRef = ref<SwipeInstance>()

function onChange(index: number) {
  current.value = index
}

// 点击底部缩略图：同步 swiper 跳到对应图
function selectThumb(i: number) {
  current.value = i
  swipeRef.value?.swipeTo(i)
}

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
    current.value = 0
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="pb-20">
    <van-nav-bar
      title="配件详情"
      left-text="返回"
      left-arrow
      @click-left="router.back()"
    />

    <van-loading v-if="loading" class="block mx-auto mt-10" />

    <template v-else-if="part">
      <div class="page-pad">
        <!-- 轮播：完整展示不裁切，可滑动，与案例详情一致 -->
        <div v-if="images.length" class="swipe-wrap">
          <van-swipe ref="swipeRef" :autoplay="0" @change="onChange">
            <van-swipe-item v-for="(img, i) in images" :key="i">
              <van-image
                :src="img"
                fit="contain"
                width="100%"
                height="280"
                style="background: var(--curtain-bg)"
                class="cursor-pointer"
                @click="previewImage(i)"
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
          <span class="swipe-count">{{ current + 1 }} / {{ images.length }}</span>
        </div>

        <!-- 底部缩略图列表：可点击，同步 swiper -->
        <div v-if="images.length > 1" class="flex gap-2 mt-2 overflow-x-auto thumb-strip">
          <img
            v-for="(img, i) in images"
            :key="i"
            :src="img"
            loading="lazy"
            class="thumb"
            :class="i === current ? 'thumb--active' : ''"
            style="background: var(--curtain-bg)"
            @click="selectThumb(i)"
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
      </div>
    </template>

    <EmptyState v-else text="未找到该配件" />
  </div>
</template>

<style scoped>
/* 轮播容器：圆角 + 暖描边，与案例详情一致 */
.swipe-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--curtain-line);
  box-shadow: 0 12px 30px -20px rgba(58, 44, 34, 0.4);
}
.swipe-count {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  font-size: 11px;
  color: #fff;
  background: rgba(58, 44, 34, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 3px 9px;
  border-radius: 999px;
}
/* 轮播指示器：底部居中胶囊条 */
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

/* 底部缩略图列表 */
.thumb-strip {
  padding-bottom: 2px;
}
.thumb {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: contain;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.thumb--active {
  border-color: var(--curtain-primary);
  transform: translateY(-1px);
}
</style>
