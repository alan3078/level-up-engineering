-- Run this only if your original schema has already been created with text columns.
-- Existing text becomes the en-US fallback. Translate it in the CMS afterwards.
create table if not exists public.locales (
  code text primary key check (code in ('en-US', 'zh-HK', 'zh-CN')),
  label text not null, enabled boolean not null default true, "order" integer not null default 0
);
insert into public.locales (code, label, "order") values
  ('en-US', 'English (US)', 1), ('zh-HK', '繁體中文（香港）', 2), ('zh-CN', '简体中文', 3)
on conflict (code) do nothing;
alter table public.locales enable row level security;
create policy "public read locales" on public.locales for select using (true);
create policy "authenticated manages locales" on public.locales for all to authenticated using (true) with check (true);

-- Standardize every CMS setting as an I18nField payload. Existing values become
-- the default `value`; add `i18n.zh-HK` and `i18n.zh-CN` in the admin settings.
update public.config_items
set value = jsonb_build_object('value', value)
where not (jsonb_typeof(value) = 'object' and value ? 'value');

alter table public.services
  alter column title type jsonb using jsonb_build_object('value', title),
  alter column description type jsonb using jsonb_build_object('value', description);
alter table public.testimonials
  alter column comment type jsonb using jsonb_build_object('value', comment);
alter table public.portfolio
  alter column title type jsonb using jsonb_build_object('value', title),
  alter column "budgetRange" type jsonb using jsonb_build_object('value', "budgetRange"),
  alter column style type jsonb using jsonb_build_object('value', style),
  alter column description type jsonb using jsonb_build_object('value', description);
