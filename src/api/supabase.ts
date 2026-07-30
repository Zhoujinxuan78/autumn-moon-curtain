import { createClient } from '@supabase/supabase-js'

// 未配置时使用占位地址，避免 createClient 直接抛错导致 dev server 崩溃。
// 真实部署前请在 .env 中填入 Supabase 项目的 URL 与 anon key（参考 .env.example）。
const ENV_URL = import.meta.env.VITE_SUPABASE_URL
const ENV_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const url = ENV_URL || 'https://placeholder.supabase.co'
const anonKey = ENV_KEY || 'public-anon-key-placeholder'

if (!ENV_URL || !ENV_KEY) {
  console.warn(
    '[supabase] 缺少环境变量 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY，' +
      '当前使用占位地址，数据请求会失败。请在 .env 中配置后重启 dev server。',
  )
}

export const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'curtain-assets'

// 浏览器端客户端：仅使用 anon key，行级安全(RLS)在服务端强制执行。
// 注意：本项目使用自定义 JWT（supabase/functions/auth-login 签发），不依赖 Supabase Auth 刷新机制，
// 因此关闭 autoRefreshToken，避免对非刷新型 token 发起刷新请求导致登出。
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
