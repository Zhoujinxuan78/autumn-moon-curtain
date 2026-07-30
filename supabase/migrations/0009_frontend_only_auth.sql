-- ============================================================
-- 私人项目：改为「前端密码登录 + 前端直连数据库」，关闭 RLS。
-- 说明：本项目已不再使用 Supabase Auth / 自定义 JWT。登录仅在前端校验一个密码，
--       数据库用 anon key 直连；关闭 RLS 后 anon 即可对业务表与存储桶做全量增删改查。
-- 安全提示：这意味着拿到 anon key（公开）即可操作全库——仅适合私人/内网项目。
-- ============================================================

-- 业务表关闭 RLS（这些表归 postgres 所有，SQL Editor 可直接操作）
alter table public.profiles disable row level security;
alter table public.categories disable row level security;
alter table public.parts disable row level security;
alter table public.custom_products disable row level security;
alter table public.product_parts_relation disable row level security;

-- 注意：storage.objects 归 supabase_storage_admin 所有，SQL Editor 角色无权限
-- DISABLE RLS，故存储桶访问请用 Dashboard 操作（见 CUSTOM_AUTH_SETUP.md 第 4 节）：
--   Storage → curtain-assets → 设为 Public，并在 Policies 里为 anon 添加
--   insert / update / delete 策略。不要在此用 SQL 操作 storage.objects。
