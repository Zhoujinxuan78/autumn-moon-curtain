/**
 * 浏览器端图片压缩：将位图重编码为 WebP，上传前调用。
 * 用 Canvas 绘制后 toBlob('image/webp', quality)，无需任何第三方依赖。
 * 设计意图：管理员上传大图时自动压缩转 WebP，既省 Storage 空间又加快前台加载。
 */

export interface CompressOptions {
  /** 最长边像素上限，默认 2000（超出则等比缩小，保留细节） */
  maxSize?: number
  /** WebP 质量 0~1，默认 0.82（肉眼无损、体积骤降） */
  quality?: number
}

// 这些类型不适合位图重编码：SVG 保留矢量；GIF 保留动图，原样上传
const KEEP_AS_IS = ['image/svg+xml', 'image/gif']

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function canvasToWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/webp', quality)
  })
}

/**
 * 将图片文件压缩并转为 WebP。
 * - 非位图（SVG/GIF）或非图片类型：原样返回，不做处理。
 * - 失败兜底：返回原文件，保证上传不中断。
 */
export async function compressToWebp(
  file: File,
  opts: CompressOptions = {},
): Promise<File> {
  const maxSize = opts.maxSize ?? 2000
  const quality = opts.quality ?? 0.82

  if (!file.type.startsWith('image/') || KEEP_AS_IS.includes(file.type)) {
    return file
  }

  let bitmap: ImageBitmap | HTMLImageElement
  let revoke: (() => void) | null = null

  try {
    if (typeof createImageBitmap === 'function') {
      // imageOrientation: 'from-image' 尊重 EXIF 旋转，避免手机照片横倒
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    } else {
      const url = URL.createObjectURL(file)
      revoke = () => URL.revokeObjectURL(url)
      bitmap = await loadImage(url)
    }

    const w = bitmap.width
    const h = bitmap.height
    const scale = Math.min(1, maxSize / Math.max(w, h))
    const tw = Math.max(1, Math.round(w * scale))
    const th = Math.max(1, Math.round(h * scale))

    const canvas = document.createElement('canvas')
    canvas.width = tw
    canvas.height = th
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, tw, th)

    const blob = await canvasToWebp(canvas, quality)
    if (!blob) return file

    const base = (file.name || 'image').replace(/\.[^.]+$/, '')
    return new File([blob], `${base}.webp`, { type: 'image/webp' })
  } catch {
    // 任何异常都回退原文件，绝不让上传流程崩掉
    return file
  } finally {
    if (revoke) revoke()
  }
}
