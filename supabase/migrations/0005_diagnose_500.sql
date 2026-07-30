-- ============================================================
-- 登录 500 诊断脚本（对齐 Supabase 官方排查指南）
-- https://supabase.com/docs/guides/troubleshooting/resolving-500-status-authentication-errors
-- 用法：在 Supabase Dashboard → SQL Editor 中分段执行，重点看 ③ 的真实报错。
-- ============================================================

-- ① 列出 auth schema 上的所有触发器（登录 500 最常见的元凶）
SELECT event_object_table, trigger_name, action_timing, event_manipulation, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
ORDER BY event_object_table;

-- ② 查看触发函数 / Hook 函数的定义
SELECT proname, pg_get_functiondef(oid) AS def
FROM pg_proc
WHERE proname IN ('handle_new_user', 'custom_access_token_hook');

-- ③ 官方推荐：拉取 Auth 服务在数据库层遇到的真实错误（这才是 500 的真因）
SELECT
  cast(postgres_logs.timestamp AS datetime) AS timestamp,
  event_message,
  parsed.error_severity,
  parsed.user_name,
  parsed.query,
  parsed.detail,
  parsed.hint,
  parsed.sql_state_code
FROM postgres_logs
CROSS JOIN unnest(metadata) AS metadata
CROSS JOIN unnest(metadata.parsed) AS parsed
WHERE regexp_contains(parsed.error_severity, 'ERROR|FATAL|PANIC')
  AND regexp_contains(parsed.user_name, 'supabase_auth_admin')
ORDER BY timestamp DESC
LIMIT 100;

-- ============================================================
-- 诊断结论判定：
--   • 报错提到 relation "profiles" does not exist / handle_new_user → 触发器问题（见 0004 修复）
--   • 报错提到 access token hook / invalid claim / output claims do not conform → Hook 函数问题（见 0004 修复）
--   • 报错提到 must be owner of / 42501 → supabase_auth_admin 权限丢失，需联系 Support
--   • 报错提到 violates foreign key constraint / 23503 → 你给 auth.users 加了外键，需 DROP 或改 ON DELETE SET NULL
--
-- 修复请执行同目录下的 0004_fix_login_500.sql（幂等，可重复运行）。
-- 若仍 500：到 Dashboard → Authentication → Hooks 临时关闭 Custom Access Token Hook 以隔离问题。
-- ============================================================
