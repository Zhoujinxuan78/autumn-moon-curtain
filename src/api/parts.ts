import { supabase } from './supabase'
import type { Part, PartInput } from '@/types'

/** 获取零配件列表。非管理员仅能看到 is_published 的配件。嵌入所属档位 tier。 */
export async function fetchParts(opts?: {
  categoryId?: number | null
  publishedOnly?: boolean
}): Promise<Part[]> {
  let query = supabase.from('parts').select('*, tier:category_tiers(*), category:categories(*)')
  if (opts?.categoryId != null) query = query.eq('category_id', opts.categoryId)
  if (opts?.publishedOnly) query = query.eq('is_published', true)
  const { data, error } = await query
  if (error) throw error
  const list = (data ?? []) as Part[]
  // 服务端排序依赖 sort_order 列；兼容线上表可能缺失该列，改为前端排序兜底
  return list.sort(
    (a, b) =>
      ((a.sort_order as number | undefined) ?? a.id) -
      ((b.sort_order as number | undefined) ?? b.id),
  )
}

export async function fetchPart(id: number): Promise<Part | null> {
  const { data, error } = await supabase
    .from('parts')
    .select('*, tier:category_tiers(*), category:categories(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return (data as Part) ?? null
}

export async function createPart(input: PartInput): Promise<Part> {
  const { data, error } = await supabase
    .from('parts')
    .insert({
      gallery: [],
      specs: {},
      ...input,
    })
    .select()
    .single()
  if (error) throw error
  return data as Part
}

export async function updatePart(id: number, input: PartInput): Promise<Part> {
  const { data, error } = await supabase
    .from('parts')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Part
}

export async function deletePart(id: number): Promise<void> {
  const { error } = await supabase.from('parts').delete().eq('id', id)
  if (error) throw error
}
