-- ============================================================
-- 自定义登录：在 profiles 上保存密码哈希（不再依赖 Supabase Auth）
-- 说明：本项目改为「前端登录 → Edge Function 校验 → 签发自定义 JWT」。
--       service_role / JWT 密钥只存在于服务端（Edge Function），前端不持有。
-- 用法：在 SQL Editor 执行本文件；密码哈希请用 scripts/set-admin-password.mjs 生成后单独执行。
-- ============================================================

-- 1) 密码哈希列（格式: pbkdf2$iterations$saltB64$hashB64）
alter table public.profiles add column if not exists password_hash text;

comment on column public.profiles.password_hash is
  'PBKDF2(SHA-256, 100k) 密码哈希，格式 pbkdf2$iterations$saltB64$hashB64；由 scripts/set-admin-password.mjs 生成';

-- 2) 确保管理员 profile 存在，并赋超级管理员角色（sub 即 profiles.id，RLS 的 auth.uid() 据此判定）
do $$
declare
  pid uuid;
begin
  select id into pid from public.profiles where lower(email) = 'super@test.com';
  if pid is null then
    insert into public.profiles (id, email, display_name, role)
    values (gen_random_uuid(), 'super@test.com', '管理员', 'super_admin')
    returning id into pid;
  else
    update public.profiles set role = 'super_admin' where id = pid;
  end if;
end $$;

-- 3) 旧的 Supabase Auth 触发器已无用（本项目不再走 auth.users 注册/登录流程）。
--    保留 on_auth_user_created 也无害，但为干净可选择性删除：
-- drop trigger if exists on_auth_user_created on auth.users;
