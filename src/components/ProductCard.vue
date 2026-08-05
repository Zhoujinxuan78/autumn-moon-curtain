<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { CustomProduct } from '@/types'
import { formatDateTime } from '@/utils/format'
import { getThumbUrl } from '@/api/storage'

const props = defineProps<{ product: CustomProduct }>()
const router = useRouter()
const cover = computed(() => {
  const p = props.product.cover_url || props.product.image_urls?.[0]
  return getThumbUrl(p)
})
</script>

<template>
  <div
    class="card case-card cursor-pointer"
    @click="router.push(`/custom/${product.id}`)"
  >
    <div class="case-cover">
      <van-image :src="cover" fit="cover" width="100%" height="158" />
      <div class="case-grad" />
      <span v-if="product.customer_name" class="case-badge">
        {{ product.customer_name }}
      </span>
    </div>
    <div class="case-body">
      <div class="case-title">{{ product.title }}</div>
      <div class="case-meta">
        <span class="case-loc">
          <van-icon name="location-o" />
          {{ product.location || '未标注地点' }}
        </span>
        <span class="case-date">
          <van-icon name="clock-o" />
          {{ formatDateTime(product.created_at).slice(0, 10) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.case-card {
  padding: 0;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.25s ease;
}
.case-card:active {
  transform: translateY(-3px) scale(0.99);
}
.case-cover {
  position: relative;
}
/* 底部渐变遮罩，提升徽标/文字可读性 */
.case-grad {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 56px;
  background: linear-gradient(180deg, transparent, rgba(58, 44, 34, 0.42));
  pointer-events: none;
}
.case-badge {
  position: absolute;
  left: 8px;
  bottom: 8px;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  color: #fff;
  background: rgba(181, 104, 63, 0.92);
  padding: 3px 9px;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(58, 44, 34, 0.3);
}
.case-body {
  padding: 10px 12px 12px;
}
.case-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--curtain-ink);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.case-meta {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 11px;
  color: var(--curtain-ink-soft);
}
.case-loc,
.case-date {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
