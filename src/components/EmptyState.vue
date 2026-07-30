<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-gray-400">
    <van-icon name="description" size="40" />
    <p class="mt-2 text-sm">{{ text || '暂无数据' }}</p>
  </div>
</template>
