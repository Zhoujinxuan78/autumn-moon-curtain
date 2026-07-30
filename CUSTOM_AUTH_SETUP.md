# 前端直连登录（私人项目 · 最简方案）

> 方案：登录只在前端校验一个密码；数据库用 **anon key + 关闭 RLS** 直接增删改查。
> 无 Supabase Auth、无 Edge Function、无 JWT。改起来最少、跑起来最省事。
> ⚠️ 安全提示：anon key 是公开密钥，关闭 RLS 后任何人拿到它都能操作全库 —— 仅适合私人/内网项目。

## 改动文件
- `supabase/migrations/0009_frontend_only_auth.sql` — 关闭业务表与存储桶的 RLS
- `src/stores/user.ts` — 登录态存 localStorage（去掉 supabase.auth 依赖）
- `src/composables/useAuth.ts` — `signIn` 前端比对 `VITE_ADMIN_PASSWORD`
- `.env` / `.env.example` — 增加 `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD`

## 部署步骤
1. 在 Supabase Dashboard → SQL Editor 执行 `supabase/migrations/0009_frontend_only_auth.sql`（关闭 RLS）。
2. 确认 `.env` 里已配置管理员密码（`VITE_ADMIN_PASSWORD`）。当前值：`363935xhb`，账号邮箱 `super@test.com`（仅前端展示用）。
3. **重启 dev server**（`npm run dev`）让 `.env` 新变量生效。
4. 打开 `/admin/login`，用密码 `363935xhb` 登录。
5. 登录后即可在管理后台对 `parts` / `categories` / `custom_products` 做增删改查、上传图片。

## 工作原理
- 前端密码校验：`password === import.meta.env.VITE_ADMIN_PASSWORD`，通过后 `userStore.login()` 写入 localStorage。
- 路由守卫 `requiresAdmin` 看 `userStore.isAdmin`（= 已登录），未登录跳回登录页。
- 所有数据库读写用既有的 anon key 客户端（`src/api/supabase.ts`），因 RLS 已关闭，anon 即可全量操作。

## 想换密码
直接改 `.env` 的 `VITE_ADMIN_PASSWORD` 并重启 dev server 即可。

## 备注
- 之前探索过的「Edge Function 自定义 JWT」方案（`supabase/functions/auth-login/index.ts`、`scripts/set-admin-password.mjs`、`0008_custom_auth.sql`）在本方案下已不再需要，可保留作参考或删除。
- 旧的 Supabase Auth Custom Access Token Hook 可保持关闭（本项目不再走 Supabase Auth）。
