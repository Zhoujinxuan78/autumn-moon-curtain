-- ============================================================
-- 精简诊断（兼容旧版 Supabase，跳过 postgres_logs）
-- 在 SQL Editor 中执行，重点看 ② 里 hook / handle_new_user 的真实定义。
-- ============================================================

-- ① auth schema 上的触发器
SELECT event_object_table, trigger_name, action_timing, event_manipulation, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
ORDER BY event_object_table;

-- ② 触发函数 / Hook 函数的定义（若返回 0 行说明函数名不同，用 ③ 找真名）
SELECT proname, pg_get_functiondef(oid) AS def
FROM pg_proc
WHERE proname IN ('handle_new_user', 'custom_access_token_hook');

-- ③ 兜底：列出 public 下所有函数，找 hook 到底叫什么
SELECT n.nspname AS schema, p.proname, pg_get_functiondef(p.oid) AS def
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND (p.proname LIKE '%hook%' OR p.proname LIKE '%user%' OR p.proname LIKE '%token%')
ORDER BY p.proname;
