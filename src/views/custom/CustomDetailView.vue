<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProduct, fetchProductParts, type ProductPartRow } from '@/api/customProducts'
import type { CustomProduct, Category } from '@/types'
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

const current = ref(0)

function onChange(index: number) {
  current.value = index
}

function previewProduct(index: number) {
  if (!images.value.length) return
  showImagePreview({ images: images.value, startPosition: index })
}

function openPart(id?: number) {
  if (id) router.push(`/parts/${id}`)
}

// 所用配件按大类（category）分组陈列，用于详情页分组展示
const relatedGroups = computed(() => {
  const visible = relatedParts.value.filter(
    (rp) => !(rp.part?.category && rp.part.category.is_active === false),
  )
  const map = new Map<
    string,
    { key: string; label: string; category: Category | null; rows: ProductPartRow[] }
  >()
  for (const rp of visible) {
    const c = rp.part?.category ?? null
    const key = c ? `cat-${c.id}` : 'uncat'
    if (!map.has(key)) map.set(key, { key, label: c ? c.name : '其他配件', category: c, rows: [] })
    map.get(key)!.rows.push(rp)
  }
  const arr = Array.from(map.values())
  arr.sort((a, b) => {
    if (a.category && b.category)
      return (a.category.sort_order ?? 0) - (b.category.sort_order ?? 0) || a.label.localeCompare(b.label)
    return a.category ? -1 : 1
  })
  return arr
})

const totalParts = computed(() =>
  relatedGroups.value.reduce((s, g) => s + g.rows.length, 0),
)

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
      <!-- 轮播：完整展示不裁切 -->
      <div v-if="images.length" class="swipe-wrap">
        <van-swipe :autoplay="0" @change="onChange">
          <van-swipe-item v-for="(img, i) in images" :key="i">
            <van-image
              :src="img"
              fit="contain"
              width="100%"
              height="300"
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
        <span class="swipe-count">{{ current + 1 }} / {{ images.length }}</span>
      </div>

      <div class="page-pad">
        <h2 class="display-serif case-title">{{ product.title }}</h2>

        <div class="meta-row">
          <span v-if="product.location" class="meta-pill">
            <van-icon name="location-o" />{{ product.location }}
          </span>
          <span v-if="product.customer_name" class="meta-pill meta-pill--accent">
            <van-icon name="user-o" />{{ product.customer_name }}
          </span>
          <span class="meta-pill">
            <van-icon name="calendar-o" />{{ formatDateTime(product.created_at).slice(0, 10) }}
          </span>
          <span v-if="product.visible_date" class="meta-pill meta-pill--soft">
            定时 {{ formatDateTime(product.visible_date).slice(0, 10) }}
          </span>
        </div>

        <div v-if="product.description" class="desc-card">
          <p class="desc-text">{{ product.description }}</p>
        </div>

        <div v-if="relatedGroups.length" class="parts">
          <div class="section-head">
            <span class="section-title">所用配件</span>
            <span class="section-count">{{ totalParts }}</span>
          </div>

          <template v-for="g in relatedGroups" :key="g.key">
            <div class="group-head">
              <span class="group-bar" />
              <span class="group-name">{{ g.label }}</span>
              <span class="group-count">{{ g.rows.length }}</span>
            </div>
            <div
              v-for="rp in g.rows"
              :key="rp.part?.id"
              class="part-row card"
              @click="openPart(rp.part?.id)"
            >
              <van-image
                :src="getThumbUrl(rp.part?.image_url, 120, 70)"
                width="52"
                height="52"
                radius="10"
                fit="contain"
                style="background: var(--curtain-bg)"
              />
              <div class="part-info">
                <div class="part-name">{{ rp.part?.name || '已删除配件' }}</div>
                <div class="part-sub">
                  <span>数量 ×{{ rp.quantity }}</span>
                </div>
              </div>
              <van-icon name="arrow" class="part-arrow" />
            </div>
          </template>
        </div>
      </div>
    </template>

    <EmptyState v-else text="未找到该案例" />
  </div>
</template>

<style scoped>
/* 轮播容器：圆角 + 暖描边 */
.swipe-wrap {
  position: relative;
  margin: 12px;
  border-radius: 18px;
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

/* 案例轮播指示器：底部居中胶囊条 */
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

/* 标题 */
.case-title {
  font-size: 23px;
  line-height: 1.35;
  color: var(--curtain-ink);
  margin: 4px 0 0;
}

/* 元信息胶囊 */
.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--curtain-ink-soft);
  background: var(--curtain-bg-soft);
  border: 1px solid var(--curtain-line);
  padding: 5px 10px;
  border-radius: 999px;
}
.meta-pill--accent {
  color: #fff;
  background: var(--curtain-primary);
  border-color: var(--curtain-primary);
}
.meta-pill--soft {
  color: var(--curtain-ink-soft);
  background: transparent;
  border-style: dashed;
}
.meta-pill :deep(.van-icon) {
  font-size: 13px;
}

/* 描述卡 */
.desc-card {
  margin-top: 16px;
  background: var(--curtain-surface);
  border: 1px solid var(--curtain-line);
  border-radius: 16px;
  padding: 14px 16px;
}
.desc-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: var(--curtain-ink-soft);
  white-space: pre-line;
}

/* 所用配件 */
.parts {
  margin-top: 22px;
}
.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.section-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--curtain-ink);
  font-family: var(--curtain-font-serif);
}
.section-count {
  font-size: 12px;
  color: #fff;
  background: var(--curtain-primary);
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.part-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.part-row:active {
  transform: scale(0.99);
}
.part-info {
  flex: 1;
  min-width: 0;
}
.part-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--curtain-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.part-sub {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--curtain-ink-soft);
}
/* 分组标题（按档位） */
.group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 18px 0 10px;
}
.group-head:first-of-type {
  margin-top: 2px;
}
.group-bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--curtain-primary);
}
.group-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--curtain-ink);
}
.group-count {
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--curtain-primary-soft);
  color: var(--curtain-primary-dark);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.part-arrow {
  color: #cbb89c;
  flex-shrink: 0;
}
</style>
