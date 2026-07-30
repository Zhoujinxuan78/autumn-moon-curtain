import { ref } from 'vue'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/api/categories'
import type { Category, CategoryInput } from '@/types'

export function useCategories(opts?: { activeOnly?: boolean }) {
  const categories = ref<Category[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      categories.value = await fetchCategories(opts)
    } catch (e) {
      console.error('[useCategories] 加载分类失败', e)
      categories.value = []
    } finally {
      loading.value = false
    }
  }

  async function add(input: CategoryInput) {
    const created = await createCategory(input)
    categories.value = [...categories.value, created]
    return created
  }

  async function update(id: number, input: CategoryInput) {
    const updated = await updateCategory(id, input)
    const idx = categories.value.findIndex((c) => c.id === id)
    if (idx >= 0) categories.value[idx] = updated
    return updated
  }

  async function remove(id: number) {
    await deleteCategory(id)
    categories.value = categories.value.filter((c) => c.id !== id)
  }

  load()

  return { categories, loading, load, add, update, remove }
}
