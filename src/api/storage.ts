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

/** 由存储路径解析为公开访问 URL。上传时已压缩，直接返回原图（不再做二次变换）。 */
export function getPublicUrl(path: string | null | undefined): string {
  if (!path) return ''
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * 缩略图 URL。
 * 注意：图片在上传时已完成压缩，这里直接返回原图公开 URL（保持签名兼容，width/quality 不再使用）。
 * 性能优化通过 van-image 的 lazy-load 实现，而非二次压缩。
 */
export function getThumbUrl(
  path: string | null | undefined,
  width = 400,
  quality = 70,
): string {
  return getPublicUrl(path)
}

/** 删除存储对象（传入存储路径）。 */
export async function deleteImage(path: string): Promise<void> {
  if (!path) return
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
