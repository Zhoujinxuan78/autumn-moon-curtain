// 数据库表对应的 TypeScript 类型定义
// 与 supabase/migrations/0001_init.sql 保持一致

export type UserRole = 'super_admin' | 'admin' | 'user'

export interface Profile {
  id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  parent_id: number | null
  sort_order: number
  is_active: boolean
  created_at: string
  // 嵌入的类别档位
  category_tiers?: CategoryTier[]
}

export interface CategoryTier {
  id: number
  category_id: number
  code: string
  name: string
  sort_order: number
  is_visible: boolean
  created_at: string
}

export interface Part {
  id: number
  category_id: number | null
  name: string
  description: string | null
  image_url: string | null
  gallery: string[]
  specs: Record<string, string>
  price: number | null
  price_unit: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
  // 所属质量档位（类别档位）
  tier_id: number | null
  // 列表/详情查询时嵌入的档位定义
  tier?: CategoryTier | null
  // 列表/详情查询时嵌入的所属大类
  category?: Category | null
}

export interface CustomProduct {
  id: number
  title: string
  description: string | null
  cover_url: string | null
  image_urls: string[]
  is_published: boolean
  visible_date: string | null
  location: string | null
  customer_name: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ProductPartRelation {
  product_id: number
  part_id: number
  quantity: number
}

// 表单提交用的载荷类型（部分字段可选）
export type PartInput = Partial<
  Omit<Part, 'id' | 'created_at' | 'updated_at' | 'gallery' | 'specs'>
> & {
  gallery?: string[]
  specs?: Record<string, string>
}

export type CustomProductInput = Partial<
  Omit<CustomProduct, 'id' | 'created_at' | 'updated_at' | 'image_urls'>
> & {
  image_urls?: string[]
}

export type CategoryInput = Partial<Omit<Category, 'id' | 'created_at'>>
