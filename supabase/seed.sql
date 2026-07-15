-- Run after schema.sql (or after i18n-migration.sql for an existing database).
-- Safe to run again: default records are inserted only when missing and content
-- rows use fixed IDs for upserts.
insert into public.config_groups (name, label, description, "order") values
  ('company', 'Company', 'Company information', 1),
  ('site', 'Site', 'General website settings', 2),
  ('contact', 'Contact', 'Contact information', 3),
  ('hero', 'Hero', 'Homepage hero content', 4)
on conflict (name) do nothing;

insert into public.config_items (group_id, key, value, label, type, "order")
select groups.id, defaults.key, defaults.value::jsonb, defaults.label, defaults.config_type, defaults.sort_order
from (
  values
    ('company', 'company_name', '{"value":"Fung Chun Renovation Engineering Limited","i18n":{"zh-HK":"豐進裝修工程有限公司","zh-CN":"丰进装修工程有限公司"}}', 'Company name', 'text', 1),
    ('company', 'company_name_short', '{"value":"Fung Chun Renovation","i18n":{"zh-HK":"豐進裝修工程","zh-CN":"丰进装修工程"}}', 'Company short name', 'text', 2),
    ('site', 'site_title', '{"value":"Professional Renovation Services","i18n":{"zh-HK":"專業裝修服務","zh-CN":"专业装修服务"}}', 'Site title', 'text', 1),
    ('contact', 'whatsapp_number', '{"value":"85264798033"}', 'WhatsApp number', 'text', 1),
    ('hero', 'hero_badge', '{"value":"20+ Years of Experience","i18n":{"zh-HK":"20年專業經驗","zh-CN":"20年专业经验"}}', 'Hero badge', 'json', 1),
    ('hero', 'hero_title', '{"value":"Professional Renovation Services","i18n":{"zh-HK":"專業裝修服務","zh-CN":"专业装修服务"}}', 'Hero title', 'json', 2),
    ('hero', 'hero_subtitle', '{"value":"Complete renovation and design services for your ideal home","i18n":{"zh-HK":"為您打造理想家居，提供一站式裝修及設計服務","zh-CN":"为您打造理想家居，提供一站式装修及设计服务"}}', 'Hero subtitle', 'json', 3)
) as defaults(group_name, key, value, label, config_type, sort_order)
join public.config_groups groups on groups.name = defaults.group_name
on conflict (key) do nothing;

insert into public.calculator_pricing (
  id, "basePricePerSqft", "qualityMultipliers", "scopeMultipliers", "roomBaseCosts", "specialRequirementGroups", variance
) values (
  'pricing',
  '{"公屋":800,"居屋":1000,"私樓":1200,"村屋":900}'::jsonb,
  '{"基本":0.8,"標準":1,"豪華":1.5}'::jsonb,
  '{"全屋":1,"局部裝修":0.6}'::jsonb,
  '{"bedroom":15000,"livingRoom":25000,"kitchen":30000,"bathroom":20000}'::jsonb,
  '[
    {"id":"structure","name":"Structural changes","order":0,"items":[{"id":"remove-wall","name":"Remove wall","cost":5000,"order":0}]},
    {"id":"utilities","name":"Electrical and plumbing","order":1,"items":[{"id":"rewiring","name":"Full rewiring","cost":25000,"order":0}]}
  ]'::jsonb,
  0.2
) on conflict (id) do update set
  "basePricePerSqft" = excluded."basePricePerSqft", "qualityMultipliers" = excluded."qualityMultipliers",
  "scopeMultipliers" = excluded."scopeMultipliers", "roomBaseCosts" = excluded."roomBaseCosts",
  "specialRequirementGroups" = excluded."specialRequirementGroups", variance = excluded.variance;

insert into public.hero_stats (id, stats) values (
  'stats',
  '[
    {"icon":"Award","value":"20+","label":{"value":"Years of experience","i18n":{"zh-HK":"年專業經驗","zh-CN":"年专业经验"}}},
    {"icon":"Users","value":"500+","label":{"value":"Happy homeowners","i18n":{"zh-HK":"滿意業主","zh-CN":"满意业主"}}},
    {"icon":"CheckCircle","value":"100%","label":{"value":"Quality commitment","i18n":{"zh-HK":"品質承諾","zh-CN":"品质承诺"}}}
  ]'::jsonb
) on conflict (id) do update set stats = excluded.stats;

insert into public.services (id, icon, title, description, "order") values
  ('00000000-0000-4000-8000-000000000001', 'Home',
   '{"value":"Full-home renovation","i18n":{"zh-HK":"全屋裝修","zh-CN":"全屋装修"}}',
   '{"value":"End-to-end renovation from planning to completion.","i18n":{"zh-HK":"從設計到施工的一站式全屋裝修服務。","zh-CN":"从设计到施工的一站式全屋装修服务。"}}', 1),
  ('00000000-0000-4000-8000-000000000002', 'Paintbrush',
   '{"value":"Interior design","i18n":{"zh-HK":"室內設計","zh-CN":"室内设计"}}',
   '{"value":"Personalized spaces tailored to your lifestyle.","i18n":{"zh-HK":"按您的生活方式打造個人化空間。","zh-CN":"按您的生活方式打造个性化空间。"}}', 2)
on conflict (id) do update set title = excluded.title, description = excluded.description, icon = excluded.icon, "order" = excluded."order";

insert into public.testimonials (id, name, "propertyType", rating, comment, initials, "order") values
  ('00000000-0000-4000-8000-000000000011', 'Ms Wong', '公屋', 5,
   '{"value":"The team was professional, attentive and completed the work on time.","i18n":{"zh-HK":"師傅專業細心，並準時完成工程。","zh-CN":"师傅专业细心，并准时完成工程。"}}', 'W', 1)
on conflict (id) do update set comment = excluded.comment, rating = excluded.rating, "order" = excluded."order";

insert into public.portfolio (id, title, "propertyType", "budgetRange", style, "beforeImage", "afterImage", cost, description, "completedDate", "order") values
  ('00000000-0000-4000-8000-000000000021',
   '{"value":"Modern public-housing renovation","i18n":{"zh-HK":"現代簡約公屋裝修","zh-CN":"现代简约公屋装修"}}', '公屋',
   '{"value":"HK$300k–500k","i18n":{"zh-HK":"30–50萬港元","zh-CN":"30–50万港元"}}',
   '{"value":"Modern minimalism","i18n":{"zh-HK":"現代簡約","zh-CN":"现代简约"}}',
   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80', 400000,
   '{"value":"A compact home refreshed with custom storage and warm finishes.","i18n":{"zh-HK":"以訂造收納及溫暖材質翻新緊湊住宅。","zh-CN":"以定制收纳及温暖材质翻新紧凑住宅。"}}',
   '2026-01', 1)
on conflict (id) do update set title = excluded.title, "budgetRange" = excluded."budgetRange", style = excluded.style, description = excluded.description, "order" = excluded."order";
