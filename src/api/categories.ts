import { supabase } from './supabase'
import type { Category, CategoryInput } from '@/types'

/** 获取分类列表。非管理员受 RLS 限制只能看到 is_active 的分类。 */
export async function fetchCategories(opts?: {
  activeOnly?: boolean
}): Promise<Category[]> {
  let query = supabase.from('categories').select('*')
  if (opts?.activeOnly) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  const list = (data ?? []) as Category[]
  // 兼容线上表可能缺失 sort_order 列，改为前端排序兜底
  return list.sort(
    (a, b) =>
      ((a.sort_order as number | undefined) ?? a.id) -
      ((b.sort_order as number | undefined) ?? b.id),
  )
}

export async function fetchCategory(id: number): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return (data as Category) ?? null
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data as Category
}

export async function updateCategory(
  id: number,
  input: CategoryInput,
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Category
}

export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
