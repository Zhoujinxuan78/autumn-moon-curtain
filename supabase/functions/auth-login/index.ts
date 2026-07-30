// ============================================================
// Edge Function: auth-login
// 职责：校验管理员账号密码（PBKDF2），签发标准 Supabase JWT。
// 安全：service_role / JWT 密钥仅存在于服务端（本函数运行时），前端不持有。
// 部署：Dashboard → Edge Functions → New Function（名称 auth-login，粘贴本文件）→ Deploy
//       或 CLI: supabase functions deploy auth-login
// 依赖：运行环境自动注入 SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_JWT_SECRET
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const encoder = new TextEncoder()

// ---------- base64url ----------
function b64urlFromBytes(bytes: Uint8Array): string {
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function b64urlFromString(s: string): string {
  return b64urlFromBytes(encoder.encode(s))
}
function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad)
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

// ---------- HMAC-SHA256（手动签名 JWT，免去外部依赖） ----------
async function hmacSha256(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return new Uint8Array(sig)
}

async function signJwt(secret: string, payload: Record<string, unknown>): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const headerB64 = b64urlFromString(JSON.stringify(header))
  const payloadB64 = b64urlFromString(JSON.stringify(payload))
  const signingInput = `${headerB64}.${payloadB64}`
  const sig = await hmacSha256(secret, signingInput)
  return `${signingInput}.${b64urlFromBytes(sig)}`
}

// ---------- 密码校验（与 scripts/set-admin-password.mjs 保持一致） ----------
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false
  const iterations = parseInt(parts[1], 10)
  if (!Number.isFinite(iterations) || iterations <= 0) return false
  const salt = b64urlToBytes(parts[2])
  const expected = b64urlToBytes(parts[3])
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    256,
  )
  const got = new Uint8Array(bits)
  if (got.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < got.length; i++) diff |= got[i] ^ expected[i]
  return diff === 0
}

// ---------- 响应 ----------
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ---------- 主逻辑 ----------
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body: { email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: '请求格式错误' }, 400)
  }

  const email = String(body?.email ?? '').trim().toLowerCase()
  const password = String(body?.password ?? '')
  if (!email || !password) return json({ error: '缺少邮箱或密码' }, 400)

  const url = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET')
  if (!url || !serviceKey || !jwtSecret) {
    return json({ error: '服务器配置缺失' }, 500)
  }

  // 服务端用 service_role 查 profiles（绕过 RLS）
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { data, error } = await admin
    .from('profiles')
    .select('id, email, role, password_hash')
    .eq('email', email)
    .maybeSingle()

  // 统一返回「邮箱或密码错误」，避免泄露账号是否存在
  if (error || !data || !data.password_hash) {
    return json({ error: '邮箱或密码错误' }, 401)
  }
  const ok = await verifyPassword(password, data.password_hash)
  if (!ok) return json({ error: '邮箱或密码错误' }, 401)

  const projectRef = url.replace('https://', '').split('.')[0]
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    aud: 'authenticated',
    role: 'authenticated',
    sub: data.id,
    email: data.email,
    user_role: data.role,
    iss: 'supabase',
    ref: projectRef,
    iat: now,
    exp: now + 60 * 60 * 24 * 7, // 7 天
  }
  const token = await signJwt(jwtSecret, payload)

  return json({
    access_token: token,
    token_type: 'bearer',
    expires_in: 60 * 60 * 24 * 7,
    user: { id: data.id, email: data.email, role: data.role },
  })
})
