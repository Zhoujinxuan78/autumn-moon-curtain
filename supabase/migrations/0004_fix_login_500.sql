-- 修复：登录报 Database error querying schema (500)
-- 背景：密码登录时 GoTrue 会 (a) UPDATE auth.users 刷新 last_sign_in_at，(b) 调用 custom_access_token_hook 生成 JWT。
-- 根因候选：on_auth_user_created 触发器可能在 UPDATE 时也触发 handle_new_user，而该函数引用了线上 profiles 缺失的列/坏函数 → 报错。
-- 本脚本幂等，可重复执行，不破坏数据。

-- 1) 修复 handle_new_user：只在 INSERT 时建 profile，忽略已存在/缺失列
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', ''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2) 重建触发器：只在 INSERT 触发（登录的 UPDATE 不再触发它）
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) 把 access token hook 改成文档标准纯透传（只返回 claims，不查任何表/不碰 RLS）
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
as $$
begin
  return jsonb_build_object('claims', coalesce(event->'claims', '{}'::jsonb));
end;
$$;
