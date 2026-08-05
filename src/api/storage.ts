import { supabase, BUCKET } from './supabase'
import { compressToWebp } from '@/utils/imageCompress'

/** 空图片占位：暖色窗帘图标 + "暂无图片"，避免无图时显示空白。 */
export const IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f2e2d6'/%3E%3Cpath d='M50 40 L50 110 M150 40 L150 110 M50 40 Q100 120 150 40' stroke='%23d4a88c' stroke-width='3' fill='none'/%3E%3Ccircle cx='100' cy='32' r='5' fill='%23b5683f'/%3E%3Ctext x='100' y='130' text-anchor='middle' font-size='12' fill='%23b5683f'%3E暂无图片%3C/text%3E%3C/svg%3E"

/**
 * 上传图片到 curtain-assets 桶，返回存储对象路径（如 "parts/1699.webp"）。
 * 注意：数据库字段存的是「存储路径」，展示时用 getPublicUrl 解析为可访问 URL。
 * 上传前会自动压缩并转 WebP（compressToWebp），省空间、加快前台加载；
 * 非位图（SVG/GIF）与压缩失败会回退原文件。
 */
export async function uploadImage(
  file: File,
  folder = 'misc',
): Promise<string> {
  const compressed = await compressToWebp(file)
  const ext = (compressed.name.split('.').pop() || 'webp').toLowerCase()
  const safeExt = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)
    ? ext
    : 'webp'
  const path = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${safeExt}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed, { upsert: true, cacheControl: '31536000' })
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

/** 由存储路径解析为公开访问 URL。上传时已压缩，直接返回原图（不再做二次变换）。空路径返回占位图。 */
export function getPublicUrl(path: string | null | undefined): string {
  if (!path) return IMAGE_PLACEHOLDER
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * 缩略图 URL（兼容旧调用签名，保留 width/quality 形参但不再使用）。
 * 图片在上传时已完成压缩，这里直接返回原图公开 URL，前端不再做二次压缩/变换。
 * 注意：曾用 van-image 的 lazy-load 做懒加载，但部署环境下 IntersectionObserver 不触发导致图片空白，已移除。
 * 空路径会返回 IMAGE_PLACEHOLDER 占位图。
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
