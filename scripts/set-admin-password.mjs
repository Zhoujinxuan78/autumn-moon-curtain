// ============================================================
// 生成管理员密码哈希，并输出可直接在 Supabase SQL Editor 执行的 UPDATE 语句。
// 用法：
//   node scripts/set-admin-password.mjs <邮箱> <密码>
// 例：
//   node scripts/set-admin-password.mjs super@test.com '363935xhb'
// 然后复制输出的 SQL 到 Supabase SQL Editor 执行即可。
// 注意：密码不会写入任何文件，只在终端传入，生成的只是不可逆的 PBKDF2 哈希。
// 与 supabase/functions/auth-login/index.ts 的 verifyPassword 算法保持一致。
// ============================================================

import { webcrypto } from 'node:crypto'

const crypto = webcrypto
const encoder = new TextEncoder()

function b64url(bytes) {
  return Buffer.from(bytes).toString('base64url')
}

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]
  if (!email || !password) {
    console.error('用法: node scripts/set-admin-password.mjs <邮箱> <密码>')
    process.exit(1)
  }

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iterations = 100000
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
  const hash = new Uint8Array(bits)
  const stored = `pbkdf2$${iterations}$${b64url(salt)}$${b64url(hash)}`

  console.log(`-- 在 Supabase SQL Editor 执行以下语句，为 ${email} 设置密码哈希:`)
  console.log(
    `update public.profiles set password_hash = '${stored}' where lower(email) = '${email.toLowerCase()}';`,
  )
}

main().catch((err) => {
  console.error('生成失败:', err)
  process.exit(1)
})
