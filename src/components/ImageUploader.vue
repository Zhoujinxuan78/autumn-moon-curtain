<script setup lang="ts">
import { ref, watch } from 'vue'
import { showToast } from 'vant'
import { uploadImage, getPublicUrl, deleteImage } from '@/api/storage'

interface UploadItem {
  url?: string
  file?: File
  status?: 'uploading' | 'done' | 'failed'
  message?: string
  path?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    folder?: string
    max?: number
  }>(),
  { folder: 'misc', max: 9 },
)
const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const list = ref<UploadItem[]>([])

watch(
  () => props.modelValue,
  (v) => {
    const paths = list.value.map((i) => i.path).filter(Boolean) as string[]
    if (JSON.stringify(paths) === JSON.stringify(v || [])) return
    list.value = (v || []).map((p) => ({ url: getPublicUrl(p), path: p }))
  },
  { immediate: true, deep: true },
)

function emitPaths() {
  emit(
    'update:modelValue',
    list.value.map((i) => i.path).filter(Boolean) as string[],
  )
}

async function afterRead(item: UploadItem) {
  item.status = 'uploading'
  item.message = '上传中'
  try {
    const path = await uploadImage(item.file as File, props.folder)
    item.path = path
    item.url = getPublicUrl(path)
    item.status = 'done'
    emitPaths()
  } catch (e: unknown) {
    item.status = 'failed'
    item.message = '失败'
    showToast('图片上传失败')
  }
}

async function onDelete(item: UploadItem) {
  if (item.path) {
    try {
      await deleteImage(item.path)
    } catch {
      /* 忽略删除失败 */
    }
  }
  emitPaths()
}
</script>

<template>
  <van-uploader
    v-model="list"
    :max-count="max"
    :after-read="afterRead"
    @delete="onDelete"
    preview-full-image
  />
</template>
