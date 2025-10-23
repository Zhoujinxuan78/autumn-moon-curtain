-- 0013: 档位从「零件变体」重构为「类别档位」
-- 设计：档位挂在类别上（每个类别各自定义经济/标准/豪华等）；
--       零件只选一个档位作为质量标签，零件保留自身单价。
-- 本迁移自包含：即使之前跑过 0011/0012 也能清理旧表；若没跑过也安全。

-- 类别档位表
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

-- 本项目为前端直连 anon key 的私有项目（0009 已关闭其余 app 表 RLS），
-- 新表同样必须显式关闭 RLS，否则 anon 写入会被 42501 拦截。
-- DISABLE 是幂等的，重跑 0013 也无副作用。
ALTER TABLE category_tiers DISABLE ROW LEVEL SECURITY;

-- 零件归属单一档位（质量标签）
ALTER TABLE parts ADD COLUMN IF NOT EXISTS tier_id int REFERENCES category_tiers(id) ON DELETE SET NULL;

-- 清理旧方案残留（若曾跑过 0011 / 0012）
-- 注意顺序：必须先删 product_parts_relation.tier_id 列（其外键指向 part_tiers），
-- 否则直接删 part_tiers 表会因外键依赖报错 2BP01。
ALTER TABLE product_parts_relation DROP COLUMN IF EXISTS tier_id;
DROP TABLE IF EXISTS part_tiers;
DROP TABLE IF EXISTS tiers;

-- 为已有类别播种默认三档（经济款 / 标准款 / 豪华款）
INSERT INTO category_tiers (category_id, code, name, sort_order, is_visible)
SELECT id, 'economy', '经济款', 1, true FROM categories
ON CONFLICT (category_id, code) DO NOTHING;
INSERT INTO category_tiers (category_id, code, name, sort_order, is_visible)
SELECT id, 'standard', '标准款', 2, true FROM categories
ON CONFLICT (category_id, code) DO NOTHING;
INSERT INTO category_tiers (category_id, code, name, sort_order, is_visible)
SELECT id, 'luxury', '豪华款', 3, true FROM categories
ON CONFLICT (category_id, code) DO NOTHING;
