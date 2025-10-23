-- =============================================================
-- 0011 质量档位（全局档位 + 配件档位变体 + 成品选档）
-- 设计：同类配件(如罗马杆)区分质量档位(经济/标准/豪华)，
--       每个档位独立定价；客户定制成品时须选择具体档位。
-- 注意：本项目为前端直连 anon key 模式（0009 已关闭 app 表 RLS），
--       故新表同样不开启 RLS，保持一致的可访问性。
-- =============================================================

-- 1) 全局质量档位定义（全站统一）
create table if not exists public.tiers (
  code       text primary key,
  name       text not null,
  sort_order int  not null default 0,
  is_active  boolean not null default true,
  is_visible boolean not null default true
);

insert into public.tiers (code, name, sort_order) values
  ('economy',  '经济款', 1),
  ('standard', '标准款', 2),
  ('luxury',   '豪华款', 3)
on conflict (code) do nothing;

-- 2) 配件档位变体（每档独立价格/规格）
create table if not exists public.part_tiers (
  id           bigint      generated always as identity primary key,
  part_id      bigint      not null references public.parts(id) on delete cascade,
  tier_code    text        not null references public.tiers(code) on delete restrict,
  price        numeric(10,2),
  price_unit   text        default '个',
  specs        jsonb       not null default '{}'::jsonb,
  sort_order   int         not null default 0,
  is_published boolean     not null default true,
  created_at   timestamptz not null default now(),
  unique (part_id, tier_code)
);
create index if not exists idx_part_tiers_part on public.part_tiers(part_id);

-- 3) 成品-配件关联增加 tier_id（成品配置记录所选档位）
alter table public.product_parts_relation
  add column if not exists tier_id bigint
  references public.part_tiers(id) on delete cascade;
