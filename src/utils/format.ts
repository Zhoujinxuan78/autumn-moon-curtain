import type { Part } from '@/types'

/** 价格格式化：1234.5 + '米' => '¥1,234.50 / 米' */
export function formatPrice(price: number | null, unit?: string | null): string {
  if (price == null) return '面议'
  const fixed = Number(price).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return unit ? `¥${fixed} / ${unit}` : `¥${fixed}`
}

/** 日期格式化：2026-07-29 12:00 */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

/** 将规格对象转成可展示的键值对数组。 */
export function specsToList(
  specs: Record<string, string> | null | undefined,
): Array<{ key: string; value: string }> {
  if (!specs) return []
  return Object.entries(specs).map(([key, value]) => ({ key, value }))
}

/**
 * 由配件对象返回展示用价格：档位模型下零件自身保留单价，直接返回即可。
 * 保留第二个参数仅为兼容旧调用点（已忽略）。
 */
export function partStartPrice(
  part: Part,
  _opts?: { includeHiddenTiers?: boolean },
): { price: number | null; price_unit: string | null } {
  return { price: part.price ?? null, price_unit: part.price_unit ?? null }
}

/** 由配件对象拿到封面图 URL（优先 image_url，其次 gallery 首张）。 */
export function partCoverUrl(part: Part): string {
  if (part.image_url) return part.image_url
  if (Array.isArray(part.gallery) && part.gallery.length) return part.gallery[0]
  return ''
}
