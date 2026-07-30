<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Part } from '@/types'
import { partCoverUrl, formatPrice } from '@/utils/format'
import { getPublicUrl } from '@/api/storage'

const props = defineProps<{ part: Part }>()
const router = useRouter()
const cover = computed(() => getPublicUrl(partCoverUrl(props.part)))
</script>

<template>
  <div
    class="card overflow-hidden cursor-pointer"
    @click="router.push(`/parts/${part.id}`)"
  >
    <van-image :src="cover" fit="cover" width="100%" height="110" />
    <div class="px-2 py-2">
      <div class="text-sm font-medium truncate">{{ part.name }}</div>
      <div class="mt-1 text-sm font-semibold" style="color: #157a6e">
        {{ formatPrice(part.price, part.price_unit) }}
      </div>
    </div>
  </div>
</template>
