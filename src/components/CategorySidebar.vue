<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@/types'

const props = defineProps<{
  categories: Category[]
  modelValue: number | 'all'
}>()
const emit = defineEmits<{ 'update:modelValue': [number | 'all'] }>()

const activeIndex = computed(() => {
  if (props.modelValue === 'all') return 0
  const idx = props.categories.findIndex((c) => c.id === props.modelValue)
  return idx < 0 ? 0 : idx + 1
})

function onChange(index: number) {
  if (index === 0) emit('update:modelValue', 'all')
  else emit('update:modelValue', props.categories[index - 1].id)
}
</script>

<template>
  <van-sidebar :model-value="activeIndex" @change="onChange">
    <van-sidebar-item title="全部" />
    <van-sidebar-item
      v-for="c in categories"
      :key="c.id"
      :title="c.name"
    />
  </van-sidebar>
</template>
