-- ============================================================
-- 存储桶 anon 全量访问策略（图片上传/更新/删除需要）
-- 说明：storage.objects 归 supabase_storage_admin 所有，SQL Editor 无法 DISABLE RLS，
--       但可以 CREATE POLICY（建策略权限已授予 postgres）。本文件保持 RLS 开启，仅为 anon/service_role 放开全部操作。
-- 兼容旧版 Postgres：不使用 CREATE POLICY IF NOT EXISTS（PG15+ 才支持），改用 DROP POLICY IF EXISTS + CREATE POLICY。
-- 如果执行报错 "must be owner of table objects" (42501)，说明本实例未授予建策略权限，
--       请改用 Dashboard：Storage → curtain-assets → 设为 Public，并在 Policies 里为 anon 添加 insert/update/delete 策略。
-- ============================================================

-- 读（公开访问图片 URL 用）
drop policy if exists "anon storage select" on storage.objects;
create policy "anon storage select"
  on storage.objects for select
  to anon, service_role
  using ( bucket_id = 'curtain-assets' );

-- 写（后台上传图片）
drop policy if exists "anon storage insert" on storage.objects;
create policy "anon storage insert"
  on storage.objects for insert
  to anon, service_role
  with check ( bucket_id = 'curtain-assets' );

-- 改（替换图片）
drop policy if exists "anon storage update" on storage.objects;
create policy "anon storage update"
  on storage.objects for update
  to anon, service_role
  using ( bucket_id = 'curtain-assets' )
  with check ( bucket_id = 'curtain-assets' );

-- 删（删除图片）
drop policy if exists "anon storage delete" on storage.objects;
create policy "anon storage delete"
  on storage.objects for delete
  to anon, service_role
  using ( bucket_id = 'curtain-assets' );
