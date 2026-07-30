import { supabase } from './supabase'
import type { CustomProduct, CustomProductInput, Part } from '@/types'

export interface ProductPartRow {
  quantity: number
  part: Part | null
}

/**
 * 获取客户定制成品列表。
 * 非管理员仅能看到 is_published 且已过 visible_date 的成品（由 RLS 保证）。
 */
export async function fetchProducts(opts?: {
  publishedOnly?: boolean
}): Promise<CustomProduct[]> {
  let query = supabase
    .from('custom_products')
    .select('*')
    .order('created_at', { ascending: false })
  if (opts?.publishedOnly) query = query.eq('is_published', true)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as CustomProduct[]
}

export async function fetchProduct(id: number): Promise<CustomProduct | null> {
  const { data, error } = await supabase
    .from('custom_products')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return (data as CustomProduct) ?? null
}

/** 获取某成品关联的零件清单（含数量）。 */
export async function fetchProductParts(
  productId: number,
): Promise<ProductPartRow[]> {
  const { data, error } = await supabase
    .from('product_parts_relation')
    .select('quantity, part:parts(*)')
    .eq('product_id', productId)
  if (error) throw error
  return (data ?? []) as ProductPartRow[]
}

export async function createProduct(
  input: CustomProductInput,
): Promise<CustomProduct> {
  const { data, error } = await supabase
    .from('custom_products')
    .insert({ image_urls: [], ...input })
    .select()
    .single()
  if (error) throw error
  return data as CustomProduct
}

export async function updateProduct(
  id: number,
  input: CustomProductInput,
): Promise<CustomProduct> {
  const { data, error } = await supabase
    .from('custom_products')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as CustomProduct
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase.from('custom_products').delete().eq('id', id)
  if (error) throw error
}

/** 批量设置某成品关联的零件（先删后插）。 */
export async function setProductParts(
  productId: number,
  items: Array<{ part_id: number; quantity: number }>,
): Promise<void> {
  const { error: delErr } = await supabase
    .from('product_parts_relation')
    .delete()
    .eq('product_id', productId)
  if (delErr) throw delErr
  if (items.length === 0) return
  const { error } = await supabase
    .from('product_parts_relation')
    .insert(items.map((i) => ({ product_id: productId, ...i })))
  if (error) throw error
}
