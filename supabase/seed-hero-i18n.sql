-- One-time repair for the CMS hero configuration.
-- Run in Supabase SQL Editor. It intentionally overwrites only hero_* values.
insert into public.config_groups (name, label, description, "order") values
  ('hero', 'Hero', 'Homepage hero content', 4)
on conflict (name) do nothing;

insert into public.config_items (group_id, key, value, label, type, "order")
select group_row.id, item.key, item.value::jsonb, item.label, 'json', item.sort_order
from public.config_groups group_row
cross join (
  values
    ('hero_badge', 'Hero badge', '{"value":"20+ Years of Experience","i18n":{"zh-HK":"20年專業經驗","zh-CN":"20年专业经验"}}', 1),
    ('hero_title', 'Hero title', '{"value":"Professional Renovation Services","i18n":{"zh-HK":"專業裝修服務","zh-CN":"专业装修服务"}}', 2),
    ('hero_subtitle', 'Hero subtitle', '{"value":"Complete renovation and design services for your ideal home","i18n":{"zh-HK":"為您打造理想家居，提供一站式裝修及設計服務","zh-CN":"为您打造理想家居，提供一站式装修及设计服务"}}', 3)
) as item(key, label, value, sort_order)
where group_row.name = 'hero'
on conflict (key) do update set
  value = excluded.value,
  label = excluded.label,
  type = excluded.type,
  "order" = excluded."order";
