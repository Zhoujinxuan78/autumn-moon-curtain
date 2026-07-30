-- =============================================================
-- 窗帘商品展示系统 —— 增强版初始化脚本 (已修正)
-- 核心变更：三级角色权限、分类启用/禁用、成品时间/地点、
--           成品-零件 N:M 关联、定时发布、精细化 RLS
-- 修正点：
--   1) 保留 is_admin() 便捷函数（= admin 或 super_admin），
--      同时保留 has_role(p_role) 精确判断，避免策略引用不存在的函数。
--   2) 修正 product_parts_relation 表名拼写。
--   3) custom_products 公开读取策略纳入 visible_date 定时发布判断。
--   4) 存储策略收敛到 curtain-assets 桶。
-- =============================================================

create extension if not exists "pgcrypto";

-- =============================================================
-- 1. profiles (用户信息与角色管理)
-- =============================================================
create table if not exists public.profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  avatar_url   text,
  -- 角色：super_admin > admin > user
  role         text        not null default 'user' check (role in ('super_admin', 'admin', 'user')),
  created_at   timestamptz not null default now()
);

-- 注册时自动建 profile（默认 user）
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name', 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- 精确角色判断
create or replace function public.has_role(p_role text)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = p_role);
$$;

-- 便捷函数：admin 或 super_admin 均可（供各处管理策略复用）
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
$$;

-- =============================================================
-- 2. categories (零件分类) - 增加启用/禁用
-- =============================================================
create table if not exists public.categories (
  id         bigint      generated always as identity primary key,
  name       text        not null,
  slug       text        not null unique,
  parent_id  bigint      references public.categories(id) on delete set null,
  sort_order int         not null default 0,
  is_active  boolean     not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_categories_parent on public.categories(parent_id);

-- =============================================================
-- 3. parts (零配件表)
-- =============================================================
create table if not exists public.parts (
  id           bigint      generated always as identity primary key,
  category_id  bigint      references public.categories(id) on delete set null,
  name         text        not null,
  description  text,
  image_url    text,
  gallery      jsonb       not null default '[]'::jsonb,
  specs        jsonb       not null default '{}'::jsonb,
  price        numeric(10,2),
  price_unit   text        default '个',
  sort_order   int         not null default 0,
  is_published boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_parts_category on public.parts(category_id);
create index if not exists idx_parts_published on public.parts(is_published);

-- 自动更新 updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists trg_parts_updated on public.parts;
create trigger trg_parts_updated before update on public.parts for each row execute function public.touch_updated_at();

-- =============================================================
-- 4. custom_products (客户定制成品)
-- =============================================================
create table if not exists public.custom_products (
  id           bigint      generated always as identity primary key,
  title        text        not null,
  description  text,
  cover_url     text,
  image_urls   jsonb       not null default '[]'::jsonb,
  is_published boolean     not null default true,
  visible_date timestamp with time zone,   -- 定时发布
  location     text,                        -- 地点信息
  created_by   uuid        references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_custom_published on public.custom_products(is_published);
create index if not exists idx_custom_created_by on public.custom_products(created_by);
create index if not exists idx_custom_visible_date on public.custom_products(visible_date);

drop trigger if exists trg_custom_updated on public.custom_products;
create trigger trg_custom_updated before update on public.custom_products for each row execute function public.touch_updated_at();

-- =============================================================
-- 5. product_parts_relation (成品与零件关联, N:M)
-- =============================================================
create table if not exists public.product_parts_relation (
  product_id bigint references public.custom_products(id) on delete cascade,
  part_id    bigint references public.parts(id) on delete cascade,
  quantity   int    default 1,
  primary key (product_id, part_id)
);

-- =============================================================
-- 6. RLS 策略
-- =============================================================
alter table public.profiles               enable row level security;
alter table public.categories             enable row level security;
alter table public.parts                  enable row level security;
alter table public.custom_products        enable row level security;
alter table public.product_parts_relation enable row level security;

-- 6.1 profiles
drop policy if exists "Profiles: read self or admin" on public.profiles;
create policy "Profiles: read self or admin" on public.profiles
  for select using (public.is_admin() or auth.uid() = id);
drop policy if exists "Profiles: update self" on public.profiles;
create policy "Profiles: update self" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Profiles: super_admin full control" on public.profiles;
create policy "Profiles: super_admin full control" on public.profiles
  for all using (public.has_role('super_admin')) with check (public.has_role('super_admin'));

-- 6.2 categories
drop policy if exists "Categories: read active or admin" on public.categories;
create policy "Categories: read active or admin" on public.categories
  for select using (is_active = true or public.is_admin());
drop policy if exists "Categories: admin full control" on public.categories;
create policy "Categories: admin full control" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- 6.3 parts
drop policy if exists "Parts: read published or admin" on public.parts;
create policy "Parts: read published or admin" on public.parts
  for select using (is_published = true or public.is_admin());
drop policy if exists "Parts: admin full control" on public.parts;
create policy "Parts: admin full control" on public.parts
  for all using (public.is_admin()) with check (public.is_admin());

-- 6.4 custom_products
-- 公开读取：已发布 且（无定时 或 已到发布时间）；管理员免审
drop policy if exists "Products: read published or admin" on public.custom_products;
create policy "Products: read published or admin" on public.custom_products
  for select using (
    (is_published = true and (visible_date is null or visible_date <= now()))
    or public.is_admin()
  );
drop policy if exists "Products: admin full control" on public.custom_products;
create policy "Products: admin full control" on public.custom_products
  for all using (public.is_admin()) with check (public.is_admin());
-- 创建者只能管理自己（注：当前未限制其自行发布/下架，如需限制可叠加 with check）
drop policy if exists "Products: creator manage own" on public.custom_products;
create policy "Products: creator manage own" on public.custom_products
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

-- 6.5 product_parts_relation
drop policy if exists "ProductParts: read all" on public.product_parts_relation;
create policy "ProductParts: read all" on public.product_parts_relation
  for select using (true);
drop policy if exists "ProductParts: admin manage" on public.product_parts_relation;
create policy "ProductParts: admin manage" on public.product_parts_relation
  for all using (public.is_admin()) with check (public.is_admin());

-- =============================================================
-- 7. 存储桶 curtain-assets
-- =============================================================
insert into storage.buckets (id, name, public)
values ('curtain-assets', 'curtain-assets', true)
on conflict (id) do nothing;

-- 所有人可读该桶资源
drop policy if exists "Curtain assets: public read" on storage.objects;
create policy "Curtain assets: public read" on storage.objects
  for select using (bucket_id = 'curtain-assets');
-- 仅管理员可写该桶
drop policy if exists "Curtain assets: admin write" on storage.objects;
create policy "Curtain assets: admin write" on storage.objects
  for all using (bucket_id = 'curtain-assets' and public.is_admin())
  with check (bucket_id = 'curtain-assets' and public.is_admin());
