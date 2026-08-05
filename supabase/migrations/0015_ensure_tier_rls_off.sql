-- 0015: 确保档位表 RLS 关闭 + 为已有类别补默认三档
-- 背景：本项目前端用 anon key 直连 Supabase（0009 已关闭其余 app 表 RLS）。
--       若 0013 未完整执行，category_tiers 表的 RLS 仍为开启状态，
--       前端 anon 写入会被 42501 拦截，导致「分类管理里加档位保存不了」。
-- 本迁移自包含且幂等，可反复执行，也可单独在 SQL Editor 里粘贴运行：
--   * 表不存在则建（结构与 0013 一致）
--   * 强制 DISABLE RLS
--   * 为当前每个 category 补经济/标准/豪华三档（已存在则跳过）

-- 1) 表结构对齐 0013（幂等）
CREATE TABLE IF NOT EXISTS category_tiers (
  id          serial PRIMARY KEY,
  category_id int       NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  code        text      NOT NULL,
  name        text      NOT NULL,
  sort_order  int       NOT NULL DEFAULT 0,
  is_visible  boolean   NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, code)
);

-- 2) 核心修复：关闭 RLS（幂等，重跑无副作用）
ALTER TABLE category_tiers DISABLE ROW LEVEL SECURITY;

-- 3) 为已有类别补默认三档（ON CONFLICT 保证可重复执行）
INSERT INTO category_tiers (category_id, code, name, sort_order, is_visible)
SELECT id, 'economy',  '经济款', 1, true FROM categories
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO category_tiers (category_id, code, name, sort_order, is_visible)
SELECT id, 'standard', '标准款', 2, true FROM categories
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO category_tiers (category_id, code, name, sort_order, is_visible)
SELECT id, 'luxury',   '豪华款', 3, true FROM categories
ON CONFLICT (category_id, code) DO NOTHING;
