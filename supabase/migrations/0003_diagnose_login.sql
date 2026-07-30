-- ============================================================
-- 0003_diagnose_login.sql
-- 用于在 Supabase 后台 SQL Editor 运行，定位登录报错
-- "Database error querying schema" 的真实根因。
-- 把每段的结果都贴回来即可（报错也没关系，说明那部分不是原因）。
-- ============================================================

-- ① auth.users 上的所有触发器（登录会 UPDATE auth.users，触发 after update 触发器）
select t.tgname   as trigger_name,
       n.nspname  as table_schema,
       c.relname  as table_name,
       (case when t.tgtype & 2 = 2 then 'INSERT ' end ||
        case when t.tgtype & 4 = 4 then 'DELETE ' end ||
        case when t.tgtype & 8 = 8 then 'UPDATE ' end) as events,
       p.proname  as function_name
from pg_trigger t
join pg_class   c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
join pg_proc   p on p.oid = t.tgfoid
where n.nspname = 'auth'
  and c.relname = 'users'
  and not t.tgisinternal;

-- ② profiles 表真实结构（确认 role / sort_order 等列是否存在）
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name   = 'profiles'
order by ordinal_position;

-- ③ 单独确认 access token hook 函数是否存在、能否正常执行
--    （用一个真实 user id 模拟，不会改任何数据）
select public.custom_access_token_hook(
  jsonb_build_object(
    'user',   jsonb_build_object('id', (select id from auth.users limit 1)),
    'claims', '{}'::jsonb
  )
);

-- ④ 注意：老版本 Supabase 没有 auth.hooks 表，本段已省略。
