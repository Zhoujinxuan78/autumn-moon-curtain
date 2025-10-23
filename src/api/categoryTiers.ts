import { supabase } from './supabase'
import type { CategoryTier } from '@/types'

/** 获取某类别的质量档位（默认仅前台可见的）。 */
export async function fetchCategoryTiers(
  categoryId: number,
  opts?: { includeHidden?: boolean },
): Promise<CategoryTier[]> {
  let query = supabase
    .from('category_tiers')
    .select('*')
    .eq('category_id', categoryId)
  if (!opts?.includeHidden) query = query.eq('is_visible', true)
  const { data, error } = await query.order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as CategoryTier[]
}

/** 获取所有类别的档位（后台用），可选含隐藏档位。 */
export async function fetchAllCategoryTiers(opts?: {
  includeHidden?: boolean
}): Promise<CategoryTier[]> {
  let query = supabase.from('category_tiers').select('*')
  if (!opts?.includeHidden) query = query.eq('is_visible', true)
  const { data, error } = await query.order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as CategoryTier[]
}

export async function createCategoryTier(
  input: Partial<CategoryTier> & { category_id: number },
): Promise<CategoryTier> {
  const { data, error } = await supabase
    .from('category_tiers')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data as CategoryTier
}

export async function updateCategoryTier(
  id: number,
  input: Partial<CategoryTier>,
): Promise<CategoryTier> {
  const { data, error } = await supabase
    .from('category_tiers')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as CategoryTier
}

export async function deleteCategoryTier(id: number): Promise<void> {
  const { error } = await supabase.from('category_tiers').delete().eq('id', id)
  if (error) throw error
}

/** 为某类别一键播种默认三档（经济 / 标准 / 豪华）。 */
export async function seedDefaultCategoryTiers(
  categoryId: number,
): Promise<void> {
  const defaults = [
    { code: 'economy', name: '经济款', sort_order: 1 },
    { code: 'standard', name: '标准款', sort_order: 2 },
    { code: 'luxury', name: '豪华款', sort_order: 3 },
  ]
  for (const d of defaults) {
    const { error } = await supabase
      .from('category_tiers')
      .upsert(
        { category_id: categoryId, ...d, is_visible: true },
        { onConflict: 'category_id,code' },
      )
    if (error) throw error
  }
}
