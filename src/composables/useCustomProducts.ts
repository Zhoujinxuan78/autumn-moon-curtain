import { ref } from 'vue'
import {
  fetchProducts,
  fetchProduct,
  fetchProductParts,
  createProduct,
  updateProduct,
  deleteProduct,
  setProductParts,
  type FetchProductsOpts,
} from '@/api/customProducts'
import type { CustomProduct, CustomProductInput } from '@/types'

export function useCustomProducts(opts?: FetchProductsOpts) {
  const products = ref<CustomProduct[]>([])
  const loading = ref(false)

  async function load(filters?: FetchProductsOpts) {
    loading.value = true
    try {
      products.value = await fetchProducts({ ...opts, ...filters })
    } finally {
      loading.value = false
    }
  }

  async function get(id: number) {
    return fetchProduct(id)
  }

  async function getParts(productId: number) {
    return fetchProductParts(productId)
  }

  async function add(input: CustomProductInput) {
    const created = await createProduct(input)
    products.value = [created, ...products.value]
    return created
  }

  async function update(id: number, input: CustomProductInput) {
    const updated = await updateProduct(id, input)
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx >= 0) products.value[idx] = updated
    return updated
  }

  async function remove(id: number) {
    await deleteProduct(id)
    products.value = products.value.filter((p) => p.id !== id)
  }

  async function setParts(
    productId: number,
    items: Array<{ part_id: number; quantity: number }>,
  ) {
    return setProductParts(productId, items)
  }

  load()

  return { products, loading, load, get, getParts, add, update, remove, setParts }
}
