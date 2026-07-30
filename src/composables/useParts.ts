import { ref } from 'vue'
import {
  fetchParts,
  fetchPart,
  createPart,
  updatePart,
  deletePart,
} from '@/api/parts'
import type { Part, PartInput } from '@/types'

export function useParts(opts?: {
  categoryId?: number | null
  publishedOnly?: boolean
}) {
  const parts = ref<Part[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      parts.value = await fetchParts(opts)
    } catch (e) {
      console.error('[useParts] 加载零配件失败', e)
      parts.value = []
    } finally {
      loading.value = false
    }
  }

  async function get(id: number) {
    return fetchPart(id)
  }

  async function add(input: PartInput) {
    const created = await createPart(input)
    parts.value = [...parts.value, created]
    return created
  }

  async function update(id: number, input: PartInput) {
    const updated = await updatePart(id, input)
    const idx = parts.value.findIndex((p) => p.id === id)
    if (idx >= 0) parts.value[idx] = updated
    return updated
  }

  async function remove(id: number) {
    await deletePart(id)
    parts.value = parts.value.filter((p) => p.id !== id)
  }

  load()

  return { parts, loading, load, get, add, update, remove }
}
