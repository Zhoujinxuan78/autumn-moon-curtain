-- 案例增加「客户名」字段，支持前台按客户名模糊检索
-- 幂等：重复执行不报错
alter table if exists public.custom_products
  add column if not exists customer_name text;

comment on column public.custom_products.customer_name is '客户名称，用于案例列表的模糊检索（名称/地址/客户名）';

create index if not exists idx_custom_customer_name
  on public.custom_products (customer_name);
