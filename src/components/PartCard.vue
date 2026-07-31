<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Part } from '@/types'
import { partCoverUrl, formatPrice, partStartPrice } from '@/utils/format'
import { getThumbUrl } from '@/api/storage'

const props = defineProps<{ part: Part }>()
const router = useRouter()
const cover = computed(() => getThumbUrl(partCoverUrl(props.part)))

const start = computed(() => partStartPrice(props.part))
// 仅展示前台可见的档位标签
const tier = computed(() =>
  props.part.tier && props.part.tier.is_visible !== false
    ? props.part.tier
    : null,
)
</script>

<template>
  <div
    class="card overflow-hidden cursor-pointer"
    @click="router.push(`/parts/${part.id}`)"
  >
    <van-image :src="cover" fit="cover" width="100%" height="110" lazy-load />
    <div class="px-2 py-2">
      <div class="text-sm font-medium truncate">{{ part.name }}</div>
      <div class="mt-1 text-sm font-semibold" style="color: var(--curtain-primary)">
        {{ formatPrice(start.price, start.price_unit) }}
      </div>
      <div v-if="tier" class="mt-1.5 flex flex-wrap gap-1">
        <span
          class="text-[10px] px-1.5 py-0.5 rounded-full"
          style="background: var(--curtain-primary-soft); color: var(--curtain-primary-dark)"
        >
          {{ tier.name }}
        </span>
      </div>
    </div>
  </div>
</template>
