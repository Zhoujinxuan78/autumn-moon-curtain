import { supabase, BUCKET } from './supabase'

/**
 * 上传图片到 curtain-assets 桶，返回存储对象路径（如 "parts/1699.png"）。
 * 注意：数据库字段存的是「存储路径」，展示时用 getPublicUrl 解析为可访问 URL。
 */
export async function uploadImage(
  file: File,
  folder = 'misc',
): Promise<string> {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase()
  const safeExt = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)
    ? ext
    : 'png'
  const path = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${safeExt}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '31536000' })
  if (error) throw error
  return path
}

/** 批量上传，返回路径数组。 */
export async function uploadImages(
  files: File[],
  folder = 'misc',
): Promise<string[]> {
  const paths = await Promise.all(files.map((f) => uploadImage(f, folder)))
  return paths
}

/** 图片变换参数（Supabase Storage 图片变换）。 */
export type ImgTransform = {
  width?: number
  height?: number
  quality?: number
  resize?: 'cover' | 'contain' | 'fill'
  format?: 'webp' | 'jpg' | 'png' | 'avif'
}

// 是否启用 Supabase 图片变换：按显示尺寸下发缩略图，显著降低传输体积。
// 若你的 Supabase 桶未开启「Image Transformation」导致图片 400，
// 在项目根目录 .env 设置 VITE_IMG_TRANSFORM=false 即可回退为原图。
const IMG_TRANSFORM_ENABLED = import.meta.env.VITE_IMG_TRANSFORM !== 'false'

/** 由存储路径解析为公开访问 URL，可附图片变换参数（仅当开启时生效）。 */
export function getPublicUrl(
  path: string | null | undefined,
  transform?: ImgTransform,
): string {
  if (!path) return ''
  const opts = IMG_TRANSFORM_ENABLED && transform ? { transform } : undefined
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path, opts)
  return data.publicUrl
}

/** 缩略图 URL：按宽度等比裁剪为 webp（默认 400px / 质量 70），体积大幅减小。 */
export function getThumbUrl(
  path: string | null | undefined,
  width = 400,
  quality = 70,
): string {
  return getPublicUrl(path, { width, quality, resize: 'cover', format: 'webp' })
}

/** 删除存储对象（传入存储路径）。 */
export async function deleteImage(path: string): Promise<void> {
  if (!path) return
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
