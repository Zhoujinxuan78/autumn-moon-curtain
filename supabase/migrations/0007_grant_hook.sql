-- 若选择保留 Custom Access Token Hook，给 auth 调用方显式授权（旧版 Supabase 常见缺这项）
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;

-- 同时复查 auth.users 上是否有外键约束（官方 500 第二大元凶，sql_state 23503）
select conname, confrelid::regclass AS referenced_table, pg_get_constraintdef(oid) AS def
from pg_constraint
where conrelid = 'auth.users'::regclass
  and contype = 'f';

-- 复查触发器当前到底在哪种事件上触发（应为 INSERT，不应含 UPDATE）
select tgname, tgtype,
       case when (tgtype::int & 4) > 0 then 'INSERT ' else '' end ||
       case when (tgtype::int & 8) > 0 then 'DELETE ' else '' end ||
       case when (tgtype::int & 16) > 0 then 'UPDATE ' else '' end as events
from pg_trigger
where tgrelid = 'auth.users'::regclass
  and not tgisinternal;
