-- =============================================================
-- 修复登录报错: Database error querying schema
-- 现象: 输入正确账号密码后, Supabase 在生成登录令牌(JWT)阶段报错,
--       根因是后台启用的 "Custom Access Token Hook" 函数内部查询了
--       不存在的表/字段, 或该函数本身有 bug。
-- 说明: 本项目从未读取 JWT 里的自定义 claim (角色一律从 profiles 表读),
--       因此该 hook 对本项目是多余的, 可直接禁用 (见下方说明)。
-- =============================================================

-- -------------------------------------------------------------
-- 0) 诊断 (可选): 先看清楚线上到底挂了什么
--    在 SQL Editor 里单独跑下面两段, 确认触发器/hook 函数名称
-- -------------------------------------------------------------
-- 列出 auth.users 上的所有触发器
-- select tgname as trigger_name, pg_get_triggerdef(t.oid) as def
-- from pg_trigger t
-- join pg_class c on c.oid = t.tgrelid
-- where c.relname = 'users' and c.relnamespace = 'auth'::regnamespace
--   and not t.tgisinternal;

-- 列出名称里带 hook / token 的函数 (疑似 access token hook)
-- select n.nspname as schema, p.proname as function_name, pg_get_functiondef(p.oid) as def
-- from pg_proc p
-- join pg_namespace n on n.oid = p.pronamespace
-- where p.proname ilike '%hook%' or p.proname ilike '%access_token%' or p.proname ilike '%token%';

-- -------------------------------------------------------------
-- 1) 推荐修复: 创建一个正确的 hook 函数 (幂等, 可重复执行)
--    如果你希望在 JWT 里保留 user_role, 跑这段, 然后在后台把
--    "Custom Access Token" hook 指向 public.custom_access_token_hook
-- -------------------------------------------------------------
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims    jsonb := coalesce(event->'claims', '{}'::jsonb);
  user_role text;
begin
  -- 仅查询确实存在且当前用户一定拥有的行 (SECURITY DEFINER 由调用方保证)
  select role into user_role
  from public.profiles
  where id = (event->>'user_id')::uuid;

  if user_role is not null then
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  end if;

  return jsonb_set(event, '{claims}', claims);
end;
$$;

grant execute on function public.custom_access_token_hook(jsonb)
  to authenticated, anon, service_role;

-- -------------------------------------------------------------
-- 2) 或者: 如果你不需要 JWT 里的角色, 直接关掉 hook 即可 (无需跑 SQL)
--    Supabase 后台 -> Authentication -> Hooks -> 找到 "Custom Access Token"
--    把它关闭 / 设为 None。本项目不依赖它, 关掉登录立即恢复。
-- -------------------------------------------------------------
