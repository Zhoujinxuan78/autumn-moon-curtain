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
    class="card overflow-hidden cursor-pointer"
    @click="router.push(`/custom/${product.id}`)"
  >
    <van-image :src="cover" fit="cover" width="100%" height="130" lazy-load />
    <div class="px-2 py-2">
      <div class="text-sm font-medium truncate">{{ product.title }}</div>
      <div class="mt-1 flex items-center justify-between text-xs text-gray-400">
        <span v-if="product.location">{{ product.location }}</span>
        <span v-else>·</span>
        <span>{{ formatDateTime(product.created_at).slice(0, 10) }}</span>
      </div>
    </div>
  </div>
</template>
